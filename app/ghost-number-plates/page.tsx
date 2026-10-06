import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("ghost");

export default function Page() {
  return <ProductLanding id="ghost" />;
}
