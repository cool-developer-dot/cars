import type { ReactNode } from "react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import h from "@/components/home/home.module.css";
import p from "@/components/productPage/page.module.css";
import { EDGE_FILL, noOrphan, type Next, type Tone } from "./shared";
import s from "./info.module.css";

/**
 * One section of an essential page: the site's light or dark shell, the page
 * container, the shared heading (eyebrow, two-tone H2, intro) and the neon
 * edge into the next section, filled with that section's top colour.
 */
export default function Section({
  id,
  tone,
  next,
  eyebrow,
  title,
  lead,
  children,
  side = false,
  className,
}: {
  /** Anchor for links into this section; the heading id is derived from it */
  id: string;
  tone: Tone;
  /** What follows this section: sets the divider's fill */
  next: Next;
  eyebrow?: string;
  /** [plain, highlighted] */
  title?: [string, string];
  lead?: ReactNode;
  children?: ReactNode;
  /** Desktop: the heading in a column beside the content instead of above it */
  side?: boolean;
  className?: string;
}) {
  const headingId = `${id}-title`;
  const head = title && (
    <Rise className={`${s.head} ${side ? s.sideHead : ""}`}>
      {eyebrow && <p className={h.eyebrow}>{eyebrow}</p>}
      <h2 id={headingId} className={`${h.title} ${s.title}`}>
        {title[0]} <span className={h.accent}>{noOrphan(title[1])}</span>
      </h2>
      {lead && <div className={`${h.lead} ${s.lead}`}>{lead}</div>}
    </Rise>
  );
  return (
    <section
      id={id}
      className={`${h.section} ${h[tone]} ${s.section} ${s[tone]} ${className ?? ""}`}
      aria-labelledby={title ? headingId : undefined}
    >
      <div className={p.wrap}>
        {side ? (
          <div className={s.sideLayout}>
            {head}
            <div className={s.sideBody}>{children}</div>
          </div>
        ) : (
          <>
            {head}
            {children}
          </>
        )}
      </div>

      <NeonEdge fill={EDGE_FILL[next]} light={tone === "light"} />
    </section>
  );
}
