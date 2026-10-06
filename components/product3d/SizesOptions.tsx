import { Ruler } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { plateFont } from "@/lib/fonts";
import { PRODUCTS } from "@/lib/products";
import s from "./SizesOptions.module.css";
import p from "./page3d.module.css";

const sizes = PRODUCTS["3d"].sizes.paragraphs;

/* ——— Icons ———
   The ruler is a stroked glyph; the bike and the car are solid shapes, so
   they're drawn here rather than taken from the outline icon set. */

function RulerIcon() {
  return <Ruler className={s.ruler} strokeWidth={2.2} />;
}

function MotoIcon() {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {/* wheels, front fork and handlebar */}
        <circle cx="6.3" cy="16.8" r="3.9" strokeWidth="2.3" />
        <circle cx="25.7" cy="16.8" r="3.9" strokeWidth="2.3" />
        <path d="M25.1 12.9 22.3 7.6" strokeWidth="2.3" />
        <path d="M19.6 6.3 23.6 6.9" strokeWidth="2.5" />
      </g>
      <circle cx="6.3" cy="16.8" r="1.1" />
      <circle cx="25.7" cy="16.8" r="1.1" />
      {/* tail, seat and tank, then the engine block */}
      <path d="M3.2 10.6c1.9-.7 4.3-.9 6.7-.7l1.6-1.8c.4-.5 1-.8 1.7-.8h4.4l1.5 1.8 3 .2-.2 2.2-3.4 1.4-2 1.6H11l-1.6-1.4H5.4z" />
      <path d="M10.2 12.8h8.6v3.6c0 .7-.5 1.2-1.2 1.2h-6.2c-.6 0-1.2-.5-1.2-1.2z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 28 24" fill="currentColor">
      {/* roof + windscreen */}
      <path
        fillRule="evenodd"
        d="M8.4 3.6h11.2c.8 0 1.5.5 1.8 1.2l1.6 4.2H5L6.6 4.8c.3-.7 1-1.2 1.8-1.2zm.4 2.2c-.2 0-.4.1-.5.3L7.4 8.2h13.2l-.9-2.1c-.1-.2-.3-.3-.5-.3z"
      />
      {/* body, headlights cut out */}
      <path
        fillRule="evenodd"
        d="M3.6 9.6h20.8c1.1 0 2 .9 2 2v7.2c0 .9-.7 1.6-1.6 1.6h-2.2c-.9 0-1.6-.7-1.6-1.6V18H7v.8c0 .9-.7 1.6-1.6 1.6H3.2c-.9 0-1.6-.7-1.6-1.6v-7.2c0-1.1.9-2 2-2zM6.2 12.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zm15.6 0a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z"
      />
      {/* wing mirrors */}
      <rect x="0.6" y="9.4" width="2.6" height="2.2" rx="1" />
      <rect x="24.8" y="9.4" width="2.6" height="2.2" rx="1" />
    </svg>
  );
}

/* ——— Figures (decorative; the copy above each carries the meaning) ——— */

/** 520 × 111 plate with its dimension lines */
function StandardFigure() {
  return (
    <div className={s.figStd} aria-hidden="true">
      <span className={s.stdTop}>
        <span className={`${s.dimH} ${s.tickLeft}`} />
        <span className={s.dimLabel}>520mm</span>
        <span className={`${s.dimH} ${s.tickRight}`} />
      </span>
      <span className={`${s.flat} ${s.stdPlate}`}>
        <span className={`${s.stdChars} ${plateFont.className}`}>AB12 CDE</span>
      </span>
      <span className={s.stdSide}>
        <span className={`${s.dimV} ${s.tickBoth}`} />
        <span className={s.dimLabel}>111mm</span>
      </span>
    </div>
  );
}

/** Two-line motorcycle plates with their sizes */
const MOTO_PLATES = [
  { id: "std", size: "190mm × 145mm", name: "(Standard Motorcycle)" },
  { id: "small", size: "178mm × 102mm", name: "(Smaller Motorcycle)" },
] as const;

function MotoFigure() {
  return (
    <div className={s.figMoto} aria-hidden="true">
      {MOTO_PLATES.map((m) => (
        <span key={m.id} className={s.motoItem}>
          <span className={`${s.flat} ${s.moto} ${s[m.id]}`}>
            <span className={`${s.motoChars} ${plateFont.className}`}>
              <span>AB12</span>
              <span>CDE</span>
            </span>
          </span>
          <span className={s.caption}>
            <span className={s.capSize}>{m.size}</span>
            <span className={s.capName}>{m.name}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/** A plate recess, with what to measure */
function MeasureFigure() {
  return (
    <div className={s.figMeasure} aria-hidden="true">
      <span className={s.mTitle}>Check the available width</span>
      <span className={s.mWidth}>
        <span className={`${s.dimH} ${s.arrows} ${s.tickBoth}`} />
      </span>

      <span className={s.recess}>
        <span className={s.recessInner} />
        <span className={`${s.fix} ${s.fixL}`} />
        <span className={`${s.fix} ${s.fixR}`} />
      </span>
      <span className={s.mHeight}>
        <span className={`${s.dimV} ${s.arrows} ${s.tickBoth}`} />
        <span className={s.mHeightLabel}>
          Check
          <br />
          the height
        </span>
      </span>

      <span className={s.mFix}>
        <span className={`${s.dimH} ${s.dashed} ${s.arrows} ${s.tickBoth}`} />
      </span>
      <span className={s.mFixLabel}>Check the fixing points</span>
    </div>
  );
}

const CARDS = [
  {
    id: "standard",
    Icon: RulerIcon,
    title: "Standard Size",
    text: "520mm × 111mm. Shorter sizes may also be available for this style — the builder will show what's offered once you enter your registration.",
    Figure: StandardFigure,
  },
  {
    id: "moto",
    Icon: MotoIcon,
    title: "Motorcycle Options",
    text: sizes[1],
    Figure: MotoFigure,
  },
  {
    id: "measure",
    Icon: CarIcon,
    title: "Measuring for a Replacement",
    text: sizes[2].replace(/^Measuring for a replacement:\s*/i, "").replace(/^./, (c) => c.toUpperCase()),
    Figure: MeasureFigure,
  },
] as const;

export default function SizesOptions() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="sizes-title">
      <div className={p.wrap}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={h.eyebrow}>Sizes and options</p>
          <h2 id="sizes-title" className={`${h.title} ${s.title}`}>
            3D Number Plate <span className={`${h.accent} ${s.line}`}>Sizes and Options</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Standard size is 520mm × 111mm. Depending on your registration, shorter sizes
            <br className={s.brWide} /> may also be available for this style — the builder will show what&rsquo;s offered once
            <br className={s.brWide} /> you enter your registration.
          </p>
        </Reveal>

        <ul className={s.cards}>
          {CARDS.map(({ id, Icon, title, text, Figure }, i) => (
            <Reveal as="li" key={id} index={i} className={`${h.glassLight} ${s.card}`}>
              <div className={s.cardHead}>
                <span className={`${h.iconSoft} ${s.icon}`} aria-hidden="true">
                  <Icon />
                </span>
                <h3 className={s.cardTitle}>{title}</h3>
                <p className={s.cardText}>{text}</p>
              </div>
              <div className={s.figure}>
                <Figure />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <NeonEdge fill="#06111f" light />
    </section>
  );
}
