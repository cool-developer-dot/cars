import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { BanGlyph, ShieldTickGlyph, SparklesGlyph } from "./deliveryIcons";
import s from "./CareWarranty3D.module.css";
import p from "./page3d.module.css";

const CARDS = [
  {
    id: "clean",
    Glyph: SparklesGlyph,
    title: "Clean Gently",
    text: "Wash with car shampoo and a soft cloth.",
  },
  {
    id: "scratch",
    Glyph: BanGlyph,
    title: "Avoid Scratching",
    text: "Do not scrape ice or dirt off the raised characters with anything hard.",
  },
  {
    id: "warranty",
    Glyph: ShieldTickGlyph,
    title: "Warranty Support",
    text: "If you think a plate we made has a manufacturing fault, contact us and we’ll assess it.",
  },
] as const;

export default function CareWarranty3D() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="care3d-title">
      <div className={p.wrap}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={h.eyebrow}>Care and support</p>
          <h2 id="care3d-title" className={`${h.title} ${s.title}`}>
            Caring for Your 3D Plates <span className={`${h.accent} ${s.line}`}>and Warranty Support</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Keep your 3D number plates looking their best. Wash with car shampoo and a soft cloth,
            and avoid scraping ice or dirt off the raised characters with anything hard. If you think
            a plate we made has a manufacturing fault, contact us and we&rsquo;ll assess it.
          </p>
        </Reveal>

        {/* Macro of a gel plate: a banner on phones, bleeding off the right on desktop */}
        <div className={s.photo} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/3d/care-plate.webp"
            srcSet="/3d/care-plate-mobile.webp 960w, /3d/care-plate.webp 1920w"
            sizes="(min-width: 1280px) 60vw, 100vw"
            alt=""
            width={1920}
            height={1100}
            loading="lazy"
            decoding="async"
          />
        </div>

        <ul className={s.cards}>
          {CARDS.map(({ id, Glyph, title, text }, i) => (
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
