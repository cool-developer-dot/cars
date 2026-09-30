import type { Metadata } from "next";
import ProductPage from "@/components/content/ProductPage";
import { PRODUCTS } from "@/lib/products";

const product = PRODUCTS["bevel"];

export const metadata: Metadata = {
  title: { absolute: product.metaTitle },
  description: product.metaDescription,
  alternates: { canonical: product.path },
};

export default function Page() {
  return <ProductPage product={product} />;
}
