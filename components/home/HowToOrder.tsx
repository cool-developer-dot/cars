import { ArrowRight, FileText, Layers, ScanSearch, Truck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import HeroPhoto from "@/components/HeroPhoto";
import PlateArt from "./PlateArt";
import { DocCards, ParcelBox, PlateFan, RegField } from "./Art";
import StartBuildingButton from "./StartBuildingButton";
import h from "./home.module.css";
import s from "./HowToOrder.module.css";

const STEPS = [
  {
    title: "Enter your registration",
    text: "See a preview of your plates as you build.",
    Icon: ScanSearch,
    art: (
      <span className={s.regPanel}>
        <RegField className={s.artReg} />
      </span>
    ),
  },
  {
    title: "Choose your style, size and options",
    text: "Select your style and whether you need a front, rear or both.",
    Icon: Layers,
    art: <PlateFan className={s.artFan} />,
  },
  {
    title: "Provide your documents",
    text: "Proof of who you are and proof you can use the registration.",
    Icon: FileText,
    art: <DocCards kind="identity" className={s.artDocs} />,
  },
  {
    title: "We make your plates",
    text: "and send them by Royal Mail, or have them ready for Ilford collection.",
    Icon: Truck,
    art: <ParcelBox className={s.artBox} />,
  },
];

export default function HowToOrder() {
  return (
    <section className={`${h.section} ${h.dark} ${s.section}`} aria-labelledby="how-title">
      <div className={s.backdrop} aria-hidden="true">
        <HeroPhoto className={s.photo} />
        <PlateArt className={s.ghostPlate} face="white" finish="acrylic" />
      </div>

      <div className={s.inner}>
        <Reveal className={s.head}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>How to order online</p>
          <h2 id="how-title" className={s.title}>
            How to <span className={h.accent}>order online.</span>
          </h2>
          <p className={s.sub}>
            Get your number plates in four simple steps. All plates are made to
            order by a DVLA-registered supplier.
          </p>
        </Reveal>

        <ol className={s.steps}>
          {STEPS.map(({ title, text, Icon, art }, i) => (
            <Reveal as="li" key={title} index={i} className={s.step}>
              <div className={s.stepTop}>
                <span className={s.num} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={s.stepIcon} aria-hidden="true">
                  <Icon strokeWidth={1.7} />
                </span>
              </div>
              <h3 className={s.stepTitle}>{title}</h3>
              <p className={s.stepText}>{text}</p>
              <div className={s.art} aria-hidden="true">
                {art}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className={s.btnRow}>
          <StartBuildingButton className={s.cta}>
            Start building
            <ArrowRight size={20} strokeWidth={2.4} aria-hidden="true" />
          </StartBuildingButton>
        </Reveal>
      </div>

      <NeonEdge fill="#f3f7fb" />
    </section>
  );
}
