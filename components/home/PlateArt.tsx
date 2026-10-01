import { plateFont } from "@/lib/fonts";
import styles from "./PlateArt.module.css";

/** UK plates are white (front) or yellow (rear) — never black */
export type PlateFace = "white" | "yellow";
export type PlateFinish = "standard" | "gel" | "acrylic" | "acrylicGel" | "ghost" | "bevel";

const FACE = { white: styles.white, yellow: styles.yellow } as const;
const FINISH = {
  standard: styles.standard,
  gel: styles.gel,
  acrylic: styles.acrylic,
  acrylicGel: styles.acrylicGel,
  ghost: styles.ghost,
  bevel: styles.bevel,
} as const;

/**
 * A CSS-drawn number plate. It sizes itself to its container's width (all
 * internals are in container units), so the same art works as a 60px chip
 * or a 600px hero piece. Decorative: always aria-hidden.
 */
export default function PlateArt({
  reg = "AB12 CDE",
  face = "yellow",
  finish = "standard",
  band = false,
  start = false,
  className,
}: {
  reg?: string;
  face?: PlateFace;
  finish?: PlateFinish;
  /** Blue UK identifier on the left */
  band?: boolean;
  /** Characters hug the left edge — for tight, cropped close-ups */
  start?: boolean;
  className?: string;
}) {
  return (
    <span className={`${styles.wrap} ${className ?? ""}`} aria-hidden="true">
      <span className={`${styles.plate} ${FACE[face]} ${FINISH[finish]} ${start ? styles.start : ""}`}>
        {band && (
          <span className={styles.band}>
            <svg viewBox="0 0 60 40">
              <rect width="60" height="40" fill="#012169" />
              <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
              <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
              <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
              <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
            </svg>
            UK
          </span>
        )}
        <span className={`${styles.chars} ${plateFont.className}`}>
          <span className={styles.base}>{reg}</span>
          <span className={styles.gloss}>{reg}</span>
        </span>
        <span className={styles.sheen} />
      </span>
    </span>
  );
}
