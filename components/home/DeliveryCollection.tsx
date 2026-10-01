import { ArrowRight, CircleCheck, Info, MapPin, MessageCircle, Truck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { COMPANY, CONTACT, DELIVERY } from "@/lib/site";
import { StoreFront, VanArt } from "./Art";
import h from "./home.module.css";
import s from "./DeliveryCollection.module.css";

export default function DeliveryCollection() {
  return (
    <section
      id="delivery"
      className={`${h.section} ${h.light} ${s.section}`}
      aria-labelledby="delivery-title"
    >
      <div className={s.inner}>
        <Reveal className={s.head}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Delivery &amp; collection</p>
          <h2 id="delivery-title" className={s.title}>
            Royal Mail delivery or
            <br />
            <span className={s.accent}>Ilford collection.</span>
          </h2>
          <p className={s.sub}>
            Order online and we&rsquo;ll make your plates to the legal requirements,
            with fast Royal Mail delivery or collection from our Ilford collection
            point.
          </p>
        </Reveal>

        <div className={s.grid}>
          {/* Royal Mail */}
          <Reveal index={0} className={`${s.card} ${s.deliveryCard}`}>
            <VanArt className={s.van} />
            <div className={s.cardBody}>
              <div className={s.cardHead}>
                <span className={s.icon} aria-hidden="true">
                  <Truck strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className={s.cardTitle}>Royal Mail delivery</h3>
                  <p className={s.cardSub}>
                    Our standard delivery is Royal Mail First Class with their
                    next-working-day aim (including Saturday).
                  </p>
                </div>
              </div>
              <ul className={s.checks}>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    Royal Mail First Class: £3 on orders under £15, free on orders of
                    £15 or more
                  </span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>Next-working-day aim (including Saturday)</span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>Add Tracked 24 for £2 at checkout for tracking</span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    Order before 2pm (Mon–Fri) and we aim to dispatch the same day
                    once your documents and order are checked
                  </span>
                </li>
              </ul>
              <p className={s.note}>
                <Info aria-hidden="true" />
                <span>
                  Delivery times are Royal Mail&rsquo;s aims, not guarantees. A Friday
                  order may not arrive until the following week, and we don&rsquo;t
                  promise Saturday or Monday arrival.
                </span>
              </p>
            </div>
          </Reveal>

          {/* Ilford */}
          <Reveal index={1} className={`${s.card} ${s.collectCard}`}>
            <StoreFront className={s.store} />
            <div id="collection" className={`${s.cardBody} ${s.collectBody}`}>
              <div className={s.cardHead}>
                <span className={`${s.icon} ${s.pin}`} aria-hidden="true">
                  <MapPin strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className={s.cardTitle}>Collect from Ilford</h3>
                  <p className={s.cardSub}>Collection point: {COMPANY.collection}.</p>
                </div>
              </div>
              <ul className={`${s.checks} ${s.collectChecks}`}>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>
                    Ready within 3 hours
                    <small>(contact us via WhatsApp to confirm)</small>
                  </span>
                </li>
                <li>
                  <CircleCheck aria-hidden="true" />
                  <span>Please confirm before travelling</span>
                </li>
              </ul>
              <a
                href={CONTACT.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={s.whatsapp}
              >
                <MessageCircle strokeWidth={2} aria-hidden="true" />
                WhatsApp to confirm collection
                <ArrowRight strokeWidth={2.4} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className={s.infoBar}>
            <Info strokeWidth={1.8} aria-hidden="true" />
            <span>{DELIVERY.noBranches.replace("elsewhere we", "everywhere else we")}</span>
          </p>
        </Reveal>
      </div>

      {/* Into How to order (dark) */}
      <NeonEdge fill="#06111f" light />
    </section>
  );
}
