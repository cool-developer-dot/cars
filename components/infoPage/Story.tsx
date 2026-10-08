import type { ReactNode } from "react";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import s from "./Story.module.css";

export type Chapter = { title: string; body: ReactNode; visual: ReactNode };

/**
 * Numbered chapters, each beside its picture; the pictures alternate sides
 * on desktop and sit above the copy on phones. Joined by a thin rail.
 */
export default function Story({ chapters }: { chapters: Chapter[] }) {
  return (
    <ol className={s.story}>
      {chapters.map((c, i) => (
        <li key={c.title} className={`${s.chapter} ${i % 2 ? s.flip : ""}`}>
          <Rise className={s.copy}>
            <span className={s.num} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={s.title}>{c.title}</h3>
            <div className={s.body}>{c.body}</div>
          </Rise>
          <Rise index={1} className={s.visual}>
            {c.visual}
          </Rise>
        </li>
      ))}
    </ol>
  );
}
