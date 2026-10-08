import { plateFont } from "@/lib/fonts";
import s from "./PlateDiagram.module.css";

/*
 * A 520 × 111mm car plate drawn to the DVLA's ordinary layout (INF104):
 * 79mm characters, 50mm wide, 11mm between characters, 33mm between the two
 * groups, with the supplier and British Standard markings along the bottom.
 * One SVG unit is one millimetre, so every measurement is literal.
 */

const W = 520;
const H = 111;
const CHAR_W = 50;
const CHAR_H = 79;
const GAP = 11;
const GROUP_GAP = 33;
const REG = ["A", "B", "2", "5", "C", "D", "E"];

const span = REG.length * CHAR_W + (REG.length - 2) * GAP + GROUP_GAP;
const left = (W - span) / 2;
const top = (H - CHAR_H) / 2 - 2;
/** x of each character cell */
const xs = REG.map((_, i) => left + i * (CHAR_W + GAP) + (i >= 4 ? GROUP_GAP - GAP : 0));

/** A dimension line with end ticks and a centred label */
function Dim({
  x1,
  y1,
  x2,
  y2,
  label,
  side = "below",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  side?: "below" | "above" | "left" | "right";
}) {
  const vertical = x1 === x2;
  const tick = 5;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const lx = side === "left" ? x1 - 10 : side === "right" ? x1 + 10 : mx;
  const ly = side === "above" ? y1 - 10 : side === "below" ? y1 + 24 : my + 6;
  const anchor = side === "left" ? "end" : side === "right" ? "start" : "middle";
  return (
    <g className={s.dim}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line x1={x1 - tick} y1={y1} x2={x1 + tick} y2={y1} />
          <line x1={x2 - tick} y1={y2} x2={x2 + tick} y2={y2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - tick} x2={x1} y2={y1 + tick} />
          <line x1={x2} y1={y2 - tick} x2={x2} y2={y2 + tick} />
        </>
      )}
      <text x={lx} y={ly} textAnchor={anchor} className={s.label}>
        {label}
      </text>
    </g>
  );
}

export default function PlateDiagram() {
  const base = top + CHAR_H;
  const below = H + 22;
  return (
    <figure className={s.figure}>
      <svg
        viewBox="-96 -46 712 216"
        className={s.svg}
        role="img"
        aria-label="A 520 by 111 millimetre number plate: characters 79mm tall and 50mm wide, 11mm apart, with a 33mm gap between the two groups"
      >
        <defs>
          <linearGradient id="pd-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eef2f7" />
          </linearGradient>
        </defs>

        {/* the plate */}
        <rect x="0" y="0" width={W} height={H} rx="9" fill="url(#pd-face)" className={s.plate} />

        {/* characters, each squeezed into its legal 50mm cell */}
        {REG.map((ch, i) => (
          <g key={i}>
            <rect x={xs[i]} y={top} width={CHAR_W} height={CHAR_H} className={s.cell} />
            <text
              x={xs[i] + CHAR_W / 2}
              y={base}
              textAnchor="middle"
              textLength={CHAR_W}
              lengthAdjust="spacingAndGlyphs"
              className={`${s.char} ${plateFont.className}`}
            >
              {ch}
            </text>
          </g>
        ))}

        {/* supplier and British Standard markings along the bottom margin */}
        <text x={W / 2} y={H - 5} textAnchor="middle" className={s.marking}>
          SUPPLIER NAME · POSTCODE · BS AU 145e
        </text>

        {/* overall size */}
        <Dim x1={0} y1={-20} x2={W} y2={-20} label="520mm" side="above" />
        <Dim x1={W + 22} y1={0} x2={W + 22} y2={H} label="111mm" side="right" />

        {/* character height */}
        <Dim x1={-22} y1={top} x2={-22} y2={base} label="79mm" side="left" />

        {/* character width, spacing and the group gap */}
        <Dim x1={xs[0]} y1={below} x2={xs[0] + CHAR_W} y2={below} label="50mm" />
        <Dim x1={xs[2] - GAP} y1={below} x2={xs[2]} y2={below} label="11mm" />
        <Dim x1={xs[3] + CHAR_W} y1={below} x2={xs[4]} y2={below} label="33mm" />
      </svg>
      <figcaption className={s.caption}>
        The ordinary layout for cars, drawn to scale. Characters must use the prescribed font, or one substantially
        similar, with a 14mm stroke.
      </figcaption>
    </figure>
  );
}
