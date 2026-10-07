"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BADGES,
  INITIAL_BUILD,
  SIZES,
  applyPatch,
  parseStyle,
  type BuildState,
} from "@/components/BuildYourPlate/buildConfig";
import type { PlateSide } from "@/components/Hero/heroConfig";
import { useCart } from "@/contexts/cart/CartProvider";
import { BUILDER_ID } from "@/lib/builderLink";
import type { StyleId } from "@/lib/site";

/*
 * The homepage's single plate builder. Its state lives here so anything on
 * the page — the hero card, style cards, "Start building" buttons, the
 * closing CTA — can pre-fill it and bring the customer to it. The builder UI
 * itself is the panel in the second section (components/home/PanelBuilder).
 */

export type HomeBuilderSeed = Partial<BuildState>;

type GoOptions = {
  /** Open the extra options (size, badge, border, hex…) on arrival */
  options?: boolean;
  /** Put the cursor in the registration field on arrival */
  focusReg?: boolean;
};

type HomeBuilderContextValue = {
  state: BuildState;
  set: (patch: Partial<BuildState>) => void;
  reset: () => void;
  /** Pre-fill the builder and bring it into view */
  goToBuilder: (seed?: HomeBuilderSeed, opts?: GoOptions) => void;
  /** Kept for existing callers: same as goToBuilder */
  openBuilder: (seed?: HomeBuilderSeed) => void;
  optionsOpen: boolean;
  setOptionsOpen: (open: boolean) => void;
  /** Bumps whenever the builder is summoned — drives its arrival glow */
  glow: number;
  /** Bumps when the registration field should take focus */
  focusTick: number;
};

const HomeBuilderContext = createContext<HomeBuilderContextValue | null>(null);

export function useHomeBuilder() {
  const ctx = useContext(HomeBuilderContext);
  if (!ctx) throw new Error("useHomeBuilder must be used within HomeBuilderProvider");
  return ctx;
}

export function useHomeBuilderOptional() {
  return useContext(HomeBuilderContext);
}

/** Map the hero's front / rear / pair control onto the builder amount. */
export function amountFromSide(side: PlateSide): BuildState["amount"] {
  if (side === "front") return "front";
  if (side === "rear") return "rear";
  return "both";
}

export function seedFromHero(opts: { reg: string; styleId: string; side: PlateSide }): HomeBuilderSeed {
  return {
    reg: opts.reg,
    styleId: opts.styleId as StyleId,
    amount: amountFromSide(opts.side),
  };
}

const NAV_H = 84;

const EMPTY_BUILD: BuildState = { ...INITIAL_BUILD, reg: "" };

/** Centre the builder below the fixed navbar if it fits, else align its top */
function scrollToBuilder(smooth: boolean) {
  const el = document.getElementById(BUILDER_ID);
  if (!el) return;
  const r = el.getBoundingClientRect();
  const room = window.innerHeight - NAV_H;
  const offset = r.height < room - 24 ? NAV_H + (room - r.height) / 2 : NAV_H + 8;
  window.scrollTo({
    top: Math.max(0, window.scrollY + r.top - offset),
    behavior: smooth ? "smooth" : "auto",
  });
}

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Run once the opening intro has handed the page over */
function afterReveal(fn: () => void) {
  if (document.documentElement.dataset.rpReveal === "1") {
    window.setTimeout(fn, 60);
    return;
  }
  window.addEventListener("rp-site-reveal", () => window.setTimeout(fn, 120), { once: true });
}

/** Seed from a link like /?reg=AB12CDE&style=3d&amount=both#builder */
function seedFromUrl(params: URLSearchParams): HomeBuilderSeed {
  const seed: HomeBuilderSeed = {};
  const reg = params.get("reg");
  if (reg) seed.reg = reg;
  const style = parseStyle(params.get("style"));
  if (style) seed.styleId = style;
  const amount = params.get("amount");
  if (amount === "front" || amount === "rear" || amount === "both") seed.amount = amount;
  if (amount === "pair") seed.amount = "both";
  // Speciality pages preset a size, a badge or show-plate mode
  const isSize = (v: string | null): v is BuildState["frontSize"] => !!v && SIZES.some((sz) => sz.id === v);
  const front = params.get("front");
  const rear = params.get("rear");
  if (isSize(front)) seed.frontSize = front;
  if (isSize(rear)) seed.rearSize = rear;
  const badge = params.get("badge");
  if (badge && BADGES.some((b) => b.id === badge)) seed.badge = badge as BuildState["badge"];
  const legality = params.get("legality");
  if (legality === "legal" || legality === "show") seed.legality = legality;
  return seed;
}

/** Seeds that change a size or badge open the builder's extra options, so they're seen */
const touchesOptions = (seed: HomeBuilderSeed) =>
  seed.frontSize !== undefined || seed.rearSize !== undefined || seed.badge !== undefined;

export function HomeBuilderProvider({ children }: { children: ReactNode }) {
  const { basket, hydrated } = useCart();
  // The registration starts empty so nobody orders the sample by accident
  const [state, setState] = useState<BuildState>(EMPTY_BUILD);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [glow, setGlow] = useState(0);
  const [focusTick, setFocusTick] = useState(0);
  const pendingEdit = useRef(false);

  const set = useCallback((patch: Partial<BuildState>) => {
    setState((s) => applyPatch(s, patch));
  }, []);

  const reset = useCallback(() => setState(EMPTY_BUILD), []);

  const goToBuilder = useCallback((seed?: HomeBuilderSeed, opts: GoOptions = {}) => {
    if (seed) setState((s) => applyPatch(s, seed));
    if (opts.options) setOptionsOpen(true);
    setGlow((g) => g + 1);
    // Let the seeded state paint, then bring the builder in
    window.requestAnimationFrame(() => {
      scrollToBuilder(!prefersReduced());
      if (opts.focusReg) setFocusTick((t) => t + 1);
    });
  }, []);

  // Arriving from a link (another page, the basket's "Edit", an old
  // /custom-plates URL): seed from the query, then tidy the address bar.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seed = seedFromUrl(params);
    const editing = params.get("edit") === "1";
    const toBuilder = window.location.hash === `#${BUILDER_ID}`;
    // Applied on the next frame, after hydration has settled
    if (Object.keys(seed).length) {
      window.requestAnimationFrame(() => setState((s) => applyPatch(s, seed)));
      if (touchesOptions(seed)) setOptionsOpen(true);
    }
    if (editing) pendingEdit.current = true;
    if (params.toString()) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }
    if (toBuilder || editing || Object.keys(seed).length) {
      afterReveal(() => {
        scrollToBuilder(false);
        setGlow((g) => g + 1);
      });
    }
  }, []);

  // "Edit plates" from the basket: load the saved configuration once the
  // basket (browser storage) has been read
  useEffect(() => {
    if (!pendingEdit.current || !hydrated) return;
    const frame = window.requestAnimationFrame(() => {
      pendingEdit.current = false;
      const saved = basket?.builder as Partial<BuildState> | undefined;
      if (saved && typeof saved === "object" && "styleId" in saved) {
        setState(applyPatch(EMPTY_BUILD, saved));
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hydrated, basket]);

  // Same-page #builder links (navbar "Build my plates") get the arrival glow
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === `#${BUILDER_ID}`) {
        scrollToBuilder(!prefersReduced());
        setGlow((g) => g + 1);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const value = useMemo(
    () => ({
      state,
      set,
      reset,
      goToBuilder,
      openBuilder: (seed?: HomeBuilderSeed) => goToBuilder(seed),
      optionsOpen,
      setOptionsOpen,
      glow,
      focusTick,
    }),
    [state, set, reset, goToBuilder, optionsOpen, glow, focusTick],
  );

  return <HomeBuilderContext.Provider value={value}>{children}</HomeBuilderContext.Provider>;
}
