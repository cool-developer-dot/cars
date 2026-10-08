import Link from "next/link";
import { Ban, Factory, RotateCcw, Scale } from "lucide-react";
import HelpSection from "@/components/infoPage/HelpSection";
import InfoHero from "@/components/infoPage/InfoHero";
import LegalDoc, { type Clause } from "@/components/infoPage/LegalDoc";
import Section from "@/components/infoPage/Section";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT } from "@/lib/site";

export const metadata = infoMetadata({
  title: "Cancellations and Returns: Full Refund Before Production Starts | ReplacementPlates",
  description:
    "Cancel for a full refund at any time before production starts, with no fee. Personalised plates have no change-of-mind right once production has started. Your rights for faulty goods are unaffected.",
  path: "/returns",
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const CONTACT_LINE = (
  <>
    Contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, telephone{" "}
    <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> or WhatsApp{" "}
    <a href={CONTACT.whatsappHref} {...ext}>
      {CONTACT.whatsapp}
    </a>{" "}
    as soon as possible.
  </>
);

const CLAUSES: Clause[] = [
  {
    id: "cancel",
    num: "1",
    title: "Cancel Before Production Starts",
    body: (
      <>
        <p>
          You can cancel for a full refund at any time before production starts. No cancellation or administration
          fee applies. Once production has started, personalised plates cannot normally be cancelled for a change of
          mind. Your statutory rights are unaffected.
        </p>
        <p>{CONTACT_LINE}</p>
      </>
    ),
  },
  {
    id: "personalised",
    num: "2",
    title: "Personalised Plates and the Change-of-Mind Exception",
    body: (
      <>
        <p>
          Every plate is made to the registration and options you enter. Under the Consumer Contracts (Information,
          Cancellation and Additional Charges) Regulations 2013, the usual 14-day right to cancel does not apply to
          goods made to your specification. That statutory exception applies from when your contract is made. It is
          separate from our offer above, which lets you cancel for a full refund at any time before production starts.
        </p>
        <h3>When we cancel</h3>
        <p>
          If we can&rsquo;t complete our checks, or can&rsquo;t make or supply your plates for a reason on our side, we
          cancel the order and refund what you&rsquo;ve paid for the affected items.
        </p>
      </>
    ),
  },
  {
    id: "not-made-to-order",
    num: "3",
    title: "Items That Are Not Made to Order",
    body: (
      <>
        <p>
          If your order includes an item that is not made to your specification, such as some accessories, you have
          the right to cancel that item within 14 days, without giving a reason.
        </p>
        <ul>
          <li>The 14 days start the day after you receive the item.</li>
          <li>
            Tell us clearly, by email, WhatsApp, telephone or post to our registered office ({COMPANY.registeredOffice}
            ). You can use any clear statement.
          </li>
          <li>Return the item within 14 days of telling us. You pay the cost of returning it; we tell you this before you order.</li>
          <li>
            We refund within 14 days of receiving the item back or of you showing you&rsquo;ve sent it back, whichever is
            earlier, to the payment method you used.
          </li>
        </ul>
        <h3>Cancelling the whole order or returning one item</h3>
        <ul>
          <li>
            <strong>Cancelling an entire order</strong> that consists only of items you can cancel: we refund everything
            you paid, including delivery at the standard rate. If you chose Tracked 24, we refund the standard delivery
            amount, not the upgrade.
          </li>
          <li>
            <strong>Returning one item from a mixed order:</strong> we refund the price of that item. The delivery charge
            for the rest of the order isn&rsquo;t refunded, because the rest of the order is still being delivered.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "faulty",
    num: "4",
    title: "Faulty, Damaged or Wrongly Made Plates",
    body: (
      <>
        <p>
          Being made to order doesn&rsquo;t take away your legal rights under the Consumer Rights Act 2015. Goods must be
          of satisfactory quality, fit for purpose and as described.
        </p>
        <ul>
          <li>
            <strong>Within 30 days of delivery you can reject faulty goods for a refund.</strong> If you ask for, or agree
            to, a repair or replacement in that time, the 30 days pause so you have the rest of the 30 days or 7 days,
            whichever is longer, to check that it worked.
          </li>
          <li>
            <strong>Repair or replacement.</strong> You can ask for either. You choose, unless the one you pick is
            impossible or disproportionately costly compared with the other. We carry it out free of charge, within a
            reasonable time and without significant inconvenience to you.
          </li>
          <li>
            <strong>If it doesn&rsquo;t work.</strong> After one unsuccessful repair or replacement, or if we can&rsquo;t
            provide either within a reasonable time without significant inconvenience, you can ask for a price reduction
            or reject the goods for a refund. You don&rsquo;t have to accept repeated attempts, though you can if you wish.
          </li>
          <li>
            <strong>Refunds.</strong> We refund without undue delay and within 14 days of agreeing you&rsquo;re entitled to
            a refund. We pay the reasonable cost of returning faulty goods. No deduction is made for use if you reject
            within six months.
          </li>
        </ul>
        <p>Assessing a plate doesn&rsquo;t delay or remove a valid right to reject within 30 days.</p>
        <h3>Who has to show what</h3>
        <p>
          If a fault appears within six months of delivery and you ask for a repair, replacement, price reduction or to
          reject after a failed repair, we treat the fault as having been there at delivery unless we can show
          otherwise. That six-month rule doesn&rsquo;t apply to the 30-day short-term right to reject, where the fault
          has to have been present when the plate was delivered. After six months you may need to show the fault was
          there at delivery. For more, see{" "}
          <a href="https://www.citizensadvice.org.uk/consumer/" {...ext}>
            Citizens Advice
          </a>{" "}
          and the{" "}
          <a href="https://www.legislation.gov.uk/ukpga/2015/15/contents" {...ext}>
            Consumer Rights Act 2015
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "what-to-do",
    num: "5",
    title: "What to Do",
    body: (
      <ol>
        <li>
          Tell us as soon as you reasonably can. There is no 24-hour reporting deadline that removes your statutory
          rights, and the sooner we know, the easier it is to assess the cause.
        </li>
        <li>Give your order number and registration.</li>
        <li>
          Send photos of the plate and any packaging if you can. Photos help but aren&rsquo;t required. If you
          can&rsquo;t reasonably take photos, tell us and we&rsquo;ll arrange another way to assess it, such as a
          description of the fault or you sending the plate to us at our cost.
        </li>
        <li>Keep the plate; we may ask you to send it back.</li>
      </ol>
    ),
  },
  {
    id: "matches-what-you-typed",
    num: "6",
    title: "If Your Plate Matches What You Typed",
    body: (
      <>
        <p>
          You are responsible for checking the details you enter before you pay. If a plate matches what you entered,
          we may not be able to treat the entry as our mistake. But it can still have another fault, such as a defect
          in the materials or finish, and we are responsible for making plates accurately and to the legal
          configurations we offer. Tell us what you&rsquo;ve noticed and we&rsquo;ll look at it.
        </p>
        <p>Damage caused by fitting, accidents or misuse is not a manufacturing fault.</p>
        <p>
          See also <Link href="/warranty">warranty and faulty plates</Link>.
        </p>
      </>
    ),
  },
];

export default function ReturnsPage() {
  return (
    <>
      <InfoJsonLd name="Cancellations and Returns" path="/returns" />

      <InfoHero
        crumb="Returns and cancellations"
        eyebrow="Returns and cancellations"
        title={["Cancellations and Returns:", "Full Refund Before Production Starts"]}
        lead={
          <p>
            Your plates are made to order, so here&rsquo;s exactly when you can cancel, what happens if a plate is
            faulty, and how your legal rights work alongside our policy.
          </p>
        }
        updated="28 September 2026"
        facts={[
          { Icon: Ban, title: "Cancel before production", text: "Full refund, no fee" },
          { Icon: Factory, title: "Made to your specification", text: "No change-of-mind right once made" },
          { Icon: RotateCcw, title: "Faulty plates", text: "30-day right to reject" },
          { Icon: Scale, title: "Statutory rights", text: "Always unaffected" },
        ]}
      />

      <Section id="policy" tone="light" next="dark">
        <LegalDoc clauses={CLAUSES} label="Cancellations and returns policy" />
      </Section>

      <HelpSection
        title={["Need to Cancel", "or Report a Fault?"]}
        related={[
          { label: "Terms and conditions", href: "/terms" },
          { label: "Warranty and faulty plates", href: "/warranty" },
          { label: "Delivery", href: "/delivery" },
        ]}
      />
    </>
  );
}
