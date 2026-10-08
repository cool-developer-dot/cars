import Link from "next/link";
import { Building2, Globe, MapPin, ShieldCheck } from "lucide-react";
import HelpSection from "@/components/infoPage/HelpSection";
import InfoHero from "@/components/infoPage/InfoHero";
import LegalDoc, { type Clause } from "@/components/infoPage/LegalDoc";
import Section from "@/components/infoPage/Section";
import { Table } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT, DELIVERY, GOV_UK_DOCS_URL, WARRANTY_MONTHS, type StyleId } from "@/lib/site";

export const metadata = infoMetadata({
  title: "Terms and Conditions | ReplacementPlates",
  description:
    "Terms of sale for ReplacementPlates (Private Number Plate Maker Ltd): orders, document checks, delivery, cancellation, warranty and your legal rights.",
  path: "/terms",
  image: "/og/default.jpg",
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const Email = () => <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const CANCEL = (
  <>
    You can cancel for a full refund at any time before production starts. No cancellation or administration fee
    applies. Once production has started, personalised plates cannot normally be cancelled for a change of mind. Your
    statutory rights are unaffected. Contact <Email />, telephone {CONTACT.phone} or WhatsApp {CONTACT.whatsapp} as soon
    as possible.
  </>
);

const WARRANTY_ROWS: [string, StyleId][] = [
  ["Standard / printed", "standard"],
  ["3D Gel", "3d"],
  ["4D", "4d"],
  ["5D", "5d"],
  ["Ghost", "ghost"],
  ["Bevel", "bevel"],
];

const CLAUSES: Clause[] = [
  {
    id: "definitions",
    num: "1",
    title: "Definitions and Interpretation",
    body: (
      <>
        <h3>1.1 Definitions</h3>
        <ul>
          <li>
            <strong>Personalised Product:</strong> a number plate or other item made to your specification, including
            custom registrations and personalised designs.
          </li>
          <li>
            <strong>Road-use Plate:</strong> a number plate made to meet the current legal requirements for display on a
            road vehicle.
          </li>
          <li>
            <strong>Show Plate:</strong> a number plate made for off-road or display use only.
          </li>
          <li>
            <strong>DVLA:</strong> the Driver and Vehicle Licensing Agency.
          </li>
          <li>
            <strong>RNPS:</strong> the Register of Number Plate Suppliers maintained by the DVLA.
          </li>
          <li>
            <strong>V5C:</strong> the vehicle registration certificate (log book).
          </li>
        </ul>
        <h3>1.2 Who we are and how to contact us</h3>
        <p>
          ReplacementPlates is a trading name of {COMPANY.legalName}. You can contact us by email at <Email />, by
          WhatsApp on {CONTACT.whatsapp}, by telephone on {CONTACT.phone}, or by post to our registered office. Our
          collection location is {COMPANY.collection}; it is not our registered office.
        </p>
        <h3>1.3 Legal compliance</h3>
        <p>
          We are a DVLA registered number plate supplier and must comply with the laws on making and supplying number
          plates. Our RNPS number identifies us as a registered supplier; it does not mean the DVLA has approved any
          particular plate design.
        </p>
      </>
    ),
  },
  {
    id: "documents",
    num: "2",
    title: "Legal Obligations and Documentation Requirements",
    body: (
      <>
        <h3>2.1 Checks before we supply Road-use Plates</h3>
        <p>
          The law requires us to be satisfied about your identity and your entitlement to the registration before we
          supply Road-use Plates.
        </p>
        <h3>2.2 Documents</h3>
        <p>
          You need one document confirming your name and address (a driving licence; a utility, Council Tax or rates
          bill or a bank or building society statement from the last 6 months; or a national identity card) and one
          showing you can use the registration (for example a V5C, new keeper slip, V750, V778, V11, V379, a stamped
          V948 or an eV948, or a fleet operator&rsquo;s authorisation letter). A passport, a bank or building society
          card, a police warrant card and an armed forces identity card confirm your name only. The full list is on our{" "}
          <Link href="/documents-you-need">documents page</Link> and on{" "}
          <a href={GOV_UK_DOCS_URL} {...ext}>
            GOV.UK
          </a>
          .
        </p>
        <h3>2.3 Verification</h3>
        <ul>
          <li>We will tell you how to provide your documents when you order.</li>
          <li>We don&rsquo;t supply Road-use Plates until our checks are complete.</li>
          <li>We may ask for more information or documents.</li>
          <li>
            If we can&rsquo;t complete our checks, or the documents appear to be false, we may cancel your order and will
            refund what you&rsquo;ve paid. We may also cancel if the documents are not provided within a reasonable time
            after we ask for them; we will tell you before we do.
          </li>
          <li>
            We record and keep details of documents we check as the DVLA requires. See our{" "}
            <Link href="/privacy">privacy policy</Link>.
          </li>
        </ul>
        <h3>2.4 Your confirmation</h3>
        <p>
          By ordering Road-use Plates you confirm that you are entitled to the registration. Knowingly providing false
          documents may be a criminal offence.
        </p>
      </>
    ),
  },
  {
    id: "show-plates",
    num: "3",
    title: "Show Plates and Off-road Use",
    body: (
      <p>
        Show Plates are for <strong>off-road use only</strong>. Using one on a public road may lead to fines, MOT failure
        or other enforcement. Show Plates are labelled to say they are not for road use and may not follow the legal
        font, spacing or markings. You are responsible for using a Show Plate only off-road; we are not responsible for
        penalties that result from you using one on a public road.
      </p>
    ),
  },
  {
    id: "orders",
    num: "4",
    title: "Order Processing and Personalised Products",
    body: (
      <>
        <h3>4.1 Personalised nature and cancellation</h3>
        <p>
          Plates are made to the registration and options you enter and are Personalised Products. The usual 14-day
          right to cancel does not apply to goods made to your specification. That statutory exception applies from when
          your contract is made, not from when we begin production.
        </p>
        <p>{CANCEL}</p>
        <h3>4.2 Order accuracy</h3>
        <p>
          We make plates as you enter them. Please check the registration, sizes, styles and options before you pay. You
          are responsible for the details you enter. We are responsible for making the plate accurately from those
          details and for the legal configurations we offer.
        </p>
        <h3>4.3 Product representation</h3>
        <p>Images on our website are illustrations. Real plates may vary slightly because of screens and materials.</p>
        <h3>4.4 Amendments</h3>
        <p>
          Amendments must be requested within 2 hours of placing your order. Changes are not guaranteed, and we will tell
          you of any cost before making a change. This does not restrict your right to cancel before production starts,
          and it does not affect your legal rights.
        </p>
        <h3>4.5 Material substitutions</h3>
        <p>
          We may substitute materials of equal or better quality where the plate still matches its description and meets
          the legal requirements.
        </p>
        <h3>4.6 Order acceptance</h3>
        <p>
          Your order is an offer to buy. We accept it when we tell you that we have accepted it. If we can&rsquo;t accept
          it, we will tell you and refund anything you&rsquo;ve paid.
        </p>
        <h3>4.7 Prices, delivery charges and payment</h3>
        <p>
          Prices are in pounds sterling and are per plate unless a pair price is shown. {DELIVERY.firstClass}{" "}
          {DELIVERY.tracked} {DELIVERY.aims} The delivery charge that applies to your order is shown next to our prices
          and in your basket, with a running total that includes it. Royal Mail Tracked 24 is optional and shown
          separately. If you choose to collect your plates from Ilford, no delivery charge applies. The total you pay,
          including delivery and any VAT that applies, is shown before you confirm your order. Payment is taken by secure
          third-party payment providers, and we don&rsquo;t store your full card details.
        </p>
      </>
    ),
  },
  {
    id: "quality",
    num: "5",
    title: "Quality Control and Warranty",
    body: (
      <>
        <h3>5.1 Quality assurance</h3>
        <p>Plates are inspected before dispatch.</p>
        <h3>5.2 Your legal rights</h3>
        <p>
          Your plates must be of satisfactory quality, fit for purpose and as described. If they aren&rsquo;t, you have
          rights under the Consumer Rights Act 2015. In short:
        </p>
        <ul>
          <li>you can reject faulty goods within 30 days for a refund;</li>
          <li>
            otherwise you can ask for a repair or replacement, and you choose which unless one is impossible or
            disproportionate compared with the other;
          </li>
          <li>
            if a repair or replacement fails once, or isn&rsquo;t provided within a reasonable time without significant
            inconvenience, you can ask for a price reduction or reject the goods; and
          </li>
          <li>
            if a fault appears within six months of delivery, then for repair, replacement, price reduction and rejection
            after a failed repair, it is presumed to have been there at delivery unless we can show otherwise. That
            presumption doesn&rsquo;t apply to the 30-day short-term right to reject.
          </li>
        </ul>
        <p>
          See <Link href="/returns">returns and cancellations</Link> for the detail.
        </p>
        <h3>5.3 Reporting a fault</h3>
        <p>
          Please tell us as soon as you reasonably can. There is no 24-hour reporting deadline that removes your
          statutory rights. Photos and your order number help us assess the fault, but they are not a condition of a
          valid claim: if you can&rsquo;t reasonably provide photos, tell us and we will arrange another way to assess
          the plate. We assess the cause fairly. See <Link href="/warranty">warranty and faulty plates</Link>.
        </p>
        <h3>5.4 Manufacturing-defect warranty</h3>
        <p>
          New orders carry a manufacturing-defect warranty from {COMPANY.legalName} (the guarantor),{" "}
          {COMPANY.registeredOffice}. It starts on the delivery or collection date.
        </p>
        <Table
          tone="light"
          head={["Finish", "Warranty"]}
          align={["left", "right"]}
          rows={WARRANTY_ROWS.map(([name, id]) => [name, `${WARRANTY_MONTHS[id]} months`])}
        />
        <p>
          Specialty shapes follow the finish selected. The warranty covers manufacturing defects such as delamination or
          peeling, characters coming away, premature fading or discolouration and other defects in materials or
          workmanship. It doesn&rsquo;t cover damage from accidents or impact, incorrect fitting, misuse or modification,
          abnormal chemical exposure or fair wear over a long period. To make a claim, email <Email />, telephone{" "}
          {CONTACT.phone} or WhatsApp {CONTACT.whatsapp}. The warranty is in addition to your legal rights, which have
          their own time limits, and does not limit them. A warranty is not a statement that a product is approved for
          road use. If you bought earlier and were sold a longer guarantee, that guarantee continues to apply. See{" "}
          <Link href="/warranty">warranty and faulty plates</Link>.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    num: "6",
    title: "Delivery, Returns and Refunds",
    body: (
      <>
        <h3>6.1 Dispatch</h3>
        <p>
          If your order and document checks are complete before 2pm on a working weekday (Monday to Friday), we aim to
          dispatch it that day. That is when we hand it to Royal Mail, not when it arrives.
        </p>
        <h3>6.2 Delivery</h3>
        <p>
          {DELIVERY.firstClass} {DELIVERY.tracked} {DELIVERY.aims} An order of exactly £15 qualifies for free First Class
          delivery. Order value means the price of the goods before delivery. Tracked 24 costs £5 in total on orders
          under £15 and £2 in total on orders of £15 or more. {DELIVERY.areas} We will deliver without undue delay and
          within 30 days of accepting your order unless we agree otherwise with you; we aim to be much quicker. See{" "}
          <Link href="/delivery">delivery</Link>.
        </p>
        <h3>6.3 Risk and ownership</h3>
        <p>
          The goods are at our risk until they are delivered to you or collected. Ownership passes when they are
          delivered or collected and we have received payment.
        </p>
        <h3>6.4 Collection</h3>
        <p>
          You can collect from {COMPANY.collection}. {DELIVERY.collectionReady} Collection readiness is separate from
          dispatch timing. We will tell you what to bring when we confirm your collection.
        </p>
        <h3>6.5 Cancelling</h3>
        <ul>
          <li>
            <strong>Before production starts:</strong> {CANCEL}
          </li>
          <li>
            <strong>Personalised Products once production has started:</strong> see 4.1. Your statutory rights are
            unaffected.
          </li>
          <li>
            <strong>Items not made to your specification:</strong> you have 14 days from the day after you receive them to
            cancel without giving a reason. Tell us clearly, by email, WhatsApp, telephone or post to our registered
            office. Return the items within 14 days of telling us. We refund within 14 days of receiving the items or your
            proof of return, whichever is earlier. If you cancel a whole order, we refund all payments including delivery
            at the standard rate; if you return one item from a mixed order, we refund that item&rsquo;s price. You pay
            the cost of returning items; we tell you this before you order.
          </li>
        </ul>
        <h3>6.6 Faulty, damaged or wrongly made goods</h3>
        <p>
          See 5.2 and <Link href="/returns">returns and cancellations</Link>. Where you are entitled to a refund we will
          pay it without undue delay and within 14 days of agreeing you are entitled to it, to the payment method you
          used. We pay the reasonable cost of returning faulty goods.
        </p>
      </>
    ),
  },
  {
    id: "compliance",
    num: "7",
    title: "Legal Compliance and Customer Responsibilities",
    body: (
      <>
        <h3>7.1 Lawful use</h3>
        <p>
          Please display and fit your plates lawfully. Do not alter, rearrange or misrepresent the characters. You could
          be fined up to £1,000 and the vehicle could fail its MOT.
        </p>
        <h3>7.2 Official guidance</h3>
        <p>
          See the guidance at{" "}
          <a href="https://www.gov.uk/displaying-number-plates/rules-number-plates" {...ext}>
            gov.uk
          </a>
          .
        </p>
        <h3>7.3 Age</h3>
        <p>Our policy is to accept orders only from people aged 18 or over.</p>
      </>
    ),
  },
  {
    id: "liability",
    num: "8",
    title: "Liability",
    body: (
      <>
        <p>
          We are responsible to you for foreseeable loss or damage caused by our breach of these terms or our
          negligence. Loss is foreseeable if it was an obvious consequence of our breach or if you and we both knew it
          might happen when the contract was made. We are not responsible for loss that was not foreseeable or for any
          business loss.
        </p>
        <p>
          <strong>
            Nothing in these terms limits our liability for death or personal injury caused by our negligence, for fraud
            or fraudulent misrepresentation, or for anything else the law does not allow us to limit or exclude.
          </strong>{" "}
          Nothing in these terms limits your statutory rights.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    num: "9",
    title: "Intellectual Property",
    body: (
      <p>
        The content of this website belongs to us or our licensors and may not be copied without permission.
        Registration numbers are owned by the Secretary of State for Transport. Buying a plate does not give you any
        right to a registration number you are not entitled to.
      </p>
    ),
  },
  {
    id: "general",
    num: "10",
    title: "General Provisions",
    body: (
      <>
        <h3>10.1 Late delivery and events outside our control</h3>
        <p>If we don&rsquo;t deliver your goods, you may have the right to end the contract and receive a refund:</p>
        <ul>
          <li>
            <strong>immediately</strong>, if we refuse to deliver, or if we miss a delivery time that was agreed as
            essential (because you told us so, or because the circumstances make it clear); and
          </li>
          <li>
            <strong>in other cases</strong>, if we haven&rsquo;t delivered by the agreed time, or within 30 days where no
            time was agreed, you can give us a new deadline that is appropriate to the circumstances, and if we miss it
            you can end the contract and receive a refund.
          </li>
        </ul>
        <p>
          These rights apply even if your personalised plates have already been made. We aren&rsquo;t responsible for
          delay or failure caused by events outside our reasonable control, such as postal disruption, severe weather or
          supplier failures. We will tell you if it affects your order and take reasonable steps to limit the effect.
          Ending the contract for late delivery doesn&rsquo;t stop you claiming other remedies you may have.
        </p>
        <h3>10.2 Governing law and courts</h3>
        <p>
          These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you can
          also bring proceedings in the courts there. Nothing removes the mandatory consumer protections of the part of
          the UK where you live.
        </p>
        <h3 id="complaints">10.3 Complaints</h3>
        <p>
          If you are unhappy with anything, please tell us by email at <Email />, WhatsApp, telephone or post. We will
          acknowledge your complaint, look into it fairly and tell you what we can do. If we can&rsquo;t resolve it, you
          can get free, impartial advice from the Citizens Advice consumer service. Complaints about your personal data
          are handled under the Complaints section of our <Link href="/privacy#complaints">privacy policy</Link>.
        </p>
        <h3>10.4 Changes to these terms</h3>
        <p>We may update these terms. The terms in force when you placed your order apply to that order.</p>
        <h3>10.5 Severability</h3>
        <p>If any part of these terms is found to be unenforceable, the rest continues to apply.</p>
        <h3>10.6 Entire agreement</h3>
        <p>
          These terms and the documents they refer to are the agreement between you and {COMPANY.legalName} for your
          order. They do not affect your statutory rights.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <InfoJsonLd name="Terms and Conditions" path="/terms" />

      <InfoHero
        crumb="Terms and conditions"
        eyebrow="Terms of sale"
        title={["Terms and", "Conditions"]}
        lead={
          <p>
            The terms and conditions of {COMPANY.legalName} (ReplacementPlates). These terms apply when you buy from
            ReplacementPlates. They do not affect your legal rights as a consumer.
          </p>
        }
        updated="28 September 2026"
        facts={[
          { Icon: Building2, title: COMPANY.legalName, text: `Company number ${COMPANY.companyNumber}` },
          { Icon: MapPin, title: "Registered office", text: "New Spitalfields Market, London, E10 5SQ" },
          { Icon: ShieldCheck, title: "DVLA supplier (RNPS)", text: COMPANY.rnps },
          { Icon: Globe, title: "Website", text: "replacementplates.uk" },
        ]}
      />

      <Section id="terms" tone="light" next="dark">
        <LegalDoc clauses={CLAUSES} label="Terms and conditions" />
      </Section>

      <HelpSection
        related={[
          { label: "Returns and cancellations", href: "/returns" },
          { label: "Warranty", href: "/warranty" },
          { label: "Privacy policy", href: "/privacy" },
          { label: "Delivery", href: "/delivery" },
        ]}
      />
    </>
  );
}
