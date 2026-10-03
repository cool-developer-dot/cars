import { CarFront, Motorbike, Ruler } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import PlateArt from "@/components/home/PlateArt";
import h from "@/components/home/home.module.css";
import { plateFont } from "@/lib/fonts";
import { PRODUCTS } from "@/lib/products";
import s from "./SizesOptions.module.css";

const sizes = PRODUCTS["3d"].sizes.paragraphs;

/** 520 × 111 plate with its dimension lines */
function StandardFigure() {
  return (
    <div className={s.figStd} aria-hidden="true">
      <span className={s.dimTop}>
        <span className={s.dimLine} />
        <span className={s.dimLabel}>520mm</span>
        <span className={s.dimLine} />
      </span>
      <span className={s.stdPlate}>
        <PlateArt reg="AB12 CDE" face="white" finish="gel" />
      </span>
      <span className={s.dimSide}>
        <span className={s.dimLineV} />
        <span className={s.dimLabel}>111mm</span>
      </span>
    </div>
  );
}

/** Two-line motorcycle plates (shapes only — formats depend on the registration) */
function MotoFigure() {
  return (
    <div className={s.figMoto} aria-hidden="true">
      {[
        { id: "std", caption: "Standard motorcycle" },
        { id: "small", caption: "Smaller motorcycle" },
      ].map((m) => (
        <span key={m.id} className={s.motoItem}>
          <span className={`${s.moto} ${s[m.id]}`}>
            <span className={`${s.motoChars} ${plateFont.className}`}>
              <span>AB12</span>
              <span>CDE</span>
            </span>
          </span>
          <span className={s.caption}>{m.caption}</span>
        </span>
      ))}
    </div>
  );
}

/** A plate recess with what to measure */
function MeasureFigure() {
  return (
    <div className={s.figMeasure} aria-hidden="true">
      <span className={s.mLabel}>Check the available width</span>
      <span className={s.mWidth}>
        <span className={s.dimLine} />
      </span>
      <span className={s.mRow}>
        <span className={s.recess}>
          <span className={s.recessInner} />
          <span className={`${s.fix} ${s.fixL}`} />
          <span className={`${s.fix} ${s.fixR}`} />
        </span>
        <span className={s.mHeight}>
          <span className={s.dimLineV} />
          <span className={s.mLabel}>Check the height</span>
        </span>
      </span>
      <span className={s.mFix}>
        <span className={s.dashed} />
      </span>
      <span className={s.mLabel}>Check the fixing points</span>
    </div>
  );
}

const CARDS = [
  {
    id: "standard",
    Icon: Ruler,
    title: "Standard Size",
    text: "520mm × 111mm. Shorter sizes may also be available for this style — the builder will show what's offered once you enter your registration.",
    Figure: StandardFigure,
  },
  {
    id: "moto",
    Icon: Motorbike,
    title: "Motorcycle Options",
    text: sizes[1],
    Figure: MotoFigure,
  },
  {
    id: "measure",
    Icon: CarFront,
    title: "Measuring for a\u00a0Replacement",
    text: sizes[2].replace(/^Measuring for a replacement:\s*/i, "").replace(/^./, (c) => c.toUpperCase()),
    Figure: MeasureFigure,
  },
] as const;

export default function SizesOptions() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="sizes-title">
      <div className={h.container}>
        <Reveal className={h.head}>
          <p className={h.eyebrow}>Sizes and options</p>
          <h2 id="sizes-title" className={h.title}>
            3D Number Plate <span className={`${h.accent} ${s.line}`}>Sizes and Options</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Standard size is 520mm × 111mm. Depending on your registration, shorter
            sizes may also be available for this style — the builder will show
            what&rsquo;s offered once you enter your registration.
          </p>
        </Reveal>

        <ul className={s.cards}>
          {CARDS.map(({ id, Icon, title, text, Figure }, i) => (
            <Reveal as="li" key={id} index={i} className={`${h.glassLight} ${s.card}`}>
              <div className={s.cardHead}>
                <span className={`${h.iconSoft} ${s.icon}`} aria-hidden="true">
                  <Icon strokeWidth={2} />
                </span>
                <div>
                  <h3 className={s.cardTitle}>{title}</h3>
                  <p className={s.cardText}>{text}</p>
                </div>
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
