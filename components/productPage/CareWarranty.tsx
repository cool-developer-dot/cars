import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { BanGlyph, ShieldTickGlyph, SparklesGlyph } from "./deliveryIcons";
import type { ProductPageContent } from "./pageContent";
import s from "./CareWarranty.module.css";
import p from "./page.module.css";

const cardsFor = (scratch: ProductPageContent["care"]["scratch"]) => [
  {
    id: "clean",
    Glyph: SparklesGlyph,
    title: "Clean Gently",
    text: "Wash with car shampoo and a soft cloth.",
  },
  {
    id: "scratch",
    Glyph: BanGlyph,
    ...scratch,
  },
  {
    id: "warranty",
    Glyph: ShieldTickGlyph,
    title: "Warranty Support",
    text: "If you think a plate we made has a manufacturing fault, contact us and we’ll assess it.",
  },
] as const;

export default function CareWarranty({ page }: { page: ProductPageContent }) {
  const { care } = page;
  const cards = cardsFor(care.scratch);
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="care-title">
      <div className={p.wrap}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={h.eyebrow}>Care and support</p>
          <h2 id="care-title" className={`${h.title} ${s.title}`}>
            Caring for Your {page.name} Plates <span className={`${h.accent} ${s.line}`}>and Warranty Support</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>{care.lead}</p>
        </Reveal>

        {/* Macro of the plate: a banner on phones, bleeding off the right on desktop */}
        <div className={s.photo} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={care.photo.src}
            srcSet={`${care.photo.srcMobile} 960w, ${care.photo.src} 1920w`}
            sizes="(min-width: 1280px) 60vw, 100vw"
            alt=""
            width={1920}
            height={1100}
            loading="lazy"
            decoding="async"
          />
        </div>

        <ul className={s.cards}>
          {cards.map(({ id, Glyph, title, text }, i) => (
            <Reveal as="li" key={id} index={i} className={`${h.liquid} ${s.card}`}>
              <span className={s.tile} aria-hidden="true">
                <Glyph />
              </span>
              <h3 className={s.cardTitle}>{title}</h3>
              <p className={s.cardText}>{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Into "Helpful guides" (dark) */}
      <NeonEdge fill="#052946" />
    </section>
  );
}
