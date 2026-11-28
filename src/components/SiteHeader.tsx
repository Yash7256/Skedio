import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useContactModal } from "@/context/use-contact-modal";
import { cn } from "@/lib/utils";
import { WebpImage } from "@/components/WebpImage";

/** A nav item. `hash` is a section on `to`, used for the homepage anchors
 *  (see lib/site-nav.ts). `current` marks the page you are already on, rendered
 *  as text rather than a link so it cannot be activated. */
export type HeaderLink =
  { label: string; to: string; hash?: string; current?: false } | { label: string; current: true };

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <WebpImage
      src="/skedio-primary.png"
      alt="Skédio"
      width={818}
      height={297}
      className={cn("h-9 w-auto md:h-12", className)}
    />
  );
}

export function SiteHeader({ links }: { links: HeaderLink[] }) {
  const { openContactModal } = useContactModal();
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // How the menu was opened — focus is only moved into the menu for
  // keyboard users; mouse/touch users keep their context (no focus steal).
  const openMethod = useRef<"keyboard" | "pointer" | null>(null);
  // Set when the menu closes as a side effect of opening the contact modal,
  // so focus restoration doesn't yank focus out from under the modal.
  const suppressRestore = useRef(false);
  // Whether focus sits inside the menu right now. Tracked explicitly because
  // the closed menu is inert, and adding `inert` blurs whatever had focus —
  // so by the time the close effect runs, activeElement is already <body>.
  const focusInsideMenu = useRef(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    const mq = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (mq.matches) setMenuOpen(false);
    };

    if (menuOpen) window.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onViewportChange);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onViewportChange);
    };
  }, [menuOpen]);

  const handleCta = () => {
    suppressRestore.current = true;
    setMenuOpen(false);
    openContactModal();
  };

  // Focus management for the mobile menu dialog. On open via keyboard, move
  // focus to the Close button; on close, return focus to the trigger — but
  // only when focus is actually inside the menu (so mouse/touch users and
  // viewport-change closes never get their scroll position yanked).
  // preventScroll guards the sticky-header trigger from pulling the page.
  useEffect(() => {
    if (menuOpen) {
      if (openMethod.current === "keyboard") closeRef.current?.focus({ preventScroll: true });
      openMethod.current = null;
    } else {
      const hadFocusInside =
        focusInsideMenu.current || menuRef.current?.contains(document.activeElement);
      focusInsideMenu.current = false;
      if (!suppressRestore.current && hadFocusInside) {
        triggerRef.current?.focus({ preventScroll: true });
      }
      suppressRestore.current = false;
    }
  }, [menuOpen]);

  // Keep Tab / Shift+Tab cycling inside the open menu. The closed menu is
  // inert (see the container below), so the trap only needs to run while open.
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMenuOpen(false);
      return;
    }
    if (e.key !== "Tab" || !menuRef.current) return;
    const items = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.getClientRects().length > 0);
    if (items.length === 0) return;
    const first = items[0] as HTMLElement;
    const last = items[items.length - 1] as HTMLElement;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-5 md:px-12"
        >
          <Link to="/" aria-label="Skédio home">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-6 md:gap-4 lg:gap-10">
            <ul className="type-label hidden items-center gap-5 uppercase md:flex lg:gap-10">
              {links.map((link) =>
                link.current ? (
                  <li key={link.label}>
                    <span className="sk-nav-current type-body inline-block pb-1.5 tracking-[0.08em] text-primary">
                      {link.label}
                    </span>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      {...(link.hash ? { hash: link.hash } : {})}
                      className="type-body tracking-[0.08em] text-foreground/70 transition-colors duration-200 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={openContactModal}
                className="group type-button inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
              >
                Let's Talk
                <span className="grid size-8 place-items-center rounded-full bg-foreground/10 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="size-4" />
                </span>
              </button>
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openMethod.current = "keyboard";
              }}
              onPointerDown={() => {
                openMethod.current = "pointer";
              }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="site-mobile-menu"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-alt md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="site-mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        onFocus={() => {
          focusInsideMenu.current = true;
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            focusInsideMenu.current = false;
          }
        }}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-background transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
          menuOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">
          <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Skédio home">
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-alt"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-6 pb-10 pt-10"
        >
          {links.map((link) =>
            link.current ? (
              <span
                key={link.label}
                className="sk-nav-current block py-6 text-lg font-semibold text-primary sm:text-xl"
              >
                {link.label}
              </span>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                {...(link.hash ? { hash: link.hash } : {})}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-border/60 py-6 text-lg font-semibold text-foreground transition-colors hover:text-primary sm:text-xl"
              >
                {link.label}
                <ArrowUpRight className="size-5 text-foreground/40 transition-transform duration-250 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            ),
          )}

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <button
              type="button"
              onClick={handleCta}
              className="group type-button inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-primary-foreground transition-colors duration-250 ease-out hover:bg-primary-hover"
            >
              Let's Talk
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
