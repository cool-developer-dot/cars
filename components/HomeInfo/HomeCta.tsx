import { CtaBand } from "@/components/content/blocks";
import c from "@/components/content/content.module.css";

/** Closing call to action, between the FAQs and the footer */
export default function HomeCta() {
  return (
    <section className={`${c.theme}`} style={{ background: "#040c16", padding: "8px 0 72px" }}>
      <div className={c.container}>
        <CtaBand />
      </div>
    </section>
  );
}
