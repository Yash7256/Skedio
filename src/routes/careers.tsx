import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown, Loader2, Mail } from "lucide-react";
import { ScrollReveal } from "@/hooks/use-scroll-animation";
import { useContactForm } from "@/hooks/use-contact-form";
import { seo, canonicalLink } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { StructuredData } from "@/components/StructuredData";
import { SiteHeader } from "@/components/SiteHeader";
import { siteNavLinks } from "@/lib/site-nav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getBreadcrumbSchema, getWebPageSchema, type BreadcrumbItem } from "@/lib/schema";
import { careerRoles, hiringSteps, openApplicationRole } from "@/data/careers";

const PAGE_TITLE = "Careers at Skédio — Design, Build, Grow With Us";
const PAGE_DESCRIPTION =
  "Explore creative roles at Skédio. Join a small, design-led studio building brands and digital products people remember.";

const breadcrumbItems: BreadcrumbItem[] = [
  { name: "Home", item: "/" },
  { name: "Careers", item: "/careers" },
];

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  portfolio: "",
  resume: "",
  role: openApplicationRole,
  message: "",
};

function Careers() {
  const [formData, setFormData] = useState(initialFormData);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const { status, errorMessage, honey, handleHoneyChange, submit, reset, isSubmitting } =
    useContactForm({
      getBody: () => ({
        name: formData.name,
        email: formData.email,
        _replyto: formData.email,
        phone: formData.phone,
        portfolio: formData.portfolio,
        resume: formData.resume,
        role: formData.role,
        message: formData.message,
        _subject: `Application — ${formData.role} — ${formData.name} (Skedio Careers)`,
        _template: "table",
      }),
      errorCopy:
        "Something went wrong. Please try again or email your application to skediodesignspace@gmail.com",
      onSent: () => setFormData(initialFormData),
    });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit();
  };

  const applyFor = (role: string) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <StructuredData
        data={[
          getBreadcrumbSchema(breadcrumbItems),
          getWebPageSchema({
            path: "/careers",
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
          }),
        ]}
      />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <SiteHeader links={siteNavLinks("Careers")} />

      <Breadcrumbs
        items={breadcrumbItems}
        className="mx-auto w-full max-w-[1200px] px-6 pt-7 md:pt-8"
      />

      {/* ── Intro ───────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-14 pt-8 md:pb-20 md:pt-10">
        <ScrollReveal>
          <p className="eyebrow">Careers at Skédio</p>
        </ScrollReveal>

        <div className="mt-7 flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
          <div className="min-w-0 md:flex-1">
            <ScrollReveal>
              <h1 className="font-heading type-h1 sk-hero-title max-w-[18ch] font-light tracking-tight">
                Good work starts
                <br />
                with good people.
              </h1>
            </ScrollReveal>

            <ScrollReveal className="mt-7">
              <p className="type-body-lg max-w-[650px] leading-[1.6] text-muted-foreground">
                We are a design-led studio of thinkers, makers, and problem-solvers. If you care
                about craft, honest collaboration, and work that means something to the people on
                the other side of the screen, you will feel at home here.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal
            direction="fade"
            className="w-full md:w-[calc(40%_-_1.6rem)] md:min-w-[290px] md:shrink-0 md:pt-6 lg:pt-14"
          >
            <div className="w-full rounded-2xl border border-border/70 bg-surface p-8">
              <div className="flex items-center justify-between gap-4">
                <p className="type-label text-muted-foreground">The studio</p>
                <span className="h-px w-10 bg-primary/50" aria-hidden="true" />
              </div>
              <h2 className="font-heading mt-4 text-2xl font-light leading-tight tracking-tight sm:text-[1.75rem]">
                Life at Skédio
              </h2>
              <ul className="mt-6 space-y-5">
                {[
                  "Work across branding, digital products and experiences.",
                  "Take ideas from the first sketch to the final launch.",
                  "Collaborate directly with designers and developers.",
                ].map((item, idx) => (
                  <li key={item} className="flex gap-4">
                    <span className="type-caption mt-0.5 shrink-0 font-semibold text-primary">
                      0{idx + 1}
                    </span>
                    <span className="type-sm leading-relaxed text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#hiring-process"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                <span className="border-b border-primary/30 pb-0.5 transition-colors duration-200 group-hover:border-primary">
                  Discover how we work
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Open positions ──────────────────────────────────────────── */}
      <section
        id="openings"
        className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 pb-16 md:pb-20"
      >
        <div className="border-t border-border pt-14 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(280px,2fr)] md:gap-x-16">
            <ScrollReveal>
              <h2
                className="font-heading max-w-[15ch] font-light leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
              >
                We’re looking for good people.
              </h2>
              <p className="type-body mt-5 max-w-[560px] leading-[1.6] text-muted-foreground">
                No specific roles are listed right now. If the way we work sounds like you, send an
                open application and tell us what you would like to make.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="fade">
              <div className="border-t border-primary/30 pt-6">
                <a
                  href="#apply"
                  onClick={() => applyFor(openApplicationRole)}
                  className="group flex items-center justify-between gap-6 border-b border-border pb-5 transition-colors duration-200 hover:border-primary"
                >
                  <span>
                    <span className="block text-lg font-medium tracking-tight sm:text-xl">
                      Join the studio
                    </span>
                    <span className="type-sm mt-1 block text-muted-foreground">
                      Share your work and where you would like to contribute.
                    </span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </a>
              </div>
            </ScrollReveal>
          </div>

          {careerRoles.length > 0 && (
            <div className="mt-12 border-t border-border">
              {careerRoles.map((role, idx) => {
                const isExpanded = expandedRole === role.id;
                const hasMetadata = Boolean(
                  role.department ||
                  role.employmentType ||
                  role.workArrangement ||
                  role.experience ||
                  role.duration,
                );
                const detailsId = `role-${role.id}`;

                return (
                  <ScrollReveal key={role.id} delay={idx}>
                    <article className="border-b border-border">
                      <div className="group flex flex-col gap-5 py-7 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-8">
                        <button
                          type="button"
                          onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                          aria-expanded={isExpanded}
                          aria-controls={detailsId}
                          className="flex min-w-0 cursor-pointer items-start justify-between gap-6 text-left md:col-span-3 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:items-center"
                        >
                          <span className="min-w-0">
                            <span className="block text-xl font-medium tracking-tight sm:text-2xl">
                              {role.title}
                            </span>
                            {role.summary && (
                              <span className="type-sm mt-2 block text-muted-foreground">
                                {role.summary}
                              </span>
                            )}
                          </span>
                          {hasMetadata && (
                            <span className="type-sm flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
                              {role.department && <span>{role.department}</span>}
                              {role.employmentType && <span>{role.employmentType}</span>}
                              {role.workArrangement && <span>{role.workArrangement}</span>}
                              {role.experience && <span>{role.experience}</span>}
                              {role.duration && <span>{role.duration}</span>}
                            </span>
                          )}
                          <span
                            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-200 group-hover:border-primary ${
                              isExpanded
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            <ChevronDown
                              className={`size-4 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                        </button>
                        <a
                          href="#apply"
                          onClick={() => applyFor(role.title)}
                          className="group/apply inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover md:col-start-4"
                        >
                          Apply
                          <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover/apply:translate-x-0.5 group-hover/apply:-translate-y-0.5" />
                        </a>
                      </div>

                      {isExpanded && (
                        <div id={detailsId} className="pb-9">
                          <div className="grid gap-8 border-t border-border pt-7 md:grid-cols-2 md:gap-12">
                            <div>
                              {role.about && (
                                <>
                                  <h4 className="type-label font-semibold text-primary">
                                    About Skédio
                                  </h4>
                                  <p className="type-sm mt-3 leading-relaxed text-muted-foreground">
                                    {role.about}
                                  </p>
                                </>
                              )}
                              {role.responsibilities && role.responsibilities.length > 0 && (
                                <>
                                  <h4 className="type-label mt-8 font-semibold text-primary">
                                    What you’ll do
                                  </h4>
                                  <ul className="mt-4 space-y-3">
                                    {role.responsibilities.map((item) => (
                                      <li
                                        key={item}
                                        className="type-sm flex gap-3 text-muted-foreground"
                                      >
                                        <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                            <div>
                              {role.requirements && role.requirements.length > 0 && (
                                <>
                                  <h4 className="type-label font-semibold text-primary">
                                    What you’ll bring
                                  </h4>
                                  <ul className="mt-4 space-y-3">
                                    {role.requirements.map((item) => (
                                      <li
                                        key={item}
                                        className="type-sm flex gap-3 text-muted-foreground"
                                      >
                                        <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              <div className="mt-8">
                                <h4 className="type-label font-semibold text-primary">
                                  How to apply
                                </h4>
                                <p className="type-sm mt-3 leading-relaxed text-muted-foreground">
                                  Interested candidates can share their resume and portfolio via
                                  email:{" "}
                                  <a
                                    href={`mailto:${siteConfig.email}`}
                                    className="font-medium text-primary transition-colors hover:text-primary-hover"
                                  >
                                    {siteConfig.email}
                                  </a>
                                  . We’re looking for curiosity, creativity, and a willingness to
                                  learn. You don’t need to know everything; you just need to be
                                  ready to grow.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          )}

          <ScrollReveal className="mt-14 md:mt-16">
            <div className="grid gap-6 border-t border-border pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <h3 className="font-heading text-2xl font-light tracking-tight sm:text-3xl">
                  Don&apos;t see your role?
                </h3>
                <p className="type-body mt-3 max-w-xl text-muted-foreground">
                  We are always interested in people who care about craft. Introduce yourself and we
                  will start a conversation.
                </p>
              </div>
              <a
                href="#apply"
                onClick={() => applyFor(openApplicationRole)}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-hover"
              >
                <span className="border-b border-primary/30 pb-0.5 transition-colors duration-200 group-hover:border-primary">
                  Send an open application
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Dark band: the hiring process ───────────────────────────── */}
      <section id="hiring-process" className="scroll-mt-24 bg-ink text-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
          <ScrollReveal>
            <p className="eyebrow text-primary-light">What to expect</p>
            <h2
              className="font-heading mt-5 max-w-2xl font-light tracking-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.05 }}
            >
              A simple process, with real conversations.
            </h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {hiringSteps.map((item, idx) => (
              <ScrollReveal key={item.step} delay={idx}>
                <div className="h-full border-t border-white/25 pt-7">
                  <span className="font-heading text-4xl font-light text-primary-light/60">
                    {item.step}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="type-sm mt-3 leading-relaxed text-white/60">{item.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apply ───────────────────────────────────────────────────── */}
      <section
        id="apply"
        className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-6 py-16 md:py-24"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <ScrollReveal>
              <p className="eyebrow">Apply</p>
              <h2
                className="font-heading mt-5 font-light leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
              >
                Show us how you think.
              </h2>
              <p className="type-body mt-6 max-w-md text-muted-foreground">
                A link to your work and a short note are enough to start. Tell us what you enjoy
                making and what you would like to try next.
              </p>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-10 border-t border-border pt-8">
                <p className="type-label text-muted-foreground">Prefer email?</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group mt-3 inline-flex items-center gap-2.5 text-base font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  <Mail className="size-4" />
                  {siteConfig.email}
                  <ArrowUpRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="fade">
            <div className="rounded-2xl border border-border/80 bg-surface/60 p-7 sm:p-9">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <h3 className="font-heading mt-6 text-3xl font-light tracking-tight">
                    Application sent
                  </h3>
                  <p className="type-body mt-3 max-w-sm text-muted-foreground">
                    Thanks{formData.name ? `, ${formData.name.split(" ")[0]}` : ""} — your
                    application reached our inbox. We will be in touch soon.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full border border-border px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honey}
                    onChange={handleHoneyChange}
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="career-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="career-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="career-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Email <span className="text-primary">*</span>
                    </label>
                    <input
                      id="career-email"
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="career-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Contact Number
                    </label>
                    <input
                      id="career-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="career-role"
                        className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                      >
                        Role
                      </label>
                      <select
                        id="career-role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full cursor-pointer rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      >
                        {[...careerRoles.map((role) => role.title), openApplicationRole].map(
                          (role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="career-portfolio"
                        className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                      >
                        Portfolio / LinkedIn
                      </label>
                      <input
                        id="career-portfolio"
                        name="portfolio"
                        type="url"
                        placeholder="https://"
                        value={formData.portfolio}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="career-resume"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      Resume / Drive Link
                    </label>
                    <input
                      id="career-resume"
                      name="resume"
                      type="url"
                      placeholder="Paste your Google Drive resume link"
                      value={formData.resume}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="career-message"
                      className="block text-xs font-semibold uppercase tracking-wider text-foreground/80"
                    >
                      A little about you <span className="text-primary">*</span>
                    </label>
                    <textarea
                      id="career-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What kind of work do you enjoy making, and what would you like to explore here?"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full resize-y rounded-xl border border-border/80 bg-surface/60 px-4 py-3.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="text-sm text-destructive">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        Send Application
                        <ArrowUpRight className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: seo({
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: "/careers",
      type: "website",
    }),
    links: canonicalLink("/careers"),
  }),
  component: Careers,
});
