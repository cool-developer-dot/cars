import { headlinePrices, quote, type PlateSizeId, type PlateStyleKey } from "./pricing";

/**
 * Confirmed business facts (owner-confirmed 27–28/09/2026).
 * Prices come from lib/pricing.ts (the client's builder pricing, adopted
 * 30/09/2026).
 * Every page reads from here so prices, terms and company details
 * never drift apart between sections.
 */

export const SITE_URL = "https://replacementplates.uk";

export const COMPANY = {
  brand: "ReplacementPlates",
  legalName: "Private Number Plate Maker Ltd",
  companyNumber: "16163051",
  jurisdiction: "England and Wales",
  rnps: "75449",
  registeredOffice:
    "Stand 53, New Spitalfields Market, 1 Sherrin Road, London, E10 5SQ",
  collection: "Castleview Gardens, Ilford, IG1 3QF",
  platesSold: "12,000+",
  platesSoldSince: "January 2025",
} as const;

export const CONTACT = {
  email: "info@replacementplates.uk",
  phone: "020 3576 6603",
  phoneHref: "tel:+442035766603",
  whatsapp: "+44 7754 185366",
  whatsappHref: "https://wa.me/447754185366",
} as const;

export const GOV_UK_DOCS_URL =
  "https://www.gov.uk/displaying-number-plates/getting-number-plates-made-up";

export type StyleId = "standard" | "3d" | "4d" | "5d" | "ghost" | "bevel";

/** Each site style and the key the order backend uses for it */
export const STYLE_KEY: Record<StyleId, PlateStyleKey> = {
  standard: "2D",
  "3d": "3D",
  "4d": "4D",
  "5d": "4D + Gel (5D)",
  ghost: "Ghost",
  bevel: "Bevel/Retro",
};

const STYLE_INFO: Record<StyleId, { name: string; what: string; href: string }> = {
  standard: { name: "Standard", what: "Flat printed characters", href: "/standard-number-plates" },
  "3d": { name: "3D gel", what: "Raised, domed resin characters", href: "/3d-number-plates" },
  "4d": { name: "4D", what: "Laser-cut acrylic characters", href: "/4d-number-plates" },
  "5d": { name: "5D", what: "Acrylic characters with a gel layer (4D gel)", href: "/5d-number-plates" },
  ghost: { name: "Ghost", what: "Dark smoked characters for a stealth look", href: "/ghost-number-plates" },
  bevel: { name: "Bevel", what: "Angled, diamond-cut character edges", href: "/bevel-number-plates" },
};

/**
 * Headline prices for a standard-size plate, from the builder's pricing
 * (lib/pricing.ts). A pair is priced as a pair — it is not two singles.
 */
export const PRICES: Record<
  StyleId,
  { name: string; what: string; single: number; pair: number; href: string }
> = Object.fromEntries(
  (Object.keys(STYLE_INFO) as StyleId[]).map((id) => [
    id,
    { ...STYLE_INFO[id], ...headlinePrices(STYLE_KEY[id]) },
  ]),
) as Record<StyleId, { name: string; what: string; single: number; pair: number; href: string }>;

/** The plate-style pages (Standard, 3D, 4D, 5D, Ghost, Bevel) and the style each one sells */
export const STYLE_PAGES: Record<string, StyleId> = Object.fromEntries(
  (Object.keys(STYLE_INFO) as StyleId[])
    .filter((id) => !STYLE_INFO[id].href.includes("#"))
    .map((id) => [STYLE_INFO[id].href, id]),
);

/* ——— Speciality plates ———
   Formats rather than finishes: each is built in any style, with the
   builder's own size / badge / show-plate options preset. */

export type SpecialityId = "short" | "oversized" | "show" | "ev";

/** Builder presets for a plate format. "auto" sizes a short plate from the registration. */
export type PlateFormat = {
  frontSize?: PlateSizeId | "auto";
  rearSize?: PlateSizeId | "auto";
  badge?: "uk" | "eng" | "sco" | "ev";
  legality?: "show";
  /** The plate a single order is (oversized is a rear-only size) */
  single?: "front" | "rear";
  /** Which of Front / Rear / Pair the format can be ordered as */
  sides?: ("front" | "rear" | "pair")[];
};

export const SPECIALITY: Record<
  SpecialityId,
  { name: string; path: string; blurb: string; format: PlateFormat }
> = {
  short: {
    name: "Short",
    path: "/short-number-plates",
    blurb: "Cut to fit shorter registrations.",
    format: { frontSize: "auto", rearSize: "auto" },
  },
  oversized: {
    name: "Oversized",
    path: "/oversized-number-plates",
    blurb: "A 533 × 152mm rear plate for larger recesses.",
    format: { rearSize: "oversized", single: "rear", sides: ["rear", "pair"] },
  },
  show: {
    name: "Show",
    path: "/show-number-plates",
    blurb: "Custom spacing, for display off the road.",
    format: { legality: "show" },
  },
  ev: {
    name: "EV Green Flash",
    path: "/ev-number-plates",
    blurb: "The green flash for zero-emission vehicles.",
    format: { badge: "ev" },
  },
};

export const SPECIALITY_ORDER: SpecialityId[] = ["short", "oversized", "show", "ev"];

/** Short plate sizes by the most characters they carry, spaces included */
const SHORT_SIZES: PlateSizeId[] = ["3", "4", "5", "6", "7"];

/** The plate size a registration needs on a short plate ("8" = standard) */
export function shortSizeFor(reg: string): PlateSizeId {
  const n = reg.trim().replace(/\s+/g, " ").length;
  return SHORT_SIZES.find((s) => Number(s) >= n) ?? "8";
}

const sizeOf = (s: PlateFormat["frontSize"], reg = "") =>
  s === "auto" ? (reg ? shortSizeFor(reg) : "6") : (s ?? "8");

/** One plate and a pair of `style` in `format`, from the builder's pricing */
export function formatPrices(style: StyleId, format: PlateFormat = {}) {
  const common = {
    style: STYLE_KEY[style],
    frontSize: sizeOf(format.frontSize),
    rearSize: sizeOf(format.rearSize),
    hasBadge: !!format.badge,
    hex: false,
  };
  return {
    single: quote({ ...common, amount: format.single ?? "front" }).total,
    pair: quote({ ...common, amount: "both" }).total,
  };
}

/** Builder link settings for a format. A short size follows the registration,
    so with no registration yet it's left for the builder to pick. */
export function formatLinkOptions(format: PlateFormat = {}, reg = "") {
  const size = (s: PlateFormat["frontSize"]) =>
    !s || (s === "auto" && !reg.trim()) ? undefined : sizeOf(s, reg);
  return {
    frontSize: size(format.frontSize),
    rearSize: size(format.rearSize),
    badge: format.badge,
    legality: format.legality,
  };
}

/** Every product page's path and what its "Build my plates" link presets */
export const PRODUCT_PAGE_LINKS: Record<string, { style?: StyleId; format?: PlateFormat }> = {
  ...Object.fromEntries(Object.entries(STYLE_PAGES).map(([path, style]) => [path, { style }])),
  ...Object.fromEntries(SPECIALITY_ORDER.map((id) => [SPECIALITY[id].path, { format: SPECIALITY[id].format }])),
};

export const gbp = (n: number) => `£${n.toFixed(2)}`;
export const pairPrice = (id: StyleId) => PRICES[id].pair;
/** Cheapest single plate on the site — for "from £x" copy */
export const FROM_PRICE = Math.min(...Object.values(PRICES).map((p) => p.single));

/** Manufacturing-defect warranty, months from delivery/collection */
export const WARRANTY_MONTHS: Record<StyleId, number> = {
  standard: 6,
  "3d": 6,
  "4d": 6,
  "5d": 12,
  ghost: 12,
  bevel: 12,
};

/** Delivery fees in pounds — the numbers behind the copy in DELIVERY below */
export const DELIVERY_FEES = { firstClass: 3, freeFrom: 15, tracked: 2 } as const;

export const DELIVERY = {
  firstClass:
    "Standard Royal Mail First Class delivery is £3 on orders under £15 and free on orders of £15 or more.",
  tracked: "Upgrade to Royal Mail Tracked 24 for an additional £2.",
  aims: "Royal Mail delivery times are aims, not guarantees.",
  dispatch:
    "Order before 2pm on a working weekday and — once your documents and order are checked — we aim to dispatch the same day.",
  friday:
    "A Friday order may not arrive until the following week; we don't promise Saturday or Monday arrival, because these are Royal Mail's delivery aims, not guarantees.",
  areas:
    "We deliver by Royal Mail to addresses in Great Britain. If your address is in Northern Ireland, the Channel Islands or the Isle of Man, please contact us before ordering so we can tell you whether we can deliver there.",
  collectionReady:
    "Ready within 3 hours (contact us via WhatsApp to confirm same-day collection). Please confirm before travelling.",
  noBranches:
    "We don't have shops or branches elsewhere — this is our one collection point, and elsewhere we deliver by Royal Mail.",
} as const;

/** Worked delivery totals from the Standard headline prices (First Class £3 under £15, Tracked 24 +£2) */
const std = PRICES.standard;
export const DELIVERY_EXAMPLE = `One ${gbp(std.single)} Standard plate with First Class comes to ${gbp(std.single + 3)} in total. A ${gbp(std.pair)} Standard pair qualifies for free First Class, so it stays ${gbp(std.pair)}; with Tracked 24 it comes to ${gbp(std.pair + 2)}.`;

export const DOCUMENTS = {
  identity: {
    title: "Proof of your name and address",
    items: [
      "Driving licence",
      "Utility, Council Tax or rates bill from the last 6 months",
      "Bank or building society statement from the last 6 months",
      "National identity card",
    ],
    note: "A passport or bank card proves your name only.",
  },
  entitlement: {
    title: "Proof you can use the registration",
    items: [
      "V5C logbook, or its green new-keeper slip",
      "V750 certificate of entitlement",
      "V778 retention certificate",
      "V11 tax reminder showing the registration",
      "V379 temporary registration certificate",
      "Stamped V948 or an electronic eV948 confirmation",
      "Letter from a fleet or lease company quoting your V5C document reference number",
    ],
  },
} as const;

export const LEGAL_POINTS = [
  "Correct Charles Wright characters",
  "Correct character spacing",
  "Reflective background — white front, yellow rear",
  "Solid black, non-reflective characters",
  "Supplier identification and British Standard marking",
] as const;
