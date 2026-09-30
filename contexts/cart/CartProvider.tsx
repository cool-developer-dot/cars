"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { createStorageStore, useHydrated } from "../storageStore";
import type {
  BasketItem,
  CheckoutResult,
  Customer,
  FinishProduct,
  Product,
  Result,
} from "./types";

/*
 * Basket + order API. Adapted from the client's CartState: same endpoints and
 * payloads, plus a basket that survives a refresh, typed results instead of
 * alert()s, and a clear message when the API isn't configured.
 */

const API = (process.env.NEXT_PUBLIC_ANALYTICS_API ?? "").replace(/\/+$/, "");
/** WooCommerce product the backend books every plate order against */
const PRODUCT_ID = 5047;
const BASKET_KEY = "rp-basket-v1";
const CUSTOMER_KEY = "rp-customer-v1";
const IS_DEV = process.env.NODE_ENV !== "production";

const NOT_CONNECTED =
  "Online ordering is briefly unavailable. Please call or WhatsApp us and we'll take your order.";

type CartContextValue = {
  /** False until the saved basket has been read on the client */
  hydrated: boolean;
  basket: BasketItem | null;
  /** Number of plate sets in the basket, for the navbar */
  count: number;
  apiConfigured: boolean;
  /** Validate a configuration with the backend, then put it in the basket */
  addToBasket: <B>(product: Product, preview: string | null, builder: B) => Promise<Result>;
  setQuantity: (quantity: number) => void;
  clearBasket: () => void;
  customer: Customer | null;
  setCustomer: (customer: Customer) => void;
  sendLead: (order: FinishProduct) => Promise<boolean>;
  checkout: (order: FinishProduct) => Promise<CheckoutResult>;
};

const CartContext = createContext<CartContextValue | null>(null);

const basketStore = createStorageStore<BasketItem>(BASKET_KEY, "local");
// Personal details only live for the tab's session
const customerStore = createStorageStore<Customer>(CUSTOMER_KEY, "session");

async function post(path: string, body: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let json: Record<string, unknown> = {};
  try {
    json = await res.json();
  } catch {
    // Non-JSON error page
  }
  return { res, json };
}

const messageOf = (json: Record<string, unknown>, fallback: string) =>
  (typeof json.message === "string" && json.message) ||
  (typeof json.error === "string" && json.error) ||
  fallback;

/** Pull a payment/redirect URL out of the checkout response, whatever its key */
function findRedirect(json: Record<string, unknown>): string | undefined {
  for (const key of ["payment_url", "checkout_url", "redirect_url", "redirect", "url"]) {
    const v = json[key];
    if (typeof v === "string" && /^https?:\/\//.test(v)) return v;
  }
  return undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const basket = basketStore.useValue();
  const customer = customerStore.useValue();

  const saveBasket = useCallback((next: BasketItem | null) => basketStore.set(next), []);

  const addToBasket = useCallback(
    async <B,>(product: Product, preview: string | null, builder: B): Promise<Result> => {
      // The basket lives in the browser, so it works without the order API;
      // only checkout needs it.
      if (!API) {
        if (IS_DEV) {
          console.warn("[basket] NEXT_PUBLIC_ANALYTICS_API is not set — skipping server validation.");
        }
      } else {
        try {
          const { res, json } = await post("/api/validate-config", product);
          if (!res.ok) {
            return {
              ok: false,
              message: messageOf(json, "We couldn't confirm that plate configuration. Please check it and try again."),
            };
          }
        } catch {
          return {
            ok: false,
            message: "We couldn't reach our order system. Check your connection and try again.",
          };
        }
      }

      saveBasket({
        ...product,
        quantity: 1,
        preview_base64: preview,
        builder,
        addedAt: Date.now(),
      });
      return { ok: true };
    },
    [saveBasket],
  );

  const setQuantity = useCallback(
    (quantity: number) => {
      const current = basketStore.get();
      if (!current) return;
      saveBasket({ ...current, quantity: Math.max(1, Math.min(10, Math.round(quantity))) });
    },
    [saveBasket],
  );

  const clearBasket = useCallback(() => saveBasket(null), [saveBasket]);

  const setCustomer = useCallback((c: Customer) => customerStore.set(c), []);

  const sendLead = useCallback(async (order: FinishProduct) => {
    if (!API) return false;
    try {
      const { res } = await post("/api/addleadtodb", { product_id: PRODUCT_ID, ...order });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const checkout = useCallback(async (order: FinishProduct): Promise<CheckoutResult> => {
    if (!API) return { ok: false, message: NOT_CONNECTED };
    try {
      const { res, json } = await post("/api/checkout", { product_id: PRODUCT_ID, ...order });
      if (!res.ok) {
        return { ok: false, message: messageOf(json, "We couldn't create your order. Please try again.") };
      }
      const ref = json.order_id ?? json.orderId ?? json.id ?? json.order_number;
      return {
        ok: true,
        redirectUrl: findRedirect(json),
        orderRef: ref == null ? undefined : String(ref),
        raw: json,
      };
    } catch {
      return {
        ok: false,
        message: "We couldn't reach our order system. Check your connection and try again.",
      };
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated,
      basket,
      count: basket ? basket.quantity : 0,
      apiConfigured: !!API,
      addToBasket,
      setQuantity,
      clearBasket,
      customer,
      setCustomer,
      sendLead,
      checkout,
    }),
    [hydrated, basket, addToBasket, setQuantity, clearBasket, customer, setCustomer, sendLead, checkout],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
