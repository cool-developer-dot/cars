import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("bevel");

export default function Page() {
  return <ProductLanding id="bevel" />;
}
