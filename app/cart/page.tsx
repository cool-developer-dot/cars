import type { Metadata } from "next";
import Basket from "@/components/Basket/Basket";

export const metadata: Metadata = {
  title: "My Basket",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Basket />;
}
