export type ProjectCategory = "UI/UX" | "Branding" | "Social Media" | "Development";
export type ProjectTagColor = "purple" | "orange" | "teal";
export type ProjectCellSize = "hero" | "wide" | "normal";

/*
 * The single source of truth for portfolio projects. One entry per project:
 * full case-study metadata (used by the /projects/[slug] route) plus the
 * bento-grid fields (category, tagColor, size) the SelectedWork section
 * renders from. `published` gates the case-study page — set false until the
 * writeup exists so the route returns a 404 instead of a half-built page.
 */
export interface ProjectSummary {
  slug: string;
  name: string;
  line: string;
  tag: string;
  cover: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  /**
   * Intrinsic size of `ogImage`, emitted as og:image:width/height by seo().
   * Set ONLY when ogImage is not /og.webp — omitting them falls back to
   * the measured default (1200x630), which is a lie for every other card.
   * Both or neither: a width without its height makes a crawler lay the card
   * out at the wrong aspect ratio.
   */
  ogImageWidth?: number;
  ogImageHeight?: number;
  themeColor: string;
  year: string;
  platform: string;
  discipline: string;
  scope: string;
  publishedDate: string;
  client: string;
  summary: string;
  services: string[];
  /*
   * Slugs from `servicesData` this project demonstrates, ordered most-relevant
   * first. This is the join key for the service <-> project link graph: the
   * service page renders `getProjectsForService(slug)` and the case study
   * renders the reciprocal links. Keep it in sync with `services` above, which
   * holds the human-readable labels (and may mention work with no dedicated
   * service page, e.g. "Art Direction" or "Design System").
   */
  serviceSlugs: string[];
  category: ProjectCategory;
  tagColor: ProjectTagColor;
  size: ProjectCellSize;
  published: boolean;
  /*
   * Optional one-line result of the work, shown on the homepage card under
   * the title. Leave unset when there is no outcome worth claiming — the
   * card then renders exactly as it did before this field existed.
   */
  outcome?: string;
}

export const projects: ProjectSummary[] = [
  {
    slug: "haocabs",
    name: "HAO Cabs",
    line: "A Taxi Bidding Experience App",
    tag: "UI/UX",
    cover: "/HaoCabs/cover.png",
    metaTitle: "HAO Cabs — Taxi Bidding Experience App & UI/UX Case Study | Skédio",
    metaDescription:
      "Explore how Skédio designed HAO Cabs — a real-time taxi bidding and ride-booking mobile application connecting passengers and drivers seamlessly.",
    ogImage: "/HaoCabs/1.jpg",
    // Measured from the file (sharp), not assumed: this card is a 6000px
    // original, not a 1200x630 one.
    ogImageWidth: 6000,
    ogImageHeight: 3375,
    themeColor: "#FFC400",
    year: "2026",
    platform: "Mobile App (iOS & Android)",
    discipline: "UI/UX Design & Strategy",
    scope: "UI/UX, Flow Architecture, Design System",
    publishedDate: "2026-01-15",
    client: "HAO Mobility",
    summary:
      "A modern taxi-bidding platform where riders compare driver bids in real time and choose the ride that best fits their budget and schedule.",
    services: ["Visual Design", "UI/UX Design"],
    serviceSlugs: ["ui-ux-design"],
    category: "UI/UX",
    tagColor: "purple",
    size: "hero",
    published: true,
  },
  {
    slug: "edios",
    name: "EDIOS",
    line: "video production studio",
    tag: "Brand Identity, Art Direction",
    cover: "/EDIOS/1.jpg",
    metaTitle: "EDIOS — Video Production Studio Brand Identity | Skédio",
    metaDescription: "Brand identity and art direction for EDIOS, a video production studio.",
    ogImage: "/EDIOS/1.jpg",
    ogImageWidth: 1920,
    ogImageHeight: 1080,
    themeColor: "#b61318",
    year: "2026",
    platform: "Brand Identity System",
    discipline: "Branding & Identity",
    scope: "Identity Design, Art Direction, Brand Guidelines",
    publishedDate: "2026-02-10",
    client: "EDIOS",
    summary: "A bold visual identity for EDIOS, a video production studio.",
    services: ["Brand Identity", "Art Direction"],
    serviceSlugs: ["brand-identity"],
    category: "Branding",
    tagColor: "orange",
    size: "normal",
    published: true,
  },
  {
    slug: "tiffinly",
    name: "Tiffinly",
    line: "Multi-role Food Subscription & Delivery Platform",
    tag: "UI/UX, Multi-role",
    cover: "/tiffinly/1.jpg",
    metaTitle: "Tiffinly — Multi-role Food Subscription & Delivery Platform | Skédio",
    metaDescription:
      "Explore how Skédio designed Tiffinly — a multi-role food subscription and delivery platform connecting customers, tiffin providers, and delivery partners through a single ecosystem.",
    ogImage: "/tiffinly/1.jpg",
    ogImageWidth: 1600,
    ogImageHeight: 1067,
    themeColor: "#EA7B26",
    year: "2026",
    platform: "Mobile Apps (Customer · Provider · Delivery)",
    discipline: "UI/UX Design & Strategy",
    scope: "Multi-role UI/UX, Flow Architecture, Design System",
    publishedDate: "2026-09-24",
    client: "Tiffinly",
    summary:
      "A multi-role food subscription platform connecting customers, tiffin providers, and delivery partners through three unified mobile experiences.",
    services: ["UI/UX Design", "Design System"],
    serviceSlugs: ["ui-ux-design"],
    category: "UI/UX",
    tagColor: "teal",
    size: "wide",
    published: true,
  },
  {
    slug: "zedhealth",
    name: "ZedHealth Administration",
    line: "Healthcare Administration Website",
    tag: "UI/UX, Web Development",
    cover: "/ZedHealth/1.jpg",
    metaTitle: "ZedHealth Administration — Website Design & Development | Skédio",
    metaDescription:
      "Explore how Skédio designed and developed a clear, trust-led website for ZedHealth Administration, a healthcare TPA serving corporates and individuals in Zambia.",
    ogImage: "/ZedHealth/1.jpg",
    ogImageWidth: 1418,
    ogImageHeight: 1109,
    themeColor: "#05502E",
    year: "2026",
    platform: "Responsive Website",
    discipline: "UI/UX Design & Web Development",
    scope: "Website Design, Front-end Development, Responsive QA",
    publishedDate: "2026-11-02",
    client: "ZedHealth Administration",
    summary:
      "A clear, trust-led website for ZedHealth Administration, positioning its healthcare administration and care-coordination services for corporates and individuals in Zambia.",
    services: ["UI/UX Design", "Website Development"],
    serviceSlugs: ["ui-ux-design", "website-development"],
    category: "Development",
    tagColor: "teal",
    size: "normal",
    published: true,
  },
  {
    slug: "postfolio",
    name: "Postfolio",
    line: "A Visual Collection",
    tag: "Visual Gallery",
    cover: "/Postfolio/coverimage.jpeg",
    metaTitle: "Postfolio — A Visual Collection | Skédio",
    metaDescription:
      "Browse Postfolio, an image-led collection of creative work from Skédio, presented as a clean visual gallery.",
    ogImage: "/Postfolio/coverimage.jpeg",
    ogImageWidth: 1024,
    ogImageHeight: 768,
    themeColor: "#8537F4",
    year: "2026",
    platform: "Visual Gallery",
    discipline: "Marketing Creatives & Social Media Design",
    scope: "Art Direction, Visual Design",
    publishedDate: "2026-11-20",
    client: "Postfolio",
    summary:
      "An image-led collection of creative work, presented as a clean, full-width visual gallery.",
    services: ["Visual Design", "Marketing Creatives"],
    serviceSlugs: ["marketing-creatives"],
    category: "Social Media",
    tagColor: "purple",
    size: "wide",
    published: true,
  },
];

/* Bento grid shape used by the SelectedWork section — derived from projects. */
export interface SelectedWorkItem {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  tagColor: ProjectTagColor;
  image: string;
  size: ProjectCellSize;
  outcome?: string;
}

/*
 * Homepage grid order. On mobile the bento is a 2-column grid where the hero
 * and wide cells span both columns, so the two single cells (EDIOS, ZedHealth)
 * must be adjacent in the rendered list to share a row between the full-width
 * cards. Ordering lives here, not in `projects`, because the /projects hub and
 * the services page keep the data-file order for their own listings.
 */
const homepageOrder = ["haocabs", "edios", "zedhealth", "tiffinly", "postfolio"];

const homepageRank = (project: ProjectSummary) => {
  const rank = homepageOrder.indexOf(project.slug);
  return rank === -1 ? homepageOrder.length : rank;
};

export const selectedWork: SelectedWorkItem[] = [...projects]
  .sort((a, b) => homepageRank(a) - homepageRank(b))
  .map((p) => ({
    slug: p.slug,
    title: p.name,
    subtitle: p.line,
    category: p.category,
    tagColor: p.tagColor,
    image: p.cover,
    size: p.size,
    // Spread rather than `outcome: p.outcome` so an unset field stays absent
    // from the item (exactOptionalPropertyTypes rejects an explicit undefined).
    ...(p.outcome ? { outcome: p.outcome } : {}),
  }));

export function getProjectBySlug(slug: string): ProjectSummary | undefined {
  return projects.find((p) => p.slug === slug);
}

/*
 * Published case studies that demonstrate a given service. Drives the
 * service -> project links that close the internal-link loop, and lets a
 * service page prove the capability with real work instead of asserting it.
 * Sorted by publish date (newest first) so newly shipped work surfaces
 * without reordering the hubs.
 */
export function getProjectsForService(serviceSlug: string): ProjectSummary[] {
  return projects
    .filter((p) => p.published && p.serviceSlugs.includes(serviceSlug))
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));
}
