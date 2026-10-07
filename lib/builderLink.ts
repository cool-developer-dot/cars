/**
 * The site has one plate builder: the panel in the homepage's second section
 * (id="builder"). Every "build" link on the site points here; the homepage
 * reads these query params on load and seeds the builder with them.
 */
export type BuilderLinkOptions = {
  reg?: string;
  /** A StyleId or any alias parseStyle() understands ("3d", "ghost", …) */
  style?: string;
  amount?: "front" | "rear" | "both";
  /** Plate sizes ("3"–"8", "oversized"), a badge and show-plate mode (speciality pages) */
  frontSize?: string;
  rearSize?: string;
  badge?: string;
  legality?: "legal" | "show";
  /** Load the configuration saved in the basket */
  edit?: boolean;
};

export const BUILDER_ID = "builder";

export function builderUrl(opts: BuilderLinkOptions = {}) {
  const q = new URLSearchParams();
  const reg = opts.reg?.trim().toUpperCase();
  if (reg) q.set("reg", reg);
  if (opts.style) q.set("style", opts.style);
  if (opts.amount) q.set("amount", opts.amount);
  if (opts.frontSize) q.set("front", opts.frontSize);
  if (opts.rearSize) q.set("rear", opts.rearSize);
  if (opts.badge) q.set("badge", opts.badge);
  if (opts.legality) q.set("legality", opts.legality);
  if (opts.edit) q.set("edit", "1");
  const qs = q.toString();
  return `/${qs ? `?${qs}` : ""}#${BUILDER_ID}`;
}
