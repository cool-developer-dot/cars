import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import cracked from "@/public/reasons/cracked.webp";
import faded from "@/public/reasons/faded.webp";
import lost from "@/public/reasons/lost.webp";
import single from "@/public/reasons/single.webp";
import stolen from "@/public/reasons/stolen.webp";
import trailer from "@/public/reasons/trailer.webp";
import h from "./home.module.css";
import s from "./WhyReplacing.module.css";

type Reason = {
  title: string;
  text: string;
  link: string;
  href: string;
  img: StaticImageData;
  alt: string;
};

// Copy from the homepage brief. The /guides pages it links to don't exist
// yet, so each link points at the FAQ group that answers it today.
const REASONS: Reason[] = [
  {
    title: "Cracked or damaged",
    text: "A broken plate can be hard to read and may not meet the legal display requirements.",
    link: "Damaged number plate replacement",
    href: "/faqs#legal",
    img: cracked,
    alt: "A cracked number plate",
  },
  {
    title: "Faded, or a plate query at an MOT",
    text: "Worn backing or characters that are hard to read are a common reason to replace a plate.",
    link: "Faded plates and MOT queries",
    href: "/faqs#legal",
    img: faded,
    alt: "A faded, weathered number plate",
  },
  {
    title: "Stolen",
    text: "Report it to the police first, then order replacements.",
    link: "What to do if your plates are stolen",
    href: "/faqs#warranty",
    img: stolen,
    alt: "A car with its number plate removed",
  },
  {
    title: "Lost",
    text: "Order just the plate you need.",
    link: "Lost number plate replacement",
    href: "/faqs#ordering",
    img: lost,
    alt: "A number plate lying on the road",
  },
  {
    title: "Only one plate needs replacing",
    text: "Order a single plate and tell us the size and style of the one you're keeping. We can't guarantee an exact match to a plate made by a different supplier.",
    link: "Single and matching plates",
    href: "/faqs#ordering",
    img: single,
    alt: "A single rear number plate",
  },
  {
    title: "A bike rack or trailer hides your plate",
    text: "A trailer must show the same plate as the vehicle towing it, and a plate must not be obscured.",
    link: "Bike rack and trailer number plates",
    href: "/faqs#legal",
    img: trailer,
    alt: "A bike rack covering a car's rear plate",
  },
];

export default function WhyReplacing() {
  return (
    <section className={`${h.section} ${h.light}`} aria-labelledby="why-title">
      <div className={s.inner}>
        <Reveal className={s.head}>
          <p className={`${h.eyebrow} ${s.eyebrow}`}>Common reasons</p>
          <h2 id="why-title" className={s.title}>
            Why are you <span className={h.accent}>replacing your plates?</span>
          </h2>
        </Reveal>

        <ul className={s.grid}>
          {REASONS.map((r, i) => (
            <Reveal as="li" key={r.title} index={i % 3}>
              <Link href={r.href} className={`${h.glassLight} ${s.card}`}>
                <span className={s.media}>
                  <Image
                    src={r.img}
                    alt={r.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 560px) 45vw, 120px"
                    className={s.img}
                  />
                </span>
                <span className={s.body}>
                  <span className={`${s.cardTitle} title-case`}>{r.title}</span>
                  <span className={s.cardText}>{r.text}</span>
                  <span className={s.more}>
                    {r.link}
                    <ArrowRight strokeWidth={2.2} aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Light → light: the neon line marks the seam */}
      <NeonEdge light />
    </section>
  );
}
