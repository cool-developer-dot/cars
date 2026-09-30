import type { ReactNode } from "react";
import Link from "next/link";
import HeroPhoto from "@/components/HeroPhoto";
import c from "./content.module.css";

export type Crumb = { label: string; href?: string };

export default function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  chips,
  aside,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  chips?: ReactNode;
  /** Right-hand column on desktop (e.g. a price card) */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className={c.hero}>
      <div className={c.heroPhoto} aria-hidden="true">
        <HeroPhoto />
      </div>
      <div className={c.container}>
        <div className={c.heroGrid}>
          <div>
            <nav aria-label="Breadcrumb">
              <ol className={c.crumbs}>
                {crumbs.map((cr) => (
                  <li key={cr.label}>
                    {cr.href ? (
                      <Link href={cr.href}>{cr.label}</Link>
                    ) : (
                      <span aria-current="page">{cr.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <p className={c.eyebrow}>{eyebrow}</p>
            <h1 className={c.h1}>{title}</h1>
            {lead && <p className={c.lead}>{lead}</p>}
            {chips}
            {children}
          </div>
          {aside}
        </div>
      </div>
    </header>
  );
}
