import type { StyleId } from "@/lib/site";
import type { PlateFace, PlateFinish } from "./PlateArt";

/** How each style is drawn wherever the homepage shows it */
export const STYLE_ART: Record<
  StyleId,
  { label: string; face: PlateFace; finish: PlateFinish; blurb: string }
> = {
  standard: { label: "Standard", face: "white", finish: "standard", blurb: "Flat printed characters." },
  "3d": { label: "3D Gel", face: "yellow", finish: "gel", blurb: "Raised, domed resin characters." },
  "4d": { label: "4D", face: "white", finish: "acrylic", blurb: "Laser-cut acrylic characters." },
  "5d": { label: "5D", face: "yellow", finish: "acrylicGel", blurb: "Acrylic characters with a gel layer." },
  ghost: { label: "Ghost", face: "yellow", finish: "ghost", blurb: "A distinctive styled character finish." },
  bevel: { label: "Bevel", face: "white", finish: "bevel", blurb: "Angled, diamond-cut character edges." },
};

export const STYLE_ORDER: StyleId[] = ["standard", "3d", "4d", "5d", "ghost", "bevel"];
