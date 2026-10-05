import { CaseSensitive, Layers, MoveHorizontal, ShieldCheck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { PRODUCTS } from "@/lib/products";
import s from "./LegalInfo.module.css";

const legal = PRODUCTS["3d"].legal.paragraphs[0];
const HL = "correct reflective";
const [before, after] = legal.includes(HL) ? legal.split(HL) : [legal, ""];

const BADGES = [
  { Icon: CaseSensitive, label: "Charles Wright Typeface" },
  { Icon: MoveHorizontal, label: "Legal Size and Spacing" },
  { Icon: Layers, label: "Correct Reflective Background" },
  { Icon: ShieldCheck, label: "Supplier Markings (British Standard)" },
];

export default function LegalInfo() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="legal3d-title">
      <div className={h.container}>
        <div className={s.copy}>
          <Reveal>
            <p className={h.eyebrow}>Legal information</p>
            <h2 id="legal3d-title" className={h.title}>
              Are 3D Number Plates <span className={`${h.accent} ${s.line}`}>Legal in the UK?</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              {before}
              {after !== "" && (
                <>
                  <span className={s.hl}>{HL}</span>
                  {after}
                </>
              )}
            </p>
            <p className={`${h.lead} ${s.lead}`}>
              This covers how the plate must be made and displayed. It&rsquo;s a
              separate question from what a DVSA MOT tester checks — whether the
              characters are correctly formed, evenly spaced, secure and not obscured.
            </p>
          </Reveal>

          <div className={s.photo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/3d/legal-car.webp"
              alt="The front of a dark car fitted with a white 3D gel number plate"
              width={1492}
              height={868}
              loading="lazy"
              decoding="async"
            />
          </div>

          <ul className={s.badges}>
            {BADGES.map(({ Icon, label }, i) => (
              <Reveal as="li" key={label} index={i} className={`${h.liquid} ${s.badge}`}>
                <span className={s.badgeIcon} aria-hidden="true">
                  <Icon strokeWidth={2} />
                </span>
                <span className={s.badgeLabel}>{label}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {/* Into "How to order" (light) */}
      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
