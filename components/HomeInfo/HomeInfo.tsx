import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/content/Reveal";
import {
  DeliveryBlock,
  DocumentsBlock,
  LegalBlock,
  SectionHead,
} from "@/components/content/blocks";
import { COMPANY } from "@/lib/site";
import c from "@/components/content/content.module.css";
import s from "./HomeInfo.module.css";

const STEPS = [
  {
    title: "Enter your registration",
    text: "See a preview of your plate as you build it.",
  },
  {
    title: "Choose your style and size",
    text: "Pick a finish and options — front, rear or both.",
  },
  {
    title: "Provide your documents",
    text: "Proof of who you are and proof you can use the registration.",
  },
  {
    title: "We make your plates",
    text: "Sent by Royal Mail, or ready for Ilford collection.",
  },
];

/** Homepage: how to order, documents, delivery and legal — between Common Reasons and FAQs */
export default function HomeInfo() {
  return (
    <div className={`${c.theme} ${s.wrap}`}>
      <div className={s.dusk} aria-hidden="true" />

      {/* Made to order + how to order */}
      <section className={c.section} aria-labelledby="order-title">
        <div className={c.container}>
          <SectionHead
            id="order-title"
            eyebrow="How to order online"
            title={
              <>
                Replacement number plates, <span className={c.accent}>made to order</span>
              </>
            }
            sub={`ReplacementPlates is a trading name of ${COMPANY.legalName}, a DVLA-registered number plate supplier. Every plate is produced to the legal requirements for registration plates and can be sent by Royal Mail or collected from our Ilford collection point.`}
          />
          <ol className={`${c.grid4} ${s.steps}`}>
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} index={i}>
                <div className={c.card}>
                  <span className={c.stepNum} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3 className={c.cardTitle}>{step.title}</h3>
                  <p className={c.cardText}>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className={s.stepsFoot}>
            <Link href="/build" className={c.btn}>
              Start building
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section
        id="documents"
        className={`${c.section} ${c.sectionAlt} ${c.anchor}`}
        aria-labelledby="docs-title"
      >
        <div className={c.container}>
          <SectionHead
            id="docs-title"
            eyebrow="Documents"
            title="Documents you'll need"
            sub="Every registered supplier must see two things before making a plate."
          />
          <DocumentsBlock />
        </div>
      </section>

      {/* Delivery */}
      <section className={c.section} aria-labelledby="delivery-title">
        <div className={c.container}>
          <SectionHead
            id="delivery-title"
            eyebrow="Delivery & collection"
            title="Royal Mail delivery or Ilford collection"
          />
          <DeliveryBlock />
        </div>
      </section>

      {/* Legal + supplier */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="legal-title">
        <div className={c.container}>
          <SectionHead
            id="legal-title"
            eyebrow="Made to the rules"
            title="Plates made to the legal requirements"
            sub="Our Standard, 3D, 4D, 5D and Bevel styles are made to these requirements."
          />
          <LegalBlock />
          <Reveal>
            <div className={s.trustBar}>
              <div className={s.trustItem}>
                <span className={c.stat}>{COMPANY.platesSold}</span>
                <span className={c.statLabel}>plates sold since {COMPANY.platesSoldSince}</span>
              </div>
              <div className={c.prose}>
                <p>
                  <strong>A DVLA-registered supplier.</strong> {COMPANY.legalName} is
                  registered with the DVLA as a number plate supplier (RNPS {COMPANY.rnps}).
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
