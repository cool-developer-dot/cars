/**
 * Customer reviews for the homepage "Reviews" section.
 *
 * Only real, verifiable reviews go here — copy ratings, counts and quotes
 * exactly as they appear on each platform and link to the source. The
 * section stays hidden while both lists are empty, so nothing invented
 * can ever reach the live site.
 */

export type ReviewPlatform = "trustpilot" | "google" | "facebook";

export type Review = {
  name: string;
  /** As shown on the source, e.g. "2 days ago" or "12 Sep 2026" */
  when: string;
  /** 1–5 */
  rating: number;
  text: string;
  url?: string;
};

export type PlatformSummary = {
  platform: ReviewPlatform;
  /** Average rating out of 5, as the platform shows it */
  rating: number;
  /** Number of reviews, as the platform shows it */
  count: number;
  /** Public profile URL */
  url: string;
  /** One recent review from that platform */
  featured?: Review;
};

/* ——— Real reviews: add them here ———
   Copy ratings, counts and quotes exactly as each platform shows them, and
   link to the source. Faking or inventing reviews is illegal in the UK
   (DMCC Act 2024), so nothing below is ever filled in with made-up data. */

/** Ratings for Private Number Plate Maker Ltd on independent platforms */
const REAL_PLATFORM_REVIEWS: PlatformSummary[] = [];

/** Reviews left directly on this website */
const REAL_SITE_REVIEWS: Review[] = [];

/** Where the "See all reviews" buttons go */
const REAL_ALL_REVIEWS_URL = "";

/* ——— Design preview (development only) ———
   Placeholder content so the section's layout can be reviewed locally.
   It is clearly labelled on the page and never reaches a production build. */

const hasReal = REAL_PLATFORM_REVIEWS.length > 0 || REAL_SITE_REVIEWS.length > 0;

/** True when the section is showing placeholder content */
export const IS_SAMPLE = !hasReal && process.env.NODE_ENV !== "production";

const SAMPLE_TEXT = "Sample review text. Replace with a real customer review.";

const SAMPLE_PLATFORM_REVIEWS: PlatformSummary[] = (
  ["trustpilot", "google", "facebook"] as const
).map((platform) => ({
  platform,
  rating: 5,
  count: 0,
  url: "#reviews",
  featured: { name: "Sample customer", when: "Sample date", rating: 5, text: SAMPLE_TEXT },
}));

const SAMPLE_SITE_REVIEWS: Review[] = Array.from({ length: 3 }, () => ({
  name: "Sample customer",
  when: "Sample date",
  rating: 5,
  text: SAMPLE_TEXT,
}));

export const PLATFORM_REVIEWS = IS_SAMPLE ? SAMPLE_PLATFORM_REVIEWS : REAL_PLATFORM_REVIEWS;
export const SITE_REVIEWS = IS_SAMPLE ? SAMPLE_SITE_REVIEWS : REAL_SITE_REVIEWS;
export const ALL_REVIEWS_URL = IS_SAMPLE ? "#reviews" : REAL_ALL_REVIEWS_URL;

export const hasReviews = PLATFORM_REVIEWS.length > 0 || SITE_REVIEWS.length > 0;
