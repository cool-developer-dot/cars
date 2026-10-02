import Link from "next/link";
import { ArrowRight, Info, Sparkles, Wrench, Ruler, Scale } from "lucide-react";
import FaqAccordion from "@/components/Faqs/FaqAccordion";
import type { ProductContent } from "@/lib/products";
import { COMPANY, PRICES, SITE_URL, WARRANTY_MONTHS, gbp, pairPrice } from "@/lib/site";
import PageHero from "./PageHero";
import Reveal from "./Reveal";
import JsonLd from "./JsonLd";
import {
  CtaBand,
  DeliveryBlock,
  DocumentsBlock,
  SectionHead,
  TrustChips,
} from "./blocks";
import c from "./content.module.css";
import { builderUrl } from "@/lib/builderLink";

export default function ProductPage({ product: p }: { product: ProductContent }) {
  const price = PRICES[p.id];
  const single = gbp(price.single);
  const pair = gbp(pairPrice(p.id));
  const build = builderUrl({ style: p.id });

  return (
    <div className={`${c.theme} ${c.page}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: p.h1,
              description: p.metaDescription,
              brand: { "@type": "Brand", name: COMPANY.brand },
              offers: {
                "@type": "Offer",
                price: price.single.toFixed(2),
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}${p.path}`,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Plate styles", item: `${SITE_URL}/plate-styles` },
                { "@type": "ListItem", position: 3, name: p.h1, item: `${SITE_URL}${p.path}` },
              ],
            },
          ],
        }}
      />

      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Plate styles", href: "/plate-styles" },
          { label: p.h1 },
        ]}
        eyebrow={`${price.name} plates`}
        title={
          <>
            {p.h1} <span className={c.accent}>from {single}</span> per plate
          </>
        }
        lead={p.lead}
        chips={<TrustChips />}
        aside={
          <div className={c.priceCard}>
            <div className={c.priceRow}>
              <div className={c.priceBox}>
                <span className={c.priceLabel}>Single front or rear</span>
                <span className={c.priceValue}>{single}</span>
                <span className={c.priceHint}>per plate</span>
              </div>
              <div className={c.priceBox}>
                <span className={c.priceLabel}>Matching pair</span>
                <span className={c.priceValue}>{pair}</span>
                <span className={c.priceHint}>front + rear</span>
              </div>
            </div>
            <Link href={build} className={c.btn}>
              Build my {p.short} plates
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </Link>
            <p className={c.priceFoot}>
              Same-day dispatch aim for orders complete before 2pm Mon–Fri ·{" "}
              {WARRANTY_MONTHS[p.id]}-month manufacturing-defect warranty
            </p>
          </div>
        }
      />

      {/* What it is */}
      <section className={c.section} aria-labelledby="intro-title">
        <div className={c.container}>
          <div className={c.grid2}>
            <SectionHead
              id="intro-title"
              eyebrow={p.intro.eyebrow}
              title={p.intro.heading}
            />
            <Reveal index={1} className={c.prose}>
              {p.intro.paragraphs.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Replacement situations */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="replace-title">
        <div className={c.container}>
          <SectionHead id="replace-title" eyebrow="Replacing a plate" title={p.replacement.heading} />
          <ul className={p.replacement.items.length > 3 ? c.grid4 : c.grid2}>
            {p.replacement.items.map((item, i) => (
              <Reveal as="li" key={item.title} index={i}>
                <div className={c.card}>
                  <h3 className={c.cardTitle}>{item.title}</h3>
                  <p className={c.cardText}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Comparison */}
      <section className={c.section} aria-labelledby="compare-title">
        <div className={c.container}>
          <SectionHead id="compare-title" eyebrow="Compare finishes" title={p.compare.heading} />
          <Reveal>
            <div className={c.tableWrap}>
              <table className={c.table}>
                <thead>
                  <tr>
                    <td />
                    {p.compare.columns.map((col, i) => (
                      <th key={col} scope="col" className={i === p.compare.highlight ? c.hl : ""}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.compare.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((v, i) => (
                        <td key={i} className={i === p.compare.highlight ? c.hl : ""}>
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          {p.compare.note && (
            <p className={c.note}>
              <Info aria-hidden="true" />
              <span>
                {p.compare.note.text}{" "}
                {p.compare.note.href && (
                  <Link href={p.compare.note.href} className={c.textLink}>
                    {p.compare.note.linkLabel}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                )}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Sizes · Legal · Care */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-label="Sizes, legal and care">
        <div className={c.container}>
          <ul className={c.grid3}>
            <Reveal as="li" index={0}>
              <div className={`${c.card} ${c.prose}`}>
                <span className={c.cardIcon} aria-hidden="true">
                  <Ruler />
                </span>
                <h2 className={c.cardTitle}>{p.sizes.heading}</h2>
                {p.sizes.paragraphs.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </Reveal>
            <Reveal as="li" index={1}>
              <div className={`${c.card} ${c.cardGlow} ${c.prose}`}>
                <span className={c.cardIcon} aria-hidden="true">
                  <Scale />
                </span>
                <h2 className={c.cardTitle}>{p.legal.heading}</h2>
                {p.legal.paragraphs.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </Reveal>
            <Reveal as="li" index={2}>
              <div className={`${c.card} ${c.prose}`}>
                <span className={c.cardIcon} aria-hidden="true">
                  {p.id === "4d" ? <Wrench /> : <Sparkles />}
                </span>
                <h2 className={c.cardTitle}>{p.care.heading}</h2>
                <p>{p.care.text}</p>
              </div>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* Documents */}
      <section className={`${c.section} ${c.anchor}`} id="documents" aria-labelledby="docs-title">
        <div className={c.container}>
          <SectionHead
            id="docs-title"
            eyebrow="Order online"
            title={`Order ${price.name} plates — documents and preview`}
            sub="Enter your registration, choose front, rear or a pair, and preview your plate before you buy. The law requires every registered supplier to see two things before making a plate:"
          />
          <DocumentsBlock />
        </div>
      </section>

      {/* Delivery */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="delivery-title">
        <div className={c.container}>
          <SectionHead
            id="delivery-title"
            eyebrow="Delivery & collection"
            title={`${price.name} plate delivery and Ilford collection`}
          />
          <DeliveryBlock />
        </div>
      </section>

      {/* FAQs */}
      <section className={c.section} aria-labelledby="faq-title">
        <div className={c.container}>
          <div className={c.grid2}>
            <SectionHead
              id="faq-title"
              sticky
              eyebrow="FAQs"
              title={`${price.name} number plate FAQs`}
              sub={
                <>
                  More answers on delivery, documents and cancellations on our{" "}
                  <Link href="/faqs" className={c.textLink}>
                    FAQ page
                  </Link>
                  .
                </>
              }
            />
            <FaqAccordion items={p.faqs} />
          </div>
        </div>
      </section>

      <section className={c.section} style={{ paddingTop: 0 }}>
        <div className={c.container}>
          <CtaBand
            title={`Order your ${price.name} number plates`}
            sub={`${single} per plate or ${pair} for a matching pair. Enter your registration to preview before you buy.`}
            style={p.id}
          />
        </div>
      </section>
    </div>
  );
}
