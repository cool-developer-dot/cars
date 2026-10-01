import Link from "next/link";
import { ArrowRight, SquareCheck, ExternalLink, SquareArrowOutUpRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { GOV_UK_DOCS_URL } from "@/lib/site";
import { DocCards } from "./Art";
import h from "./home.module.css";
import s from "./DocumentsNeeded.module.css";

const GROUPS = [
  {
    n: "01",
    title: "Proof of your name and address",
    text: "A driving licence; utility, Council Tax or rates bill or bank/building society statement from the last 6 months; or a national identity card. A passport or bank card proves your name only.",
    checks: [
      "Driving licence",
      "Utility or Council Tax bill",
      "Bank statement (last 6 months)",
      "National identity card",
    ],
    kind: "identity" as const,
  },
  {
    n: "02",
    title: "Proof you can use the registration",
    text: "Your V5C logbook or its green new-keeper slip, a V750 certificate of entitlement, a V778 retention certificate, a V11 tax reminder showing the registration, a V379 temporary registration certificate, a stamped V948 (physical authorisation) or an electronic eV948 confirmation, or a letter from a fleet or lease company quoting your V5C document reference number.",
    checks: ["V5C logbook", "V750 certificate", "V778 retention certificate", "V11 tax reminder"],
    kind: "vehicle" as const,
  },
];

export default function DocumentsNeeded() {
  return (
    <section
      id="documents"
      className={`${h.section} ${h.light} ${s.section}`}
      aria-labelledby="docs-title"
    >
      <div className={s.inner}>
        <Reveal className={s.head}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Documents you&rsquo;ll need</p>
          <h2 id="docs-title" className={s.title}>
            Documents <span className={h.accent}>you&rsquo;ll need.</span>
          </h2>
          <p className={s.sub}>
            Every registered supplier must see two things before making a plate.
          </p>
        </Reveal>

        <div className={s.grid}>
          {GROUPS.map((g, i) => (
            <Reveal key={g.n} index={i} className={s.card}>
              <div className={s.cardHead}>
                <span className={s.num} aria-hidden="true">
                  {g.n}
                </span>
                <div>
                  <h3 className={s.cardTitle}>{g.title}</h3>
                  <p className={s.cardText}>{g.text}</p>
                </div>
              </div>
              <div className={s.cardFoot}>
                <ul className={s.checks}>
                  {g.checks.map((c) => (
                    <li key={c}>
                      <SquareCheck aria-hidden="true" strokeWidth={2.2} />
                      {c}
                    </li>
                  ))}
                </ul>
                <DocCards kind={g.kind} className={s.art} />
              </div>
            </Reveal>
          ))}
        </div>

        <div className={s.foot}>
          <Reveal className={s.govCard}>
            <SquareArrowOutUpRight className={s.govIcon} strokeWidth={1.8} aria-hidden="true" />
            <p className={s.govText}>
              For the exact list and current guidance, see{" "}
              <a
                href={GOV_UK_DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={h.textLink}
              >
                GOV.UK: getting number plates made up
                <ExternalLink className={s.ext} aria-hidden="true" />
              </a>
              <br />
              Read more:{" "}
              <Link href="/faqs#documents" className={h.textLink}>
                documents needed to buy number plates.
              </Link>
            </p>
          </Reveal>
          <Reveal index={1} className={s.btnWrap}>
            <Link href="/faqs#documents" className={s.fullBtn}>
              Full documents list
              <ArrowRight size={20} strokeWidth={2.4} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Into Legal compliance (dark) */}
      <NeonEdge fill="#06111f" light />
    </section>
  );
}
