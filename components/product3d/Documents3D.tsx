import Link from "next/link";
import { ArrowRight, CircleCheck, ExternalLink, SquareArrowOutUpRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import GlassEdge from "./GlassEdge";
import h from "@/components/home/home.module.css";
import { GOV_UK_DOCS_URL } from "@/lib/site";
import { IdDocIcon, VehicleDocIcon } from "./orderIcons";
import s from "./Documents3D.module.css";

const GROUPS = [
  {
    id: "identity",
    Icon: IdDocIcon,
    title: "Proof of Your Name and Address",
    text: "Driving licence; utility, Council Tax or rates bill or bank/building society statement from the last 6 months; or national identity card. A passport or bank card proves your name only.",
    checks: [
      "Driving Licence",
      "Utility Bill",
      "Council Tax Bill",
      "Bank Statement",
      "National Identity Card",
    ],
  },
  {
    id: "entitlement",
    Icon: VehicleDocIcon,
    title: "Proof You Can Use the Registration",
    text: "Your V5C logbook or its green new-keeper slip, a V750 certificate of entitlement, a V778 retention certificate, a V11 tax reminder showing the registration, a V379 temporary registration certificate, a stamped V948 (physical authorisation) or an electronic eV948 confirmation, or a letter from a fleet or lease company quoting your V5C document reference number.",
    checks: [],
  },
] as const;

export default function Documents3D() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="docs3d-title">
      {/* From "How to order" (light) */}
      <GlassEdge fill="#eef3f9" />

      <div className={`${h.container} ${s.wide}`}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Documents</p>
          <h2 id="docs3d-title" className={`${h.title} ${s.title}`}>
            Identity and <span className={`${h.accent} ${s.line}`}>Registration Documents</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            To order number plates, we need to verify your identity and that you&rsquo;re entitled
            <br className={s.brWide} /> to use the registration number. You can provide the following
            documents.
          </p>
        </Reveal>

        <div className={s.grid}>
          {GROUPS.map(({ id, Icon, title, text, checks }, i) => (
            <Reveal key={id} index={i} className={`${h.liquid} ${s.card} ${checks.length === 0 ? s.plain : ""}`}>
              <span className={s.tile} aria-hidden="true">
                <Icon />
              </span>
              <h3 className={s.cardTitle}>{title}</h3>
              <p className={s.cardText}>{text}</p>
              {checks.length > 0 && (
                <ul className={s.chips}>
                  {checks.map((c) => (
                    <li key={c} className={s.chip}>
                      <CircleCheck aria-hidden="true" strokeWidth={2.4} />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal index={2} className={`${h.liquid} ${s.bar}`}>
          <span className={s.tile} aria-hidden="true">
            <SquareArrowOutUpRight strokeWidth={1.9} />
          </span>
          <p className={s.barText}>
            For the exact list and current guidance, see{" "}
            <a href={GOV_UK_DOCS_URL} target="_blank" rel="noopener noreferrer" className={s.link}>
              GOV.UK: getting number plates made up.
            </a>
            <br />
            Read more:{" "}
            <Link href="/faqs#documents" className={s.link}>
              documents needed to buy number plates.
            </Link>
          </p>
          <Link href="/faqs#documents" className={s.btn}>
            <ExternalLink aria-hidden="true" strokeWidth={2} />
            Full Documents List
            <ArrowRight aria-hidden="true" strokeWidth={2.2} />
          </Link>
        </Reveal>
      </div>

      {/* Into "Delivery and collection" (light) */}
      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
