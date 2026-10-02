/**
 * Seconds — fill, hold, enlarge, hold, soft site crossfade
 *
 * 0.00–1.10  logo fill animation
 * 1.10–1.25  full white hold
 * 1.25–1.70  logo scale 1 → 1.12
 * 1.70–1.85  enlarged logo hold
 * 1.85–2.35  logo + backdrop fade out (site still hidden underneath)
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

/** Final logo scale (held after enlarge) */
export const LOGO_ENLARGE_SCALE = 1.12;

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_FILL = [0.45, 0, 0.2, 1] as const;
