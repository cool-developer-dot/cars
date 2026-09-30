export const HERO_EASE = [0.16, 1, 0.3, 1] as const;

/** Delays in seconds from hero reveal start */
export const HERO_DELAY = {
  badge: 0.08,
  line1: 0.15,
  line2: 0.24,
  line3: 0.33,
  card: 0.38,
  subtitle: 0.48,
  cardTitle: 0.55,
  cardInput: 0.55,
  benefits: 0.65,
  segment: 0.7,
  style: 0.8,
  cta: 0.9,
  price: 1.0,
} as const;

export const PLATE_STYLES = [
  { id: "standard", label: "Standard", from: 12.49 },
  { id: "3d", label: "3D Gel", from: 19.95 },
  { id: "4d", label: "4D", from: 19.95 },
  { id: "5d", label: "5D", from: 34.95 },
  { id: "ghost", label: "Ghost", from: 34.95 },
  { id: "bevel", label: "Bevel", from: 39.95 },
] as const;

export const BENEFITS = [
  { id: "dvla", label: "DVLA Registered" },
  { id: "mail", label: "Royal Mail Delivery" },
  { id: "collect", label: "Collection Available" },
] as const;

export type PlateSide = "front" | "rear" | "pair";
