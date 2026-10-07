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
  "/faqs",
  "/delivery-collection",
  "/about",
  "/contact",
  "/returns",
  "/terms",
  "/privacy",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({ url: `${BASE}${route}` }));
}
