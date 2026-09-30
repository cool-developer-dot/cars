import type { Metadata } from "next";
import PageHero from "@/components/content/PageHero";
import FaqAccordion from "@/components/Faqs/FaqAccordion";
import JsonLd from "@/components/content/JsonLd";
import { CtaBand, SectionHead } from "@/components/content/blocks";
import { FAQ_GROUPS } from "@/lib/faqs";
import { CONTACT } from "@/lib/site";
import c from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: { absolute: "Number Plate FAQs | ReplacementPlates" },
  description:
    "Answers to common questions about ordering, documents, delivery charges, collection, legal requirements, cancellation, warranty and faulty plates at ReplacementPlates.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return (
    <div className={`${c.theme} ${c.page}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_GROUPS.flatMap((g) =>
            g.items.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          ),
        }}
      />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQs" }]}
        eyebrow="Help centre"
        title={
          <>
            Number plate <span className={c.accent}>FAQs</span>
          </>
        }
        lead={
          <>
            Ordering, documents, delivery, the legal rules, cancellations and
            warranty. Can&rsquo;t find it? Email{" "}
            <a href={`mailto:${CONTACT.email}`} className={c.textLink}>
              {CONTACT.email}
            </a>{" "}
            or call {CONTACT.phone}.
          </>
        }
      >
        <nav aria-label="FAQ topics">
          <ul className={c.chips}>
            {FAQ_GROUPS.map((g) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className={`${c.chip} ${c.chipLink}`}>
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      {FAQ_GROUPS.map((g, i) => (
        <section
          key={g.id}
          id={g.id}
          className={`${c.section} ${c.anchor} ${i % 2 ? c.sectionAlt : ""}`}
          aria-labelledby={`${g.id}-title`}
        >
          <div className={c.container}>
            <div className={c.grid2}>
              <SectionHead
                id={`${g.id}-title`}
                sticky
                eyebrow={`${String(i + 1).padStart(2, "0")} / ${String(FAQ_GROUPS.length).padStart(2, "0")}`}
                title={g.title}
              />
              <FaqAccordion items={g.items} />
            </div>
          </div>
        </section>
      ))}

      <section className={c.section}>
        <div className={c.container}>
          <CtaBand />
        </div>
      </section>
    </div>
  );
}
