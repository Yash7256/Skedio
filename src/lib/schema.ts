import { siteConfig } from "./site-config";
import { toAbsoluteUrl } from "./seo";
import { servicesData } from "../data/services";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: ["Skedio", "Skedio Design"],
    url: toAbsoluteUrl("/"),
    logo: `${siteConfig.url}/skedio-logomark.png`,
    image: `${siteConfig.url}/skedio-primary.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    sameAs: [siteConfig.socials.linkedin, siteConfig.socials.instagram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: siteConfig.email,
        telephone: siteConfig.phone,
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    founder: {
      "@type": "Person",
      name: "Aakash Choudhary",
      url: toAbsoluteUrl("/about"),
    },
    knowsAbout: servicesData.map((service) => service.shortTitle),
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.address.addressCountry,
    },
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: toAbsoluteUrl("/"),
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export interface ServiceSchemaInput {
  name?: string;
  title?: string;
  description?: string;
  definition?: string;
  url?: string;
  slug?: string;
  serviceType?: string;
  shortTitle?: string;
  deliverables?: Array<string | { title: string; description?: string }>;
}

export function getServiceSchema(service: ServiceSchemaInput) {
  const serviceName = service.name || service.title || "Design Service";
  const serviceDescription = service.description || service.definition || "";
  const serviceType = service.serviceType || service.shortTitle || serviceName;
  const servicePath = service.url || (service.slug ? `/services/${service.slug}` : "");
  // No slug and no url means there is no page to point at, so fall back to the
  // canonical root rather than the bare origin (see toAbsoluteUrl).
  const fullUrl = toAbsoluteUrl(servicePath || "/");

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    serviceType,
    description: serviceDescription,
    url: fullUrl,
    provider: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: toAbsoluteUrl("/"),
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    ...(service.deliverables && service.deliverables.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${serviceName} Deliverables`,
            itemListElement: service.deliverables.map((d, idx) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: typeof d === "string" ? d : d.title,
                ...(typeof d !== "string" && d.description ? { description: d.description } : {}),
              },
              position: idx + 1,
            })),
          },
        }
      : {}),
  };
}

export interface WebPageInput {
  /** Root-relative path, e.g. "/services/ui-ux-design". Must match canonical. */
  path: string;
  name: string;
  description: string;
  /** ISO date, when the content model has a real one. Never defaulted. */
  datePublished?: string;
  dateModified?: string;
}

export const WEBPAGE_FRAGMENT = "#webpage";

/**
 * Describes the page itself.
 *
 * Every indexable route should emit one. Without it the only WebPage node in
 * the site's graph was the anonymous one nested inside Article's
 * `mainEntityOfPage`, so a service or project page had no entity describing the
 * document — just the Service or CreativeWork hanging off it.
 *
 * The `@id` carries the `#webpage` fragment and `getArticleSchema`'s
 * `mainEntityOfPage` points at that same fragment, so an article page declares
 * its WebPage exactly once and the reference resolves to it rather than to a
 * second, unreferenced literal.
 */
export function getWebPageSchema(page: WebPageInput) {
  const url = absoluteUrl(page.path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}${WEBPAGE_FRAGMENT}`,
    url,
    name: page.name,
    description: page.description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    ...(page.datePublished ? { datePublished: page.datePublished } : {}),
    ...(page.dateModified ? { dateModified: page.dateModified } : {}),
    inLanguage: "en-IN",
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, idx) => {
      const fullUrl = toAbsoluteUrl(crumb.item || "/");

      return {
        "@type": "ListItem",
        position: idx + 1,
        name: crumb.name,
        item: fullUrl,
      };
    }),
  };
}

export interface FAQItem {
  question: string;
  answer: string;
  /** Folded into `text` below. See faqAnswerText. */
  bullets?: string[];
  /** Folded into `text` below. See faqAnswerText. */
  closing?: string;
}

/**
 * Flattens an FAQ into the single string schema.org's `Answer.text` accepts.
 *
 * The accordion can render `bullets` as real list items, but structured data has
 * no lists — `text` is one string. Dropping them would make the schema a strict
 * subset of the visible page, which is the worse failure: the markup would look
 * valid while quietly misrepresenting answers that are half length. Joining them
 * back in costs nothing and keeps the two in agreement.
 */
function faqAnswerText(faq: FAQItem): string {
  return [faq.answer, ...(faq.bullets ?? []), faq.closing]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faqAnswerText(faq),
      },
    })),
  };
}

export interface ItemListEntry {
  name: string;
  url: string;
}

function absoluteUrl(path: string): string {
  return toAbsoluteUrl(path);
}

export function getItemListSchema(name: string, entries: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: entry.name,
      url: absoluteUrl(entry.url),
    })),
  };
}

export function getContactPageSchema(path = "/contact") {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${absoluteUrl(path)}#contactpage`,
    url: absoluteUrl(path),
    name: `Contact ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} about UI/UX design, brand identity, website development, or marketing creatives.`,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  };
}

export interface CreativeWorkInput {
  name: string;
  headline: string;
  description: string;
  image?: string;
  url: string;
  /**
   * ISO-8601 date (YYYY-MM-DD) the work was first published.
   * Required, not optional: the Project content model already mandates
   * `publishedDate`, so making it optional here would only invite a
   * placeholder. An absent date is emitted as an absent property below
   * rather than a fabricated one.
   */
  datePublished: string;
  client?: string;
}

export function getCreativeWorkSchema(work: CreativeWorkInput) {
  const fullUrl = toAbsoluteUrl(work.url || "/");
  const fullImage = work.image ? toAbsoluteUrl(work.image) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    headline: work.headline,
    description: work.description,
    url: fullUrl,
    image: fullImage,
    // Omitted when empty rather than defaulted to a placeholder. A wrong
    // date is worse than no date: it asserts a publication time the work
    // never had, and this schema type has no dateModified to correct it.
    ...(work.datePublished ? { datePublished: work.datePublished } : {}),
    author: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    creator: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    provider: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
  };
}

export interface ArticleInput {
  title: string;
  description: string;
  /**
   * Root-relative path of the page this article is rendered on, e.g.
   * "/blog/my-post" or "/insights/my-article". Passed explicitly rather than
   * derived from a slug, because blog and insights posts share the same
   * builder and a hardcoded section produced self-contradicting URLs:
   * /blog/<slug> pages emitted url + mainEntityOfPage pointing at
   * /insights/<slug>, which 404s and disagrees with their own canonical.
   * Must match the canonical link and breadcrumb trail for the page.
   */
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  /**
   * Present in the insights content model; used for schema.org jobTitle and the
   * author portrait. Declared `| undefined` because the project enables
   * `exactOptionalPropertyTypes`, so a caller forwarding an absent `avatar`
   * cannot pass the key explicitly as undefined otherwise.
   */
  authorRole?: string | undefined;
  authorImage?: string | undefined;
  image?: string;
}

export function getArticleSchema(article: ArticleInput) {
  const url = absoluteUrl(article.path);
  const fullImage = toAbsoluteUrl(article.image || "/og.webp");

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    image: fullImage,
    author: {
      "@type": "Person",
      name: article.authorName || siteConfig.name,
      ...(article.authorRole ? { jobTitle: article.authorRole } : {}),
      ...(article.authorImage ? { image: toAbsoluteUrl(article.authorImage) } : {}),
      worksFor: {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
      },
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/skedio-logomark.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${url}${WEBPAGE_FRAGMENT}`,
    },
  };
}

export interface PersonInput {
  name: string;
  role?: string;
  image?: string;
  /** Absolute profile URLs, emitted as schema.org sameAs. */
  socials?: string[];
}

/**
 * Lives here rather than inline in routes/about.tsx so that no route can
 * hand-assemble a schema and reintroduce a second, divergent spelling of a
 * site URL — which is exactly what the previous inline version did
 * (`url: siteConfig.url` emitted the bare origin, and the image was built by
 * raw template concatenation).
 *
 * `worksFor` carries the Organization @id so the link resolves against the
 * Organization node __root.tsx already declares, instead of being a second,
 * unrelated Organization literal.
 */
export function getPersonSchema(person: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.role ? { jobTitle: person.role } : {}),
    ...(person.image ? { image: toAbsoluteUrl(person.image) } : {}),
    ...(person.socials?.length ? { sameAs: person.socials } : {}),
    worksFor: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: toAbsoluteUrl("/"),
    },
  };
}
