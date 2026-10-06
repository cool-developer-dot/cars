import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { GuideDocIcon, GuideLayersIcon, GuideScalesIcon } from "./guideIcons";
import s from "./Guides3D.module.css";
import p from "./page3d.module.css";

// There are no standalone guide pages yet: each card points at the page that
// answers it today.
const GUIDES = [
  {
    id: "legal",
    Icon: GuideDocIcon,
    lines: ["Are 3D Gel", "Number Plates Legal?"],
    lines2: ["Rules, requirements", "and what to know."],
    href: "/faqs#legal",
  },
  {
    id: "3d-4d",
    Icon: GuideLayersIcon,
    lines: ["3D vs 4D", "Number Plates"],
    lines2: ["Key differences", "and which to choose."],
    href: "/4d-number-plates",
  },
  {
    id: "styles",
    Icon: GuideScalesIcon,
    lines: ["Standard vs 3D vs", "4D vs 5D Plates"],
    lines2: ["Compare styles,", "looks and features."],
    href: "/plate-styles",
  },
] as const;

export default function Guides3D() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="guides3d-title">
      <div className={p.wrap}>
        <div className={s.top}>
          <Reveal className={`${h.head} ${s.head}`}>
            <p className={h.eyebrow}>Guides</p>
            <h2 id="guides3d-title" className={`${h.title} ${s.title}`}>
              Helpful Guides and <span className={h.accent}>Information</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              Answering the most common questions and helping you choose the right
              <br className={s.brWide} /> number plate for your vehicle.
            </p>
          </Reveal>

          {/* Two plates on a wet bumper: a banner on phones, bleeding off the right on desktop */}
          <div className={s.photo} aria-hidden="true">
            <picture>
              <source media="(min-width: 900px)" srcSet="/3d/guides-plates.webp" />
              <img
                src="/3d/guides-plates-mobile.webp"
                alt=""
                width={1100}
                height={640}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>

        <ul className={s.cards}>
          {GUIDES.map(({ id, Icon, lines, lines2, href }, i) => (
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
          ))}
        </ul>
      </div>

      {/* Into the FAQs (light) */}
      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
