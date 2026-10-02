import { redirect } from "next/navigation";
import { builderUrl } from "@/lib/builderLink";

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

/** The client's old builder URL: /custom-plates/{registration}/{style} → the homepage builder */
export default async function Page({
  params,
}: PageProps<"/custom-plates/[registration]/[numberplate]">) {
  const { registration, numberplate } = await params;
  redirect(builderUrl({ reg: readReg(registration), style: numberplate }));
}
