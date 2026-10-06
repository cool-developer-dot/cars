/* Marks and glyphs for the delivery and care sections. All decorative. */

/** A stylised Royal Mail mark for the courier tiles: crown over a red band
    on a slim red cross. Drawn here so it stays crisp at any size. */
export function RoyalMailMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* the slim vertical bar of the cross */}
      <rect x="21" y="3.5" width="22" height="57" fill="#fff" stroke="#e3231a" strokeWidth="1.4" />
      {/* crown */}
      <path
        d="M24.4 21.6 22.8 11.3l5.2 4.4L32 8.4l4 7.3 5.2-4.4-1.6 10.3z"
        fill="#f4b400"
        stroke="#c7790a"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <rect x="24.4" y="19.4" width="15.2" height="3" rx="0.8" fill="#d6281e" />
      <circle cx="32" cy="7.4" r="1.4" fill="#f4b400" />
      {/* the horizontal band and name */}
      <rect x="3" y="27" width="58" height="19" fill="#e3231a" />
      <text
        x="32"
        y="40.2"
        textAnchor="middle"
        fontSize="11.5"
        fontWeight="800"
        fill="#ffd21f"
        fontFamily="Geist, 'Segoe UI', Arial, sans-serif"
        textLength="52"
        lengthAdjust="spacingAndGlyphs"
      >
        Royal Mail
      </text>
    </svg>
  );
}

/** WhatsApp: speech bubble with a handset (outline) */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.2 20.8 4.6 16A9 9 0 1 1 8 19.4z" />
      <path d="M9.1 7.9c.3-.4.7-.4 1-.1l1 2.2c.1.3 0 .6-.2.8l-.7.8a6.2 6.2 0 0 0 2.9 2.9l.8-.7c.2-.2.5-.3.8-.2l2.2 1c.4.2.4.6.1 1-.8 1.2-2 1.5-3.3 1-2.8-1.1-4.7-3.1-5.5-5.7-.3-1.1 0-1.8.9-2.9z" />
    </svg>
  );
}

/** The map pin that marks the collection point */
export function PinGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden="true">
      <path
        d="M20 2C10.6 2 3 9.5 3 18.8c0 12.2 14.4 28.1 16.2 30a1.1 1.1 0 0 0 1.6 0C22.6 46.9 37 31 37 18.8 37 9.5 29.4 2 20 2z"
        fill="url(#pinGrad)"
      />
      <defs>
        <linearGradient id="pinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f8dff" />
          <stop offset="1" stopColor="#0a52e0" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="18.6" r="7" fill="#fff" />
    </svg>
  );
}

/** Pale street grid behind the collection card */
export function MapStreets({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <rect width="320" height="240" fill="#e7edf5" />
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M-10 70 L120 30 L330 110" strokeWidth="9" />
        <path d="M40 -10 L90 120 L70 250" strokeWidth="7" />
        <path d="M-10 190 L150 140 L330 215" strokeWidth="8" />
        <path d="M200 -10 L215 90 L255 250" strokeWidth="9" />
        <path d="M120 30 L160 -10" strokeWidth="5" />
        <path d="M270 40 L330 20" strokeWidth="5" />
        <path d="M-10 120 L90 120 L215 90" strokeWidth="5" />
        <path d="M150 140 L215 90" strokeWidth="5" />
      </g>
      <g fill="none" stroke="#d5deea" strokeWidth="2.2" strokeLinecap="round">
        <path d="M140 -10 L180 100 L170 250" />
        <path d="M-10 30 L120 90" />
        <path d="M250 120 L330 160" />
        <path d="M20 215 L110 250" />
      </g>
    </svg>
  );
}

/* ——— Care glyphs: solid blue marks for the dark glass tiles ——— */

const BLUE_GRAD = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#58b0ff" />
      <stop offset="1" stopColor="#1668e3" />
    </linearGradient>
  </defs>
);

/** Three four-point sparkles: clean */
export function SparklesGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {BLUE_GRAD("sparkGrad")}
      <g fill="url(#sparkGrad)">
        <path d="M11 5c.7 4.9 2.4 6.6 7.3 7.3-4.9.7-6.6 2.4-7.3 7.3-.7-4.9-2.4-6.6-7.3-7.3C8.6 11.6 10.3 9.9 11 5z" />
        <path d="M21.5 15.6c.5 3.5 1.7 4.7 5.2 5.2-3.5.5-4.7 1.7-5.2 5.2-.5-3.5-1.7-4.7-5.2-5.2 3.5-.5 4.7-1.7 5.2-5.2z" />
        <path d="M24.4 4.6c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3z" />
        <circle cx="6.4" cy="22.8" r="1.5" />
      </g>
    </svg>
  );
}

/** A "no" sign: don't scratch */
export function BanGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {BLUE_GRAD("banGrad")}
      <g fill="none" stroke="url(#banGrad)" strokeWidth="3.4" strokeLinecap="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M8.4 8.4 23.6 23.6" />
      </g>
    </svg>
  );
}

/** A shield with a tick: warranty */
export function ShieldTickGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      {BLUE_GRAD("shieldGrad")}
      <path
        d="M16 3.2 5.6 6.6v8.2c0 6.1 4.2 10.8 10.4 13.9 6.2-3.1 10.4-7.8 10.4-13.9V6.6z"
        fill="none"
        stroke="url(#shieldGrad)"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 7.4 9.2 9.6v5.2c0 4.1 2.7 7.3 6.8 9.5 4.1-2.2 6.8-5.4 6.8-9.5V9.6z"
        fill="url(#shieldGrad)"
        opacity="0.9"
      />
      <path
        d="m12.3 15.6 2.7 2.8 5-5.4"
        fill="none"
        stroke="#0b1d3d"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
