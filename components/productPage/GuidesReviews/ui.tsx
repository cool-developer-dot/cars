import type { CSSProperties, ReactNode } from "react";
import { Star } from "lucide-react";
import type { ReviewPlatform } from "@/lib/reviews";
import s from "./GuidesReviews.module.css";

/** Gold stars, filled to the nearest half. `rating` is out of 5. */
export function Stars({ rating }: { rating: number }) {
  const half = Math.round(Math.min(5, Math.max(0, rating)) * 2) / 2;
  const row = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={s.star}>
      <Star fill="currentColor" strokeWidth={2} strokeLinejoin="round" />
    </span>
  ));
  return (
    <span
      className={s.stars}
      role="img"
      aria-label={`${rating} out of 5 stars`}
      style={{ "--fill": `${(half / 5) * 100}%` } as CSSProperties}
    >
      <span className={s.starsBase}>{row}</span>
      <span className={s.starsFill}>{row}</span>
    </span>
  );
}

/** A rating out of 5 as a ring: pale track, round-capped blue arc, the figure in the middle */
export function RatingRing({ rating, id }: { rating: number; id: string }) {
  const R = 43;
  const C = 2 * Math.PI * R;
  const arc = C * Math.min(1, Math.max(0, rating / 5));
  return (
    <span className={s.ring} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#58b0ff" />
            <stop offset="1" stopColor="#0a5cff" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={R} fill="none" stroke="#d5dbe6" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${C}`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className={s.ringNum}>{rating.toFixed(1)}</span>
    </span>
  );
}

/* ——— Platform marks (drawn here so nothing is downloaded) ——— */

const MARKS: Record<ReviewPlatform, ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285f4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5Z" />
      <path fill="#34a853" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1a6.1 6.1 0 0 1-5.7-4.2H2.8v2.7a10.5 10.5 0 0 0 9.2 5.6Z" />
      <path fill="#fbbc05" d="M6.3 14.2a6.3 6.3 0 0 1 0-4V7.5H2.8a10.5 10.5 0 0 0 0 9.4l3.5-2.7Z" />
      <path fill="#ea4335" d="M12 5.7c1.6 0 3 .5 4.1 1.6l3-3A10.5 10.5 0 0 0 2.8 7.5l3.5 2.7A6.1 6.1 0 0 1 12 5.7Z" />
    </svg>
  ),
  trustpilot: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#00b67a" d="M12 1.6l2.9 8.2h8.5l-6.9 5 2.6 8.2L12 17.9l-7.1 5.1 2.6-8.2-6.9-5h8.5z" />
      <path fill="#005128" d="m16.5 14.8-.6-1.9-3.9 2.8z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5.6" fill="#1877f2" />
      <path
        fill="#fff"
        d="M16.6 24v-8.9h3l.5-3.5h-3.5V9.4c0-1 .3-1.7 1.7-1.7h1.9V4.6c-.3 0-1.4-.1-2.7-.1-2.6 0-4.4 1.6-4.4 4.5v2.6h-3v3.5h3V24z"
      />
    </svg>
  ),
};

export const PLATFORM_NAME: Record<ReviewPlatform, string> = {
  google: "Google",
  trustpilot: "Trustpilot",
  facebook: "Facebook",
};

export function PlatformMark({ platform }: { platform: ReviewPlatform }) {
  return <span className={s.mark}>{MARKS[platform]}</span>;
}
