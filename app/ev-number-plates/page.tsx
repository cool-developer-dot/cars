import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("ev");

export default function Page() {
  return <ProductLanding id="ev" />;
}
