import Link from "next/link";
import { CaseSensitive, FileText, Layers, ShieldCheck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import HeroPhoto from "@/components/HeroPhoto";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "./home.module.css";
import s from "./LegalCompliance.module.css";

const TILES = [
  { Icon: CaseSensitive, title: "Charles Wright characters", text: "Correct typeface and spacing" },
  { Icon: Layers, title: "Reflective background", text: "White front, yellow rear" },
  { Icon: ShieldCheck, title: "Solid black characters", text: "Non-reflective finish" },
  { Icon: FileText, title: "Supplier ID & BS marking", text: "As required by law" },
];

export default function LegalCompliance() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="legal-title">
      <div className={s.photoBox} aria-hidden="true">
        <HeroPhoto className={s.photo} />
      </div>

      <div className={s.grid}>
        <Reveal className={s.copy}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Legal compliance</p>
          <h2 id="legal-title" className={s.title}>
            Plates made to the
            <br />
            <span className={h.accent}>legal requirements.</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Every plate we make is produced to the legal requirements for number
            plates: the correct Charles Wright characters, correct spacing, the right
            reflective background (white front, yellow rear), solid black
            non-reflective characters, and the required supplier identification and
            British Standard marking.
          </p>
          <p className={`${h.lead} ${s.lead}`}>
            These rules cover how a plate must be made and displayed. They&rsquo;re
            separate from what a DVSA MOT tester checks — the MOT inspection looks at
            things like whether characters are correctly formed, evenly spaced,
            secure and not obscured; it does not check for the supplier&rsquo;s name,
            postcode or BS number on the plate. A correctly made plate can still fail
            an MOT if it&rsquo;s damaged, dirty, insecurely fitted or otherwise not
            properly displayed — meeting the legal requirements and passing an MOT
            are related but not the same thing.
          </p>
          <p className={`${h.lead} ${s.lead}`}>
            Our Standard, 3D, 4D, 5D and Bevel styles are made to these requirements.
            Ghost&rsquo;s specific construction and compliance information is being
            finalised — see the{" "}
            <Link href="/plate-styles#ghost">Ghost product page</Link> for its current
            status before ordering that style.
          </p>
        </Reveal>

        <ul className={s.tiles}>
          {TILES.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} index={i} className={`${h.liquid} ${s.tile}`}>
              <span className={`${h.iconBlue} ${s.tileIcon}`} aria-hidden="true">
                <Icon strokeWidth={2} />
              </span>
              <h3 className={s.tileTitle}>{title}</h3>
              <p className={s.tileText}>{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>

      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
