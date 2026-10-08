import Link from "next/link";
import { RotateCcw, ShieldCheck } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import Story from "@/components/infoPage/Story";
import { Button, Cards, Channels } from "@/components/infoPage/blocks";
import { BuilderPreview, DeliveryArt, DocumentsArt, Photo } from "@/components/infoPage/illustrations";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { builderUrl } from "@/lib/builderLink";
import { COMPANY, DELIVERY } from "@/lib/site";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "How It Works | ReplacementPlates",
  description:
    "How ordering number plates from ReplacementPlates works: build your plate, provide documents, we check, then delivery or collection.",
  path: "/how-it-works",
  image: "/og/4d-intro.jpg",
});

export default function HowItWorksPage() {
  return (
    <>
      <InfoJsonLd
        name="How It Works"
        path="/how-it-works"
        extra={[
          {
            "@type": "HowTo",
            name: "How to order replacement number plates",
            step: [
              "Build your plate",
              "Place your order and provide your documents",
              "We check, then make and supply your plates",
              "Delivery or collection",
            ].map((name, i) => ({ "@type": "HowToStep", position: i + 1, name })),
          },
        ]}
      />

      <InfoHero
        crumb="How it works"
        eyebrow="How it works"
        title={["How Ordering", "Works"]}
        lead={
          <p>
            Four steps from your registration to plates on the car: build your plate, provide your documents, we check
            and make them, then delivery or collection.
          </p>
        }
        art={{
          src: "/4d/intro.webp",
          width: 1522,
          height: 1010,
          alt: "A white front and a yellow rear number plate standing on a reflective surface",
        }}
        actions={<Button href={builderUrl()}>Start Building</Button>}
      />

      <Section
        id="steps"
        tone="light"
        next="dark"
        eyebrow="Four steps"
        title={["From Registration", "to Your Plates"]}
      >
        <Story
          chapters={[
            {
              title: "Build Your Plate",
              body: (
                <p>
                  Enter your registration, choose front, rear or a pair, and pick your style and size. The builder shows a
                  preview and the price. Not sure which style? See the <Link href="/prices">price list</Link> or start with{" "}
                  <Link href="/standard-number-plates">standard number plates</Link>.
                </p>
              ),
              visual: <BuilderPreview />,
            },
            {
              title: "Place Your Order and Provide Your Documents",
              body: (
                <p>
                  We need to check your identity and your entitlement to the registration. See{" "}
                  <Link href="/documents-you-need">documents you need</Link> for the accepted documents. We&rsquo;ll tell
                  you how to provide them when you order.
                </p>
              ),
              visual: <DocumentsArt />,
            },
            {
              title: "We Check, Then Make and Supply Your Plates",
              body: (
                <>
                  <p>
                    We don&rsquo;t supply road-use plates until our required checks are complete. Once they are, your
                    plates are made to your order. Road-use plates carry our name and postcode and the British Standard
                    number.
                  </p>
                  <p>
                    You can cancel for a full refund at any time before production starts; see{" "}
                    <Link href="/returns">returns and cancellations</Link>.
                  </p>
                </>
              ),
              visual: (
                <Photo
                  src="/3d/macro-3d-gel.webp"
                  width={580}
                  height={464}
                  alt="Close-up of a raised black gel character on a white plate"
                />
              ),
            },
            {
              title: "Delivery or Collection",
              body: (
                <ul>
                  <li>
                    <strong>Delivery:</strong> {DELIVERY.firstClass} {DELIVERY.tracked} {DELIVERY.aims} If your order and
                    checks are complete before 2pm on a working weekday, we aim to dispatch the same day. See{" "}
                    <Link href="/delivery">delivery</Link>.
                  </li>
                  <li>
                    <strong>Collection:</strong> from {COMPANY.collection}. {DELIVERY.collectionReady} See{" "}
                    <Link href="/delivery#collection">collection in Ilford</Link>.
                  </li>
                </ul>
              ),
              visual: <DeliveryArt />,
            },
          ]}
        />
      </Section>

      <Section
        id="if-something-isnt-right"
        tone="dark"
        next="dark"
        eyebrow="After your order"
        title={["If Something", "Isn't Right"]}
        lead="Tell us by WhatsApp, telephone or email and give your order number."
      >
        <div className={s.flow}>
          <Channels tone="dark" />
          <Cards
            tone="dark"
            cols={2}
            items={[
              {
                Icon: RotateCcw,
                title: "Returns and Cancellations",
                text: "Cancel before production starts for a full refund, and your rights if a plate is faulty.",
                href: "/returns",
                link: "Returns and cancellations",
              },
              {
                Icon: ShieldCheck,
                title: "Faulty Plates and Warranty",
                text: "A 6- or 12-month manufacturing-defect warranty, depending on the finish.",
                href: "/warranty",
                link: "Warranty",
              },
            ]}
          />
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
