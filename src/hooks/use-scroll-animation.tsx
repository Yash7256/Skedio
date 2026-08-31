import { useEffect, useRef, type ReactNode } from "react";

/**
 * Hook to trigger GPU-accelerated reveal animations when elements enter the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("sk-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          el.classList.add("sk-revealed");
          observer.disconnect();
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return ref;
}

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "h1" | "h2" | "h3" | "p" | "span";
  direction?: "up" | "left" | "right" | "fade";
}) {
  const ref = useScrollReveal<HTMLElement>();

  const dirClass =
    direction === "up"
      ? "sk-reveal-up"
      : direction === "left"
        ? "sk-reveal-left"
        : direction === "right"
          ? "sk-reveal-right"
          : "sk-reveal-fade";

  return (
    <Tag
      ref={ref as never}
      style={{ transitionDelay: `${delay * 0.08}s` }}
      className={`sk-reveal-base ${dirClass} ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * 3D Subtle Tilt on Mouse Movement for premium cards
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    };

    const onMouseLeave = () => {
      el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return ref;
}
