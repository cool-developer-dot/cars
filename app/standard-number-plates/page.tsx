import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("standard");

export default function Page() {
  return <ProductLanding id="standard" />;
}
