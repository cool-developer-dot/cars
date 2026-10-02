import { ArrowRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import HeroPhoto from "@/components/HeroPhoto";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { COMPANY } from "@/lib/site";
import PanelBuilder from "./PanelBuilder";
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
              <Reveal as="li" key={step.title} index={i} className={`${h.liquid} ${s.step}`}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepText}>{step.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal index={4}>
            <StartBuildingButton className={s.cta} focusReg>
              Start building
              <ArrowRight strokeWidth={2.4} aria-hidden="true" />
            </StartBuildingButton>
          </Reveal>
        </div>

        <Reveal index={1} className={s.panelWrap}>
          <PanelBuilder />
        </Reveal>
      </div>

      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
