import type { ReactNode, SVGProps } from "react";
import {
  CarFront,
  CaseSensitive,
  Eye,
  Info,
  Layers,
  Leaf,
  Minus,
  MoveHorizontal,
  RectangleHorizontal,
  Ruler,
  ShieldCheck,
  Slash,
  Sparkles,
  Zap,
} from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { gbp } from "@/lib/site";
import { COMPARE_CARDS, type CompareId, type ProductPageContent, type SpecIcon } from "./pageContent";
import s from "./FinishExplained.module.css";
import page from "./page.module.css";

type IconProps = SVGProps<SVGSVGElement>;

/** A soft quarter-round: the 3D gel's domed edge */
function RoundEdge(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" {...props}>
      <path d="M5 19C5 11 11 5 19 5" />
    </svg>
  );
}

/** A gel dome over a straight acrylic wall: the 5D edge */
function DomeOverWall(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 20v-7c0-4.4 3.6-8 8-8h6" />
      <path d="M5 13h4" />
    </svg>
  );
}

/** A 45-degree chamfer: the bevel's angled edge */
function Chamfer(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 20v-8l7-7h7" />
    </svg>
  );
}

type Icon = (p: IconProps) => ReactNode;

const EDGE_ICON: Partial<Record<CompareId, Icon>> = {
  standard: (p) => <Minus {...p} />,
  "3d": RoundEdge,
  "4d": (p) => <Slash {...p} />,
  "5d": DomeOverWall,
  ghost: RoundEdge,
  bevel: Chamfer,
};

const SPEC_ICON: Record<SpecIcon, Icon> = {
  size: (p) => <Ruler {...p} />,
  fits: (p) => <CarFront {...p} />,
  chars: (p) => <CaseSensitive {...p} />,
  plate: (p) => <RectangleHorizontal {...p} />,
  use: (p) => <Eye {...p} />,
  spacing: (p) => <MoveHorizontal {...p} />,
  markings: (p) => <ShieldCheck {...p} />,
  flash: (p) => <Zap {...p} />,
  for: (p) => <Leaf {...p} />,
};

export default function FinishExplained({ page: content }: { page: ProductPageContent }) {
  const { explained } = content;
  const [first, second] = explained.compare.pair;
  const cards = explained.compare.pair.map((id) => {
    const c = COMPARE_CARDS[id];
    return {
      id,
      name: c.name,
      price: c.price,
      img: explained.compare.images?.[id] ?? c.img,
      alt: c.alt,
      specs: c.specs
        ? c.specs.map(({ label, value, icon }) => ({ label, value, Icon: SPEC_ICON[icon] }))
        : [
            { label: "Characters", value: c.characters ?? "", Icon: Layers as Icon },
            { label: "Edge", value: c.edge ?? "", Icon: EDGE_ICON[id] ?? RoundEdge },
            { label: "Look", value: c.look ?? "", Icon: Sparkles as Icon },
          ],
    };
  });

  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="gel-title">
      <div className={page.wrap}>
        <div className={s.top}>
          <Reveal className={s.head}>
            <p className={h.eyebrow}>Know the difference</p>
            <h2 id="gel-title" className={h.title}>
              {explained.title} <span className={`${h.accent} ${s.line}`}>{explained.accent}</span>
            </h2>
          </Reveal>

          <Reveal className={s.body} index={1}>
            <p className={`${h.lead} ${s.lead}`}>{explained.lead}</p>
            <div className={`${h.liquid} ${s.note}`}>
              <span className={s.noteIcon} aria-hidden="true">
                <Info strokeWidth={2} />
              </span>
              <p>{explained.note}</p>
            </div>
          </Reveal>

          <div className={s.art}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={explained.art.src}
              alt={explained.art.alt}
              width={explained.art.width}
              height={explained.art.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className={s.compare}>
          <Reveal className={s.compareHead}>
            <p className={h.eyebrow}>Comparison</p>
            <h2 className={h.title}>
{explained.compare.heading ? (
              <>
                {explained.compare.heading[0]} <span className={h.accent}>{explained.compare.heading[1]}</span>
              </>
            ) : (
              <>
                {COMPARE_CARDS[first].name.replace(/ Gel$/, "")} <span className={s.lower}>vs</span>{" "}
                {COMPARE_CARDS[second].name.replace(/ Gel$/, "")} Number Plates{" "}
                <span className={h.accent}>{explained.compare.tail}</span>
              </>
            )}
            </h2>
          </Reveal>

          <ul className={s.cards}>
            {cards.map((c, i) => (
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
