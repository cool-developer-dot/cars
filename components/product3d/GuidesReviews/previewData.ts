import type { Review } from "@/lib/reviews";

/**
 * Design-preview quotes, taken from the approved mock-up. They are imported
 * by the server component only and used ONLY while IS_SAMPLE is true (never
 * in a production build). The rest of each list is the generic placeholder
 * from lib/reviews.ts, so nothing here reads as a real customer.
 */
const PLACEHOLDER: Review = {
  name: "Sample customer",
  when: "Sample date",
  rating: 5,
  text: "Sample review text. Replace with a real customer review.",
};

export const PREVIEW_PLATFORM_REVIEWS: Review[] = [
  {
    name: "Sarah M.",
    when: "1 week ago",
    rating: 5,
    text: "Brilliant service from start to finish. Plates arrived quickly and the quality is excellent.",
  },
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
];

export const PREVIEW_SITE_REVIEWS: Review[] = [
  {
    name: "Ahmed K.",
    when: "2 days ago",
    rating: 5,
    text: "Excellent quality and super fast delivery. The 3D plates look amazing on my car.",
  },
  {
    name: "Lewis P.",
    when: "1 week ago",
    rating: 5,
    text: "Great finish and perfect fit. Exactly what I was looking for. Highly recommend!",
  },
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
];
