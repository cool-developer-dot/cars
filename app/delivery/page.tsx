import Link from "next/link";
import { CalendarClock, Clock3, Map as MapIcon, MapPin, PackageCheck, PackageX, Send, Store, Truck } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { RoyalMailMark, WhatsAppIcon } from "@/components/productPage/deliveryIcons";
import {
  Button,
  Cards,
  Channels,
  Checklist,
  Media,
  Panel,
  Table,
  type CardItem,
} from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, CONTACT, DELIVERY, DELIVERY_FEES } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Delivery and Dispatch | ReplacementPlates",
  description:
    "Royal Mail First Class is £3 on orders under £15 and free from £15. Tracked 24 is an additional £2. How dispatch, delivery and collection timings work.",
  path: "/delivery",
});

const { firstClass, freeFrom, tracked } = DELIVERY_FEES;
const pounds = (n: number) => `£${n}`;

const MOMENTS: CardItem[] = [
  { Icon: Send, title: "Dispatch", text: "When we hand your parcel to Royal Mail." },
  { Icon: Truck, title: "Delivery", text: "When Royal Mail brings it to you." },
  { Icon: Store, title: "Collection", text: "When you pick up your plates from us." },
];

const EXAMPLES = [
  {
    title: "Monday to Thursday, complete before 2pm",
    text: "We aim to dispatch the same day; Royal Mail then aims to deliver the next working day.",
  },
  {
    title: "Friday, complete before 2pm",
    text: "We aim to dispatch the same day. First Class includes Saturday delivery, but your parcel may arrive later, including the following week. We don't promise a Saturday or Monday arrival.",
  },
  {
    title: "Bank holidays",
    text: "Royal Mail doesn't normally deliver on bank holidays, so allow extra time around them.",
  },
];

/** One Royal Mail service: its mark, name, charge and delivery aim */
function Service({ name, price, aim, index }: { name: string; price: string; aim: string; index: number }) {
  return (
    <Panel tone="light" index={index} className={s.service}>
      <div className={s.serviceHead}>
        <RoyalMailMark className={s.serviceMark} />
        <div>
          <h3 className={s.cardTitle}>{name}</h3>
          <p className={s.servicePrice}>{price}</p>
        </div>
      </div>
      <p className={s.body}>{aim}</p>
    </Panel>
  );
}

export default function DeliveryPage() {
  return (
    <>
      <InfoJsonLd name="Delivery and Dispatch" path="/delivery" />

      <InfoHero
        crumb="Delivery"
        eyebrow="Delivery and dispatch"
        title={["Delivery", "and Dispatch"]}
        lead={
          <p>
            Royal Mail First Class is {pounds(firstClass)} on orders under {pounds(freeFrom)} and free
            from {pounds(freeFrom)}. Tracked 24 is an additional {pounds(tracked)}. Here&rsquo;s how
            dispatch, delivery and collection timings work.
          </p>
        }
        art={{
          src: "/3d/plates-3d-gel.webp",
          srcMobile: "/3d/plates-3d-gel-mobile.webp",
          width: 2000,
          height: 1000,
          alt: "A white front and yellow rear number plate on a dark surface",
        }}
        facts={[
          { Icon: Truck, title: `First Class ${pounds(firstClass)}`, text: `Free on orders of ${pounds(freeFrom)} or more` },
          { Icon: PackageCheck, title: "Tracked 24", text: `An additional ${pounds(tracked)}` },
          { Icon: Clock3, title: "Complete before 2pm", text: "Same-day dispatch aim, Mon–Fri" },
          { Icon: MapPin, title: "Ilford collection", text: "No delivery charge" },
        ]}
      />

      <Section
        id="charges"
        tone="light"
        next="dark"
        eyebrow="Delivery charges"
        title={["What Delivery", "Costs"]}
        lead={
          <p>
            {DELIVERY.firstClass} {DELIVERY.tracked} {DELIVERY.aims}
          </p>
        }
      >
        <div className={s.flow}>
          <Table
            tone="light"
            head={["Goods order value", "Royal Mail First Class", "Royal Mail Tracked 24"]}
            align={["left", "right", "right"]}
            rows={[
              [
                `Under ${pounds(freeFrom)}`,
                <strong key="a">{pounds(firstClass)}</strong>,
                <span key="b">
                  <strong>{pounds(firstClass + tracked)}</strong> total delivery charge
                </span>,
              ],
              [
                `${pounds(freeFrom)} or more`,
                <strong key="c">Free</strong>,
                <span key="d">
                  <strong>{pounds(tracked)}</strong> total delivery charge
                </span>,
              ],
            ]}
          />

          <div className={s.split}>
            <Service
              index={0}
              name="Royal Mail First Class"
              price={`${pounds(firstClass)} under ${pounds(freeFrom)} · Free from ${pounds(freeFrom)}`}
              aim="Aims for the next working day, including Saturday. Subject to Royal Mail's service terms."
            />
            <Service
              index={1}
              name="Royal Mail Tracked 24"
              price={`${pounds(tracked)} more than First Class`}
              aim="Aims for the next working day, with tracking. Optional, and shown separately. Subject to Royal Mail's service terms."
            />
          </div>

          <Panel tone="light">
            <h3 className={s.subhead}>How Your Delivery Charge Is Worked Out</h3>
            <Checklist
              cols={2}
              items={[
                <>An order of exactly {pounds(freeFrom)} qualifies for free First Class delivery.</>,
                <>Order value means the price of the goods in your order, before delivery.</>,
                <>
                  Tracked 24 is {pounds(tracked)} more than First Class in every case:{" "}
                  {pounds(firstClass + tracked)} in total under {pounds(freeFrom)}, and {pounds(tracked)} in total
                  from {pounds(freeFrom)}.
                </>,
                <>
                  The charge that applies is shown next to our prices and in your basket, with a running total
                  that includes it.
                </>,
                <>If you choose to collect your plates from Ilford, no delivery charge applies.</>,
                <>Royal Mail delivery times are aims, not guarantees.</>,
              ]}
            />
          </Panel>
        </div>
      </Section>

      <Section
        id="timings"
        tone="dark"
        next="light"
        eyebrow="Timings"
        title={["Dispatch, Delivery and Collection", "Are Different"]}
      >
        <div className={s.flow}>
          <Cards tone="dark" items={MOMENTS} cols={3} />

          <div className={s.split}>
            <Panel tone="dark">
              <span className={h.iconBlue} aria-hidden="true">
                <CalendarClock strokeWidth={1.9} />
              </span>
              <h3 className={`${s.subhead} ${s.panelHead}`}>When We Aim to Dispatch</h3>
              <p className={s.body}>
                Your plates are made to order and we can only supply them once the required document checks are
                complete. If your order <strong>and</strong> those checks are complete before 2pm on a working
                weekday (Monday to Friday), we aim to dispatch it that day. If they are completed later than that,
                or at a weekend, we don&rsquo;t aim for same-day dispatch.
              </p>
              <h3 className={`${s.subhead} ${s.panelHead}`}>What Can Delay Dispatch</h3>
              <p className={s.body}>
                A missing or unclear document, or a registration that doesn&rsquo;t match the vehicle evidence, can
                delay checks. See <Link href="/documents-you-need">documents you need</Link>.
              </p>
            </Panel>

            <Panel tone="dark" index={1}>
              <p className={s.kicker}>Examples</p>
              <ol className={s.timeline}>
                {EXAMPLES.map((e) => (
                  <li key={e.title}>
                    <h3 className={s.cardTitle}>{e.title}</h3>
                    <p className={s.body}>{e.text}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
        </div>
      </Section>

      <Section id="collection" tone="light" next="dark">
        <Media
          img={{
            src: "/delivery/ilford-collection.webp",
            width: 446,
            height: 660,
            alt: "The ReplacementPlates collection point in Ilford",
          }}
        >
          <p className={h.eyebrow}>Collecting instead</p>
          <h2 className={`${h.title} ${s.title} ${s.mediaHead}`}>
            Collect From <span className={h.accent}>Ilford</span>
          </h2>
          <p className={`${h.lead} ${s.mediaLead}`}>
            You can collect from <strong>{COMPANY.collection}</strong>. {DELIVERY.collectionReady}
          </p>
          <p className={`${h.lead} ${s.mediaLead}`}>
            Collection readiness is separate from dispatch and isn&rsquo;t tied to the 2pm dispatch time.
            We&rsquo;ll tell you what to bring when we confirm your collection.
          </p>
          <div className={`${s.btnRow} ${s.mediaActions}`}>
            <Button href={CONTACT.whatsappHref} Icon={WhatsAppIcon}>
              Message Us on WhatsApp
            </Button>
            <Button href="/areas-we-cover" ghost>
              Areas We Cover
            </Button>
          </div>
        </Media>
      </Section>

      <Section
        id="where"
        tone="dark"
        next="dark"
        eyebrow="Coverage and problems"
        title={["Where We Deliver,", "and If It Goes Wrong"]}
      >
        <div className={s.flow}>
          <Cards
            tone="dark"
            cols={2}
            items={[
              {
                Icon: MapIcon,
                title: "Where We Deliver",
                text: (
                  <>
                    <p>{DELIVERY.areas}</p>
                    <p>
                      Royal Mail&rsquo;s next-working-day aim doesn&rsquo;t apply to some remote areas, such as parts
                      of the Highlands and Islands of Scotland.
                    </p>
                  </>
                ),
              },
              {
                Icon: PackageX,
                title: "If Something Goes Wrong",
                text: (
                  <>
                    <p>
                      If your parcel is late, missing or arrives damaged, contact us with your order number. A photo
                      of the parcel and plate helps if you can take one. We&rsquo;ll look into it with Royal Mail.
                    </p>
                    <p>
                      The plates remain at our risk until they are delivered to you. See{" "}
                      <Link href="/returns">returns and cancellations</Link> and{" "}
                      <Link href="/warranty">warranty and faulty plates</Link>.
                    </p>
                  </>
                ),
              },
            ]}
          />
          <Channels tone="dark" />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
