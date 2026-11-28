import { ArrowUpRight, Instagram, Linkedin, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useContactModal } from "@/context/use-contact-modal";
import { useContactForm } from "@/hooks/use-contact-form";
import { siteConfig } from "@/lib/site-config";
import { testimonials } from "@/data/testimonials";
import { WebpImage } from "@/components/WebpImage";

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <WebpImage
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={`h-12 w-auto ${className}`}
    />
  );
}

type FooterLink = { label: string; href: string } | { label: string; action: "contact" };

type FooterNavSection = {
  title: string;
  links: FooterLink[];
};

const navSections: FooterNavSection[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "Featured Work", href: "/projects" },
      { label: "Clients", href: "/#clients" },
      // The testimonials section renders nothing while its dataset is empty, so
      // a fixed link here would point at an anchor that does not exist.
      ...(testimonials.length > 0 ? [{ label: "Testimonials", href: "/#testimonials" }] : []),
    ],
  },
  {
    // Without these, /insights and its three articles were unreachable from
    // the homepage by any internal link — the entire insights cluster was
    // orphaned, linked only from the 404 page. The footer renders on every
    // page, so this is the one place that fixes reachability site-wide.
    title: "Read",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Insights", href: "/insights" },
    ],
  },
  {
    title: "Legal Policy",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  const { openContactModal } = useContactModal();
  const [footerEmail, setFooterEmail] = useState("");

  const { status, errorMessage, honey, handleHoneyChange, submit, isSubmitting } = useContactForm({
    getBody: (honey) => ({
      email: footerEmail,
      message: "Lead submitted via Footer newsletter / quick inquiry",
      _subject: `New Lead Email: ${footerEmail} (Skedio Studio)`,
    }),
    onSent: () => setFooterEmail(""),
  });

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail) return;
    void submit();
  };

  return (
    <footer id="contact" className="scroll-mt-24 bg-surface-alt text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1.4fr_2.4fr_1.4fr]">
        <div>
          <Wordmark className="brightness-0 invert" />
          <p className="type-sm mt-5 max-w-xs leading-relaxed text-white/60">
            A creative studio building brands and digital experiences that drive impact and inspire
            growth.
          </p>
          <div className="mt-7 flex gap-5 text-white/70">
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5 transition-colors hover:text-primary-light" />
            </a>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="size-5 transition-colors hover:text-primary-light" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {navSections.map((col) => (
            <div key={col.title}>
              <p className="type-label whitespace-nowrap uppercase tracking-[0.08em]">
                {col.title}
              </p>
              <ul className="mt-5 space-y-3 text-sm text-white/60">
                {col.links.map((x) => (
                  <li key={x.label}>
                    {"action" in x ? (
                      <button
                        type="button"
                        onClick={openContactModal}
                        className="cursor-pointer whitespace-nowrap transition-colors duration-200 hover:text-primary-light"
                      >
                        {x.label}
                      </button>
                    ) : x.href.startsWith("/") && !x.href.startsWith("/#") ? (
                      <Link
                        to={x.href}
                        className="whitespace-nowrap transition-colors duration-200 hover:text-primary-light"
                      >
                        {x.label}
                      </Link>
                    ) : (
                      <a
                        href={x.href}
                        className="whitespace-nowrap transition-colors duration-200 hover:text-primary-light"
                      >
                        {x.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div>
          <p className="type-h6">Let's create something great</p>
          <p className="type-sm mt-5 text-white/60">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
          {/* Same tel: construction as /contact — the href strips every
              non-digit so dialling works, while the visible text keeps the
              spacing people read. */}
          <p className="type-sm text-white/60">
            <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}>{siteConfig.phone}</a>
          </p>
          {status === "sent" ? (
            <div className="mt-6 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400">
              <Check className="size-4" />
              <span>Sent</span>
            </div>
          ) : (
            <form
              className="mt-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1.5 pl-5 backdrop-blur-sm"
              onSubmit={handleFooterSubmit}
            >
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
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                disabled={isSubmitting}
                className="type-sm min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/60"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                aria-label="Subscribe"
                className="group grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-colors duration-250 hover:bg-primary-hover cursor-pointer"
              >
                <ArrowUpRight className="size-4 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          )}
          {errorMessage && <p className="mt-3 text-xs font-medium text-red-400">{errorMessage}</p>}
          <p className="type-xs mt-3 text-[11px] leading-relaxed text-white/60">
            By subscribing, you agree to receive occasional studio updates and consent to our{" "}
            <Link to="/privacy" className="underline transition-colors hover:text-white/80">
              Privacy Policy
            </Link>
            . You can unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="px-2 leading-none">
        <WebpImage
          src="/skedio-primary.png"
          alt="Skédio"
          width={818}
          height={297}
          loading="lazy"
          decoding="async"
          className="mx-auto -mb-6 w-full max-w-[min(92vw,900px)] brightness-0 invert opacity-[0.06]"
        />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 pt-3 pb-6 text-xs text-white/50">
          <p>© 2026 Skédio. All rights reserved.</p>
          <div className="flex gap-7">
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
