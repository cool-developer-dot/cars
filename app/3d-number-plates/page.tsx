import type { Metadata } from "next";
import JsonLd from "@/components/content/JsonLd";
import ProductHero from "@/components/ProductHero/ProductHero";
import Replacement3D from "@/components/product3d/Replacement3D";
import GelExplained from "@/components/product3d/GelExplained";
import SizesOptions from "@/components/product3d/SizesOptions";
import LegalInfo from "@/components/product3d/LegalInfo";
import Delivery3D from "@/components/product3d/Delivery3D";
import CareWarranty3D from "@/components/product3d/CareWarranty3D";
import GuidesReviews3D from "@/components/product3d/GuidesReviews/GuidesReviews3D";
import HowToOrder3D from "@/components/product3d/HowToOrder3D";
import Documents3D from "@/components/product3d/Documents3D";
import { PRODUCTS } from "@/lib/products";
import { COMPANY, PRICES, SITE_URL } from "@/lib/site";

const product = PRODUCTS["3d"];

export const metadata: Metadata = {
  title: { absolute: product.metaTitle },
  description: product.metaDescription,
  alternates: { canonical: product.path },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name: product.h1,
              description: product.metaDescription,
              brand: { "@type": "Brand", name: COMPANY.brand },
              offers: {
                "@type": "Offer",
                price: PRICES["3d"].single.toFixed(2),
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}${product.path}`,
              },
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Plate styles", item: `${SITE_URL}/plate-styles` },
                { "@type": "ListItem", position: 3, name: product.h1, item: `${SITE_URL}${product.path}` },
              ],
            },
          ],
        }}
      />
      <ProductHero
        product={product}
        nextFill="#f3f7fb"
        art={{
          src: "/3d/plates-3d-gel.webp",
          srcMobile: "/3d/plates-3d-gel-mobile.webp",
          width: 2000,
          height: 1000,
          alt: "A white front and a yellow rear 3D gel number plate reading AB12 CDE, with raised glossy black resin characters",
        }}
      />
      <Replacement3D />
      <GelExplained />
      <SizesOptions />
      <LegalInfo />
      <HowToOrder3D />
      <Documents3D />
      <Delivery3D />
      <CareWarranty3D />
      <GuidesReviews3D />
    </>
  );
}
