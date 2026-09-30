"use client";

import Link from "next/link";
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { m, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { plateFont } from "@/lib/fonts";
import {
  EASE_PREMIUM,
  cardRevealV,
  inViewOnce,
  revealV,
} from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import { PRICES } from "@/lib/site";
import { SHOWCASE_STYLES, type ShowcaseStyle } from "./plateStylesConfig";
import styles from "./PlateStyles.module.css";

const FINISH_CLASS = {
  standard: styles.finishStandard,
  gel: styles.finishGel,
  acrylic: styles.finishAcrylic,
  acrylicGel: styles.finishAcrylicGel,
} as const;

const FACE_CLASS = {
  white: styles.faceWhite,
  black: styles.faceBlack,
  yellow: styles.faceYellow,
} as const;

// Only the front half of the reg sits inside the cropped stage
const REG = "AB12";
// Matches the mobile track's inline padding
const TRACK_GUTTER = 20;

/* ——— Motion ——— */

const cardV = cardRevealV(0.16);

// The plate settles into its pose just after its card lands — the one
// product "accent" moment in this section
const plateV: Variants = {
  hidden: { opacity: 0, x: "10%", y: "4%", rotate: 3 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, delay: 0.26 + i * 0.07, ease: EASE_PREMIUM },
  }),
};

/* ——— Card ——— */

function ShowcaseCard({
  item,
  index,
  reduced,
}: {
  item: ShowcaseStyle;
  index: number;
  reduced: boolean;
}) {
  const [shown, setShown] = useState(false);
  const pair = item.from * 2;

  // Cursor-follow spotlight + gentle plate parallax (mouse only)
  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLAnchorElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--px", (x - 0.5).toFixed(3));
      el.style.setProperty("--py", (y - 0.5).toFixed(3));
    },
    [reduced],
  );

  const onPointerLeave = useCallback((e: PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  }, []);

  return (
    <m.li
      className={styles.slide}
      custom={index}
      variants={reduced ? undefined : cardV}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: "some" }}
      onViewportEnter={() => setShown(true)}
    >
      <Link
        href={PRICES[item.id].href}
        className={`${styles.card} ${item.featured ? styles.cardFeatured : ""}`}
        data-shown={shown || reduced ? "true" : "false"}
        style={{ "--i": index } as CSSProperties}
        aria-label={`${item.title} — ${item.description} From £${item.from.toFixed(2)}, pair £${pair.toFixed(2)}`}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <span className={styles.spotlight} aria-hidden="true" />
        <span className={styles.beam} aria-hidden="true" />

        <div
          className={`${styles.stage} ${item.featured ? styles.stageFeatured : ""}`}
          aria-hidden="true"
        >
          <span className={styles.stageLight} />
          <span className={styles.stageFloor} />
          <m.div
            className={styles.plateEnter}
            custom={index}
            variants={reduced ? undefined : plateV}
          >
            <div className={styles.plateTilt}>
              <div
                className={`${styles.plate} ${FACE_CLASS[item.face]} ${FINISH_CLASS[item.finish]}`}
              >
                <span className={`${styles.chars} ${plateFont.className}`}>
                  <span className={styles.charsBase}>{REG}</span>
                  <span className={styles.charsGloss}>{REG}</span>
                </span>
                <span className={styles.plateSheen} />
                <span className={styles.plateSweep} />
                <span className={styles.plateFlare} />
              </div>
            </div>
          </m.div>
        </div>

        <div className={styles.body}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <p className={styles.cardDesc}>{item.description}</p>

          <div className={styles.cardFoot}>
            <div className={styles.prices}>
              <span className={styles.priceFrom}>
                From £{item.from.toFixed(2)}
              </span>
              <span className={styles.pricePair}>Pair £{pair.toFixed(2)}</span>
            </div>
            <span className={styles.arrow} aria-hidden="true">
              <ArrowRight size={18} strokeWidth={2.2} />
            </span>
          </div>
        </div>
      </Link>
    </m.li>
  );
}

/* ——— Section ——— */

export default function PlateStyles() {
  const reduced = useHydrationSafeReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  // Mobile carousel progress — the card snapped nearest the start edge
  const onTrackScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - TRACK_GUTTER - track.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
      best = slides.length - 1;
    }
    setActive(best);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft - TRACK_GUTTER,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const inView = reduced ? {} : inViewOnce;
  const rv = reduced ? undefined : revealV;

  return (
    <section className={styles.section} aria-labelledby="plate-styles-title">
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.inner}>
        <m.header className={styles.header} {...inView}>
          <div className={styles.headingGroup}>
            <m.p className={styles.eyebrow} variants={rv} custom={0}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              Plate styles
            </m.p>
            <m.h2
              id="plate-styles-title"
              className={styles.title}
              variants={rv}
              custom={0.06}
            >
              Choose your finish.
            </m.h2>
            <m.p className={styles.subtitle} variants={rv} custom={0.12}>
              Six premium styles, priced per plate.
            </m.p>
          </div>

          <m.div variants={rv} custom={0.16}>
            <Link href="/plate-styles" className={styles.viewAll}>
              View all styles
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.2} />
            </Link>
          </m.div>
        </m.header>

        <ul className={styles.track} ref={trackRef} onScroll={onTrackScroll}>
          {SHOWCASE_STYLES.map((item, i) => (
            <ShowcaseCard key={item.id} item={item} index={i} reduced={reduced} />
          ))}
        </ul>

        <div className={styles.dots} aria-label="Plate styles carousel">
          {SHOWCASE_STYLES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-current={active === i}
              aria-label={`Show ${item.title}`}
              className={`${styles.dot} ${active === i ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
