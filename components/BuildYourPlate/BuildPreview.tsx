"use client";

import type { CSSProperties, Ref } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Layers, Loader2, MapPin, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { EASE_PREMIUM } from "@/lib/motion";
import { COMPANY, gbp } from "@/lib/site";
import type { Quote } from "@/lib/pricing";
import PlateRender, { type PlateFace } from "./PlateRender";
import type { BadgeId, Legality, PlateAmount, PlateFinish, SizeOption } from "./buildConfig";
import styles from "./BuildYourPlate.module.css";

/* ——— Live preview stage ——— */

type StageProps = {
  reg: string;
  finish: PlateFinish;
  face: PlateFace;
  badge: BadgeId;
  size: SizeOption;
  hex: boolean;
  borderColor: string | null;
  amount: PlateAmount;
  legality: Legality;
  onFace: (f: PlateFace) => void;
  /** Bumped on each change of finish to replay the light sweep */
  pulse: number;
  ref?: Ref<HTMLDivElement>;
};

// Widest plate we sell, so every other size previews to scale against it
const MAX_W = 533;

export function PreviewStage({
  reg,
  finish,
  face,
  badge,
  size,
  hex,
  borderColor,
  amount,
  legality,
  onFace,
  pulse,
  ref,
}: StageProps) {
  const plate = (edge: boolean) => (
    <PlateRender
      reg={reg}
      finish={finish}
      face={face}
      badge={badge}
      widthMm={size.widthMm}
      heightMm={size.heightMm}
      hex={hex}
      borderColor={borderColor}
      edge={edge}
    />
  );

  return (
    <div className={styles.stage} ref={ref}>
      <div className={styles.stageBg} aria-hidden="true">
        <span className={styles.stageBokeh} />
        <span className={styles.stageTail} />
        <span className={styles.stageFloor} />
      </div>

      <div className={styles.stageTop}>
        <span className={styles.liveTag}>
          <span className={styles.liveDot} aria-hidden="true" />
          Live preview
        </span>
        {amount === "both" && (
          <div className={styles.faceToggle} role="radiogroup" aria-label="Preview plate">
            {(["white", "yellow"] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="radio"
                aria-checked={face === f}
                className={`${styles.faceBtn} ${face === f ? styles.faceBtnOn : ""}`}
                onClick={() => onFace(f)}
              >
                {f === "white" ? "Front" : "Rear"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className={styles.stagePlateWrap}
        style={{ "--plate-scale": size.widthMm / MAX_W } as CSSProperties}
        role="img"
        aria-label={`Preview of ${face === "white" ? "front" : "rear"} ${size.summary} plate reading ${reg.trim() || "your registration"}`}
      >
        <div className={styles.stagePlate}>
          {plate(true)}
          <span key={pulse} className={pulse ? styles.stageSweep : undefined} aria-hidden="true" />
        </div>
        <div className={styles.stageReflection} aria-hidden="true">
          {plate(false)}
        </div>
      </div>

      <div className={styles.stageFoot}>
        <span className={styles.stageSize}>
          {size.summary}
          {hex ? " · hex" : ""}
        </span>
        {legality === "show" && <span className={styles.showTag}>Show plate · not road legal</span>}
      </div>
    </div>
  );
}

/* ——— Order summary ——— */

type SummaryProps = {
  rows: { label: string; value: string; accent?: boolean; warn?: boolean }[];
  quote: Quote;
  single: boolean;
  onAdd: () => void;
  adding: boolean;
  error: string | null;
  reduced: boolean;
};

const TRUST = [
  { Icon: Truck, title: "UK Delivery", sub: "Free on orders £15+" },
  { Icon: ShieldCheck, title: "DVLA Registered", sub: `RNPS ${COMPANY.rnps}` },
  { Icon: MapPin, title: "Made in London", sub: "Ilford collection" },
] as const;

export function OrderSummary({ rows, quote, single, onAdd, adding, error, reduced }: SummaryProps) {
  return (
    <div className={styles.summary}>
      <div className={styles.summaryHead}>
        <span className={styles.summaryIcon} aria-hidden="true">
          <Layers size={30} strokeWidth={1.6} />
        </span>
        <div>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <p className={styles.summarySub}>Your custom plates, built to perfection</p>
        </div>
        <span className={styles.summaryLive}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span>
            Live Preview
            <small>Updates instantly</small>
          </span>
        </span>
      </div>

      <div className={styles.summaryBody}>
        <dl className={styles.summaryList}>
          {rows.map((r) => (
            <div key={r.label} className={styles.summaryRow}>
              <dt>{r.label}</dt>
              <dd className={r.warn ? styles.summaryWarn : r.accent ? styles.summaryAccent : undefined}>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.summaryTotal}>
          <p className={styles.totalLabel}>Total Price</p>
          <p className="sr-only" aria-live="polite">
            Total {gbp(quote.total)}
          </p>
          <p className={styles.totalValue} aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={quote.total}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE_PREMIUM }}
              >
                {gbp(quote.total)}
              </m.span>
            </AnimatePresence>
          </p>
          <p className={styles.totalNote}>
            {single ? "One plate" : "Front & rear pair"}
            {quote.additions > 0 && !single ? ` · incl. ${gbp(quote.additions)} extras` : ""}
          </p>
          <button
            type="button"
            className={`${styles.btnPrimary} ${styles.btnBasket}`}
            onClick={onAdd}
            disabled={adding}
            aria-busy={adding}
          >
            {adding ? (
              <Loader2 className={styles.spin} size={20} aria-hidden="true" />
            ) : (
              <ShoppingCart size={20} strokeWidth={2} aria-hidden="true" />
            )}
            {adding ? "Adding…" : "Add to basket"}
          </button>
          {/* Also shown in step 4; repeated here so it's next to this button */}
          {error && <p className={styles.summaryError}>{error}</p>}
        </div>
      </div>

      <ul className={styles.trust}>
        {TRUST.map(({ Icon, title, sub }) => (
          <li key={title}>
            <span className={styles.trustIcon} aria-hidden="true">
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{sub}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
