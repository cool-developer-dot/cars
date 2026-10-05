import { useId } from "react";
import s from "./GlassEdge.module.css";

/*
 * The glass bevel between two sections: a steel-blue band that slopes down
 * from the left to a point about 60% across, then rises to the right. Drawn
 * in a 1440×100 box stretched to the section's width (preserveAspectRatio
 * none), with gradients only: no filters or blur, so it costs nothing on
 * phones.
 *
 * Place it as the FIRST child of the dark section that follows a light one.
 * The area above the band is painted `fill` (the light section's bottom
 * colour), so the light section appears to run down into the dark one and
 * the dark section's own content can tuck under the left of the band.
 * The host section sets --glass-h (the edge's height).
 */
const TOP = "M0 2 L857 84 L1440 8";

type Props = {
  /** The light section's bottom colour, painted above the band */
  fill: string;
};

export default function GlassEdge({ fill }: Props) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={s.edge} aria-hidden="true">
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className={s.svg}>
        <defs>
          {/* across the band: pale steel on top, deeper blue-grey below, then the night */}
          <linearGradient id={`${id}-l`} gradientUnits="userSpaceOnUse" x1="430" y1="43" x2="428" y2="57">
            <stop offset="0" stopColor="#b9cfe8" />
            <stop offset="0.28" stopColor="#9db9d8" />
            <stop offset="0.6" stopColor="#7592b1" />
            <stop offset="0.9" stopColor="#4a627c" />
            <stop offset="1" stopColor="#1d3048" />
          </linearGradient>
          <linearGradient id={`${id}-r`} gradientUnits="userSpaceOnUse" x1="1150" y1="46" x2="1152" y2="60">
            <stop offset="0" stopColor="#b9cfe8" />
            <stop offset="0.28" stopColor="#9db9d8" />
            <stop offset="0.6" stopColor="#7e9ab9" />
            <stop offset="0.9" stopColor="#566e8a" />
            <stop offset="1" stopColor="#1d3048" />
          </linearGradient>
          {/* the bright rim glints most near the point */}
          <linearGradient id={`${id}-rim`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={fill} />
            <stop offset="1" stopColor={fill} />
          </linearGradient>
        </defs>

        {/* the light section, running down to the band */}
        <path d={`${TOP} L1440 -2 L0 -2 Z`} fill={`url(#${id}-sky)`} />
        {/* a faint cool glow along the band, drawn as widening strokes (no blur) */}
        <path d={TOP} fill="none" stroke="#9cc0f0" strokeOpacity="0.1" strokeWidth="14" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={TOP} fill="none" stroke="#9cc0f0" strokeOpacity="0.14" strokeWidth="7" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />

        {/* the bevel: one polygon per slope, each with its own gradient across the band */}
        <path d="M0 2 L857 84 L857 98 L0 16 Z" fill={`url(#${id}-l)`} />
        <path d="M857 84 L1440 8 L1440 22 L857 98 Z" fill={`url(#${id}-r)`} />

        {/* rim light on the top edge, a small flat facet at the point, a dark seam below */}
        <path d={TOP} fill="none" stroke={`url(#${id}-rim)`} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d="M790 77 L857 84 L930 75" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0 16 L857 98 L1440 22" fill="none" stroke="#050d18" strokeOpacity="0.7" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
