import Link from "next/link";
import { Building2, MessageSquareWarning, Scale, ShieldOff } from "lucide-react";
import HelpSection from "@/components/infoPage/HelpSection";
import InfoHero from "@/components/infoPage/InfoHero";
import LegalDoc, { type Clause } from "@/components/infoPage/LegalDoc";
import Section from "@/components/infoPage/Section";
import { Table } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT } from "@/lib/site";

export const metadata = infoMetadata({
  title: "Privacy Policy | ReplacementPlates",
  description:
    "How ReplacementPlates (Private Number Plate Maker Ltd) uses your personal information, including the documents we check, and how to use your rights or complain.",
  path: "/privacy",
  image: "/og/default.jpg",
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const Email = () => <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const CLAUSES: Clause[] = [
  {
    id: "controller",
    num: "1",
    title: "Who Is Responsible for Your Data",
    body: (
      <p>
        The data controller is <strong>{COMPANY.legalName}</strong>, company number {COMPANY.companyNumber}, registered
        office {COMPANY.registeredOffice}. To contact us about your data, email <Email />, use WhatsApp on{" "}
        {CONTACT.whatsapp}, telephone {CONTACT.phone}, or write to our registered office. We use the title &ldquo;data
        protection contact&rdquo; for the person who deals with these requests.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    num: "2",
    title: "What We Collect",
    body: (
      <ul>
        <li>
          <strong>Document and entitlement information (required by law):</strong> details of the documents you use to
          show your name, address and entitlement to a registration, such as the document type and reference number,
          your name and address, and your vehicle and registration details.
        </li>
        <li>
          <strong>Order information:</strong> name, address, telephone number, delivery or collection choice, and the
          details of the plates you order.
        </li>
        <li>
          <strong>Payment information:</strong> handled by our payment service provider. We don&rsquo;t store full card
          details.
        </li>
        <li>
          <strong>Messages:</strong> what you tell us by WhatsApp, telephone or the website.
        </li>
        <li>
          <strong>Website information:</strong> device, browser and usage information collected through cookies and
          similar technologies, only as set out in our <Link href="/cookies">cookie policy</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "where-it-comes-from",
    num: "3",
    title: "Where It Comes From",
    body: (
      <p>
        From you; automatically from your device through cookies where you allow them; and from payment providers and
        couriers about your payment and delivery.
      </p>
    ),
  },
  {
    id: "lawful-basis",
    num: "4",
    title: "Why We Use It and Our Lawful Basis",
    body: (
      <Table
        tone="light"
        head={["Purpose", "Lawful basis"]}
        rows={[
          ["Checking identity and entitlement and keeping the records the DVLA requires", "Legal obligation"],
          ["Taking, making and delivering your order, and dealing with faults and refunds", "Contract"],
          ["Preventing fraud and misuse of number plates", "Legitimate interests"],
          ["Keeping accounts and tax records", "Legal obligation"],
          ["Improving our service", "Legitimate interests, or consent where cookies are involved"],
          ["Marketing messages, if you agree to receive them", "Consent"],
        ]}
      />
    ),
  },
  {
    id: "sharing",
    num: "5",
    title: "Who We Share It With",
    body: (
      <>
        <ul>
          <li>The DVLA, police, DVSA and Trading Standards where the law requires it or they ask to see our records</li>
          <li>Our payment service provider and couriers (Royal Mail), so we can take payment and deliver</li>
          <li>Technology providers that host our website and support messaging, including WhatsApp</li>
          <li>Fraud-prevention organisations where needed</li>
        </ul>
        <p>
          <strong>We don&rsquo;t sell your personal information.</strong>
        </p>
      </>
    ),
  },
  {
    id: "retention",
    num: "6",
    title: "How Long We Keep It",
    body: (
      <Table
        tone="light"
        head={["Category", "Purpose", "Lawful basis", "Trigger", "Period"]}
        rows={[
          [
            "Record of plate sales and documents checked (type, reference number, name, address, registration)",
            "DVLA record-keeping duty",
            "Legal obligation",
            "Date of sale",
            "3 years",
          ],
          [
            "Images or copies of documents you provide",
            "Completing our identity and entitlement checks",
            "Legal obligation",
            "Receipt of the document",
            "Only as long as needed to complete and record the checks, then securely deleted. We don't keep images just because the sales record is kept for three years",
          ],
          [
            "Order, payment and accounting records",
            "Tax and accounting duties",
            "Legal obligation",
            "End of the financial year of the sale",
            "6 years",
          ],
          [
            "Messages about your order",
            "Customer service, disputes",
            "Contract, legitimate interests",
            "End of the order",
            "While needed to deal with your order and any claim",
          ],
          [
            "Marketing preferences",
            "Sending marketing you agreed to",
            "Consent",
            "Date consent given",
            "Until you withdraw it; we then keep only your contact detail on a suppression list so we honour your objection",
          ],
          [
            "Cookie and analytics data",
            "As set out in the cookie policy",
            "Consent",
            "Cookie set",
            "As set out in the cookie policy",
          ],
        ]}
      />
    ),
  },
  {
    id: "transfers",
    num: "7",
    title: "Transfers Outside the UK",
    body: (
      <p>
        Some providers may process data outside the UK. When they do, the transfer must be protected by a mechanism UK
        GDPR allows, such as UK adequacy regulations or the ICO&rsquo;s international data transfer agreement or
        addendum. Contact us if you&rsquo;d like to know which applies to a particular provider.
      </p>
    ),
  },
  {
    id: "your-rights",
    num: "8",
    title: "Your Rights",
    body: (
      <p>
        You can ask for a copy of your data, to have it corrected or in some cases deleted, to restrict or object to our
        use of it, to receive it in a portable form, and to withdraw consent. Some rights are limited where we must keep
        records by law. Contact us as in section 1, including at <Email />. We reply to a request for a copy of your data
        within one month, which can be extended in the cases the law allows. We&rsquo;ll tell you if we need more time
        or need to check who you are.
      </p>
    ),
  },
  {
    id: "complaints",
    num: "9",
    title: "Complaints",
    body: (
      <>
        <p>
          If you&rsquo;re unhappy about how we&rsquo;ve handled your personal data, tell us. You can complain by email at{" "}
          <Email />, WhatsApp, telephone or post, and we&rsquo;ll accept a complaint however you send it, including
          through social media. We will acknowledge your complaint within 30 days of receiving it, look into it without
          undue delay, keep you informed, and tell you the outcome and that you can take it to the Information
          Commissioner&rsquo;s Office. The 30-day acknowledgement for complaints is separate from the one-month response
          time for a request for a copy of your data. See the{" "}
          <a href="https://ico.org.uk/for-organisations/how-to-deal-with-data-protection-complaints/" {...ext}>
            ICO&rsquo;s guidance on data protection complaints
          </a>
          .
        </p>
        <p>
          You can also complain directly to the ICO at any time:{" "}
          <a href="https://ico.org.uk" {...ext}>
            ico.org.uk
          </a>
          , 0303 123 1113.
        </p>
      </>
    ),
  },
  {
    id: "security",
    num: "10",
    title: "Security",
    body: (
      <p>
        We limit who can see your records and take steps to protect them, including keeping our website connection
        encrypted and having a procedure for dealing with personal data breaches.
      </p>
    ),
  },
  {
    id: "who-its-for",
    num: "11",
    title: "Who Our Service Is For",
    body: (
      <p>
        Our policy is to accept orders only from people aged 18 or over. Anyone can visit the website or send us a
        message, so we may occasionally receive information from someone under 18. If you think we have information
        about a child, contact us and we will deal with it.
      </p>
    ),
  },
  {
    id: "changes",
    num: "12",
    title: "Changes",
    body: <p>We may update this policy and will post the current version on this page.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <InfoJsonLd name="Privacy Policy" path="/privacy" />

      <InfoHero
        crumb="Privacy policy"
        eyebrow="Your data"
        title={["Privacy", "Policy"]}
        lead={
          <p>
            This policy explains how <strong>{COMPANY.legalName}</strong> uses your personal information when you visit
            ReplacementPlates, place an order or contact us. ReplacementPlates is a trading brand of {COMPANY.legalName}.
            We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
        }
        updated="28 September 2026"
        facts={[
          { Icon: Building2, title: "Data controller", text: COMPANY.legalName },
          { Icon: Scale, title: "UK GDPR", text: "and the Data Protection Act 2018" },
          { Icon: ShieldOff, title: "Never sold", text: "We don't sell your information" },
          { Icon: MessageSquareWarning, title: "Complaints", text: "Acknowledged within 30 days" },
        ]}
      />

      <Section id="policy" tone="light" next="dark">
        <LegalDoc clauses={CLAUSES} label="Privacy policy" />
      </Section>

      <HelpSection
        title={["Questions About", "Your Data?"]}
        lead="To ask about or exercise your rights, contact our data protection contact by WhatsApp, telephone or email."
        related={[
          { label: "Cookie policy", href: "/cookies" },
          { label: "Terms and conditions", href: "/terms" },
          { label: "Documents you need", href: "/documents-you-need" },
        ]}
      />
    </>
  );
}
