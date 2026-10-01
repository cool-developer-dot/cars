"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Truck } from "lucide-react";
import { cardRevealV, inViewOnce, revealV } from "@/lib/motion";
import HeroPhoto from "@/components/HeroPhoto";
import { HOME_FAQS } from "@/lib/faqs";
import { COMPANY } from "@/lib/site";
import FaqAccordion from "./FaqAccordion";
import styles from "./Faqs.module.css";
import NeonEdge from "@/components/NeonEdge/NeonEdge";

const TRUST = [
  { Icon: ShieldCheck, title: "DVLA-registered supplier", text: `(RNPS ${COMPANY.rnps})` },
  { Icon: Truck, title: "Royal Mail delivery", text: "UK-wide" },
  { Icon: MapPin, title: "Ilford collection", text: "Ready within 3 hours" },
];

const itemV = cardRevealV(0.08);

export default function Faqs() {
  // Always animate: MotionConfig handles reduced motion. Dropping the
  // variants after hydration left the content stuck at its hidden state.
  const inView = inViewOnce;
  const rv = revealV;

  return (
    <section
      id="faqs"
      className={styles.section}
      aria-labelledby="faqs-title"
    >
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <svg
          className={styles.arcs}
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M-60 520C220 330 520 250 820 260" />
          <path className={styles.arcGlow} d="M980 900C1180 860 1340 800 1500 690" />
          <path className={styles.arcBright} d="M980 900C1180 860 1340 800 1500 690" />
          <path d="M1060 120C1240 150 1380 220 1500 320" />
        </svg>
      </div>

      <div className={styles.inner}>
        <div className={styles.aside}>
          <m.header className={styles.header} {...inView}>
            <m.p className={styles.eyebrow} variants={rv} custom={0}>
              <span className={styles.eyebrowLine} aria-hidden="true" />
              FAQs
            </m.p>
            <m.h2
              id="faqs-title"
              className={styles.title}
              variants={rv}
              custom={0.06}
            >
              Got questions?
              <br />
              <span className={styles.titleAccent}>We’ve got answers.</span>
            </m.h2>
            <m.p className={styles.intro} variants={rv} custom={0.14}>
              Quick answers on delivery, collection, documents and prices.
              Still stuck? Our full FAQ page covers cancellations, warranty
              and the legal rules.
            </m.p>
          </m.header>

          <m.div
            className={styles.showcase}
            variants={itemV}
            custom={2}
            {...inViewOnce}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={styles.photoWrap}>
              <HeroPhoto
                alt="Black car at night with a yellow UK number plate"
                className={styles.photo}
              />
            </div>

            <ul className={styles.trust}>
              {TRUST.map(({ Icon, title, text }) => (
                <li key={title} className={styles.trustItem}>
                  <span className={styles.trustIcon} aria-hidden="true">
                    <Icon strokeWidth={1.8} />
                  </span>
                  <span>
                    <strong className={styles.trustTitle}>{title}</strong>
                    <span className={styles.trustText}>{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </m.div>
        </div>

        <div className={styles.listCol}>
          <FaqAccordion items={HOME_FAQS} firstOpen />
          <Link href="/faqs" className={styles.more}>
            More answers on delivery, documents and legal requirements
            <ArrowRight size={16} strokeWidth={2.3} aria-hidden="true" />
          </Link>
        </div>
      </div>
      {/* Into Get started (light) */}
      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
