// Brand marks lucide no longer ships — simplified, single-colour where possible.

type P = { className?: string };

export const SOCIAL_ICONS = {
  facebook: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
    </svg>
  ),
  instagram: ({ className }: P) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 3h-3.1v12.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.4a5.8 5.8 0 1 0 5 5.8V9a7.5 7.5 0 0 0 4.2 1.3V7.2A4.3 4.3 0 0 1 16.6 3Z" />
    </svg>
  ),
  youtube: ({ className }: P) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  ),
};

export function UkFlag({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 60 60" aria-hidden="true">
      <clipPath id="uk-flag-clip">
        <circle cx="30" cy="30" r="30" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip)">
        <rect width="60" height="60" fill="#012169" />
        <path d="M-10 0 70 60M70 0-10 60" stroke="#fff" strokeWidth="12" />
        <path d="M-10 0 70 60M70 0-10 60" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0v60M0 30h60" stroke="#fff" strokeWidth="18" />
        <path d="M30 0v60M0 30h60" stroke="#C8102E" strokeWidth="10" />
      </g>
    </svg>
  );
}

/* Payment badges */

export function VisaMark() {
  return (
    <svg viewBox="0 0 48 16" width="40" height="14" aria-hidden="true">
      <text
        x="24"
        y="13.5"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="16"
        fontStyle="italic"
        fontWeight="900"
        fill="#1a1f71"
        letterSpacing="-0.5"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" width="34" height="22" aria-hidden="true">
      <circle cx="13" cy="12" r="10" fill="#eb001b" />
      <circle cx="25" cy="12" r="10" fill="#f79e1b" />
      <path d="M19 4a10 10 0 0 1 0 16 10 10 0 0 1 0-16Z" fill="#ff5f00" />
    </svg>
  );
}

export function ApplePayMark() {
  return (
    <svg viewBox="0 0 50 20" width="44" height="18" aria-hidden="true">
      <path
        fill="#000"
        d="M9.2 5.2c-.5.6-1.3 1-2 1-.1-.8.3-1.6.7-2.1.5-.6 1.4-1 2-1 .1.8-.2 1.6-.7 2.1Zm.7 1.1c-1.1-.1-2.1.6-2.6.6s-1.4-.6-2.2-.6A3.3 3.3 0 0 0 2.3 8c-1.2 2-.3 5 .8 6.6.5.8 1.2 1.7 2 1.6.8 0 1.1-.5 2.1-.5s1.2.5 2.1.5c.9 0 1.4-.8 2-1.6.6-.9.9-1.8.9-1.8s-1.8-.7-1.8-2.7c0-1.7 1.4-2.5 1.4-2.5-.8-1.1-2-1.3-2.4-1.3Z"
      />
      <text
        x="14"
        y="15"
        fontFamily="-apple-system, Helvetica, Arial, sans-serif"
        fontSize="12.5"
        fontWeight="600"
        fill="#000"
      >
        Pay
      </text>
    </svg>
  );
}

export function GooglePayMark() {
  return (
    <svg viewBox="0 0 50 20" width="44" height="18" aria-hidden="true">
      <text
        x="1"
        y="15"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="700"
      >
        <tspan fill="#4285f4">G</tspan>
      </text>
      <text
        x="14"
        y="15"
        fontFamily="Arial, sans-serif"
        fontSize="12.5"
        fontWeight="500"
        fill="#5f6368"
      >
        Pay
      </text>
    </svg>
  );
}

export function PayPalMark() {
  return (
    <svg viewBox="0 0 54 18" width="48" height="16" aria-hidden="true">
      <text
        x="0"
        y="14"
        fontFamily="Verdana, Arial, sans-serif"
        fontSize="13"
        fontStyle="italic"
        fontWeight="700"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}
