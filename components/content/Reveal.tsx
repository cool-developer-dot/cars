"use client";

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cardRevealV, inViewOnce } from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";

const v = cardRevealV(0);
const viewport = { once: true, amount: 0.2 };

/** Fade-and-rise on first view (opacity/transform only — GPU friendly). */
export default function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  /** Stagger position within a row */
  index?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useHydrationSafeReducedMotion();
  const Tag = as === "li" ? m.li : m.div;
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      variants={v}
      custom={index}
      {...inViewOnce}
      viewport={viewport}
    >
      {children}
    </Tag>
  );
}
