"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import { cardRevealV, inViewOnce, revealV } from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import { useCart } from "@/contexts/cart/CartProvider";
import {
  BORDERS,
  INITIAL_BUILD,
  applyPatch,
  isValidReg,
  quoteFor,
  sizeById,
  styleById,
  summaryRows,
  toPlateConfig,
  type BuildState,
} from "./buildConfig";
import { renderPlateProof } from "./plateProof";
import type { PlateFace } from "./PlateRender";
import BuildSteps from "./BuildSteps";
import { OrderSummary, PreviewStage } from "./BuildPreview";
import styles from "./BuildYourPlate.module.css";

const panelV = cardRevealV(0.14);

type Props = {
  /** "section" sits on the homepage; "page" is the full builder with an h1 */
  variant?: "section" | "page";
  initial?: Partial<BuildState>;
  /** Load the configuration saved in the basket (the basket's "Edit" link) */
  editFromBasket?: boolean;
};

export function PlateBuilder({ editFromBasket = false, initial, ...rest }: Props) {
  const { basket, hydrated } = useCart();
  // Editing from the basket: start from the saved configuration. The saved
  // basket only exists in the browser, so remount once it has been read.
  if (editFromBasket) {
    const saved = basket?.builder as Partial<BuildState> | undefined;
    const fromBasket = hydrated && saved && typeof saved === "object" && "styleId" in saved;
    return (
      <Builder
        key={fromBasket ? `basket-${basket?.addedAt}` : "initial"}
        {...rest}
        initial={fromBasket ? saved : initial}
      />
    );
  }
  return <Builder {...rest} initial={initial} />;
}

function Builder({ variant = "section", initial }: Omit<Props, "editFromBasket">) {
  const reduced = useHydrationSafeReducedMotion();
  const router = useRouter();
  const { addToBasket } = useCart();

  const [state, setState] = useState<BuildState>(() => applyPatch(INITIAL_BUILD, initial ?? {}));
  // Which plate the preview shows when ordering both
  const [previewFace, setPreviewFace] = useState<PlateFace>("yellow");
  const [pulse, setPulse] = useState(0);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [legalityWarning, setLegalityWarning] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const legalityRef = useRef<HTMLDivElement>(null);
  const regRef = useRef<HTMLInputElement>(null);

  const set = useCallback((patch: Partial<BuildState>) => {
    setState((s) => applyPatch(s, patch));
    setError(null);
    if (patch.legality) setLegalityWarning(false);
    // A new finish gets a light sweep across the preview
    if (patch.styleId) setPulse((p) => p + 1);
    // Picking one side swings the preview round to it
    if (patch.amount === "front") setPreviewFace("white");
    if (patch.amount === "rear") setPreviewFace("yellow");
  }, []);

  const style = styleById(state.styleId);
  const face: PlateFace =
    state.amount === "front" ? "white" : state.amount === "rear" ? "yellow" : previewFace;
  const size = sizeById(face === "white" ? state.frontSize : state.rearSize);
  const borderColor = BORDERS.find((b) => b.id === state.border)?.color ?? null;
  const q = quoteFor(state);

  const reveal = (el: HTMLElement | null) => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 90 || r.bottom > window.innerHeight - 40) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    }
  };

  const onAdd = async () => {
    if (adding) return;
    if (!isValidReg(state.reg)) {
      setError("Enter your registration to continue.");
      reveal(regRef.current);
      regRef.current?.focus({ preventScroll: true });
      return;
    }
    if (!state.legality) {
      setLegalityWarning(true);
      reveal(legalityRef.current);
      return;
    }

    setAdding(true);
    setError(null);
    const proof = await renderPlateProof(state);
    const result = await addToBasket({ plate_config: toPlateConfig(state) }, proof, state);
    if (result.ok) {
      router.push("/cart");
      // Leave the spinner running until the basket page takes over
      return;
    }
    setAdding(false);
    setError(result.message);
  };

  const onReset = () => {
    setState(INITIAL_BUILD);
    setPreviewFace("yellow");
    setError(null);
    setLegalityWarning(false);
  };

  const inView = reduced ? {} : inViewOnce;
  const rv = reduced ? undefined : revealV;
  const pv = reduced ? undefined : panelV;
  const isPage = variant === "page";
  const TitleTag = isPage ? m.h1 : m.h2;

  return (
    <section
      id={isPage ? "builder" : "build-your-plate"}
      className={`${styles.section} ${isPage ? styles.sectionPage : ""}`}
      aria-labelledby="byp-title"
    >
      <div className={styles.ambient} aria-hidden="true" />

      <m.div className={styles.inner} {...inView} viewport={{ once: true, amount: 0.05 }}>
        <header className={styles.header}>
          <m.p className={styles.eyebrow} variants={rv} custom={0}>
            <span className={styles.eyebrowLine} aria-hidden="true" />
            {isPage ? "Plate builder" : "Build your plate"}
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </m.p>
          <TitleTag id="byp-title" className={styles.title} variants={rv} custom={0.06}>
            Make it <span className={styles.titleAccent}>yours.</span>
          </TitleTag>
          <m.p className={styles.subtitle} variants={rv} custom={0.12}>
            Choose your style, size and finish — see every change instantly.
          </m.p>
        </header>

        <m.div className={styles.stepsSlot} variants={pv} custom={0}>
          <BuildSteps
            state={state}
            set={set}
            face={face}
            reduced={reduced}
            onAdd={onAdd}
            onReset={onReset}
            adding={adding}
            error={error}
            legalityWarning={legalityWarning}
            legalityRef={legalityRef}
            regRef={regRef}
          />
        </m.div>

        {/* Phones: these fall into the page grid (preview on top, summary last).
            Desktop: one column that stays in view while the steps scroll. */}
        <div className={styles.aside}>
          <m.div className={styles.stageSlot} variants={pv} custom={1}>
            <PreviewStage
              ref={stageRef}
              reg={state.reg}
              finish={style.finish}
              face={face}
              badge={state.badge}
              size={size}
              hex={state.hex}
              borderColor={borderColor}
              amount={state.amount}
              legality={state.legality}
              onFace={setPreviewFace}
              pulse={pulse}
            />
          </m.div>
          <m.div className={styles.summarySlot} variants={pv} custom={2}>
            <OrderSummary
              rows={summaryRows(state)}
              quote={q}
              single={state.amount !== "both"}
              onAdd={onAdd}
              adding={adding}
              error={error}
              reduced={reduced}
            />
          </m.div>
        </div>
      </m.div>
    </section>
  );
}

/** Homepage section */
export default function BuildYourPlate() {
  return <PlateBuilder variant="section" />;
}
