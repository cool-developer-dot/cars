/**
 * Plate pricing — ported from the client's plate builder so the totals we
 * show are exactly what their order backend (validate-config / checkout)
 * expects. Prices are for a PAIR; a single plate is derived from the pair
 * price with the builder's rounding (e.g. £24.95 pair → £12.45 single).
 *
 * Keep this file free of UI and site imports: the builder, basket and
 * marketing pages all read from it.
 */

/** The style keys the client's backend knows (`plate_config.style`) */
export type PlateStyleKey =
  | "2D"
  | "3D"
  | "4D"
  | "4D Gel"
  | "4D + Gel (5D)"
  | "Bevel/Retro"
  | "Ghost";

export type PlateAmount = "both" | "front" | "rear";

/** Short plates are sized by digit count; "8" is the standard 520×111 */
export type PlateSizeId = "3" | "4" | "5" | "6" | "7" | "8" | "oversized";

type AddOns = {
  shortPlateBoth: number;
  shortPlateSingle: number;
  oversizedRear: number;
  badgeBoth: number;
  badgeSingle: number;
  hexBoth: number;
  hexSingle: number;
};

type PriceEntry = {
  bothBasePrice: number;
  addOns: AddOns;
  /** Bevel is priced from its own single / hex tables */
  bothHexBasePrice?: number;
  singleBasePrice?: number;
  singleHexBasePrice?: number;
};

const STANDARD_ADDONS: AddOns = {
  shortPlateBoth: 10,
  shortPlateSingle: 5,
  oversizedRear: 5,
  badgeBoth: 10,
  badgeSingle: 5,
  hexBoth: 10,
  hexSingle: 5,
};

export const PLATE_PRICES: Record<PlateStyleKey, PriceEntry> = {
  "2D": { bothBasePrice: 24.95, addOns: STANDARD_ADDONS },
  "3D": { bothBasePrice: 34.95, addOns: STANDARD_ADDONS },
  "4D": { bothBasePrice: 34.95, addOns: STANDARD_ADDONS },
  "4D Gel": { bothBasePrice: 59.95, addOns: STANDARD_ADDONS },
  "4D + Gel (5D)": { bothBasePrice: 69.95, addOns: STANDARD_ADDONS },
  Ghost: { bothBasePrice: 59.95, addOns: STANDARD_ADDONS },
  "Bevel/Retro": {
    bothBasePrice: 59.95,
    bothHexBasePrice: 74.95,
    singleBasePrice: 29.95,
    singleHexBasePrice: 37.45,
    addOns: { ...STANDARD_ADDONS, badgeSingle: 10, hexBoth: 0, hexSingle: 0 },
  },
};

export type QuoteInput = {
  style: PlateStyleKey;
  amount: PlateAmount;
  frontSize: PlateSizeId;
  rearSize: PlateSizeId;
  /** Any badge other than "none" */
  hasBadge: boolean;
  hex: boolean;
};

export type Quote = {
  /** Pair base price (the builder's `initialPrice`) */
  base: number;
  /** Sum of add-ons applied (the builder's `additionalPrice`) */
  additions: number;
  /** What the customer pays for this configuration */
  total: number;
  /** Price of one plate in this configuration */
  unit: number;
};

const money = (n: number) => Number(n.toFixed(2));
const isShortSize = (s: PlateSizeId) => s !== "8" && s !== "oversized";

export function quote({ style, amount, frontSize, rearSize, hasBadge, hex }: QuoteInput): Quote {
  const entry = PLATE_PRICES[style];
  const add = entry.addOns;
  const isSingle = amount !== "both";
  const isBevel = entry.singleBasePrice !== undefined;
  // For a single plate, the size that matters is the one being ordered
  const activeSize = amount === "rear" ? rearSize : frontSize;

  const isShort =
    amount === "both"
      ? isShortSize(frontSize) || isShortSize(rearSize)
      : isShortSize(activeSize);
  const rearOversized = amount !== "front" && rearSize === "oversized";

  let base: number;
  let additions = 0;

  if (isBevel && entry.bothHexBasePrice !== undefined) {
    base = hex ? entry.bothHexBasePrice : entry.bothBasePrice;
  } else {
    base = entry.bothBasePrice;
    if (hex) additions += isSingle ? add.hexSingle : add.hexBoth;
  }

  if (isShort) {
    additions +=
      amount === "both" && isShortSize(frontSize) && isShortSize(rearSize)
        ? add.shortPlateBoth
        : add.shortPlateSingle;
  }
  if (rearOversized) additions += add.oversizedRear;
  if (hasBadge) additions += isSingle ? add.badgeSingle : add.badgeBoth;

  const bevelSingle = () => {
    let p = (hex ? entry.singleHexBasePrice : entry.singleBasePrice) ?? 0;
    if (rearOversized) p += add.oversizedRear;
    if (hasBadge) p += add.badgeSingle;
    if (isShort) p += add.shortPlateSingle;
    return p;
  };

  let total: number;
  let unit: number;

  if (isBevel) {
    unit = bevelSingle();
    total = isSingle ? unit : base + additions;
  } else {
    total = isSingle ? Math.ceil(base / 2 + additions) - 0.55 : base + additions;
    unit =
      Math.ceil(base / 2 + (amount === "both" ? Math.floor(additions / 2) : additions)) - 0.55;
  }

  return {
    base: money(base),
    additions: money(additions),
    total: money(total),
    unit: money(unit),
  };
}

/** Headline prices for a style: one standard plate, and a standard pair */
export function headlinePrices(style: PlateStyleKey) {
  const common = { style, frontSize: "8", rearSize: "8", hasBadge: false, hex: false } as const;
  return {
    single: quote({ ...common, amount: "front" }).total,
    pair: quote({ ...common, amount: "both" }).total,
  };
}

/** Add-on prices, for help text (standard styles) */
export const ADD_ON_PRICES = STANDARD_ADDONS;
