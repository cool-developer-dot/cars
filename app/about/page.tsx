import { Ban, FileCheck2, MapPin, ShieldCheck, Stamp } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards, Chips, Details, Note, Panel, Rows, type CardItem } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT, PRICES, SPECIALITY, SPECIALITY_ORDER, gbp, type StyleId } from "@/lib/site";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "About ReplacementPlates | ReplacementPlates",
  description:
    "ReplacementPlates is a trading name of Private Number Plate Maker Ltd, a DVLA-registered number plate supplier. Company details and how to contact us.",
  path: "/about",
  image: "/og/gel-plates.jpg",
});

/** Each finish, shown with its own render */
const FINISH_ART: Record<StyleId, string> = {
  standard: "/standard/intro.webp",
  "3d": "/3d/gel-plates.webp",
  "4d": "/4d/intro.webp",
  "5d": "/5d/intro.webp",
  ghost: "/ghost/intro.webp",
  bevel: "/bevel/intro.webp",
};

const STYLES: StyleId[] = ["standard", "3d", "4d", "5d", "ghost", "bevel"];

const FINISHES: CardItem[] = STYLES.map((id) => {
  const p = PRICES[id];
  return {
    title: id === "5d" ? "5D (4D Gel)" : p.name.replace("gel", "Gel"),
    text: p.what,
    img: { src: FINISH_ART[id], position: "50% 55%" },
    badge: `From ${gbp(p.single)}`,
    href: p.href,
    link: `${id === "standard" ? "Standard" : p.name.replace("gel", "Gel")} plates`,
  };
});

const PRINCIPLES: CardItem[] = [
  {
    Icon: FileCheck2,
    title: "Documents First",
    text: "The law requires a registered supplier to check your identity and your right to use the registration before supplying road-use plates.",
    href: "/documents-you-need",
    link: "Documents you need",
  },
  {
    Icon: Stamp,
    title: "Marked Plates",
    text: "Road-use plates carry the supplier's name and postcode and the British Standard number.",
    href: "/legal-number-plates",
    link: "Legal number plates",
  },
  {
    Icon: Ban,
    title: "Cancel Before Production",
    text: "You can cancel for a full refund at any time before production starts, with no fee.",
    href: "/returns",
    link: "Returns and cancellations",
  },
  {
    Icon: ShieldCheck,
    title: "Warranty",
    text: "New orders carry a manufacturing-defect warranty of 6 months for Standard, 3D Gel and 4D, and 12 months for 5D, Ghost and Bevel, from the delivery or collection date, in addition to your statutory rights.",
    href: "/warranty",
    link: "Warranty",
  },
  {
    Icon: MapPin,
    title: "Clear About Locations",
    text: "We have one collection location, in Ilford, and deliver by Royal Mail. We don't have shops or branches elsewhere.",
    href: "/delivery",
    link: "Delivery and collection",
  },
];

export default function AboutPage() {
  return (
    <>
      <InfoJsonLd
        name="About ReplacementPlates"
        path="/about"
        extra={[
          {
            "@type": "Organization",
            name: COMPANY.legalName,
            alternateName: COMPANY.brand,
            url: "https://replacementplates.uk",
            email: CONTACT.email,
            telephone: "+44 20 3576 6603",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Stand 53, New Spitalfields Market, 1 Sherrin Road",
              addressLocality: "London",
              postalCode: "E10 5SQ",
              addressCountry: "GB",
            },
          },
        ]}
      />

      <InfoHero
        crumb="About"
        eyebrow="About us"
        title={["About", "ReplacementPlates"]}
        lead="ReplacementPlates makes number plates to order for drivers who need a replacement: a cracked, faded, lost or stolen plate, a single plate to go with one you're keeping, or a change of finish."
        art={{
          src: "/3d/gel-plates.webp",
          width: 1522,
          height: 1010,
          alt: "A white front and a yellow rear number plate with raised black characters",
          position: "50% 50%",
        }}
      />

      <Section
        id="who-we-are"
        tone="light"
        next="dark"
        side
        eyebrow="Who we are"
        title={["A DVLA-Registered", "Number Plate Supplier"]}
        lead={
          <p>
            ReplacementPlates is a trading name of <strong>{COMPANY.legalName}</strong>, a company
            registered in {COMPANY.jurisdiction} (company number {COMPANY.companyNumber}). We are a
            DVLA-registered number plate supplier, supplier ID (RNPS) {COMPANY.rnps}.
          </p>
        }
      >
        <Panel tone="light" className={s.flow}>
          <div className={s.statBlock}>
            <span className={s.stat}>{COMPANY.platesSold}</span>
            <span className={s.statLabel}>plates sold by the company since {COMPANY.platesSoldSince}</span>
          </div>
          <Details
            items={[
              ["Supplier ID (RNPS)", COMPANY.rnps],
              ["Legal entity", COMPANY.legalName],
              ["Company number", `${COMPANY.companyNumber} (${COMPANY.jurisdiction})`],
            ]}
          />
          <Note tone="light" title="What the RNPS number means">
            <p>
              It identifies us as a registered supplier. It does not mean the DVLA has approved any
              particular plate design; each plate still has to meet the legal requirements.
            </p>
          </Note>
        </Panel>
      </Section>

      <Section
        id="what-we-make"
        tone="dark"
        next="light"
        eyebrow="What we make"
        title={["Six Finishes,", "Priced Per Plate"]}
        lead="Prices are per plate, and you can order a single front or rear plate or a pair."
      >
        <div className={s.flow}>
          <Cards tone="dark" items={FINISHES} cols={3} compact />
          <div className={s.chipRow}>
            <p className={s.kicker}>Speciality formats</p>
            <Chips
              items={[
                ...SPECIALITY_ORDER.map((id) => ({ label: `${SPECIALITY[id].name} plates`, href: SPECIALITY[id].path })),
                { label: "All prices", href: "/prices" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        id="how-we-work"
        tone="light"
        next="dark"
        side
        eyebrow="How we work"
        title={["Straightforward", "by Design"]}
        lead="Five things we hold to on every order, from the documents we check to where you can collect."
      >
        <Rows tone="light" items={PRINCIPLES} />
      </Section>

      <Section
        id="company-details"
        tone="dark"
        next="dark"
        side
        eyebrow="Company details"
        title={["Who You're", "Buying From"]}
        lead="The registered office is our official address for post. Collections are not made from it."
      >
        <Panel tone="dark">
          <Details
            items={[
              ["Trading name", COMPANY.brand],
              ["Legal entity", COMPANY.legalName],
              ["Company number", `${COMPANY.companyNumber} (${COMPANY.jurisdiction})`],
              ["Registered office", COMPANY.registeredOffice],
              ["Supplier ID (RNPS)", COMPANY.rnps],
              ["Collection location", `${COMPANY.collection} (exact instructions given by WhatsApp)`],
              ["Email", <a key="e" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>],
              ["Telephone", <a key="t" href={CONTACT.phoneHref}>{CONTACT.phone}</a>],
              [
                "WhatsApp",
                <a key="w" href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
                  {CONTACT.whatsapp}
                </a>,
              ],
            ]}
          />
        </Panel>
      </Section>

      <ClosingCta secondary={{ href: "/contact", label: "Contact Us" }} />
    </>
  );
}
