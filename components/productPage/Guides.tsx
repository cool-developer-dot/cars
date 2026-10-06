import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { GuideDocIcon, GuideLayersIcon, GuideScalesIcon } from "./guideIcons";
import type { ProductPageContent } from "./pageContent";
import s from "./Guides.module.css";
import p from "./page.module.css";

// There are no standalone guide pages yet: each card points at the page that
// answers it today (see pageContent.ts).
const ICONS = [GuideDocIcon, GuideLayersIcon, GuideScalesIcon];


export default function Guides({ page }: { page: ProductPageContent }) {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="guides-title">
      <div className={p.wrap}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={h.eyebrow}>Guides</p>
          <h2 id="guides-title" className={`${h.title} ${s.title}`}>
            Helpful Guides and <span className={h.accent}>Information</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Answering the most common questions and helping you choose the right number plate for
            your vehicle.
          </p>
        </Reveal>

        <ul className={s.cards}>
          {page.guides.map(({ id, lines, lines2, href }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal as="li" key={id} index={i} className={s.item}>
                <Link href={href} className={`${h.liquid} ${s.card}`}>
                  <span className={s.tile} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={s.cardTitle}>
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </h3>
                  <p className={s.cardText}>
                    {lines2[0]}
                    <br className={s.brText} /> {lines2[1]}
                  </p>
                  <span className={s.go} aria-hidden="true">
                    <ArrowRight strokeWidth={2.2} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {/* Into the FAQs (light) */}
      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
