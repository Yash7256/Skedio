import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, Instagram, Linkedin, Dribbble, Zap } from "lucide-react";

import hero from "@/assets/hero.png";
import svcStrategy from "@/assets/svc-strategy.jpg";
import svcIdentity from "@/assets/svc-identity.jpg";
import svcDesign from "@/assets/svc-design.jpg";
import svcUiux from "@/assets/svc-uiux.jpg";
import workFibe from "@/assets/work-fibe.jpg";
import workAashirvaad from "@/assets/work-aashirvaad.jpg";
import workForest from "@/assets/work-forest.jpg";
import workTwig from "@/assets/work-twig.jpg";
import workBingo from "@/assets/work-bingo.jpg";
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
    body: "We uncover insights and build strategies that shape meaningful brand positioning and long-term growth.",
    img: svcStrategy,
  },
  {
    title: "Identity",
    body: "We create distinctive brand identities that capture your essence and leave a lasting impression.",
    img: svcIdentity,
  },
  {
    title: "Design",
    body: "From visuals to packaging, we design compelling brand experiences that connect and inspire.",
    img: svcDesign,
  },
  {
    title: "UI / UX",
    body: "We design intuitive digital experiences that are beautiful, functional and user-first.",
    img: svcUiux,
  },
];

const projects = [
  { name: "Fibe", line: "Banking made effortless.", tag: "UI/UX Design", img: workFibe },
  { name: "Aashirvaad", line: "Packaging Redesign", tag: "Branding, Packaging", img: workAashirvaad },
  { name: "Forest Essentials", line: "Luxury Skincare Reimagined", tag: "Branding, Packaging", img: workForest },
  { name: "Twig", line: "Shopping made simple.", tag: "UI/UX Design", img: workTwig },
  { name: "Bingo!", line: "Bold. Fun. Unsstoppable.", tag: "Packaging Design", img: workBingo },
];

const insights = [
  { date: "May 20, 2025", title: "The Future of Brand Building in a Digital World", img: insight1 },
  { date: "May 12, 2025", title: "Typography in Branding: More Than Just Fonts", img: insight2 },
  { date: "May 05, 2025", title: "Designing Experiences That People Remember", img: insight3 },
];

const clients = ["zomato", "ITC", "Cadbury", "CRED", "fnp", "Bingo!", "AASHIRVAAD", "boAt"];

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
              {["Work", "Services", "About", "Insights"].map((i) => (
                <li key={i}>
                  <a
                    href={`#${i.toLowerCase()}`}
                    className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                  >
                    {i}
                  </a>
                </li>
              ))}
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
              {["Brand Strategy", "Identity", "Design", "UI / UX"].map((tag) => (
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
                View Our Work
              </PillLink>
              <PillLink href="#services" variant="outline">
                Explore Services
              </PillLink>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="size-4 text-primary" />
              Get a reply within 24 hours
            </p>
          </div>

          {/* Right column (~40%, lower) */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-surface/60 p-8 lg:p-10">
              <p className="eyebrow">Trusted by brands we love</p>
              <div className="sk-marquee mt-6 overflow-hidden">
                <div className="sk-marquee-track flex w-max items-center gap-x-10">
                  {[...clients, ...clients].map((c, i) => (
                    <span
                      key={`${c}-${i}`}
                      className="whitespace-nowrap font-display text-lg font-bold text-foreground/35 transition-colors duration-300 hover:text-foreground"
                    >
                      {c}
                    </span>
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
          <p className="eyebrow">What we do</p>
          <h2 className="type-h2 mt-5">Services that drive brands forward</h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <article
                key={s.title}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-250 ease-out hover:-translate-y-1 hover:shadow-card-hover"
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
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Explore{" "}
                    <ArrowRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Work */}
        <section id="work" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Our work</p>
              <h2 className="type-h2 mt-5">Projects that speak for us</h2>
            </div>
            <PillLink href="#work" variant="outline">
              View All Projects
            </PillLink>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {projects.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-xl bg-ink transition-transform duration-250 ease-out hover:-translate-y-1"
              >
                <img
                  src={p.img}
                  alt={`${p.name} project`}
                  loading="lazy"
                  width={640}
                  height={900}
                  className="h-96 w-full object-cover opacity-90 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <p className="type-sm mt-1 text-white/75">{p.line}</p>
                  <p className="type-caption mt-5 uppercase tracking-[0.14em] text-white/60">
                    {p.tag}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section id="insights" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-24 lg:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Insights</p>
              <h2 className="type-h2 mt-5">Read our latest thoughts</h2>
            </div>
            <PillLink href="#insights" variant="outline">
              View All Insights
            </PillLink>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {insights.map((n) => (
              <article key={n.title} className="group flex cursor-pointer gap-5">
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
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 bg-surface-alt text-white">
        <div className="overflow-hidden px-2 pt-6 leading-none">
          <p className="whitespace-nowrap text-center font-display text-[13vw] font-extrabold uppercase leading-[0.8] tracking-tight text-white/[0.06] select-none">
            SKEDIO
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-[1200px] gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1.4fr_2.4fr_1.4fr]">
          <div>
            <Wordmark className="brightness-0 invert" />
            <p className="type-sm mt-5 max-w-xs leading-relaxed text-white/60">
              A creative studio building brands and digital experiences that drive impact and
              inspire growth.
            </p>
            <div className="mt-7 flex gap-5 text-white/70">
              <a href="#contact" aria-label="Instagram"><Instagram className="size-5 transition-colors hover:text-primary-light" /></a>
              <a href="#contact" aria-label="Dribbble"><Dribbble className="size-5 transition-colors hover:text-primary-light" /></a>
              <a href="#contact" aria-label="LinkedIn"><Linkedin className="size-5 transition-colors hover:text-primary-light" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {[
              { h: "Company", l: ["About Us", "Our Process", "Careers", "Contact"] },
              { h: "Services", l: ["Brand Strategy", "Identity", "Design", "UI / UX"] },
              { h: "Work", l: ["All Projects", "Case Studies", "Clients"] },
              { h: "Resources", l: ["Blog", "Guides", "News"] },
            ].map((col) => (
              <div key={col.h}>
                <h4 className="type-label uppercase tracking-[0.08em]">{col.h}</h4>
                <ul className="mt-5 space-y-3 text-sm text-white/60">
                  {col.l.map((x) => (
                    <li key={x}>
                      <a href="#contact" className="transition-colors duration-200 hover:text-primary-light">{x}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="type-h6">Let's create something great</h4>
            <p className="type-sm mt-5 text-white/60">hello@skedio.studio</p>
            <p className="type-sm text-white/60">+91 98765 43210</p>
            <form
              className="mt-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1.5 pl-5 backdrop-blur-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="type-sm min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/45"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="group grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-colors duration-250 hover:bg-primary-hover"
              >
                <ArrowUpRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-white/50">
            <p>© 2025 Skédio. All rights reserved.</p>
            <div className="flex gap-7">
              <a href="#contact" className="transition-colors hover:text-white">Privacy Policy</a>
              <a href="#contact" className="transition-colors hover:text-white">Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
