import { ArrowDown } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import PlateArt from "@/components/home/PlateArt";
import h from "@/components/home/home.module.css";
import type { ProductPageContent } from "./pageContent";
import s from "./Replacement.module.css";
import p from "./page.module.css";

/** Printed plate → this style's plate, drawn with the site's plate art */
function UpgradeArt({ tag, finish }: ProductPageContent["replacement"]["upgrade"]) {
  return (
    <div className={s.upgrade} aria-hidden="true">
      <div className={s.upPlate}>
        <span className={`${s.tag} ${s.tagGrey}`}>Printed</span>
        <PlateArt reg="AB12 CDE" face="white" finish="standard" />
      </div>
      <ArrowDown className={s.upArrow} strokeWidth={2.4} />
      <div className={s.upPlate}>
        <span className={`${s.tag} ${s.tagBlue}`}>{tag}</span>
        <PlateArt reg="AB12 CDE" face="white" finish={finish} />
      </div>
    </div>
  );
}

export default function Replacement({ page }: { page: ProductPageContent }) {
  const { replacement } = page;
  const cards = [...replacement.cards, { id: "upgrade" as const, ...replacement.upgrade }];
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="replace-title">
      <div className={p.wrap}>
        <Reveal className={h.head}>
          <p className={h.eyebrow}>Replacement plates</p>
          <h2 id="replace-title" className={h.title}>
            Replacement {page.name} Number Plates for{" "}
            <span className={`${h.accent} ${s.line}`}>Damaged, Lost or Worn Plates</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>{replacement.lead}</p>
        </Reveal>

        <ul className={s.grid}>
          {cards.map((c, i) => (
            <Reveal as="li" key={c.id} index={i % 2} className={`${h.glassLight} ${s.card}`}>
              <div className={s.copy}>
                <h3 className={s.cardTitle}>{c.title}</h3>
                <p className={s.cardText}>{c.text}</p>
              </div>
              {"img" in c ? (
                <div className={`${s.media} ${s[c.id]}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img.src}
                    alt=""
                    width={c.img.w}
                    height={c.img.h}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className={`${s.media} ${s.mediaArt}`}>
                  <UpgradeArt {...replacement.upgrade} />
                </div>
              )}
            </Reveal>
          ))}
        </ul>
      </div>

      <NeonEdge fill="#06111f" light />
    </section>
  );
}
