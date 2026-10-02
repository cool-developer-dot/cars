import { redirect } from "next/navigation";
import { builderUrl } from "@/lib/builderLink";

/**
 * The site has one plate builder, on the homepage. Old /build links (and the
 * basket's "Edit plates") land there with their settings carried over.
 */
export default async function Page({ searchParams }: PageProps<"/build">) {
  const q = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const amount = one(q.amount);
  redirect(
    builderUrl({
      reg: one(q.reg),
      style: one(q.style),
      amount: amount === "front" || amount === "rear" || amount === "both" ? amount : undefined,
      edit: one(q.edit) === "1",
    }),
  );
}
