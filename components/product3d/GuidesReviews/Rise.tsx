"use client";

import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cardRevealV, inViewOnce } from "@/lib/motion";

const variants = cardRevealV(0);
const viewport = { once: true, amount: 0.15 };

/**
 * Fade-and-rise on first view. The variants always run: people who ask for
 * reduced motion are handled once, by MotionConfig reducedMotion="user" in
 * MotionProvider, which drops the travel but still lets the fade finish.
 */
export default function Rise({
  children,
  index = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? m.li : m.div;
  return (
    <Tag className={className} variants={variants} custom={index} {...inViewOnce} viewport={viewport}>
      {children}
    </Tag>
  );
}
