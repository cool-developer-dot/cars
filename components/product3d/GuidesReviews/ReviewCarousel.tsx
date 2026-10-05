"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/reviews";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import { Stars } from "./ui";
import s from "./GuidesReviews.module.css";

type Props = {
  /** Accessible name of the carousel */
  label: string;
  /** rows[row][page]: one row shows one review per page; two rows show two stacked */
  rows: (Review | null)[][];
  pages: number;
};

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className={s.review}>
      <span className={s.avatar} aria-hidden="true">
        {review.name.charAt(0)}
      </span>
      <div>
        <Stars rating={review.rating} />
        <p className={s.quote}>{review.text}</p>
        <figcaption className={s.who}>
          {review.url ? (
            <a href={review.url} target="_blank" rel="noopener noreferrer">
              {review.name}
            </a>
          ) : (
            <span>{review.name}</span>
          )}
          <span className={s.sep} aria-hidden="true">
            •
          </span>
          <span>{review.when}</span>
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * Review carousel. Every row is its own scroll-snap track; chevrons, dots,
 * swipe and the arrow keys all drive the same page number, and all rows move
 * together. No autoplay.
 */
export default function ReviewCarousel({ label, rows, pages }: Props) {
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef(0);
  const settle = useRef<number | undefined>(undefined);
  const [page, setPage] = useState(0);
  const reduced = useHydrationSafeReducedMotion();

  const goTo = useCallback(
    (i: number, smooth = true) => {
      const next = (i + pages) % pages;
      pageRef.current = next;
      setPage(next);
      tracks.current.forEach((t) => {
        t?.scrollTo({ left: next * t.clientWidth, behavior: smooth && !reduced ? "smooth" : "auto" });
      });
    },
    [pages, reduced],
  );

  // A swipe (or any scroll) settles on a page; the other rows follow it
  const onScroll = (row: number) => {
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const t = tracks.current[row];
      if (!t || t.clientWidth === 0) return;
      const i = Math.round(t.scrollLeft / t.clientWidth);
      if (i === pageRef.current || i < 0 || i >= pages) return;
      pageRef.current = i;
      setPage(i);
      tracks.current.forEach((o, k) => {
        if (k !== row) o?.scrollTo({ left: i * o.clientWidth, behavior: "auto" });
      });
    }, 90);
  };

  // Keep every row on its page when the width changes
  useEffect(() => {
    const realign = () =>
      tracks.current.forEach((t) => {
        if (t) t.scrollLeft = pageRef.current * t.clientWidth;
      });
    window.addEventListener("resize", realign);
    return () => {
      window.removeEventListener("resize", realign);
      window.clearTimeout(settle.current);
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") goTo(pageRef.current - 1);
    else if (e.key === "ArrowRight") goTo(pageRef.current + 1);
    else if (e.key === "Home") goTo(0);
    else if (e.key === "End") goTo(pages - 1);
    else return;
    e.preventDefault();
  };

  const many = pages > 1;

  return (
    <div
      className={s.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className={s.rows}>
        {rows.map((slides, r) => (
          <div key={r} className={s.row}>
            {many ? (
              <button
                type="button"
                className={s.chev}
                aria-label="Previous review"
                onClick={() => goTo(pageRef.current - 1)}
              >
                <ChevronLeft strokeWidth={2.6} aria-hidden="true" />
              </button>
            ) : (
              <span />
            )}
            <div
              ref={(el) => {
                tracks.current[r] = el;
              }}
              className={s.track}
              tabIndex={0}
              aria-live="polite"
              onScroll={() => onScroll(r)}
            >
              {slides.map((rv, i) => (
                <div
                  key={i}
                  className={s.slide}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${pages}`}
                  aria-hidden={rv ? undefined : true}
                >
                  {rv && <ReviewCard review={rv} />}
                </div>
              ))}
            </div>
            {many ? (
              <button
                type="button"
                className={s.chev}
                aria-label="Next review"
                onClick={() => goTo(pageRef.current + 1)}
              >
                <ChevronRight strokeWidth={2.6} aria-hidden="true" />
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>

      {many && (
        <div className={s.dots} role="group" aria-label="Choose a review">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={s.dot}
              aria-label={`Show review ${i + 1} of ${pages}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
