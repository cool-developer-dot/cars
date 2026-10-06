import { ArrowDown } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import PlateArt from "@/components/home/PlateArt";
import h from "@/components/home/home.module.css";
import { PRODUCTS } from "@/lib/products";
import s from "./Replacement3D.module.css";
import p from "./page3d.module.css";

const items = PRODUCTS["3d"].replacement.items;

/** Card titles as designed; the body copy is the product's own (lib/products.ts) */
const CARDS = [
  {
    id: "cracked",
    title: "Replacing lifted, cracked or cloudy gel characters",
    text: items[0].text,
    img: { src: "/3d/replace-cracked.webp", w: 640, h: 568 },
  },
  {
    id: "lost",
    title: "Replacing a lost front or rear plate",
    text: items[1].text,
    img: { src: "/3d/replace-lost.webp", w: 752, h: 568 },
  },
  {
    id: "match",
    title: "Can we match your existing 3D plate?",
    text: items[2].text,
    img: { src: "/3d/replace-match.webp", w: 666, h: 666 },
  },
  {
    id: "upgrade",
    title: "Correcting illegal spacing or upgrading from printed plates",
    text: items[3].text,
  },
] as const;

/** Printed plate → 3D gel plate, drawn with the site's plate art */
function UpgradeArt() {
  return (
    <div className={s.upgrade} aria-hidden="true">
      <div className={s.upPlate}>
        <span className={`${s.tag} ${s.tagGrey}`}>Printed</span>
        <PlateArt reg="AB12 CDE" face="white" finish="standard" />
      </div>
      <ArrowDown className={s.upArrow} strokeWidth={2.4} />
      <div className={s.upPlate}>
        <span className={`${s.tag} ${s.tagBlue}`}>3D Gel</span>
        <PlateArt reg="AB12 CDE" face="white" finish="gel" />
      </div>
    </div>
  );
}

export default function Replacement3D() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="replace-title">
      <div className={p.wrap}>
        <Reveal className={h.head}>
          <p className={h.eyebrow}>Replacement plates</p>
          <h2 id="replace-title" className={h.title}>
            Replacement 3D Number Plates for{" "}
            <span className={`${h.accent} ${s.line}`}>Damaged, Lost or Worn Plates</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Need to replace a damaged, lost or worn 3D plate? We make like-for-like
            replacements in the correct legal format, using the same high-quality 3D
            gel finish from our range.
          </p>
        </Reveal>

        <ul className={s.grid}>
          {CARDS.map((c, i) => (
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
                  <UpgradeArt />
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
