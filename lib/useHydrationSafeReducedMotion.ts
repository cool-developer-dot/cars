"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * useReducedMotion() can differ between SSR (null/false) and the first
 * client render when the OS has prefers-reduced-motion. Gate on hydration
 * so server HTML and the hydrate pass always match.
 */
export function useHydrationSafeReducedMotion() {
  const prefersReduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated && !!prefersReduced;
}
