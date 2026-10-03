import type { SVGProps } from "react";
import { Info, Layers, Slash, Sparkles } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { PRODUCTS } from "@/lib/products";
import { PRICES, gbp } from "@/lib/site";
import s from "./GelExplained.module.css";

const p = PRODUCTS["3d"];
/** Characters / Edge / Look rows from the product's comparison table */
const row = (label: string) => p.compare.rows.find((r) => r.label === label)?.values ?? [];
const [chars, edge, look] = [row("Characters"), row("Edge"), row("Look")];

/** A soft quarter-round: the 3D gel's domed edge */
function RoundEdge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M5 19C5 11 11 5 19 5" />
    </svg>
  );
}

const CARDS = [
  {
    id: "3d",
    name: "3D Gel",
    price: PRICES["3d"].single,
    img: "/3d/macro-3d-gel.webp",
    alt: "Close-up of a domed, glossy 3D gel character",
    specs: [
      { label: "Characters", value: chars[0], Icon: Layers },
      { label: "Edge", value: edge[0], Icon: RoundEdge },
      { label: "Look", value: look[0], Icon: Sparkles },
    ],
  },
  {
    id: "4d",
    name: "4D",
    price: PRICES["4d"].single,
    img: "/3d/macro-4d.webp",
    alt: "Close-up of a sharp, flat-topped 4D acrylic character",
    specs: [
      { label: "Characters", value: chars[1], Icon: Layers },
      { label: "Edge", value: edge[1], Icon: Slash },
      { label: "Look", value: look[1], Icon: Sparkles },
    ],
  },
] as const;

export default function GelExplained() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="gel-title">
      <div className={h.container}>
        <div className={s.top}>
          <Reveal className={s.head}>
            <p className={h.eyebrow}>Know the difference</p>
            <h2 id="gel-title" className={h.title}>
              What Are 3D Gel <span className={`${h.accent} ${s.line}`}>Number Plates?</span>
            </h2>
          </Reveal>

          <Reveal className={s.body} index={1}>
            <p className={`${h.lead} ${s.lead}`}>{p.intro.paragraphs[0]}</p>
            <div className={`${h.liquid} ${s.note}`}>
              <span className={s.noteIcon} aria-hidden="true">
                <Info strokeWidth={2} />
              </span>
              <p>{p.intro.paragraphs[1]}</p>
            </div>
          </Reveal>

          <div className={s.art}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/3d/gel-plates.webp"
              alt="A white front and a yellow rear 3D gel number plate with raised, glossy black characters"
              width={1522}
              height={1010}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className={s.compare}>
          <Reveal className={s.compareHead}>
            <p className={h.eyebrow}>Comparison</p>
            <h2 className={h.title}>
              3D <span className={s.lower}>vs</span> 4D Number Plates{" "}
              <span className={h.accent}>— Gel or Acrylic?</span>
            </h2>
          </Reveal>

          <ul className={s.cards}>
            {CARDS.map((c, i) => (
              <Reveal as="li" key={c.id} index={i} className={`${h.liquid} ${s.card}`}>
                <div className={s.cardHead}>
                  <div>
                    <h3 className={s.cardTitle}>{c.name}</h3>
                    <p className={s.cardDesc}>{c.specs[0].value}.</p>
                  </div>
                  <p className={s.price}>
                    <span>From</span>
                    <strong>{gbp(c.price)}</strong>
                  </p>
                </div>

                <div className={s.cardBody}>
                  <div className={s.macro}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={c.alt} width={580} height={464} loading="lazy" decoding="async" />
                  </div>
                  <dl className={s.specs}>
                    {c.specs.map(({ label, value, Icon }) => (
                      <div key={label} className={s.spec}>
                        <span className={s.specIcon} aria-hidden="true">
                          <Icon strokeWidth={1.9} />
                        </span>
                        <div>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
