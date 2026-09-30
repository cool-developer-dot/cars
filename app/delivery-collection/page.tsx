import type { Metadata } from "next";
import { Calculator, Clock, Globe } from "lucide-react";
import PageHero from "@/components/content/PageHero";
import Reveal from "@/components/content/Reveal";
import { CtaBand, DeliveryBlock, SectionHead, TrustChips } from "@/components/content/blocks";
import { DELIVERY, DELIVERY_EXAMPLE } from "@/lib/site";
import c from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: { absolute: "Delivery and Ilford Collection | ReplacementPlates" },
  description:
    "Royal Mail First Class delivery is £3 under £15 and free from £15, with a £2 Tracked 24 upgrade. Order before 2pm Mon–Fri for same-day dispatch, or collect from Ilford.",
  alternates: { canonical: "/delivery-collection" },
};

const DETAILS = [
  {
    Icon: Clock,
    title: "When we dispatch",
    text: "If your order and document checks are complete before 2pm on a working weekday, we aim to dispatch it that day. Delivery times are Royal Mail's aims, not guarantees.",
  },
  {
    Icon: Globe,
    title: "Where we deliver",
    text: DELIVERY.areas,
  },
  {
    Icon: Calculator,
    title: "Example totals",
    text: DELIVERY_EXAMPLE,
  },
];

export default function DeliveryPage() {
  return (
    <div className={`${c.theme} ${c.page}`}>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Delivery & collection" }]}
        eyebrow="Delivery & collection"
        title={
          <>
            Royal Mail delivery or <span className={c.accent}>Ilford collection</span>
          </>
        }
        lead="Free First Class delivery on orders of £15 or more, same-day dispatch aim for orders complete before 2pm Mon–Fri, or collect from our Ilford collection point."
        chips={<TrustChips />}
      />

      <section className={c.section} aria-labelledby="options-title">
        <div className={c.container}>
          <SectionHead id="options-title" eyebrow="Your options" title="Choose how you get your plates" />
          <DeliveryBlock />
        </div>
      </section>

      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="details-title">
        <div className={c.container}>
          <SectionHead id="details-title" eyebrow="The details" title="Dispatch, areas and costs" />
          <ul className={c.grid3}>
            {DETAILS.map(({ Icon, title, text }, i) => (
              <Reveal as="li" key={title} index={i}>
                <div className={c.card}>
                  <span className={c.cardIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={c.cardTitle}>{title}</h3>
                  <p className={c.cardText}>{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={c.section}>
        <div className={c.container}>
          <CtaBand />
        </div>
      </section>
    </div>
  );
}
