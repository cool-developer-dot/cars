"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowRight, ChevronDown, MessageCircleQuestionMark } from "lucide-react";
import { cardRevealV, inViewOnce } from "@/lib/motion";
import type { Faq } from "@/lib/faqs";
import styles from "./Faqs.module.css";

const itemV = cardRevealV(0.08);
const itemViewport = { once: true, amount: 0.4 };

/** Single-open accordion used by the homepage FAQ section and content pages. */
export default function FaqAccordion({
  items,
  firstOpen = false,
  className = "",
}: {
  items: Faq[];
  firstOpen?: boolean;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(
    firstOpen ? items[0]?.id ?? null : null,
  );
  const baseId = useId();

  return (
    <ul className={`${styles.list} ${className}`}>
      {items.map((faq, i) => {
        const open = openId === faq.id;
        const btnId = `${baseId}-q-${faq.id}`;
        const panelId = `${baseId}-a-${faq.id}`;
        return (
          <m.li
            key={faq.id}
            className={`${styles.item} ${open ? styles.itemOpen : ""}`}
            custom={Math.min(i, 5)}
            variants={itemV}
            {...inViewOnce}
            viewport={itemViewport}
          >
            <h3 className={styles.qHeading}>
              <button
                id={btnId}
                type="button"
                className={styles.question}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : faq.id)}
              >
                <span className={styles.qIcon} aria-hidden="true">
                  <MessageCircleQuestionMark strokeWidth={1.6} />
                </span>
                <span className={styles.qText}>{faq.q}</span>
                <span className={styles.toggle} aria-hidden="true">
                  <ChevronDown size={18} strokeWidth={2.4} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={styles.panel}
              inert={!open}
            >
              <div className={styles.panelInner}>
                <div className={styles.answer}>
                  <p>{faq.a}</p>
                  {faq.links && (
                    <p className={styles.answerLinks}>
                      {faq.links.map((l) => (
                        <Link key={l.href} href={l.href} className={styles.answerLink}>
                          {l.label}
                          <ArrowRight size={14} strokeWidth={2.4} aria-hidden="true" />
                        </Link>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </m.li>
        );
      })}
    </ul>
  );
}
