import Link from "next/link";
import { ArrowRight, Info, Layers } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { COMPANY, PRICES, gbp, pairPrice } from "@/lib/site";
import BuilderLink from "./BuilderLink";
import PlateArt from "./PlateArt";
import { STYLE_ART, STYLE_ORDER } from "./homeConfig";
import h from "./home.module.css";
import s from "./StylesShowcase.module.css";

export default function StylesShowcase() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="styles-title">
      <div className={s.rays} aria-hidden="true" />

      <div className={s.inner}>
        <div className={s.head}>
          <Reveal className={s.headCopy}>
            <p className={`${h.eyebrow} ${s.eyebrow}`}>Plate styles</p>
            <h2 id="styles-title" className={s.title}>
              Choose your style,
              <br />
              <span className={s.accent}>priced per plate.</span>
            </h2>
            <p className={s.sub}>
              Standard, 3D, 4D, 5D, Ghost and Bevel styles, made to order by a
              DVLA-registered supplier.
            </p>
          </Reveal>

          <Reveal index={1} className={s.madeWrap}>
            <Link href="/plate-styles" className={`${h.glassLight} ${s.madeCard}`}>
              <Layers className={s.madeIcon} strokeWidth={1.7} aria-hidden="true" />
              <span className={s.madeText}>
                <strong className="title-case">All plates are made to order</strong>
                by a DVLA-registered supplier{" "}
                <span className={s.nowrap}>(RNPS {COMPANY.rnps})</span>
              </span>
              <span className={`${s.roundArrow} ${s.madeArrow}`} aria-hidden="true">
                <ArrowRight strokeWidth={2.2} />
              </span>
            </Link>
          </Reveal>
        </div>

        <ul className={s.grid}>
          {STYLE_ORDER.map((id, i) => {
            const art = STYLE_ART[id];
            const price = PRICES[id];
            return (
              <Reveal as="li" key={id} index={i}>
                <BuilderLink
                  seed={{ styleId: id }}
                  className={s.card}
                  aria-label={`${art.label}: ${art.blurb} From ${gbp(price.single)}, pair ${gbp(pairPrice(id))}`}
                >
                  <span className={s.media}>
                    <PlateArt reg="AB12 CDE" start className={s.plate} face={art.face} finish={art.finish} />
                  </span>
                  <span className={s.body}>
                    <span className={s.name}>{art.label}</span>
                    <span className={s.blurb}>{art.blurb}</span>
                    <span className={s.rule} />
                    <span className={s.foot}>
                      <span className={s.prices}>
                        <span className={s.from}>From {gbp(price.single)}</span>
                        <span className={s.pair}>Pair {gbp(pairPrice(id))}</span>
                      </span>
                      <span className={s.roundArrow} aria-hidden="true">
                        <ArrowRight strokeWidth={2.2} />
                      </span>
                    </span>
                  </span>
                </BuilderLink>
              </Reveal>
            );
          })}
        </ul>

        <Reveal>
          <p className={`${h.glassLight} ${s.infoBar}`}>
            <Info className={s.infoIcon} strokeWidth={1.8} aria-hidden="true" />
            <span>
              Prices are for one standard-size plate; a matching pair is priced as a
              pair. Also made to order:{" "}
              <BuilderLink options>short, hex</BuilderLink> and{" "}
              <BuilderLink options>oversized</BuilderLink> plates.
            </span>
          </p>
        </Reveal>
      </div>

      {/* Light → light: the neon line alone marks the seam */}
      <NeonEdge light />
    </section>
  );
}
