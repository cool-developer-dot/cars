import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleCheck,
  ExternalLink,
  IdCard,
  Info,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
  FileCheck2,
} from "lucide-react";
import {
  COMPANY,
  CONTACT,
  DELIVERY,
  DOCUMENTS,
  GOV_UK_DOCS_URL,
  LEGAL_POINTS,
  PRICES,
  gbp,
  pairPrice,
  type StyleId,
} from "@/lib/site";
import Reveal from "./Reveal";
import RegCta from "./RegCta";
import c from "./content.module.css";

export function SectionHead({
  eyebrow,
  title,
  sub,
  center = false,
  sticky = false,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  /** Stick beside a long sibling column (e.g. an FAQ list) */
  sticky?: boolean;
  id?: string;
}) {
  return (
    <Reveal
      className={`${c.head} ${center ? c.headCenter : ""} ${sticky ? c.sticky : ""}`}
    >
      {eyebrow && <p className={c.eyebrow}>{eyebrow}</p>}
      <h2 id={id} className={c.h2}>
        {title}
      </h2>
      {sub && <p className={c.sub}>{sub}</p>}
    </Reveal>
  );
}

export function TrustChips() {
  return (
    <ul className={c.chips}>
      <li className={c.chip}>
        <ShieldCheck aria-hidden="true" />
        DVLA-registered supplier (RNPS {COMPANY.rnps})
      </li>
      <li className={c.chip}>
        <Truck aria-hidden="true" />
        Royal Mail delivery
      </li>
      <li className={c.chip}>
        <MapPin aria-hidden="true" />
        Ilford collection available
      </li>
    </ul>
  );
}

/** Proof of identity + entitlement lists */
export function DocumentsBlock() {
  const { identity, entitlement } = DOCUMENTS;
  return (
    <>
      <ul className={c.grid2}>
        <Reveal as="li" index={0}>
          <div className={c.card}>
            <span className={c.cardIcon} aria-hidden="true">
              <IdCard />
            </span>
            <h3 className={c.cardTitle}>{identity.title}</h3>
            <ul className={c.checks}>
              {identity.items.map((d) => (
                <li key={d}>
                  <CircleCheck aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
            <p className={c.note}>
              <Info aria-hidden="true" />
              {identity.note}
            </p>
          </div>
        </Reveal>
        <Reveal as="li" index={1}>
          <div className={c.card}>
            <span className={c.cardIcon} aria-hidden="true">
              <FileCheck2 />
            </span>
            <h3 className={c.cardTitle}>{entitlement.title}</h3>
            <ul className={c.checks}>
              {entitlement.items.map((d) => (
                <li key={d}>
                  <CircleCheck aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </ul>
      <p className={c.note}>
        <Info aria-hidden="true" />
        <span>
          For the exact list and current guidance, see{" "}
          <a
            href={GOV_UK_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={c.textLink}
          >
            GOV.UK: getting number plates made up
            <ExternalLink aria-hidden="true" />
          </a>
        </span>
      </p>
    </>
  );
}

/** Royal Mail delivery + Ilford collection cards */
export function DeliveryBlock() {
  return (
    <ul className={c.grid2}>
      <Reveal as="li" index={0}>
        <div className={c.card}>
          <span className={c.cardIcon} aria-hidden="true">
            <Truck />
          </span>
          <h3 className={c.cardTitle}>Royal Mail delivery</h3>
          <ul className={c.checks}>
            <li>
              <CircleCheck aria-hidden="true" />
              <span>
                First Class: <strong>£3</strong> on orders under £15,{" "}
                <strong>free</strong> on orders of £15 or more
              </span>
            </li>
            <li>
              <CircleCheck aria-hidden="true" />
              <span>
                Tracked 24 upgrade: <strong>+£2</strong>
              </span>
            </li>
            <li>
              <CircleCheck aria-hidden="true" />
              <span>
                Order before <strong>2pm Mon–Fri</strong> — once your documents
                and order are checked, we aim to dispatch the same day
              </span>
            </li>
          </ul>
          <p className={c.note}>
            <Info aria-hidden="true" />
            <span>
              {DELIVERY.aims} {DELIVERY.friday}
            </span>
          </p>
        </div>
      </Reveal>
      <Reveal as="li" index={1}>
        <div className={`${c.card} ${c.cardGlow} ${c.anchor}`} id="collection">
          <span className={c.cardIcon} aria-hidden="true">
            <MapPin />
          </span>
          <h3 className={c.cardTitle}>Collect from Ilford</h3>
          <p className={c.cardText}>
            Collection point: <strong>{COMPANY.collection}</strong>. Ready within
            3 hours — contact us via WhatsApp to confirm same-day collection,
            and please confirm before travelling.
          </p>
          <p className={c.cardText}>{DELIVERY.noBranches}</p>
          <p style={{ marginTop: 20 }}>
            <a
              href={CONTACT.whatsappHref}
              className={c.btn}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp {CONTACT.whatsapp}
            </a>
          </p>
        </div>
      </Reveal>
    </ul>
  );
}

/** Legal requirements checklist + MOT distinction */
export function LegalBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div className={c.grid2}>
      <Reveal index={0}>
        <div className={c.card}>
          <span className={c.cardIcon} aria-hidden="true">
            <BadgeCheck />
          </span>
          <h3 className={c.cardTitle}>What every road-use plate needs</h3>
          <ul className={c.checks}>
            {LEGAL_POINTS.map((p) => (
              <li key={p}>
                <CircleCheck aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal index={1}>
        <div className={`${c.card} ${c.prose}`}>
          <h3 className={c.cardTitle}>Legal requirements vs the MOT</h3>
          <p>
            These rules cover how a plate must be made and displayed. They&rsquo;re
            separate from what a DVSA MOT tester checks — the MOT looks at
            whether characters are correctly formed, evenly spaced, secure and
            not obscured; it does not check for the supplier&rsquo;s name,
            postcode or BS number on the plate.
          </p>
          {!compact && (
            <p>
              A correctly made plate can still fail an MOT if it&rsquo;s damaged,
              dirty, insecurely fitted or otherwise not properly displayed —
              meeting the legal requirements and passing an MOT are related but
              not the same thing.
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

/** Full style/price matrix */
export function PriceTable({ highlight }: { highlight?: StyleId }) {
  const ids = Object.keys(PRICES) as StyleId[];
  return (
    <Reveal>
      <div className={c.tableWrap}>
        <table className={c.table}>
          <thead>
            <tr>
              <th scope="col">Style</th>
              <th scope="col">What it is</th>
              <th scope="col" className={c.num}>
                From (1 plate)
              </th>
              <th scope="col" className={c.num}>
                Pair (front + rear)
              </th>
            </tr>
          </thead>
          <tbody>
            {ids.map((id) => {
              const p = PRICES[id];
              const hl = id === highlight ? c.hl : "";
              return (
                <tr key={id} id={id} className={c.anchor}>
                  <th scope="row" className={hl}>
                    <Link href={p.href}>{p.name}</Link>
                  </th>
                  <td className={hl}>{p.what}</td>
                  <td className={`${c.num} ${hl}`}>{gbp(p.single)}</td>
                  <td className={`${c.num} ${hl}`}>{gbp(pairPrice(id))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

export function CtaBand({
  title = "Order your number plates today",
  sub = "Enter your registration to preview your plates and see the price before you buy.",
  style,
}: {
  title?: string;
  sub?: string;
  style?: string;
}) {
  return (
    <Reveal>
      <div className={c.cta}>
        <h2 className={c.h2}>{title}</h2>
        <p className={c.sub}>{sub}</p>
        <RegCta style={style} />
      </div>
    </Reveal>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={c.textLink}>
      {children}
      <ArrowRight aria-hidden="true" />
    </Link>
  );
}
