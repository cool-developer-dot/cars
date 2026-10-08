import Link from "next/link";
import { Clock3, Globe2, MapPin, Truck } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { WhatsAppIcon } from "@/components/productPage/deliveryIcons";
import { Button, Chips, Media, Note } from "@/components/infoPage/blocks";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT, DELIVERY } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Areas We Cover | ReplacementPlates",
  description:
    "Where ReplacementPlates delivers and where you can collect. One collection location in Ilford, East London; Royal Mail delivery.",
  path: "/areas-we-cover",
});

const NEARBY = ["Ilford", "London", "Barking", "Dagenham", "Romford", "Seven Kings", "Goodmayes", "Redbridge", "East Ham", "Stratford"];

const REGIONS: { name: string; towns: string[] }[] = [
  { name: "Midlands", towns: ["Birmingham", "Coventry", "Leicester", "Nottingham", "Derby", "Northampton", "Stoke-on-Trent"] },
  { name: "North of England", towns: ["Manchester", "Liverpool", "Leeds", "Sheffield", "Newcastle upon Tyne"] },
  { name: "South and South West", towns: ["Bristol", "Southampton", "Portsmouth", "Luton", "Milton Keynes"] },
  { name: "East of England", towns: ["Cambridge", "Peterborough", "Ipswich", "Norwich"] },
  { name: "Scotland", towns: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee"] },
  { name: "Wales", towns: ["Cardiff", "Swansea", "Newport"] },
];

export default function AreasPage() {
  return (
    <>
      <InfoJsonLd name="Areas We Cover" path="/areas-we-cover" />

      <InfoHero
        crumb="Areas we cover"
        eyebrow="Areas we cover"
        title={["Areas", "We Cover"]}
        lead={
          <p>
            One collection location, in Ilford, East London, and Royal Mail delivery to addresses across Great Britain.
            We don&rsquo;t have shops or branches elsewhere.
          </p>
        }
        art={{
          src: "/5d/hero.webp",
          srcMobile: "/5d/hero-mobile.webp",
          width: 2000,
          height: 1000,
          alt: "A white front and a yellow rear number plate on a dark surface",
        }}
        facts={[
          { Icon: MapPin, title: "One collection point", text: "Ilford, IG1 3QF" },
          { Icon: Clock3, title: "Ready within 3 hours", text: "Confirm by WhatsApp first" },
          { Icon: Truck, title: "Royal Mail delivery", text: "Anywhere in Great Britain" },
          { Icon: Globe2, title: "NI, Channel Islands, Isle of Man", text: "Contact us before ordering" },
        ]}
      />

      <Section id="east-london" tone="light" next="dark">
        <Media
          img={{
            src: "/delivery/ilford-collection.webp",
            width: 446,
            height: 660,
            alt: "The ReplacementPlates collection point in Ilford",
          }}
        >
          <p className={h.eyebrow}>Collect in East London</p>
          <h2 className={`${h.title} ${s.title} ${s.mediaHead}`}>
            Collect From <span className={h.accent}>Ilford</span>
          </h2>
          <p className={`${h.lead} ${s.mediaLead}`}>
            Our one collection location is <strong>{COMPANY.collection}</strong>. {DELIVERY.collectionReady}
          </p>
          <div className={s.mediaActions}>
            <p className={s.kicker}>Nearby areas</p>
            <Chips items={NEARBY.map((label) => ({ label }))} />
          </div>
          <div className={`${s.btnRow} ${s.mediaActions}`}>
            <Button href={CONTACT.whatsappHref} Icon={WhatsAppIcon}>
              Message Us on WhatsApp
            </Button>
          </div>
        </Media>
      </Section>

      <Section
        id="royal-mail"
        tone="dark"
        next="dark"
        eyebrow="Delivered by Royal Mail"
        title={["Everywhere Else in", "Great Britain"]}
        lead={
          <p>
            We deliver by Royal Mail to addresses in Great Britain. We have no collection location in these places, so if
            you&rsquo;re in Great Britain, order online and choose delivery. See <Link href="/delivery">delivery and dispatch</Link>{" "}
            for charges and timings.
          </p>
        }
      >
        <div className={s.flow}>
          <ul className={s.regions}>
            {REGIONS.map((r, i) => (
              <Rise as="li" key={r.name} index={i % 3} className={`${h.liquid} ${s.region}`}>
                <div className={s.regionHead}>
                  <h3 className={s.cardTitle}>{r.name}</h3>
                  <span className={s.badge}>{r.towns.length} cities</span>
                </div>
                <Chips items={r.towns.map((label) => ({ label }))} />
              </Rise>
            ))}
          </ul>
          <Note tone="dark" Icon={Globe2} title="Northern Ireland, the Channel Islands and the Isle of Man">
            <p>
              Please contact us <strong>before ordering</strong>. We will confirm whether we can deliver to your address,
              and you should not place an order until we have. <Link href="/contact">Contact us</Link>.
            </p>
          </Note>
        </div>
      </Section>

      <ClosingCta secondary={{ href: "/delivery", label: "Delivery Charges" }} />
    </>
  );
}
