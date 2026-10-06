import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("5d");

export default function Page() {
  return <ProductLanding id="5d" />;
}
