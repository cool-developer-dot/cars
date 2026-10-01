import type { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import MadeToOrder from "@/components/home/MadeToOrder";
import StylesShowcase from "@/components/home/StylesShowcase";
import DeliveryCollection from "@/components/home/DeliveryCollection";
import HowToOrder from "@/components/home/HowToOrder";
import DocumentsNeeded from "@/components/home/DocumentsNeeded";
import LegalCompliance from "@/components/home/LegalCompliance";
import Guides from "@/components/home/Guides";
import Supplier from "@/components/home/Supplier";
import Reviews from "@/components/home/Reviews";
import Faqs from "@/components/Faqs/Faqs";
import GetStarted from "@/components/home/GetStarted";
import {
  HomeBuilderProvider,
  HomeBuilderSlot,
} from "@/components/home/HomeBuilder";
import { hasReviews } from "@/lib/reviews";
import JsonLd from "@/components/content/JsonLd";
import { COMPANY, FROM_PRICE, SITE_URL, gbp } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Replacement Number Plates from ${gbp(FROM_PRICE)} | Royal Mail Delivery` },
  description:
    `Order replacement number plates online from ${gbp(FROM_PRICE)} per plate. Standard, 3D, 4D, 5D, Ghost and Bevel styles from a DVLA-registered supplier. Royal Mail delivery or Ilford collection.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: COMPANY.brand,
              legalName: COMPANY.legalName,
              url: `${SITE_URL}/`,
              logo: `${SITE_URL}/logo-rp.webp`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Stand 53, New Spitalfields Market, 1 Sherrin Road",
                addressLocality: "London",
                postalCode: "E10 5SQ",
                addressCountry: "GB",
              },
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: `${SITE_URL}/`,
              name: COMPANY.brand,
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }}
      />
      <HomeBuilderProvider>
        <Hero />
        <MadeToOrder />
        <StylesShowcase />
        {/* One shared builder — revealed when the user chooses a style or starts building */}
        <HomeBuilderSlot />
        <DeliveryCollection />
        <HowToOrder />
        <DocumentsNeeded />
        <LegalCompliance />
        <Guides />
        {/* Reviews only render once real ones are added (lib/reviews.ts) */}
        <Supplier next={hasReviews ? "#f3f7fb" : "#06111f"} />
        <Reviews />
        <Faqs />
        <GetStarted />
      </HomeBuilderProvider>
    </>
  );
}
