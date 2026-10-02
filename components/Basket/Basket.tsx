"use client";

import Link from "next/link";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Loader2,
  Lock,
  Minus,
  Pencil,
  Plus,
  ShieldCheck,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { EASE_PREMIUM, cardRevealV, revealV } from "@/lib/motion";
import { useHydrationSafeReducedMotion } from "@/lib/useHydrationSafeReducedMotion";
import { COMPANY, CONTACT, gbp } from "@/lib/site";
import { useCart } from "@/contexts/cart/CartProvider";
import { usePromo } from "@/contexts/promo/PromoProvider";
import type { Customer, FinishProduct } from "@/contexts/cart/types";
import PlateRender from "@/components/BuildYourPlate/PlateRender";
import {
  BORDERS,
  INITIAL_BUILD,
  applyPatch,
  sizeById,
  styleById,
  summaryRows,
  type BuildState,
} from "@/components/BuildYourPlate/buildConfig";
import b from "@/components/BuildYourPlate/BuildYourPlate.module.css";
import styles from "./Basket.module.css";

const FREE_DELIVERY_FROM = 15;
const FIRST_CLASS = 3;

const EMPTY_CUSTOMER: Customer = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  postcode: "",
  country: "United Kingdom",
};

type Field = keyof Customer;

const FIELDS: {
  name: Field;
  label: string;
  autoComplete: string;
  type?: string;
  optional?: boolean;
  half?: boolean;
  inputMode?: "email" | "tel" | "text";
}[] = [
  { name: "firstName", label: "First name", autoComplete: "given-name", half: true },
  { name: "lastName", label: "Last name", autoComplete: "family-name", half: true },
  { name: "email", label: "Email", autoComplete: "email", type: "email", inputMode: "email", half: true },
  { name: "phone", label: "Phone", autoComplete: "tel", type: "tel", inputMode: "tel", half: true },
  { name: "address1", label: "Address line 1", autoComplete: "address-line1" },
  { name: "address2", label: "Address line 2", autoComplete: "address-line2", optional: true },
  { name: "city", label: "Town / city", autoComplete: "address-level2", half: true },
  { name: "postcode", label: "Postcode", autoComplete: "postal-code", half: true },
];

const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(c: Customer): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  for (const f of FIELDS) {
    if (!f.optional && !c[f.name].trim()) e[f.name] = `Enter your ${f.label.toLowerCase()}`;
  }
  if (c.email && !EMAIL.test(c.email.trim())) e.email = "Enter a valid email address";
  if (c.phone && c.phone.replace(/[^\d]/g, "").length < 10) e.phone = "Enter a valid phone number";
  if (c.postcode && !UK_POSTCODE.test(c.postcode.trim())) e.postcode = "Enter a valid UK postcode";
  return e;
}

const asBuild = (v: unknown): BuildState | null =>
  v && typeof v === "object" && "styleId" in v ? applyPatch(INITIAL_BUILD, v as BuildState) : null;

/* ——— Pieces ——— */

function Card({ children, className = "", index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  return (
    <m.div
      className={`${styles.card} ${className}`}
      variants={cardRevealV(0.1)}
      custom={index}
      initial="hidden"
      animate="show"
    >
      {children}
    </m.div>
  );
}

function PlatesPreview({ s }: { s: BuildState }) {
  const style = styleById(s.styleId);
  const border = BORDERS.find((x) => x.id === s.border)?.color ?? null;
  const sides = s.amount === "both" ? (["front", "rear"] as const) : ([s.amount] as const);
  return (
    <div className={styles.plates}>
      {sides.map((side) => {
        const size = sizeById(side === "front" ? s.frontSize : s.rearSize);
        return (
          <figure
            key={side}
            className={styles.plateFig}
            style={{ width: `${(size.widthMm / 533) * 100}%` }}
          >
            <PlateRender
              reg={s.reg}
              finish={style.finish}
              face={side === "front" ? "white" : "yellow"}
              badge={s.badge}
              widthMm={size.widthMm}
              heightMm={size.heightMm}
              hex={s.hex}
              borderColor={border}
              edge
            />
            <figcaption>{side === "front" ? "Front" : "Rear"}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

/* ——— Basket ——— */

export default function Basket() {
  const reduced = useHydrationSafeReducedMotion();
  const { hydrated, basket, setQuantity, clearBasket, customer, setCustomer, checkout, sendLead, apiConfigured } =
    useCart();
  const { promoCode, setPromoCode } = usePromo();
  const formId = useId();

  // Untouched fields fall back to this session's saved details
  const [draft, setDraft] = useState<Customer | null>(null);
  const details: Customer = draft ?? { ...EMPTY_CUSTOMER, ...customer };
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref?: string } | null>(null);
  const [promoDraft, setPromoDraft] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);

  const errors = validate(details);
  const showError = (f: Field) => (submitted || touched[f]) && errors[f];

  const build = basket ? asBuild(basket.builder) : null;
  const config = basket?.plate_config;
  const quantity = basket?.quantity ?? 1;
  const subtotal = config ? Number((config.total * quantity).toFixed(2)) : 0;
  const freeDelivery = subtotal >= FREE_DELIVERY_FROM;
  const isLegal = config?.legal_type === "road_legal";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError(null);
    if (!basket) return;
    const firstInvalid = FIELDS.find((f) => errors[f.name]);
    if (firstInvalid) {
      document.getElementById(`${formId}-${firstInvalid.name}`)?.focus();
      return;
    }
    const clean: Customer = {
      ...details,
      email: details.email.trim(),
      postcode: details.postcode.trim().toUpperCase(),
    };
    setCustomer(clean);

    const order: FinishProduct = {
      customer: clean,
      quantity,
      plate_config: basket.plate_config,
      preview_base64: basket.preview_base64,
      ...(promoCode ? { promo_code: promoCode } : {}),
    };

    setPaying(true);
    // Lead capture is best-effort; it never blocks the order
    void sendLead(order);
    const result = await checkout(order);
    if (!result.ok) {
      setPaying(false);
      setError(result.message);
      return;
    }
    if (result.redirectUrl) {
      window.location.assign(result.redirectUrl);
      return;
    }
    clearBasket();
    setPaying(false);
    setDone({ ref: result.orderRef });
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  // Always animate: MotionConfig (reducedMotion="user") makes it instant
  const rv = revealV;

  /* ——— States ——— */

  let body: ReactNode;

  if (done) {
    body = (
      <Card className={styles.stateCard}>
        <span className={styles.stateIcon} data-tone="ok" aria-hidden="true">
          <CheckCircle2 size={34} strokeWidth={1.6} />
        </span>
        <h2 className={styles.stateTitle}>Order placed — thank you</h2>
        {done.ref && (
          <p className={styles.stateRef}>
            Order reference <strong>{done.ref}</strong>
          </p>
        )}
        <p className={styles.stateText}>
          We&apos;ll be in touch about your order. If you have any questions, call{" "}
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> or{" "}
          <a href={CONTACT.whatsappHref}>WhatsApp us</a>.
        </p>
        <Link href="/" className={`${b.btnPrimary} ${styles.stateBtn}`}>
          Back to home
        </Link>
      </Card>
    );
  } else if (!hydrated) {
    body = (
      <div className={styles.skeleton} aria-busy="true" aria-label="Loading your basket">
        <span />
        <span />
      </div>
    );
  } else if (!basket || !config) {
    body = (
      <Card className={styles.stateCard}>
        <div className={styles.emptyPlate} aria-hidden="true">
          <PlateRender
            reg="YOUR REG"
            finish="gel"
            face="yellow"
            badge="uk"
            widthMm={520}
            heightMm={111}
            edge
          />
        </div>
        <h2 className={styles.stateTitle}>Your basket is empty</h2>
        <p className={styles.stateText}>
          Design your plates in the builder — every change previews live, and your price updates as
          you go.
        </p>
        <div className={styles.stateActions}>
          <Link href="/#builder" className={`${b.btnPrimary} ${styles.stateBtn}`}>
            Build my plates
            <ArrowRight size={17} strokeWidth={2.4} aria-hidden="true" />
          </Link>
          <Link href="/plate-styles" className={styles.ghostBtn}>
            Compare plate styles
          </Link>
        </div>
      </Card>
    );
  } else {
    const rows = build ? summaryRows(build).filter((r) => r.label !== "Plate Style") : [];
    const styleName = build ? styleById(build.styleId).name : config.style;

    body = (
      <div className={styles.grid}>
        {/* Item */}
        <Card className={styles.itemCard} index={0}>
          <div className={styles.itemStage}>
            {build ? (
              <PlatesPreview s={build} />
            ) : basket.preview_base64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={basket.preview_base64} alt={`Plates reading ${config.text}`} className={styles.proofImg} />
            ) : null}
          </div>

          <div className={styles.itemBody}>
            <div className={styles.itemHead}>
              <div>
                <h2 className={styles.itemTitle}>{styleName} number plates</h2>
                <div className={styles.chips}>
                  <span className={styles.chip} data-tone={isLegal ? "ok" : "warn"}>
                    {isLegal ? "Road legal" : "Show plate · not road legal"}
                  </span>
                  <span className={styles.chip}>
                    {config.sides === "both" ? "Front & rear pair" : `${config.sides === "front" ? "Front" : "Rear"} plate`}
                  </span>
                </div>
              </div>
              <p className={styles.itemPrice}>
                {gbp(config.total)}
                <small>{quantity > 1 ? "per set" : config.sides === "both" ? "per pair" : "per plate"}</small>
              </p>
            </div>

            {rows.length > 0 && (
              <dl className={styles.specs}>
                {rows.map((r) => (
                  <div key={r.label}>
                    <dt>{r.label}</dt>
                    <dd>{r.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className={styles.itemFoot}>
              <div className={styles.qty} role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} aria-hidden="true" />
                </button>
                <output aria-live="polite" aria-label={`Quantity ${quantity}`}>
                  {quantity}
                </output>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} aria-hidden="true" />
                </button>
              </div>
              <div className={styles.itemActions}>
                <Link href="/?edit=1#builder" className={styles.linkBtn}>
                  <Pencil size={14} aria-hidden="true" />
                  Edit plates
                </Link>
                <button type="button" className={styles.linkBtn} data-tone="danger" onClick={clearBasket}>
                  <Trash2 size={14} aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Details */}
        <Card className={styles.formCard} index={1}>
          <h2 className={styles.cardTitle}>Your details</h2>
          <p className={styles.cardSub}>For delivery and your order confirmation.</p>

          <form id={formId} className={styles.form} onSubmit={onSubmit} noValidate>
            {FIELDS.map((f) => {
              const err = showError(f.name);
              const id = `${formId}-${f.name}`;
              return (
                <div key={f.name} className={`${styles.field} ${f.half ? styles.half : ""}`}>
                  <label htmlFor={id}>
                    {f.label}
                    {f.optional && <span> (optional)</span>}
                  </label>
                  <input
                    id={id}
                    name={f.name}
                    type={f.type ?? "text"}
                    inputMode={f.inputMode}
                    autoComplete={f.autoComplete}
                    value={details[f.name]}
                    onChange={(e) => setDraft({ ...details, [f.name]: e.target.value })}
                    onBlur={() => setTouched((t) => ({ ...t, [f.name]: true }))}
                    aria-invalid={!!err}
                    aria-describedby={err ? `${id}-err` : undefined}
                    className={f.name === "postcode" ? styles.upper : undefined}
                  />
                  {err && (
                    <p id={`${id}-err`} className={styles.fieldError}>
                      {err}
                    </p>
                  )}
                </div>
              );
            })}
            <div className={`${styles.field} ${styles.half}`}>
              <label htmlFor={`${formId}-country`}>Country</label>
              <input id={`${formId}-country`} value={details.country} readOnly aria-readonly="true" />
            </div>
          </form>

          {isLegal && (
            <div className={styles.notice}>
              <FileCheck2 size={20} strokeWidth={1.8} aria-hidden="true" />
              <p>
                <strong>Road-legal plates need a quick document check.</strong> By law we must see proof
                of your name and address and your right to use this registration before we make them.{" "}
                <Link href="/#documents">What you&apos;ll need</Link>
              </p>
            </div>
          )}
        </Card>

        {/* Summary */}
        <Card className={styles.summaryCard} index={2}>
          <h2 className={styles.cardTitle}>Order summary</h2>

          <dl className={styles.totals}>
            <div>
              <dt>
                {styleName} {config.sides === "both" ? "pair" : "plate"}
                {quantity > 1 ? ` × ${quantity}` : ""}
              </dt>
              <dd>{gbp(subtotal)}</dd>
            </div>
            {config.pricing_breakdown.additionPrice > 0 && (
              <div className={styles.totalsSub}>
                <dt>Includes extras</dt>
                <dd>{gbp(config.pricing_breakdown.additionPrice * quantity)}</dd>
              </div>
            )}
            <div>
              <dt>Royal Mail First Class</dt>
              <dd>{freeDelivery ? "Free" : gbp(FIRST_CLASS)}</dd>
            </div>
            {promoCode && (
              <div className={styles.totalsSub}>
                <dt>
                  Promo <span className={styles.promoChip}>{promoCode}</span>
                </dt>
                <dd>At payment</dd>
              </div>
            )}
            <div className={styles.totalRow}>
              <dt>Total</dt>
              <dd>
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.span
                    key={subtotal}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                  >
                    {gbp(subtotal + (freeDelivery ? 0 : FIRST_CLASS))}
                  </m.span>
                </AnimatePresence>
              </dd>
            </div>
          </dl>
          <p className={styles.totalsNote}>
            {freeDelivery
              ? "Free First Class delivery included."
              : `Add ${gbp(FREE_DELIVERY_FROM - subtotal)} more for free First Class delivery.`}{" "}
            Tracked 24 (+£2) and Ilford collection can be chosen at payment.
          </p>

          {/* Promo */}
          <div className={styles.promo}>
            {promoCode ? (
              <p className={styles.promoApplied}>
                <Tag size={14} aria-hidden="true" />
                Code <strong>{promoCode}</strong> will be applied at payment
                <button type="button" onClick={() => setPromoCode("")} aria-label="Remove promo code">
                  <X size={13} aria-hidden="true" />
                </button>
              </p>
            ) : promoOpen ? (
              <form
                className={styles.promoForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  setPromoCode(promoDraft);
                  setPromoOpen(false);
                }}
              >
                <label htmlFor={`${formId}-promo`} className="sr-only">
                  Promo code
                </label>
                <input
                  id={`${formId}-promo`}
                  value={promoDraft}
                  onChange={(e) => setPromoDraft(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  autoComplete="off"
                  autoFocus
                />
                <button type="submit" disabled={!promoDraft.trim()}>
                  Apply
                </button>
              </form>
            ) : (
              <button type="button" className={styles.linkBtn} onClick={() => setPromoOpen(true)}>
                <Tag size={14} aria-hidden="true" />
                Have a promo code?
              </button>
            )}
          </div>

          <button
            type="submit"
            form={formId}
            className={`${b.btnPrimary} ${styles.payBtn}`}
            disabled={paying}
            aria-busy={paying}
          >
            {paying ? (
              <Loader2 className={b.spin} size={19} aria-hidden="true" />
            ) : (
              <Lock size={17} strokeWidth={2.2} aria-hidden="true" />
            )}
            {paying ? "Creating your order…" : "Continue to secure payment"}
          </button>

          <AnimatePresence>
            {error && (
              <m.p
                role="alert"
                className={styles.error}
                initial={reduced ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
              >
                <AlertCircle size={16} aria-hidden="true" />
                {error}
              </m.p>
            )}
          </AnimatePresence>
          {!apiConfigured && process.env.NODE_ENV !== "production" && (
            <p className={styles.devNote}>
              Dev: set <code>NEXT_PUBLIC_ANALYTICS_API</code> to connect checkout.
            </p>
          )}

          <p className={styles.legalLine}>
            By continuing you agree to our <Link href="/terms">terms</Link> and{" "}
            <Link href="/privacy">privacy policy</Link>.
          </p>

          <ul className={styles.assure}>
            <li>
              <ShieldCheck size={16} aria-hidden="true" />
              DVLA registered supplier · RNPS {COMPANY.rnps}
            </li>
            <li>
              <Truck size={16} aria-hidden="true" />
              Order by 2pm weekdays for same-day dispatch aim
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  return (
    <section className={`${b.section} ${styles.page}`} aria-labelledby="basket-title">
      <div className={b.ambient} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <m.p className={b.eyebrow} variants={rv} custom={0} initial="hidden" animate="show">
            <span className={b.eyebrowLine} aria-hidden="true" />
            Your basket
            <span className={b.eyebrowLine} aria-hidden="true" />
          </m.p>
          <m.h1
            id="basket-title"
            className={`${b.title} ${styles.title}`}
            variants={rv}
            custom={0.06}
            initial="hidden"
            animate="show"
          >
            {done ? (
              <>
                All <span className={b.titleAccent}>done.</span>
              </>
            ) : (
              <>
                Almost <span className={b.titleAccent}>yours.</span>
              </>
            )}
          </m.h1>
        </header>
        {body}
      </div>
    </section>
  );
}
