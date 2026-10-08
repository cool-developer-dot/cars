import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import { EDGE_FILL, noOrphan, type Fact, type Tone } from "./shared";
import s from "./InfoHero.module.css";
import i from "./info.module.css";

export type HeroArt = {
  src: string;
  /** A lighter crop for phones and tablets */
  srcMobile?: string;
  width: number;
  height: number;
  alt: string;
  /** object-position for the crop, e.g. "60% 50%" */
  position?: string;
};

/**
 * The opening of an essential page (About, Delivery, Terms…): the plate-style
 * pages' night scene and type, without their builder. Copy on the left; on
 * the right either a rendered plate photo feathered into the scene, or an
 * `aside` card (contact channels, a checklist). An optional row of key facts
 * runs underneath. Ends with the site's neon edge into the first section.
 */
export default function InfoHero({
  crumb,
  eyebrow,
  title,
  lead,
  art,
  aside,
  facts,
  actions,
  updated,
  next = "light",
}: {
  /** This page's name in the breadcrumb trail */
  crumb: string;
  eyebrow: string;
  /** [plain, highlighted]: the highlighted half is drawn in the site's blue */
  title: [string, string];
  lead: ReactNode;
  art?: HeroArt;
  aside?: ReactNode;
  facts?: Fact[];
  actions?: ReactNode;
  /** "Last updated" date for policies */
  updated?: string;
  /** Colour of the first section below */
  next?: Tone;
}) {
  const side = art ? s.withArt : aside ? s.withAside : s.plain;
  return (
    <section className={`${s.hero} ${side}`} aria-labelledby="info-hero-title">
      <div className={s.bg} aria-hidden="true" />
      <div className={s.scrim} aria-hidden="true" />

      <div className={s.inner}>
        <Rise className={s.copy}>
          <nav aria-label="Breadcrumb">
            <ol className={s.crumbs}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">{crumb}</li>
            </ol>
          </nav>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h1 id="info-hero-title" className={s.title}>
            {title[0]} <span className={s.accent}>{noOrphan(title[1])}</span>
          </h1>
          <div className={s.lead}>{lead}</div>
          {updated && <p className={s.updated}>Last updated: {updated}</p>}
          {actions && <div className={s.actions}>{actions}</div>}
        </Rise>

        {art && (
          <div className={s.art} style={{ "--ar": `${art.width} / ${art.height}` } as CSSProperties}>
            <picture>
              {art.srcMobile && <source media="(max-width: 899px)" srcSet={art.srcMobile} />}
              <img
                src={art.src}
                alt={art.alt}
                width={art.width}
                height={art.height}
                fetchPriority="high"
                decoding="async"
                style={art.position ? { objectPosition: art.position } : undefined}
              />
            </picture>
          </div>
        )}

        {aside && (
          <Rise index={1} className={`${s.aside} ${i.dark}`}>
            {aside}
          </Rise>
        )}

        {facts && (
          <ul className={s.facts}>
            {facts.map(({ Icon, title: t, text }, i) => (
              <Rise as="li" key={t} index={i + 1} className={s.fact}>
                <span className={s.factIcon} aria-hidden="true">
                  <Icon strokeWidth={1.9} />
                </span>
                <span className={s.factText}>
                  <strong>{t}</strong>
                  <span>{text}</span>
                </span>
              </Rise>
            ))}
          </ul>
        )}
      </div>

      <NeonEdge fill={EDGE_FILL[next]} spacer={false} />
    </section>
  );
}
