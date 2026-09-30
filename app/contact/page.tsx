import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "@/components/content/PageHero";
import Reveal from "@/components/content/Reveal";
import { MoreLink, SectionHead } from "@/components/content/blocks";
import { COMPANY, CONTACT } from "@/lib/site";
import c from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | ReplacementPlates" },
  description:
    "Contact ReplacementPlates by email, telephone or WhatsApp. Collection from Ilford, IG1 3QF — confirm by WhatsApp before travelling.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { Icon: Mail, title: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { Icon: Phone, title: "Telephone", value: CONTACT.phone, href: CONTACT.phoneHref },
  { Icon: MessageCircle, title: "WhatsApp", value: CONTACT.whatsapp, href: CONTACT.whatsappHref, external: true },
];

export default function ContactPage() {
  return (
    <div className={`${c.theme} ${c.page}`}>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title={
          <>
            Get in <span className={c.accent}>touch</span>
          </>
        }
        lead="Questions about an order, documents, a change or a faulty plate? Include your order number if you have one."
      />

      <section className={c.section} aria-labelledby="channels-title">
        <div className={c.container}>
          <SectionHead id="channels-title" eyebrow="Ways to reach us" title="Email, phone or WhatsApp" />
          <ul className={c.grid3}>
            {CHANNELS.map(({ Icon, title, value, href, external }, i) => (
              <Reveal as="li" key={title} index={i}>
                <a
                  href={href}
                  className={`${c.card} ${c.cardLink}`}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className={c.cardIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={c.cardTitle}>{title}</h3>
                  <p className={c.cardText}>{value}</p>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="where-title">
        <div className={c.container}>
          <div className={c.grid2}>
            <Reveal>
              <div className={`${c.card} ${c.cardGlow}`}>
                <span className={c.cardIcon} aria-hidden="true">
                  <MapPin />
                </span>
                <h2 id="where-title" className={c.cardTitle}>Collection point</h2>
                <p className={c.cardText}>
                  {COMPANY.collection}. Ready within 3 hours — exact
                  instructions are given by WhatsApp. Please confirm before
                  travelling.
                </p>
              </div>
            </Reveal>
            <Reveal index={1}>
              <div className={c.card}>
                <h2 className={c.cardTitle}>Registered office (post only)</h2>
                <p className={c.cardText}>{COMPANY.registeredOffice}</p>
                <p className={c.cardText}>
                  The registered office is our official address for post.
                  Collections are not made from it.
                </p>
                <p style={{ marginTop: 16 }}>
                  <MoreLink href="/faqs">Browse the FAQs</MoreLink>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
