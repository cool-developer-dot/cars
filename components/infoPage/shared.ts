import type { LucideIcon } from "lucide-react";

/** The two section colours, plus the footer below the last section */
export type Tone = "light" | "dark";
export type Next = Tone | "footer";

/** Top colour of each section, painted under the neon edge above it so the two meet seamlessly */
export const EDGE_FILL: Record<Next, string> = {
  light: "#f3f7fb",
  dark: "#06111f",
  footer: "#040c16",
};

/** Icon + two-line label (hero facts, closing trust points) */
export type Fact = { Icon: LucideIcon; title: string; text: string };

/** Keep the last two words together so a heading never ends on one word */
export const noOrphan = (text: string) => text.replace(/ (\S+)$/, " $1");
