"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Loader2, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import {
  AMOUNTS,
  BADGES,
  BORDERS,
  KITS,
  SIZES,
  deltaLabel,
  hexAllowed,
  isValidReg,
  quoteFor,
  sizeById,
  styleById,
  toPlateConfig,
  type BuildState,
  type PlateAmount,
} from "@/components/BuildYourPlate/buildConfig";
import PlateRender from "@/components/BuildYourPlate/PlateRender";
import { renderPlateProof } from "@/components/BuildYourPlate/plateProof";
import { useCart } from "@/contexts/cart/CartProvider";
import { plateFont } from "@/lib/fonts";
import { BUILDER_ID } from "@/lib/builderLink";
import { gbp, type StyleId } from "@/lib/site";
import PlateArt, { type PlateFace } from "./PlateArt";
import { ParcelBox } from "./Art";
import { useHomeBuilder } from "./HomeBuilder";
import s from "./MadeToOrder.module.css";

/** The style swatches, in the panel's order and with its short labels */
const SWATCHES: { id: StyleId; label: string; face: PlateFace }[] = [
  { id: "standard", label: "Standard", face: "white" },
  { id: "3d", label: "3D", face: "white" },
  { id: "4d", label: "4D", face: "white" },
  { id: "5d", label: "5D", face: "yellow" },
  { id: "ghost", label: "Ghost", face: "yellow" },
  { id: "bevel", label: "Bevel", face: "white" },
];

const SIDES: { id: PlateAmount; label: string }[] = [
  { id: "front", label: "Front plate" },
  { id: "rear", label: "Rear plate" },
  { id: "both", label: "Matching pair" },
];

/** Thumbnail text: the customer's reg once they've typed one */
const thumbReg = (reg: string) => reg.trim() || "AB12 CDE";

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  id,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  id: string;
}) {
  return (
    <div className={s.optField}>
      <label htmlFor={id} className={s.optLabel}>
        {label}
      </label>
      <div className={s.selectWrap}>
        <select
          id={id}
          className={s.select}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className={s.selectIcon} aria-hidden="true" />
      </div>
    </div>
  );
}

/** Size, badge, border, hex, fixing kit and road-legal/show — over the panel */
function OptionsSheet({ state, set, onClose }: {
  state: BuildState;
  set: (p: Partial<BuildState>) => void;
  onClose: () => void;
}) {
  const uid = useId();
  const first = useRef<HTMLButtonElement>(null);
  const q = quoteFor(state);

  useEffect(() => {
    first.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Freeze the page behind the sheet (iOS scrolls the page otherwise)
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [onClose]);

  const sizeOpts = (rear: boolean) =>
    SIZES.filter((z) => rear || !z.rearOnly).map((z) => ({
      id: z.id,
      label:
        z.label +
        deltaLabel(state, rear ? { rearSize: z.id, hex: false } : { frontSize: z.id, hex: false }),
    }));

  const canHex = hexAllowed({ ...state, frontSize: "8", rearSize: "8", badge: "none" });

  // Rendered at <body> level: inside the panel it would be clipped by the
  // section and the reveal animation's transform on small screens
  return createPortal(
    <div className={s.overlay} onClick={onClose}>
    <div
      className={s.sheet}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-t`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={s.sheetHead}>
        <h3 id={`${uid}-t`} className={s.sheetTitle}>
          Plate options
        </h3>
        <button type="button" className={s.sheetClose} onClick={onClose} aria-label="Close options">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className={s.sheetBody}>
        <div className={s.optField}>
          <span className={s.optLabel} id={`${uid}-legal`}>
            Plate type
          </span>
          <div className={s.seg} role="radiogroup" aria-labelledby={`${uid}-legal`}>
            {(
              [
                { id: "legal", label: "Road legal" },
                { id: "show", label: "Show plate" },
              ] as const
            ).map((o, i) => (
              <button
                key={o.id}
                ref={i === 0 ? first : undefined}
                type="button"
                role="radio"
                aria-checked={state.legality === o.id}
                className={`${s.segBtn} ${state.legality === o.id ? s.segOn : ""}`}
                onClick={() => set({ legality: o.id })}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {state.amount !== "rear" && (
          <Select
            id={`${uid}-fs`}
            label="Front size"
            value={state.frontSize}
            options={sizeOpts(false)}
            onChange={(v) => set({ frontSize: v })}
          />
        )}
        {state.amount !== "front" && (
          <Select
            id={`${uid}-rs`}
            label="Rear size"
            value={state.rearSize}
            options={sizeOpts(true)}
            onChange={(v) => set({ rearSize: v })}
          />
        )}
        <Select
          id={`${uid}-badge`}
          label="Badge"
          value={state.badge}
          options={BADGES.map((b) => ({ id: b.id, label: b.label + deltaLabel(state, { badge: b.id, hex: false }) }))}
          onChange={(v) => set({ badge: v, ...(v !== "none" ? { hex: false } : {}) })}
        />
        <Select
          id={`${uid}-border`}
          label="Border"
          value={state.border}
          options={BORDERS.map((b) => ({ id: b.id, label: b.label }))}
          onChange={(v) => set({ border: v })}
        />
        <Select
          id={`${uid}-kit`}
          label="Fixing kit"
          value={state.kit}
          options={KITS.map((k) => ({ id: k.id, label: k.label }))}
          onChange={(v) => set({ kit: v })}
        />

        <label className={`${s.optField} ${s.hexRow}`}>
          <input
            type="checkbox"
            className={s.check}
            checked={state.hex}
            disabled={!canHex}
            onChange={(e) => set({ hex: e.target.checked })}
          />
          <span>
            <span className={s.hexTitle}>
              Hex plate{deltaLabel(state, { hex: true })}
            </span>
            <span className={s.hexHint}>Standard size only, no badge</span>
          </span>
        </label>
      </div>

      <div className={s.sheetFoot}>
        <span className={s.sheetTotal}>
          Total <strong>{gbp(q.total)}</strong>
        </span>
        <button type="button" className={s.sheetDone} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
    </div>,
    document.body,
  );
}

/**
 * The site's one plate builder, laid out as the "made to order" flow panel:
 * registration → front/rear/pair → style → order. Every tile is live; the
 * extra options open over the panel from tile 4.
 */
export default function PanelBuilder() {
  const router = useRouter();
  const { addToBasket } = useCart();
  const { state, set, optionsOpen, setOptionsOpen, glow, focusTick } = useHomeBuilder();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const regRef = useRef<HTMLInputElement>(null);
  const optBtnRef = useRef<HTMLButtonElement>(null);
  const uid = useId();

  const style = styleById(state.styleId);
  const q = quoteFor(state);
  const finishFor = (id: StyleId) => styleById(id).finish;

  useEffect(() => {
    if (focusTick) regRef.current?.focus({ preventScroll: true });
  }, [focusTick]);

  const update = (patch: Partial<BuildState>) => {
    set(patch);
    setError(null);
  };

  const closeOptions = () => {
    setOptionsOpen(false);
    optBtnRef.current?.focus({ preventScroll: true });
  };

  const onAdd = async () => {
    if (adding) return;
    if (!isValidReg(state.reg)) {
      setError("Enter your registration first.");
      regRef.current?.focus();
      return;
    }
    setAdding(true);
    setError(null);
    const proof = await renderPlateProof(state);
    const result = await addToBasket({ plate_config: toPlateConfig(state) }, proof, state);
    if (result.ok) {
      router.push("/cart");
      return; // spinner runs until the basket page takes over
    }
    setAdding(false);
    setError(result.message);
  };

  const plate = (face: PlateFace, className: string) => {
    const size = sizeById(face === "white" ? state.frontSize : state.rearSize);
    return (
      <PlateRender
        reg={state.reg}
        finish={style.finish}
        face={face}
        badge={state.badge}
        widthMm={size.widthMm}
        heightMm={size.heightMm}
        hex={state.hex}
        borderColor={BORDERS.find((b) => b.id === state.border)?.color ?? null}
        className={className}
      />
    );
  };

  const amountLabel = AMOUNTS.find((a) => a.id === state.amount)?.summary ?? "";

  return (
    <div
      id={BUILDER_ID}
      className={s.panel}
      role="group"
      aria-label="Build your number plates"
    >
      {/* Arrival glow: a fresh element (new key) replays it every time
          something on the page summons the builder */}
      {glow > 0 && <span key={glow} className={s.glowRing} aria-hidden="true" />}

      {/* 1 — registration + live preview */}
      <div className={`${s.tile} ${s.tileReg}`}>
        <div className={s.device}>
          <label className={s.inputWrap} htmlFor={`${uid}-reg`}>
            <span className="sr-only">Your registration</span>
            <input
              ref={regRef}
              id={`${uid}-reg`}
              className={`${s.input} ${plateFont.className}`}
              value={state.reg}
              onChange={(e) => update({ reg: e.target.value })}
              placeholder="ENTER REG"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={error ? !isValidReg(state.reg) : undefined}
            />
          </label>
          <div className={`${s.preview} ${state.amount === "both" ? s.previewPair : ""}`} aria-hidden="true">
            {state.amount === "both" ? (
              <>
                {plate("white", s.previewBack)}
                {plate("yellow", s.previewFront)}
              </>
            ) : (
              plate(state.amount === "front" ? "white" : "yellow", s.previewOne)
            )}
          </div>
        </div>
      </div>

      <span className={s.arrow} aria-hidden="true">
        <ArrowRight strokeWidth={2.6} />
      </span>

      {/* 2 — front / rear / pair */}
      <div className={`${s.tile} ${s.tileSides}`} role="radiogroup" aria-label="Which plates">
        {SIDES.map((side) => {
          const on = state.amount === side.id;
          return (
            <button
              key={side.id}
              type="button"
              role="radio"
              aria-checked={on}
              className={`${s.sideRow} ${side.id === "both" ? s.pairRow : ""} ${on ? s.sideOn : ""}`}
              onClick={() => update({ amount: side.id })}
            >
              {side.id === "both" ? (
                <span className={s.pairPlates} aria-hidden="true">
                  <PlateArt reg={thumbReg(state.reg)} face="white" finish={style.finish} />
                  <PlateArt reg={thumbReg(state.reg)} face="yellow" finish={style.finish} />
                </span>
              ) : (
                <PlateArt
                  className={s.sidePlate}
                  reg={thumbReg(state.reg)}
                  face={side.id === "front" ? "white" : "yellow"}
                  finish={style.finish}
                />
              )}
              <span className={side.id === "both" ? s.pairLabel : s.sideLabel}>{side.label}</span>
              <span className={`${s.radio} ${on ? s.radioOn : ""}`} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* connectors between the rows */}
      <span className={s.links} aria-hidden="true">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M49 0 V20 H23 V40" />
          <path d="M75 0 V20 H55 V40" />
        </svg>
        <ChevronDown className={s.linkHead} strokeWidth={2.8} />
      </span>
      <span className={`${s.arrow} ${s.arrowDown}`} aria-hidden="true">
        <ArrowRight strokeWidth={2.6} />
      </span>

      {/* 3 — style */}
      <div className={`${s.tile} ${s.tileStyles}`} role="radiogroup" aria-label="Plate style">
        {SWATCHES.map((sw) => {
          const on = state.styleId === sw.id;
          const price = quoteFor({ ...state, styleId: sw.id }).total;
          return (
            <button
              key={sw.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`${styleById(sw.id).name}, ${gbp(price)}`}
              className={`${s.swatch} ${on ? s.swatchOn : ""}`}
              onClick={() => update({ styleId: sw.id })}
            >
              <PlateArt className={s.swatchPlate} reg="AB12 CDE" face={sw.face} finish={finishFor(sw.id)} />
              <span className={s.swatchLabel}>{sw.label}</span>
              <span className={s.swatchPrice}>{gbp(price)}</span>
            </button>
          );
        })}
      </div>

      <span className={s.arrow} aria-hidden="true">
        <ArrowRight strokeWidth={2.6} />
      </span>

      {/* 4 — order */}
      <div className={`${s.tile} ${s.tileBox}`}>
        <ParcelBox className={s.box} />
        <div className={s.order}>
          <p className={s.total} aria-live="polite">
            <span className={s.totalLabel}>
              {amountLabel} · {style.tab}
              {state.legality === "show" ? " · Show plate" : ""}
            </span>
            <strong className={s.totalPrice}>{gbp(q.total)}</strong>
          </p>
          <div className={s.orderBtns}>
            <button
              ref={optBtnRef}
              type="button"
              className={s.optBtn}
              aria-expanded={optionsOpen}
              onClick={() => setOptionsOpen(!optionsOpen)}
            >
              <SlidersHorizontal aria-hidden="true" />
              <span className={s.optText}>Options</span>
            </button>
            <button type="button" className={s.addBtn} onClick={onAdd} disabled={adding}>
              {adding ? (
                <>
                  <Loader2 className={s.spin} aria-hidden="true" />
                  Adding…
                </>
              ) : (
                <>
                  <ShoppingBag aria-hidden="true" />
                  Add to basket
                </>
              )}
            </button>
          </div>
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      {optionsOpen && <OptionsSheet state={state} set={update} onClose={closeOptions} />}

    </div>
  );
}
