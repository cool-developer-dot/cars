import HelpSection from "@/components/infoPage/HelpSection";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Chips } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import FaqList from "@/components/productPage/FaqCta/FaqList";
import { FAQ_GROUPS } from "@/lib/faqs";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Number Plate FAQs | ReplacementPlates",
  description:
    "Answers on ordering, documents, delivery charges, collection, the legal rules, cancellation, warranty and faulty plates at ReplacementPlates.",
  path: "/faqs",
  image: "/og/front-car.jpg",
});

/** Group headings in Title Case */
const HEADINGS: Record<string, string> = {
  ordering: "Ordering",
  documents: "Documents",
  delivery: "Delivery and Collection",
  legal: "Legal",
  warranty: "Cancellation, Warranty and Problems",
};

const COUNT = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function FaqsPage() {
  return (
    <>
      <InfoJsonLd
        name="Number Plate FAQs"
        path="/faqs"
        extra={[
          {
            "@type": "FAQPage",
            mainEntity: FAQ_GROUPS.flatMap((g) =>
              g.items.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            ),
          },
        ]}
      />

      <InfoHero
        crumb="FAQs"
        eyebrow="Help centre"
        title={["Number Plate", "FAQs"]}
        lead={
          <p>
            {COUNT} answers on ordering, documents, delivery, the legal rules, cancellation and warranty. Pick a topic to
            jump straight to it.
          </p>
        }
        art={{
          src: "/standard/legal-car.webp",
          width: 1492,
          height: 868,
          alt: "The front of a car with a white number plate",
        }}
        actions={
          <nav aria-label="FAQ topics" className={s.dark}>
            <Chips items={FAQ_GROUPS.map((g) => ({ label: HEADINGS[g.id] ?? g.title, href: `#${g.id}` }))} />
          </nav>
        }
      />

      <Section id="questions" tone="light" next="dark">
        <div className={s.faqGroups}>
          {FAQ_GROUPS.map((g, i) => (
            <div key={g.id} id={g.id} className={s.faqGroup}>
              <Rise className={s.faqHead}>
                <p className={s.kicker}>
                  {String(i + 1).padStart(2, "0")} / {String(FAQ_GROUPS.length).padStart(2, "0")}
                </p>
                <h2 className={s.subhead}>{HEADINGS[g.id] ?? g.title}</h2>
                <p className={s.faqCount}>
                  {g.items.length} {g.items.length === 1 ? "question" : "questions"}
                </p>
              </Rise>
              <FaqList items={g.items} label={`${g.title} questions`} />
            </div>
          ))}
        </div>
      </Section>

      <HelpSection
        title={["Still Have", "a Question?"]}
        lead="Message us on WhatsApp, call or email, and we'll help."
        related={[
          { label: "Documents you need", href: "/documents-you-need" },
          { label: "Delivery", href: "/delivery" },
          { label: "Prices", href: "/prices" },
        ]}
      />
    </>
  );
}
