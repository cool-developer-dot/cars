/**
 * Confirmed business facts (owner-confirmed 27–28/09/2026).
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

/** Locked price matrix — price per plate; a pair is two plates. */
export const PRICES: Record<
  StyleId,
  { name: string; what: string; single: number; href: string }
> = {
  standard: {
    name: "Standard",
    what: "Flat printed characters",
    single: 12.49,
    href: "/plate-styles#standard",
  },
  "3d": {
    name: "3D gel",
    what: "Raised, domed resin characters",
    single: 19.95,
    href: "/3d-number-plates",
  },
  "4d": {
    name: "4D",
    what: "Laser-cut acrylic characters",
    single: 19.95,
    href: "/4d-number-plates",
  },
  "5d": {
    name: "5D",
    what: "Acrylic characters with a gel layer (4D gel)",
    single: 34.95,
    href: "/5d-number-plates",
  },
  ghost: {
    name: "Ghost",
    what: "A distinctive styled character finish",
    single: 34.95,
    href: "/plate-styles#ghost",
  },
  bevel: {
    name: "Bevel",
    what: "Angled, diamond-cut character edges",
    single: 39.95,
    href: "/bevel-number-plates",
  },
};

export const gbp = (n: number) => `£${n.toFixed(2)}`;
export const pairPrice = (id: StyleId) => PRICES[id].single * 2;

/** Manufacturing-defect warranty, months from delivery/collection */
export const WARRANTY_MONTHS: Record<StyleId, number> = {
  standard: 6,
  "3d": 6,
  "4d": 6,
  "5d": 12,
  ghost: 12,
  bevel: 12,
};

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
