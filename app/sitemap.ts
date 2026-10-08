import type { MetadataRoute } from "next";

import { SITE_URL as BASE } from "@/lib/site";

const ROUTES = [
  "",
  "/plate-styles",
  "/standard-number-plates",
  "/3d-number-plates",
  "/4d-number-plates",
  "/5d-number-plates",
  "/ghost-number-plates",
  "/bevel-number-plates",
  "/short-number-plates",
  "/oversized-number-plates",
  "/show-number-plates",
  "/ev-number-plates",
  "/prices",
  "/how-it-works",
  "/documents-you-need",
  "/legal-number-plates",
  "/delivery",
  "/areas-we-cover",
  "/faqs",
  "/about",
  "/contact",
  "/returns",
  "/warranty",
  "/terms",
  "/privacy",
  "/cookies",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${BASE}${route}` }));
}
