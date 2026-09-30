"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { m } from "framer-motion";
import IntroRings from "./IntroRings";
import { EASE_PREMIUM, TIMING } from "./timing";
import styles from "./OpeningIntro.module.css";

type Phase = "checking" | "play" | "done";

type Props = {
  children: ReactNode;
};

/** Intro plays once per browser session; later loads show the site instantly */
const SEEN_KEY = "rp-intro-seen";

function introSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage blocked — intro simply plays again next time */
  }
}

function removePendingCover(): void {
  document.getElementById("rp-intro-pending-cover")?.remove();
}

export default function OpeningIntro({ children }: Props) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [showWebsite, setShowWebsite] = useState(false);
  const [reduced, setReduced] = useState(false);
  // Decide once per mount — Strict Mode re-runs effects, and the second run
  // would otherwise see the "seen" flag the first run just wrote.
  const playIntro = useRef<boolean | null>(null);

  const finish = useCallback(() => {
    removePendingCover();
    document.body.style.overflow = "";
    setShowWebsite(true);
    setPhase("done");
  }, []);

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduced(prefersReduced);

    if (playIntro.current === null) {
      playIntro.current = !prefersReduced && !introSeen();
    }

    if (!playIntro.current) {
      removePendingCover();
      document.documentElement.dataset.rpReveal = "1";
      setShowWebsite(true);
      setPhase("done");
      return;
    }

    // First visit this session: the intro plays over the already-rendered site
    markIntroSeen();
    removePendingCover();
    delete document.documentElement.dataset.rpReveal;
    setShowWebsite(false);
    setPhase("play");
  }, []);

  useEffect(() => {
    if (!showWebsite) return;
    document.documentElement.dataset.rpReveal = "1";
    window.dispatchEvent(new CustomEvent("rp-site-reveal"));
  }, [showWebsite]);

  useEffect(() => {
    if (phase !== "play") return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Website stays hidden until large-ring hold finishes
    const revealTimer = window.setTimeout(() => {
      setShowWebsite(true);
    }, TIMING.websiteReveal * 1000);

    // Unmount intro only after crossfade completes
    const doneTimer = window.setTimeout(finish, TIMING.complete * 1000);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, [phase, finish]);

  const t = TIMING.complete;

  return (
    <>
      {phase === "play" && (
        <m.div
          className={styles.root}
          role="presentation"
          aria-hidden="true"
        >
          <m.div
            className={styles.backdrop}
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{
              duration: t,
              times: [0, TIMING.websiteReveal / t, 1],
              ease: EASE_PREMIUM,
            }}
          />
          <m.div
            className={styles.ambient}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.5, 0] }}
            transition={{
              duration: t,
              times: [0, TIMING.websiteReveal / t, 1],
              ease: EASE_PREMIUM,
            }}
          />
          <IntroRings reduced={reduced} />
        </m.div>
      )}

      {/* Always painted from the server HTML — no JS needed to see the page.
          On a first visit the opaque intro backdrop covers it, then fades away. */}
      <div className={styles.siteReveal}>{children}</div>
    </>
  );
}
