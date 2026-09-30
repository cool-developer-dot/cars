"use client";

import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import {
  ArrowRight,
  FileSearch,
  RectangleHorizontal,
  Search,
  ShieldAlert,
  Truck,
  VenetianMask,
} from "lucide-react";
import { cardRevealV, inViewOnce, revealV } from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import bgCar from "@/public/reasons/bg-car.webp";
import { REASONS, type ReasonIcon } from "./commonReasonsConfig";
import styles from "./CommonReasons.module.css";

const ICONS: Record<ReasonIcon, typeof Search> = {
  damaged: ShieldAlert,
  mot: FileSearch,
  stolen: VenetianMask,
  lost: Search,
  single: RectangleHorizontal,
  trailer: Truck,
};

const cardV = cardRevealV(0.05);
const cardViewport = { once: true, amount: 0.25 };

export default function CommonReasons() {
  const reduced = useHydrationSafeReducedMotion();

  const inView = reduced ? {} : inViewOnce;
  const rv = reduced ? undefined : revealV;

  return (
    <section className={styles.section} aria-labelledby="common-reasons-title">
      {/* Studio light rising out of the navy Plate Styles section above */}
      <div className={styles.studio} aria-hidden="true" />
      <div className={styles.backdrop} aria-hidden="true">
        <Image
          src={bgCar}
          alt=""
          className={styles.bgCar}
          sizes="(max-width: 700px) 220px, 420px"
        />
        <svg
          className={styles.contours}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M-40 250C260 120 520 110 760 170S1220 320 1500 140" />
          <path d="M-40 690C300 560 610 590 880 660S1260 720 1500 560" />
          <path d="M-40 820C340 720 640 760 920 800S1300 830 1500 720" />
        </svg>
      </div>

      <div className={styles.inner}>
        <m.header className={styles.header} {...inView}>
          <div>
            <m.p
              className={styles.eyebrow}
              variants={rv}
              custom={0}
            >
              <span className={styles.eyebrowLine} aria-hidden="true" />
              Common reasons
            </m.p>
            <m.h2
              id="common-reasons-title"
              className={styles.title}
              variants={rv}
              custom={0.06}
            >
              Why are you replacing
              <br />
              <span className={styles.titleAccent}>your plates?</span>
            </m.h2>
          </div>
          <m.p
            className={styles.intro}
            variants={rv}
            custom={0.14}
          >
            From damage to loss or MOT issues, choose the reason that matches
            your situation.
          </m.p>
        </m.header>

        <ul className={styles.grid}>
          {REASONS.map((reason, i) => {
            const Icon = ICONS[reason.icon];
            return (
              <m.li
                key={reason.id}
                className={styles.item}
                // each card reveals as it enters; stagger resets per row of 3
                custom={i % 3}
                variants={reduced ? undefined : cardV}
                {...(reduced ? {} : { ...inViewOnce, viewport: cardViewport })}
              >
                <Link
                  href={`/build?reason=${reason.id}`}
                  className={styles.card}
                >
                  <div className={styles.media}>
                    <Image
                      src={reason.image}
                      alt={reason.alt}
                      fill
                      className={styles.photo}
                      sizes="(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 420px"
                      placeholder="blur"
                      // Below the fold: lazy, so they never compete with the
                      // hero image; the browser starts them well before view
                    />
                  </div>

                  <div className={styles.body}>
                    <span className={styles.icon} aria-hidden="true">
                      <Icon strokeWidth={1.9} />
                    </span>
                    <div className={styles.text}>
                      <h3 className={styles.cardTitle}>{reason.title}</h3>
                      <p className={styles.cardDesc}>{reason.description}</p>
                    </div>
                    <span className={styles.arrow} aria-hidden="true">
                      <ArrowRight size={18} strokeWidth={2.3} />
                    </span>
                  </div>
                </Link>
              </m.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
