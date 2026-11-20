import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import {
  selectedWork,
  type ProjectCategory,
  type ProjectCellSize,
  type SelectedWorkItem,
} from "@/data/projects";
import { WebpImage } from "@/components/WebpImage";
import { responsiveFor, WIDE_SIZES, COMPACT_SIZES } from "@/lib/responsive-images";

type WorkFilter = ProjectCategory | "all";

const filters: Array<{ label: string; value: WorkFilter }> = [
  { label: "All", value: "all" },
  { label: "UI/UX", value: "UI/UX" },
  { label: "Branding", value: "Branding" },
  { label: "Social Media", value: "Social Media" },
  { label: "Development", value: "Development" },
];

const filterDotColors: Record<WorkFilter, string> = {
  all: "bg-foreground/60",
  "UI/UX": "bg-primary",
  Branding: "bg-[#f97316]",
  "Social Media": "bg-[#0d9488]",
  Development: "bg-[#2563eb]",
};

const allFilterWork = selectedWork.filter((project) => project.slug !== "tiffinly");

const workForFilter = (value: WorkFilter) =>
  value === "all" ? allFilterWork : selectedWork.filter((project) => project.category === value);

const sizeClasses: Record<ProjectCellSize, string> = {
  hero: "col-span-2 aspect-[16/9] sm:aspect-[21/9] md:col-span-2 md:row-span-2 md:aspect-auto",
  wide: "col-span-2 aspect-[16/9] sm:aspect-[21/9] md:col-span-2 md:aspect-auto",
  normal: "aspect-[4/3] md:aspect-auto",
};

const isCompactSize = (size: ProjectCellSize) => size === "normal";

/*
 * Intrinsic size of each cover, measured from the file the card's `src`
 * resolves to: the full original for HaoCabs, the 800w candidate for the two
 * that ship a srcset. Every candidate in a srcset keeps the source ratio, so
 * these stay correct whichever one the browser picks. Keyed by the `cover`
 * path from src/data/projects.ts, so a new project shows up as missing here
 * rather than rendering with the wrong aspect hint.
 */
const coverDims: Record<string, { width: number; height: number }> = {
  "/HaoCabs/cover.png": { width: 941, height: 1672 },
  "/EDIOS/1.jpg": { width: 800, height: 450 },
  "/tiffinly/1.jpg": { width: 800, height: 534 },
  "/ZedHealth/1.jpg": { width: 800, height: 626 },
  "/Postfolio/coverimage.jpeg": { width: 1024, height: 768 },
};

const MORPH_MS = 480;
const EXIT_MS = 340;

type RegisterRef = (slug: string, el: HTMLAnchorElement | null) => void;

function ProjectCard({
  project,
  index,
  layout,
  registerRef,
}: {
  project: SelectedWorkItem;
  index: number;
  layout: "bento" | "billboard";
  registerRef?: RegisterRef;
}) {
  const isBillboard = layout === "billboard";
  const isCompact = !isBillboard && isCompactSize(project.size);
  const bottomClasses = isCompact
    ? "justify-end p-4 md:justify-between md:p-7"
    : isBillboard
      ? "justify-between p-8 md:p-12"
      : "justify-between p-5 md:p-7";
  const responsive = responsiveFor(project.image);
  const dims = coverDims[project.image];
  const sizes = isCompact ? COMPACT_SIZES : WIDE_SIZES;
  const hasResponsive = responsive.webpSrcSet.length > 0;
  return (
    <ScrollReveal
      key={project.slug}
      delay={index % 3}
      className={isBillboard ? "aspect-[16/9] sm:aspect-[21/9]" : sizeClasses[project.size]}
    >
      <Link
        ref={(el) => registerRef?.(project.slug, el)}
        to="/projects/$slug"
        params={{ slug: project.slug }}
        // Without a label the name is assembled from everything inside the card
        // — cover alt ("<title> — <subtitle>"), the <h3> title, the outcome and
        // the subtitle again, then "View Project" — so it announces the project
        // name two or three times. The label replaces all of that. It keeps the
        // visible "View Project" inside the name for WCAG 2.5.3 (Label in Name),
        // so voice-control users saying "click View Project" still match. The
        // cover alt below is deliberately left as-is.
        aria-label={`View Project: ${project.title} case study`}
        className="group relative block h-full w-full overflow-hidden rounded-2xl bg-ink shadow-xl transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-2xl"
      >
        <WebpImage
          src={responsive.src}
          srcSet={responsive.srcSet}
          webpSrcSet={hasResponsive ? responsive.webpSrcSet : undefined}
          sizes={hasResponsive ? sizes : undefined}
          alt={`${project.title} — ${project.subtitle}`}
          {...(dims ? { width: dims.width, height: dims.height } : {})}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-200 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />

        <div className={`absolute inset-x-0 bottom-0 flex items-end gap-4 ${bottomClasses}`}>
          <div className={cn("min-w-0", isCompact && "hidden md:block")}>
            <h3
              className={`font-display font-extrabold leading-none text-white ${
                isBillboard ? "text-2xl sm:text-4xl" : "text-xl md:text-2xl"
              }`}
            >
              {project.title}
            </h3>
            {project.outcome && (
              <p
                className={`mt-1.5 line-clamp-1 font-medium text-white/60 ${
                  isBillboard ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                }`}
              >
                {project.outcome}
              </p>
            )}
            <p
              className={`mt-1.5 line-clamp-1 text-white/80 ${
                isBillboard ? "text-base sm:text-lg" : "text-sm"
              }`}
            >
              {project.subtitle}
            </p>
          </div>

          <span className="hidden shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white opacity-0 transition duration-200 ease-out group-hover:bg-primary-hover group-hover:opacity-100 md:inline-flex">
            View Project
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>

          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors duration-200 ease-out group-hover:bg-primary-hover md:hidden"
          >
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </ScrollReveal>
  );
}

interface Ghost {
  project: SelectedWorkItem;
  left: number;
  top: number;
  width: number;
  height: number;
}

export function SelectedWork() {
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [ghosts, setGhosts] = useState<Ghost[]>([]);

  const outerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement | null>());
  const prevRects = useRef(new Map<string, DOMRect>());
  const ghostTimer = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  // Clear any pending ghost-exit timer on unmount so we never set state
  // on an unmounted component after a rapid filter change + navigation.
  useEffect(() => {
    return () => {
      if (ghostTimer.current) window.clearTimeout(ghostTimer.current);
    };
  }, []);

  const visible = workForFilter(filter);

  const registerRef: RegisterRef = (slug, el) => {
    linkRefs.current.set(slug, el);
  };

  const handleFilter = (next: WorkFilter) => {
    if (next === filter) return;

    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (ghostTimer.current) window.clearTimeout(ghostTimer.current);

    const nextList = workForFilter(next);
    const nextSlugs = new Set(nextList.map((p) => p.slug));

    const rects = new Map<string, DOMRect>();
    linkRefs.current.forEach((el, slug) => {
      if (el) rects.set(slug, el.getBoundingClientRect());
    });

    const exiting = visible.filter((p) => !nextSlugs.has(p.slug));
    if (!reducedMotion.current && exiting.length > 0) {
      const gridRect = outerRef.current?.getBoundingClientRect();
      if (gridRect) {
        setGhosts(
          exiting.map((p) => {
            const r = rects.get(p.slug);
            return {
              project: p,
              left: r ? r.left - gridRect.left : 0,
              top: r ? r.top - gridRect.top : 0,
              width: r?.width ?? 0,
              height: r?.height ?? 0,
            };
          }),
        );
        ghostTimer.current = window.setTimeout(() => setGhosts([]), EXIT_MS + 80);
      }
    }

    prevRects.current = rects;
    setFilter(next);
  };

  useLayoutEffect(() => {
    const prev = prevRects.current;
    prevRects.current = new Map();
    if (prev.size === 0 || reducedMotion.current) return;

    // READ phase: batch all getBoundingClientRect() calls before any writes.
    // No style mutations happen between these reads, so the browser can
    // satisfy them from a single layout pass.
    const pending: Array<{
      el: HTMLAnchorElement;
      dx: number;
      dy: number;
      sx: number;
      sy: number;
    }> = [];
    linkRefs.current.forEach((el, slug) => {
      const first = prev.get(slug);
      if (!el || !first) return;
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = last.width > 0 ? first.width / last.width : 1;
      const sy = last.height > 0 ? first.height / last.height : 1;
      // Skip no-op moves so we don't force style recalc for static cards.
      if (
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(sx - 1) < 0.002 &&
        Math.abs(sy - 1) < 0.002
      ) {
        return;
      }
      pending.push({ el, dx, dy, sx, sy });
    });
    if (pending.length === 0) return;

    // WRITE phase 1: apply the inverted FLIP state to every moving card.
    for (const { el, dx, dy, sx, sy } of pending) {
      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }
    // SINGLE forced reflow to flush the inverted state for all cards at once.
    // Previously this was `void el.offsetWidth` inside the loop (N reflows).
    void outerRef.current?.offsetWidth;

    // WRITE phase 2: release all cards to their natural position together.
    const cleanups: Array<() => void> = [];
    for (const { el } of pending) {
      el.style.transition = `transform ${MORPH_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;
      el.style.transform = "";
      const onEnd = () => {
        el.style.transition = "";
        el.style.transformOrigin = "";
      };
      el.addEventListener("transitionend", onEnd, { once: true });
      cleanups.push(() => el.removeEventListener("transitionend", onEnd));
    }
    return () => {
      for (const fn of cleanups) fn();
    };
  }, [filter]);

  return (
    <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-20 lg:pb-24">
      <ScrollReveal>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Recent projects
            </h2>
          </div>

          <div
            className="flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter projects by category"
          >
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => handleFilter(f.value)}
                aria-pressed={filter === f.value}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                  filter === f.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground/70 hover:border-primary/50 hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-200 sm:size-2",
                    filter === f.value ? "bg-white" : filterDotColors[f.value],
                  )}
                />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div ref={outerRef} className="relative mt-12">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center text-muted-foreground">
            No {filter === "all" ? "projects" : `${filter} projects`} yet — check back soon.
          </div>
        ) : visible.length === 1 ? (
          <ProjectCard
            project={visible[0] as SelectedWorkItem}
            index={0}
            layout="billboard"
            registerRef={registerRef}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:auto-rows-[15rem] md:grid-flow-dense lg:grid-cols-4 lg:auto-rows-[17rem]">
            {visible.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={index}
                layout="bento"
                registerRef={registerRef}
              />
            ))}
          </div>
        )}

        {ghosts.map((g) => {
          const r = responsiveFor(g.project.image);
          const hasR = r.webpSrcSet.length > 0;
          return (
            <span
              key={g.project.slug}
              aria-hidden="true"
              className="pointer-events-none absolute overflow-hidden rounded-2xl bg-ink shadow-xl motion-reduce:hidden animate-out fade-out-0 zoom-out-95 fill-mode-forwards"
              style={{
                left: g.left,
                top: g.top,
                width: g.width,
                height: g.height,
                ["--tw-animation-duration" as string]: `${EXIT_MS}ms`,
              }}
            >
              <WebpImage
                src={r.src}
                srcSet={r.srcSet}
                webpSrcSet={hasR ? r.webpSrcSet : undefined}
                sizes={hasR ? WIDE_SIZES : undefined}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            </span>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center sm:mt-12">
        <Link
          to="/projects"
          className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-6 py-3 text-foreground transition-colors duration-250 ease-out hover:border-ink hover:bg-ink hover:text-ink-foreground"
        >
          See All
          <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}
