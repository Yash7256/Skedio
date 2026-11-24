export const siteConfig = {
  name: "Skédio",
  legalName: "Skédio Creative Studio",
  /**
   * Canonical ORIGIN, used as a concatenation PREFIX — it deliberately carries
   * no trailing slash so that `${siteConfig.url}${"/about"}` yields
   * "https://www.skediodesign.in/about" and not a double slash.
   *
   * It is therefore NOT itself a page URL. The canonical root page URL is
   * "https://www.skediodesign.in/" (WITH the slash), and the one canonical
   * format for the whole site is:
   *
   *   root      -> https://www.skediodesign.in/     (trailing slash)
   *   non-root  -> https://www.skediodesign.in/about  (no trailing slash)
   *
   * Never hand-write a page URL from this field. Use toAbsoluteUrl() in
   * lib/seo.ts, which is the single builder for canonical, og:url, JSON-LD and
   * any other absolute URL, and which applies the root rule above.
   *
   * MUST be the "www" host: the apex https://skediodesign.in 301-redirects to
   * https://www.skediodesign.in/ (vercel.json), so pointing this at the bare
   * apex would make every canonical, og:url, sitemap entry and JSON-LD URL a
   * redirect.
   *
   * No MX record exists for this domain, so siteConfig.email is deliberately a
   * Gmail address rather than hello@skediodesign.in.
   */
  url: "https://www.skediodesign.in",
  ogImage: "/og.webp",
  /**
   * Intrinsic pixel size of the file named above, MEASURED rather than assumed
   * (`sharp` metadata reports 3750x1969 for og.webp).
   *
   * og:image:width/height let a crawler lay out the card before it fetches the
   * image, so it is a layout hint — a wrong value shifts or crops the preview
   * on the surface that renders it. They therefore live beside the asset path
   * rather than as literals in seo.ts, so replacing og.webp means replacing its
   * dimensions in the same edit. Re-measure with:
   *   node -e "require('sharp')('public/og.webp').metadata().then(m=>console.log(m.width,m.height))"
   *
   * og.webp is 3750x1969, the same ~1.905:1 ratio as the 1200x630 card it
   * replaces, so crawlers lay out identically. og-default.png (1200x630) is
   * kept in public/ as the raster fallback for scrapers that cannot decode
   * WebP — notably Facebook, which does not support WebP in og:image.
   *
   * A route with a different card passes imageWidth/imageHeight to seo().
   */
  ogImageWidth: 3750,
  ogImageHeight: 1969,
  /** BCP-47 tag for og:locale. India-based studio, English-language site. */
  locale: "en_IN",
  description:
    "Skédio is a creative studio crafting bold brands, beautiful experiences and digital products that help businesses grow.",
  email: "skediodesignspace@gmail.com",
  phone: "+91 97709 57780",
  /**
   * The studio's single published response-time promise.
   *
   * Referenced by the homepage hero, /contact (4x), ContactModal, the FAQ
   * answer, the /contact meta description and llms.txt. It was previously
   * written out by hand in each of those places and had drifted into three
   * conflicting numbers — "36 hours" on the homepage hero, "24 hours" on
   * /contact, and "one to two business days" in the FAQ — so the copy now
   * interpolates this instead.
   *
   * Update the promise here and every surface follows.
   */
  responseTime: "24 hours",
  socials: {
    // Verified studio profiles. `/company/skedio` and `skedio.studio` belong to
    // unrelated businesses; there is no studio Behance profile to link.
    linkedin: "https://www.linkedin.com/company/skediocreativestudio",
    instagram: "https://www.instagram.com/the.skedio/",
  },
  themeColor: "#8537F4",
  address: {
    addressCountry: "IN",
  },
};

export type SiteConfig = typeof siteConfig;
