import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import type { Register } from "@tanstack/react-router";
import type { RequestHandler } from "@tanstack/react-start/server";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { generateSitemapXml } from "./lib/sitemap-generator";
import { generateRssFeedXml, type FeedSource } from "./lib/rss-generator";
import { getUmamiOverview, getUmamiTopPages, getUmamiTopReferrers } from "./lib/umami";
import { digestRangeLabel, sendDigestEmail } from "./lib/weekly-digest";
import { siteConfig } from "./lib/site-config";
import { runWithNonce } from "./lib/nonce-context";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * The one Content-Security-Policy for the app. Emitted here rather than in
 * vercel.json because the script nonce is generated per request; Vercel ships
 * no competing policy, so there is nothing to intersect with.
 *
 * Every third-party origin listed below is one the browser actually contacts;
 * anything absent was verified unused against the built bundle. Fonts are
 * self-hosted (`@fontsource-variable/montserrat` plus local Gilroy woff2), so
 * no Google Fonts origin appears here, and nothing emits a `data:` or `blob:`
 * URL, so neither is allowed in `img-src`/`font-src`.
 */
function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    // cloud.umami.is serves the analytics tag; the injected <script> is created
    // by JS and so carries no nonce, which is why the origin is allowed here.
    `script-src 'self' 'nonce-${nonce}' https://cloud.umami.is`,
    // 'unsafe-inline' is required for the React inline style attributes
    // (GSAP-driven transforms, responsive-image sizing) that cannot carry a
    // nonce; no stylesheet is fetched from a third party.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
    "font-src 'self'",
    // formsubmit.co is the contact form's fetch target. Umami posts to
    // cloud.umami.is by default; gateway.umami.is is kept for custom hosts.
    "connect-src 'self' https://formsubmit.co https://gateway.umami.is https://cloud.umami.is",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self' https://formsubmit.co",
    "upgrade-insecure-requests",
  ].join("; ");
}

async function handleWeeklyDigest(request: Request): Promise<Response> {
  // Only Vercel's cron scheduler (or a caller holding the same secret) may
  // invoke this. Vercel attaches the CRON_SECRET env var as
  // `Authorization: Bearer <value>`.
  const cronSecret = process.env["CRON_SECRET"];
  const authHeader = request.headers.get("authorization");
  if (!cronSecret) {
    console.warn("[weekly-digest] Rejected unauthorized cron invocation.");
    return new Response("Unauthorized", { status: 401 });
  }

  const expected = createHash("sha256").update(`Bearer ${cronSecret}`).digest();
  const supplied = createHash("sha256")
    .update(authHeader ?? "")
    .digest();
  if (!timingSafeEqual(expected, supplied)) {
    console.warn("[weekly-digest] Rejected unauthorized cron invocation.");
    return new Response("Unauthorized", { status: 401 });
  }

  const endAt = Date.now();
  const startAt = endAt - WEEK_MS;

  try {
    const [overview, topPages, topReferrers] = await Promise.all([
      getUmamiOverview({ startAt, endAt }),
      getUmamiTopPages({ startAt, endAt, limit: 8 }),
      getUmamiTopReferrers({ startAt, endAt, limit: 5 }),
    ]);

    const rangeLabel = digestRangeLabel(startAt, endAt);
    await sendDigestEmail({
      siteName: siteConfig.name,
      siteUrl: siteConfig.url,
      rangeLabel,
      overview,
      topPages,
      topReferrers,
    });
    console.log(
      `[weekly-digest] Sent weekly analytics digest for ${rangeLabel} (pageviews=${overview.pageviews}, visitors=${overview.visitors}).`,
    );
    return Response.json({
      ok: true,
      range: rangeLabel,
      pageviews: overview.pageviews,
      visitors: overview.visitors,
    });
  } catch (error) {
    console.error("[weekly-digest] Failed to send weekly analytics digest:", error);
    return new Response(JSON.stringify({ ok: false, error: "Digest failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

const handle = createStartHandler(defaultStreamHandler);

/**
 * Moved URLs: old path -> current path. Always exactly ONE hop.
 *
 * When a page changes address, add it here rather than chaining redirects.
 * Chains (old -> old2 -> old3 -> new) leak link equity at every hop, cost
 * crawl budget per hop, and each intermediate URL stays indexed until Google
 * has followed the whole chain. If a URL moves more than once, replace the
 * original entry's target with the final destination instead of appending a
 * second hop.
 *
 * 301 is deliberate: the resource has moved permanently. (The trailing-slash
 * normalizer below uses 308 instead, because that is a method-preserving
 * canonicalization of the *same* resource, not a move.)
 *
 * Anything added here must point at a route that returns 200; the redirect
 * verifier enforces that, along with the no-chains rule. The trailing-slash
 * spelling of a moved URL is matched by the lookup itself, so it stays a single
 * hop.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  // The standalone "Product Design" service was merged into "UI/UX Design",
  // which keeps the /services/ui-ux-design address. One hop, straight to the
  // surviving page -- no intermediate alias, so link equity crosses a single
  // redirect. The old page was indexed, so this is load-bearing for both
  // inbound links and its existing search ranking.
  "/services/product-design": "/services/ui-ux-design",
  // "Product Development" was renamed "Website Development" and now answers at
  // a slug that matches the service name.
  "/services/product-development": "/services/website-development",
};

function legacyRedirect(url: URL): Response | null {
  const destination =
    LEGACY_REDIRECTS[url.pathname] ??
    // Also match the trailing-slash form so "/services/product-design/" is a
    // single hop rather than a 308 to a path that then 301s. The map holds one
    // canonical spelling per moved URL; a crawler or a link that picked up the
    // slash must not pay two hops to reach it.
    (url.pathname.endsWith("/") ? LEGACY_REDIRECTS[url.pathname.replace(/\/+$/, "")] : undefined);
  if (!destination) return null;
  // Path+query, never an absolute URL echoing the request Host.
  return new Response(null, {
    status: 301,
    headers: { location: destination + url.search },
  });
}

/**
 * Trailing-slash normalization, issued as a 308 PERMANENT redirect.
 *
 * The router's `trailingSlash: "never"` default already sends "/about/" ->
 * "/about", but it builds that redirect through router-core's `redirect()`
 * helper, which hardcodes 307 (TEMPORARY) as its fallback status. 307 is the
 * wrong signal for canonicalization: Google will not consolidate the two URL
 * forms as reliably, keeps no guarantee the redirect survives, and may keep
 * spending crawl budget on the redirecting URL. RFC 7538 308 is the correct
 * code and is method- and body-preserving, so a POST still re-POSTs.
 *
 * Doing it here — before the router sees the request — is the only lever,
 * since the 307 default is inside a library with no option to override it.
 *
 * Location is emitted as a path+query rather than an absolute URL so the
 * response never echoes back the request's Host header, which would let a
 * forged Host produce an open-redirect. Only a non-root pathname ending in
 * "/" is touched; every other request falls through to the router untouched,
 * so normal routing behaviour is unchanged.
 */
function trailingSlashRedirect(url: URL): Response | null {
  const { pathname } = url;
  if (pathname === "/" || !pathname.endsWith("/")) return null;
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  return new Response(null, {
    status: 308,
    headers: { location: trimmed + url.search },
  });
}

/**
 * Marks a response as unindexable.
 *
 * `Disallow` in robots.txt is the primary gate for /api/ and /_serverFn/, but a
 * Disallowed URL is one a crawler never fetches — so it can never read a meta
 * robots tag on that URL either. The header is what actually guarantees
 * "not indexable" for anything that reaches these paths by another route: a
 * shared link, a crawler that ignores robots.txt, or a URL that was once
 * public. `follow` is intentionally NOT set, so no equity leaks from these
 * responses.
 */
function withNoIndex(response: Response): Response {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function pathnameOf(request: Request): string {
  return new URL(request.url).pathname;
}

/* -------------------- Post-build static assets --------------------- */

const PUBLIC_DIR = join(process.cwd(), ".output", "public");
const PUBLIC_DIR_EXISTS = existsSync(PUBLIC_DIR);

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};

/** Never served as a static asset: documents and anything dot-prefixed. */
function isServableAssetPath(pathname: string): boolean {
  const ext = extname(pathname).toLowerCase();
  if (!ext || ext === ".html" || ext === ".htm") return false;
  if (pathname.split("/").some((seg) => seg.startsWith("."))) return false;
  return true;
}

/**
 * Serves public files that Nitro's static manifest does not know about.
 *
 * `scripts/optimize-images.mjs` writes responsive variants and `.webp` twins
 * into the public dir AFTER Nitro has generated its public-asset manifest, so
 * the node-server preview answers 404 for every file the script creates. That
 * is not cosmetic: browsers choose an image from `srcset`, not from `src`, so a
 * missing candidate renders as a broken image even though the original is
 * present on disk. Local previews (and the rendering verifier) would therefore
 * show missing team photos, client logos and case-study art.
 *
 * A deployed build is unaffected — Vercel uploads the entire static directory,
 * so every variant is served from its CDN. This only backfills the gap locally.
 * On a preset without `.output/public` the directory probe fails and this is a
 * no-op, so production never reaches the filesystem.
 */
async function serveGeneratedAsset(url: URL): Promise<Response | null> {
  if (!PUBLIC_DIR_EXISTS || !isServableAssetPath(url.pathname)) return null;

  let target: string;
  try {
    target = normalize(join(PUBLIC_DIR, decodeURIComponent(url.pathname)));
  } catch {
    return null; // malformed percent-encoding
  }
  // Containment check: a decoded "../" must not escape the public dir.
  if (target !== PUBLIC_DIR && !target.startsWith(PUBLIC_DIR + sep)) return null;

  try {
    const info = await stat(target);
    if (!info.isFile()) return null;
    const body = await readFile(target);
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": CONTENT_TYPES[extname(target).toLowerCase()] ?? "application/octet-stream",
        "content-length": String(info.size),
        // Generated files keep a stable name for a given build, so they are
        // safe to cache briefly; hashed files under /assets match Nitro's own
        // immutable policy once the manifest has answered first.
        "cache-control": "public, max-age=3600",
      },
    });
  } catch {
    return null;
  }
}

function jsonError(status: number, message: string): Response {
  return withNoIndex(
    new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "content-type": "application/json; charset=utf-8" },
    }),
  );
}

/**
 * Machine-to-machine surfaces that must never be answered with an HTML
 * document. /api/ is short-circuited before the router runs, but /_serverFn/
 * has to reach the router first so that real server functions keep working —
 * so the check is repeated here purely to shape the ERROR response.
 */
function isMachinePath(pathname: string): boolean {
  return (
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname === "/_serverFn" ||
    pathname.startsWith("/_serverFn/")
  );
}

/**
 * A 5xx must never be an indexable page. Two reasons this is centralised:
 * the two throw sites below were building the response by hand, and an unknown
 * /_serverFn/<id> throws inside TanStack's serverFnHandler — which used to
 * surface as a full HTML "This page didn't load" page carrying no robots
 * directive at all.
 */
function errorResponse(status: number, pathname: string): Response {
  if (isMachinePath(pathname)) return jsonError(status, "Internal Server Error");
  return withNoIndex(
    new Response(renderErrorPage(), {
      status,
      headers: { "content-type": "text/html; charset=utf-8" },
    }),
  );
}

const fetchHandler: RequestHandler<Register> = async (request) => {
  try {
    const url = new URL(request.url);
    // Moved URLs first, so a relocated page never picks up a second hop.
    const moved = legacyRedirect(url);
    if (moved) return moved;

    const normalized = trailingSlashRedirect(url);
    if (normalized) return normalized;

    if (url.pathname === "/sitemap.xml") {
      return new Response(generateSitemapXml(), {
        status: 200,
        headers: {
          "content-type": "application/xml; charset=utf-8",
          "cache-control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }

    const feed = url.pathname.match(/^\/(blog|insights)\/feed\.xml$/);
    if (feed) {
      // Feeds are a syndication surface, not a search result. The correct
      // content-type already stops them being parsed as a page; noindex keeps
      // them out of the index while still letting crawlers follow the links
      // they contain. robots.txt and sitemap.xml are deliberately NOT
      // noindexed — a crawler has to be able to read both.
      return withNoIndex(
        new Response(generateRssFeedXml(feed[1] as FeedSource), {
          status: 200,
          headers: {
            "content-type": "application/rss+xml; charset=utf-8",
            "cache-control": "public, max-age=3600, s-maxage=86400",
          },
        }),
      );
    }

    if (url.pathname === "/api/cron/digest") {
      return withNoIndex(await handleWeeklyDigest(request));
    }

    // The whole /api/ namespace is closed to HTML. Without this, an unknown
    // path such as /api/anything falls through to the router and gets a full
    // server-rendered HTML app shell — the API surface would then be capable of
    // answering with a normal web page. Answering JSON here means a future
    // endpoint added under /api/ cannot accidentally become an indexable HTML
    // route even if it is wired up incorrectly.
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return jsonError(404, "Not Found");
    }

    // Anything the manifest missed but that exists in the public dir. Placed
    // after the explicit routes so sitemap.xml, feed.xml and /api/ keep their
    // own handlers, and before the router so a missing asset never turns into
    // a rendered HTML page.
    const generated = await serveGeneratedAsset(url);
    if (generated) return generated;

    const nonce = randomBytes(16).toString("base64");
    const response = await runWithNonce(nonce, async () => {
      const rendered = await handle(request);
      const headers = new Headers(rendered.headers);
      headers.set("content-security-policy", buildContentSecurityPolicy(nonce));
      // The nonce above is minted per request, so the document that carries it
      // must not outlive that request in ANY shared cache. An earlier revision
      // sent "/" as `public, max-age=0, s-maxage=60, stale-while-revalidate=300`,
      // which let the edge replay one response — and therefore one nonce — to
      // every visitor for up to 60s plus 300s of stale-while-revalidate. That
      // defeats the point of a per-request nonce: an attacker who observes the
      // cached copy holds a token that still validates for every other visitor
      // the edge serves from it. `no-store` also states the intent directly
      // instead of relying on the absence of s-maxage, so a later edit that
      // re-adds a shared directive cannot silently reintroduce the reuse.
      headers.set("cache-control", "private, no-store");
      return new Response(rendered.body, {
        status: rendered.status,
        statusText: rendered.statusText,
        headers,
      });
    });
    if (response.status < 500) return response;
    const captured = consumeLastCapturedError();
    if (captured === undefined) return response;
    console.error(captured);
    return errorResponse(response.status, url.pathname);
  } catch (error) {
    console.error(error);
    const captured = consumeLastCapturedError() ?? error;
    console.error(captured);
    return errorResponse(500, pathnameOf(request));
  }
};

export type ServerEntry = { fetch: RequestHandler<Register> };

export function createServerEntry(entry: ServerEntry): ServerEntry {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    },
  };
}

export default createServerEntry({
  fetch: (request: Request) => fetchHandler(request),
});
