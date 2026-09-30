"use client";

import { m } from "framer-motion";
import {
  EASE_FILL,
  EASE_PREMIUM,
  RING_CENTERS,
  RING_CY,
  RING_ENLARGE_SCALE,
  RING_R,
  RING_STROKE,
  RING_VIEWBOX,
  TIMING,
} from "./timing";
import styles from "./OpeningIntro.module.css";

type Props = {
  reduced: boolean;
};

function RingsSvg({
  variant,
  className,
}: {
  variant: "chrome" | "metal";
  className?: string;
}) {
  const isMetal = variant === "metal";

  return (
    <svg
      className={className}
      viewBox={RING_VIEWBOX}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {isMetal ? (
          <>
            <linearGradient id="metalGrad" x1="0" y1="100" x2="0" y2="0">
              <stop offset="0%" stopColor="#D9DEE5" />
              <stop offset="28%" stopColor="#FFFFFF" />
              <stop offset="52%" stopColor="#F5F7FA" />
              <stop offset="78%" stopColor="#D9DEE5" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <linearGradient id="metalRim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
            </linearGradient>
          </>
        ) : (
          <linearGradient id="chromeGrad" x1="18" y1="8" x2="82" y2="92">
            <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="38%" stopColor="rgba(20,26,34,0.98)" />
            <stop offset="68%" stopColor="rgba(8,12,18,1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.07)" />
          </linearGradient>
        )}
      </defs>

      {RING_CENTERS.map((cx) => (
        <g key={cx}>
          <circle
            cx={cx}
            cy={RING_CY}
            r={RING_R}
            stroke={isMetal ? "url(#metalGrad)" : "url(#chromeGrad)"}
            strokeWidth={RING_STROKE}
            fill="none"
          />
          <circle
            cx={cx}
            cy={RING_CY}
            r={RING_R}
            stroke={
              isMetal ? "url(#metalRim)" : "rgba(255,255,255,0.065)"
            }
            strokeWidth={1.1}
            fill="none"
            opacity={isMetal ? 0.5 : 1}
          />
        </g>
      ))}
    </svg>
  );
}

export default function IntroRings({ reduced }: Props) {
  if (reduced) return null;

  const fillDuration = TIMING.fillEnd - TIMING.fillStart;
  const t = TIMING.complete;

  return (
    <m.div
      className={styles.ringsGroup}
      aria-hidden="true"
      style={{ transformOrigin: "center center" }}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{
        // Appear → white hold → enlarge → large hold → fade
        opacity: [0, 1, 1, 1, 1, 0],
        scale: [0.97, 1, 1, RING_ENLARGE_SCALE, RING_ENLARGE_SCALE, RING_ENLARGE_SCALE],
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
      <div className={styles.layer}>
        <RingsSvg variant="chrome" className={styles.ringSvg} />
      </div>

      <m.div
        className={`${styles.layer} ${styles.whiteLayer}`}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{
          duration: fillDuration,
          delay: TIMING.fillStart,
          ease: EASE_FILL,
        }}
      >
        <RingsSvg variant="metal" className={styles.ringSvg} />
      </m.div>

      <m.div
        className={styles.sweep}
        initial={{ x: "-45%", opacity: 0 }}
        animate={{ x: ["-45%", "145%"], opacity: [0, 0.35, 0.35, 0] }}
        transition={{
          duration: 0.26,
          delay: TIMING.whiteHold,
          ease: EASE_PREMIUM,
          times: [0, 0.18, 0.72, 1],
        }}
      />
    </m.div>
  );
}
