/**
 * Seconds — fill, hold, enlarge, hold, soft site crossfade
 *
 * 0.00–1.10  ring fill animation
 * 1.10–1.25  full white hold
 * 1.25–1.70  ring group scale 1 → 1.9
 * 1.70–1.85  large rings hold
 * 1.85–2.35  rings + backdrop fade out (site still hidden underneath)
 * 2.35       intro unmounts; site fades in and the hero entrance starts
 */
export const TIMING = {
  start: 0,
  ringsIn: 0.1,
  fillStart: 0.25,
  fillEnd: 1.1,
  whiteHold: 1.1,
  whiteHoldEnd: 1.25,
  enlargeStart: 1.25,
  enlargeEnd: 1.7,
  /** Large-ring hold ends; website + rings crossfade begins */
  websiteReveal: 1.85,
  ringsFade: 1.85,
  complete: 2.35,
} as const;

/** Final ring group scale (held after enlarge) */
export const RING_ENLARGE_SCALE = 1.9;

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_FILL = [0.45, 0, 0.2, 1] as const;

/** SVG geometry — 4 interlocking rings */
export const RING_VIEWBOX = "0 0 340 100";
export const RING_CY = 50;
export const RING_R = 40;
export const RING_STROKE = 9.5;
export const RING_CENTERS = [50, 110, 170, 230] as const;
