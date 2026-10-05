import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, Truck } from "lucide-react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { builderUrl } from "@/lib/builderLink";
import { PRODUCTS } from "@/lib/products";
import { COMPANY } from "@/lib/site";
import Rise from "../GuidesReviews/Rise";
import FaqList from "./FaqList";
import s from "./FaqCta.module.css";

const product = PRODUCTS["3d"];

const TRUST = [
  { Icon: Truck, title: "Fast Dispatch", text: "Order before 2pm" },
  { Icon: ShieldCheck, title: "DVLA Registered", text: `RNPS ${COMPANY.rnps}` },
  { Icon: CreditCard, title: "Secure Checkout", text: "SSL Encrypted" },
] as const;

/**
 * The last thing on the 3D page: the questions people ask (light), then the
 * final call to action (dark), above the footer. Questions and answers are
 * the product's own (lib/products.ts), so they stay in step with the prices.
 */
export default function FaqCta3D() {
  return (
    <>
      {/* ——— FAQs (light) ——— */}
      <section className={`${h.section} ${h.light} ${s.faq}`} aria-labelledby="faq3d-title">
        <div className={s.car}>
          <picture>
            <source media="(min-width: 1024px)" srcSet="/3d/faq-car.webp" />
            <img
              src="/3d/faq-car-mobile.webp"
              alt="A grey car fitted with a white 3D number plate reading AB12 CDE"
              width={700}
              height={742}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className={s.faqInner}>
          <Rise className={s.head}>
            <p className={h.eyebrow}>FAQs</p>
            <h2 id="faq3d-title" className={`${h.title} ${s.title}`}>
              3D Number Plate <span className={h.accent}>FAQs</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              Quick answers to the most common questions about our 3D number plates.
            </p>
          </Rise>

          <FaqList items={product.faqs} label="3D number plate questions" />
        </div>

        {/* Into "Order your 3D number plates" (dark) */}
        <NeonEdge fill="#06111f" light />
      </section>

      {/* ——— Final call to action (dark) ——— */}
      <section className={`${h.section} ${h.dark} ${s.cta}`} aria-labelledby="cta3d-title">
        <div className={s.plate} aria-hidden="true">
          <picture>
            <source media="(min-width: 1024px)" srcSet="/3d/cta-plate.webp" />
            <img
              src="/3d/cta-plate-mobile.webp"
              alt=""
              width={680}
              height={373}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className={s.ctaInner}>
          <Rise className={s.head}>
            <p className={h.eyebrow}>Ready to order</p>
            <h2 id="cta3d-title" className={`${h.title} ${s.title}`}>
              Order Your <span className={h.accent}>3D Number Plates</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              Enter your registration, choose your options, and preview your 3D number plates
              before you buy.
            </p>
          </Rise>

          <Rise index={1} className={s.actions}>
            <Link href={builderUrl({ style: product.id })} className={`${h.btn} ${s.btn}`}>
              Build My 3D Plates
              <ArrowRight strokeWidth={2.2} aria-hidden="true" />
            </Link>

            <ul className={s.trust}>
              {TRUST.map(({ Icon, title, text }) => (
                <li key={title} className={s.point}>
                  <Icon className={s.pointIcon} strokeWidth={1.7} aria-hidden="true" />
                  <span className={s.pointCopy}>
                    <span className={s.pointTitle}>{title}</span>
                    <span className={s.pointText}>{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Rise>
        </div>

        {/* Into the footer */}
        <NeonEdge fill="#040c16" />
      </section>
    </>
  );
}
