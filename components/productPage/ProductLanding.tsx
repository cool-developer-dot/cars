import type { Metadata } from "next";
import JsonLd from "@/components/content/JsonLd";
import ProductHero from "@/components/ProductHero/ProductHero";
import { COMPANY, PRICES, SITE_URL } from "@/lib/site";
import CareWarranty from "./CareWarranty";
import Delivery from "./Delivery";
import Documents from "./Documents";
import FaqCta from "./FaqCta/FaqCta";
import FinishExplained from "./FinishExplained";
import GuidesReviews from "./GuidesReviews/GuidesReviews";
import HowToOrder from "./HowToOrder";
import LegalInfo from "./LegalInfo";
import Replacement from "./Replacement";
import SizesOptions from "./SizesOptions";
import { PRODUCT_PAGES, type ProductPageId } from "./pageContent";

/** Title, description and canonical URL for a plate-style page */
export function productMetadata(id: ProductPageId): Metadata {
  const { product } = PRODUCT_PAGES[id];
  return {
    title: { absolute: product.metaTitle },
    description: product.metaDescription,
    alternates: { canonical: product.path },
  };
}

/**
 * A plate-style page (3D, 4D, 5D, Bevel): the same sections in the same order
 * on every style, with the style's own copy and artwork from pageContent.ts.
 */
export default function ProductLanding({ id }: { id: ProductPageId }) {
  const page = PRODUCT_PAGES[id];
  const { product } = page;

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
                price: PRICES[id].single.toFixed(2),
                priceCurrency: "GBP",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}${product.path}`,
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: product.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
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
      <ProductHero product={product} nextFill="#f3f7fb" art={page.hero} />
      <Replacement page={page} />
      <FinishExplained page={page} />
      <SizesOptions page={page} />
      <LegalInfo page={page} />
      <HowToOrder page={page} />
      <Documents />
      <Delivery page={page} />
      <CareWarranty page={page} />
      <GuidesReviews page={page} />
      <FaqCta page={page} />
    </>
  );
}
