"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import {
  ArrowRight,
  Car,
  CarFront,
  ChevronDown,
  Columns2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { plateFont } from "@/lib/fonts";
import { FROM_PRICE, pairPrice } from "@/lib/site";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import {
  BENEFITS,
  HERO_DELAY,
  HERO_EASE,
  PLATE_STYLES,
  type PlateSide,
} from "./heroConfig";
import {
  seedFromHero,
  useHomeBuilderOptional,
} from "@/components/home/HomeBuilder";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import styles from "./Hero.module.css";

const BENEFIT_ICONS = {
  dvla: ShieldCheck,
  mail: Truck,
  collect: MapPin,
} as const;

const SIDE_OPTIONS = [
  { id: "front", label: "Front", Icon: Car },
  { id: "rear", label: "Rear", Icon: CarFront },
  { id: "pair", label: "Pair", Icon: Columns2 },
] as const;

/** Builder dropdown wording; the style names themselves are shared with PlateStyles */
const optionLabel = (s: (typeof PLATE_STYLES)[number]) =>
  s.id === "standard" ? "Standard (Legal)" : s.label;

function UkMark() {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export default function Hero() {
  const reduced = useHydrationSafeReducedMotion();
  const homeBuilder = useHomeBuilderOptional();
  const [play, setPlay] = useState(false);
  const [side, setSide] = useState<PlateSide>("front");
  const [styleId, setStyleId] = useState<string>(PLATE_STYLES[0].id);
  const [reg, setReg] = useState("AB12 CDE");
  const [mobile, setMobile] = useState(false);

  const selectedStyle = useMemo(
    () => PLATE_STYLES.find((s) => s.id === styleId) ?? PLATE_STYLES[0],
    [styleId],
  );

  const openHomeBuilder = (nextStyleId = styleId) => {
    const seed = seedFromHero({ reg, styleId: nextStyleId, side });
    if (homeBuilder) {
      homeBuilder.openBuilder(seed);
      return;
    }
    window.location.href = "/#build-your-plate";
  };

  // A pair has its own price — it is not two singles
  const fromPrice = (
    side === "pair" ? pairPrice(selectedStyle.id) : selectedStyle.from
  ).toFixed(2);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced) {
      setPlay(true);
      return;
    }
    if (document.documentElement.dataset.rpReveal === "1") {
      setPlay(true);
      return;
    }
    const onReveal = () => setPlay(true);
    window.addEventListener("rp-site-reveal", onReveal);
    return () => window.removeEventListener("rp-site-reveal", onReveal);
  }, [reduced]);

  const y = (desktop: number, phone: number) => (mobile ? phone : desktop);
  const blur = mobile ? 2 : 4;
  const delayScale = mobile ? 0.72 : 1;
  const d = (value: number) => value * delayScale;

  const show = play || !!reduced;
  const instant = !!reduced;

  const fadeUp = (
    delay: number,
    distance: number,
    duration = 0.35,
    withBlur = false,
  ) => {
    if (instant) return { opacity: 1, y: 0, ...(withBlur ? { filter: "blur(0px)" } : {}) };
    return {
      opacity: show ? 1 : 0,
      y: show ? 0 : distance,
      ...(withBlur
        ? { filter: show ? "blur(0px)" : `blur(${blur}px)` }
        : {}),
      transition: {
        duration: mobile ? Math.min(duration, 0.3) : duration,
        delay: show ? d(delay) : 0,
        ease: HERO_EASE,
      },
    };
  };

  return (
    <section className={styles.hero} aria-label="Hero">
      <m.div
        className={styles.bg}
        aria-hidden="true"
        initial={instant ? false : { scale: 1.015, opacity: 0.92 }}
        animate={
          show
            ? { scale: 1, opacity: 1 }
            : { scale: 1.015, opacity: 0.92 }
        }
        transition={{ duration: instant ? 0 : mobile ? 0.7 : 0.9, ease: HERO_EASE }}
      />
      <div className={styles.bgScrim} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />
      <NeonEdge play={show} fill="#05101c" spacer={false} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <m.div
            className={styles.badge}
            initial={instant ? false : { opacity: 0, y: y(10, 8), scale: 0.98 }}
            animate={
              show
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: y(10, 8), scale: 0.98 }
            }
            transition={{
              duration: instant ? 0 : mobile ? 0.26 : 0.3,
              delay: show ? d(HERO_DELAY.badge) : 0,
              ease: HERO_EASE,
            }}
          >
            <span className={styles.badgeIcon} aria-hidden="true">
              <ShieldCheck strokeWidth={2.4} />
            </span>
            DVLA-registered number plate supplier (RNPS 75449)
          </m.div>

          <h1 className={styles.headline}>
            {(
              [
                { text: "Replacement", delay: HERO_DELAY.line1 },
                { text: "Number Plates", delay: HERO_DELAY.line2 },
                {
                  text: `from £${FROM_PRICE.toFixed(2)} per plate`,
                  delay: HERO_DELAY.line3,
                  special: true,
                },
              ] as { text: string; delay: number; special?: boolean }[]
            ).map((line) => (
              <span key={line.text} className={styles.lineMask}>
                <m.span
                  className={`${styles.line} ${line.special ? styles.madeEasy : ""}`}
                  initial={
                    instant
                      ? false
                      : {
                          opacity: 0,
                          y: y(16, 10),
                          filter: `blur(${blur}px)`,
                        }
                  }
                  animate={
                    show
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {
                          opacity: 0,
                          y: y(16, 10),
                          filter: `blur(${blur}px)`,
                        }
                  }
                  transition={{
                    duration: instant ? 0 : mobile ? 0.32 : 0.42,
                    delay: show ? d(line.delay) : 0,
                    ease: HERO_EASE,
                  }}
                >
                  {line.text}
                  {line.special && show && !instant && (
                    <span
                      className={`${styles.madeEasySweep} ${styles.madeEasySweepPlay}`}
                      aria-hidden="true"
                    />
                  )}
                </m.span>
              </span>
            ))}
          </h1>

          <m.p
            className={styles.subtitle}
            initial={
              instant
                ? false
                : {
                    opacity: 0,
                    y: y(14, 10),
                    filter: `blur(${blur}px)`,
                  }
            }
            animate={fadeUp(HERO_DELAY.subtitle, y(14, 10), 0.35, true)}
          >
            Standard, 3D, 4D, 5D, Ghost and Bevel styles, made to order and
            priced per plate. Order online for Royal Mail delivery, or collect
            from our Ilford collection point.
          </m.p>

          <ul className={styles.benefits}>
            {BENEFITS.map((item, i) => {
              const Icon = BENEFIT_ICONS[item.id];
              return (
                <m.li
                  key={item.id}
                  className={styles.benefit}
                  initial={instant ? false : { opacity: 0, y: y(10, 8) }}
                  animate={
                    show
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: y(10, 8) }
                  }
                  transition={{
                    duration: instant ? 0 : mobile ? 0.26 : 0.32,
                    delay: show ? d(HERO_DELAY.benefits) + i * (mobile ? 0.05 : 0.07) : 0,
                    ease: HERO_EASE,
                  }}
                >
                  <span
                    className={`${styles.benefitIcon} ${show && !instant ? styles.benefitIconPlay : ""}`}
                    style={
                      show && !instant
                        ? { animationDelay: `${i * 70}ms` }
                        : undefined
                    }
                    aria-hidden="true"
                  >
                    <Icon strokeWidth={2} />
                  </span>
                  <span className={styles.benefitText}>
                    <strong>{item.title}</strong> {item.detail}
                  </span>
                </m.li>
              );
            })}
          </ul>
        </div>

        <div className={styles.cardSlot}>
          <m.div
            className={styles.cardWrap}
            initial={
              instant
                ? false
                : {
                    opacity: 0,
                    x: y(24, 0),
                    y: y(10, 14),
                    scale: mobile ? 1 : 0.985,
                    filter: `blur(${blur}px)`,
                  }
            }
            animate={
              show
                ? { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
                : {
                    opacity: 0,
                    x: y(24, 0),
                    y: y(10, 14),
                    scale: mobile ? 1 : 0.985,
                    filter: `blur(${blur}px)`,
                  }
            }
            transition={{
              duration: instant ? 0 : mobile ? 0.36 : 0.45,
              delay: show ? d(HERO_DELAY.card) : 0,
              ease: HERO_EASE,
            }}
          >
          <form
            className={styles.card}
            onSubmit={(e) => {
              e.preventDefault();
              openHomeBuilder();
            }}
          >
            <m.div
              className={styles.cardHeader}
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={fadeUp(HERO_DELAY.cardTitle, 8, 0.32)}
            >
              <h2 className={styles.cardTitle}>Build your plates</h2>
              <span className={styles.ukChip}>
                <span className={styles.ukFlag}>
                  <UkMark />
                </span>
                UK
                <ChevronDown size={14} strokeWidth={2.2} aria-hidden="true" />
              </span>
            </m.div>

            <m.div
              className={styles.plateField}
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={fadeUp(HERO_DELAY.cardInput, 8, 0.34)}
            >
              {show && !instant && (
                <span
                  className={`${styles.plateFieldSweep} ${styles.plateFieldSweepPlay}`}
                  aria-hidden="true"
                />
              )}
              <span className={styles.plateBlue} aria-hidden="true">
                <UkMark />
                UK
              </span>
              <input
                className={`${styles.plateInput} ${plateFont.className}`}
                value={reg}
                onChange={(e) => setReg(e.target.value.toUpperCase())}
                aria-label="Vehicle registration"
                autoComplete="off"
                spellCheck={false}
                maxLength={10}
              />
            </m.div>

            <m.div
              className={styles.segment}
              role="group"
              aria-label="Plate selection"
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={fadeUp(HERO_DELAY.segment, 8, 0.32)}
            >
              {SIDE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`${styles.segBtn} ${side === opt.id ? styles.segBtnActive : ""} ${side === opt.id && show && !instant && opt.id === "front" ? styles.segBtnIgnite : ""}`}
                  aria-pressed={side === opt.id}
                  onClick={() => setSide(opt.id)}
                >
                  <opt.Icon size={18} strokeWidth={2} aria-hidden="true" />
                  {opt.label}
                </button>
              ))}
            </m.div>

            <m.div
              className={styles.styleRow}
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={fadeUp(HERO_DELAY.style, 8, 0.32)}
            >
              <label className={styles.styleLabel} htmlFor="hero-style">
                Style
              </label>
              <select
                id="hero-style"
                className={styles.styleSelect}
                value={styleId}
                onChange={(e) => {
                  const next = e.target.value;
                  setStyleId(next);
                  // Choosing a style reveals the full homepage builder
                  openHomeBuilder(next);
                }}
              >
                {PLATE_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {optionLabel(s)}
                  </option>
                ))}
              </select>
            </m.div>

            <m.div
              initial={instant ? false : { opacity: 0, y: 8 }}
              animate={fadeUp(HERO_DELAY.cta, 8, 0.34)}
            >
              <button type="submit" className={styles.cta}>
                {show && !instant && (
                  <span
                    className={`${styles.ctaSweep} ${styles.ctaSweepPlay}`}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.ctaLabel}>
                  Build my plates — from £{fromPrice}
                </span>
                <ArrowRight
                  className={styles.ctaLabel}
                  size={16}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </button>
            </m.div>

            <m.p
              className={styles.price}
              initial={instant ? false : { opacity: 0, y: 6 }}
              animate={fadeUp(HERO_DELAY.price, 6, 0.3)}
            >
              From <strong>£{fromPrice}</strong>
              {side === "pair" ? " per pair" : " per plate"}
            </m.p>
          </form>
          </m.div>
        </div>
      </div>
    </section>
  );
}
