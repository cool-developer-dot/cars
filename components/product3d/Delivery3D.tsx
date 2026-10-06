import { ArrowRight, CalendarDays, Package, Shield } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { COMPANY, CONTACT, DELIVERY_FEES } from "@/lib/site";
import { MapStreets, PinGlyph, RoyalMailMark, WhatsAppIcon } from "./deliveryIcons";
import s from "./Delivery3D.module.css";
import p from "./page3d.module.css";

const { freeFrom, tracked } = DELIVERY_FEES;
const [street, ...town] = COMPANY.collection.split(", ");
const townLine = town.join(", ");

/** A fact chip: icon tile and one or two lines; `strong` makes the second line bold */
type Fact = { Icon: typeof Package; lines: readonly string[]; strong?: boolean };

const COURIERS: {
  id: string;
  title: string;
  text: string;
  tracked?: boolean;
  facts: readonly Fact[];
}[] = [
  {
    id: "first",
    title: "Royal Mail First Class",
    text: "Standard delivery with Royal Mail’s next-working-day aim (including Saturday).",
    facts: [
      { Icon: Package, lines: ["Standard", `(Free over £${freeFrom})`] },
      { Icon: CalendarDays, lines: ["Next-working-day", "aim (Mon–Sat)"] },
    ],
  },
  {
    id: "tracked",
    title: "Royal Mail Tracked 24",
    text: `Add Royal Mail Tracked 24 for £${tracked} at checkout for extra peace of mind.`,
    tracked: true,
    facts: [
      { Icon: Shield, lines: ["Tracked 24", `(+£${tracked})`], strong: true },
      { Icon: Package, lines: ["Order before 2pm", "(Mon–Fri)"], strong: true },
    ],
  },
];

export default function Delivery3D() {
  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="delivery3d-title">
      <div className={p.wrap}>
        <Reveal className={`${h.head} ${s.head}`}>
          <p className={h.eyebrow}>Delivery and collection</p>
          <h2 id="delivery3d-title" className={`${h.title} ${s.title}`}>
            3D Number Plate <span className={`${h.accent} ${s.line}`}>Delivery and Ilford Collection</span>
          </h2>
          <p className={`${h.lead} ${s.lead}`}>
            Royal Mail First Class is standard, with Royal Mail&rsquo;s next-working-day aim
            (including Saturday). Add Royal Mail Tracked 24 for &pound;{tracked} at checkout. Order
            before 2pm Monday to Friday and, once your documents are checked, we aim to dispatch the
            same day.
          </p>
        </Reveal>

        <div className={s.grid}>
          {COURIERS.map((c, i) => (
            <Reveal key={c.id} index={i} className={`${h.glassLight} ${s.card}`}>
              <div className={s.top}>
                <span className={s.logoTile} aria-hidden="true">
                  <RoyalMailMark className={s.mark} />
                  {c.tracked && <span className={s.trackedTag}>Tracked 24</span>}
                </span>
                <div className={s.copy}>
                  <h3 className={s.cardTitle}>{c.title}</h3>
                  <p className={s.cardText}>{c.text}</p>
                </div>
              </div>
              <ul className={s.facts}>
                {c.facts.map(({ Icon, lines, strong }) => (
                  <li key={lines.join(" ")} className={s.fact}>
                    <span className={s.factIcon} aria-hidden="true">
                      <Icon strokeWidth={1.8} />
                    </span>
                    <span className={s.factText}>
                      {lines.map((line, n) => (
                        <span key={line}>
                          {n > 0 && <br className={s.brFact} />}
                          {n > 0 && " "}
                          <span className={strong && n > 0 ? s.factStrong : undefined}>{line}</span>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}

          <span className={s.rule} aria-hidden="true" />

          <Reveal index={2} className={`${h.glassLight} ${s.card} ${s.collect}`}>
            <span className={s.map} aria-hidden="true">
              <MapStreets className={s.streets} />
              <span className={s.marker}>
                <PinGlyph className={s.pin} />
                <span className={s.mapLabel}>
                  <span className={s.mapName}>{street}</span>
                  <span className={s.mapTown}>{townLine}</span>
                </span>
              </span>
            </span>

            <div className={s.top}>
              <span className={`${s.logoTile} ${s.pinTile}`} aria-hidden="true">
                <svg viewBox="0 0 40 52" className={s.tilePin}>
                  <path
                    d="M20 3C11.2 3 4 10 4 18.7c0 11.5 13.4 26.4 15.3 28.4a1 1 0 0 0 1.4 0C22.6 45.1 36 30.2 36 18.7 36 10 28.8 3 20 3z"
                    fill="none"
                    stroke="#1668e3"
                    strokeWidth="5"
                  />
                  <circle cx="20" cy="18.6" r="5.2" fill="none" stroke="#1668e3" strokeWidth="4.4" />
                </svg>
              </span>
              <div className={s.copy}>
                <h3 className={s.cardTitle}>Ilford Collection</h3>
                <p className={s.cardText}>
                  Collect from {street}, {townLine}.
                </p>
              </div>
            </div>

            <p className={`${s.cardText} ${s.waText}`}>
              Message us on WhatsApp to confirm same-day availability before you travel.
            </p>
            <a
              href={CONTACT.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={s.waBtn}
            >
              <WhatsAppIcon />
              Message on WhatsApp
              <ArrowRight strokeWidth={2.2} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Into "Care and support" (dark) */}
      <NeonEdge fill="#06111f" light />
    </section>
  );
}
