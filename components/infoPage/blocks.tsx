import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check, Info, Mail, MapPin, Phone, X, type LucideIcon } from "lucide-react";
import Rise from "@/components/productPage/GuidesReviews/Rise";
import { WhatsAppIcon } from "@/components/productPage/deliveryIcons";
import h from "@/components/home/home.module.css";
import { COMPANY, CONTACT } from "@/lib/site";
import type { Tone } from "./shared";
import s from "./info.module.css";

/* Building blocks for the essential pages. Each takes the tone of the
   section it sits in: liquid glass on dark sections, light glass on pale. */

const glass = (tone: Tone) => (tone === "dark" ? h.liquid : h.glassLight);

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** A link that opens off-site targets in a new tab and keeps internal ones client-side */
export function SmartLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={className} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** "Read more →" text link */
export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  const out = href.startsWith("http");
  return (
    <SmartLink href={href} className={s.more}>
      {children}
      {out ? <ArrowUpRight strokeWidth={2.2} aria-hidden="true" /> : <ArrowRight strokeWidth={2.2} aria-hidden="true" />}
    </SmartLink>
  );
}

/** The site's compact buttons: solid blue, or a glass outline */
export function Button({
  href,
  children,
  ghost = false,
  Icon = ArrowRight,
}: {
  href: string;
  children: ReactNode;
  ghost?: boolean;
  Icon?: LucideIcon | ((p: { className?: string }) => ReactNode);
}) {
  return (
    <SmartLink href={href} className={ghost ? s.ghostBtn : `${h.btn} ${s.btn}`}>
      {children}
      <Icon className={s.btnIcon} aria-hidden="true" />
    </SmartLink>
  );
}

/* ——— Cards ——— */

export type CardItem = {
  title: string;
  text: ReactNode;
  Icon?: LucideIcon;
  /** A photo across the top of the card, feathered into it */
  img?: { src: string; alt?: string; position?: string };
  /** Small pill in the corner (e.g. "12 months") */
  badge?: string;
  href?: string;
  link?: string;
};

export function Cards({
  tone,
  items,
  cols = 3,
  compact = false,
  className,
}: {
  tone: Tone;
  items: CardItem[];
  cols?: 2 | 3 | 4;
  /** Phones: photo beside the copy instead of above it, so a long list stays short */
  compact?: boolean;
  className?: string;
}) {
  return (
    <ul className={`${s.cards} ${s[`cols${cols}`]} ${compact ? s.compact : ""} ${className ?? ""}`}>
      {items.map((c, i) => (
        <Rise as="li" key={c.title} index={i % cols} className={`${glass(tone)} ${s.card} ${c.img ? s.cardMedia : ""}`}>
          {c.img && (
            <div className={s.cardImg}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img.src}
                alt={c.img.alt ?? ""}
                loading="lazy"
                decoding="async"
                style={c.img.position ? { objectPosition: c.img.position } : undefined}
              />
            </div>
          )}
          <div className={s.cardBody}>
            {(c.Icon || c.badge) && (
              <div className={s.cardTop}>
                {c.Icon && (
                  <span className={tone === "dark" ? h.iconBlue : h.iconSoft} aria-hidden="true">
                    <c.Icon strokeWidth={1.9} />
                  </span>
                )}
                {c.badge && <span className={s.badge}>{c.badge}</span>}
              </div>
            )}
            <h3 className={s.cardTitle}>{c.title}</h3>
            <div className={s.cardText}>{c.text}</div>
            {c.href && c.link && (
              <p className={s.cardLink}>
                <MoreLink href={c.href}>{c.link}</MoreLink>
              </p>
            )}
          </div>
        </Rise>
      ))}
    </ul>
  );
}

/** Icon rows on one glass panel, divided by hairlines — for lists that don't fill a grid */
export function Rows({ tone, items, className }: { tone: Tone; items: CardItem[]; className?: string }) {
  return (
    <Rise className={`${glass(tone)} ${s.rows} ${className ?? ""}`}>
      <ul className={s.rowList}>
        {items.map((c) => (
          <li key={c.title} className={s.row}>
            {c.Icon && (
              <span className={tone === "dark" ? h.iconBlue : h.iconSoft} aria-hidden="true">
                <c.Icon strokeWidth={1.9} />
              </span>
            )}
            <div className={s.rowCopy}>
              <h3 className={s.cardTitle}>{c.title}</h3>
              <div className={s.cardText}>{c.text}</div>
              {c.href && c.link && (
                <p className={s.rowLink}>
                  <MoreLink href={c.href}>{c.link}</MoreLink>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Rise>
  );
}

/** A glass panel for free-form content */
export function Panel({
  tone,
  children,
  className,
  index = 0,
}: {
  tone: Tone;
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <Rise index={index} className={`${glass(tone)} ${s.panel} ${className ?? ""}`}>
      {children}
    </Rise>
  );
}

/* ——— Tables: a real table from tablet up, labelled rows on phones ——— */

export function Table({
  tone,
  head,
  rows,
  align,
  caption,
  className,
}: {
  tone: Tone;
  head: string[];
  rows: ReactNode[][];
  /** Per column; numbers read best right-aligned */
  align?: ("left" | "right")[];
  caption?: string;
  className?: string;
}) {
  return (
    <Rise className={`${glass(tone)} ${s.tableWrap} ${head.length === 2 ? s.twoCol : ""} ${className ?? ""}`}>
      <table className={s.table}>
        {caption && <caption className={s.caption}>{caption}</caption>}
        <thead>
          <tr>
            {head.map((label, i) => (
              <th key={label} scope="col" className={align?.[i] === "right" ? s.right : undefined}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={i} data-label={head[i]} className={align?.[i] === "right" ? s.right : undefined}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Rise>
  );
}

/** Label / value pairs (company details, a document's facts) */
export function Details({ items, className }: { items: [string, ReactNode][]; className?: string }) {
  return (
    <dl className={`${s.details} ${className ?? ""}`}>
      {items.map(([label, value]) => (
        <div key={label} className={s.detail}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ——— Lists and notes ——— */

export function Checklist({
  items,
  cols = 1,
  cross = false,
  className,
}: {
  items: ReactNode[];
  cols?: 1 | 2;
  /** Crosses instead of ticks: things that are excluded */
  cross?: boolean;
  className?: string;
}) {
  return (
    <ul className={`${s.checks} ${cols === 2 ? s.checks2 : ""} ${className ?? ""}`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className={`${s.tick} ${cross ? s.cross : ""}`} aria-hidden="true">
            {cross ? <X strokeWidth={3} /> : <Check strokeWidth={3} />}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A slim callout: icon, optional bold lead-in, text */
export function Note({
  tone,
  children,
  Icon = Info,
  title,
  className,
}: {
  tone: Tone;
  children: ReactNode;
  Icon?: LucideIcon;
  title?: string;
  className?: string;
}) {
  return (
    <Rise className={`${s.note} ${s[`note_${tone}`]} ${className ?? ""}`}>
      <Icon className={s.noteIcon} strokeWidth={2} aria-hidden="true" />
      <div className={s.noteText}>
        {title && <strong className={s.noteTitle}>{title}</strong>}
        {children}
      </div>
    </Rise>
  );
}

/** Pills, optionally links */
export function Chips({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <ul className={`${s.chips} ${className ?? ""}`}>
      {items.map(({ label, href }) => (
        <li key={label}>
          {href ? (
            <SmartLink href={href} className={`${s.chip} ${s.chipLink}`}>
              {label}
            </SmartLink>
          ) : (
            <span className={s.chip}>{label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ——— Copy beside a photo feathered into the section ——— */

export function Media({
  img,
  children,
  side = "right",
  className,
}: {
  img: { src: string; width: number; height: number; alt: string; position?: string };
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  return (
    <div className={`${s.media} ${side === "left" ? s.mediaLeft : ""} ${className ?? ""}`}>
      <Rise className={s.mediaCopy}>{children}</Rise>
      <div className={s.mediaImg}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          decoding="async"
          style={img.position ? { objectPosition: img.position } : undefined}
        />
      </div>
    </div>
  );
}

/* ——— Numbered steps ——— */

export function Steps({
  tone,
  items,
  className,
}: {
  tone: Tone;
  items: { title: string; text: ReactNode }[];
  className?: string;
}) {
  return (
    <ol className={`${s.steps} ${items.length === 4 ? s.steps4 : ""} ${className ?? ""}`}>
      {items.map((step, i) => (
        <Rise as="li" key={step.title} index={i} className={`${glass(tone)} ${s.step}`}>
          <span className={s.stepNum} aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3 className={s.cardTitle}>{step.title}</h3>
            <div className={s.cardText}>{step.text}</div>
          </div>
        </Rise>
      ))}
    </ol>
  );
}

/* ——— The ways to reach us ——— */

const CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: CONTACT.whatsapp,
    href: CONTACT.whatsappHref,
    Icon: WhatsAppIcon,
    action: "Message us",
  },
  { id: "phone", label: "Telephone", value: CONTACT.phone, href: CONTACT.phoneHref, Icon: Phone, action: "Call us" },
  { id: "email", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, Icon: Mail, action: "Email us" },
] as const;

/** WhatsApp, telephone and email as three equal cards; `post` adds the registered office */
export function Channels({
  tone,
  post = false,
  stack = false,
  className,
}: {
  tone: Tone;
  post?: boolean;
  /** One per row at every width (a narrow column, e.g. the hero) */
  stack?: boolean;
  className?: string;
}) {
  const items = post
    ? [
        ...CHANNELS,
        {
          id: "post",
          label: "Post",
          value: `${COMPANY.legalName}, ${COMPANY.registeredOffice}`,
          href: "",
          Icon: MapPin,
          action: "",
        },
      ]
    : CHANNELS;
  return (
    <ul className={`${s.channels} ${stack ? s.channelsStack : post ? s.channels4 : ""} ${className ?? ""}`}>
      {items.map(({ id, label, value, href, Icon, action }, i) => {
        const body = (
          <>
            <span className={tone === "dark" ? h.iconBlue : h.iconSoft} aria-hidden="true">
              <Icon className={s.channelIcon} />
            </span>
            <span className={s.channelText}>
              <span className={s.channelLabel}>{label}</span>
              <span className={s.channelValue}>{value}</span>
            </span>
            {action && (
              <span className={s.channelAction}>
                {action}
                <ArrowRight strokeWidth={2.2} aria-hidden="true" />
              </span>
            )}
          </>
        );
        return (
          <Rise as="li" key={id} index={i} className={`${glass(tone)} ${s.channel}`}>
            {href ? (
              <SmartLink href={href} className={s.channelLink}>
                {body}
              </SmartLink>
            ) : (
              <div className={s.channelLink}>{body}</div>
            )}
          </Rise>
        );
      })}
    </ul>
  );
}
