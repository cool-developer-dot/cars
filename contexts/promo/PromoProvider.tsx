"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { createStorageStore } from "../storageStore";

/*
 * Promo code, adapted from the client's PromoState. The code is passed to
 * checkout; the order backend decides whether it applies.
 */

type PromoContextValue = {
  promoCode: string;
  setPromoCode: (code: string) => void;
};

const PromoContext = createContext<PromoContextValue | null>(null);
const promoStore = createStorageStore<string>("rp-promo-v1", "session");

export const normalisePromo = (raw: string) =>
  raw.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);

export function PromoProvider({ children }: { children: ReactNode }) {
  const promoCode = promoStore.useValue() ?? "";

  // A ?promo=CODE link pre-fills the code
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("promo");
    const code = fromUrl ? normalisePromo(fromUrl) : "";
    if (code) promoStore.set(code);
  }, []);

  const setPromoCode = useCallback((raw: string) => {
    const code = normalisePromo(raw);
    promoStore.set(code || null);
  }, []);

  const value = useMemo(() => ({ promoCode, setPromoCode }), [promoCode, setPromoCode]);
  return <PromoContext.Provider value={value}>{children}</PromoContext.Provider>;
}

export function usePromo() {
  const ctx = useContext(PromoContext);
  if (!ctx) throw new Error("usePromo must be used inside <PromoProvider>");
  return ctx;
}
