/* Icons for the guide cards: light-to-blue gradient strokes and fills on dark
   glass tiles. Each uses its own gradient id. All decorative. */

const stops = (id: string, from = "#cfe8ff", to = "#2f86ff") => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  </defs>
);

/** A document with a folded corner and list lines */
export function GuideDocIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {stops("gdoc")}
      <g stroke="url(#gdoc)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 3.5h9.2l6.3 6.3v16.7a2 2 0 0 1-2 2H9.5a2 2 0 0 1-2-2v-21a2 2 0 0 1 2-2z" />
        <path d="M18.7 3.5v6.3H25" />
        <path d="M11.8 14.5h3.2M17.6 14.5h2.9M11.8 18.6h8.7M11.8 22.7h8.7" />
      </g>
    </svg>
  );
}

/** Three stacked layers: a pale top diamond over two blue chevrons */
export function GuideLayersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="glayersTop" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bfe0ff" />
        </linearGradient>
        <linearGradient id="glayersLow" x1="0" y1="14" x2="0" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6bb2ff" />
          <stop offset="1" stopColor="#1f7bff" />
        </linearGradient>
      </defs>
      <g strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4.2 27.2 10 16 15.8 4.8 10z" stroke="url(#glayersTop)" />
        <path d="M4.8 15.6 16 21.4l11.2-5.8" stroke="url(#glayersLow)" />
        <path d="M4.8 21.2 16 27l11.2-5.8" stroke="url(#glayersLow)" />
      </g>
    </svg>
  );
}

/** A set of scales: solid blue */
export function GuideScalesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {stops("gscales", "#7cc0ff", "#1f7bff")}
      <g fill="url(#gscales)" stroke="url(#gscales)" strokeLinecap="round" strokeLinejoin="round">
        {/* post, base and finial */}
        <rect x="15" y="6" width="2" height="19.4" rx="1" stroke="none" />
        <rect x="9.5" y="25" width="13" height="2.6" rx="1.3" stroke="none" />
        <circle cx="16" cy="4.6" r="1.7" stroke="none" />
        {/* beam */}
        <path d="M5.2 8.4h21.6" strokeWidth="2.2" fill="none" />
        {/* hanging cords */}
        <path d="M5.2 8.4 2.4 17.2h5.6zM26.8 8.4l-2.8 8.8h5.6z" strokeWidth="1.3" fill="none" />
        {/* pans */}
        <path d="M1.6 17.2h7.2a3.6 3.6 0 0 1-7.2 0zM23.2 17.2h7.2a3.6 3.6 0 0 1-7.2 0z" stroke="none" />
      </g>
    </svg>
  );
}
