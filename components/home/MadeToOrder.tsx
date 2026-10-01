import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import HeroPhoto from "@/components/HeroPhoto";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { COMPANY } from "@/lib/site";
import PlateArt, { type PlateFace, type PlateFinish } from "./PlateArt";
import { ParcelBox } from "./Art";
import StartBuildingButton from "./StartBuildingButton";
import h from "./home.module.css";
import s from "./MadeToOrder.module.css";

const STEPS = [
  { title: "Enter your registration", text: "See a preview of your plate as you build it." },
  { title: "Choose front, rear or pair", text: "Pick a single front plate, rear plate or matching pair." },
  { title: "Pick your style", text: "Choose from Standard, 3D, 4D, 5D, Ghost or Bevel." },
  {
    title: "Order for delivery or collection",
    text: "Sent by Royal Mail or collect from our Ilford collection point.",
  },
];

/** The style swatches in the flow panel */
const SWATCHES: { label: string; face: PlateFace; finish: PlateFinish }[] = [
  { label: "Standard", face: "white", finish: "standard" },
  { label: "3D", face: "white", finish: "gel" },
  { label: "4D", face: "white", finish: "acrylic" },
  { label: "5D", face: "yellow", finish: "acrylicGel" },
  { label: "Ghost", face: "yellow", finish: "ghost" },
  { label: "Bevel", face: "white", finish: "bevel" },
];

/** The order flow, drawn: reg → front/rear/pair → style → box / collection */
function FlowPanel() {
  return (
    <div className={s.panel} aria-hidden="true">
      {/* 1 — registration */}
      <div className={`${s.tile} ${s.tileReg}`}>
        <div className={s.device}>
          <span className={s.input}>
            AB12 CDE
            <span className={s.caret} />
          </span>
          <PlateArt className={s.regPlate} face="yellow" finish="gel" />
        </div>
      </div>

      <span className={s.arrow}>
        <ArrowRight strokeWidth={2.6} />
      </span>

      {/* 2 — front / rear / pair */}
      <div className={`${s.tile} ${s.tileSides}`}>
        <span className={s.sideRow}>
          <PlateArt className={s.sidePlate} face="white" finish="standard" />
          <span className={s.sideLabel}>Front plate</span>
          <span className={`${s.radio} ${s.radioOn}`} />
        </span>
        <span className={s.sideRow}>
          <PlateArt className={s.sidePlate} face="yellow" finish="standard" />
          <span className={s.sideLabel}>Rear plate</span>
          <span className={s.radio} />
        </span>
        <span className={`${s.sideRow} ${s.pairRow}`}>
          <span className={s.pairPlates}>
            <PlateArt face="white" finish="standard" />
            <PlateArt face="yellow" finish="standard" />
          </span>
          <span className={s.pairLabel}>Matching pair</span>
          <span className={s.radio} />
        </span>
      </div>

      {/* connectors between the rows */}
      <span className={s.links}>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M49 0 V20 H23 V40" />
          <path d="M75 0 V20 H55 V40" />
        </svg>
        <ChevronDown className={s.linkHead} strokeWidth={2.8} />
      </span>

      {/* 3 — styles */}
      <div className={`${s.tile} ${s.tileStyles}`}>
        {SWATCHES.map((sw) => (
          <span key={sw.label} className={s.swatch}>
            <PlateArt className={s.swatchPlate} face={sw.face} finish={sw.finish} />
            <span className={s.swatchLabel}>{sw.label}</span>
          </span>
        ))}
      </div>

      <span className={s.arrow}>
        <ArrowRight strokeWidth={2.6} />
      </span>

      {/* 4 — boxed, posted or collected */}
      <div className={`${s.tile} ${s.tileBox}`}>
        <ParcelBox className={s.box} />
        <span className={s.counter}>
          <span className={s.plant} />
          <span className={s.collectSign}>
            <MapPin strokeWidth={2.6} />
            Click &amp; Collect
          </span>
          <span className={s.counterBrand}>
            Replacement<em>Plates</em>
          </span>
        </span>
      </div>
    </div>
  );
}

export default function MadeToOrder() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="made-title">
      <div className={s.backdrop} aria-hidden="true">
        <HeroPhoto className={s.photo} />
      </div>

      <div className={s.inner}>
        <div className={s.copy}>
          <Reveal>
            <p className={`${h.eyebrow} ${s.eyebrow}`}>How to order online</p>
            <h2 id="made-title" className={s.title}>
              <span className={s.titleLine}>Replacement number plates,</span>
              <br />
              <span className={s.accent}>made to order</span>
            </h2>
            <p className={s.text}>
              Need a new number plate? {COMPANY.brand} is a trading name of{" "}
              {COMPANY.legalName}, a DVLA-registered number plate supplier. We make
              plates to order — enter your registration, choose a single front or
              rear plate or a matching pair, pick your style, and order online.
            </p>
            <p className={s.text}>
              Every plate is produced to the legal requirements for registration
              plates and can be sent by Royal Mail or collected from our Ilford
              collection point.
            </p>
          </Reveal>

          <ol className={s.steps}>
            {STEPS.map((step, i) => (
              <Reveal as="li" key={step.title} index={i} className={s.step}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepText}>{step.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal index={4}>
            <StartBuildingButton className={s.cta}>
              Start building
              <ArrowRight strokeWidth={2.4} aria-hidden="true" />
            </StartBuildingButton>
          </Reveal>
        </div>

        <Reveal index={1} className={s.panelWrap}>
          <FlowPanel />
        </Reveal>
      </div>

      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
