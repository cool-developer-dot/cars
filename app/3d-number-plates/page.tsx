import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("3d");

export default function Page() {
  return <ProductLanding id="3d" />;
}
