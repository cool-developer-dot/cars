import type { Metadata } from "next";
import { PlateBuilder } from "@/components/BuildYourPlate/BuildYourPlate";
import { parseStyle } from "@/components/BuildYourPlate/buildConfig";
import { FROM_PRICE, gbp } from "@/lib/site";

export const metadata: Metadata = {
  title: "Build Your Number Plates",
  description: `Design road-legal or show number plates online and see every change live — Standard, 3D gel, 4D, 5D, Bevel and Ghost, from ${gbp(FROM_PRICE)} per plate.`,
  alternates: { canonical: "/build" },
};

export default async function Page({ searchParams }: PageProps<"/build">) {
  const q = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const reg = one(q.reg);
  const style = parseStyle(one(q.style));

  return (
    <PlateBuilder
      variant="page"
      editFromBasket={one(q.edit) === "1"}
      initial={{
        reg: reg ?? "",
        ...(style ? { styleId: style } : {}),
      }}
    />
  );
}
