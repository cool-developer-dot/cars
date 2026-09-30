"use client";

import { useId, type ReactNode, type Ref } from "react";
import { AnimatePresence, m } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Loader2, RotateCcw, ShoppingCart, X } from "lucide-react";
import { plateFont } from "@/lib/fonts";
import { EASE_PREMIUM } from "@/lib/motion";
import { PRICES, gbp } from "@/lib/site";
import {
  AMOUNTS,
  BADGES,
  BORDERS,
  BUILD_STYLES,
  KITS,
  LEGALITY,
  SIZES,
  deltaLabel,
  hexAllowed,
  isValidReg,
  maxChars,
  normaliseReg,
  sizeById,
  styleById,
  type BuildState,
  type BuildStyle,
  type PlateSizeId,
} from "./buildConfig";
import PlateRender, { BadgeFlag, type PlateFace } from "./PlateRender";
import styles from "./BuildYourPlate.module.css";

/* ——— Small building blocks ——— */

function Step({
  n,
  title,
  sub,
  aside,
  children,
  className = "",
}: {
  n: number;
  title: string;
  sub: string;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section className={`${styles.step} ${className}`} aria-labelledby={id}>
      <span className={styles.stepNum} aria-hidden="true">
        {n}
      </span>
      <div className={styles.stepBody}>
        <div className={styles.stepHead}>
          <div className={styles.stepHeading}>
            <h3 id={id} className={styles.stepTitle}>
              <span className="sr-only">Step {n}: </span>
              {title}
            </h3>
            <p className={styles.stepSub}>{sub}</p>
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}

type Opt = { id: string; label: string };

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
  icon,
  hint,
}: {
  label: string;
  value: string;
  options: Opt[];
  onChange: (v: string) => void;
  disabled?: boolean;
  icon?: ReactNode;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className={styles.field} data-disabled={disabled || undefined}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label}
        {hint && <span className={styles.fieldHint}> {hint}</span>}
      </label>
      <div className={styles.selectWrap}>
        {icon && (
          <span className={styles.selectIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <select
          id={id}
          className={`${styles.select} ${icon ? styles.selectWithIcon : ""}`}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} size={16} aria-hidden="true" />
      </div>
    </div>
  );
}

/* ——— Step 2 close-up ——— */

function StyleCloseup({
  style,
  reg,
  face,
  reduced,
}: {
  style: BuildStyle;
  reg: string;
  face: PlateFace;
  reduced: boolean;
}) {
  const price = PRICES[style.id];
  return (
    <div className={styles.closeup}>
      <AnimatePresence initial={false}>
        <m.div
          key={style.id}
          className={styles.closeupLayer}
          initial={reduced ? false : { opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
          aria-hidden="true"
        >
          {style.image ? (
            // Real product photography, when supplied, replaces the render
            // eslint-disable-next-line @next/next/no-img-element
            <img src={style.image} alt="" className={styles.closeupImg} />
          ) : (
            <div className={styles.closeupPlate}>
              <PlateRender
                reg={reg}
                finish={style.finish}
                face={face}
                badge="none"
                widthMm={520}
                heightMm={111}
              />
            </div>
          )}
        </m.div>
      </AnimatePresence>

      <div className={styles.closeupShade} aria-hidden="true" />

      <div className={styles.closeupCaption} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={style.id}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
          >
            <p className={styles.closeupName}>{style.name}</p>
            <p className={styles.closeupBlurb}>{style.blurb}</p>
          </m.div>
        </AnimatePresence>
      </div>

      <p className={styles.closeupPrice}>
        <span>Pair</span> {gbp(price.pair)}
        <span className={styles.closeupPriceSep} aria-hidden="true" />
        <span>Single</span> {gbp(price.single)}
      </p>
    </div>
  );
}

/* ——— Steps ——— */

type Props = {
  state: BuildState;
  set: (patch: Partial<BuildState>) => void;
  face: PlateFace;
  reduced: boolean;
  onAdd: () => void;
  onReset: () => void;
  adding: boolean;
  error: string | null;
  /** Shown when someone tries to order before choosing legal / show */
  legalityWarning: boolean;
  legalityRef: Ref<HTMLDivElement>;
  regRef: Ref<HTMLInputElement>;
};

export default function BuildSteps({
  state,
  set,
  face,
  reduced,
  onAdd,
  onReset,
  adding,
  error,
  legalityWarning,
  legalityRef,
  regRef,
}: Props) {
  const regId = useId();
  const helpId = useId();
  const warnId = useId();
  const hexId = useId();
  const style = styleById(state.styleId);
  const max = maxChars(state);
  const hasReg = state.reg.trim().length > 0;
  const valid = isValidReg(state.reg);
  const canHex = hexAllowed(state);

  const sizeOptions = (side: "front" | "rear") =>
    SIZES.filter((z) => side === "rear" || !z.rearOnly).map((z) => ({
      id: z.id,
      label:
        z.label +
        deltaLabel(state, side === "front" ? { frontSize: z.id } : { rearSize: z.id }),
    }));

  return (
    <div className={styles.steps}>
      <span className={styles.rail} aria-hidden="true" />

      {/* 1 — Registration + plate type */}
      <Step
        n={1}
        title="Enter Registration"
        sub="Type your registration to get started."
        aside={
          <span
            className={`${styles.validChip} ${valid ? styles.validChipOn : ""}`}
            aria-live="polite"
          >
            <span className={styles.validDot} aria-hidden="true">
              <Check size={10} strokeWidth={3.4} />
            </span>
            {valid ? "Valid registration" : hasReg ? "Check registration" : "Enter registration"}
          </span>
        }
      >
        <div className={styles.regRow}>
          <div className={styles.regField}>
            <span className={styles.regBand} aria-hidden="true">
              <BadgeFlag badge="uk" />
              UK
            </span>
            <label htmlFor={regId} className="sr-only">
              Vehicle registration
            </label>
            <input
              ref={regRef}
              id={regId}
              className={`${styles.regInput} ${plateFont.className}`}
              value={state.reg}
              onChange={(e) => set({ reg: normaliseReg(e.target.value, max) })}
              placeholder="YOUR REG"
              maxLength={max}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              enterKeyHint="done"
              aria-describedby={helpId}
              aria-invalid={hasReg && !valid}
            />
            {hasReg && (
              <button
                type="button"
                className={styles.regClear}
                onClick={() => set({ reg: "" })}
                aria-label="Clear registration"
              >
                <X size={12} strokeWidth={3} />
              </button>
            )}
          </div>

          <div className={styles.regAction} ref={legalityRef}>
            <div
              className={`${styles.legality} ${legalityWarning ? styles.legalityWarn : ""}`}
              role="radiogroup"
              aria-label="Plate type"
              aria-describedby={legalityWarning ? warnId : undefined}
            >
              {LEGALITY.map((l) => {
                const on = state.legality === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    className={`${styles.legalBtn} ${on ? styles.legalBtnOn : ""}`}
                    onClick={() => set({ legality: l.id })}
                  >
                    <span className={styles.legalLabel}>{l.label}</span>
                    <span className={styles.legalHint}>{l.hint}</span>
                  </button>
                );
              })}
            </div>
            <p id={helpId} className={styles.regHelp}>
              Max {max} characters (including spaces) allowed
            </p>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {legalityWarning && (
            <m.p
              key="warn"
              id={warnId}
              role="alert"
              className={styles.inlineWarn}
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            >
              <AlertCircle size={15} aria-hidden="true" />
              Please choose Legal Plate or Show Plate before adding to basket.
            </m.p>
          )}
          {state.legality === "show" && !legalityWarning && (
            <m.p
              key="show"
              className={styles.inlineNote}
              initial={reduced ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduced ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            >
              Show plates are for shows and display only — they aren&apos;t road legal.
            </m.p>
          )}
        </AnimatePresence>
      </Step>

      {/* 2 — Style */}
      <Step
        n={2}
        title="Plate Style"
        sub="Choose a style and see the difference instantly."
        className={styles.stepWide}
      >
        <div className={styles.tabs} role="radiogroup" aria-label="Plate style">
          {BUILD_STYLES.map((s) => {
            const on = s.id === state.styleId;
            return (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={on}
                className={`${styles.tab} ${on ? styles.tabOn : ""}`}
                onClick={() => set({ styleId: s.id })}
              >
                {s.tab}
              </button>
            );
          })}
        </div>
        <StyleCloseup style={style} reg={state.reg} face={face} reduced={reduced} />
      </Step>

      {/* 3 — Configuration */}
      <Step
        n={3}
        title="Configuration"
        sub="Tailor your plates to suit your vehicle."
        aside={
          <div className={styles.segment} role="radiogroup" aria-label="Plates">
            {AMOUNTS.map((a) => {
              const on = a.id === state.amount;
              return (
                <button
                  key={a.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  className={`${styles.segBtn} ${on ? styles.segBtnOn : ""}`}
                  onClick={() => set({ amount: a.id })}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        }
      >
        <div className={styles.fields}>
          {state.amount !== "rear" && (
            <SelectField
              label="Front Size"
              value={state.frontSize}
              options={sizeOptions("front")}
              onChange={(v) => set({ frontSize: v as PlateSizeId })}
            />
          )}
          {state.amount !== "front" && (
            <SelectField
              label="Rear Size"
              value={state.rearSize}
              options={sizeOptions("rear")}
              onChange={(v) => set({ rearSize: v as PlateSizeId })}
            />
          )}
          <SelectField
            label="Badge"
            value={state.badge}
            hint={state.hex ? "(not on hex plates)" : undefined}
            options={BADGES.map((b) => ({ id: b.id, label: b.label + deltaLabel(state, { badge: b.id, hex: false }) }))}
            icon={state.badge !== "none" ? <BadgeFlag badge={state.badge} /> : undefined}
            onChange={(v) => set({ badge: v as BuildState["badge"], ...(v !== "none" ? { hex: false } : {}) })}
          />
          <SelectField
            label="Border"
            value={state.border}
            options={BORDERS}
            onChange={(v) => set({ border: v as BuildState["border"] })}
          />

          <div className={styles.field} data-disabled={!canHex || undefined}>
            <span className={styles.fieldLabel} id={`${hexId}-l`}>
              Hex <span className={styles.fieldHint}>(optional)</span>
            </span>
            <label className={styles.hexWrap} data-on={state.hex || undefined}>
              <input
                type="checkbox"
                className={styles.hexCheck}
                checked={state.hex}
                disabled={!canHex}
                onChange={(e) => set({ hex: e.target.checked })}
                aria-labelledby={`${hexId}-l ${hexId}-t`}
              />
              <span className={styles.hexShape} aria-hidden="true" />
              <span id={`${hexId}-t`} className={styles.hexText}>
                {canHex
                  ? `Hexagon edges${state.hex ? "" : deltaLabel(state, { hex: true })}`
                  : "Standard size, no badge"}
              </span>
            </label>
          </div>

          <SelectField
            label="Fixing Kit"
            value={state.kit}
            options={KITS}
            onChange={(v) => set({ kit: v as BuildState["kit"] })}
          />
        </div>
        {state.amount !== "front" && state.rearSize === "oversized" && (
          <p className={styles.inlineNote}>
            Oversized {sizeById("oversized").summary} rear plates suit imported and 4×4 vehicles
            with a larger recess.
          </p>
        )}
      </Step>

      {/* 4 — Confirm */}
      <Step
        n={4}
        title="Finish & Confirm"
        sub="Review your custom plates."
        className={styles.stepLast}
        aside={
          <div className={styles.confirm}>
            <button
              type="button"
              className={`${styles.btnPrimary} ${styles.btnBuild}`}
              onClick={onAdd}
              disabled={adding}
              aria-busy={adding}
            >
              {adding ? (
                <Loader2 className={styles.spin} size={20} aria-hidden="true" />
              ) : (
                <ShoppingCart size={20} strokeWidth={2} aria-hidden="true" />
              )}
              {adding ? "Adding to basket…" : "Build my plates"}
            </button>
            <button type="button" className={styles.resetBtn} onClick={onReset}>
              <RotateCcw size={13} aria-hidden="true" />
              Reset builder
            </button>
          </div>
        }
      >
        {error && (
          <p role="alert" className={styles.inlineWarn}>
            <AlertCircle size={15} aria-hidden="true" />
            {error}
          </p>
        )}
      </Step>
    </div>
  );
}
