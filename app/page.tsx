import type { Metadata } from "next";
import Hero from "@/components/Hero/Hero";
import PlateStyles from "@/components/PlateStyles/PlateStyles";
import CommonReasons from "@/components/CommonReasons/CommonReasons";
import HomeInfo from "@/components/HomeInfo/HomeInfo";
import Faqs from "@/components/Faqs/Faqs";
import HomeCta from "@/components/HomeInfo/HomeCta";
import JsonLd from "@/components/content/JsonLd";
import { COMPANY, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Replacement Number Plates from £12.49 | Royal Mail Delivery" },
  description:
    "Order replacement number plates online from £12.49 per plate. Standard, 3D, 4D, 5D, Ghost and Bevel styles from a DVLA-registered supplier. Royal Mail delivery or Ilford collection.",
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
      <Hero />
      <PlateStyles />
      <CommonReasons />
      <HomeInfo />
      <Faqs />
      <HomeCta />
    </>
  );
}
