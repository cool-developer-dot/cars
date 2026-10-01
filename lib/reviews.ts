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

/** Ratings for Private Number Plate Maker Ltd on independent platforms */
export const PLATFORM_REVIEWS: PlatformSummary[] = [];

/** Reviews left directly on this website */
export const SITE_REVIEWS: Review[] = [];

/** Where the "See all reviews" buttons go; leave empty to hide them */
export const ALL_REVIEWS_URL = "";

export const hasReviews = PLATFORM_REVIEWS.length > 0 || SITE_REVIEWS.length > 0;
