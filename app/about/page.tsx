import type { Metadata } from "next";
import Link from "next/link";
import {
  Ban,
  BadgeCheck,
  FileCheck2,
  MapPin,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import PageHero from "@/components/content/PageHero";
import Reveal from "@/components/content/Reveal";
import { CtaBand, MoreLink, SectionHead, TrustChips } from "@/components/content/blocks";
import { COMPANY, CONTACT, PRICES, gbp } from "@/lib/site";
import c from "@/components/content/content.module.css";

export const metadata: Metadata = {
  title: { absolute: "About ReplacementPlates | ReplacementPlates" },
  description:
    "ReplacementPlates is a trading name of Private Number Plate Maker Ltd, a DVLA-registered number plate supplier. Company details and how to contact us.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    Icon: FileCheck2,
    title: "Documents first",
    text: "The law requires a registered supplier to check your identity and your right to use the registration before supplying road-use plates.",
    link: { href: "/#documents", label: "Documents you need" },
  },
  {
    Icon: Stamp,
    title: "Marked plates",
    text: "Road-use plates carry the supplier's name and postcode and the British Standard number.",
  },
  {
    Icon: Ban,
    title: "Cancel before production",
    text: "You can cancel for a full refund at any time before production starts, with no fee.",
    link: { href: "/returns", label: "Returns and cancellations" },
  },
  {
    Icon: ShieldCheck,
    title: "Warranty",
    text: "New orders carry a manufacturing-defect warranty of 6 months for Standard, 3D Gel and 4D, and 12 months for 5D, Ghost and Bevel, from the delivery or collection date, in addition to your statutory rights.",
    link: { href: "/faqs#warranty", label: "Warranty details" },
  },
  {
    Icon: MapPin,
    title: "Clear about locations",
    text: "We have one collection location, in Ilford, and deliver by Royal Mail. We don't have shops or branches elsewhere.",
    link: { href: "/delivery-collection", label: "Delivery and collection" },
  },
];

const PRODUCT_LINKS = (["standard", "3d", "4d", "5d", "ghost", "bevel"] as const).map(
  (id) => PRICES[id],
);

export default function AboutPage() {
  return (
    <div className={`${c.theme} ${c.page}`}>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About us"
        title={
          <>
            About <span className={c.accent}>ReplacementPlates</span>
          </>
        }
        lead="We make number plates to order for drivers who need a replacement: a cracked, faded, lost or stolen plate, a single plate to go with one you're keeping, or a change of finish."
        chips={<TrustChips />}
      />

      {/* Who we are */}
      <section className={c.section} aria-labelledby="who-title">
        <div className={c.container}>
          <div className={c.grid2}>
            <div>
              <SectionHead id="who-title" eyebrow="Who we are" title="A DVLA-registered number plate supplier" />
              <Reveal className={c.prose}>
                <p>
                  ReplacementPlates is a trading name of{" "}
                  <strong>{COMPANY.legalName}</strong>, a company registered in{" "}
                  {COMPANY.jurisdiction} (company number {COMPANY.companyNumber}).
                  We are a DVLA-registered number plate supplier, supplier ID
                  (RNPS) {COMPANY.rnps}.
                </p>
                <p>
                  The RNPS number identifies us as a registered supplier. It does
                  not mean the DVLA has approved any particular plate design; each
                  plate still has to meet the legal requirements.
                </p>
              </Reveal>
            </div>
            <Reveal index={1}>
              <div className={`${c.card} ${c.cardGlow}`}>
                <span className={c.cardIcon} aria-hidden="true">
                  <BadgeCheck />
                </span>
                <span className={c.stat}>{COMPANY.platesSold}</span>
                <span className={c.statLabel}>
                  plates sold by the company since {COMPANY.platesSoldSince}
                </span>
                <dl className={c.details} style={{ marginTop: 20 }}>
                  <div>
                    <dt>Supplier ID (RNPS)</dt>
                    <dd>{COMPANY.rnps}</dd>
                  </div>
                  <div>
                    <dt>Company number</dt>
                    <dd>{COMPANY.companyNumber}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What we make */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="make-title">
        <div className={c.container}>
          <SectionHead
            id="make-title"
            eyebrow="What we make"
            title="Six finishes, priced per plate"
            sub="Plus motorcycle and oversized formats. Order a single front or rear plate, or a pair."
          />
          <ul className={c.grid3}>
            {PRODUCT_LINKS.map((p, i) => (
              <Reveal as="li" key={p.name} index={i % 3}>
                <Link href={p.href} className={`${c.card} ${c.cardLink}`}>
                  <h3 className={c.cardTitle}>{p.name}</h3>
                  <p className={c.cardText}>{p.what}</p>
                  <span className={c.cardPrice}>
                    From <strong>{gbp(p.single)}</strong> per plate
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <p style={{ marginTop: 24 }}>
            <MoreLink href="/plate-styles">See all prices</MoreLink>
          </p>
        </div>
      </section>

      {/* How we work */}
      <section className={c.section} aria-labelledby="how-title">
        <div className={c.container}>
          <SectionHead id="how-title" eyebrow="How we work" title="Straightforward, by design" />
          <ul className={c.grid3}>
            {PRINCIPLES.map(({ Icon, title, text, link }, i) => (
              <Reveal as="li" key={title} index={i % 3}>
                <div className={c.card}>
                  <span className={c.cardIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={c.cardTitle}>{title}</h3>
                  <p className={c.cardText}>{text}</p>
                  {link && (
                    <p style={{ marginTop: 14 }}>
                      <MoreLink href={link.href}>{link.label}</MoreLink>
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Company details */}
      <section className={`${c.section} ${c.sectionAlt}`} aria-labelledby="details-title">
        <div className={c.container}>
          <div className={c.grid2}>
            <SectionHead
              id="details-title"
              eyebrow="Company details"
              title="Who you're buying from"
              sub="The registered office is our official address for post. Collections are not made from it."
            />
            <Reveal index={1}>
              <div className={c.card}>
                <dl className={c.details}>
                  <div><dt>Trading name</dt><dd>{COMPANY.brand}</dd></div>
                  <div><dt>Legal entity</dt><dd>{COMPANY.legalName}</dd></div>
                  <div><dt>Company number</dt><dd>{COMPANY.companyNumber} ({COMPANY.jurisdiction})</dd></div>
                  <div><dt>Registered office</dt><dd>{COMPANY.registeredOffice}</dd></div>
                  <div><dt>Supplier ID (RNPS)</dt><dd>{COMPANY.rnps}</dd></div>
                  <div><dt>Collection location</dt><dd>{COMPANY.collection} (exact instructions given by WhatsApp)</dd></div>
                  <div><dt>Email</dt><dd><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
                  <div><dt>Telephone</dt><dd><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></dd></div>
                  <div><dt>WhatsApp</dt><dd><a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">{CONTACT.whatsapp}</a></dd></div>
                </dl>
              </div>
            </Reveal>
          </div>
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
