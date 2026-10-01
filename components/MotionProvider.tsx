"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";

// The animation engine arrives in its own chunk after first paint, so it
// never delays the page from showing. `strict` stops anyone importing the
// heavy `motion` component by accident — use `m` instead.
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": people who ask for less motion get instant
    // reveals (no travel) instead of content that never appears
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
