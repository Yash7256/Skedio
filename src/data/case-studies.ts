export interface Chapter {
  id: string;
  num: string;
  label: string;
}

export interface ImageRef {
  name: string;
  alt: string;
  width?: number;
  height?: number;
  /** Original file extension when it is not the default .jpg. */
  ext?: string;
}

/**
 * Case study editorial content. One document per published (or in-progress)
 * project, keyed by slug. Markup markers inside headline/lede strings:
 *   "**text**" renders as .cs-accent, "##text##" renders in dark ink,
 *   newlines "\\n" render as line breaks.
 */
export interface CaseStudyDocument {
  slug: string;
  /** Base asset URL relative to /public, e.g. "/HaoCabs". */
  assets: string;
  /** Set true when the asset dir also ships .webp copies of every image. */
  hasWebp?: boolean;
  /** Brand wordmark shown in the sticky nav. */
  brand: string;
  /** Sticky-nav chapter progress (ids must match section ids). */
  chapters: Chapter[];
  sections: CaseStudySection[];
}

interface CoverSection {
  type: "cover";
  wordmark: Array<{ text: string; accent?: boolean }>;
  facts: Array<{ label: string; value: string }>;
  subtitle: string[];
  coverImage: ImageRef;
}

interface OverviewSection {
  type: "overview";
  id: string;
  num: string;
  kicker: string;
  index: Array<{ num: string; label: string }>;
  headline: string;
  lede: string;
  visual: ImageRef;
}

interface ChallengesSection {
  type: "challenge";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  problemWords: Array<{ base: string; strong: string }>;
  phoneCards: Array<{ image: ImageRef; offset?: "up" | "down" }>;
}

interface ProcessSection {
  type: "process";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  steps: Array<{ num: string; title: string; desc: string }>;
  visual: ImageRef;
}

interface Persona {
  title: string;
  role: string;
  variant: "rider" | "driver";
  pills: string[];
  phones: ImageRef[];
}

interface PersonasSection {
  type: "personas";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  personas: Persona[];
}

interface FinalSection {
  type: "final";
  id: string;
  num: string;
  kicker: string;
  headline: string;
  lede: string;
  showcase: ImageRef;
  journeyKicker: string;
  journey: Array<{ num: string; title: string; desc: string }>;
}

/**
 * Flexible editorial section used by non-app case studies (branding, campaigns…).
 * Renders any combination of: headline, lede paragraphs, tag pills, labeled
 * point blocks, a footnote paragraph, and one or more visuals.
 */
export interface EditorialSection {
  type: "editorial";
  id: string;
  num: string;
  kicker: string;
  theme?: "light" | "dark";
  headline?: string;
  lede?: string[];
  /** Small uppercase pill list, e.g. brand keywords or requirements. */
  tags?: string[];
  /** Labeled blocks with their own bullet list, e.g. colors or deliverables. */
  points?: Array<{ label?: string; items?: string[] }>;
  /** Closing paragraph that sits after tags/points. */
  footnote?: string;
  visual?: ImageRef;
  visuals?: ImageRef[];
}

/** Image-only section: a stacked sequence of full-width visuals, no copy. */
interface GallerySection {
  type: "gallery";
  id: string;
  num: string;
  images: ImageRef[];
}

interface EndingSection {
  type: "ending";
  word: string;
  tag: Array<{ text: string; accent?: boolean }>;
  visual: ImageRef;
  foot: string;
}

export type CaseStudySection =
  | CoverSection
  | OverviewSection
  | ChallengesSection
  | ProcessSection
  | PersonasSection
  | FinalSection
  | EditorialSection
  | GallerySection
  | EndingSection;

export const caseStudies: CaseStudyDocument[] = [
  {
    slug: "haocabs",
    assets: "/HaoCabs",
    hasWebp: true,
    brand: "HAO CABS",
    chapters: [
      { id: "overview", num: "01", label: "Overview" },
      { id: "challenges", num: "02", label: "Challenges" },
      { id: "process", num: "03", label: "Process" },
      { id: "personas", num: "04", label: "Personas" },
      { id: "final", num: "05", label: "Final" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "HAO" }, { text: "CABS", accent: true }],
        facts: [
          { label: "Platform", value: "Mobile App" },
          { label: "Discipline", value: "UI/UX Design" },
          { label: "Scope", value: "UI/UX" },
          { label: "Year", value: "2026" },
        ],
        subtitle: ["A Taxi Bidding", "Experience App"],
        coverImage: {
          name: "1",
          alt: "HAO Cabs — Taxi bidding experience platform",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "overview",
        id: "overview",
        num: "01",
        kicker: "01) PROJECT OVERVIEW",
        index: [
          { num: "01", label: "Overview" },
          { num: "02", label: "Challenge" },
          { num: "03", label: "Approach" },
          { num: "04", label: "Design" },
          { num: "05", label: "Outcome" },
        ],
        headline: "A Smarter Way To\nBook, **Bid & Ride.**",
        lede: "Hao Cabs is a modern taxi-bidding platform that reimagines traditional ride booking through real-time driver bidding. Instead of fixed fares, riders can compare multiple offers from nearby drivers and choose the ride that best fits their needs.",
        visual: {
          name: "1",
          alt: "HAO Cabs product promotional visual and editorial artwork",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "challenge",
        id: "challenges",
        num: "02",
        kicker: "02) CHALLENGES",
        headline: "Giving Riders More Choice Without **Adding Complexity.**",
        lede: "Traditional ride-booking experiences often provide limited control over pricing and ride options. Hao Cabs needed a simple bidding experience that could give riders greater choice while keeping the booking process fast, clear, and easy to understand.",
        problemWords: [
          { base: "LIMITED", strong: "CONTROL" },
          { base: "FIXED", strong: "FARES" },
          { base: "FEWER", strong: "OPTIONS" },
        ],
        phoneCards: [
          {
            image: { name: "2", alt: "Available driver bids", width: 1600, height: 1600 },
            offset: "up",
          },
          {
            image: { name: "4", alt: "Ride request screen", width: 1600, height: 1600 },
          },
          {
            image: {
              name: "5",
              alt: "Fare comparison and bidding interface",
              width: 1600,
              height: 1600,
            },
            offset: "down",
          },
        ],
      },
      {
        type: "process",
        id: "process",
        num: "03",
        kicker: "03) DESIGN PROCESS",
        headline: "From Understanding The Problem To Designing The Experience.",
        lede: "The design process focused on understanding ride-booking pain points, mapping Rider and Driver journeys, exploring user flows, and progressively refining the interface through wireframes, prototypes, and high-fidelity UI design.",
        steps: [
          { num: "01", title: "DISCOVER", desc: "Understanding the problem" },
          { num: "02", title: "DEFINE", desc: "Rider & Driver journeys" },
          { num: "03", title: "EXPLORE", desc: "User flows & wireframes" },
          { num: "04", title: "REFINE", desc: "Prototypes & iterations" },
          { num: "05", title: "DELIVER", desc: "High-fidelity UI" },
        ],
        visual: {
          name: "6",
          alt: "HAO Cabs design system, user flows and interface fragments",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "personas",
        id: "personas",
        num: "04",
        kicker: "04) USER PERSONAS",
        headline: "Designing For The People Behind Every Ride.",
        lede: "User personas helped define the needs, motivations, and pain points of Hao Cabs' target users. The focus was on riders looking for affordable and reliable transportation, with features such as fare comparison, live tracking, secure payments, and scheduled rides supporting their everyday needs.",
        personas: [
          {
            title: "RIDER",
            role: "The Passenger",
            variant: "rider",
            pills: [
              "Fare comparison",
              "Live tracking",
              "Secure payments",
              "Scheduled rides",
              "Choosing a driver",
            ],
            phones: [
              { name: "2", alt: "Rider fare comparison", width: 1600, height: 1600 },
              { name: "5", alt: "Rider selecting a driver", width: 1600, height: 1600 },
            ],
          },
          {
            title: "DRIVER",
            role: "The Driver",
            variant: "driver",
            pills: [
              "Receiving ride requests",
              "Submitting bids",
              "Managing rides",
              "Navigation & earnings",
            ],
            phones: [
              { name: "4", alt: "Driver receiving ride requests", width: 1600, height: 1600 },
              { name: "7", alt: "Driver earnings and trip management", width: 1600, height: 900 },
            ],
          },
        ],
      },
      {
        type: "final",
        id: "final",
        num: "05",
        kicker: "05) FINAL EXPERIENCE",
        headline: "A Transparent Ride-Booking Experience, From ##Bid To Destination.##",
        lede: "The final experience brings together real-time bidding, driver selection, OTP verification, live tracking, payments, scheduling, wallet management, and post-ride feedback into a unified mobile experience for Riders and Drivers.",
        showcase: {
          name: "3",
          alt: "HAO Cabs final mobile application — complete unified ride experience",
          width: 1600,
          height: 1600,
        },
        journeyKicker: "Product Story & Flow",
        journey: [
          { num: "01", title: "REQUEST", desc: "Passenger creates a ride request." },
          { num: "02", title: "BID", desc: "Nearby drivers submit their offers." },
          { num: "03", title: "CHOOSE", desc: "Passenger compares offers and selects a driver." },
          { num: "04", title: "VERIFY", desc: "OTP verification confirms the ride." },
          { num: "05", title: "TRACK", desc: "Passenger follows the ride in real time." },
          { num: "06", title: "PAY", desc: "Complete the payment securely." },
          {
            num: "07",
            title: "COMPLETE",
            desc: "Rate the experience and manage the trip afterward.",
          },
        ],
      },
      {
        type: "ending",
        word: "HAO CABS",
        tag: [{ text: "BID. " }, { text: "CHOOSE. ", accent: true }, { text: "RIDE." }],
        visual: {
          name: "1",
          alt: "HAO Cabs final brand statement artwork",
          width: 1600,
          height: 900,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
  {
    slug: "edios",
    assets: "/EDIOS",
    brand: "EDIOS",
    chapters: [
      { id: "brief", num: "01", label: "Brief" },
      { id: "challenge", num: "02", label: "Challenge" },
      { id: "concept", num: "03", label: "Concept" },
      { id: "construction", num: "04", label: "Construction" },
      { id: "language", num: "05", label: "Language" },
      { id: "typography", num: "06", label: "Typography" },
      { id: "system", num: "07", label: "System" },
      { id: "applications", num: "08", label: "Applications" },
      { id: "direction", num: "09", label: "Direction" },
      { id: "outcome", num: "10", label: "Outcome" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "EDIOS", accent: true }],
        facts: [
          { label: "Industry", value: "Video Production & Cinematography" },
          { label: "Project", value: "Brand Identity / Logo Design" },
          { label: "Role", value: "Brand & Visual Identity Designer" },
          { label: "Deliverables", value: "Logo Mark, Wordmark, Color System, Applications" },
        ],
        subtitle: ["Ideas. Frames.", "Stories in Motion."],
        coverImage: {
          name: "1",
          alt: "EDIOS — Video Production Studio",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "brief",
        num: "01",
        kicker: "01 — THE BRIEF",
        headline: "From Freelance Work To\nA Dedicated **Studio.**",
        lede: [
          "EDIOS was created for a freelance filmmaker and video editor who wanted to take his individual creative work to the next level by establishing a dedicated video production studio.",
          "The goal was to create a visual identity that could represent his work across cinematography, video production, editing, and creative storytelling.",
        ],
        tags: [
          "Edgy",
          "Modern",
          "Bold",
          "Futuristic",
          "Production-focused",
          "Recognizable at small sizes",
        ],
        footnote:
          "The identity needed to feel like a production brand, rather than a personal freelancer logo.",
      },
      {
        type: "editorial",
        id: "challenge",
        num: "02",
        kicker: "02 — THE CHALLENGE",
        headline: "Film Language Without\nThe **Obvious Icons.**",
        lede: [
          "The visual identity needed to communicate the world of filmmaking without relying on predictable camera or film-strip icons.",
          "The challenge was to create something simple enough to work as a logo, while still having a strong connection with video production.",
          "The mark also needed to work across different environments — from camera setups and production equipment to digital platforms, merchandise, posters, and social media.",
        ],
      },
      {
        type: "editorial",
        id: "concept",
        num: "03",
        kicker: "03 — THE CONCEPT",
        theme: "dark",
        headline: "Two Visual Cues,\nOne **EDIOS Mark.**",
        lede: [
          "The EDIOS symbol is built around two familiar visual cues from the world of video production.",
        ],
        points: [
          {
            label: "The Recording Indicator",
            items: [
              "The red accent takes inspiration from the red recording indicator seen on cameras and video interfaces.",
              "Recording → Action → Motion → Production",
            ],
          },
          {
            label: "The Play Button",
            items: [
              "The triangular element represents the universal play symbol, immediately connecting the identity with video.",
              "Video → Playback → Motion → Content",
            ],
          },
        ],
        footnote:
          "These two elements were combined with a geometric, camera-inspired structure to create a distinctive EDIOS logomark — a symbol that feels connected to video without directly illustrating a conventional camera.",
        visual: {
          name: "4",
          alt: "EDIOS logomark — recording indicator and play button symbolism",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "construction",
        num: "04",
        kicker: "04 — LOGO CONSTRUCTION",
        headline: "Built On A Strong\n**Geometric Grid.**",
        lede: [
          "The logomark uses a strong geometric structure with sharp edges and controlled negative space.",
          "The outer form creates a visual reference to a camera body, while the central opening gives the mark its own distinctive character.",
          "The right-facing triangle acts as the visual focal point, creating a sense of movement and forward motion.",
          "The overall construction was intentionally kept bold so that the mark remains recognizable when reduced to an icon or used independently from the wordmark.",
        ],
        visual: {
          name: "3",
          alt: "EDIOS logo construction — geometric grid and structure",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "language",
        num: "05",
        kicker: "05 — VISUAL LANGUAGE",
        theme: "dark",
        headline: "A Dark, Cinematic Palette With\nA Single **Bold Signal.**",
        lede: ["The visual direction was developed around a dark cinematic aesthetic."],
        points: [
          {
            label: "Metallic Red",
            items: [
              "Used as the foundation of the identity, creating a cinematic and professional appearance.",
            ],
          },
          {
            label: "White",
            items: ["Provides contrast and ensures the identity remains clean and highly legible."],
          },
          {
            label: "Maraschino Red",
            items: [
              "Used as the primary accent, inspired by the recording indicator and the energy of production.",
            ],
          },
        ],
        footnote:
          "The restrained palette allows red to function as an intentional visual signal rather than becoming an overwhelming brand color.",
        visual: {
          name: "8",
          alt: "EDIOS visual language — metallic red, white, and maraschino red palette",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "typography",
        num: "06",
        kicker: "06 — TYPOGRAPHY",
        headline: "Futuristic Letterforms,\n**Engineered To Match.**",
        lede: [
          "The wordmark follows the same geometric language as the symbol.",
          "EDIOS is treated with a custom-styled, futuristic typographic approach featuring:",
        ],
        tags: [
          "Geometric letterforms",
          "Clean spacing",
          "Strong horizontal structure",
          "Sharp, technical details",
          "High legibility",
        ],
        footnote:
          "The typography was designed to complement the logomark rather than compete with it, creating a cohesive relationship between symbol and wordmark.",
        visual: {
          name: "6",
          alt: "EDIOS typography — custom-styled futuristic wordmark",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "system",
        num: "07",
        kicker: "07 — LOGO SYSTEM",
        headline: "A Flexible System,\nNot A **Single Logo.**",
        lede: ["The identity was designed as a flexible system rather than a single logo."],
        points: [
          {
            label: "Primary Logo",
            items: ["Logomark + EDIOS wordmark + descriptor — EDIOS Video Production Studio."],
          },
          {
            label: "Secondary Mark",
            items: ["The EDIOS logomark alone can function as an independent brand asset."],
          },
        ],
        tags: [
          "Social media profile images",
          "Camera equipment",
          "Clothing",
          "Watermarks",
          "Production gear",
          "Video intros/outros",
          "App icons",
          "Merchandise",
        ],
        footnote:
          "The secondary mark makes the identity suitable for moments where a full wordmark doesn't fit.",
        visual: {
          name: "7",
          alt: "EDIOS logo system — primary and secondary mark variations",
          width: 1600,
          height: 900,
        },
      },
      {
        type: "editorial",
        id: "applications",
        num: "08",
        kicker: "08 — BRAND APPLICATIONS",
        headline: "Tested In Real\n**Production Environments.**",
        lede: [
          "To test the flexibility of the identity, the logo was explored across realistic production environments.",
        ],
        points: [
          {
            label: "Production Posters",
            items: ["Using the symbol as a graphic element within cinematic compositions."],
          },
          {
            label: "Monitor / Screen",
            items: [
              "Demonstrating how the identity can appear naturally within digital video environments.",
            ],
          },
          {
            label: "Merchandise",
            items: ["Testing the standalone logomark on apparel and production-related clothing."],
          },
          {
            label: "Microphone & Equipment",
            items: ["Exploring how the compact symbol can work on physical production equipment."],
          },
        ],
        footnote:
          "These applications helped validate the identity beyond a simple presentation board.",
        visuals: [
          { name: "9", alt: "EDIOS production poster application", width: 1600, height: 900 },
          { name: "10", alt: "EDIOS monitor and screen application", width: 1600, height: 900 },
          {
            name: "11",
            alt: "EDIOS merchandise and clothing application",
            width: 1080,
            height: 1080,
          },
          {
            name: "12",
            alt: "EDIOS microphone and equipment application",
            width: 1080,
            height: 1080,
          },
        ],
      },
      {
        type: "editorial",
        id: "direction",
        num: "09",
        kicker: "09 — DESIGN DIRECTION",
        headline: "Cinematic × Geometric ×\n**Edgy × Futuristic.**",
        lede: ["The final visual direction combines four key qualities."],
        tags: ["Cinematic", "Geometric", "Edgy", "Futuristic"],
        footnote:
          "Rather than using traditional filmmaking clichés, EDIOS uses a minimal geometric language to create a more contemporary production identity. The red accent provides energy, while black and white establish the cinematic foundation.",
      },
      {
        type: "editorial",
        id: "outcome",
        num: "10",
        kicker: "10 — THE OUTCOME",
        theme: "dark",
        headline: "A Mark That Travels\n**Beyond The Logo.**",
        lede: [
          "The final EDIOS identity establishes a visual presence that reflects the studio's core services while remaining flexible enough to grow with the business.",
          "The combination of the camera-inspired structure, play symbol, and recording-inspired red accent creates a mark that communicates video production in a simple and recognizable way.",
          "More importantly, the identity is designed to work beyond the logo itself — becoming a visual system that can be carried into films, equipment, social media, apparel, promotional material, and future brand experiences.",
        ],
      },
      {
        type: "ending",
        word: "EDIOS",
        tag: [
          { text: "Ideas. " },
          { text: "Frames. ", accent: true },
          { text: "Stories in Motion." },
        ],
        visual: {
          name: "1",
          alt: "EDIOS final brand statement artwork",
          width: 1600,
          height: 900,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
  {
    slug: "tiffinly",
    assets: "/tiffinly",
    hasWebp: true,
    brand: "TIFFINLY",
    chapters: [
      { id: "overview", num: "01", label: "Overview" },
      { id: "challenge", num: "02", label: "Challenge" },
      { id: "process", num: "03", label: "Process" },
      { id: "customer", num: "04", label: "Customer App" },
      { id: "provider", num: "05", label: "Provider App" },
      { id: "delivery", num: "06", label: "Delivery App" },
      { id: "system", num: "07", label: "Design System" },
      { id: "outcome", num: "08", label: "Outcome" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "TIFFIN**LY**" }],
        facts: [
          { label: "Platform", value: "3 Mobile Apps" },
          { label: "Discipline", value: "UI/UX Design" },
          { label: "Scope", value: "Multi-role UI/UX" },
          { label: "Year", value: "2026" },
        ],
        subtitle: ["One Ecosystem.", "Three Roles."],
        coverImage: {
          name: "1",
          alt: "Tiffinly — multi-role food subscription and delivery platform",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "overview",
        id: "overview",
        num: "01",
        kicker: "01) PROJECT OVERVIEW",
        index: [
          { num: "01", label: "Overview" },
          { num: "02", label: "Challenge" },
          { num: "03", label: "Approach" },
          { num: "04", label: "The Apps" },
          { num: "05", label: "Outcome" },
        ],
        headline: "A Food Subscription Experience\nBuilt For **Every Role.**",
        lede: "Tiffinly is a multi-role food subscription and delivery platform that connects customers with tiffin and meal providers — and both with delivery partners — through a single digital ecosystem. Three connected mobile experiences simplify subscription, ordering, provider management, and delivery workflows.",
        visual: {
          name: "2",
          alt: "Tiffinly connected mobile experience across three user roles",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "challenge",
        id: "challenge",
        num: "02",
        kicker: "02) CHALLENGES",
        headline: "Three Different Users,\n**One Unified Experience.**",
        lede: "Tiffinly's core challenge was to design one product ecosystem for three very different users — customers, tiffin providers, and delivery partners — without making any of the interfaces feel complicated. Each role demanded its own information hierarchy: discovery, choice, and delivery visibility for customers; operational control over menus, orders, and earnings for providers; and instant access to tasks, locations, and status updates for delivery partners.",
        problemWords: [
          { base: "THREE", strong: "ROLES" },
          { base: "COMPLEX", strong: "FLOWS" },
          { base: "ONE", strong: "SYSTEM" },
        ],
        phoneCards: [
          {
            image: {
              name: "5",
              alt: "Tiffinly user flow and wireframe exploration",
              width: 1600,
              height: 1067,
            },
            offset: "up",
          },
          {
            image: {
              name: "9",
              alt: "Tiffinly information architecture and interface frames",
              width: 1600,
              height: 1067,
            },
          },
          {
            image: {
              name: "10",
              alt: "Tiffinly delivery workflow and interface states",
              width: 1600,
              height: 1067,
            },
            offset: "down",
          },
        ],
      },
      {
        type: "process",
        id: "process",
        num: "03",
        kicker: "03) DESIGN PROCESS",
        headline: "A Complete Product Experience,\n**Not A Collection Of Screens.**",
        lede: "The project was approached as a complete product experience rather than a collection of individual screens. The workflow began with understanding the three user journeys, mapping each role's key actions, and translating those flows into mobile-first interfaces — before progressively refining them into a shared, high-fidelity UI system.",
        steps: [
          { num: "01", title: "DISCOVER", desc: "Understanding the three user journeys" },
          { num: "02", title: "DEFINE", desc: "Mapping key actions & flows" },
          { num: "03", title: "EXPLORE", desc: "Information architecture & wireframes" },
          { num: "04", title: "REFINE", desc: "Reusable components & states" },
          { num: "05", title: "DELIVER", desc: "High-fidelity mobile UI" },
        ],
        visual: {
          name: "6",
          alt: "Tiffinly design process, user flows and interface system",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "editorial",
        id: "customer",
        num: "04",
        kicker: "04 — THE CUSTOMER APP",
        headline: "From Discovery To\n**The Doorstep.**",
        lede: [
          "The customer app takes users from onboarding and profile setup to provider discovery, subscription plan selection, checkout and payment — then keeps them informed with clear order tracking and order details.",
          "Structured layouts, card-based grouping, and clear status indicators keep the experience fast to scan and effortless to act on, from choosing a provider to following a delivery in real time.",
        ],
        tags: [
          "Onboarding & Auth",
          "Provider Discovery",
          "Subscription Plans",
          "Checkout & Payment",
          "Order Tracking",
          "Order Details",
          "Profile & Settings",
        ],
        visual: {
          name: "3",
          alt: "Tiffinly customer app — discover, subscribe, pay and track",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "editorial",
        id: "provider",
        num: "05",
        kicker: "05 — THE PROVIDER APP",
        theme: "dark",
        headline: "Operational Control,\n**From Menu To Earnings.**",
        lede: [
          "The provider app helps tiffin providers run their business and daily operations from a single dashboard.",
        ],
        points: [
          {
            label: "Set Up & Verify",
            items: [
              "Authentication & verification",
              "Business and owner details",
              "Service area setup",
              "KYC & bank details",
            ],
          },
          {
            label: "Run Daily Operations",
            items: [
              "Provider dashboard & delivery timings",
              "Menu management",
              "Order management",
              "Delivery assignment",
            ],
          },
          {
            label: "Track Performance",
            items: ["Earnings & performance insights"],
          },
        ],
        footnote:
          "Everything a provider needs to manage offerings, deliveries, and earnings lives in one clear, operational interface.",
        visual: {
          name: "4",
          alt: "Tiffinly provider app — dashboard, menu and operations",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "editorial",
        id: "delivery",
        num: "06",
        kicker: "06 — THE DELIVERY PARTNER APP",
        headline: "Task-Focused Delivery,\n**End To End.**",
        lede: [
          "The delivery partner app is built around speed and clarity — giving partners instant access to their next task, pickup and drop-off locations, and navigation.",
          "Live delivery status updates, a simple completion flow, and a clear earnings and support view keep the whole workflow efficient from acceptance to delivery.",
        ],
        tags: [
          "Onboarding & Verification",
          "Delivery Dashboard",
          "Pickup & Drop-off",
          "Navigation",
          "Status Updates",
          "Delivery Completion",
          "Earnings & Support",
        ],
        visual: {
          name: "7",
          alt: "Tiffinly delivery partner app — task-based delivery and navigation",
          width: 1600,
          height: 1067,
        },
      },
      {
        type: "editorial",
        id: "system",
        num: "07",
        kicker: "07 — DESIGN SYSTEM",
        theme: "dark",
        headline: "One Visual System,\n**Three Connected Apps.**",
        lede: [
          "To keep three different apps feeling like one product, Tiffinly was built on a shared UI system that stays consistent across every role.",
        ],
        points: [
          {
            label: "Structured Layouts",
            items: ["Consistent grids and spacing across the entire ecosystem"],
          },
          {
            label: "Reusable Components",
            items: ["Shared cards, inputs, and navigation patterns"],
          },
          {
            label: "Clear Status Indicators",
            items: ["Order, delivery, and payment states visible at a glance"],
          },
          {
            label: "Strong Visual Hierarchy",
            items: ["Complex information made easy to scan and act upon"],
          },
        ],
        footnote:
          "A customer, provider, or delivery partner always recognizes the same product language — no matter which app they open.",
      },
      {
        type: "editorial",
        id: "outcome",
        num: "08",
        kicker: "08 — THE OUTCOME",
        headline: "A Complete Multi-Role\n**Mobile Ecosystem.**",
        lede: [
          "The result is a complete multi-role mobile UI ecosystem that covers the major workflows of Tiffinly — from onboarding and subscription selection to provider operations and final delivery.",
          "Tiffinly demonstrates Skédio's approach to designing structured digital products where multiple user roles, business operations, and customer experiences need to work together seamlessly.",
        ],
      },
      {
        type: "ending",
        word: "TIFFINLY",
        tag: [{ text: "ONE. " }, { text: "ECOSYSTEM. ", accent: true }, { text: "THREE ROLES." }],
        visual: {
          name: "1",
          alt: "Tiffinly final brand statement artwork",
          width: 1600,
          height: 1067,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
  {
    slug: "zedhealth",
    assets: "/ZedHealth",
    brand: "ZEDHEALTH",
    chapters: [
      { id: "overview", num: "01", label: "Overview" },
      { id: "brief", num: "02", label: "Brief" },
      { id: "home", num: "03", label: "Homepage" },
      { id: "about", num: "04", label: "About" },
      { id: "principles", num: "05", label: "Principles" },
      { id: "services", num: "06", label: "Services" },
      { id: "contact", num: "07", label: "Contact" },
      { id: "design", num: "08", label: "Design" },
      { id: "outcome", num: "09", label: "Outcome" },
    ],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "ZED" }, { text: "HEALTH", accent: true }],
        facts: [
          {
            label: "Category",
            value: "Healthcare / UI/UX Design / Web Development",
          },
          { label: "Client", value: "ZedHealth Administration" },
          { label: "Studio", value: "Skédio Creative Studio" },
          { label: "Status", value: "Completed" },
          { label: "Website", value: "https://zedhealth.co.zm/" },
        ],
        subtitle: ["Right Care.", "Right Provider."],
        coverImage: {
          name: "1",
          alt: "ZedHealth Administration — Right Care. Right Provider.",
          width: 1418,
          height: 1109,
        },
      },
      {
        type: "overview",
        id: "overview",
        num: "01",
        kicker: "01 — PROJECT OVERVIEW",
        index: [
          { num: "01", label: "Overview" },
          { num: "02", label: "Brief" },
          { num: "03", label: "Structure" },
          { num: "04", label: "Design & Build" },
          { num: "05", label: "Outcome" },
        ],
        headline: "Built To Strengthen\nThe System, **Not Sit Beside It.**",
        lede: "ZedHealth Administration is a healthcare third-party administrator connecting corporates and individuals with appropriate care, providers, and administration. Skédio designed and developed a four-page website that explains that role clearly, builds trust, and gives every audience a straightforward path to the right service. ZedHealth is not presented as a hospital or clinic — the site positions the organisation as the layer that makes healthcare access easier to manage.",
        visual: {
          name: "2",
          alt: "ZedHealth website hero — built to strengthen the system, not sit beside it",
          width: 1122,
          height: 1402,
        },
      },
      {
        type: "editorial",
        id: "brief",
        num: "02",
        kicker: "02 — THE BRIEF",
        headline: "Make A Complex\n**Healthcare Model Clear.**",
        lede: [
          "ZedHealth needed a digital home for a business that sits between corporates, individuals, providers, and care coordination. The website had to explain that model without making it feel clinical, bureaucratic, or difficult to navigate.",
          "The brief focused on a clean, professional presence that could speak to two audiences at once: organisations looking after their people, and individuals trying to find the right care or support.",
          "Phase 1 covered four core pages — Home, About Us, Services, and Contact Us — with clear content structure, a responsive front-end, and a contact and enquiry flow.",
        ],
        tags: [
          "Healthcare administration",
          "Corporate healthcare",
          "Individual care",
          "Trust",
          "Clarity",
          "Responsive",
        ],
        footnote:
          "The work was intentionally scoped to a focused first phase rather than an open-ended website programme.",
        visual: {
          name: "5",
          alt: "ZedHealth website introduction and healthcare outcomes messaging",
          width: 1448,
          height: 1086,
        },
      },
      {
        type: "editorial",
        id: "home",
        num: "03",
        kicker: "03 — HOMEPAGE",
        theme: "dark",
        headline: "Right Care.\n**Right Provider.**",
        lede: [
          "The homepage leads with ZedHealth's commitment to accessible, reliable, and innovative healthcare solutions across Zambia and beyond.",
          "From there, the page moves visitors from the promise into the practical: who ZedHealth supports, what the organisation does, and how to start a conversation.",
          "The visual hierarchy keeps the message calm and confident, with the brand line carrying the top of the page and clear service pathways doing the navigation work below it.",
        ],
        points: [
          {
            label: "Trust-first positioning",
            items: ["A clear statement of purpose before service detail."],
          },
          {
            label: "Two-audience navigation",
            items: ["Paths for corporates and individuals without splitting the experience."],
          },
          {
            label: "Conversion-focused contact",
            items: ["A visible enquiry route from every key decision point."],
          },
        ],
        visual: {
          name: "1",
          alt: "ZedHealth homepage — Right Care. Right Provider.",
          width: 1418,
          height: 1109,
        },
      },
      {
        type: "editorial",
        id: "about",
        num: "04",
        kicker: "04 — ABOUT, MISSION & VISION",
        headline: "Mission, Vision, And\n**Why It Matters.**",
        lede: [
          "The About page gives ZedHealth room to explain why it exists. The mission centres on transforming healthcare management through technology, transparency, and a shorter journey to appropriate treatment.",
          "The vision describes an inclusive healthcare ecosystem where quality and affordable care is accessible to corporates and individuals through efficient administration, technology, and responsible managed care.",
        ],
        tags: [
          "Inclusive healthcare",
          "Responsible managed care",
          "Technology & transparency",
          "Access for corporates and individuals",
        ],
        footnote:
          "The page keeps the purpose human: better administration should shorten the distance between a healthcare need and the right support.",
        visual: {
          name: "3",
          alt: "ZedHealth mission and vision display",
          width: 1536,
          height: 1024,
        },
      },
      {
        type: "editorial",
        id: "principles",
        num: "05",
        kicker: "05 — PRINCIPLES",
        theme: "dark",
        headline: "Five Principles,\n**Measured Against.**",
        lede: [
          "ZedHealth states the standards it is willing to be measured against. The website gives those principles room to breathe, so they read as commitments rather than slogans.",
        ],
        points: [
          {
            label: "Accessibility",
            items: ["Healthcare access designed around real people and real constraints."],
          },
          {
            label: "Affordability",
            items: ["A focus on quality care that remains within reach."],
          },
          {
            label: "Flexibility",
            items: ["Administration that adapts to different organisations and individuals."],
          },
          {
            label: "Quality Care",
            items: ["The standard every service and referral is measured against."],
          },
          {
            label: "Technology & Control",
            items: ["Better visibility, clearer administration, and responsible managed care."],
          },
        ],
        visual: {
          name: "4",
          alt: "ZedHealth five principles — accessibility, affordability, flexibility, quality care, technology and control",
          width: 1086,
          height: 1448,
        },
      },
      {
        type: "editorial",
        id: "services",
        num: "06",
        kicker: "06 — SERVICES",
        headline: "A Connected Set Of\n**Healthcare Services.**",
        lede: [
          "The Services page brings ZedHealth's offer into one readable system, so visitors can quickly identify the support that matches their situation.",
        ],
        points: [
          {
            label: "Health insurance claim administration",
            items: ["Structured administration that keeps claims and care moving."],
          },
          {
            label: "Patient assistance",
            items: ["Support for individuals navigating access to appropriate care."],
          },
          {
            label: "Medical referrals",
            items: ["A clearer route from need to the right provider."],
          },
          {
            label: "Telemedicine coordination",
            items: ["Connected access to remote healthcare support."],
          },
          {
            label: "Healthcare consultation",
            items: ["Guidance for organisations and individuals making care decisions."],
          },
          {
            label: "Hospital network management",
            items: ["Coordinated provider relationships across the care network."],
          },
          {
            label: "Corporate healthcare programmes",
            items: ["Healthcare administration shaped around an organisation and its people."],
          },
        ],
        visual: {
          name: "7",
          alt: "ZedHealth services and care ecosystem overview",
          width: 1254,
          height: 1254,
        },
      },
      {
        type: "editorial",
        id: "contact",
        num: "07",
        kicker: "07 — CONTACT",
        headline: "A Clear Path To\n**Start A Conversation.**",
        lede: [
          "The contact page keeps the next step simple. It gives corporates and individuals a direct way to ask about healthcare administration, patient support, provider networks, or a tailored programme.",
          "The enquiry flow was built into the site rather than left as an afterthought, so the website can move a visitor from understanding to action without friction.",
        ],
        visual: {
          name: "8",
          alt: "ZedHealth contact page — let's start a conversation",
          width: 1448,
          height: 1086,
        },
      },
      {
        type: "editorial",
        id: "design",
        num: "08",
        kicker: "08 — DESIGN & DEVELOPMENT",
        theme: "dark",
        headline: "A Calm, Confident\n**Visual System.**",
        lede: [
          "The visual direction draws on ZedHealth's green and gold brand cues, using deep greens for trust and warm neutral tones for clarity. The result feels professional without becoming cold or overly clinical.",
          "Typography, spacing, and content blocks were kept consistent across all four pages, with a responsive layout that preserves hierarchy from mobile to desktop.",
          "The front-end was tested across screen sizes and handed off with the assets and structure needed to keep the site coherent as it grows.",
        ],
        tags: [
          "Green & gold identity",
          "Clear hierarchy",
          "Consistent components",
          "Mobile-first layouts",
          "Accessible contrast",
          "Cross-device QA",
        ],
        visual: {
          name: "6",
          alt: "ZedHealth responsive website design and content system",
          width: 1122,
          height: 1402,
        },
      },
      {
        type: "editorial",
        id: "outcome",
        num: "09",
        kicker: "09 — THE OUTCOME",
        headline: "Phase One:\n**Live And Complete.**",
        lede: [
          "Phase 1 delivered a four-page ZedHealth Administration website with responsive layouts, a clear service structure, and a contact and enquiry flow. The site now gives the organisation a credible digital home for its healthcare administration and care-coordination work.",
          "Phase 2 was discussed as a potential future expansion. It is not part of the completed scope described here, and no additional features or results are claimed for it.",
        ],
        footnote:
          "The project demonstrates Skédio's approach to healthcare websites: understand the system, make the language clear, and build trust before asking for action.",
      },
      {
        type: "ending",
        word: "ZEDHEALTH",
        tag: [{ text: "Right Care. " }, { text: "Right Provider.", accent: true }],
        visual: {
          name: "3",
          alt: "ZedHealth mission and vision final brand statement",
          width: 1536,
          height: 1024,
        },
        foot: "End of case study — Skédio",
      },
    ],
  },
  {
    slug: "postfolio",
    assets: "/Postfolio",
    brand: "POSTFOLIO",
    chapters: [{ id: "gallery", num: "01", label: "Gallery" }],
    sections: [
      {
        type: "cover",
        wordmark: [{ text: "POSTFOLIO" }],
        facts: [],
        subtitle: [],
        coverImage: {
          name: "coverimage",
          ext: "jpeg",
          alt: "Postfolio — cover artwork",
          width: 1024,
          height: 768,
        },
      },
      {
        type: "gallery",
        id: "gallery",
        num: "01",
        images: [
          {
            name: "image2",
            ext: "jpeg",
            alt: "Postfolio — selected image 2",
            width: 1024,
            height: 768,
          },
          {
            name: "image3",
            ext: "jpeg",
            alt: "Postfolio — selected image 3",
            width: 1024,
            height: 768,
          },
          {
            name: "image4",
            ext: "jpeg",
            alt: "Postfolio — selected image 4",
            width: 1024,
            height: 768,
          },
          {
            name: "image5",
            ext: "jpeg",
            alt: "Postfolio — selected image 5",
            width: 1024,
            height: 768,
          },
          {
            name: "image6",
            ext: "jpeg",
            alt: "Postfolio — selected image 6",
            width: 1024,
            height: 768,
          },
          {
            name: "image7",
            ext: "jpeg",
            alt: "Postfolio — selected image 7",
            width: 1024,
            height: 768,
          },
          {
            name: "image8",
            ext: "jpeg",
            alt: "Postfolio — selected image 8",
            width: 1024,
            height: 768,
          },
          {
            name: "image9",
            ext: "jpeg",
            alt: "Postfolio — selected image 9",
            width: 1024,
            height: 768,
          },
          {
            name: "thankyou",
            ext: "jpeg",
            alt: "Postfolio — closing artwork",
            width: 1024,
            height: 768,
          },
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyDocument | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
