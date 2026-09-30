"use client";

import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

// The animation engine arrives in its own chunk after first paint, so it
// never delays the page from showing. `strict` stops anyone importing the
// heavy `motion` component by accident — use `m` instead.
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
