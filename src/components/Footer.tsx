import { ArrowUpRight, Instagram, Linkedin } from "lucide-react";

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

const columns = [
  { h: "Company", l: ["About Us", "Our Process", "Careers", "Contact"] },
  { h: "Services", l: ["Brand Strategy", "Brand Identity", "UI/UX", "Product Development"] },
  { h: "Work", l: ["Case Studies", "Clients"] },
  { h: "Resources", l: ["Blogs", "Medium"] },
];

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 bg-surface-alt text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-14 px-6 py-16 md:py-24 lg:grid-cols-[1.4fr_2.4fr_1.4fr]">
        <div>
          <Wordmark className="brightness-0 invert" />
          <p className="type-sm mt-5 max-w-xs leading-relaxed text-white/60">
            A creative studio building brands and digital experiences that drive impact and
            inspire growth.
          </p>
          <div className="mt-7 flex gap-5 text-white/70">
            <a href="#contact" aria-label="LinkedIn"><Linkedin className="size-5 transition-colors hover:text-primary-light" /></a>
            <a href="#contact" aria-label="Instagram"><Instagram className="size-5 transition-colors hover:text-primary-light" /></a>
            <a href="#contact" aria-label="Behance">
              <svg className="size-5 transition-colors hover:text-primary-light" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/></svg>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.h}>
              <h4 className="type-label uppercase tracking-[0.08em]">{col.h}</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/60">
                {col.l.map((x) => (
                  <li key={x}>
                    <a href="#contact" className="whitespace-nowrap transition-colors duration-200 hover:text-primary-light">{x}</a>
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

      <div className="px-2 leading-none">
        <img
          src="/skedio-primary.png"
          alt="Skédio"
          width={818}
          height={297}
          className="mx-auto -mb-6 w-full max-w-[min(92vw,900px)] brightness-0 invert opacity-[0.06]"
        />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 pt-3 pb-6 text-xs text-white/50">
          <p>© 2026 Skédio. All rights reserved.</p>
          <div className="flex gap-7">
            <a href="#contact" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#contact" className="transition-colors hover:text-white">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
