import type { ReactNode } from "react";
import Section from "./Section";
import { Channels, Chips } from "./blocks";
import s from "./info.module.css";

/**
 * The last section of a policy page, above the footer: the three ways to
 * reach us and links to the related policies.
 */
export default function HelpSection({
  title = ["Questions?", "Talk to Us"],
  lead = "Message us on WhatsApp, call or email. Please give your order number if you have one.",
  related,
}: {
  title?: [string, string];
  lead?: ReactNode;
  /** "See also" links */
  related?: { label: string; href: string }[];
}) {
  return (
    <Section id="contact-us" tone="dark" next="footer" eyebrow="Contact us" title={title} lead={lead}>
      <div className={s.flow}>
        <Channels tone="dark" />
        {related && (
          <div className={s.chipRow}>
            <p className={s.kicker}>See also</p>
            <Chips items={related} />
          </div>
        )}
      </div>
    </Section>
  );
}
