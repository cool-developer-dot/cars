import type { ReactNode } from "react";
import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import h from "@/components/home/home.module.css";
import p from "@/components/productPage/page.module.css";
import { builderUrl } from "@/lib/builderLink";
import { COMPANY } from "@/lib/site";
import { Button } from "./blocks";
import { EDGE_FILL, noOrphan } from "./shared";
import s from "./info.module.css";

const TRUST = [
  { Icon: Truck, title: "Fast Dispatch", text: "Order before 2pm" },
  { Icon: ShieldCheck, title: "DVLA Registered", text: `RNPS ${COMPANY.rnps}` },
  { Icon: CreditCard, title: "Secure Checkout", text: "SSL Encrypted" },
] as const;

/**
 * The last section of an essential page, above the footer: the plate-style
 * pages' closing call to action (dark, the plate render bleeding off the
 * right), with a page's own heading and an optional second button.
 */
export default function ClosingCta({
  eyebrow = "Ready to order",
  title = ["Build Your", "Number Plates"],
  lead = "Enter your registration, choose your options, and preview your plates before you buy.",
  secondary,
}: {
  eyebrow?: string;
  title?: [string, string];
  lead?: ReactNode;
  /** A second, outlined button (e.g. Contact us) */
  secondary?: { href: string; label: string };
}) {
  return (
    <section className={`${h.section} ${h.dark} ${s.section} ${s.dark} ${s.cta}`} aria-labelledby="closing-title">
      <div className={s.ctaPlate} aria-hidden="true">
        <picture>
          <source media="(min-width: 1024px)" srcSet="/3d/cta-plate.webp" />
          <img src="/3d/cta-plate-mobile.webp" alt="" width={680} height={373} loading="lazy" decoding="async" />
        </picture>
      </div>

      <div className={`${p.wrap} ${s.ctaInner}`}>
        <div className={s.ctaCopy}>
          <Rise className={s.ctaHead}>
            <p className={h.eyebrow}>{eyebrow}</p>
            <h2 id="closing-title" className={`${h.title} ${s.title}`}>
              {title[0]} <span className={h.accent}>{noOrphan(title[1])}</span>
            </h2>
            <div className={`${h.lead} ${s.ctaLead}`}>{lead}</div>
          </Rise>

          <Rise index={1} className={s.ctaActions}>
            <div className={s.ctaButtons}>
              <Button href={builderUrl()}>Build My Plates</Button>
              {secondary && (
                <Button href={secondary.href} ghost>
                  {secondary.label}
                </Button>
              )}
            </div>

            <ul className={s.trust}>
              {TRUST.map(({ Icon, title: t, text }) => (
                <li key={t} className={s.point}>
                  <Icon className={s.pointIcon} strokeWidth={1.7} aria-hidden="true" />
                  <span className={s.pointCopy}>
                    <span className={s.pointTitle}>{t}</span>
                    <span className={s.pointText}>{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Rise>
        </div>
      </div>

      <NeonEdge fill={EDGE_FILL.footer} />
    </section>
  );
}
