import { Package, Truck } from "lucide-react";
import { plateFont } from "@/lib/fonts";
import PlateArt from "./PlateArt";
import a from "./Art.module.css";

/*
 * Decorative product illustrations for the homepage, drawn in CSS so they
 * stay crisp at any size and need no image downloads. All aria-hidden.
 */

function UkFlag() {
  return (
    <svg viewBox="0 0 60 40" className={a.flag}>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** The builder's registration field */
export function RegField({ caret = false, className }: { caret?: boolean; className?: string }) {
  return (
    <span className={`${a.regWrap} ${className ?? ""}`} aria-hidden="true">
      <span className={a.reg}>
        <span className={a.regBand}>
          <UkFlag />
          UK
        </span>
        <span className={`${a.regText} ${plateFont.className}`}>
          AB12 CDE
          {caret && <span className={a.caret} />}
        </span>
      </span>
    </span>
  );
}

/** Proof-of-identity or proof-of-entitlement documents, fanned out */
export function DocCards({
  kind,
  className,
}: {
  kind: "identity" | "vehicle";
  className?: string;
}) {
  return (
    <span className={`${a.docs} ${className ?? ""}`} aria-hidden="true">
      {kind === "identity" ? (
        <>
          <span className={`${a.paper} ${a.paperBack}`}>
            <span className={a.paperTitle}>Bank Statement</span>
            <span className={a.lines} />
          </span>
          <span className={`${a.paper} ${a.paperMid}`}>
            <span className={a.paperTitle}>Council Tax Bill</span>
            <span className={a.lines} />
          </span>
          <span className={a.licence}>
            <span className={a.licenceTop}>
              <UkFlag />
              <span>UK DRIVING LICENCE</span>
            </span>
            <span className={a.licenceBody}>
              <span className={a.photo} />
              <span className={a.lines} />
            </span>
          </span>
        </>
      ) : (
        <>
          <span className={`${a.paper} ${a.paperBack} ${a.paperBlue}`}>
            <span className={a.paperTitle}>V778</span>
            <span className={a.lines} />
          </span>
          <span className={`${a.paper} ${a.paperMid} ${a.paperGreen}`}>
            <span className={a.paperTitle}>V750</span>
            <span className={a.lines} />
          </span>
          <span className={a.v5c}>
            <span className={a.v5cTop}>
              <strong>V5C</strong>
              <span className={a.crown} />
            </span>
            <span className={a.v5cSub}>Vehicle logbook</span>
            <span className={a.lines} />
          </span>
        </>
      )}
    </span>
  );
}

/** Our branded box, lid open, with a plate inside */
export function ParcelBox({ className }: { className?: string }) {
  return (
    <span className={`${a.box} ${className ?? ""}`} aria-hidden="true">
      <span className={a.boxLid}>
        <span className={a.boxBrand}>
          Replacement<em>Plates</em>
        </span>
      </span>
      <span className={a.boxBody}>
        <span className={a.bubbles} />
        <PlateArt className={a.boxPlate} face="yellow" finish="gel" />
      </span>
    </span>
  );
}

/** The Ilford collection point's sign */
export function StoreFront({ className }: { className?: string }) {
  return (
    <span className={`${a.store} ${className ?? ""}`} aria-hidden="true">
      <span className={a.sign}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-rp.webp" alt="" width={922} height={194} className={a.signLogo} />
        <span className={a.signSub}>Collection point · Ilford</span>
      </span>
      <span className={a.shopfront}>
        <span className={a.window} />
        <span className={a.door}>
          <span className={a.doorGlow} />
        </span>
        <span className={a.window} />
      </span>
    </span>
  );
}

/** Royal Mail delivery: a van in motion with a parcel */
export function DeliveryArt({ className }: { className?: string }) {
  return (
    <span className={`${a.delivery} ${className ?? ""}`} aria-hidden="true">
      <span className={a.speed} />
      <span className={a.van}>
        <Truck strokeWidth={1.4} />
      </span>
      <span className={a.parcel}>
        <Package strokeWidth={1.6} />
      </span>
    </span>
  );
}

/** A red delivery van in motion, side-on (no third-party branding) */
export function VanArt({ className }: { className?: string }) {
  return (
    <span className={`${a.vanArt} ${className ?? ""}`} aria-hidden="true">
      <svg viewBox="0 0 340 210">
        <defs>
          <linearGradient id="van-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff3b3b" />
            <stop offset="45%" stopColor="#e0101e" />
            <stop offset="100%" stopColor="#9c0612" />
          </linearGradient>
          <linearGradient id="van-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b6b80" />
            <stop offset="55%" stopColor="#1d2632" />
            <stop offset="100%" stopColor="#0d131b" />
          </linearGradient>
          <radialGradient id="van-wheel" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#c9ced6" />
            <stop offset="34%" stopColor="#8a929e" />
            <stop offset="38%" stopColor="#15181d" />
            <stop offset="100%" stopColor="#060708" />
          </radialGradient>
        </defs>
        {/* speed lines */}
        <g stroke="rgba(10,92,255,0.28)" strokeWidth="3" strokeLinecap="round">
          <path d="M0 92 H46" />
          <path d="M6 118 H52" />
          <path d="M-4 144 H40" />
        </g>
        {/* shadow */}
        <ellipse cx="190" cy="186" rx="150" ry="10" fill="rgba(16,30,60,0.28)" />
        {/* body */}
        <path
          d="M58 168 V64 Q58 44 78 44 H236 Q250 44 260 56 L300 108 L322 116 Q334 120 334 134 V160 Q334 168 326 168 Z"
          fill="url(#van-body)"
        />
        {/* roof highlight */}
        <path d="M70 52 H236 Q246 52 252 60" stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* windscreen + cab window */}
        <path d="M246 60 L290 110 H246 Z" fill="url(#van-glass)" />
        <path d="M200 60 H236 V110 H200 Z" fill="url(#van-glass)" />
        {/* door + panel lines */}
        <path d="M196 58 V164 M150 58 V164" stroke="rgba(80,0,8,0.45)" strokeWidth="2" />
        <rect x="218" y="122" width="16" height="4" rx="2" fill="rgba(60,0,6,0.6)" />
        {/* headlight + bumper */}
        <path d="M322 124 H334 V136 H322 Z" fill="#ffe9a8" />
        <rect x="56" y="160" width="280" height="10" rx="5" fill="#1b1f26" />
        {/* wheels */}
        <circle cx="112" cy="168" r="24" fill="url(#van-wheel)" />
        <circle cx="270" cy="168" r="24" fill="url(#van-wheel)" />
      </svg>
    </span>
  );
}

/** Three plates fanned out: front and rear faces in different finishes */
export function PlateFan({ className }: { className?: string }) {
  return (
    <span className={`${a.fan} ${className ?? ""}`} aria-hidden="true">
      <PlateArt className={a.fanBack} face="yellow" finish="acrylic" />
      <PlateArt className={a.fanMid} face="white" finish="gel" />
      <PlateArt className={a.fanFront} face="yellow" finish="gel" />
    </span>
  );
}

