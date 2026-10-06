/* Small glyphs for the "How to order" drawings and the documents cards.
   The cars are solid shapes drawn to match the design, rather than taken
   from the outline icon set. All decorative. */

/** A car seen head-on: open windscreen frame, body with the lights cut out,
    wing mirrors and two feet. The design draws front and rear the same. */
function CarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 33" fill="currentColor" className={className} aria-hidden="true">
      {/* roof / windscreen frame */}
      <path
        d="M7.3 13 10.3 2.5h19.4L32.7 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* wing mirrors */}
      <circle cx="2" cy="11.7" r="1.9" />
      <circle cx="38" cy="11.7" r="1.9" />
      {/* body with the two lights cut out */}
      <path
        fillRule="evenodd"
        d="M5.2 12.3h29.6a4 4 0 0 1 4 4v7.4a4 4 0 0 1-4 4H5.2a4 4 0 0 1-4-4v-7.4a4 4 0 0 1 4-4zM4 19.9a3.4 2.5 0 1 0 6.8 0 3.4 2.5 0 1 0-6.8 0zm25.2 0a3.4 2.5 0 1 0 6.8 0 3.4 2.5 0 1 0-6.8 0z"
      />
      {/* feet */}
      <rect x="3" y="25.6" width="5.4" height="7" rx="1.5" />
      <rect x="31.6" y="25.6" width="5.4" height="7" rx="1.5" />
    </svg>
  );
}

export function CarFrontIcon({ className }: { className?: string }) {
  return <CarGlyph className={className} />;
}

export function CarRearIcon({ className }: { className?: string }) {
  return <CarGlyph className={className} />;
}

/** One car of the pair: a cabin block above a body block, with a gap between */
function PairCar({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path d="M3 0h12l3 5.3v5.3A1.4 1.4 0 0 1 16.6 12H1.4A1.4 1.4 0 0 1 0 10.6V5.3z" />
      <rect y="14.4" width="18" height="14.2" rx="3.4" />
      <circle cx="3.3" cy="18.1" r="1.1" fill="#fff" fillOpacity="0.55" />
      <circle cx="14.7" cy="18.1" r="1.1" fill="#fff" fillOpacity="0.55" />
    </g>
  );
}

/** Two cars side by side: "a pair" */
export function PairIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 29" fill="currentColor" className={className} aria-hidden="true">
      <PairCar x={0} />
      <PairCar x={22} />
    </svg>
  );
}

/* ——— Documents ——— */

/** An identity document: page with a folded corner, a portrait and lines */
export function IdDocIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.5 3.5h9.8l6.2 6.2V26.5a2 2 0 0 1-2 2h-14a2 2 0 0 1-2-2v-21a2 2 0 0 1 2-2z" />
      <path d="M19.3 3.5v6.2h6.2" />
      <circle cx="13.4" cy="14.2" r="2.4" />
      <path d="M9.6 21.6c.4-2.3 1.9-3.6 3.8-3.6s3.4 1.3 3.8 3.6z" />
      <path d="M19 14.2h3M19 17.8h3" />
    </svg>
  );
}

/** A registration document: page with lines and a car in front of it */
export function VehicleDocIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.5 3.5h9.3l5.7 5.7V15" />
      <path d="M8.5 3.5a2 2 0 0 0-2 2V24a2 2 0 0 0 2 2H12" />
      <path d="M17.8 3.5v5.7h5.7" />
      <path d="M10.6 11.4h3.6M10.6 15h5.4" />
      <path
        d="M14.4 22.6l1.2-2.7a1.8 1.8 0 0 1 1.7-1.1h5.4a1.8 1.8 0 0 1 1.7 1.1l1.2 2.7"
        fill="#10284f"
      />
      <rect x="12.6" y="22.4" width="15.8" height="5.6" rx="1.6" fill="#10284f" />
      <path d="M15.6 25.2h.1M25.3 25.2h.1" strokeWidth="2.6" />
    </svg>
  );
}
