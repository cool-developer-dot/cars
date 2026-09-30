import { PLATE_STYLES } from "@/components/Hero/heroConfig";

export type PlateFinish = "standard" | "gel" | "acrylic" | "acrylicGel";
export type PlateFace = "white" | "black" | "yellow";

export type ShowcaseStyle = {
  id: (typeof PLATE_STYLES)[number]["id"];
  title: string;
  description: string;
  from: number;
  finish: PlateFinish;
  face: PlateFace;
  featured?: boolean;
};

const priceOf = (id: ShowcaseStyle["id"]) =>
  PLATE_STYLES.find((s) => s.id === id)?.from ?? 0;

export const SHOWCASE_STYLES: ShowcaseStyle[] = [
  {
    id: "standard",
    title: "Standard (Legal)",
    description: "Flat printed characters.",
    from: priceOf("standard"),
    finish: "standard",
    face: "white",
  },
  {
    id: "3d",
    title: "3D Gel",
    description: "Raised, domed resin characters.",
    from: priceOf("3d"),
    finish: "gel",
    face: "white",
    featured: true,
  },
  {
    id: "4d",
    title: "4D",
    description: "Laser-cut acrylic characters.",
    from: priceOf("4d"),
    finish: "acrylic",
    face: "black",
  },
  {
    id: "5d",
    title: "5D",
    description: "Acrylic characters with a gel layer.",
    from: priceOf("5d"),
    finish: "acrylicGel",
    face: "yellow",
  },
];
