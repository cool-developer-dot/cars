import { useId, type ReactNode } from "react";
import { plateFont } from "@/lib/fonts";
import { COMPANY } from "@/lib/site";
import type { BadgeId, PlateFinish } from "./buildConfig";
import styles from "./PlateRender.module.css";

export type PlateFace = "white" | "yellow";

/* ——— Side badges ——— */

type FlagBadge = Exclude<BadgeId, "none" | "ev">;

// Drawn in a 60×40 box so the same art works standalone and inside the plate
const FLAG_ART: Record<FlagBadge, ReactNode> = {
  uk: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
    </>
  ),
  eng: (
    <>
      <rect width="60" height="40" fill="#fff" />
      <path d="M30 0V40M0 20H60" stroke="#CE1124" strokeWidth="8" />
    </>
  ),
  sco: (
    <>
      <rect width="60" height="40" fill="#005EB8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="7" />
    </>
  ),
};

const BADGE_CODE: Record<FlagBadge, string> = { uk: "UK", eng: "ENG", sco: "SCO" };

export const EV_GREEN = "#1fa84f";

/** Small flag for UI chips (e.g. the Badge dropdown) */
export function BadgeFlag({ badge }: { badge: BadgeId }) {
  if (badge === "none") return null;
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true">
      {badge === "ev" ? <rect width="60" height="40" rx="4" fill={EV_GREEN} /> : FLAG_ART[badge]}
    </svg>
  );
}

/* ——— Lighting ———
   One key light from the top-left for every finish. The raised styles are
   lit with real SVG lighting over a height map built from the glyph shapes,
   so domes, cut edges and acrylic walls shade the way they would in a photo.
   All numbers are in plate units (the plate is 520 wide) scaled by `k`,
   the character size relative to a standard plate. */

const LIGHT_AZIMUTH = 225;

/** Stacked copies of the glyphs, pushed away from the light — the acrylic wall */
function Extrusion({ k, layers, depth, tones, result }: {
  k: number;
  layers: number;
  depth: number;
  tones: string[];
  result: string;
}) {
  const nodes: ReactNode[] = [];
  const names: string[] = [];
  for (let i = layers; i >= 1; i--) {
    const t = (i / layers) * depth * k;
    const tone = tones[Math.min(tones.length - 1, Math.floor(((i - 1) / layers) * tones.length))];
    nodes.push(
      <feOffset key={`o${i}`} in="SourceAlpha" dx={t * 0.45} dy={t} result={`${result}o${i}`} />,
      <feFlood key={`f${i}`} floodColor={tone} result={`${result}f${i}`} />,
      <feComposite key={`c${i}`} in={`${result}f${i}`} in2={`${result}o${i}`} operator="in" result={`${result}l${i}`} />,
    );
    names.push(`${result}l${i}`);
  }
  return (
    <>
      {nodes}
      <feMerge result={result}>
        {names.map((n) => (
          <feMergeNode key={n} in={n} />
        ))}
      </feMerge>
    </>
  );
}

function CastShadow({ k, blur, dx, dy, opacity }: {
  k: number;
  blur: number;
  dx: number;
  dy: number;
  opacity: number;
}) {
  return (
    <>
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur * k} />
      <feOffset dx={dx * k} dy={dy * k} result="shOff" />
      <feFlood floodColor="#000" floodOpacity={opacity} />
      <feComposite in2="shOff" operator="in" result="shadow" />
    </>
  );
}

/** Domed resin: a soft height map lit with a tight specular highlight */
function GelDome({ k, blur, scale, shine, result }: {
  k: number;
  blur: number;
  scale: number;
  shine: number;
  result: string;
}) {
  return (
    <>
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur * k} result={`${result}h`} />
      <feSpecularLighting
        in={`${result}h`}
        surfaceScale={scale}
        specularConstant={shine}
        specularExponent={38}
        lightingColor="#ffffff"
        result={`${result}s`}
      >
        <feDistantLight azimuth={LIGHT_AZIMUTH} elevation={52} />
      </feSpecularLighting>
      <feComposite in={`${result}s`} in2="SourceAlpha" operator="in" result={result} />
    </>
  );
}

/** Crisp highlight where a flat face meets its edge */
function EdgeRim({ k, strength, result }: { k: number; strength: number; result: string }) {
  return (
    <>
      <feGaussianBlur in="SourceAlpha" stdDeviation={0.45 * k} result={`${result}h`} />
      <feSpecularLighting
        in={`${result}h`}
        surfaceScale={2.4}
        specularConstant={strength}
        specularExponent={16}
        lightingColor="#dfe6ee"
        result={`${result}s`}
      >
        <feDistantLight azimuth={LIGHT_AZIMUTH} elevation={30} />
      </feSpecularLighting>
      <feComposite in={`${result}s`} in2="SourceAlpha" operator="in" result={result} />
    </>
  );
}

const ACRYLIC_TONES = ["#5a6069", "#3f434a", "#2a2d33", "#1b1d21", "#101113"];

function FinishFilter({ id, finish, k }: { id: string; finish: PlateFinish; k: number }) {
  const region = { x: "-6%", y: "-20%", width: "118%", height: "160%" };

  if (finish === "gel" || finish === "ghost") {
    return (
      <filter id={id} {...region} colorInterpolationFilters="sRGB">
        <CastShadow k={k} blur={1.6} dx={1.2} dy={2.6} opacity={0.5} />
        <GelDome k={k} blur={3.4} scale={finish === "ghost" ? 5 : 6} shine={finish === "ghost" ? 0.9 : 1.25} result="dome" />
        <EdgeRim k={k} strength={0.35} result="rim" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="rim" />
          <feMergeNode in="dome" />
        </feMerge>
      </filter>
    );
  }

  if (finish === "acrylic" || finish === "acrylicGel") {
    const gel = finish === "acrylicGel";
    return (
      <filter id={id} {...region} colorInterpolationFilters="sRGB">
        <CastShadow k={k} blur={2.6} dx={3.4} dy={7} opacity={0.55} />
        <Extrusion k={k} layers={5} depth={4.6} tones={ACRYLIC_TONES} result="wall" />
        <EdgeRim k={k} strength={gel ? 0.5 : 0.95} result="rim" />
        {gel && <GelDome k={k} blur={3} scale={5.5} shine={1.2} result="dome" />}
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="wall" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="rim" />
          {gel && <feMergeNode in="dome" />}
        </feMerge>
      </filter>
    );
  }

  if (finish === "bevel") {
    return (
      <filter id={id} {...region} colorInterpolationFilters="sRGB">
        <CastShadow k={k} blur={2} dx={2.4} dy={5} opacity={0.5} />
        <Extrusion k={k} layers={3} depth={2.6} tones={ACRYLIC_TONES.slice(1)} result="wall" />
        {/* Inside the glyph the blurred alpha runs 0.5 (edge) → 1 (centre).
            Remap 0.5–0.85 to a 0–1 ramp: an angled chamfer round a flat top */}
        <feGaussianBlur in="SourceAlpha" stdDeviation={3.4 * k} result="bb" />
        <feComponentTransfer in="bb" result="bh">
          <feFuncA type="linear" slope={2.9} intercept={-1.45} />
        </feComponentTransfer>
        <feSpecularLighting
          in="bh"
          surfaceScale={3.2 * k}
          specularConstant={1.7}
          specularExponent={14}
          lightingColor="#f2f6fb"
          result="bs"
        >
          <feDistantLight azimuth={LIGHT_AZIMUTH} elevation={20} />
        </feSpecularLighting>
        <feComposite in="bs" in2="SourceAlpha" operator="in" result="facets" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="wall" />
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="facets" />
        </feMerge>
      </filter>
    );
  }

  return null;
}

/* ——— Plate ——— */

type Props = {
  reg: string;
  finish: PlateFinish;
  face: PlateFace;
  badge: BadgeId;
  /** Real plate size, e.g. 520 × 111 */
  widthMm: number;
  heightMm: number;
  hex?: boolean;
  borderColor?: string | null;
  /** Draw the acrylic's edge thickness under the plate */
  edge?: boolean;
  className?: string;
};

/* Legal layout (BS AU 145e): 79mm characters, 50mm wide, 11mm apart,
   33mm between groups, 11mm margins, side band up to 50mm.
   Barlow Condensed bold: cap height 0.7em, cap advance ≈ 0.46em, space ≈ 0.2em. */
const CHAR_H = 79;
const CAP = 0.7;
const ADVANCE = 0.46;
const SPACE = 0.2;
const MARGIN = 11;
const MAKER = `${COMPANY.brand} · RNPS ${COMPANY.rnps} · BS AU 145e`;

const CHAR_FILL: Record<PlateFinish, string> = {
  standard: "#111214",
  gel: "#070708",
  acrylic: "#121316",
  acrylicGel: "#08090a",
  bevel: "#0b0c0e",
  ghost: "#23272e",
};

/** Plate outline: rounded rectangle, or hexagon with angled ends */
function outline(W: number, H: number, hex: boolean, inset = 0) {
  if (hex) {
    const c = H * 0.2;
    const i = inset;
    return `M${c + i} ${i} H${W - c - i} L${W - i} ${H / 2} L${W - c - i} ${H - i} H${c + i} L${i} ${H / 2} Z`;
  }
  const r = Math.max(2, 7 - inset * 0.5);
  const x = inset;
  const y = inset;
  const w = W - inset * 2;
  const h = H - inset * 2;
  return `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`;
}

/**
 * An SVG number plate drawn in millimetres, so every size is to scale and
 * the characters keep their legal 79mm height.
 */
export default function PlateRender({
  reg,
  finish,
  face,
  badge,
  widthMm: W,
  heightMm: H,
  hex = false,
  borderColor,
  edge = false,
  className = "",
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `p${uid}-${name}`;

  const text = reg.trim() || "YOUR REG";
  const hasBadge = badge !== "none";
  const isEv = badge === "ev";
  const bandInset = 4;
  const bandW = hasBadge ? (isEv ? 34 : 44) : 0;
  const left = hasBadge ? bandInset + bandW : 0;
  const hexPad = hex ? H * 0.12 : 0;
  const available = W - left - MARGIN * 2 - hexPad * 2;

  // Legal size unless the text can't fit (e.g. a badge on a short plate)
  const spacing = 0.08; // em between characters ≈ 11mm at legal size
  const chars = text.replace(/ /g, "").length;
  const spaces = text.length - chars;
  const widthEm = chars * (ADVANCE + spacing) + spaces * (SPACE + spacing) - spacing;
  const fontSize = Math.min(CHAR_H / CAP, available / widthEm);
  const capH = fontSize * CAP;
  const cx = left + (W - left) / 2;
  const k = fontSize / 100;
  const makerSize = Math.min(5.2, (W - left - 16) / (MAKER.length * 0.62));
  const raised = finish !== "standard";
  const shape = outline(W, H, hex);

  const chars$ = (
    <g
      key={finish}
      className={styles.chars}
      filter={raised ? `url(#${id("finish")})` : undefined}
      fill={CHAR_FILL[finish]}
      style={{ fontFamily: plateFont.style.fontFamily, fontWeight: 700 }}
      fontSize={fontSize}
      textAnchor="middle"
    >
      <text x={cx} y={H / 2 + capH / 2 - H * 0.025} letterSpacing={fontSize * spacing}>
        {text}
      </text>
    </g>
  );

  return (
    <div className={`${styles.frame} ${className}`}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={id("face")} x1="0" y1="0" x2="0" y2="1">
            {face === "yellow" ? (
              <>
                <stop offset="0" stopColor="#ffd82e" />
                <stop offset="0.55" stopColor="#f8c700" />
                <stop offset="1" stopColor="#e8b200" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor="#fdfdfe" />
                <stop offset="0.55" stopColor="#f0f2f5" />
                <stop offset="1" stopColor="#dde2e8" />
              </>
            )}
          </linearGradient>

          {/* Retro-reflective sheeting has a fine, even grain */}
          <filter id={id("grain")} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0"
            />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>

          {/* Light falling across the acrylic from the top-left */}
          <radialGradient id={id("key")} cx="0.22" cy="0" r="0.9">
            <stop offset="0" stopColor="#fff" stopOpacity="0.4" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("vignette")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.14" />
          </linearGradient>
          {/* Soft studio reflection across the glossy face */}
          <linearGradient id={id("gloss")} x1="0" y1="0" x2="1" y2="0.35">
            <stop offset="0.18" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="0.36" stopColor="#fff" stopOpacity="0.05" />
            <stop offset="0.62" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="0.76" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a50cc" />
            <stop offset="0.6" stopColor="#1638a8" />
            <stop offset="1" stopColor="#0f2b88" />
          </linearGradient>

          <clipPath id={id("clip")}>
            <path d={shape} />
          </clipPath>

          <FinishFilter id={id("finish")} finish={finish} k={k} />
        </defs>

        {/* Acrylic thickness, seen from slightly above */}
        {edge && (
          <g aria-hidden="true">
            <path d={shape} transform="translate(0 4.5)" fill="#2e343c" />
            <path d={shape} transform="translate(0 3)" fill="#6f7782" />
            <path d={shape} transform="translate(0 1.5)" fill="#c1c8d1" />
          </g>
        )}

        <g clipPath={`url(#${id("clip")})`}>
          <rect width={W} height={H} fill={`url(#${id("face")})`} />
          <rect width={W} height={H} fill="#000" filter={`url(#${id("grain")})`} />
          <rect width={W} height={H} fill={`url(#${id("key")})`} />
          <rect width={W} height={H} fill={`url(#${id("vignette")})`} />

          {/* Ghost: smoked face */}
          <rect
            width={W}
            height={H}
            className={styles.tint}
            fill="#0c0e14"
            opacity={finish === "ghost" ? 0.4 : 0}
          />

          {borderColor && (
            <path
              d={outline(W, H, hex, 4.5)}
              fill="none"
              stroke={borderColor}
              strokeWidth={3}
              strokeLinejoin="round"
            />
          )}

          {isEv && (
            <rect
              x={bandInset}
              y={bandInset}
              width={bandW}
              height={H - bandInset * 2}
              rx={4}
              fill={EV_GREEN}
            />
          )}

          {hasBadge && !isEv && (
            <g>
              <rect
                x={bandInset}
                y={bandInset}
                width={bandW}
                height={H - bandInset * 2}
                rx={4}
                fill={`url(#${id("band")})`}
              />
              <svg
                x={bandInset + bandW * 0.16}
                y={bandInset + (H - bandInset * 2) * 0.14}
                width={bandW * 0.68}
                height={bandW * 0.68 * (40 / 60)}
                viewBox="0 0 60 40"
              >
                {FLAG_ART[badge]}
              </svg>
              <text
                x={bandInset + bandW / 2}
                y={H - bandInset - (H - bandInset * 2) * 0.14}
                textAnchor="middle"
                fill="#fff"
                fontSize={Math.min(15, bandW * (BADGE_CODE[badge].length > 2 ? 0.3 : 0.36))}
                fontWeight={700}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {BADGE_CODE[badge]}
              </text>
            </g>
          )}

          {/* Flat print sits under the acrylic; raised characters sit on top */}
          {!raised && chars$}

          <text
            x={cx}
            y={H - 4.5}
            textAnchor="middle"
            fill="#000"
            fillOpacity={0.55}
            fontSize={makerSize}
            fontWeight={600}
            letterSpacing={makerSize * 0.08}
            style={{ fontFamily: "var(--font-ui)", textTransform: "uppercase" }}
          >
            {MAKER}
          </text>

          <rect width={W} height={H} fill={`url(#${id("gloss")})`} />

          {raised && chars$}
        </g>

        {/* Polished acrylic edge */}
        <path
          d={outline(W, H, hex, 0.6)}
          fill="none"
          stroke="#fff"
          strokeOpacity={0.55}
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}
