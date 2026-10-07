import ProductLanding, { productMetadata } from "@/components/productPage/ProductLanding";

export const metadata = productMetadata("short");

export default function Page() {
  return <ProductLanding id="short" />;
}
