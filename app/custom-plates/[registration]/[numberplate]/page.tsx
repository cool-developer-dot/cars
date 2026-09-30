import type { Metadata } from "next";
import { PlateBuilder } from "@/components/BuildYourPlate/BuildYourPlate";
import { parseStyle } from "@/components/BuildYourPlate/buildConfig";

// One page per registration would be endless thin content: keep these out
// of search and point them at the main builder.
export const metadata: Metadata = {
  title: "Build Your Number Plates",
  alternates: { canonical: "/build" },
  robots: { index: false, follow: true },
};

const readReg = (raw: string) => {
  let reg = raw;
  try {
    reg = decodeURIComponent(raw);
  } catch {
    // leave as-is
  }
  reg = reg.trim();
  return reg && reg !== "undefined" && reg.toUpperCase() !== "YOUR REG" ? reg : "";
};

/** The client's builder URL: /custom-plates/{registration}/{style} */
export default async function Page({
  params,
}: PageProps<"/custom-plates/[registration]/[numberplate]">) {
  const { registration, numberplate } = await params;
  const style = parseStyle(numberplate);

  return (
    <PlateBuilder
      variant="page"
      initial={{ reg: readReg(registration), ...(style ? { styleId: style } : {}) }}
    />
  );
}
