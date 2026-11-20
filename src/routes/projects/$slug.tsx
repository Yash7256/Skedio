import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import {
  Fragment,
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

import { getProjectBySlug } from "@/data/projects";
import { getServicesBySlugs } from "@/data/services";
// Types only — erased at compile time. The value (`getCaseStudy`) is loaded
// inside the loader so this 911-line data module stays out of the client
// entry chunk; see the loader below.
import type { CaseStudyDocument, CaseStudySection, ImageRef } from "@/data/case-studies";
import { loadScrollTrigger } from "@/lib/animation-loader";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { useSmoothScroll } from "@/lib/smooth-scroll";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  getBreadcrumbSchema,
  getCreativeWorkSchema,
  getWebPageSchema,
  type BreadcrumbItem,
} from "@/lib/schema";
import { WebpImage } from "@/components/WebpImage";

// Route-scoped stylesheet: loaded via `?url` + this route's `head()` links
// instead of a static `import "./case-study.css"`. A static import would put
// the CSS in the module graph reachable from routeTree.gen.ts (which
// statically imports every route), so Rolldown hoists it into the shared
// entry CSS chunk attributed to `__root__` — i.e. render-blocking on EVERY
// page (homepage included). Via head links it is requested only when this
// route renders (SSR <head> keeps it render-blocking where required, so no
// FOUC on direct visits).
import caseStudyCss from "./case-study.css?url";

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = getProjectBySlug(params.slug);
    if (!project || !project.published) throw notFound();
    // 22 KB of case-study copy, used by this loader and nowhere else. Same
    // reason as the `marked` import in routes/blog/$slug.tsx: routeTree.gen.ts
    // statically imports every route module, so a static import would ship
    // this to every visitor of every route. Kept after the 404 check above so
    // an unknown slug never pays for the fetch.
    const { getCaseStudy } = await import("@/data/case-studies");
    const caseStudy = getCaseStudy(params.slug);
    if (!caseStudy) throw notFound();
    return { project, slug: params.slug, caseStudy };
  },
  head: ({ loaderData }) => {
    const project = loaderData?.project;
    if (!project) {
      return {
        meta: seo({
          title: "Case Study Not Found | Skédio Design Studio",
          description: "The requested project case study could not be found.",
          noindex: true,
        }),
      };
    }

    return {
      meta: seo({
        title: project.metaTitle,
        description: project.metaDescription,
        image: project.ogImage,
        // Conditional spread rather than `imageWidth: project.ogImageWidth`:
        // this project sets exactOptionalPropertyTypes, which forbids an
        // explicit undefined. Entries that keep the default card pass neither,
        // so seo() falls back to the measured 1200x630.
        ...(project.ogImageWidth && project.ogImageHeight
          ? { imageWidth: project.ogImageWidth, imageHeight: project.ogImageHeight }
          : {}),
        url: `/projects/${project.slug}`,
        themeColor: project.themeColor,
        type: "article",
        publishedTime: project.publishedDate,
      }),
      links: [
        ...canonicalLink(`/projects/${project.slug}`),
        { rel: "stylesheet", href: caseStudyCss },
      ],
    };
  },
  component: CaseStudy,
  notFoundComponent: CaseStudyNotFound,
});

function CaseStudyNotFound() {
  return (
    <main
      id="main-content"
      className="cs"
      style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "40px" }}
    >
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <h1 className="cs-display" style={{ fontSize: "clamp(48px, 8vw, 80px)", marginBottom: 16 }}>
          Case Study Not Found
        </h1>
        <p className="cs-lede" style={{ margin: "0 auto 32px" }}>
          The requested project case study could not be located.
        </p>
        <Link
          to="/"
          className="cs-nav__link"
          style={{
            display: "inline-flex",
            padding: "12px 24px",
            background: "var(--cs-black)",
            color: "var(--cs-white)",
            borderRadius: 999,
          }}
        >
          <ArrowLeft size={16} /> RETURN TO PORTFOLIO
        </Link>
      </div>
    </main>
  );
}

/* ------------------------- Image & Text Primitives --------------------- */

/**
 * Responsive candidates for case-study images that have managed variants on
 * disk (regenerated every build by scripts/optimize-images.mjs, so the URLs
 * below always exist — never add an entry here without a matching
 * RESPONSIVE_VARIANTS record, or the browser would hit a 404 with no
 * cross-candidate fallback). Images without an entry keep the previous
 * single-src behavior. `fullW` is the post-build intrinsic width (the build
 * caps the longest side at 1600px), included so high-DPR/large renderings
 * never regress in quality.
 */
const MANAGED_VARIANTS: Record<
  string,
  { widths: number[]; formats: Array<"webp" | "jpg">; sizes: string; fullW: number }
> = {
  "/tiffinly/1": {
    widths: [480, 800, 1200],
    formats: ["webp", "jpg"],
    sizes: "(max-width: 768px) calc(100vw - 32px), 1200px",
    fullW: 1600,
  },
  "/EDIOS/1": {
    widths: [480, 800],
    formats: ["webp", "jpg"],
    sizes: "(max-width: 768px) calc(100vw - 32px), 800px",
    fullW: 1600,
  },
  "/HaoCabs/cover": {
    widths: [480, 720],
    formats: ["webp"],
    sizes: "(max-width: 768px) calc(100vw - 32px), 720px",
    fullW: 941,
  },
  // The case-study cover art (LCP image). .cs-cover__art caps at 1500px with
  // clamp(16px, 4vw, 40px) padding on each side, hence the 1420px desktop slot.
  "/HaoCabs/1": {
    widths: [480, 800, 1200],
    formats: ["webp", "jpg"],
    sizes: "(max-width: 768px) calc(100vw - 32px), 1420px",
    fullW: 1600,
  },
};

function CsImage({
  image,
  assets,
  className,
  loading = "lazy",
  fetchPriority,
}: {
  image: ImageRef;
  assets: string;
  className?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}) {
  const dims =
    image.width != null && image.height != null ? { width: image.width, height: image.height } : {};
  const managed = MANAGED_VARIANTS[`${assets}/${image.name}`];
  const base = `${assets}/${image.name}`;
  const src = `${base}.${image.ext ?? "jpg"}`;
  // Extension of the fallback original: managed entries mirror the formats
  // the build emits (jpg originals have jpg variants; the png cover only
  // has webp variants, so its <img> keeps the single src as before).
  const fallbackExt = managed?.formats.includes("jpg") ? "jpg" : null;
  const webpSrcSet = managed
    ? [
        ...managed.widths.map((w) => `${base}-${w}.webp ${w}w`),
        `${base}.webp ${managed.fullW}w`,
      ].join(", ")
    : undefined;
  const imgSrcSet =
    managed && fallbackExt
      ? [
          ...managed.widths.map((w) => `${base}-${w}.${fallbackExt} ${w}w`),
          `${base}.${fallbackExt} ${managed.fullW}w`,
        ].join(", ")
      : undefined;
  return (
    <WebpImage
      src={src}
      alt={image.alt}
      {...dims}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      sizes={managed?.sizes}
      srcSet={imgSrcSet}
      webpSrcSet={webpSrcSet}
    />
  );
}

/**
 * Renders inline content markers:
 *   "**text**"  → .cs-accent span
 *   "##text##"  → dark-ink span
 *   "\n"        → <br />
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|##[^#]+##)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("##") && part.endsWith("##") && part.length > 4) {
          return (
            <span key={i} style={{ color: "#111111" }}>
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <span key={i} className="cs-accent">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <Rich text={line} />
        </Fragment>
      ))}
    </>
  );
}

/* ------------------------- Reusable Primitives ------------------------- */

type KillableAnimation = {
  kill: () => void;
  scrollTrigger?: ScrollTrigger | null;
};

function useCaseStudyMotion(scopeRef: RefObject<HTMLElement | null>, slug: string) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let disposed = false;
      const animations: KillableAnimation[] = [];

      const coverWords = root.querySelectorAll<HTMLElement>(".cs-cover__word .row");
      const coverFacts = root.querySelectorAll<HTMLElement>(".cs-cover__fact-item");
      const coverSub = root.querySelector<HTMLElement>(".cs-cover__sub");
      const coverArt = root.querySelector<HTMLElement>(".cs-cover__art-inner");
      const coverScroll = root.querySelector<HTMLElement>(".cs-cover__scroll");
      const coverTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      animations.push(coverTl);
      if (coverWords.length > 0) {
        coverTl.from(coverWords, { y: 34, opacity: 0, duration: 0.8, stagger: 0.09 }, 0);
      }
      if (coverFacts.length > 0) {
        coverTl.from(coverFacts, { y: 18, opacity: 0, duration: 0.55, stagger: 0.07 }, 0.2);
      }
      if (coverSub) {
        coverTl.from(coverSub, { y: 22, opacity: 0, duration: 0.65 }, 0.32);
      }
      if (coverArt) {
        coverTl.from(coverArt, { y: 28, opacity: 0, scale: 1.02, duration: 1 }, 0.12);
      }
      if (coverScroll) {
        coverTl.from(coverScroll, { opacity: 0, duration: 0.45 }, 0.8);
      }

      void loadScrollTrigger().then((mod) => {
        if (disposed || !mod) return;

        const ending = root.querySelector<HTMLElement>(".cs-end");
        if (ending) {
          const word = ending.querySelector<HTMLElement>(".cs-end__word");
          const tags = ending.querySelectorAll<HTMLElement>(".cs-end__tag span");
          const visual = ending.querySelector<HTMLElement>(".cs-end__visual img");
          const foot = ending.querySelector<HTMLElement>(".cs-end__foot");
          const endTl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ending, start: "top 82%", once: true },
          });
          animations.push(endTl);
          if (word) endTl.from(word, { y: 44, opacity: 0, duration: 0.8 }, 0);
          if (tags.length > 0) {
            endTl.from(tags, { y: 22, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.12);
          }
          if (visual) endTl.from(visual, { scale: 1.06, duration: 0.9 }, 0.18);
          if (foot) endTl.from(foot, { opacity: 0, duration: 0.5 }, 0.55);
        }

        root.querySelectorAll<HTMLElement>(".cs-bid-stage .cs-phone-card img").forEach((img) => {
          const card = img.closest<HTMLElement>(".cs-phone-card") ?? img;
          animations.push(
            gsap.fromTo(
              img,
              { yPercent: -4, scale: 1.08 },
              {
                yPercent: 4,
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
        });

        const visualSelector =
          ".cs-overview__visual img, .cs-process__visual img, .cs-final__showcase img, .cs-editorial__visual img";
        root.querySelectorAll<HTMLElement>(visualSelector).forEach((img) => {
          const frame = img.parentElement ?? img;
          animations.push(
            gsap.fromTo(
              img,
              { yPercent: -5, scale: 1.06 },
              {
                yPercent: 5,
                scale: 1.06,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
        });

        root.querySelectorAll<HTMLElement>(".cs-persona__phone-frame img").forEach((img) => {
          const frame = img.closest<HTMLElement>(".cs-persona__phone-frame") ?? img;
          animations.push(
            gsap.fromTo(
              img,
              { yPercent: -3, scale: 1.05 },
              {
                yPercent: 3,
                scale: 1.05,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            ),
          );
        });

        root.querySelectorAll<HTMLElement>(".cs-editorial__points").forEach((points) => {
          const items = points.querySelectorAll<HTMLElement>(".cs-editorial__point-item");
          if (items.length === 0) return;
          animations.push(
            gsap.from(items, {
              x: -16,
              opacity: 0,
              duration: 0.55,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: { trigger: points, start: "top 86%", once: true },
            }),
          );
        });

        root.querySelectorAll<HTMLElement>(".cs-timeline__row, .cs-journey__row").forEach((row) => {
          const cells = Array.from(row.children);
          if (cells.length === 0) return;
          animations.push(
            gsap.from(cells, {
              y: 14,
              opacity: 0,
              duration: 0.5,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: row, start: "top 90%", once: true },
            }),
          );
        });

        root.querySelectorAll<HTMLElement>(".cs-persona").forEach((persona) => {
          const details = persona.querySelectorAll<HTMLElement>(
            ".cs-persona__name, .cs-persona__role, .cs-persona__pill",
          );
          if (details.length === 0) return;
          animations.push(
            gsap.from(details, {
              y: 16,
              opacity: 0,
              duration: 0.55,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: persona, start: "top 82%", once: true },
            }),
          );
        });

        const services = root.querySelector<HTMLElement>(".cs-services");
        if (services) {
          const links = services.querySelectorAll<HTMLElement>(
            ".cs-services__link, .cs-services__cta-link",
          );
          if (links.length > 0) {
            animations.push(
              gsap.from(links, {
                y: 16,
                opacity: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: "power3.out",
                scrollTrigger: { trigger: services, start: "top 88%", once: true },
              }),
            );
          }
        }

        mod.ScrollTrigger.refresh();
      });

      return () => {
        disposed = true;
        for (const animation of animations) {
          animation.scrollTrigger?.kill();
          animation.kill();
        }
      };
    },
    { scope: scopeRef, dependencies: [slug], revertOnUpdate: true },
  );
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  // Init-only: the effect below is mount-once, so later `options` values would
  // never be read anyway. Seeded here instead of assigned during render.
  const optionsRef = useRef(options);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-inview");
      return;
    }
    // Previously GSAP ScrollTrigger (trigger "top 90%", once). Native
    // IntersectionObserver does the same class toggle with zero library
    // weight: rootMargin "-10%" bottom ≈ "top 90%", disconnect = once.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0, ...optionsRef.current },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // Mount-once: route component persists across slug changes and revealed
    // state carries over, matching the previous behaviour.
  }, []);
  return ref;
}

function Reveal({
  children,
  delay,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h3" | "span" | "li" | "figure" | "header";
}) {
  const ref = useInView<HTMLElement>();
  return (
    <Tag ref={ref as never} data-delay={delay} className={`cs-reveal ${className}`}>
      {children}
    </Tag>
  );
}

function Section({
  children,
  className = "",
  id,
  dataChapter,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  dataChapter?: string;
}) {
  return (
    <section id={id} className={`cs-section ${className}`} data-chapter={dataChapter}>
      <div className="cs-section-inner">{children}</div>
    </section>
  );
}

function SectionHead({ kicker, children }: { kicker: string; children?: ReactNode }) {
  return (
    <div className="cs-sechead">
      <p className="cs-kicker">{kicker}</p>
      {children}
    </div>
  );
}

/* ============================ EDITORIAL SECTIONS ======================= */

function CoverSection({
  doc,
  section,
  crumbs,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "cover" }>;
  crumbs: BreadcrumbItem[];
}) {
  const firstChapterId = doc.chapters[0]?.id;

  return (
    <header className="cs-cover" id="top">
      <div className="cs-cover__title-wrap">
        <Breadcrumbs items={crumbs} className="cs-cover__crumbs" />
        <h1 className="cs-cover__word cs-display">
          {section.wordmark.map((w, i) => (
            <span key={i} className={`row ${w.accent ? "row--accent" : ""}`}>
              <Rich text={w.text} />
            </span>
          ))}
        </h1>
      </div>

      <div className="cs-cover__meta-grid">
        {section.facts.length > 0 && (
          <div className="cs-cover__facts">
            {section.facts.map((f) => (
              <div key={f.label} className="cs-cover__fact-item">
                <span className="cs-cover__fact-label">{f.label}</span>
                <span className="cs-cover__fact-val">{f.value}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          {section.subtitle.length > 0 && (
            <h2 className="cs-cover__sub">
              {section.subtitle.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
          )}
          <div className="cs-cover__scroll-row">
            <a href={firstChapterId ? `#${firstChapterId}` : "#top"} className="cs-cover__scroll">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>

      <figure className="cs-cover__art">
        <div className="cs-cover__art-inner">
          <CsImage
            image={section.coverImage}
            assets={doc.assets}

            loading="eager"
            fetchPriority="high"
          />
        </div>
      </figure>
    </header>
  );
}

function TagMarquee({ items }: { items: string[] }) {
  const [paused, setPaused] = useState(false);
  return (
    <div
      className={`cs-editorial__tags-track ${paused ? "is-paused" : ""}`}
      onClick={() => setPaused((v) => !v)}
      role="button"
      aria-label="Toggle tag marquee animation"
    >
      {[...items, ...items].map((tag, i) => (
        <span key={`${tag}-${i}`} className="cs-editorial__tag" aria-hidden={i >= items.length}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function ChapterNav({
  chapters,
  onNavigate,
}: {
  chapters: CaseStudyDocument["chapters"];
  onNavigate: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? chapters : chapters.slice(0, 3);
  const hiddenCount = chapters.length - 3;

  const goTo = (id: string) => {
    setExpanded(false);
    onNavigate(id);
  };

  return (
    <nav
      aria-label="Case study chapters"
      className={`cs-chapter-nav ${expanded ? "cs-chapter-nav--open" : ""}`}
    >
      <ol className="cs-chapter-nav__list">
        {visible.map((c) => (
          <li key={c.num}>
            <button type="button" className="cs-chapter-nav__item" onClick={() => goTo(c.id)}>
              <span className="cs-chapter-nav__num">{c.num}</span>
              <span className="cs-chapter-nav__label">{c.label}</span>
            </button>
          </li>
        ))}
      </ol>
      {hiddenCount > 0 && (
        <button
          type="button"
          className="cs-chapter-nav__toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span>{expanded ? "Close" : `+${hiddenCount} More`}</span>
          <ChevronDown size={14} />
        </button>
      )}
    </nav>
  );
}

function OverviewSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "overview" }>;
}) {
  return (
    <Section className="cs-overview" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker}>
        <ol className="cs-overview__index">
          {section.index.map((it) => (
            <li key={it.num}>
              <span>{it.num}</span>
              {it.label}
            </li>
          ))}
        </ol>
      </SectionHead>

      <div className="cs-overview__head">
        <Reveal as="h2" className="cs-overview__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <Reveal className="cs-overview__visual" delay={2}>
        <CsImage image={section.visual} assets={doc.assets} />
      </Reveal>
    </Section>
  );
}

function ChallengesSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "challenge" }>;
}) {
  return (
    <Section className="cs-challenge" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-challenge__row">
        <Reveal as="h2" className="cs-challenge__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede cs-lede--muted" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <div className="cs-problem-words">
        {section.problemWords.map((w, i) => (
          <Reveal key={i} className="cs-problem-word" delay={i}>
            {w.base}
            <strong>{w.strong}</strong>
          </Reveal>
        ))}
      </div>

      <div className="cs-bid-stage">
        {section.phoneCards.map((card, i) => (
          <Reveal
            key={i}
            className={`cs-phone-card ${card.offset ? `cs-phone-card--offset-${card.offset}` : ""}`}
            delay={i % 3}
          >
            <CsImage image={card.image} assets={doc.assets} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ProcessSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "process" }>;
}) {
  return (
    <Section className="cs-process" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-process__grid">
        <Reveal as="h2" className="cs-process__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <div className="cs-timeline">
        {section.steps.map((step, idx) => (
          <Reveal key={step.num} className="cs-timeline__row" delay={(idx % 3) as 1 | 2 | 3}>
            <span className="cs-timeline__num">{step.num}</span>
            <h3 className="cs-timeline__title">{step.title}</h3>
            <p className="cs-timeline__desc">{step.desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="cs-process__visual" delay={2}>
        <CsImage image={section.visual} assets={doc.assets} />
      </Reveal>
    </Section>
  );
}

function PersonasSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "personas" }>;
}) {
  return (
    <Section className="cs-personas" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />

      <div className="cs-personas__head">
        <Reveal as="h2" className="cs-personas__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      {section.personas.map((persona) => (
        <section key={persona.title} className={`cs-persona cs-persona--${persona.variant}`}>
          <div className="cs-persona__header">
            {persona.variant === "rider" ? (
              <>
                <span className="cs-persona__name cs-display">{persona.title}</span>
                <span className="cs-persona__role">{persona.role}</span>
              </>
            ) : (
              <>
                <span className="cs-persona__role">{persona.role}</span>
                <span className="cs-persona__name cs-display">{persona.title}</span>
              </>
            )}
          </div>
          <div className="cs-persona__grid">
            <div className="cs-persona__points">
              {persona.pills.map((pill) => (
                <span key={pill} className="cs-persona__pill">
                  {pill}
                </span>
              ))}
            </div>
            <div className="cs-persona__stage">
              {persona.phones.map((phone, i) => (
                <Reveal key={i} className="cs-persona__phone-frame" delay={i}>
                  <CsImage image={phone} assets={doc.assets} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}
    </Section>
  );
}

function FinalSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "final" }>;
}) {
  return (
    <Section className="cs-final" id={section.id} dataChapter={section.num}>
      <SectionHead kicker={section.kicker} />
      <div className="cs-final__col">
        <Reveal as="h2" className="cs-final__headline cs-display">
          <RichText text={section.headline} />
        </Reveal>
        <Reveal as="p" className="cs-lede cs-final__lede" delay={1}>
          <RichText text={section.lede} />
        </Reveal>
      </div>

      <Reveal className="cs-final__showcase" delay={2}>
        <CsImage image={section.showcase} assets={doc.assets} />
      </Reveal>

      <div className="cs-journey">
        <h3 className="cs-kicker cs-kicker--solid">{section.journeyKicker}</h3>
        <div className="cs-journey__rows">
          {section.journey.map((step, idx) => (
            <Reveal key={step.num} className="cs-journey__row" delay={(idx % 3) as 1 | 2 | 3}>
              <span className="cs-journey__num">{step.num}</span>
              <h4 className="cs-journey__title">{step.title}</h4>
              <p className="cs-journey__desc">{step.desc}</p>
              <span className="cs-journey__arrow">
                <ArrowDownRight size={20} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function EditorialSectionRenderer({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "editorial" }>;
}) {
  const theme = section.theme ?? "light";
  return (
    <Section
      className={`cs-editorial cs-editorial--${theme}`}
      id={section.id}
      dataChapter={section.num}
    >
      <SectionHead kicker={section.kicker} />
      <div className="cs-editorial__layout">
        {section.headline && (
          <Reveal as="h2" className="cs-editorial__headline cs-display">
            <RichText text={section.headline} />
          </Reveal>
        )}
        <div className="cs-editorial__body">
          {section.lede?.map((p, i) => (
            <Reveal key={i} as="p" className="cs-lede" delay={(i % 3) as 1 | 2 | 3}>
              <RichText text={p} />
            </Reveal>
          ))}

          {(() => {
            const tags = section.tags;
            if (!tags || tags.length === 0) return null;
            return (
              <Reveal className="cs-editorial__tags" delay={(section.lede?.length ?? 1) % 3}>
                <TagMarquee items={tags} />
              </Reveal>
            );
          })()}

          {section.points && section.points.length > 0 && (
            <Reveal className="cs-editorial__points">
              {section.points.map((point, i) => (
                <article key={i} className="cs-editorial__point">
                  {point.label && <h3 className="cs-editorial__point-label">{point.label}</h3>}
                  <ul className="cs-editorial__point-items">
                    {point.items?.map((item, j) => (
                      <li key={j} className="cs-editorial__point-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </Reveal>
          )}

          {section.footnote && (
            <Reveal as="p" className="cs-lede cs-editorial__footnote">
              {section.footnote}
            </Reveal>
          )}
        </div>
      </div>

      {section.visual && (
        <Reveal className="cs-editorial__visual" delay={2}>
          <CsImage image={section.visual} assets={doc.assets} />
        </Reveal>
      )}

      {section.visuals && section.visuals.length > 0 && (
        <div className="cs-editorial__visuals">
          {section.visuals.map((v, i) => (
            <Reveal key={i} className="cs-editorial__visual" delay={i % 3}>
              <CsImage image={v} assets={doc.assets} />
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}

function GallerySectionRenderer({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "gallery" }>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const slides = [...host.querySelectorAll<HTMLElement>(".cs-gallery__slide")];
    if (slides.length < 2) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const top = host.getBoundingClientRect().top + window.scrollY;
      const height = slides[0]?.offsetHeight ?? window.innerHeight;
      const y = window.scrollY;
      // Progress 0 -> 1 while a frame travels from the viewport bottom to the
      // top. The NEXT frame's progress drives this one's shrink/dim, so the
      // depth change is visible while it is still being covered.
      const progress = slides.map((_, i) =>
        Math.min(1, Math.max(0, (y - (top + i * height - height)) / height)),
      );
      slides.forEach((slide, i) => {
        const enter = progress[i] ?? 0;
        const cover = progress[i + 1] ?? 0;
        const settle =
          i === slides.length - 1 ? Math.min(1, Math.max(0, (enter - 0.72) / 0.28)) : 0;
        slide.style.setProperty("--enter", enter.toFixed(3));
        slide.style.setProperty("--cover", cover.toFixed(3));
        slide.style.setProperty("--settle", settle.toFixed(3));
        const inner = slide.querySelector<HTMLElement>(".cs-gallery__slide-inner");
        if (inner) inner.style.willChange = enter < 1 || cover > 0 ? "transform, filter" : "auto";
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [section.images.length]);

  return (
    <Section className="cs-gallery" id={section.id} dataChapter={section.num}>
      <div className="cs-gallery__grid" ref={hostRef}>
        {section.images.map((image) => (
          <div className="cs-gallery__slide" key={image.name}>
            <div className="cs-gallery__slide-inner">
              <CsImage image={image} assets={doc.assets} />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function EndingSection({
  doc,
  section,
}: {
  doc: CaseStudyDocument;
  section: Extract<CaseStudySection, { type: "ending" }>;
}) {
  return (
    <footer className="cs-end">
      <div className="cs-end__inner">
        <h2 className="cs-end__word cs-display">{section.word}</h2>
        <div className="cs-end__tag cs-display">
          {section.tag.map((t, i) => (
            <span key={i} className={t.accent ? "cs-accent" : ""}>
              {t.text}
            </span>
          ))}
        </div>
        <Reveal className="cs-end__visual">
          <CsImage image={section.visual} assets={doc.assets} />
        </Reveal>
        <p className="cs-end__foot">{section.foot}</p>
      </div>
    </footer>
  );
}

/* ============================ MAIN ROUTE PAGE ========================== */

/*
 * Cross-links from a case study back to the service pages behind it. Renders
 * nothing when the project declares no service slugs, so unpublished or
 * purely-branding work degrades to a link to the /projects hub instead.
 */
function ServiceCrossLinks({ slugs }: { slugs: string[] }) {
  const services = getServicesBySlugs(slugs);
  if (services.length === 0) return null;

  return (
    <section className="cs-services" aria-labelledby="cs-services-heading">
      <div className="cs-services__inner">
        <p className="cs-services__kicker">EXPERTISE</p>
        <h2 id="cs-services-heading" className="cs-services__title">
          The craft behind this work
        </h2>
        <div className="cs-services__list">
          {services.map((service) => (
            <Link
              key={service.slug}
              to="/services/$slug"
              params={{ slug: service.slug }}
              className="cs-services__link"
            >
              {service.shortTitle}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
        <div className="cs-services__cta">
          <Link to="/contact" className="cs-services__cta-link">
            Start a Conversation <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionRenderer({ doc, section }: { doc: CaseStudyDocument; section: CaseStudySection }) {
  switch (section.type) {
    case "overview":
      return <OverviewSection doc={doc} section={section} />;
    case "challenge":
      return <ChallengesSection doc={doc} section={section} />;
    case "process":
      return <ProcessSection doc={doc} section={section} />;
    case "personas":
      return <PersonasSection doc={doc} section={section} />;
    case "final":
      return <FinalSection doc={doc} section={section} />;
    case "editorial":
      return <EditorialSectionRenderer doc={doc} section={section} />;
    case "gallery":
      return <GallerySectionRenderer doc={doc} section={section} />;
    default:
      return null;
  }
}

function CaseStudy() {
  const { project, slug, caseStudy } = Route.useLoaderData();
  const doc = caseStudy;

  const [activeChapter, setActiveChapter] = useState("01");
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const smoothScroll = useSmoothScroll();
  const smoothScrollRef = useRef(smoothScroll);

  useCaseStudyMotion(mainRef, slug);

  useEffect(() => {
    smoothScrollRef.current = smoothScroll;
  }, [smoothScroll]);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        const last = visible[visible.length - 1];
        if (last) {
          const chapter = last.target.getAttribute("data-chapter");
          if (chapter) setActiveChapter(chapter);
        }
      },
      { rootMargin: "-35% 0px -40% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [slug]);

  useEffect(() => {
    const main = mainRef.current;
    const gallery = main?.querySelector<HTMLElement>(".cs-gallery");
    let raf = 0;
    let last = window.scrollY > 50;
    const sync = () => {
      raf = 0;
      const next = window.scrollY > 50;
      if (next !== last) {
        last = next;
        setIsScrolled(next);
      }
      // Switch the fixed nav only once the dark stage sits behind it.
      if (main && gallery) {
        main.classList.toggle("cs--dark-nav", gallery.getBoundingClientRect().top <= 80);
      }
    };
    const onScroll = () => {
      // Coalesce scroll events to one check per frame and skip setState
      // when the threshold hasn't crossed, avoiding re-renders on scroll.
      if (raf) return;
      raf = requestAnimationFrame(sync);
    };
    // Initial sync is async (via rAF) so the effect body itself never calls
    // setState synchronously; state settles before first scroll update.
    raf = requestAnimationFrame(sync);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      main?.classList.remove("cs--dark-nav");
    };
  }, [slug]);

  useEffect(() => {
    smoothScrollRef.current(0, { immediate: true });
  }, [slug]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      smoothScrollRef.current(el, { offset: -80 });
    }
  }, []);

  const creativeWorkSchema = getCreativeWorkSchema({
    name: project.name,
    headline: project.line,
    description: project.metaDescription,
    image: project.ogImage,
    url: `/projects/${project.slug}`,
    datePublished: project.publishedDate,
    client: project.client,
  });

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", item: "/" },
    { name: "Projects", item: "/projects" },
    { name: project.name, item: `/projects/${project.slug}` },
  ];
  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);

  const coverSection = doc.sections.find(
    (s): s is Extract<CaseStudySection, { type: "cover" }> => s.type === "cover",
  );
  const endingSection = doc.sections.find(
    (s): s is Extract<CaseStudySection, { type: "ending" }> => s.type === "ending",
  );
  const bodySections = doc.sections.filter(
    (s): s is Exclude<CaseStudySection, { type: "cover" } | { type: "ending" }> =>
      s.type !== "cover" && s.type !== "ending",
  );
  const isImageOnly = bodySections.some((s) => s.type === "gallery");

  return (
    <main
      id="main-content"
      ref={mainRef}
      className={`cs${isImageOnly ? " cs--images" : ""}`}
      style={
        {
          "--cs-accent": project.themeColor,
          "--cs-accent-hover": `color-mix(in srgb, ${project.themeColor} 82%, #000000)`,
          "--cs-accent-subtle": `color-mix(in srgb, ${project.themeColor} 11%, #ffffff)`,
        } as CSSProperties
      }
    >
      <StructuredData
        data={[
          creativeWorkSchema,
          breadcrumbSchema,
          getWebPageSchema({
            path: `/projects/${project.slug}`,
            name: project.metaTitle,
            description: project.metaDescription,
            datePublished: project.publishedDate,
          }),
        ]}
      />
      {/* Minimal Sticky Navigation */}
      <nav
        className={`cs-nav ${isScrolled ? "cs-nav--scrolled" : ""}`}
        aria-label="Case study navigation"
      >
        <Link to="/" className="cs-nav__brand">
          {doc.brand}
        </Link>
        <div className="cs-nav__chapters" aria-label="Chapter progress">
          {doc.chapters.map((c) => (
            <button
              key={c.num}
              type="button"
              onClick={() => scrollToSection(c.id)}
              className={`cs-nav__chapter-btn ${activeChapter === c.num ? "is-active" : ""}`}
              aria-label={`Go to section ${c.num} ${c.label}`}
            >
              {c.num}
            </button>
          ))}
        </div>
        <Link to="/" className="cs-nav__link" aria-label="Return to portfolio">
          <ArrowLeft size={14} /> CASE STUDY
        </Link>
      </nav>

      {/* Case Study Editorial Sections */}
      {coverSection && <CoverSection doc={doc} section={coverSection} crumbs={breadcrumbItems} />}
      {doc.chapters.length > 1 && (
        <ChapterNav chapters={doc.chapters} onNavigate={scrollToSection} />
      )}
      {bodySections.map((section) => (
        <SectionRenderer key={`${section.type}-${section.id}`} doc={doc} section={section} />
      ))}
      {!isImageOnly && <ServiceCrossLinks slugs={project.serviceSlugs} />}
      {endingSection && <EndingSection doc={doc} section={endingSection} />}
    </main>
  );
}
