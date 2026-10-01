"use client";

import { useId, useRef } from "react";
import { useInView } from "framer-motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import styles from "./NeonEdge.module.css";

/*
 * The site's closing edge for a section: a long, gently tilted neon line that
 * kinks into a steeper diagonal rising to the right. Drawn in a 1440×140 box
 * stretched to the section's width; strokes stay crisp via non-scaling-stroke.
 *
 * Place it as the last child of a positioned section. The slab under the line
 * is painted in `fill` — the colour the next section starts with — so the
 * line reads as the seam between the two.
 */
const LINE = "M0 12 L1030 128 L1440 46";
const SLAB = `${LINE} L1440 141 L0 141 Z`;

type Props = {
  /** Top colour of the section below; omit when the background carries on */
  fill?: string;
  /** Drive the draw-in yourself (the hero waits for its intro); otherwise it draws on scroll */
  play?: boolean;
  /** Add in-flow space so the section's content clears the edge */
  spacer?: boolean;
  /** Light section above: softer halo so the line stays crisp on pale backgrounds */
  light?: boolean;
};

export default function NeonEdge({ fill, play, spacer = true, light = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const reduced = useHydrationSafeReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.6 });
  // The spark only runs while the edge is on screen
  const onScreen = useInView(ref);

  const drawn = play ?? seen;
  const state = reduced
    ? styles.still
    : `${drawn ? styles.play : ""} ${drawn && onScreen ? styles.live : ""}`;

  const box = { viewBox: "0 0 1440 140", preserveAspectRatio: "none" } as const;

  return (
    <>
      {spacer && <div className={styles.spacer} aria-hidden="true" />}
      <div
        ref={ref}
        className={`${styles.edge} ${light ? styles.light : ""} ${state}`}
        aria-hidden="true"
      >
        <span className={styles.bloom} />
        <svg className={styles.layer} {...box}>
          <defs>
            <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(40, 120, 230)" stopOpacity={light ? 0.14 : 0.3} />
              <stop offset="70%" stopColor="rgb(40, 120, 230)" stopOpacity="0" />
            </linearGradient>
            {/* A white-hot core vanishes on a pale section; go deep blue there */}
            <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={light ? "#0a5cff" : "#1f7dff"} stopOpacity="0.6" />
              <stop offset="45%" stopColor={light ? "#1477ff" : "#4fb8ff"} />
              <stop offset="72%" stopColor={light ? "#2f95ff" : "#c9efff"} />
              <stop offset="100%" stopColor={light ? "#0a66ff" : "#3aa2ff"} stopOpacity="0.85" />
            </linearGradient>
          </defs>
          {fill && <path d={SLAB} fill={fill} />}
          <path d={SLAB} fill={`url(#${id}-sheen)`} />
        </svg>
        <svg className={`${styles.layer} ${styles.lines}`} {...box}>
          <path className={styles.halo} d={LINE} />
          <path className={styles.glow} d={LINE} />
          <path className={styles.core} d={LINE} stroke={`url(#${id}-stroke)`} />
        </svg>
        <svg className={`${styles.layer} ${styles.spark}`} {...box}>
          <path className={styles.sparkLine} d={LINE} />
        </svg>
      </div>
    </>
  );
}
