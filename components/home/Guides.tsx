import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  FileText,
  Gavel,
  Layers,
  PoundSterling,
  ShieldCheck,
  TriangleAlert,
  Truck,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import cracked from "@/public/reasons/cracked.webp";
import faded from "@/public/reasons/faded.webp";
import single from "@/public/reasons/single.webp";
import stolen from "@/public/reasons/stolen.webp";
import trailer from "@/public/reasons/trailer.webp";
import { DocCards, ParcelBox } from "./Art";
import PlateArt from "./PlateArt";
import h from "./home.module.css";
import s from "./Guides.module.css";

type Guide = {
  title: string;
  href: string;
  Icon: typeof Wrench;
  media: StaticImageData | ReactNode;
};

// There are no standalone guide pages yet: each card points at the page
// that answers it today.
const GUIDES: Guide[] = [
  { title: "How to replace a number plate in the UK", href: "/faqs#ordering", Icon: Wrench, media: cracked },
  {
    title: "Documents needed to buy number plates",
    href: "/faqs#documents",
    Icon: FileText,
    media: <DocCards kind="identity" className={s.artDocs} />,
  },
  { title: "Replacement number plate cost: what changes the price", href: "/plate-styles", Icon: PoundSterling, media: single },
  {
    title: "Same-day dispatch vs next-day delivery",
    href: "/delivery-collection",
    Icon: Truck,
    media: <ParcelBox className={s.artBox} />,
  },
  {
    title: "Standard vs 3D vs 4D vs 5D plates",
    href: "/plate-styles",
    Icon: Layers,
    media: (
      <span className={s.artPlates}>
        <PlateArt face="white" finish="standard" />
        <PlateArt face="yellow" finish="acrylic" />
      </span>
    ),
  },
  { title: "Number plate MOT failure checklist", href: "/faqs#legal", Icon: TriangleAlert, media: faded },
  { title: "Stolen number plates and vehicle cloning", href: "/faqs", Icon: ShieldCheck, media: stolen },
  { title: "Number plate fines and enforcement", href: "/faqs#legal", Icon: Gavel, media: trailer },
];

const isImage = (m: Guide["media"]): m is StaticImageData =>
  typeof m === "object" && m !== null && "src" in m;

export default function Guides() {
  return (
    <section className={`${h.section} ${h.light}`} aria-labelledby="guides-title">
      <div className={s.inner}>
        <Reveal className={s.head}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Helpful resources</p>
          <h2 id="guides-title" className={s.heading}>
            Guides<span className={h.accent}>.</span>
          </h2>
          <p className={s.sub}>
            Practical advice, legal information and answers to common questions.
          </p>
        </Reveal>

        <ul className={s.grid}>
          {GUIDES.map(({ title, href, Icon, media }, i) => (
            <Reveal as="li" key={title} index={i % 4}>
              <Link href={href} className={s.card}>
                <span className={s.media} aria-hidden="true">
                  {isImage(media) ? (
                    <Image src={media} alt="" fill sizes="(min-width: 1024px) 280px, 40vw" className={s.img} />
                  ) : (
                    <span className={s.artStage}>{media}</span>
                  )}
                </span>
                <span className={s.body}>
                  <span className={s.badge} aria-hidden="true">
                    <Icon strokeWidth={1.9} />
                  </span>
                  <span className={`${s.title} title-case`}>{title}</span>
                  <ArrowRight className={s.arrow} strokeWidth={2.2} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal className={s.btnRow}>
          <Link href="/faqs" className={s.cta}>
            All guides
            <ArrowRight size={20} strokeWidth={2.4} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>

      {/* Into Our supplier (dark) */}
      <NeonEdge fill="#06111f" light />
    </section>
  );
}
