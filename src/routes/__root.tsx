import { type ReactNode } from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Footer } from "../components/Footer";
import { LenisProvider } from "../components/LenisProvider";
import { StructuredData } from "../components/StructuredData";
import { getOrganizationSchema, getWebSiteSchema } from "../lib/schema";
import { siteConfig } from "../lib/site-config";
import { NotFound } from "../components/NotFound";
import { ErrorFallback } from "../components/ErrorFallback";
import { CookieConsent } from "../components/CookieConsent";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteConfig.name },
      // ──────────────────────────────────────────────────────────────────────
      // SEARCH CONSOLE VERIFICATION
      // Google: https://search.google.com/search-console → property
      //   "https://www.skediodesign.in" → HTML tag method.
      // Token below supersedes an earlier one for this same property; only one
      // google-site-verification tag is effective per page, so they cannot
      // coexist. A Domain property (covers apex + all subdomains) is the more
      // robust route via DNS TXT — no code in HTML, survives host changes.
      // Bing: still pending — www.bing.com/webmasters → add site → Meta tag.
      // See docs/seo-verification.md for the alternative HTML-file method.
      // ──────────────────────────────────────────────────────────────────────
      { name: "google-site-verification", content: "eHTiHIwmus8DN3RISw3CUE3QGtYw2ttD-kyOd5WGDnA" },
      // Bing code not issued yet. Left commented out rather than shipping a
      // placeholder value into production HTML.
      // { name: "msvalidate.01", content: "PASTE_BING_CODE_HERE" },
    ],
    links: [
      // /skedio-logomark.png is deliberately NOT an icon: it is 278x275, and
      // favicons must be square. It still ships as the Organization logo in the
      // JSON-LD — see src/lib/schema.ts. Browsers use the vector SVG favicon;
      // the raster files below remain for Apple touch icons and the web app
      // manifest, where SVG support is not universal.
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/android-chrome-512x512.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "stylesheet", href: appCss },
    ],
    // Gates the `.js .sk-reveal-base { opacity: 0 }` start state so scroll
    // reveals are progressive enhancement — without JS nothing clears that
    // opacity and whole sections render blank. Declared through `head.scripts`
    // so TanStack applies the CSP nonce (ssr.nonce in src/router.tsx); a raw
    // inline <script> is blocked by `script-src 'self' 'nonce-…'`.
    scripts: [{ children: "document.documentElement.classList.add('js')" }],
  }),
  component: RootComponent,
  errorComponent: ErrorFallback,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Case-study pages are full-bleed, chrome-free documents. The /projects hub
  // itself is an ordinary editorial page, so it keeps the site header/footer.
  const isCaseStudy = pathname.startsWith("/projects") && !/^\/projects\/?$/.test(pathname);

  return (
    <LenisProvider>
      <RootDocument>
        <Outlet />
        {!isCaseStudy && <Footer />}
        <CookieConsent />
      </RootDocument>
    </LenisProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // `suppressHydrationWarning` because a blocking inline script in <head>
    // adds the `js` class to <html> before React hydrates (see the `scripts`
    // entry in head() above — it gates the scroll-reveal start state). The
    // server renders no class; the client finds one already applied. This is
    // the documented way to tell React the difference is intentional, and it is
    // scoped to this one element, so a real mismatch inside <body> still warns.
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <HeadContent />
        <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body>
        <a href="#main-content" className="sk-skip-link">
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
