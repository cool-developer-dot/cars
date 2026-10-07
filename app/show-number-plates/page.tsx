import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("show");

export default function Page() {
  return <ProductLanding id="show" />;
}
