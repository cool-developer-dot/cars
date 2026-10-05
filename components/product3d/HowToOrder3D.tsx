import { ArrowRight, ChevronRight, Search, ShoppingCart } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import h from "@/components/home/home.module.css";
import { plateFont } from "@/lib/fonts";
import { CarFrontIcon, CarRearIcon, PairIcon } from "./orderIcons";
import s from "./HowToOrder3D.module.css";

/* The little drawings under each step. They show what the step looks like in
   the builder; they aren't controls, so they're hidden from assistive tech. */

function RegArt() {
  return (
    <span className={s.reg}>
      <span className={s.regField}>
        <span className={`${s.regText} ${plateFont.className}`}>AB12 CDE</span>
      </span>
      <span className={s.regBtn}>
        <Search strokeWidth={2.2} />
      </span>
    </span>
  );
}

function OptionsArt() {
  return (
    <span className={s.tiles}>
      <span className={s.tile}>
        <CarFrontIcon />
        <span className={s.tileLabel}>Front</span>
      </span>
      <span className={s.tile}>
        <CarRearIcon />
        <span className={s.tileLabel}>Rear</span>
      </span>
      <span className={`${s.tile} ${s.tileOn}`}>
        <PairIcon />
        <span className={s.tileLabel}>Pair</span>
      </span>
    </span>
  );
}

function PreviewArt() {
  return (
    <span className={s.plate}>
      <span className={s.plateFace}>
        <span className={`${s.plateChars} ${plateFont.className}`}>AB12 CDE</span>
      </span>
    </span>
  );
}

function BasketArt() {
  return (
    <span className={s.add}>
      <ShoppingCart strokeWidth={2} />
      <span>Add to Basket</span>
      <ArrowRight strokeWidth={2.2} />
    </span>
  );
}

/** `lines` are where the title breaks on the narrow four-across cards */
const STEPS = [
  {
    lines: ["Enter Your", "Registration"],
    text: "Type your number plate into our builder to see the available options.",
    Art: RegArt,
  },
  {
    lines: ["Choose Plate", "Options"],
    text: "Select front, rear or a pair and choose your preferred style and size (where available).",
    Art: OptionsArt,
  },
  {
    lines: ["Preview Your Plate"],
    text: "See a live preview of your 3D number plate with your chosen options.",
    Art: PreviewArt,
  },
  {
    lines: ["Add to Basket", "and Checkout"],
    text: "Once you’re happy with your plate, add to basket and complete your order.",
    Art: BasketArt,
  },
] as const;

export default function HowToOrder3D() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="order3d-title">
      <div className={`${h.container} ${s.wide}`}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>How to order</p>
          <h2 id="order3d-title" className={`${h.title} ${s.title}`}>
            How to Order 3D <span className={`${h.accent} ${s.line}`}>Number Plates Online</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Enter your registration, choose front, rear or a pair, and preview
            <br className={s.brWide} /> your plate before you buy.
          </p>
        </Reveal>

        <ol className={s.cards}>
          {STEPS.map(({ lines, text, Art }, i) => (
            <Reveal as="li" key={lines.join(" ")} index={i} className={`${h.glassLight} ${s.card}`}>
              <div className={s.cardHead}>
                <span className={s.num} aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className={s.cardTitle}>
                  {lines.map((line, n) => (
                    <span key={line}>
                      {n > 0 && <br className={s.brTitle} />}
                      {n > 0 && " "}
                      {line}
                    </span>
                  ))}
                </h3>
                <p className={s.cardText}>{text}</p>
              </div>
              <div className={s.ui} aria-hidden="true">
                <Art />
              </div>
              {i < STEPS.length - 1 && (
                <span className={s.chev} aria-hidden="true">
                  <ChevronRight strokeWidth={2.6} />
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </div>

      {/* The join with "Documents" is drawn by that section (GlassEdge) */}
    </section>
  );
}
