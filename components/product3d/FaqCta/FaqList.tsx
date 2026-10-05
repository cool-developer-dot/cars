"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { m } from "framer-motion";
import { cardRevealV, inViewOnce } from "@/lib/motion";
import type { Faq } from "@/lib/faqs";
import s from "./FaqCta.module.css";

const itemV = cardRevealV(0.05);
const viewport = { once: true, amount: 0.3 };

/**
 * Numbered question list, all closed to start with. One answer is open at a
 * time. The rows reveal with the shared variants, which always run: people
 * who ask for reduced motion are handled once by MotionConfig in MotionProvider.
 */
export default function FaqList({ items, label }: { items: Faq[]; label: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <ol className={s.list} aria-label={label}>
      {items.map((faq, i) => {
        const open = openId === faq.id;
        const btnId = `${baseId}-q-${faq.id}`;
        const panelId = `${baseId}-a-${faq.id}`;
        return (
          <m.li
            key={faq.id}
            className={`${s.item} ${open ? s.itemOpen : ""}`}
            custom={Math.min(i, 6)}
            variants={itemV}
            {...inViewOnce}
            viewport={viewport}
          >
            <h3 className={s.qHeading}>
              <button
                id={btnId}
                type="button"
                className={s.question}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : faq.id)}
              >
                <span className={s.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={s.qText}>{faq.q}</span>
                <span className={s.chev} aria-hidden="true">
                  <ChevronDown strokeWidth={2.2} />
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} className={s.panel} inert={!open}>
              <div className={s.panelInner}>
                <p className={s.answer}>{faq.a}</p>
              </div>
            </div>
          </m.li>
        );
      })}
    </ol>
  );
}
