"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { PlateBuilder } from "@/components/BuildYourPlate/BuildYourPlate";
import type { BuildState } from "@/components/BuildYourPlate/buildConfig";
import type { PlateSide } from "@/components/Hero/heroConfig";
import type { StyleId } from "@/lib/site";

export type HomeBuilderSeed = Partial<BuildState>;

type HomeBuilderContextValue = {
  open: boolean;
  openBuilder: (seed?: HomeBuilderSeed) => void;
  seed?: HomeBuilderSeed;
  nonce: number;
  slotRef: RefObject<HTMLDivElement | null>;
};

const HomeBuilderContext = createContext<HomeBuilderContextValue | null>(null);

export function useHomeBuilder() {
  const ctx = useContext(HomeBuilderContext);
  if (!ctx) {
    throw new Error("useHomeBuilder must be used within HomeBuilderProvider");
  }
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

export function seedFromHero(opts: {
  reg: string;
  styleId: string;
  side: PlateSide;
}): HomeBuilderSeed {
  return {
    reg: opts.reg,
    styleId: opts.styleId as StyleId,
    amount: amountFromSide(opts.side),
  };
}

export function HomeBuilderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seed, setSeed] = useState<HomeBuilderSeed | undefined>();
  const [nonce, setNonce] = useState(0);
  const slotRef = useRef<HTMLDivElement | null>(null);

  const openBuilder = useCallback((next?: HomeBuilderSeed) => {
    setSeed(next);
    setNonce((n) => n + 1);
    setOpen(true);
    // Slot mounts on this update — wait for paint before scrolling
    window.setTimeout(() => {
      slotRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  const value = useMemo(
    () => ({ open, openBuilder, seed, nonce, slotRef }),
    [open, openBuilder, seed, nonce],
  );

  return (
    <HomeBuilderContext.Provider value={value}>{children}</HomeBuilderContext.Provider>
  );
}

/** Place this where the full builder should appear on the homepage. */
export function HomeBuilderSlot() {
  const { open, seed, nonce, slotRef } = useHomeBuilder();
  if (!open) return null;

  return (
    <div ref={slotRef}>
      <PlateBuilder key={nonce} variant="section" initial={seed} />
    </div>
  );
}
