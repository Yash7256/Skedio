import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactModal } from "@/context/use-contact-modal";
import { seo, canonicalLink } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/lib/site-config";
import {
  responsiveFor,
  TEAM_PHOTO_SIZES,
  TEAM_PHOTO_WIDTH,
  TEAM_PHOTO_HEIGHT,
} from "@/lib/responsive-images";
import { SiteHeader } from "@/components/SiteHeader";
import { siteNavLinks } from "@/lib/site-nav";
import {
  getBreadcrumbSchema,
  getPersonSchema,
  getWebPageSchema,
  type BreadcrumbItem,
} from "@/lib/schema";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SocialLinks, type TeamSocials } from "@/components/SocialLinks";
import { WebpImage } from "@/components/WebpImage";
import teamSocialsData from "@/data/team-socials.json";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  img?: string;
};

const socialsFor = (name: string): TeamSocials =>
  teamSocialsData.members.find((m) => m.name === name)?.socials ?? {};

const founder = {
  name: "Aakash Choudhary",
  role: "Founder & Creative Director",
  bio: "Aakash is a multidisciplinary designer focused on building meaningful brands and digital experiences. At Skédio, he leads creative direction, shapes ideas, and works closely with clients to turn business goals into thoughtful design.",
  expertise: ["UI/UX Design", "Brand Identity", "Product Strategy"],
  img: "/aakash.jpeg",
};

const team: TeamMember[] = [
  {
    name: "Rishabh Khatri",
    role: "Manager",
    bio: "Keeps projects, people, and timelines aligned while making sure ideas move smoothly from planning to execution.",
    expertise: ["Project Management", "Client Relations", "Operations"],
    img: "/rishabh.png",
  },
  {
    name: "Aman Raj",
    role: "Developer",
    bio: "Brings designs to life through fast, reliable, and scalable digital experiences built for the real world.",
    expertise: ["Frontend Development", "Web Design", "Implementation", "Performance"],
    img: "/aman.jpeg",
  },
  {
    name: "Harshita Upadhyay",
    role: "UI/UX Lead",
    bio: "Creates simple, intuitive, and meaningful digital experiences with a strong focus on usability and user needs.",
    expertise: ["Visual Design", "User Research", "Interaction Design"],
    img: "/harshita.jpeg",
  },
  {
    name: "Shrishti Kori",
    role: "Graphics Lead",
    bio: "Transforms ideas into expressive visual designs that help brands communicate with clarity and character.",
    expertise: ["Graphic Design", "Visual Identity", "Social Media", "Illustration"],
    img: "/shrishti.jpeg",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: seo({
      title: "About Skédio — Meet the Creative Minds & Studio Team",
      description:
        "Meet the multidisciplinary team of designers, strategists, and engineers at Skédio crafting high-impact brands and digital products.",
      url: "/about",
      type: "profile",
    }),
    links: canonicalLink("/about"),
  }),
  component: About,
});

function About() {
  const { openContactModal } = useContactModal();

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: "Home", item: "/" },
    { name: "About", item: "/about" },
  ];
  const breadcrumbs = getBreadcrumbSchema(breadcrumbItems);

  const allMembers = [founder, ...team];
  const personSchemas = allMembers.map((m) =>
    getPersonSchema({
      name: m.name,
      role: m.role,
      // Conditional spread rather than `image: m.img`: this project sets
      // exactOptionalPropertyTypes, which forbids an explicit undefined.
      ...(m.img ? { image: m.img } : {}),
      socials: Object.values(socialsFor(m.name)).filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      ),
    }),
  );

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={[
          breadcrumbs,
          ...personSchemas,
          getWebPageSchema({
            path: "/about",
            name: "About Skédio — Meet the Creative Minds & Studio Team",
            description: siteConfig.description,
          }),
        ]}
      />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <SiteHeader links={siteNavLinks("About")} />

      <Breadcrumbs
        items={breadcrumbItems}
        className="mx-auto w-full max-w-[1200px] px-6 pt-8 md:pt-10"
      />

      {/* ── About Intro ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pt-12 pb-16 md:pt-16 md:pb-24">
        {/* Label */}
        <ScrollReveal>
          <p className="eyebrow">About Us</p>
        </ScrollReveal>

        {/* Headline — primary visual statement, immediately below the label */}
        <ScrollReveal className="mt-5">
          <h1
            className="font-heading font-light leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5.5vw, 4rem)" }}
          >
            We Design Brands
            <br />
            That Mean Something.
          </h1>
        </ScrollReveal>

        {/* Body copy — tight below the headline */}
        <div className="mt-8 grid grid-cols-1 gap-y-5 md:grid-cols-[3fr_2fr] md:gap-x-12 md:gap-y-0">
          <ScrollReveal>
            <p className="type-body-lg max-w-lg text-muted-foreground">
              Skédio is a design-led creative studio helping ambitious businesses turn ideas into
              meaningful brands. From UI/UX design and brand identity to websites and marketing
              creative, we create work that looks distinctive, feels intentional, and delivers
              impact.
            </p>
          </ScrollReveal>

          {/* Closing statement — stronger weight, anchored to the right column */}
          <ScrollReveal direction="fade" className="md:flex md:items-end">
            <p className="type-body font-semibold text-foreground">
              We don't just make things look good. <br className="hidden sm:block" />
              We make them matter.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Full-width rule */}
      <div className="border-t border-border" />

      {/* ── Founder ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
        <ScrollReveal>
          <p className="eyebrow">Founder</p>
        </ScrollReveal>

        {/* Editorial two-column: portrait left, content right */}
        <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr] md:gap-16 lg:grid-cols-[320px_1fr]">
          {/* Portrait */}
          <ScrollReveal direction="left" className="md:sticky md:top-28 md:self-start">
            <div
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
              style={{ aspectRatio: "4/5" }}
            >
              <WebpImage
                src={founder.img}
                alt={founder.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </ScrollReveal>

          {/* Content */}
          <ScrollReveal direction="right" className="flex flex-col justify-center">
            <h2 className="font-heading text-3xl font-light tracking-tight md:text-4xl lg:text-5xl">
              {founder.name}
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {founder.role}
            </p>

            <p className="type-body mt-8 max-w-lg leading-relaxed text-muted-foreground">
              {founder.bio}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {founder.expertise.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <SocialLinks socials={socialsFor(founder.name)} className="mt-8" />
          </ScrollReveal>
        </div>
      </section>

      {/* Full-width rule */}
      <div className="border-t border-border" />

      {/* ── Our Team ────────────────────────────────────────────────── */}
      <section id="team" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 py-16 md:py-24">
        {/* Section header */}
        <div className="mb-14 md:mb-20">
          <ScrollReveal>
            <p className="eyebrow">Our Team</p>
            <h2
              className="font-heading mt-5 font-light tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.05 }}
            >
              People Behind the Work.
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="type-body mt-5 max-w-md text-muted-foreground">
              A multidisciplinary team of designers, thinkers, and builders working together to turn
              ideas into purposeful creative work.
            </p>
          </ScrollReveal>
        </div>

        {/* Editorial portrait strip — equal weight, editorial rhythm */}
        {/*
          Desktop: three equal columns in a row.
          Each portrait is the same aspect ratio and dimensions.
          The second portrait is nudged down slightly via margin-top
          to create editorial rhythm without implying hierarchy.
        */}
        <div className="mx-auto grid max-w-[760px] grid-cols-1 justify-items-center gap-x-12 gap-y-14 sm:grid-cols-2">
          {team.map((member, idx) => {
            const photo = member.img ? responsiveFor(member.img) : null;
            return (
              <ScrollReveal key={member.name} delay={idx} direction="up">
                <div className="group w-full max-w-[260px]">
                  {/* Portrait — identical compact dimensions for all team members */}
                  <div
                    className="w-full overflow-hidden rounded-2xl border border-border bg-surface"
                    style={{ aspectRatio: "4/5" }}
                  >
                    {photo ? (
                      <WebpImage
                        src={photo.src}
                        srcSet={photo.srcSet}
                        webpSrcSet={photo.webpSrcSet}
                        sizes={TEAM_PHOTO_SIZES}
                        width={TEAM_PHOTO_WIDTH}
                        height={TEAM_PHOTO_HEIGHT}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="size-full bg-surface-alt" />
                    )}
                  </div>

                  {/* Identity — equal typography weight */}
                  <div className="mt-5">
                    <h3 className="text-base font-semibold tracking-tight">{member.name}</h3>
                    <p className="mt-0.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-primary">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="type-sm mt-3 leading-relaxed text-muted-foreground">{member.bio}</p>

                  {/* Expertise tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {member.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-2.5 py-0.5 text-[0.625rem] font-medium tracking-[0.02em] text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Socials — only links with a value are rendered */}
                  <SocialLinks socials={socialsFor(member.name)} className="mt-4" />
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Full-width rule */}
      <div className="border-t border-border" />

      {/* ── Built With Purpose ──────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <ScrollReveal>
              <p className="eyebrow">Built With Purpose</p>
              <h2
                className="font-heading mt-5 font-light tracking-tight"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", lineHeight: 1.05 }}
              >
                More Than a Studio. <br className="hidden sm:block" />
                <span className="text-primary">A Creative Partner.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="type-body-lg mt-6 max-w-lg text-muted-foreground">
                We're not here to simply deliver designs. We collaborate, solve, create, and build
                alongside the brands we work with.
              </p>
              <Link
                to="/careers"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
              >
                See open roles
                <ArrowRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5" />
              </Link>
            </ScrollReveal>
          </div>

          {/* CTA anchored to the bottom-right of the grid cell */}
          <ScrollReveal direction="fade" className="md:pb-1">
            <button
              type="button"
              onClick={openContactModal}
              className="group type-button inline-flex cursor-pointer items-center gap-2.5 rounded-full bg-primary px-7 py-4 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
            >
              Let's build what's next
              <span className="grid size-7 place-items-center rounded-full bg-white/20 transition-transform duration-250 ease-out group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
            </button>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
