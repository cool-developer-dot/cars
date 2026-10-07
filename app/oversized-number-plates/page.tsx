import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("oversized");

export default function Page() {
  return <ProductLanding id="oversized" />;
}
