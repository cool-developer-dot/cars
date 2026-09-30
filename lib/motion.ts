import type { Variants } from "framer-motion";

/**
 * One motion language for the whole site:
 * opacity + small upward travel, premium ease, gentle stagger.
 *
 * Only opacity and transform are animated: the browser composites those on
 * the GPU. Animating `filter: blur()` repaints every element on every frame,
 * which is what made scrolling into a new section stutter.
 */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const REVEAL = {
  distance: 14,
  duration: 0.6,
  stagger: 0.07,
} as const;

/** Header pieces: pass the delay (seconds) as `custom` */
export const revealV: Variants = {
  hidden: {
    opacity: 0,
    y: REVEAL.distance,
  },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL.duration, delay, ease: EASE_PREMIUM },
  }),
};

/** Cards in a row/grid: pass the index as `custom` */
export const cardRevealV = (baseDelay = 0.18): Variants => ({
  hidden: {
    opacity: 0,
    y: REVEAL.distance + 4,
    scale: 0.985,
  },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: REVEAL.duration,
      delay: baseDelay + i * REVEAL.stagger,
      ease: EASE_PREMIUM,
    },
  }),
});

/** Shared whileInView props — run once */
export const inViewOnce = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.3 },
};
