import { Car, CarFront, Check, FileText, IdCard, ShieldCheck } from "lucide-react";
import PlateArt from "@/components/home/PlateArt";
import { RoyalMailMark } from "@/components/productPage/deliveryIcons";
import { FROM_PRICE, gbp } from "@/lib/site";
import s from "./illustrations.module.css";

/* Decorative pictures for the essential pages, drawn in CSS so they stay sharp
   at any size. All aria-hidden: the copy beside them says the same thing. */

/** A photo feathered into the section on every edge */
export function Photo({
  src,
  width,
  height,
  alt = "",
  maxHeight,
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
  maxHeight?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={s.photo}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={maxHeight ? { maxHeight } : undefined}
    />
  );
}

/** The plate builder in miniature: registration, plate type, price */
export function BuilderPreview() {
  return (
    <div className={s.stage} aria-hidden="true">
      <div className={s.builder}>
        <span className={s.label}>Your registration</span>
        <PlateArt reg="AB12 CDE" face="white" finish="gel" band />
        <div className={s.segment}>
          <span>
            <CarFront /> Front
          </span>
          <span>
            <Car /> Rear
          </span>
          <span className={s.segOn}>
            <Check /> Pair
          </span>
        </div>
        <div className={s.builderFoot}>
          <span className={s.label}>Live preview and price</span>
          <span className={s.price}>From {gbp(FROM_PRICE)}</span>
        </div>
      </div>
      <div className={s.rear}>
        <PlateArt reg="AB12 CDE" face="yellow" finish="gel" />
      </div>
    </div>
  );
}

/** Two documents fanned out: proof of identity and proof of entitlement */
export function DocumentsArt() {
  return (
    <div className={`${s.stage} ${s.docStage}`} aria-hidden="true">
      <div className={`${s.doc} ${s.docBack}`}>
        <div className={s.docHead}>
          <span className={s.docIcon}>
            <FileText />
          </span>
          <span>
            <strong>V5C</strong>
            <em>Registration certificate</em>
          </span>
        </div>
        <span className={s.line} style={{ width: "86%" }} />
        <span className={s.line} style={{ width: "64%" }} />
        <span className={s.line} style={{ width: "74%" }} />
        <span className={s.docReg}>AB12 CDE</span>
      </div>
      <div className={`${s.doc} ${s.docFront}`}>
        <div className={s.docHead}>
          <span className={s.docIcon}>
            <IdCard />
          </span>
          <span>
            <strong>Driving licence</strong>
            <em>Name and address</em>
          </span>
        </div>
        <div className={s.licence}>
          <span className={s.face} />
          <span className={s.lines}>
            <span className={s.line} style={{ width: "90%" }} />
            <span className={s.line} style={{ width: "70%" }} />
            <span className={s.line} style={{ width: "80%" }} />
          </span>
        </div>
      </div>
      <span className={s.stamp}>
        <ShieldCheck /> Checked before supply
      </span>
    </div>
  );
}

/** The Ilford collection point, with the Royal Mail alternative beside it */
export function DeliveryArt() {
  return (
    <div className={s.stage} aria-hidden="true">
      <Photo src="/delivery/ilford-collection.webp" width={446} height={660} maxHeight={380} />
      <span className={s.chip}>
        <RoyalMailMark className={s.chipMark} />
        <span>
          <strong>Royal Mail</strong>
          <em>First Class or Tracked 24</em>
        </span>
      </span>
    </div>
  );
}
