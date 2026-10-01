import { MapPin, ShieldCheck, Truck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { COMPANY } from "@/lib/site";
import PlateArt from "./PlateArt";
import h from "./home.module.css";
import s from "./Supplier.module.css";

const POINTS = [
  { Icon: ShieldCheck, title: "DVLA-registered supplier", text: `(RNPS ${COMPANY.rnps})` },
  { Icon: Truck, title: "UK-wide", text: "delivery" },
  { Icon: MapPin, title: "Collection available", text: "in Ilford" },
];

/** `next` is the colour the following section starts on */
export default function Supplier({ next }: { next: string }) {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="supplier-title">
      <div className={s.workshop} aria-hidden="true" />

      <div className={`${h.container} ${s.inner} ${s.grid}`}>
        <Reveal>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Our supplier</p>
          <h2 id="supplier-title" className={s.title}>
            A <span className={s.nowrap}>DVLA-registered</span>{" "}
            <span className={h.accent}>supplier.</span>
          </h2>
          <p className={s.lead}>
            {COMPANY.legalName} is registered with the DVLA as a number plate
            supplier (RNPS {COMPANY.rnps}). {COMPANY.platesSold} plates sold since{" "}
            {COMPANY.platesSoldSince}.
          </p>
          <ul className={s.points}>
            {POINTS.map(({ Icon, title, text }) => (
              <li key={title} className={s.point}>
                <span className={s.pointIcon} aria-hidden="true">
                  <Icon strokeWidth={2} />
                </span>
                <span>
                  <strong>{title}</strong> {text}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal index={1} className={s.plates}>
          <span className={s.glow} aria-hidden="true" />
          <span className={s.bench} aria-hidden="true" />
          <PlateArt className={s.front} face="white" finish="gel" />
          <PlateArt className={s.rear} face="yellow" finish="gel" />
        </Reveal>
      </div>

      <NeonEdge fill={next} />
    </section>
  );
}
