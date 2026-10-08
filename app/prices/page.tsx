import Link from "next/link";
import { Layers, MapPin, Tag, Truck } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards, Note, Table, type CardItem } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import {
  DELIVERY,
  DELIVERY_FEES,
  FROM_PRICE,
  PRICES,
  SITE_URL,
  SPECIALITY,
  SPECIALITY_ORDER,
  formatPrices,
  gbp,
  type SpecialityId,
  type StyleId,
} from "@/lib/site";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Number Plate Prices | ReplacementPlates",
  description: `ReplacementPlates prices for one plate and for a front and rear pair, for Standard, 3D, 4D, 5D, Ghost and Bevel number plates, from ${gbp(FROM_PRICE)}, with delivery charges shown.`,
  path: "/prices",
});

const { firstClass, freeFrom, tracked } = DELIVERY_FEES;
const pounds = (n: number) => `£${n}`;

const STYLES: { id: StyleId; name: string; img: string }[] = [
  { id: "standard", name: "Standard", img: "/finishes/printed.webp" },
  { id: "3d", name: "3D Gel", img: "/finishes/gel.webp" },
  { id: "4d", name: "4D", img: "/finishes/acrylic.webp" },
  { id: "5d", name: "5D (4D Gel)", img: "/finishes/acrylic-gel.webp" },
  { id: "ghost", name: "Ghost", img: "/finishes/ghost.webp" },
  { id: "bevel", name: "Bevel", img: "/finishes/bevel.webp" },
];

/** One price line inside a card: the figure, then what it buys */
function PriceLines({ single, pair }: { single: number; pair: number }) {
  return (
    <dl className={s.priceLines}>
      <div>
        <dt>One plate</dt>
        <dd>{gbp(single)}</dd>
      </div>
      <div>
        <dt>Front and rear pair</dt>
        <dd>{gbp(pair)}</dd>
      </div>
    </dl>
  );
}

const STYLE_CARDS: CardItem[] = STYLES.map(({ id, name, img }) => {
  const p = PRICES[id];
  return {
    title: name,
    img: { src: img, position: "50% 60%" },
    text: (
      <>
        <p>{p.what}</p>
        <PriceLines single={p.single} pair={p.pair} />
      </>
    ),
    href: p.href,
    link: `${name} plates`,
  };
});

const FORMAT_ART: Record<SpecialityId, string> = {
  short: "/formats/short.webp",
  oversized: "/formats/oversized.webp",
  show: "/formats/show.webp",
  ev: "/formats/ev.webp",
};

const FORMAT_CARDS: CardItem[] = SPECIALITY_ORDER.map((id) => {
  const f = SPECIALITY[id];
  const { single, pair } = formatPrices("standard", f.format);
  return {
    title: `${f.name} Plates`,
    img: { src: FORMAT_ART[id], position: "50% 30%" },
    text: (
      <>
        <p>{f.blurb}</p>
        <PriceLines single={single} pair={pair} />
      </>
    ),
    href: f.path,
    link: `${f.name} plates`,
  };
});

const std = PRICES.standard;
const firstClassFor = (goods: number) => (goods >= freeFrom ? 0 : firstClass);

export default function PricesPage() {
  return (
    <>
      <InfoJsonLd
        name="Number Plate Prices"
        path="/prices"
        extra={[
          {
            "@type": "OfferCatalog",
            name: "Number plate prices",
            itemListElement: STYLES.map(({ id, name }) => ({
              "@type": "Offer",
              name: `${name} number plate, one plate`,
              price: PRICES[id].single.toFixed(2),
              priceCurrency: "GBP",
              url: `${SITE_URL}${PRICES[id].href}`,
            })),
          },
        ]}
      />

      <InfoHero
        crumb="Prices"
        eyebrow="Price list"
        title={["Number Plate", "Prices"]}
        lead={
          <p>
            One plate (front or rear) or a front and rear pair, in six finishes, with the delivery charge shown beside
            every price. The builder shows your exact total before you pay.
          </p>
        }
        art={{
          src: "/standard/intro.webp",
          width: 1522,
          height: 1010,
          alt: "A white front and a yellow rear number plate standing on a reflective surface",
        }}
        facts={[
          { Icon: Tag, title: `From ${gbp(FROM_PRICE)}`, text: "One Standard plate" },
          { Icon: Layers, title: "One plate or a pair", text: "Front, rear or both" },
          { Icon: Truck, title: `Free First Class from ${pounds(freeFrom)}`, text: `${pounds(firstClass)} under ${pounds(freeFrom)}` },
          { Icon: MapPin, title: "Ilford collection", text: "No delivery charge" },
        ]}
      />

      <Section
        id="styles"
        tone="light"
        next="dark"
        eyebrow="Plate styles"
        title={["Prices by", "Finish"]}
        lead={
          <p>
            The first price is for <strong>one plate</strong> (front or rear); the second is for a{" "}
            <strong>front and rear pair</strong> (two plates).
          </p>
        }
      >
        <div className={s.flow}>
          <Cards tone="light" items={STYLE_CARDS} cols={3} compact />
          <Note tone="light" title="Ghost plates">
            <p>
              For information about the Ghost finish, see the <Link href="/ghost-number-plates">Ghost page</Link> before
              ordering.
            </p>
          </Note>
        </div>
      </Section>

      <Section
        id="formats"
        tone="dark"
        next="light"
        eyebrow="Other formats and options"
        title={["Speciality", "Formats"]}
        lead="Shown here in the Standard finish. Prices for other finishes, and for any badge or option you choose, are shown in the plate builder before you pay."
      >
        <Cards tone="dark" items={FORMAT_CARDS} cols={4} />
      </Section>

      <Section
        id="delivery"
        tone="light"
        next="dark"
        eyebrow="Delivery charges"
        title={["Delivery,", "Shown Up Front"]}
        lead={
          <p>
            {DELIVERY.firstClass} {DELIVERY.tracked} {DELIVERY.aims}
          </p>
        }
      >
        <div className={s.flow}>
          <div className={s.split}>
            <Table
              tone="light"
              caption="Delivery charges"
              head={["Goods order value", "First Class", "Tracked 24"]}
              align={["left", "right", "right"]}
              rows={[
                [`Under ${pounds(freeFrom)}`, pounds(firstClass), `${pounds(firstClass + tracked)} total`],
                [`${pounds(freeFrom)} or more`, "Free", `${pounds(tracked)} total`],
              ]}
            />
            <Table
              tone="light"
              caption="Examples with delivery"
              head={["Order", "Goods", "First Class", "Tracked 24"]}
              align={["left", "right", "right", "right"]}
              rows={[
                [
                  "One Standard plate",
                  gbp(std.single),
                  gbp(std.single + firstClassFor(std.single)),
                  gbp(std.single + firstClassFor(std.single) + tracked),
                ],
                [
                  "Standard pair",
                  gbp(std.pair),
                  gbp(std.pair + firstClassFor(std.pair)),
                  gbp(std.pair + firstClassFor(std.pair) + tracked),
                ],
              ]}
            />
          </div>
          <Note tone="light" title="Before you pay">
            <p>
              An order of exactly {pounds(freeFrom)} qualifies for free First Class. The delivery charge that applies to
              your order is shown in your basket, with a running total that includes it, and Tracked 24 is optional. If
              you collect from Ilford, no delivery charge applies.
            </p>
            <p>
              Your plates are made to the details you enter, so please check them. You can cancel for a full refund at
              any time before production starts. See <Link href="/returns">returns and cancellations</Link> and{" "}
              <Link href="/delivery">delivery and dispatch</Link>.
            </p>
          </Note>
        </div>
      </Section>

      <ClosingCta secondary={{ href: "/plate-styles", label: "Compare Styles" }} />
    </>
  );
}
