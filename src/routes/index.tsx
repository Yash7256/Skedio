import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Zap } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";

import hero from "@/assets/hero.png";
import svcStrategy from "@/assets/svc-strategy.jpg";
import svcIdentity from "@/assets/svc-identity.jpg";
import svcDesign from "@/assets/svc-design.jpg";
import svcUiux from "@/assets/svc-uiux.jpg";
import insight1 from "@/assets/insight-1.jpg";
import insight2 from "@/assets/insight-2.jpg";
import insight3 from "@/assets/insight-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skédio — We build brands that make an impact" },
      {
        name: "description",
        content:
          "Skédio is a creative studio crafting bold brands, beautiful experiences and digital products that help businesses grow.",
      },
      { property: "og:title", content: "Skédio — We build brands that make an impact" },
      {
        property: "og:description",
        content: "Brand strategy, identity, design and UI/UX from a studio built for growth.",
      },
      { name: "theme-color", content: "#8537F4" },
    ],
  }),
  component: Index,
});

const services = [
  {
    title: "Brand Strategy",
    body: "Building positioning and strategy that give a brand real direction, not just a look.",
    img: svcStrategy,
  },
  {
    title: "Brand Identity",
    body: "Distinctive visual identities built to be recognized at a glance and remembered long after.",
    img: svcIdentity,
  },
  {
    title: "UI/UX",
    body: "Digital experiences built to be intuitive first, beautiful second.",
    img: svcUiux,
  },
  {
    title: "Product Development",
    body: "End-to-end product development that turns ideas into scalable digital products.",
    img: svcDesign,
  },
];

const projects = [
  {
    name: "HAO Cabs",
    slug: "haocabs",
    line: "A Taxi Bidding Experience App",
    tag: "Product Design, UI/UX",
    img: "/HaoCabs/cover.png",
  },
];

const insights = [
  { date: "May 20, 2025", title: "The Future of Brand Building in a Digital World", img: insight1 },
  { date: "May 12, 2025", title: "Typography in Branding: More Than Just Fonts", img: insight2 },
  { date: "May 05, 2025", title: "Designing Experiences That People Remember", img: insight3 },
];

const clientLogos = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  src: `/Clients/${i + 1}.png`,
  alt: `Client logo ${i + 1}`,
}));

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={`h-12 w-auto ${className}`}
    />
  );
}

function PillLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ink" | "outline";
}) {
  const styles =
    variant === "outline"
      ? "border border-border bg-transparent text-foreground hover:border-ink hover:bg-ink hover:text-ink-foreground"
      : variant === "ink"
        ? "bg-ink text-ink-foreground hover:bg-primary"
        : "bg-primary text-primary-foreground hover:bg-primary-hover";
  return (
    <a
      href={href}
      className={`group type-button inline-flex items-center gap-2 rounded-full px-6 py-3 transition-colors duration-250 ease-out ${styles}`}
    >
      {children}
      <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowUpRight className="size-4" />
      </span>
    </a>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <Wordmark />
          <div className="flex items-center gap-10">
            <ul className="type-label hidden items-center gap-10 uppercase md:flex">
              {["Work", "Services", "Insights"].map((i) => (
                <li key={i}>
                  <a
                    href={`#${i.toLowerCase()}`}
                    className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                  >
                    {i}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/about"
                  className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                >
                  About
                </a>
              </li>
            </ul>
            <PillLink href="#contact">Let's Talk</PillLink>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1440px] px-6 py-16 md:px-12 md:py-24 lg:py-28">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-5 lg:gap-10">
          {/* Left column (~60%) */}
          <div className="lg:col-span-3">
            <h1 className="type-h1 sk-rise">
              We build brands and digital
              <br />
              products that make an{" "}
              <span className="font-extrabold text-primary">impact.</span>
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {["Brand Strategy", "Brand Identity", "UI/UX Design", "Web Development"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-foreground/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <PillLink href="#work" variant="ink">
                View our works
              </PillLink>
              <PillLink href="#contact" variant="outline">
                Let's Talk
              </PillLink>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="size-4 text-primary" />
              Get reply within 36 hours
            </p>
          </div>

          {/* Right column (~40%, lower) */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
              <p className="eyebrow">Partner with</p>
              <div className="sk-marquee mt-6 overflow-hidden">
                <div className="sk-marquee-track flex w-max items-center gap-x-10">
                  {[...clientLogos, ...clientLogos].map((c, i) => (
                    <div
                      key={`${c.id}-${i}`}
                      className="flex h-12 w-28 shrink-0 items-center justify-center"
                    >
                      <img
                        src={c.src}
                        alt={c.alt}
                        className="max-h-10 w-auto max-w-full object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero image placeholder */}
      <section className="mx-auto w-full max-w-[1440px] px-6 md:px-12">
        <img
          src={hero}
          alt="Hero visual"
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      </section>

      <div className="bg-background">
        {/* Services */}
        <section id="services" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 py-24 lg:py-28">
          <ScrollReveal>
            <p className="eyebrow">What we do</p>
            <h2 className="type-h2 mt-5">Services that drive brands forward</h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, idx) => (
              <ScrollReveal key={s.title} delay={idx}>
                <article
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    width={700}
                    height={560}
                    className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="p-6">
                    <h3 className="type-h6">{s.title}</h3>
                    <p className="type-sm mt-2.5 text-muted-foreground">{s.body}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Work */}
        <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-28">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Featured project</p>
                <h2 className="type-h2 mt-5">Selected work</h2>
              </div>
              <PillLink href="/projects/haocabs" variant="outline">
                Explore Case Study
              </PillLink>
            </div>
          </ScrollReveal>

          <div className="mt-12">
            {projects.map((p) => (
              <ScrollReveal key={p.name} delay={1}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group relative block overflow-hidden rounded-2xl bg-ink shadow-2xl transition-transform duration-300 ease-out hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
                    <img
                      src={p.img}
                      alt={`${p.name} project`}
                      loading="lazy"
                      width={1600}
                      height={900}
                      className="h-full w-full object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-12">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-2xl font-bold sm:text-4xl">{p.name}</h3>
                            <span className="rounded-full bg-[#FFC400] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-black">
                              Case Study
                            </span>
                          </div>
                          <p className="type-base mt-2 text-white/80 sm:text-lg">{p.line}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors duration-250 ease-out group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                          View Project <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section id="insights" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-32">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Insights</p>
                <h2 className="type-h2 mt-5">Read our latest thoughts</h2>
              </div>
              <PillLink href="#insights" variant="outline">
                View All Insights
              </PillLink>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {insights.map((n, idx) => (
              <ScrollReveal key={n.title} delay={idx}>
                <article className="group flex cursor-pointer gap-5">
                  <img
                    src={n.img}
                    alt={n.title}
                    loading="lazy"
                    width={560}
                    height={560}
                    className="size-32 shrink-0 rounded-xl object-cover transition-transform duration-250 ease-out group-hover:-translate-y-1"
                  />
                  <div>
                    <p className="type-caption text-muted-foreground">{n.date}</p>
                    <h3 className="mt-2 text-base font-semibold leading-snug">{n.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Read More{" "}
                      <ArrowRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Clients */}
        <section id="clients" className="mx-auto w-full max-w-[1360px] scroll-mt-24 px-6 pb-28 lg:pb-36">
          <ScrollReveal>
            <div className="mb-14 lg:mb-20">
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Clients
              </h2>
              <div className="mt-3 flex items-center gap-6">
                <p className="type-body text-muted-foreground sm:text-lg">
                  We'll let the brands speak for us
                </p>
                <div className="h-px flex-1 max-w-sm bg-border/80" />
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 items-center justify-items-center gap-x-12 gap-y-16 sm:grid-cols-3 sm:gap-x-16 sm:gap-y-20 md:grid-cols-4 lg:grid-cols-4">
            {clientLogos.map((c, idx) => (
              <ScrollReveal
                key={c.id}
                delay={idx % 4}
                className="flex h-32 w-full items-center justify-center p-3 sm:h-36 lg:h-44"
              >
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  width={360}
                  height={180}
                  className="max-h-24 w-auto max-w-[240px] cursor-pointer object-contain grayscale opacity-60 transition-all duration-300 ease-out hover:scale-110 hover:opacity-100 hover:grayscale-0 sm:max-h-28 sm:max-w-[280px] lg:max-h-36 lg:max-w-[320px]"
                />
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
