import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import PageHero from "@/components/content/PageHero";
import Reveal from "@/components/content/Reveal";
import {
  CtaBand,
  LegalBlock,
  PriceTable,
  SectionHead,
  TrustChips,
} from "@/components/content/blocks";
import { FROM_PRICE, PRICES, WARRANTY_MONTHS, gbp, pairPrice, type StyleId } from "@/lib/site";
import c from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: { absolute: "Number Plate Styles and Prices | ReplacementPlates" },
  description:
    `Standard, 3D gel, 4D, 5D, Ghost and Bevel number plates, priced per plate from ${gbp(FROM_PRICE)}. Compare finishes and prices, then build your plates online.`,
  alternates: { canonical: "/plate-styles" },
};

const ORDER: StyleId[] = ["standard", "3d", "4d", "5d", "ghost", "bevel"];

export default function PlateStylesPage() {
  return (
    <div className={`${c.theme} ${c.page}`}>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Plate styles" }]}
        eyebrow="Plate styles"
        title={
          <>
            Choose your style, <span className={c.accent}>priced per plate</span>
          </>
        }
        lead="Standard, 3D, 4D, 5D, Ghost and Bevel styles, made to order. Change finish when you replace — the registration, typeface, spacing and markings stay the same."
        chips={<TrustChips />}
      />

      <section className={c.section} aria-labelledby="prices-title">
        <div className={c.container}>
          <SectionHead
            id="prices-title"
            eyebrow="Price list"
            title="Every style at a glance"
            sub="“From” prices are for one plate; a pair (front and rear) has its own price, shown alongside. Also made to order: motorcycle and oversized plates."
          />
          <PriceTable />
        </div>
      </section>

      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="styles-title">
        <div className={c.container}>
          <SectionHead id="styles-title" eyebrow="Finishes" title="Find the finish that suits your car" />
          <ul className={c.grid3}>
            {ORDER.map((id, i) => {
              const p = PRICES[id];
              const hasPage = p.href.startsWith("/") && !p.href.includes("#");
              const body = (
                <>
                  <h3 className={c.cardTitle}>{p.name}</h3>
                  <p className={c.cardText}>{p.what}.</p>
                  <span className={c.cardPrice}>
                    <strong>{gbp(p.single)}</strong> per plate · {gbp(pairPrice(id))} pair
                  </span>
                  <span className={c.cardPrice}>
                    {WARRANTY_MONTHS[id]}-month manufacturing-defect warranty
                  </span>
                  {hasPage && (
                    <span className={c.textLink} style={{ marginTop: 16 }}>
                      Explore {p.name} <ArrowRight aria-hidden="true" />
                    </span>
                  )}
                </>
              );
              return (
                <Reveal as="li" key={id} index={i % 3}>
                  {hasPage ? (
                    <Link href={p.href} className={`${c.card} ${c.cardLink}`}>
                      {body}
                    </Link>
                  ) : (
                    <div className={c.card}>{body}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>
          <p className={c.note}>
            <Info aria-hidden="true" />
            Ghost&rsquo;s specific construction and compliance information is
            being finalised — please contact us for its current status before
            ordering that style.
          </p>
        </div>
      </section>

      <section className={c.section} aria-labelledby="legal-title">
        <div className={c.container}>
          <SectionHead
            id="legal-title"
            eyebrow="Legal requirements"
            title="Plates made to the legal requirements"
            sub="Our Standard, 3D, 4D, 5D and Bevel styles are made to these requirements."
          />
          <LegalBlock />
        </div>
      </section>

      <section className={c.section} style={{ paddingTop: 0 }}>
        <div className={c.container}>
          <CtaBand />
        </div>
      </section>
    </div>
  );
}
