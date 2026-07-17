"use client";

import * as React from "react";
import Lenis from "lenis";

/**
 * Enables buttery-smooth, momentum-based window scrolling across the app.
 *
 * Nested scroll containers (chat, drawers, dropdowns, menus) opt out via the
 * `data-lenis-prevent` attribute so they keep scrolling natively.
 */
export function SmoothScroll() {
  React.useEffect(() => {
    // Respect users who prefer reduced motion — skip smoothing entirely.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lenis: Lenis | undefined;
    let rafId = 0;

    try {
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } catch {
      // If smooth-scroll can't initialize, fall back to native scrolling.
      return;
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);

  return null;
}
