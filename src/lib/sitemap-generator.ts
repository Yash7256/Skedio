import { siteConfig } from "./site-config";
import { projects } from "../data/projects";
import { servicesData } from "../data/services";
import { blogPosts } from "../data/blog";
import { insightsArticles } from "../data/insights";

/**
 * URL convention: NO trailing slash, except the site root which is exactly
 * siteConfig.url + "/". This is enforced by a 308 PERMANENT redirect in
 * src/server.ts (trailingSlashRedirect), which turns "/about/" into "/about"
 * before the router sees it. It must be mirrored here or crawlers see two URL
 * forms per page.
 *
 * Keep every <loc> byte-identical to the page's own <link rel="canonical">,
 * which lib/seo.ts builds the same way.
 *
 * <lastmod> is emitted ONLY where the content model carries a real
 * content-modified date (publishedAt / publishedDate / datePublished). It is
 * deliberately omitted elsewhere rather than filled with today's date: a
 * <lastmod> rewritten on every build is one Google cannot trust, and a
 * sitemap full of them teaches crawlers to ignore the field. <lastmod> is
 * optional per the sitemaps.org spec, so omitting it is valid and strictly
 * more honest than a fabricated date.
 *
 * <changefreq> and <priority> are retained because they are valid per spec,
 * though Google has stated publicly that it ignores both. They are inert.
 */

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: string;
  /** W3C date (YYYY-MM-DD) of the last significant content change. */
  lastmod?: string;
}

/**
 * Escapes the five XML predefined entities. Every slug in the content model is
 * plain ASCII today, but this document is generated per request from that data,
 * so a future slug containing "&" would otherwise produce malformed XML and
 * the whole sitemap would fail to parse. "&" must be replaced first.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateSitemapXml(): string {
  const staticRoutes: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/services", changefreq: "monthly", priority: "0.9" },
    { path: "/projects", changefreq: "weekly", priority: "0.9" },
    { path: "/about", changefreq: "monthly", priority: "0.8" },
    { path: "/careers", changefreq: "monthly", priority: "0.7" },
    { path: "/insights", changefreq: "weekly", priority: "0.8" },
    { path: "/blog", changefreq: "weekly", priority: "0.8" },
    { path: "/contact", changefreq: "monthly", priority: "0.9" },
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
  ];

  const serviceRoutes: SitemapEntry[] = servicesData.map((s) => ({
    path: `/services/${s.slug}`,
    changefreq: "monthly",
    priority: "0.9",
  }));

  // Only entries that exist AND are published, mirroring the
  // `throw notFound()` gate in routes/projects/$slug.tsx so the sitemap can
  // never advertise a URL that returns 404.
  const projectRoutes: SitemapEntry[] = projects
    .filter((p) => p.published)
    .map((p) => ({
      path: `/projects/${p.slug}`,
      changefreq: "monthly",
      priority: "0.9",
      lastmod: p.publishedDate,
    }));

  const insightRoutes: SitemapEntry[] = insightsArticles.map((i) => ({
    path: `/insights/${i.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: i.datePublished,
  }));

  const blogRoutes: SitemapEntry[] = blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: p.publishedAt,
  }));

  const allEntries: SitemapEntry[] = [
    ...staticRoutes,
    ...serviceRoutes,
    ...projectRoutes,
    ...insightRoutes,
    ...blogRoutes,
  ];

  const body = allEntries
    .map((e) => {
      const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
      return `  <url>
    <loc>${escapeXml(siteConfig.url + e.path)}</loc>${lastmod}
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
