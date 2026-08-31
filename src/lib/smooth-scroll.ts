/**
 * Lightweight, zero-dependency 120fps Smooth Scroll & Inertia Engine (Lenis-like)
 * Optimized for high refresh rate displays (60Hz, 120Hz, 144Hz+) with sub-pixel interpolation.
 */

interface SmoothScrollOptions {
  lerp?: number;
  duration?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
}

export class SmoothScroll {
  private targetScroll = 0;
  private currentScroll = 0;
  private maxScroll = 0;
  private isRunning = false;
  private isTouching = false;
  private lerpFactor: number;
  private wheelMultiplier: number;
  private rafId: number | null = null;
  private listeners: Array<() => void> = [];

  constructor(options: SmoothScrollOptions = {}) {
    this.lerpFactor = options.lerp ?? 0.085;
    this.wheelMultiplier = options.wheelMultiplier ?? 1.0;
  }

  public init() {
    if (typeof window === "undefined") return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Touch devices use native momentum scrolling for best touch feel
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch && window.innerWidth < 768) {
      return;
    }

    this.currentScroll = window.scrollY;
    this.targetScroll = window.scrollY;
    this.updateMaxScroll();

    const onWheel = (e: WheelEvent) => {
      // Allow ctrl/cmd + wheel zooming
      if (e.ctrlKey || e.metaKey) return;
      
      e.preventDefault();
      this.updateMaxScroll();
      
      const delta = e.deltaY * this.wheelMultiplier;
      this.targetScroll = Math.max(0, Math.min(this.targetScroll + delta, this.maxScroll));

      if (!this.isRunning) {
        this.isRunning = true;
        this.rafId = requestAnimationFrame(this.tick);
      }
    };

    const onResize = () => {
      this.updateMaxScroll();
    };

    const onScroll = () => {
      if (!this.isRunning) {
        this.currentScroll = window.scrollY;
        this.targetScroll = window.scrollY;
      }
    };

    // Global anchor interception for smooth gliding
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1 && href !== "#contact") {
        const elem = document.querySelector(href);
        if (elem) {
          e.preventDefault();
          this.scrollTo(elem as HTMLElement);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);

    this.listeners.push(() => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    });
  }

  private updateMaxScroll() {
    this.maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
  }

  private tick = () => {
    this.updateMaxScroll();
    
    // Sub-pixel linear interpolation
    const diff = this.targetScroll - this.currentScroll;
    this.currentScroll += diff * this.lerpFactor;

    if (Math.abs(diff) < 0.3) {
      this.currentScroll = this.targetScroll;
      window.scrollTo(0, this.currentScroll);
      this.isRunning = false;
      this.rafId = null;
      return;
    }

    window.scrollTo(0, this.currentScroll);
    this.rafId = requestAnimationFrame(this.tick);
  };

  public scrollTo(target: number | HTMLElement | string, offset = 0) {
    let top = 0;
    if (typeof target === "number") {
      top = target;
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) top = el.getBoundingClientRect().top + window.scrollY;
    } else if (target instanceof HTMLElement) {
      top = target.getBoundingClientRect().top + window.scrollY;
    }

    this.targetScroll = Math.max(0, Math.min(top + offset, this.maxScroll));
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  public destroy() {
    this.listeners.forEach((unsub) => unsub());
    this.listeners = [];
    this.isRunning = false;
  }
}

export const smoothScroll = new SmoothScroll();
