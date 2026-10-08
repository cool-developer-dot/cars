import type { Metadata } from "next";
import JsonLd from "@/components/content/JsonLd";
import { COMPANY, SITE_URL } from "@/lib/site";

/** Title, description, canonical URL and social cards for an essential page */
export function infoMetadata({
  title,
  description,
  path,
  image = "/og/default.jpg",
  index = true,
}: {
  /** The full <title>, e.g. "Delivery and Dispatch | ReplacementPlates" */
  title: string;
  description: string;
  path: string;
  /** 1200 × 630 social card in /public/og */
  image?: string;
  /** false keeps the page out of search results (and the sitemap) */
  index?: boolean;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: { index, follow: true },
    openGraph: {
      type: "website",
      siteName: COMPANY.brand,
      locale: "en_GB",
      url: path,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** WebPage + breadcrumb structured data, plus any page-specific nodes */
export function InfoJsonLd({ name, path, extra = [] }: { name: string; path: string; extra?: object[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            name,
            url: `${SITE_URL}${path}`,
            isPartOf: { "@type": "WebSite", name: COMPANY.brand, url: SITE_URL },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name, item: `${SITE_URL}${path}` },
            ],
          },
          ...extra,
        ],
      }}
    />
  );
}
