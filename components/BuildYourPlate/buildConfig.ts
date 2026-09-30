import { STYLE_KEY, gbp, type StyleId } from "@/lib/site";
import { quote, type PlateAmount, type PlateSizeId, type Quote } from "@/lib/pricing";
import type { PlateConfig } from "@/contexts/cart/types";

export type { PlateAmount, PlateSizeId };

/* ——— Plate styles ———
   `finish` drives the render. `image` is an optional close-up photo for the
   Step 2 preview: drop a file into /public and set the path here, and it
   replaces the rendered close-up for that style. */

export type PlateFinish = "standard" | "gel" | "acrylic" | "acrylicGel" | "bevel" | "ghost";

export type BuildStyle = {
  id: StyleId;
  tab: string;
  name: string;
  blurb: string;
  finish: PlateFinish;
  image?: string;
};

export const BUILD_STYLES: BuildStyle[] = [
  { id: "standard", tab: "Standard", name: "Standard", blurb: "Flat printed characters with a premium finish.", finish: "standard" },
  { id: "3d", tab: "3D Gel", name: "3D Gel", blurb: "Raised, glossy domed resin characters.", finish: "gel" },
  { id: "4d", tab: "4D 3mm", name: "4D 3mm", blurb: "Laser-cut 3mm acrylic characters with real depth.", finish: "acrylic" },
  { id: "5d", tab: "5D", name: "4D + Gel (5D)", blurb: "Laser-cut acrylic under a glossy gel top.", finish: "acrylicGel" },
  { id: "bevel", tab: "Bevel / Retro", name: "Bevel / Retro", blurb: "Classic angled, diamond-cut character edges.", finish: "bevel" },
  { id: "ghost", tab: "Ghost", name: "Ghost", blurb: "Dark smoked characters for a stealth look.", finish: "ghost" },
];

export const styleById = (id: StyleId) => BUILD_STYLES.find((s) => s.id === id) ?? BUILD_STYLES[0];

/** Everything a URL might call a style — ours, and the client's old links */
const STYLE_ALIASES: Record<string, StyleId> = {
  standard: "standard", "2d": "standard",
  "3d": "3d", "3d-gel": "3d", "3dgel": "3d",
  "4d": "4d", "4d-3mm": "4d", "4d3mm": "4d",
  "5d": "5d", "4d-gel": "5d", "4dgel": "5d", "4d-+-gel-(5d)": "5d", "4d+gel(5d)": "5d",
  bevel: "bevel", "bevel-retro": "bevel", "bevel/retro": "bevel", bevelretro: "bevel", retro: "bevel",
  ghost: "ghost",
};

export function parseStyle(raw: string | undefined | null): StyleId | null {
  if (!raw) return null;
  const key = decodeURIComponent(raw).trim().toLowerCase().replace(/\s+/g, "-");
  return STYLE_ALIASES[key] ?? STYLE_ALIASES[key.replace(/-/g, "")] ?? null;
}

/* ——— Configuration ——— */

export const AMOUNTS: { id: PlateAmount; label: string; summary: string }[] = [
  { id: "front", label: "Front", summary: "1 (Front)" },
  { id: "rear", label: "Rear", summary: "1 (Rear)" },
  { id: "both", label: "Both", summary: "2 (Front & Rear)" },
];

export type SizeOption = {
  id: PlateSizeId;
  label: string;
  summary: string;
  widthMm: number;
  heightMm: number;
  maxChars: number;
  rearOnly?: boolean;
};

export const SIZES: SizeOption[] = [
  { id: "8", label: "Standard – 520×111", summary: "520 × 111mm", widthMm: 520, heightMm: 111, maxChars: 8 },
  { id: "7", label: "Short 7 digit – 470×111", summary: "470 × 111mm", widthMm: 470, heightMm: 111, maxChars: 7 },
  { id: "6", label: "Short 6 digit – 409×111", summary: "409 × 111mm", widthMm: 409, heightMm: 111, maxChars: 6 },
  { id: "5", label: "Short 5 digit – 348×111", summary: "348 × 111mm", widthMm: 348, heightMm: 111, maxChars: 5 },
  { id: "4", label: "Short 4 digit – 287×111", summary: "287 × 111mm", widthMm: 287, heightMm: 111, maxChars: 4 },
  { id: "3", label: "Short 3 digit – 226×111", summary: "226 × 111mm", widthMm: 226, heightMm: 111, maxChars: 3 },
  { id: "oversized", label: "Oversized rear – 533×152", summary: "533 × 152mm", widthMm: 533, heightMm: 152, maxChars: 8, rearOnly: true },
];

export const sizeById = (id: PlateSizeId) => SIZES.find((s) => s.id === id) ?? SIZES[0];

export type BadgeId = "none" | "uk" | "sco" | "eng" | "ev";

export const BADGES: { id: BadgeId; label: string }[] = [
  { id: "none", label: "None" },
  { id: "uk", label: "UK Flag" },
  { id: "eng", label: "England" },
  { id: "sco", label: "Scotland" },
  { id: "ev", label: "Electric Vehicle (green flash)" },
];

export type BorderId = "none" | "black";

export const BORDERS: { id: BorderId; label: string; color: string | null }[] = [
  { id: "none", label: "None", color: null },
  { id: "black", label: "Black", color: "#0b0c0e" },
];

export type KitId = "pads" | "screws";

export const KITS: { id: KitId; label: string; summary: string }[] = [
  { id: "pads", label: "Sticky pads ×6 (free)", summary: "Sticky pads ×6" },
  { id: "screws", label: "Self-tapping screws & caps (free)", summary: "Screws with caps" },
];

export type Legality = "" | "legal" | "show";

export const LEGALITY: { id: Exclude<Legality, "">; label: string; hint: string }[] = [
  { id: "legal", label: "Legal Plate", hint: "Road legal" },
  { id: "show", label: "Show Plate", hint: "Display only" },
];

/* ——— State ——— */

export type BuildState = {
  reg: string;
  styleId: StyleId;
  legality: Legality;
  amount: PlateAmount;
  frontSize: PlateSizeId;
  rearSize: PlateSizeId;
  badge: BadgeId;
  border: BorderId;
  hex: boolean;
  kit: KitId;
};

export const INITIAL_BUILD: BuildState = {
  reg: "AB12 CDE",
  styleId: "standard",
  // Road legal unless the customer opts into a show plate
  legality: "legal",
  amount: "both",
  frontSize: "8",
  rearSize: "8",
  badge: "none",
  border: "none",
  hex: false,
  kit: "pads",
};

const charsFor = (s: PlateSizeId) => sizeById(s).maxChars;

/** Most characters the chosen plate(s) can carry, spaces included */
export function maxChars(s: Pick<BuildState, "amount" | "frontSize" | "rearSize">) {
  if (s.amount === "front") return charsFor(s.frontSize);
  if (s.amount === "rear") return charsFor(s.rearSize);
  return Math.min(charsFor(s.frontSize), charsFor(s.rearSize));
}

/** Uppercase plate characters only, single spaces, capped */
export const normaliseReg = (raw: string, max = 8) =>
  raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "")
    .slice(0, max);

/** Loose check — the backend does the full DVLA-format validation */
export const isValidReg = (reg: string) => {
  const chars = reg.replace(/\s/g, "");
  return chars.length >= 1 && chars.length <= 7 && /[A-Z0-9]/.test(chars);
};

/** Hex plates are standard-size only and carry no badge */
export const hexAllowed = (s: Pick<BuildState, "amount" | "frontSize" | "rearSize" | "badge">) =>
  s.badge === "none" &&
  (s.amount === "rear" || s.frontSize === "8") &&
  (s.amount === "front" || s.rearSize === "8");

/**
 * Apply a change and keep the configuration valid — the rules the client's
 * builder enforced across its handlers, in one place.
 */
export function applyPatch(prev: BuildState, patch: Partial<BuildState>): BuildState {
  let next = { ...prev, ...patch };

  // Oversized is a rear-only size
  if (next.frontSize === "oversized") next.frontSize = "8";

  // Turning hex on snaps to standard size and clears the badge…
  if (patch.hex) {
    next = { ...next, frontSize: "8", rearSize: "8", badge: "none" };
  }
  // …and anything that breaks those rules turns it off
  if (next.hex && !hexAllowed(next)) next.hex = false;

  next.reg = normaliseReg(next.reg, maxChars(next));
  return next;
}

/* ——— Pricing & order payload ——— */

export const quoteFor = (s: BuildState): Quote =>
  quote({
    style: STYLE_KEY[s.styleId],
    amount: s.amount,
    frontSize: s.frontSize,
    rearSize: s.rearSize,
    hasBadge: s.badge !== "none",
    hex: s.hex,
  });

/** Extra cost of a change against the current config, e.g. "+£5.00" */
export function deltaLabel(s: BuildState, patch: Partial<BuildState>) {
  const diff = quoteFor(applyPatch(s, patch)).total - quoteFor(s).total;
  return diff > 0.004 ? ` (+${gbp(diff)})` : "";
}

const sizeValue = (id: PlateSizeId) =>
  id === "oversized" ? "oversized" : id === "8" ? "standard" : `short${id}`;

const sizeLabel = (id: PlateSizeId) =>
  id === "oversized"
    ? "Oversized - 533x152"
    : id === "8"
      ? "Standard Size - 520x111"
      : `Short ${id} Digit - ${sizeById(id).widthMm}x111`;

/** The `plate_config` the order backend expects — same fields as the client's builder */
export function toPlateConfig(s: BuildState): PlateConfig {
  const key = STYLE_KEY[s.styleId];
  const q = quoteFor(s);
  const gel = key === "3D" || key === "4D Gel" || key === "4D + Gel (5D)";
  const raised = key === "4D" || key === "4D Gel" || key === "4D + Gel (5D)";
  const rearOversized = s.amount !== "front" && s.rearSize === "oversized";

  return {
    plate_type: key === "4D Gel" ? "4D_Gel" : key === "4D" ? "4D_3mm" : key,
    text: s.reg.trim(),
    legal_type: s.legality === "legal" ? "road_legal" : "show_only",
    plate_size: sizeValue(s.amount === "rear" ? s.rearSize : s.frontSize),
    front_plate_size: sizeLabel(s.amount === "rear" ? s.rearSize : s.frontSize),
    rear_plate_size: sizeLabel(s.amount === "front" ? s.frontSize : s.rearSize),
    rear_plate_extra_fee: rearOversized ? 5 : 0,
    sides: s.amount,
    effects: key === "2D" ? {} : { gel3d: gel, raised4d: raised },
    border:
      s.border === "none"
        ? { borderSelected: false, borderColor: "none" }
        : { borderSelected: true, borderColor: "rgb(0,0,0)" },
    style: key,
    customSpacing: { enabled: s.legality !== "legal", spacing: 0 },
    hexPlate: s.hex,
    badge: s.badge,
    freeKit: { pads: s.kit === "pads", screws: s.kit === "screws" },
    pricing_breakdown: { base: q.base, additionPrice: q.additions, total: q.total, unitPrice: q.unit },
    fQuantity: s.amount === "rear" ? 0 : 1,
    rQuantity: s.amount === "front" ? 0 : 1,
    cartPrice: q.total,
    total: q.total,
  };
}

/** Rows for the order summary / basket */
export function summaryRows(s: BuildState) {
  const style = styleById(s.styleId);
  return [
    { label: "Registration", value: s.reg.trim() || "—" },
    {
      label: "Plate Type",
      value: s.legality === "legal" ? "Road legal" : s.legality === "show" ? "Show plate" : "Choose in step 1",
      warn: !s.legality,
    },
    { label: "Plate Style", value: style.name, accent: true },
    { label: "Plate Amount", value: AMOUNTS.find((a) => a.id === s.amount)!.summary },
    { label: "Front Size", value: s.amount === "rear" ? "—" : sizeById(s.frontSize).summary + (s.hex ? " hex" : "") },
    { label: "Rear Size", value: s.amount === "front" ? "—" : sizeById(s.rearSize).summary + (s.hex ? " hex" : "") },
    { label: "Badge", value: BADGES.find((b) => b.id === s.badge)!.label.replace(" (green flash)", "") },
    { label: "Border", value: BORDERS.find((b) => b.id === s.border)!.label },
    { label: "Fixing Kit", value: KITS.find((k) => k.id === s.kit)!.summary },
  ];
}

/** Canonical builder URL for a registration + style */
export const builderHref = (reg: string, styleId: StyleId) =>
  `/custom-plates/${encodeURIComponent(reg.trim().replace(/\s+/g, " ") || "YOUR REG")}/${styleId}`;
