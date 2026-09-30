"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { m } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { cardRevealV, inViewOnce } from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import HeroPhoto from "@/components/HeroPhoto";
import { COMPANY, CONTACT } from "@/lib/site";
import { FOOTER_COLUMNS, LEGAL_LINKS, SOCIALS } from "./footerConfig";
import {
  ApplePayMark,
  GooglePayMark,
  MastercardMark,
  PayPalMark,
  SOCIAL_ICONS,
  UkFlag,
  VisaMark,
} from "./brandIcons";
import styles from "./Footer.module.css";

const FEATURES = [
  { Icon: ShieldCheck, title: "DVLA-registered", text: `Supplier ID (RNPS) ${COMPANY.rnps}` },
  { Icon: Truck, title: "Royal Mail Delivery", text: "Free First Class on orders of £15+" },
  { Icon: Clock, title: "Same-Day Dispatch Aim", text: "Order by 2pm Mon–Fri" },
  { Icon: MapPin, title: "Ilford Collection", text: "Ready within 3 hours" },
];

const PAYMENTS = [
  { label: "Visa", Mark: VisaMark },
  { label: "Mastercard", Mark: MastercardMark },
  { label: "Apple Pay", Mark: ApplePayMark },
  { label: "Google Pay", Mark: GooglePayMark },
  { label: "PayPal", Mark: PayPalMark },
];

const colV = cardRevealV(0.05);

function Subscribe() {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "needsConsent" | "done">("idle");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setStatus("needsConsent");
      return;
    }
    // TODO: send to the mailing-list provider
    setStatus("done");
    setEmail("");
  };

  if (status === "done") {
    return (
      <p className={styles.subscribed} role="status">
        <span className={styles.subscribedIcon} aria-hidden="true">
          <Check size={16} strokeWidth={2.6} />
        </span>
        Thanks — you’re on the list.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <Mail className={styles.fieldIcon} aria-hidden="true" />
        <label htmlFor="footer-email" className={styles.srOnly}>
          Email address
        </label>
        <input
          id="footer-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email address"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className={styles.submit} aria-label="Subscribe">
          <ArrowRight size={20} strokeWidth={2.4} />
        </button>
      </div>
      <label className={styles.consent}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            if (e.target.checked) setStatus("idle");
          }}
        />
        <span>
          I agree to receive marketing emails. You can unsubscribe at any time.
        </span>
      </label>
      {status === "needsConsent" && (
        <p className={styles.formError} role="alert">
          Please tick the box to confirm you’d like our emails.
        </p>
      )}
    </form>
  );
}

export default function Footer() {
  const reduced = useHydrationSafeReducedMotion();
  const reveal = (i: number) =>
    reduced
      ? {}
      : {
          variants: colV,
          custom: i,
          ...inViewOnce,
          viewport: { once: true, amount: 0.2 },
        };

  return (
    <footer className={styles.footer}>
      {/* ——— Night-scene band with the feature bar ——— */}
      <div className={styles.scene}>
        <div className={styles.sceneImage} aria-hidden="true">
          <HeroPhoto className={styles.scenePhoto} />
        </div>
        <svg
          className={styles.sceneArc}
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path className={styles.sceneArcGlow} d="M0 40C220 120 420 150 720 150S1220 120 1440 20" />
          <path d="M0 40C220 120 420 150 720 150S1220 120 1440 20" />
        </svg>

        <m.ul className={styles.features} {...reveal(0)}>
          {FEATURES.map(({ Icon, title, text }) => (
            <li key={title} className={styles.feature}>
              <span className={styles.featureIcon} aria-hidden="true">
                <Icon strokeWidth={1.7} />
              </span>
              <span>
                <strong className={styles.featureTitle}>{title}</strong>
                <span className={styles.featureText}>{text}</span>
              </span>
            </li>
          ))}
        </m.ul>
      </div>

      <div className={styles.inner}>
        {/* ——— Main grid ——— */}
        <div className={styles.grid}>
          <m.div className={styles.brand} {...reveal(0)}>
            <Link href="/" className={styles.logoLink} aria-label="ReplacementPlates.uk home">
              <Image
                src="/logo-rp.webp"
                alt="ReplacementPlates.uk"
                width={922}
                height={194}
                className={styles.logo}
              />
            </Link>
            <p className={styles.blurb}>
              Replacement number plates made to order by a DVLA-registered
              supplier. Royal Mail delivery or collection from Ilford.
            </p>
            <ul className={styles.contact}>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={styles.contactLink}>
                  <Mail aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className={styles.contactLink}>
                  <Phone aria-hidden="true" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  className={styles.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  WhatsApp {CONTACT.whatsapp}
                </a>
              </li>
            </ul>
            <ul className={styles.socials}>
              {SOCIALS.map(({ label, icon, href }) => {
                const Icon = SOCIAL_ICONS[icon];
                return (
                  <li key={label}>
                    <a
                      href={href}
                      className={styles.social}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className={styles.socialIcon} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </m.div>

          {FOOTER_COLUMNS.map((col, i) => (
            <m.nav
              key={col.title}
              className={styles.col}
              aria-label={col.title}
              {...reveal(i + 1)}
            >
              <h2 className={styles.colTitle}>{col.title}</h2>
              <ul className={styles.links}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={styles.link}>
                      <span>{link.label}</span>
                      <ChevronRight
                        className={styles.linkChevron}
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </m.nav>
          ))}

          <m.div className={styles.newsletter} {...reveal(4)}>
            <h2 className={styles.colTitle}>Subscribe for updates</h2>
            <p className={styles.newsText}>
              Get the latest offers, new styles and exclusive updates straight
              to your inbox.
            </p>
            <Subscribe />
          </m.div>
        </div>

        {/* ——— Trust row ——— */}
        <div className={styles.trustRow}>
          <div className={styles.ukBadge}>
            <UkFlag className={styles.ukFlag} />
            <span>
              <strong className={styles.ukTitle}>Proudly based in the UK</strong>
              <span className={styles.ukText}>
                High quality number plates, for every journey.
              </span>
            </span>
          </div>

          <div className={styles.payments}>
            <span className={styles.paymentsLabel}>We accept</span>
            <ul className={styles.paymentList}>
              {PAYMENTS.map(({ label, Mark }) => (
                <li key={label} className={styles.payment} title={label}>
                  <Mark />
                  <span className={styles.srOnly}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.soldBadge}>
            <span className={styles.soldIcon} aria-hidden="true">
              <BadgeCheck />
            </span>
            <span>
              <strong className={styles.soldValue}>{COMPANY.platesSold} plates sold</strong>
              <span className={styles.soldText}>since {COMPANY.platesSoldSince}</span>
            </span>
          </div>
        </div>

        {/* ——— Company details ——— */}
        <p className={styles.company}>
          {COMPANY.brand} is a trading name of {COMPANY.legalName} (company
          number {COMPANY.companyNumber}). Registered office:{" "}
          {COMPANY.registeredOffice}. Collection: {COMPANY.collection}.
          DVLA-registered number plate supplier, RNPS {COMPANY.rnps}.
        </p>

        {/* ——— Legal ——— */}
        <div className={styles.legal}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} ReplacementPlates.uk. All rights
            reserved.
          </p>
          <ul className={styles.legalLinks}>
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.legalLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
