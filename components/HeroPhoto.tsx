/**
 * The hero's night-scene photo, reused further down the page.
 *
 * Points at the exact files the layout already preloads for the hero (same
 * breakpoint), so these sections come straight from the browser cache instead
 * of triggering a fresh optimiser download + decode mid-scroll.
 */
export default function HeroPhoto({
  className,
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <picture>
      <source media="(max-width: 899px)" srcSet="/hero-bg-mobile.webp" />
      <img
        src="/hero-bg.webp"
        alt={alt}
        width={1920}
        height={1080}
        decoding="async"
        className={className}
      />
    </picture>
  );
}
