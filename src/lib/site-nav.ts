import type { HeaderLink } from "@/components/SiteHeader";

/**
 * The primary nav, in one place.
 *
 * Work, Services and Blog point at homepage sections rather than their own
 * pages. They were previously declared separately by all seven routes that
 * render a <SiteHeader>, and the copies had drifted: `about.tsx` already used
 * `/#work`-style hashes while `services/` and `projects/` still linked to full
 * pages, so the same nav item meant two different things depending on where
 * you were standing. Declaring them here makes one edit apply everywhere.
 *
 * About and Careers stay full pages. The homepage has no studio/team section,
 * so a hash for it would be a jump to nowhere; the bio and the roster only exist
 * on /about, and the open roles live on /careers. The `/projects` and
 * `/services` pages also stay — reachable from the cards inside each homepage
 * section and from the footer.
 *
 * The `id` of each section and the `hash` here must agree, or the jump lands
 * at the top of the page instead. Every target below sets `scroll-mt-24`, so
 * the sticky header does not cover the heading it scrolls to.
 */
type NavItem = { label: string; to: string; hash?: string };

const PRIMARY_NAV: NavItem[] = [
  { label: "Work", to: "/", hash: "work" },
  { label: "Services", to: "/", hash: "services" },
  { label: "Blog", to: "/", hash: "blog" },
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
];

/**
 * Nav for a route, with one item marked current. `currentLabel` is the label
 * of the item that leads here, or null for the homepage — every homepage
 * section is reached by jumping to `/`, so on `/` there is no single item
 * "you are on", and highlighting all three would be meaningless.
 */
export function siteNavLinks(currentLabel: string | null): HeaderLink[] {
  return PRIMARY_NAV.map((item) =>
    item.label === currentLabel ? { label: item.label, current: true } : item,
  );
}
