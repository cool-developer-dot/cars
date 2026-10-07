"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Car,
  CarFront,
  Check,
  Clock3,
  Layers,
  MapPin,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { plateFont } from "@/lib/fonts";
import { pageBuildUrl, pagePrices, styleOf, type ProductContent } from "@/lib/products";
import { COMPANY, PRICES, gbp, type StyleId } from "@/lib/site";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import styles from "./ProductHero.module.css";

/*
 * Hero for a plate-style page (first used on /3d-number-plates): headline and
 * prices on the left over a rendered close-up of the plates, and a builder
 * card on the right that hands the registration, plate type and style to the
 * site's one builder on the homepage. Separate from the homepage hero; it
 * shares only the global type / spacing tokens and the site's colours.
 */

type Side = "front" | "rear" | "pair";

const SIDES: { id: Side; label: string; Icon: (p: { className?: string }) => ReactNode }[] = [
  { id: "front", label: "Front", Icon: (p) => <CarFront strokeWidth={2} aria-hidden="true" {...p} /> },
  { id: "rear", label: "Rear", Icon: (p) => <Car strokeWidth={2} aria-hidden="true" {...p} /> },
  { id: "pair", label: "Pair", Icon: (p) => <PairIcon {...p} /> },
];

type StyleTile = { id: StyleId; label: string; mark?: string; bevel?: boolean; smoked?: boolean };

/** Finishes offered in the card; prices come from lib/site.ts */
const STYLE_TILES: StyleTile[] = [
  { id: "standard", label: "Standard" },
  { id: "3d", label: "3D Gel" },
  { id: "4d", label: "4D", mark: "4D" },
  { id: "5d", label: "5D", mark: "5D" },
];
/** Styles without a standard tile, and the tile each one takes the place of */
const EXTRA_TILES: Partial<Record<StyleId, { tile: StyleTile; replaces: StyleId }>> = {
  bevel: { tile: { id: "bevel", label: "Bevel", bevel: true }, replaces: "3d" },
  // Ghost sits beside 3D Gel, its closest relative
  ghost: { tile: { id: "ghost", label: "Ghost", smoked: true }, replaces: "5d" },
};

/** Four tiles, always including the page's own style */
const tilesFor = (id: StyleId) => {
  const extra = EXTRA_TILES[id];
  if (!extra) return STYLE_TILES;
  return STYLE_TILES.map((t) => (t.id === extra.replaces ? extra.tile : t)).sort(
    // the extra tile goes last, after the standard ones
    (a, b) => Number(a.id === id) - Number(b.id === id),
  );
};

/** "Build my 3D plates" */
const SHORT: Partial<Record<StyleId, string>> = {
  standard: "standard",
  "3d": "3D",
  "4d": "4D",
  "5d": "5D",
  ghost: "Ghost",
  bevel: "Bevel",
};

const TRUST = [
  { Icon: ShieldCheck, title: "DVLA-registered supplier", detail: `(RNPS ${COMPANY.rnps})` },
  { Icon: Truck, title: "Royal Mail delivery", detail: "UK-wide" },
  { Icon: MapPin, title: "Ilford collection available", detail: "Ready within 3 hours" },
  { Icon: Clock3, title: "Order by 2pm Mon–Fri", detail: "Same-day dispatch aim" },
] as const;

/** The opening intro flags <html data-rp-reveal="1"> and fires this event when it hands over */
const onReveal = (cb: () => void) => {
  window.addEventListener("rp-site-reveal", cb);
  return () => window.removeEventListener("rp-site-reveal", cb);
};
const isRevealed = () => document.documentElement.dataset.rpReveal === "1";

/** Keep the last two words together so a heading never ends on one word */
const noOrphan = (text: string) => text.replace(/ (\S+)$/, "\u00a0$1");

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

function PairIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M6 7v10M2 12h1.5" />
      <path d="M10 10.5h8M10 13.5h6" />
    </svg>
  );
}

/** One plate, or a stacked pair — the option-card icons */
function PlateIcon({ pair }: { pair?: boolean }) {
  return (
    <svg viewBox="0 0 44 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
      {pair ? (
        <>
          <rect x="3" y="3" width="38" height="13" rx="3.5" />
          <rect x="3" y="20" width="38" height="13" rx="3.5" />
        </>
      ) : (
        <rect x="3" y="10" width="38" height="16" rx="3.5" />
      )}
    </svg>
  );
}

function StyleGlyph({ mark, bevel, smoked }: { mark?: string; bevel?: boolean; smoked?: boolean }) {
  return (
    <svg viewBox="0 0 48 30" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="44" height="26" rx="5" stroke="currentColor" strokeWidth="2.4" />
      {smoked && (
        // smoked characters: a tinted bar in place of a black one
        <rect x="11" y="11" width="26" height="8" rx="2.5" fill="currentColor" opacity="0.38" />
      )}
      {bevel && (
        // a faceted inner face: the angled, diamond-cut edge
        <path
          d="M15 10h18v10H15zM8 6l7 4M40 6l-7 4M8 24l7-4M40 24l-7-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      )}
      {mark && (
        <text x="24" y="20.5" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="800" fontFamily="inherit">
          {mark}
        </text>
      )}
    </svg>
  );
}

export default function ProductHero({
  product,
  art,
  nextFill = "#05101c",
}: {
  product: ProductContent;
  /** Top colour of the section below — the closing divider is filled with it */
  nextFill?: string;
  /** Rendered plates close-up: desktop and phone files in /public */
  art: { src: string; srcMobile: string; width: number; height: number; alt: string };
}) {
  const router = useRouter();
  const reduced = useHydrationSafeReducedMotion();
  const cardRef = useRef<HTMLFormElement>(null);
  const ownStyle = styleOf(product);
  const copy = product.hero;
  // Speciality formats limit the sides (oversized is a rear-only size)
  const sides = SIDES.filter((sd) => !product.format?.sides || product.format.sides.includes(sd.id));
  const singleSide: Side = product.format?.single ?? "front";
  const [reg, setReg] = useState(product.sampleReg ?? "AB12 CDE");
  const [side, setSide] = useState<Side>(singleSide);
  const [styleId, setStyleId] = useState<StyleId>(ownStyle);

  const own = { name: copy ? product.short : PRICES[ownStyle].name, ...pagePrices(product) };
  const picked = { name: PRICES[styleId].name, ...pagePrices(product, styleId) };
  const noun = copy?.noun ?? SHORT[styleId];

  // Wait for the opening intro to hand the page over (as the homepage does)
  const revealed = useSyncExternalStore(onReveal, isRevealed, () => false);
  const play = revealed || !!reduced;

  const pickSide = (next: Side) => {
    setSide(next);
    // Phones: the card sits above the option cards, so bring it into view
    if (window.matchMedia("(max-width: 899px)").matches) {
      cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }
  };

  const delay = (i: number) => ({ "--d": `${i * 70}ms` }) as CSSProperties;

  return (
    <section
      className={`${styles.hero} ${play ? styles.play : ""} ${reduced ? styles.still : ""}`}
      aria-labelledby="product-hero-title"
    >
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />
      <NeonEdge play={play} fill={nextFill} spacer={false} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} ${styles.anim}`} style={delay(0)}>
            {copy?.eyebrow ?? `${own.name} plates`}
          </p>
          <h1 id="product-hero-title" className={`${styles.title} ${styles.anim}`} style={delay(1)}>
            <span className={styles.titleLine}>{noOrphan(product.h1)}</span>{" "}
            <span className={styles.titleLine}>
              from <span className={styles.price}>{gbp(own.single)}</span> per&nbsp;plate
            </span>
          </h1>
          <p className={`${styles.lead} ${styles.anim}`} style={delay(2)}>
            {product.lead}
          </p>
        </div>

        <div className={`${styles.art} ${styles.anim}`} style={delay(3)}>
          <picture>
            <source media="(max-width: 899px)" srcSet={art.srcMobile} />
            <img
              src={art.src}
              alt={art.alt}
              width={art.width}
              height={art.height}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        <div className={styles.options}>
          <h2 className={`${styles.buyTitle} ${styles.anim}`} style={delay(3)}>
            {product.buy?.title ?? (
              <>
                Buy {own.name} number plates from {gbp(own.single)} per&nbsp;plate
              </>
            )}
          </h2>
          <div className={styles.optionGrid}>
            <button
              type="button"
              className={`${styles.option} ${styles.anim}`}
              style={delay(4)}
              aria-pressed={side !== "pair" && styleId === ownStyle}
              onClick={() => {
                setStyleId(ownStyle);
                pickSide(singleSide);
              }}
            >
              <span className={styles.optionIcon}>
                <PlateIcon />
              </span>
              <span className={styles.optionText}>
                <strong>
                  {copy?.single.title ?? product.buy?.single.title ?? `Single front or rear ${SHORT[ownStyle]} plates`}
                </strong>
                <span>
                  {copy || product.buy ? (
                    (copy ?? product.buy)!.single.text
                  ) : (
                    <>Order one plate — front or rear&nbsp;— at&nbsp;{gbp(own.single)}.</>
                  )}
                </span>
              </span>
            </button>
            <button
              type="button"
              className={`${styles.option} ${styles.anim}`}
              style={delay(5)}
              aria-pressed={side === "pair" && styleId === ownStyle}
              onClick={() => {
                setStyleId(ownStyle);
                pickSide("pair");
              }}
            >
              <span className={styles.optionIcon}>
                <PlateIcon pair />
              </span>
              <span className={styles.optionText}>
                {copy || product.buy ? (
                  <>
                    <strong>{(copy ?? product.buy)!.pair.title}</strong>
                    <span>{(copy ?? product.buy)!.pair.text}</span>
                  </>
                ) : (
                  <>
                    <strong>
                      Matching pairs of {own.name} plates — {gbp(own.pair)} per&nbsp;pair
                    </strong>
                    <span>Order both plates together at&nbsp;{gbp(own.pair)} for the&nbsp;pair.</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <form
          ref={cardRef}
          className={`${styles.card} ${styles.anim}`}
          style={delay(2)}
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              pageBuildUrl(product, {
                reg,
                style: styleId,
                amount: side === "pair" ? "both" : side,
              }),
            );
          }}
        >
          <div className={styles.cardHead}>
            <span className={styles.cardIcon} aria-hidden="true">
              <Layers strokeWidth={1.9} />
            </span>
            <div className={styles.cardHeadText}>
              <div className={styles.cardTitleRow}>
                <h2 className={styles.cardTitle}>Build your {copy ? copy.noun : picked.name} plates</h2>
                <span className={styles.selected}>{picked.name} selected</span>
              </div>
              <p className={styles.cardSub}>
                Enter your registration and choose your options below.
              </p>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-hero-reg">
              Your registration
            </label>
            <div className={styles.plateField}>
              <span className={styles.plateBand} aria-hidden="true">
                <UkMark />
                UK
              </span>
              <span className={styles.plateFace}>
                <input
                  id="product-hero-reg"
                  className={`${styles.plateInput} ${plateFont.className}`}
                  value={reg}
                  onChange={(e) => setReg(e.target.value.toUpperCase())}
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  maxLength={10}
                />
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label} id="product-hero-side">
              Plate type
            </span>
            <div
              className={styles.segment}
              role="group"
              aria-labelledby="product-hero-side"
              style={sides.length < 3 ? { gridTemplateColumns: `repeat(${sides.length}, minmax(0, 1fr))` } : undefined}
            >
              {sides.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`${styles.segBtn} ${side === id ? styles.segOn : ""}`}
                  aria-pressed={side === id}
                  onClick={() => setSide(id)}
                >
                  <Icon className={styles.segIcon} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label} id="product-hero-style">
              Plate style
            </span>
            <div className={styles.tiles} role="group" aria-labelledby="product-hero-style">
              {tilesFor(ownStyle).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.tile} ${styleId === t.id ? styles.tileOn : ""}`}
                  aria-pressed={styleId === t.id}
                  onClick={() => setStyleId(t.id)}
                >
                  {styleId === t.id && (
                    <span className={styles.tick} aria-hidden="true">
                      <Check strokeWidth={3} />
                    </span>
                  )}
                  <span className={styles.tileGlyph}>
                    <StyleGlyph mark={t.mark} bevel={t.bevel} smoked={t.smoked} />
                  </span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.cta}>
            Build my {noun} plates
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
          </button>

          <dl className={styles.prices}>
            <div className={styles.priceItem}>
              <Tag className={styles.priceIcon} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <dt>
                  <strong>{gbp(picked.single)}</strong> single
                </dt>
                <dd>{copy?.single.label ?? "Single front or rear plate"}</dd>
              </div>
            </div>
            <div className={styles.priceItem}>
              <Tag className={styles.priceIcon} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <dt>
                  <strong>{gbp(picked.pair)}</strong> pair
                </dt>
                <dd>{copy?.pair.label ?? "Matching front & rear plates"}</dd>
              </div>
            </div>
          </dl>
        </form>

        <ul className={styles.trust}>
          {TRUST.map(({ Icon, title, detail }, i) => (
            <li key={title} className={`${styles.trustItem} ${styles.anim}`} style={delay(5 + i)}>
              <span className={styles.trustIcon} aria-hidden="true">
                <Icon strokeWidth={1.9} />
              </span>
              <span className={styles.trustText}>
                <strong>{title}</strong>
                <span>{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
