import Link from "next/link";
import { CalendarCheck2, Camera, ClipboardList, Hammer, History, MessageCircle, Scale, ShieldCheck, Sun } from "lucide-react";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards, Channels, Checklist, Note, Panel, Rows, type CardItem } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, PRICES, WARRANTY_MONTHS, type StyleId } from "@/lib/site";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Warranty and Faulty Plates | ReplacementPlates",
  description:
    "Six- and twelve-month manufacturing-defect warranty on new orders, what it covers, how to claim, and how it sits alongside your statutory rights.",
  path: "/warranty",
});

/** Each finish's warranty, shown with a close-up of its characters */
const FINISHES: { id: StyleId; name: string; img: string }[] = [
  { id: "standard", name: "Standard / Printed", img: "/finishes/printed.webp" },
  { id: "3d", name: "3D Gel", img: "/finishes/gel.webp" },
  { id: "4d", name: "4D", img: "/finishes/acrylic.webp" },
  { id: "5d", name: "5D", img: "/finishes/acrylic-gel.webp" },
  { id: "ghost", name: "Ghost", img: "/finishes/ghost.webp" },
  { id: "bevel", name: "Bevel", img: "/finishes/bevel.webp" },
];

const PERIODS: CardItem[] = FINISHES.map(({ id, name, img }) => ({
  title: name,
  text: PRICES[id].what,
  img: { src: img, position: "50% 60%" },
  badge: `${WARRANTY_MONTHS[id]} months`,
}));

export default function WarrantyPage() {
  return (
    <>
      <InfoJsonLd name="Warranty and Faulty Plates" path="/warranty" />

      <InfoHero
        crumb="Warranty"
        eyebrow="Warranty"
        title={["Warranty and", "Faulty Plates"]}
        lead={
          <p>
            A six- or twelve-month manufacturing-defect warranty on new orders: what it covers, how to claim, and how
            it sits alongside your statutory rights.
          </p>
        }
        updated="28 September 2026"
        art={{
          src: "/3d/care-plate.webp",
          srcMobile: "/3d/care-plate-mobile.webp",
          width: 1920,
          height: 1100,
          alt: "Close-up of raised black characters on a number plate",
          position: "40% 50%",
        }}
        facts={[
          { Icon: ShieldCheck, title: "6 months", text: "Standard, 3D Gel and 4D" },
          { Icon: ShieldCheck, title: "12 months", text: "5D, Ghost and Bevel" },
          { Icon: CalendarCheck2, title: "Starts on delivery", text: "Or on the collection date" },
          { Icon: Scale, title: "Plus your statutory rights", text: "It doesn't limit them" },
        ]}
      />

      <Section
        id="periods"
        tone="light"
        next="dark"
        eyebrow="Manufacturing-defect warranty"
        title={["Warranty on", "New Orders"]}
        lead={
          <p>
            <strong>Guarantor:</strong> {COMPANY.legalName}, {COMPANY.registeredOffice}.
          </p>
        }
      >
        <div className={s.flow}>
          <Cards tone="light" items={PERIODS} cols={3} compact />
          <Note tone="light" title="How it works">
            <p>
              Specialty shapes follow the finish you select. The warranty starts on the delivery or collection date and
              covers manufacturing defects in plates we made. It is in addition to your statutory rights and does not
              limit them. A warranty covers manufacturing defects; it is not a statement that a product is approved for
              road use.
            </p>
          </Note>
        </div>
      </Section>

      <Section
        id="cover"
        tone="dark"
        next="light"
        eyebrow="What's covered"
        title={["What It Covers,", "and What It Doesn't"]}
      >
        <div className={s.flow}>
          <div className={s.split}>
            <Panel tone="dark">
              <h3 className={s.subhead}>What It Covers</h3>
              <Checklist
                items={[
                  "Delamination or peeling of the plate's layers",
                  "Characters coming away from the plate",
                  "Premature fading or discolouration",
                  "Other defects in materials or workmanship",
                ]}
              />
            </Panel>
            <Panel tone="dark" index={1}>
              <h3 className={s.subhead}>What It Doesn&rsquo;t Cover</h3>
              <Checklist
                cross
                items={[
                  "Damage from accidents or impact",
                  "Incorrect fitting, including drilling through or over-tightening on characters",
                  "Misuse or modification",
                  "Abnormal chemical exposure, such as solvents or harsh cleaning agents",
                  "Fair wear over a long period",
                ]}
              />
            </Panel>
          </div>
          <div className={s.split}>
            <Note tone="dark" Icon={Sun} title="Outdoor exposure is expected">
              <p>
                Ordinary outdoor exposure is expected on a road plate, so early fading, peeling or detaching is treated as
                a possible defect, not as wear.
              </p>
            </Note>
            <Note tone="dark" Icon={History} title="Earlier orders">
              <p>
                If you bought earlier and were sold a longer guarantee, that guarantee continues to apply. We do not
                shorten it. Contact us with your order number.
              </p>
            </Note>
          </div>
        </div>
      </Section>

      <Section
        id="statutory-rights"
        tone="light"
        next="dark"
        side
        eyebrow="Your legal rights"
        title={["Your Statutory Rights", "Are Separate"]}
        lead="Your rights under the Consumer Rights Act 2015 apply whatever the warranty says, and they have their own time limits."
      >
        <Panel tone="light">
          <Checklist
            items={[
              "The 30-day short-term right to reject faulty goods for a refund.",
              "For repair, replacement, price reduction or rejection after a failed repair, a presumption that a fault appearing within six months was there at delivery.",
              "The warranty periods above are voluntary and are separate from those limits.",
              "There is no 24-hour reporting deadline that removes your statutory rights.",
            ]}
          />
          <p className={`${s.body} ${s.panelFoot}`}>
            The detail is on our <Link href="/returns">returns and cancellations</Link> page.
          </p>
        </Panel>
      </Section>

      <Section
        id="claim"
        tone="dark"
        next="footer"
        side
        eyebrow="Making a claim"
        title={["How to Make", "a Claim"]}
        lead="If a plate we made is covered, we will put it right by remaking or replacing the affected plate at no cost to you or, where that isn't possible, refunding the price of that plate."
      >
        <div className={s.flow}>
          <Rows
            tone="dark"
            items={[
              {
                Icon: MessageCircle,
                title: "Get in Touch",
                text: "Email, telephone or WhatsApp us using the details below.",
              },
              {
                Icon: ClipboardList,
                title: "Tell Us What's Wrong",
                text: "Give your order number and registration, and tell us what's wrong.",
              },
              {
                Icon: Camera,
                title: "Photos Help, but Aren't Required",
                text: "If you can't take photos, tell us and we'll arrange another way to assess the plate, such as a description or you sending it to us at our cost.",
              },
              {
                Icon: Hammer,
                title: "We Assess It Fairly",
                text: "We assess the cause fairly and will tell you what we found and why.",
              },
            ]}
          />
          <Channels tone="dark" stack />
        </div>
      </Section>
    </>
  );
}
