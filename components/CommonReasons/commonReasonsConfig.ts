import type { StaticImageData } from "next/image";
import cracked from "@/public/reasons/cracked.webp";
import faded from "@/public/reasons/faded.webp";
import stolen from "@/public/reasons/stolen.webp";
import lost from "@/public/reasons/lost.webp";
import single from "@/public/reasons/single.webp";
import trailer from "@/public/reasons/trailer.webp";

export type ReasonIcon =
  | "damaged"
  | "mot"
  | "stolen"
  | "lost"
  | "single"
  | "trailer";

export type Reason = {
  id: string;
  title: string;
  description: string;
  icon: ReasonIcon;
  image: StaticImageData;
  alt: string;
};

export const REASONS: Reason[] = [
  {
    id: "cracked",
    title: "Cracked or damaged",
    description:
      "A broken plate can be hard to read and may not meet legal display requirements.",
    icon: "damaged",
    image: cracked,
    alt: "Close-up of a cracked white number plate on wet tarmac",
  },
  {
    id: "faded",
    title: "Faded, or a plate query at an MOT",
    description:
      "Worn backing or characters that are hard to read are a common reason to replace a plate.",
    icon: "mot",
    image: faded,
    alt: "Dirty, weathered number plate with faded characters",
  },
  {
    id: "stolen",
    title: "Stolen",
    description: "Report it to the police first, then order replacements.",
    icon: "stolen",
    image: stolen,
    alt: "Person reaching for the rear number plate of a parked car at night",
  },
  {
    id: "lost",
    title: "Lost",
    description: "Order just the plate you need.",
    icon: "lost",
    image: lost,
    alt: "Number plate lying on a wet road beside the kerb",
  },
  {
    id: "single",
    title: "Only one plate needs replacing",
    description:
      "Order a single plate and tell us the size and style of the one you’re keeping.",
    icon: "single",
    image: single,
    alt: "Rear of a dark car with a yellow number plate",
  },
  {
    id: "trailer",
    title: "A bike rack or trailer hides your plate",
    description:
      "A trailer must show the same plate as the towing vehicle, and a plate must not be obscured.",
    icon: "trailer",
    image: trailer,
    alt: "Rear bike rack carrying bicycles with its own number plate",
  },
];
