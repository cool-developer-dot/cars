import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { COMPANY } from "@/lib/site";
import {
  IS_SAMPLE,
  PLATFORM_REVIEWS,
  PLATFORM_TOTALS,
  SITE_REVIEWS,
  SITE_TOTALS,
  hasReviews,
  type RatingSummary,
  type Review,
  type ReviewPlatform,
} from "@/lib/reviews";
import { GuideDocIcon, GuideLayersIcon, GuideScalesIcon } from "../guideIcons";
import Guides3D from "../Guides3D";
import { PREVIEW_PLATFORM_REVIEWS, PREVIEW_SITE_REVIEWS } from "./previewData";
import ReviewCarousel from "./ReviewCarousel";
import Rise from "./Rise";
import { PLATFORM_NAME, PlatformMark, RatingRing, Stars } from "./ui";
import s from "./GuidesReviews.module.css";

// There are no standalone guide pages yet: each card points at the page that
// answers it today (all of these exist).
const GUIDES = [
  {
    id: "legal",
    Icon: GuideDocIcon,
    title: ["Are 3D Gel", "Number Plates Legal?"],
    text: ["Rules, requirements", "and what to know."],
    href: "/faqs#legal",
  },
  {
    id: "3d-4d",
    Icon: GuideLayersIcon,
    title: ["3D vs 4D", "Number Plates"],
    text: ["Key differences", "and which to choose."],
    href: "/4d-number-plates",
  },
  {
    id: "styles",
    Icon: GuideScalesIcon,
    title: ["Standard vs 3D vs", "4D vs 5D Plates"],
    text: ["Compare styles,", "looks and features."],
    href: "/plate-styles",
  },
] as const;

const PLATFORM_ORDER: ReviewPlatform[] = ["google", "trustpilot", "facebook"];

/** Two fixed lines, as designed, with a real space between them for assistive tech */
const withBreak = (lines: readonly string[]) =>
  lines.map((line, i) => (
    <span key={line}>
      {i > 0 && (
        <>
          {" "}
          <br />
        </>
      )}
      {line}
    </span>
  ));

/** One review per page, in a single row */
function singleRows(slides: Review[]): (Review | null)[][] {
  return slides.length > 0 ? [slides] : [];
}

/** Two reviews per page, stacked: even ones in the top row, odd ones below */
function pairRows(slides: Review[]): (Review | null)[][] {
  const pages = Math.ceil(slides.length / 2);
  const top = Array.from({ length: pages }, (_, i) => slides[2 * i] ?? null);
  const below = Array.from({ length: pages }, (_, i) => slides[2 * i + 1] ?? null);
  return [top, below].filter((row) => row.some(Boolean));
}

function Caption({ totals, plus = false }: { totals: RatingSummary; plus?: boolean }) {
  return (
    <span className={s.ringCap}>
      {totals.count.toLocaleString("en-GB")}
      {plus ? "+" : ""} verified reviews
    </span>
  );
}

/**
 * Helpful guides (dark) beside customer reviews (light), joined by a glass
 * chevron edge. Review content comes only from lib/reviews.ts: with no real
 * reviews (and outside the design preview) the reviews half is not rendered
 * and the guides stand alone.
 */
export default function GuidesReviews3D() {
  if (!hasReviews) return <Guides3D />;

  const platforms = [...PLATFORM_REVIEWS].sort(
    (a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform),
  );
  const platformSlides = IS_SAMPLE
    ? PREVIEW_PLATFORM_REVIEWS
    : platforms.flatMap((p) => (p.featured ? [p.featured] : []));
  const siteSlides = IS_SAMPLE ? PREVIEW_SITE_REVIEWS : SITE_REVIEWS;

  const platformRows = singleRows(platformSlides);
  const siteRows = pairRows(siteSlides);

  return (
    <div className={s.root}>
      {/* The glass chevron between the two panels (desktop) */}
      <div className={s.shapes} aria-hidden="true">
        <div className={s.shapeMask}>
          <div className={s.shapeGlow}>
            <span className={`${s.poly} ${s.edgeLine}`} />
            <span className={`${s.poly} ${s.edgeBevel}`} />
            <span className={`${s.poly} ${s.face}`} />
          </div>
        </div>
      </div>

      {/* ——— Guides (dark) ——— */}
      <section
        id="guides"
        className={`${h.section} ${h.dark} ${s.guides}`}
        aria-labelledby="gr-guides-title"
      >
        <div className={s.guidesInner}>
          <Rise className={s.head}>
            <p className={h.eyebrow}>Guides</p>
            <h2 id="gr-guides-title" className={`${h.title} ${s.title}`}>
              Helpful Guides and <span className={h.accent}>Information</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              Answering the most common questions and helping you choose the right number plate for
              your vehicle.
            </p>
          </Rise>

          <ul className={s.guideList}>
            {GUIDES.map(({ id, Icon, title, text, href }, i) => (
              <Rise as="li" key={id} index={i} className={s.gitem}>
                <Link href={href} className={s.gcard}>
                  <span className={s.gtile} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={s.gcopy}>
                    <h3 className={s.gtitle}>{withBreak(title)}</h3>
                    <p className={s.gtext}>{withBreak(text)}</p>
                  </span>
                  <span className={s.go} aria-hidden="true">
                    <ArrowRight strokeWidth={2.2} />
                  </span>
                </Link>
              </Rise>
            ))}
          </ul>
        </div>

        {/* Two plates on a wet bumper: a banner under the cards, bleeding off the corner on desktop */}
        <div className={s.art} aria-hidden="true">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/3d/guides-reviews-plates.webp" />
            <img
              src="/3d/guides-reviews-plates-mobile.webp"
              alt=""
              width={1100}
              height={592}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        {/* Joins the two stacked panels (phones and tablets) */}
        <div className={s.midEdge}>
          <NeonEdge fill="#f3f7fb" />
        </div>
      </section>

      {/* ——— Reviews (light) ——— */}
      <section
        id="reviews"
        className={`${h.section} ${h.light} ${s.reviews}`}
        aria-labelledby="gr-reviews-title"
      >
        {IS_SAMPLE && (
          <p className={s.sampleTag}>Design preview: sample figures and quotes, not real reviews</p>
        )}
        <div className={s.reviewsInner}>
          <Rise className={s.head}>
            <p className={h.eyebrow}>Reviews</p>
            <h2 id="gr-reviews-title" className={`${h.title} ${s.title}`}>
              Trusted by <span className={h.accent}>Thousands of Drivers</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              See what our customers say about {COMPANY.legalName} and our 3D number plates.
            </p>
          </Rise>

          <div className={s.rcards}>
            {platforms.length > 0 && (
              <Rise index={0} className={s.rcard}>
                <div className={s.rtop}>
                  <div>
                    <h3 className={s.rtitle}>
                      Private Number
                      <br />
                      Plate Maker Ltd
                    </h3>
                    <p className={s.rsub}>Reviews from trusted platforms.</p>
                  </div>
                  {PLATFORM_TOTALS && (
                    <div className={s.ringWrap}>
                      <RatingRing rating={PLATFORM_TOTALS.rating} id="gr-ring-platforms" />
                      <Caption totals={PLATFORM_TOTALS} />
                    </div>
                  )}
                </div>

                <ul className={s.tiles}>
                  {platforms.map((p) => {
                    const external = !p.url.startsWith("#");
                    return (
                      <li key={p.platform}>
                        <a
                          href={p.url}
                          className={s.tile}
                          aria-label={`${PLATFORM_NAME[p.platform]}: rated ${p.rating.toFixed(1)} out of 5`}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          <span className={s.tileTop}>
                            <PlatformMark platform={p.platform} />
                            {p.platform === "trustpilot" ? (
                              <span className={s.tileWord}>Trustpilot</span>
                            ) : (
                              <span className={s.tileScore}>{p.rating.toFixed(1)}</span>
                            )}
                          </span>
                          <span className={s.tileBottom}>
                            <span className={s.tileNum}>{p.rating.toFixed(1)}</span>
                            <Stars rating={p.rating} />
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>

                {platformRows.length > 0 && (
                  <ReviewCarousel
                    label="Reviews from trusted platforms"
                    rows={platformRows}
                    pages={platformSlides.length}
                  />
                )}
              </Rise>
            )}

            {siteRows.length > 0 && (
              <Rise index={1} className={s.rcard}>
                <div className={s.rtop}>
                  <div>
                    <h3 className={s.rtitle}>
                      {COMPANY.brand}
                      <br />3D Plate Reviews
                    </h3>
                    <p className={s.rsub}>Latest reviews from our customers.</p>
                  </div>
                  {SITE_TOTALS && (
                    <div className={s.ringWrap}>
                      <RatingRing rating={SITE_TOTALS.rating} id="gr-ring-site" />
                      <Caption totals={SITE_TOTALS} plus={IS_SAMPLE} />
                    </div>
                  )}
                </div>

                <ReviewCarousel
                  label={`${COMPANY.brand} 3D plate reviews`}
                  rows={siteRows}
                  pages={Math.ceil(siteSlides.length / 2)}
                />
              </Rise>
            )}
          </div>
        </div>
      </section>

      {/* Into the footer */}
      <div className={s.foot}>
        <NeonEdge fill="#040c16" light />
      </div>
    </div>
  );
}
