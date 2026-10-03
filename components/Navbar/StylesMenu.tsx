import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import PlateArt from "@/components/home/PlateArt";
import { STYLE_ART, STYLE_ORDER } from "@/components/home/homeConfig";
import { COMPANY, FROM_PRICE, PRICES, gbp } from "@/lib/site";
import s from "./StylesMenu.module.css";

/** Every plate style, drawn and priced as the rest of the site shows it */
export const STYLE_LINKS = STYLE_ORDER.map((id) => ({
  id,
  label: STYLE_ART[id].label,
  blurb: STYLE_ART[id].blurb,
  face: STYLE_ART[id].face,
  finish: STYLE_ART[id].finish,
  href: PRICES[id].href,
  single: PRICES[id].single,
  pair: PRICES[id].pair,
}));

const POINTS = [
  { id: "amount", text: "Front, rear or a matching\u00a0pair" },
  { id: "mail", text: <>Royal Mail delivery <span className={s.nowrap}>UK-wide</span></> },
  { id: "collect", text: "Collection in Ilford" },
];

/**
 * Desktop "Plate Styles" mega menu: opens under the navbar on hover or
 * keyboard focus. Open/close state lives in the Navbar.
 */
export function StylesPanel({
  id,
  open,
  pathname,
  onNavigate,
}: {
  id: string;
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div id={id} className={`${s.panel} ${open ? s.open : ""}`} inert={!open}>
      <div className={s.intro}>
        <p className={s.eyebrow}>Plate styles</p>
        <p className={s.title}>Choose Your Finish</p>
        <p className={s.text}>
          Six finishes, each made to order and priced per plate.
        </p>
        <p className={s.from}>
          From <strong>{gbp(FROM_PRICE)}</strong> per plate
        </p>
        <ul className={s.points}>
          {POINTS.map((p) => (
            <li key={p.id}>
              <Check aria-hidden="true" strokeWidth={2.6} />
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
        <Link href="/plate-styles" className={s.compare} onClick={onNavigate}>
          Compare all styles
          <ArrowRight aria-hidden="true" strokeWidth={2.2} />
        </Link>
        <p className={s.trust}>
          <ShieldCheck aria-hidden="true" strokeWidth={2} />
          DVLA-registered supplier · RNPS {COMPANY.rnps}
        </p>
      </div>

      <ul className={s.grid}>
        {STYLE_LINKS.map((st, i) => {
          const current = pathname === st.href;
          return (
            <li key={st.id} style={{ "--i": i } as CSSProperties}>
              <Link
                href={st.href}
                className={`${s.card} ${current ? s.current : ""}`}
                aria-current={current ? "page" : undefined}
                onClick={onNavigate}
              >
                <span className={s.thumb}>
                  <PlateArt reg="AB12 CDE" face={st.face} finish={st.finish} />
                </span>
                <span className={s.cardHead}>
                  <span className={s.name}>{st.label}</span>
                  <ArrowRight className={s.go} aria-hidden="true" strokeWidth={2.2} />
                </span>
                <span className={s.blurb}>{st.blurb}</span>
                <span className={s.price}>
                  <span>
                    From <strong>{gbp(st.single)}</strong>
                  </span>
                  <span className={s.dot} aria-hidden="true" />
                  <span>{gbp(st.pair)} pair</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Phone / tablet drawer: the same styles as a collapsible list */
export function StylesDrawerList({
  id,
  open,
  pathname,
  onNavigate,
}: {
  id: string;
  open: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div id={id} className={`${s.sub} ${open ? s.subOpen : ""}`} inert={!open}>
      <div className={s.subInner}>
        <ul className={s.subList}>
          {STYLE_LINKS.map((st) => {
            const current = pathname === st.href;
            return (
              <li key={st.id}>
                <Link
                  href={st.href}
                  className={`${s.subItem} ${current ? s.subCurrent : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={onNavigate}
                >
                  <span className={s.subThumb}>
                    <PlateArt reg="AB12 CDE" face={st.face} finish={st.finish} />
                  </span>
                  <span className={s.subName}>{st.label}</span>
                  <span className={s.subPrice}>From {gbp(st.single)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/plate-styles" className={s.subAll} onClick={onNavigate}>
          Compare all plate styles
          <ArrowRight aria-hidden="true" strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}
