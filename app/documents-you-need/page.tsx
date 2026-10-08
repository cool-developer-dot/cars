import Link from "next/link";
import {
  Archive,
  Camera,
  FileBadge2,
  FileText,
  IdCard,
  Landmark,
  MonitorCheck,
  ScrollText,
  ShieldAlert,
  UserCheck,
  XCircle,
} from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards, Checklist, Chips, MoreLink, Note, Panel, Rows, Steps } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { GOV_UK_DOCS_URL } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Documents You Need to Order Number Plates | ReplacementPlates",
  description:
    "Which documents show your name, address and right to use a registration, as the DVLA requires before a registered supplier can supply road-use number plates.",
  path: "/documents-you-need",
});

const INF104 = "https://www.gov.uk/government/publications/vehicle-registration-numbers-and-number-plates";

/** The hero card: the two things every order needs */
function TwoThings() {
  return (
    <div className={`${h.liquid} ${s.panel} ${s.needCard}`}>
      <p className={s.kicker}>You need evidence of both</p>
      <ol className={s.needList}>
        <li>
          <span className={h.iconBlue} aria-hidden="true">
            <IdCard strokeWidth={1.9} />
          </span>
          <span>
            <strong>Who you are</strong>
            <span>One document with your name and address, such as a driving licence.</span>
          </span>
        </li>
        <li>
          <span className={h.iconBlue} aria-hidden="true">
            <FileBadge2 strokeWidth={1.9} />
          </span>
          <span>
            <strong>That you can use the registration</strong>
            <span>One entitlement document, such as your V5C log book.</span>
          </span>
        </li>
      </ol>
      <MoreLink href={GOV_UK_DOCS_URL}>Official guidance on GOV.UK</MoreLink>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <>
      <InfoJsonLd name="Documents You Need to Order Number Plates" path="/documents-you-need" />

      <InfoHero
        crumb="Documents you need"
        eyebrow="Documents"
        title={["Documents You Need", "to Order Number Plates"]}
        lead={
          <p>
            Before a registered number plate supplier can supply road-use plates, the DVLA requires them to be
            satisfied about <strong>who you are</strong> and <strong>that you can use the registration</strong>.
            You need evidence of both.
          </p>
        }
        aside={<TwoThings />}
      />

      <Section
        id="name-and-address"
        tone="light"
        next="dark"
        eyebrow="1. Identity"
        title={["Proof of Your", "Name and Address"]}
        lead="One document can confirm both. If yours confirms your name only, add a second one that shows your address."
      >
        <div className={s.split}>
          <Panel tone="light">
            <p className={s.kicker}>Confirms name and address</p>
            <h3 className={s.subhead}>Any One of These</h3>
            <Checklist
              items={[
                "Driving licence",
                "Utility, Council Tax or rates bill from the last 6 months",
                "Bank or building society statement from the last 6 months",
                "National identity card",
              ]}
            />
          </Panel>
          <Panel tone="light" index={1}>
            <p className={s.kicker}>Confirms your name only</p>
            <h3 className={s.subhead}>Add a Document Showing Your Address</h3>
            <Checklist
              items={[
                "Passport (it doesn't have to be UK-issued)",
                "Bank or building society debit or credit card",
                "Police warrant card",
                "Armed forces identity card",
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section
        id="entitlement"
        tone="dark"
        next="light"
        eyebrow="2. Entitlement"
        title={["Proof You Can Use", "the Registration"]}
        lead="Any one of these:"
      >
        <div className={s.flow}>
          <Panel tone="dark">
            <Checklist
              cols={2}
              items={[
                "V5C registration certificate (log book)",
                "New keeper slip (the green slip)",
                "V750 certificate of entitlement",
                "V778 retention document",
                "V11 renewal reminder for vehicle tax or SORN",
                "V379 temporary registration certificate",
                "V948 number plate authorisation certificate with an official DVLA or DVSA stamp",
                "eV948 electronic number plate authorisation certificate",
                "A letter of authorisation from a fleet operator (including a lease or hire company) quoting the document reference number from the registration certificate",
                "For fleets in the V5C on-demand scheme, a PDF of the vehicle's details from the DVLA view vehicle record service",
              ]}
            />
          </Panel>
          <div className={s.split}>
            <Note tone="dark" Icon={ScrollText} title="Lost, stolen or damaged V5C?">
              <p>
                You can <a href="https://www.gov.uk/vehicle-log-book" target="_blank" rel="noopener noreferrer">apply for a duplicate on GOV.UK</a>.
              </p>
            </Note>
            <Note tone="dark" Icon={UserCheck} title="Ordering on someone else's behalf?">
              <p>
                You don&rsquo;t have to be a vehicle&rsquo;s registered keeper to order, but you do need to show your
                own identity and an accepted entitlement document. If you&rsquo;re ordering for someone else,{" "}
                <Link href="/contact">contact us</Link> first.
              </p>
            </Note>
          </div>
          <Panel tone="dark">
            <h3 className={s.subhead}>Getting Plates Made Is Not the Same as Assigning or Displaying a Registration</h3>
            <p className={s.body}>
              A V750 or V778 can be accepted as evidence of your entitlement to a registration even if it hasn&rsquo;t
              yet been put on a vehicle. That is separate from assigning the registration to a vehicle, which the
              DVLA handles, and from displaying it, which you should only do on the vehicle it belongs to.
            </p>
          </Panel>
        </div>
      </Section>

      <Section
        id="originals"
        tone="light"
        next="dark"
        side
        eyebrow="3. Providing them"
        title={["Originals, Electronic", "Authorisations and Photos"]}
        lead="We'll tell you how to provide your documents when you order, and we won't supply your plates until our checks are complete."
      >
        <Rows
          tone="light"
          items={[
            {
              Icon: FileText,
              title: "Original Documents",
              text: "The DVLA's guidance says a supplier will need to see original documents.",
            },
            {
              Icon: MonitorCheck,
              title: "Electronic Authorisations",
              text: "Some authorisations are issued electronically by the DVLA, such as an eV948, and those are recognised as electronic documents.",
            },
            {
              Icon: Camera,
              title: "Photographs",
              text: "A photograph of a paper document is not the same thing as the original.",
            },
          ]}
        />
      </Section>

      <Section
        id="what-happens-next"
        tone="dark"
        next="light"
        eyebrow="4. What happens next"
        title={["From Order", "to Your Plates"]}
      >
        <div className={s.flow}>
          <Steps
            tone="dark"
            items={[
              { title: "You Place Your Order", text: "Build your plate and place your order online." },
              { title: "We Check Your Documents", text: "We may ask for more if something is unclear." },
              {
                title: "Your Plates Are Made",
                text: "Once our checks are complete, your plates are made and supplied.",
              },
              {
                title: "Dispatch or Collection",
                text: (
                  <>
                    We dispatch them by Royal Mail, or confirm your collection. See{" "}
                    <Link href="/delivery">delivery</Link>.
                  </>
                ),
              },
            ]}
          />
          <Cards
            tone="dark"
            cols={3}
            items={[
              {
                Icon: XCircle,
                title: "If We Can't Complete the Checks",
                text: "We can't supply your plates. We'll tell you, cancel the order and refund what you've paid.",
              },
              {
                Icon: Archive,
                title: "Records We Keep",
                text: (
                  <>
                    We record details of the documents we check and keep that record for three years, because the DVLA
                    requires it. How we handle your documents, and how long we keep them, is set out in our{" "}
                    <Link href="/privacy">privacy policy</Link>.
                  </>
                ),
              },
              {
                Icon: ShieldAlert,
                title: "Honest Documents, Adults Only",
                text: "Knowingly providing false documents may be a criminal offence. Our policy is to accept orders only from people aged 18 or over.",
              },
            ]}
          />
        </div>
      </Section>

      <Section
        id="official-guidance"
        tone="light"
        next="dark"
        eyebrow="Official guidance"
        title={["Straight From", "GOV.UK and the DVLA"]}
      >
        <div className={s.flow}>
          <Cards
            tone="light"
            cols={2}
            items={[
              {
                Icon: Landmark,
                title: "GOV.UK: Getting Number Plates Made Up",
                text: "The government's own list of the documents a registered supplier must see.",
                href: GOV_UK_DOCS_URL,
                link: "Read on GOV.UK",
              },
              {
                Icon: ScrollText,
                title: "DVLA Leaflet INF104",
                text: "Vehicle registration numbers and number plates: the DVLA's full guidance.",
                href: INF104,
                link: "Read INF104",
              },
            ]}
          />
          <div className={s.chipRow}>
            <p className={s.kicker}>See also</p>
            <Chips
              items={[
                { label: "How it works", href: "/how-it-works" },
                { label: "Legal number plates", href: "/legal-number-plates" },
                { label: "FAQs", href: "/faqs#documents" },
              ]}
            />
          </div>
        </div>
      </Section>

      <ClosingCta secondary={{ href: "/contact", label: "Ask About Documents" }} />
    </>
  );
}
