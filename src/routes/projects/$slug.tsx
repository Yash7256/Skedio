import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowLeft } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";

import "./case-study.css";

export const Route = createFileRoute("/projects/$slug")({
  head: () => ({
    meta: [
      { title: "HAO Cabs — Taxi Bidding Experience Case Study | Skédio" },
      {
        name: "description",
        content:
          "A long-form editorial product design case study exploring HAO Cabs — a taxi bidding experience app connecting riders and drivers in real time.",
      },
      { property: "og:title", content: "HAO Cabs — Case Study | Skédio" },
      {
        property: "og:description",
        content:
          "A modern taxi-bidding platform where riders compare driver bids and choose the ride that best fits their needs.",
      },
      { name: "theme-color", content: "#FFC400" },
    ],
  }),
  component: CaseStudy,
});

const ASSETS = "/HaoCabs";
const CHAPTERS = [
  { id: "overview", num: "01", label: "Overview" },
  { id: "challenges", num: "02", label: "Challenges" },
  { id: "process", num: "03", label: "Process" },
  { id: "personas", num: "04", label: "Personas" },
  { id: "final", num: "05", label: "Final" },
];

/* ------------------------- Reusable Primitives ------------------------- */

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-inview");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          el.classList.add("is-inview");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px", ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);
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
    <Tag
      ref={ref as never}
      data-delay={delay}
      className={`cs-reveal ${className}`}
    >
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

function SectionHead({
  kicker,
  children,
}: {
  kicker: string;
  children?: ReactNode;
}) {
  return (
    <div className="cs-sechead">
      <p className="cs-kicker">{kicker}</p>
      {children}
    </div>
  );
}

/* ============================ EDITORIAL SECTIONS ======================= */

function Cover() {
  const artRef = useInView<HTMLDivElement>();

  return (
    <header className="cs-cover" id="top">
      <div className="cs-cover__title-wrap">
        <h1 className="cs-cover__word cs-display">
          <span className="row">HAO</span>
          <span className="row row--accent">CABS</span>
        </h1>
      </div>

      <div className="cs-cover__meta-grid">
        <div className="cs-cover__facts">
          <div className="cs-cover__fact-item">
            <span className="cs-cover__fact-label">Platform</span>
            <span className="cs-cover__fact-val">Mobile App</span>
          </div>
          <div className="cs-cover__fact-item">
            <span className="cs-cover__fact-label">Discipline</span>
            <span className="cs-cover__fact-val">Product Design</span>
          </div>
          <div className="cs-cover__fact-item">
            <span className="cs-cover__fact-label">Scope</span>
            <span className="cs-cover__fact-val">UI/UX</span>
          </div>
          <div className="cs-cover__fact-item">
            <span className="cs-cover__fact-label">Year</span>
            <span className="cs-cover__fact-val">2026</span>
          </div>
        </div>

        <div>
          <h2 className="cs-cover__sub">
            A Taxi Bidding
            <br />
            Experience App
          </h2>
          <div className="cs-cover__scroll-row">
            <a href="#overview" className="cs-cover__scroll">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>

      <figure className="cs-cover__art" ref={artRef as never}>
        <div className="cs-cover__art-inner">
          <img
            src={`${ASSETS}/1.jpg`}
            alt="HAO Cabs — Taxi bidding experience platform"
            fetchPriority="high"
          />
        </div>
      </figure>
    </header>
  );
}

const OVERVIEW_INDEX: Array<[string, string]> = [
  ["01", "Overview"],
  ["02", "Challenge"],
  ["03", "Approach"],
  ["04", "Design"],
  ["05", "Outcome"],
];

function Overview() {
  return (
    <Section className="cs-overview" id="overview" dataChapter="01">
      <SectionHead kicker="01) PROJECT OVERVIEW">
        <ol className="cs-overview__index">
          {OVERVIEW_INDEX.map(([num, label]) => (
            <li key={num}>
              <span>{num}</span>
              {label}
            </li>
          ))}
        </ol>
      </SectionHead>

      <div className="cs-overview__head">
        <Reveal as="h2" className="cs-overview__headline cs-display">
          A Smarter Way To
          <br />
          Book, <span className="cs-accent">Bid &amp; Ride.</span>
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          Hao Cabs is a modern taxi-bidding platform that reimagines traditional
          ride booking through real-time driver bidding. Instead of fixed fares,
          riders can compare multiple offers from nearby drivers and choose the
          ride that best fits their needs.
        </Reveal>
      </div>

      <Reveal className="cs-overview__visual" delay={2}>
        <img
          src={`${ASSETS}/1.jpg`}
          alt="HAO Cabs product promotional visual and editorial artwork"
          loading="lazy"
        />
      </Reveal>
    </Section>
  );
}

function Challenges() {
  return (
    <Section className="cs-challenge" id="challenges" dataChapter="02">
      <SectionHead kicker="02) CHALLENGES" />
      <div className="cs-challenge__row">
        <Reveal as="h2" className="cs-challenge__headline cs-display">
          Giving Riders More Choice Without <span className="cs-accent">Adding Complexity.</span>
        </Reveal>
        <Reveal as="p" className="cs-lede cs-lede--muted" delay={1}>
          Traditional ride-booking experiences often provide limited control over
          pricing and ride options. Hao Cabs needed a simple bidding experience
          that could give riders greater choice while keeping the booking process
          fast, clear, and easy to understand.
        </Reveal>
      </div>

      <div className="cs-problem-words">
        <Reveal className="cs-problem-word">
          LIMITED<strong>CONTROL</strong>
        </Reveal>
        <Reveal className="cs-problem-word" delay={1}>
          FIXED<strong>FARES</strong>
        </Reveal>
        <Reveal className="cs-problem-word" delay={2}>
          FEWER<strong>OPTIONS</strong>
        </Reveal>
      </div>

      <div className="cs-bid-stage">
        <Reveal className="cs-phone-card cs-phone-card--offset-up">
          <img src={`${ASSETS}/2.jpg`} alt="Available driver bids" loading="lazy" />
        </Reveal>
        <Reveal className="cs-phone-card" delay={1}>
          <img src={`${ASSETS}/4.jpg`} alt="Ride request screen" loading="lazy" />
        </Reveal>
        <Reveal className="cs-phone-card cs-phone-card--offset-down" delay={2}>
          <img src={`${ASSETS}/5.jpg`} alt="Fare comparison and bidding interface" loading="lazy" />
        </Reveal>
      </div>
    </Section>
  );
}

const PROCESS_STEPS = [
  ["01", "DISCOVER", "Understanding the problem"],
  ["02", "DEFINE", "Rider & Driver journeys"],
  ["03", "EXPLORE", "User flows & wireframes"],
  ["04", "REFINE", "Prototypes & iterations"],
  ["05", "DELIVER", "High-fidelity UI"],
];

function Process() {
  return (
    <Section className="cs-process" id="process" dataChapter="03">
      <SectionHead kicker="03) DESIGN PROCESS" />
      <div className="cs-process__grid">
        <Reveal as="h2" className="cs-process__headline cs-display">
          From Understanding The Problem To Designing The Experience.
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          The design process focused on understanding ride-booking pain points,
          mapping Rider and Driver journeys, exploring user flows, and
          progressively refining the interface through wireframes, prototypes,
          and high-fidelity UI design.
        </Reveal>
      </div>

      <div className="cs-timeline">
        {PROCESS_STEPS.map(([num, title, desc], idx) => (
          <Reveal key={num} className="cs-timeline__row" delay={(idx % 3) as 1 | 2 | 3}>
            <span className="cs-timeline__num">{num}</span>
            <h3 className="cs-timeline__title">{title}</h3>
            <p className="cs-timeline__desc">{desc}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="cs-process__visual" delay={2}>
        <img
          src={`${ASSETS}/6.jpg`}
          alt="HAO Cabs design system, user flows and interface fragments"
          loading="lazy"
        />
      </Reveal>
    </Section>
  );
}

function Personas() {
  return (
    <Section className="cs-personas" id="personas" dataChapter="04">
      <SectionHead kicker="04) USER PERSONAS" />

      <div className="cs-personas__head">
        <Reveal as="h2" className="cs-personas__headline cs-display">
          Designing For The People Behind Every Ride.
        </Reveal>
        <Reveal as="p" className="cs-lede" delay={1}>
          User personas helped define the needs, motivations, and pain points of
          Hao Cabs' target users. The focus was on riders looking for affordable
          and reliable transportation, with features such as fare comparison,
          live tracking, secure payments, and scheduled rides supporting their
          everyday needs.
        </Reveal>
      </div>

      {/* Persona: Rider */}
      <section className="cs-persona cs-persona--rider">
        <div className="cs-persona__header">
          <span className="cs-persona__name cs-display">RIDER</span>
          <span className="cs-persona__role">The Passenger</span>
        </div>
        <div className="cs-persona__grid">
          <div className="cs-persona__points">
            <span className="cs-persona__pill">Fare comparison</span>
            <span className="cs-persona__pill">Live tracking</span>
            <span className="cs-persona__pill">Secure payments</span>
            <span className="cs-persona__pill">Scheduled rides</span>
            <span className="cs-persona__pill">Choosing a driver</span>
          </div>
          <div className="cs-persona__stage">
            <Reveal className="cs-persona__phone-frame">
              <img src={`${ASSETS}/2.jpg`} alt="Rider fare comparison" loading="lazy" />
            </Reveal>
            <Reveal className="cs-persona__phone-frame" delay={1}>
              <img src={`${ASSETS}/5.jpg`} alt="Rider selecting a driver" loading="lazy" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Persona: Driver */}
      <section className="cs-persona cs-persona--driver">
        <div className="cs-persona__header">
          <span className="cs-persona__role">The Driver</span>
          <span className="cs-persona__name cs-display">DRIVER</span>
        </div>
        <div className="cs-persona__grid">
          <div className="cs-persona__stage">
            <Reveal className="cs-persona__phone-frame">
              <img src={`${ASSETS}/4.jpg`} alt="Driver receiving ride requests" loading="lazy" />
            </Reveal>
            <Reveal className="cs-persona__phone-frame" delay={1}>
              <img src={`${ASSETS}/7.jpg`} alt="Driver earnings and trip management" loading="lazy" />
            </Reveal>
          </div>
          <div className="cs-persona__points">
            <span className="cs-persona__pill">Receiving ride requests</span>
            <span className="cs-persona__pill">Submitting bids</span>
            <span className="cs-persona__pill">Managing rides</span>
            <span className="cs-persona__pill">Navigation &amp; earnings</span>
          </div>
        </div>
      </section>
    </Section>
  );
}

const JOURNEY_STEPS = [
  ["01", "REQUEST", "Passenger creates a ride request."],
  ["02", "BID", "Nearby drivers submit their offers."],
  ["03", "CHOOSE", "Passenger compares offers and selects a driver."],
  ["04", "VERIFY", "OTP verification confirms the ride."],
  ["05", "TRACK", "Passenger follows the ride in real time."],
  ["06", "PAY", "Complete the payment securely."],
  ["07", "COMPLETE", "Rate the experience and manage the trip afterward."],
];

function FinalExperience() {
  return (
    <Section className="cs-final" id="final" dataChapter="05">
      <SectionHead kicker="05) FINAL EXPERIENCE" />
      <div className="cs-final__col">
        <Reveal as="h2" className="cs-final__headline cs-display">
          A Transparent Ride-Booking Experience, From <span style={{ color: "#111111" }}>Bid To Destination.</span>
        </Reveal>
        <Reveal as="p" className="cs-lede cs-final__lede" delay={1}>
          The final experience brings together real-time bidding, driver
          selection, OTP verification, live tracking, payments, scheduling,
          wallet management, and post-ride feedback into a unified mobile
          experience for Riders and Drivers.
        </Reveal>
      </div>

      <Reveal className="cs-final__showcase" delay={2}>
        <img
          src={`${ASSETS}/3.jpg`}
          alt="HAO Cabs final mobile application — complete unified ride experience"
          loading="lazy"
        />
      </Reveal>

      <div className="cs-journey">
        <h3 className="cs-kicker cs-kicker--solid">Product Story &amp; Flow</h3>
        <div className="cs-journey__rows">
          {JOURNEY_STEPS.map(([num, title, desc], idx) => (
            <Reveal key={num} className="cs-journey__row" delay={(idx % 3) as 1 | 2 | 3}>
              <span className="cs-journey__num">{num}</span>
              <h4 className="cs-journey__title">{title}</h4>
              <p className="cs-journey__desc">{desc}</p>
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

function Ending() {
  return (
    <footer className="cs-end">
      <div className="cs-end__inner">
        <h2 className="cs-end__word cs-display">HAO CABS</h2>
        <div className="cs-end__tag cs-display">
          <span>BID. </span>
          <span className="cs-accent">CHOOSE. </span>
          <span>RIDE.</span>
        </div>
        <Reveal className="cs-end__visual">
          <img
            src={`${ASSETS}/1.jpg`}
            alt="HAO Cabs final brand statement artwork"
            loading="lazy"
          />
        </Reveal>
        <p className="cs-end__foot">End of case study — Skédio</p>
      </div>
    </footer>
  );
}

/* ============================ MAIN ROUTE PAGE ========================== */

function CaseStudy() {
  const { slug } = Route.useParams();

  const [activeChapter, setActiveChapter] = useState("01");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (slug !== "haocabs") return;
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
    if (slug !== "haocabs") return;
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  useEffect(() => {
    if (slug !== "haocabs") return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (slug !== "haocabs") {
    return (
      <main className="cs" style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: "40px" }}>
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
            style={{ display: "inline-flex", padding: "12px 24px", background: "var(--cs-black)", color: "var(--cs-white)", borderRadius: 999 }}
          >
            <ArrowLeft size={16} /> RETURN TO PORTFOLIO
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cs">
      {/* Minimal Sticky Navigation */}
      <nav className={`cs-nav ${isScrolled ? "cs-nav--scrolled" : ""}`} aria-label="Case study navigation">
        <Link to="/" className="cs-nav__brand">
          HAO CABS
        </Link>
        <div className="cs-nav__chapters" aria-label="Chapter progress">
          {CHAPTERS.map((c) => (
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
      <Cover />
      <Overview />
      <Challenges />
      <Process />
      <Personas />
      <FinalExperience />
      <Ending />
    </main>
  );
}
