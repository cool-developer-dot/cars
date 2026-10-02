import type { ReactNode } from "react";
import { ArrowRight, Star } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { SOCIAL_ICONS } from "@/components/Footer/brandIcons";
import { COMPANY } from "@/lib/site";
import {
  ALL_REVIEWS_URL,
  PLATFORM_REVIEWS,
  SITE_REVIEWS,
  hasReviews,
  IS_SAMPLE,
  type Review,
  type ReviewPlatform,
} from "@/lib/reviews";
import h from "./home.module.css";
import s from "./Reviews.module.css";

const PLATFORM: Record<ReviewPlatform, { name: string; mark: ReactNode }> = {
  trustpilot: {
    name: "Trustpilot",
    mark: (
      <svg viewBox="0 0 24 24" className={s.mark} aria-hidden="true">
        <path
          fill="#00b67a"
          d="M12 2.5l2.6 7.4h7.9l-6.4 4.6 2.4 7.5L12 17.4 5.5 22l2.4-7.5L1.5 9.9h7.9z"
        />
      </svg>
    ),
  },
  google: {
    name: "Google",
    mark: (
      <svg viewBox="0 0 24 24" className={s.mark} aria-hidden="true">
        <path fill="#4285f4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5Z" />
        <path fill="#34a853" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1a6.1 6.1 0 0 1-5.7-4.2H2.8v2.7a10.5 10.5 0 0 0 9.2 5.6Z" />
        <path fill="#fbbc05" d="M6.3 14.2a6.3 6.3 0 0 1 0-4V7.5H2.8a10.5 10.5 0 0 0 0 9.4l3.5-2.7Z" />
        <path fill="#ea4335" d="M12 5.7c1.6 0 3 .5 4.1 1.6l3-3A10.5 10.5 0 0 0 2.8 7.5l3.5 2.7A6.1 6.1 0 0 1 12 5.7Z" />
      </svg>
    ),
  },
  facebook: {
    name: "Facebook",
    mark: (
      <span className={`${s.mark} ${s.fb}`} aria-hidden="true">
        {SOCIAL_ICONS.facebook({ className: s.fbIcon })}
      </span>
    ),
  },
};

function Stars({ rating, green = false }: { rating: number; green?: boolean }) {
  return (
    <span className={`${s.stars} ${green ? s.starsGreen : ""}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`${s.star} ${i < Math.round(rating) ? s.on : ""}`}>
          <Star strokeWidth={0} fill="currentColor" />
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const inner = (
    <>
      <span className={s.reviewHead}>
        <span className={s.avatar} aria-hidden="true">
          {review.name.charAt(0)}
        </span>
        <span className={s.who}>
          <strong>{review.name}</strong>
          <span>{review.when}</span>
        </span>
        <Stars rating={review.rating} />
        {review.url && <ArrowRight className={s.go} strokeWidth={2.2} aria-hidden="true" />}
      </span>
      <span className={s.quote}>{review.text}</span>
    </>
  );
  return review.url ? (
    <a href={review.url} target="_blank" rel="noopener noreferrer" className={`${h.card} ${s.review}`}>
      {inner}
    </a>
  ) : (
    <div className={`${h.card} ${s.review}`}>{inner}</div>
  );
}

function SeeAll() {
  if (!ALL_REVIEWS_URL) return null;
  return (
    <a href={ALL_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className={s.seeAll}>
      See all reviews
      <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
    </a>
  );
}

/** Renders nothing until real reviews are added in lib/reviews.ts */
export default function Reviews() {
  if (!hasReviews) return null;

  return (
    <section id="reviews" className={`${h.section} ${h.light}`} aria-labelledby="reviews-title">
      <div className={h.container}>
        {PLATFORM_REVIEWS.length > 0 && (
          <>
            <div className={h.headRow}>
              <Reveal>
                <p className={h.eyebrow}>Customer reviews</p>
                <h2 id="reviews-title" className={`${h.title} ${s.title}`}>
                  Reviews of {COMPANY.legalName}.
                </h2>
                <p className={h.lead}>
                  Read what our customers say about us on independent platforms.
                </p>
              </Reveal>
              <SeeAll />
            </div>

            <ul className={s.platforms}>
              {PLATFORM_REVIEWS.map((p, i) => (
                <Reveal as="li" key={p.platform} index={i} className={s.platformCol}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className={`${h.card} ${s.platform}`}>
                    <span className={s.platformName}>
                      {PLATFORM[p.platform].mark}
                      {PLATFORM[p.platform].name}
                    </span>
                    <span className={s.score}>
                      <strong>{IS_SAMPLE ? "–" : p.rating.toFixed(1)}/5</strong>
                      <Stars rating={p.rating} green={p.platform === "trustpilot"} />
                      <span className={s.count}>
                        {IS_SAMPLE ? "Sample" : `${p.count.toLocaleString("en-GB")} reviews`}
                      </span>
                    </span>
                  </a>
                  {p.featured && <ReviewCard review={p.featured} />}
                </Reveal>
              ))}
            </ul>
          </>
        )}

        {SITE_REVIEWS.length > 0 && (
          <div className={PLATFORM_REVIEWS.length > 0 ? s.siteBlock : undefined}>
            <div className={h.headRow}>
              <Reveal>
                <h2
                  id={PLATFORM_REVIEWS.length > 0 ? undefined : "reviews-title"}
                  className={`${h.title} ${s.title}`}
                >
                  {COMPANY.brand} <span className={h.accent}>reviews.</span>
                </h2>
                <p className={h.lead}>
                  Reviews from customers who have left feedback directly on our website.
                </p>
              </Reveal>
              <SeeAll />
            </div>
            <ul className={s.siteGrid}>
              {SITE_REVIEWS.map((r, i) => (
                <Reveal as="li" key={`${r.name}-${i}`} index={i}>
                  <ReviewCard review={r} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Into the FAQs (dark) */}
      <NeonEdge fill="#06111f" light />
    </section>
  );
}
