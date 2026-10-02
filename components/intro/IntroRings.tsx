"use client";

import { m } from "framer-motion";
import { EASE_FILL, EASE_PREMIUM, LOGO_ENLARGE_SCALE, TIMING } from "./timing";
import styles from "./OpeningIntro.module.css";

type Props = {
  reduced: boolean;
};

/**
 * The opening mark: the ReplacementPlates logo, dead centre of the screen.
 * It fades up dim, fills to full brightness from the bottom, catches a light
 * sweep, grows slightly, then fades as the site appears.
 */
export default function IntroRings({ reduced }: Props) {
  if (reduced) return null;

  const fillDuration = TIMING.fillEnd - TIMING.fillStart;
  const t = TIMING.complete;

  return (
    <m.div
      className={styles.logoGroup}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        // Appear → fill → hold → enlarge → hold → fade
        opacity: [0, 1, 1, 1, 1, 0],
        scale: [0.96, 1, 1, LOGO_ENLARGE_SCALE, LOGO_ENLARGE_SCALE, LOGO_ENLARGE_SCALE],
      }}
      transition={{
        duration: t,
        ease: EASE_PREMIUM,
        times: [
          0,
          TIMING.ringsIn / t,
          TIMING.enlargeStart / t,
          TIMING.enlargeEnd / t,
          TIMING.ringsFade / t,
          1,
        ],
      }}
    >
      {/* Dim base: the logo's silhouette before it lights up */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-rp.webp" alt="" width={922} height={194} className={`${styles.logo} ${styles.logoDim}`} />

      {/* Full-colour logo revealed bottom → top */}
      <m.div
        className={styles.logoFill}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: fillDuration, delay: TIMING.fillStart, ease: EASE_FILL }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rp.webp" alt="" width={922} height={194} className={styles.logo} />
      </m.div>

      <m.div
        className={styles.sweep}
        initial={{ x: "-45%", opacity: 0 }}
        animate={{ x: ["-45%", "145%"], opacity: [0, 0.4, 0.4, 0] }}
        transition={{
          duration: 0.32,
          delay: TIMING.whiteHold,
          ease: EASE_PREMIUM,
          times: [0, 0.18, 0.72, 1],
        }}
      />
    </m.div>
  );
}
