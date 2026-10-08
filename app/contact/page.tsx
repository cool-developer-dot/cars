import { Accessibility, Ban, LockKeyhole, MessageSquareWarning } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { WhatsAppIcon } from "@/components/productPage/deliveryIcons";
import { Button, Cards, Channels, Details, Media, MoreLink, Note, Panel, type CardItem } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT, DELIVERY } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Contact ReplacementPlates | ReplacementPlates",
  description:
    "Email, call or WhatsApp ReplacementPlates about your order, documents or collection, or write to us. Complaints and data protection requests too.",
  path: "/contact",
  image: "/og/default.jpg",
});

const HELP: CardItem[] = [
  {
    Icon: Ban,
    title: "Cancelling an Order",
    text: (
      <>
        <p>
          You can cancel for a full refund at any time before production starts. No cancellation or
          administration fee applies.
        </p>
        <p>
          Once production has started, personalised plates cannot normally be cancelled for a
          change of mind. Your statutory rights are unaffected. Contact us as soon as possible.
        </p>
      </>
    ),
    href: "/returns",
    link: "Returns and cancellations",
  },
  {
    Icon: MessageSquareWarning,
    title: "Making a Complaint",
    text: (
      <p>
        If something has gone wrong, tell us by email, WhatsApp, telephone or post. We&rsquo;ll
        acknowledge your complaint, look into it and tell you what we can do. See the Complaints
        section of our terms.
      </p>
    ),
    href: "/terms#complaints",
    link: "Complaints in our terms",
  },
  {
    Icon: LockKeyhole,
    title: "Data Protection Requests",
    text: (
      <p>
        To ask about or exercise your rights over your personal data, contact us as above.
        Complaints about how we handle your personal data are covered in the Complaints section of
        our privacy policy.
      </p>
    ),
    href: "/privacy",
    link: "Privacy policy",
  },
  {
    Icon: Accessibility,
    title: "Help Ordering",
    text: (
      <p>
        If you need help placing an order, contact us and we&rsquo;ll talk you through it, or read
        how we can help you order another way.
      </p>
    ),
    href: "/accessibility",
    link: "Accessibility",
  },
];

export default function ContactPage() {
  return (
    <>
      <InfoJsonLd name="Contact ReplacementPlates" path="/contact" />

      <InfoHero
        crumb="Contact"
        eyebrow="Contact"
        title={["Contact", "ReplacementPlates"]}
        lead={
          <>
            <p>The quickest way to reach us is by WhatsApp or telephone. You can also email us.</p>
            <p>
              When you contact us, please give your <strong>order number</strong> if you have one
              and, for a question about a plate, your registration and what the problem is. A photo
              helps if a plate is damaged or wrong, but isn&rsquo;t required.
            </p>
          </>
        }
        aside={<Channels tone="dark" stack />}
      />

      <Section id="collection" tone="light" next="dark">
        <Media
          img={{
            src: "/delivery/ilford-collection.webp",
            width: 446,
            height: 660,
            alt: "The ReplacementPlates collection point in Ilford",
          }}
        >
          <p className={h.eyebrow}>Collection</p>
          <h2 className={`${h.title} ${s.title} ${s.mediaHead}`}>
            Collecting <span className={h.accent}>Your Plates</span>
          </h2>
          <p className={`${h.lead} ${s.mediaLead}`}>
            Our collection location is <strong>{COMPANY.collection}</strong>. {DELIVERY.collectionReady}{" "}
            We give exact arrival instructions by WhatsApp when we confirm your collection.
          </p>
          <p className={`${h.lead} ${s.mediaLead}`}>We don&rsquo;t have shops or branches elsewhere.</p>
          <div className={`${s.btnRow} ${s.mediaActions}`}>
            <Button href={CONTACT.whatsappHref} Icon={WhatsAppIcon}>
              Message Us on WhatsApp
            </Button>
            <Button href="/delivery#collection" ghost>
              Collection Details
            </Button>
          </div>
        </Media>
      </Section>

      <Section
        id="help"
        tone="dark"
        next="light"
        eyebrow="How we can help"
        title={["Orders, Complaints", "and Your Data"]}
        lead="Whatever you need, the same three ways to reach us apply: WhatsApp, telephone or email."
      >
        <Cards tone="dark" items={HELP} cols={4} />
      </Section>

      <Section
        id="post"
        tone="light"
        next="dark"
        side
        eyebrow="Post and company details"
        title={["Writing", "to Us"]}
        lead={
          <p>
            ReplacementPlates is a trading name of {COMPANY.legalName} (company number{" "}
            {COMPANY.companyNumber}). Our registered office is our address for post.
          </p>
        }
      >
        <Panel tone="light" className={s.flow}>
          <Details
            items={[
              ["Post", `${COMPANY.legalName}, ${COMPANY.registeredOffice}`],
              ["Company number", `${COMPANY.companyNumber} (${COMPANY.jurisdiction})`],
              ["Supplier ID (RNPS)", COMPANY.rnps],
            ]}
          />
          <Note tone="light" title="Please note">
            <p>
              Collections are not made from the registered office, and please don&rsquo;t send
              plates back unless we ask you to.
            </p>
          </Note>
          <p>
            <MoreLink href="/about">About us</MoreLink>
          </p>
        </Panel>
      </Section>

      <ClosingCta secondary={{ href: "/faqs", label: "Read the FAQs" }} />
    </>
  );
}
