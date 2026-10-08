import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import h from "@/components/home/home.module.css";
import Toc from "./Toc";
import s from "./info.module.css";

export type Clause = {
  id: string;
  /** "1", "2"… shown before the title and in the contents */
  num?: string;
  title: string;
  body: ReactNode;
};

/**
 * A policy laid out for reading: a contents list beside the document on
 * desktop (sticky, following your place), a closed "On this page" list on
 * phones, and the clauses on one frosted sheet. Sits in a light section.
 */
export default function LegalDoc({ clauses, label }: { clauses: Clause[]; label: string }) {
  const links = clauses.map(({ id, num, title }) => ({ id, num, title }));
  return (
    <div className={s.doc}>
      <details className={`${h.glassLight} ${s.tocMobile}`}>
        <summary>
          On this page
          <ChevronDown className={s.tocChev} strokeWidth={2.2} aria-hidden="true" />
        </summary>
        <Toc links={links} label={`${label}: contents`} />
      </details>

      <aside className={`${h.glassLight} ${s.tocDesktop}`}>
        <p className={s.tocTitle}>On this page</p>
        <Toc links={links} label={`${label}: contents`} spy />
      </aside>

      <article className={`${h.glassLight} ${s.docBody}`} aria-label={label}>
        {clauses.map(({ id, num, title, body }) => (
          <section key={id} id={id} className={s.clause} aria-labelledby={`${id}-h`}>
            <h2 id={`${id}-h`} className={s.clauseTitle}>
              {num && <span className={s.clauseNum}>{num}</span>}
              <span>{title}</span>
            </h2>
            <div className={s.prose}>{body}</div>
          </section>
        ))}
      </article>
    </div>
  );
}
