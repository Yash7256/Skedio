import { createContext, useContext } from "react";

export type SmoothScrollTarget = number | string | HTMLElement;
export type SmoothScrollOptions = { offset?: number; immediate?: boolean };
export type SmoothScroll = (target: SmoothScrollTarget, options?: SmoothScrollOptions) => void;

export function nativeScrollTo(target: SmoothScrollTarget, options: SmoothScrollOptions = {}) {
  if (typeof window === "undefined") return;
  const offset = options.offset ?? 0;
  const top =
    typeof target === "number"
      ? target + offset
      : (() => {
          const el =
            typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
          if (!el) return null;
          return el.getBoundingClientRect().top + window.scrollY + offset;
        })();
  if (top == null) return;
  window.scrollTo({ top, behavior: options.immediate ? "instant" : "smooth" });
}

export const SmoothScrollContext = createContext<SmoothScroll>(nativeScrollTo);

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
