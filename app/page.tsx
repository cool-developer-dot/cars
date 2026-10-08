import type { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import MadeToOrder from "@/components/home/MadeToOrder";
// import WhyReplacing from "@/components/home/WhyReplacing";
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
} from "@/components/home/HomeBuilder";
import { hasReviews } from "@/lib/reviews";
import JsonLd from "@/components/content/JsonLd";
import { COMPANY, FROM_PRICE, SITE_URL, gbp } from "@/lib/site";

const HOME_TITLE = `Replacement Number Plates from ${gbp(FROM_PRICE)} | Royal Mail Delivery`;
const HOME_DESCRIPTION = `Replacement number plates from ${gbp(FROM_PRICE)} per plate: Standard, 3D, 4D, 5D, Ghost and Bevel, from a DVLA-registered supplier. Delivery or Ilford collection.`;

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "ReplacementPlates",
    locale: "en_GB",
    url: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Replacement number plates" }],
  },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION, images: ["/og/default.jpg"] },
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
        {/* Hidden for now (client request) — re-enable when ready */}
        {/* <WhyReplacing /> */}
        <StylesShowcase />
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
