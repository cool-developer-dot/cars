import Link from "next/link";
import { ArrowRight, CreditCard, ShieldCheck, Truck } from "lucide-react";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import h from "@/components/home/home.module.css";
import { pageBuildUrl } from "@/lib/products";
import { COMPANY } from "@/lib/site";
import Rise from "../GuidesReviews/Rise";
import type { ProductPageContent } from "../pageContent";
import FaqList from "./FaqList";
import page from "../page.module.css";
import s from "./FaqCta.module.css";

const TRUST = [
  { Icon: Truck, title: "Fast Dispatch", text: "Order before 2pm" },
  { Icon: ShieldCheck, title: "DVLA Registered", text: `RNPS ${COMPANY.rnps}` },
  { Icon: CreditCard, title: "Secure Checkout", text: "SSL Encrypted" },
] as const;

/**
 * The last thing on a plate-style page: the questions people ask (light), then the
 * final call to action (dark), above the footer. Questions and answers are
 * the product's own (lib/products.ts), so they stay in step with the prices.
 */
export default function FaqCta({ page: content }: { page: ProductPageContent }) {
  const { product, name, nameInText, faq, cta } = content;
  return (
    <>
      {/* ——— FAQs (light) ——— */}
      <section className={`${h.section} ${h.light} ${s.faq}`} aria-labelledby="faq-title">
        <div className={s.car}>
          <picture>
            <source media="(min-width: 1024px)" srcSet={faq.car.src} />
            <img
              src={faq.car.srcMobile}
              alt={faq.car.alt}
              width={faq.car.width}
              height={faq.car.height}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className={`${page.wrap} ${s.faqInner}`}>
          <div className={s.faqCol}>
            <Rise className={s.head}>
              <p className={h.eyebrow}>FAQs</p>
              <h2 id="faq-title" className={`${h.title} ${s.title}`}>
                {faq.heading ? (
                  <>
                    {faq.heading[0]} <span className={h.accent}>{faq.heading[1]}</span>
                  </>
                ) : (
                  <>
                    {name} Number Plate <span className={h.accent}>FAQs</span>
                  </>
                )}
              </h2>
              <p className={`${h.lead} ${s.lead}`}>
                Quick answers to the most common questions about our {nameInText} number plates.
              </p>
            </Rise>

            <FaqList items={product.faqs} label={`${name} number plate questions`} />
          </div>
        </div>

        {/* Into "Order your … number plates" (dark) */}
        <NeonEdge fill="#06111f" light />
      </section>

      {/* ——— Final call to action (dark) ——— */}
      <section className={`${h.section} ${h.dark} ${s.cta}`} aria-labelledby="cta-title">
        <div className={s.plate} aria-hidden="true">
          <picture>
            <source media="(min-width: 1024px)" srcSet={cta.plate.src} />
            <img
              src={cta.plate.srcMobile}
              alt=""
              width={680}
              height={373}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div className={`${page.wrap} ${s.ctaInner}`}>
          <Rise className={s.head}>
            <p className={h.eyebrow}>Ready to order</p>
            <h2 id="cta-title" className={`${h.title} ${s.title}`}>
              Order Your <span className={h.accent}>{name} Number Plates</span>
            </h2>
            <p className={`${h.lead} ${s.lead}`}>
              Enter your registration, choose your options, and preview your {nameInText} number
              plates before you buy.
            </p>
          </Rise>

          <Rise index={1} className={s.actions}>
            <Link href={pageBuildUrl(product)} className={`${h.btn} ${s.btn}`}>
              Build My {name} Plates
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
