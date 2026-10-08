"use client";

import { useEffect, useState } from "react";
import s from "./info.module.css";

type Link = { id: string; num?: string; title: string };

/** Contents list for a policy; with `spy`, marks the clause you're reading */
export default function Toc({ links, label, spy = false }: { links: Link[]; label: string; spy?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!spy) return;
    const els = links.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        // the first clause on screen, in document order
        const first = links.find((l) => seen.get(l.id));
        setActive(first ? first.id : null);
      },
      { rootMargin: "-110px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links, spy]);

  return (
    <nav aria-label={label}>
      <ol className={s.tocList}>
        {links.map(({ id, num, title }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={active === id ? "true" : undefined}>
              {num && <span className={s.tocNum}>{num}</span>}
              <span>{title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
