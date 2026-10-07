import type { PlateFinish } from "@/components/home/PlateArt";
import { PRODUCTS, type ProductContent } from "@/lib/products";
import { PRICES, SPECIALITY, formatPrices, gbp, type SpecialityId } from "@/lib/site";

/*
 * Everything that differs between the plate-style pages (3D, 4D, 5D, Bevel).
 * The sections in this folder are shared; each reads its copy and artwork
 * from here, and the product facts (prices, FAQs, legal and replacement copy)
 * from lib/products.ts. Headings that only swap the style's name ("How to
 * Order 4D Number Plates Online") are built in the sections from `name`.
 */

export type ProductPageId = ProductContent["id"];

/** A photo with a lighter file for phones */
export type PageImage = {
  src: string;
  srcMobile?: string;
  width: number;
  height: number;
  alt: string;
};

/** The finishes and formats the comparison cards can show */
export type CompareId =
  | "standard"
  | "3d"
  | "4d"
  | "5d"
  | "ghost"
  | "bevel"
  // speciality formats, and the plain plate each is compared with
  | "short"
  | "oversized"
  | "show"
  | "ev"
  | "standardSize"
  | "standardRear"
  | "roadLegal"
  | "plain";

/** Icons for a format card's spec rows (finish cards use Characters / Edge / Look) */
export type SpecIcon = "size" | "fits" | "chars" | "plate" | "use" | "spacing" | "markings" | "flash" | "for";

export type CompareCard = {
  name: string;
  price: number;
  img: string;
  alt: string;
  /** Finish cards */
  characters?: string;
  edge?: string;
  look?: string;
  /** Format cards: their own rows */
  specs?: { label: string; value: string; icon: SpecIcon }[];
};

export type GuideLink = {
  id: string;
  /** Two fixed lines, as designed */
  lines: readonly [string, string];
  lines2: readonly [string, string];
  href: string;
};

/** A section heading as [plain words, highlighted words] — the docs' SEO headings */
export type Heading = readonly [string, string];

export type ProductPageContent = {
  id: ProductPageId;
  product: ProductContent;
  /** The style as headings name it: "3D", "4D", "5D", "Bevel" */
  name: string;
  /** Lower-case form for running text: "3D", "bevel" */
  nameInText: string;
  hero: PageImage & { srcMobile: string };
  replacement: {
    heading?: Heading;
    lead: string;
    cards: {
      id: "cracked" | "lost" | "match";
      title: string;
      text: string;
      img: { src: string; w: number; h: number };
    }[];
    upgrade: { title: string; text: string; tag: string; finish: PlateFinish };
  };
  explained: {
    title: string;
    accent: string;
    lead: string;
    note: string;
    art: PageImage;
    /** "3D vs 4D Number Plates — Gel or Acrylic?" */
    compare: {
      pair: readonly [CompareId, CompareId];
      tail: string;
      /** Replaces "3D vs 4D Number Plates — tail" */
      heading?: Heading;
      images?: Partial<Record<CompareId, string>>;
    };
  };
  sizes: {
    heading?: Heading;
    /** Replaces the measuring card's text */
    measure?: string;
    moto: string;
    /** First card (defaults to the 520 × 111mm standard size) */
    first?: { title: string; text: string; figure?: { w: string; h: string; reg: string } };
    /** Replaces the intro under the heading */
    lead?: string;
  };
  legal: {
    heading?: Heading;
    photo: PageImage;
    /** The four badges under the copy (defaults: the legal requirements) */
    badges?: { label: string; icon: "type" | "spacing" | "background" | "markings" | "display" | "events" | "custom" | "noRoad" }[];
    /** Replaces the paragraph on what an MOT tester checks */
    note?: string;
  };
  care: {
    heading?: Heading;
    lead: string;
    scratch: { title: string; text: string };
    photo: { src: string; srcMobile: string };
  };
  order?: { heading?: Heading; lead?: string };
  documents?: { heading?: Heading };
  delivery?: { heading?: Heading; lead?: string };
  guides: readonly GuideLink[];
  guidesArt: { src: string; srcMobile: string };
  faq: { heading?: Heading; car: PageImage & { srcMobile: string } };
  cta: { plate: { src: string; srcMobile: string } };
};

/** Shared card copy */
const LOST_TEXT = PRODUCTS["3d"].replacement.items[1].text;
const upgradeText = (finish: string) =>
  `We can only make your registration in the correct legal layout, so a replacement may look different from a non-compliant original. You can switch from printed to ${finish}, or to another finish, without telling the DVLA, as long as the registration itself isn't changing.`;
const motoText = (name: string) =>
  `${name} finishes may be available on selected motorcycle plate formats — the builder will show what's currently offered for your registration.`;
const careLead = (name: string, avoid: string) =>
  `Keep your ${name} number plates looking their best. Wash with car shampoo and a soft cloth, and ${avoid}. If you think a plate we made has a manufacturing fault, contact us and we’ll assess it.`;
const replaceLead = (name: string, finish: string) =>
  `Need to replace a damaged, lost or worn ${name} plate? We make like-for-like replacements in the correct legal format, using the same high-quality ${finish} from our range.`;

const LEGAL_GUIDE = (name: string): GuideLink => ({
  id: "legal",
  lines: [`Are ${name}`, "Number Plates Legal?"],
  lines2: ["Rules, requirements", "and what to know."],
  href: "/faqs#legal",
});
const STYLES_GUIDE: GuideLink = {
  id: "styles",
  lines: ["Standard vs 3D vs", "4D vs 5D Plates"],
  lines2: ["Compare styles,", "looks and features."],
  href: "/plate-styles",
};

/** Per-style artwork folder for the newer pages (rendered with scripts/render-product-art.sh) */
const art = (dir: string, name: string, finishWords: string, reg = "AB12 CDE") => ({
  hero: {
    src: `/${dir}/hero.webp`,
    srcMobile: `/${dir}/hero-mobile.webp`,
    width: 2000,
    height: 1000,
    alt: `A white front and a yellow rear ${name} number plate reading ${reg}, with ${finishWords}`,
  },
  intro: {
    src: `/${dir}/intro.webp`,
    width: 1522,
    height: 1010,
    alt: `A white front and a yellow rear ${name} number plate with ${finishWords}`,
  },
  care: { src: `/${dir}/care.webp`, srcMobile: `/${dir}/care-mobile.webp` },
  cta: { src: `/${dir}/cta.webp`, srcMobile: `/${dir}/cta-mobile.webp` },
  guides: { src: `/${dir}/guides.webp`, srcMobile: `/${dir}/guides-mobile.webp` },
  cracked: { src: `/${dir}/replace-cracked.webp`, w: 640, h: 568 },
  lost: { src: `/${dir}/replace-lost.webp`, w: 752, h: 568 },
  match: { src: `/${dir}/replace-match.webp`, w: 666, h: 666 },
  legal: {
    src: `/${dir}/legal-car.webp`,
    width: 1492,
    height: 868,
    alt: `The front of a dark car fitted with a white ${name} number plate`,
  },
  faq: {
    src: `/${dir}/faq-car.webp`,
    srcMobile: `/${dir}/faq-car-mobile.webp`,
    width: 700,
    height: 742,
    alt: `A grey car fitted with a white ${name} number plate reading ${reg}`,
  },
});

const p3 = PRODUCTS["3d"];
const p4 = PRODUCTS["4d"];
const p5 = PRODUCTS["5d"];
const pb = PRODUCTS.bevel;
const pg = PRODUCTS.ghost;

const a4 = art("4d", "4D", "raised, laser-cut black acrylic characters");
const a5 = art("5d", "5D", "laser-cut black acrylic characters under a glossy gel top");
const ab = art("bevel", "bevel", "black acrylic characters cut with an angled, faceted edge");
const ag = art("ghost", "Ghost", "glossy, dark smoked characters");
const ps = PRODUCTS.standard;
const pShort = PRODUCTS.short;
const pOver = PRODUCTS.oversized;
const pShow = PRODUCTS.show;
const pEv = PRODUCTS.ev;
const aStd = art("standard", "standard", "flat printed black characters");
const aShort = art("short", "short", "printed black characters", "A1 BCD");
const aOver = art("oversized", "oversized", "printed black characters");
const aShow = art("show", "show", "custom-spaced characters and a black border", "AB12CDE");
const aEv = art("ev", "EV", "a green flash at the left");

/** Every format comes in every style: the raised-finish card on the speciality pages */
const ANY_FINISH = {
  title: "Printed, 3D, 4D or another finish",
  text: "Every style we make comes in this format: printed, 3D gel, 4D acrylic, 5D, Ghost or Bevel. You can change the finish without telling the DVLA, as long as the registration itself isn't changing.",
  tag: "3D Gel",
  finish: "gel" as PlateFinish,
};
const SCRATCH = { title: "Avoid Scratching", text: "Do not scrape ice or dirt off the plate with anything hard." };
const careAll = (name: string) => careLead(name, "avoid scraping ice or dirt off the plate with anything hard");
/** A speciality page's replacement cards: its own copy, its own photos */
const replacementCards = (p: ProductContent, a: ReturnType<typeof art>, name: string) => [
  { id: "cracked" as const, title: `Replacing a damaged ${name} plate`, text: p.replacement.items[0].text, img: a.cracked },
  { id: "lost" as const, title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: a.lost },
  { id: "match" as const, title: `Can we match your existing ${name} plate?`, text: p.replacement.items[1].text, img: a.match },
];

export const PRODUCT_PAGES: Record<ProductPageId, ProductPageContent> = {
  standard: {
    id: "standard",
    product: ps,
    name: "Standard",
    nameInText: "standard",
    hero: aStd.hero,
    replacement: {
      lead: replaceLead("standard", "printed finish"),
      cards: [
        { id: "cracked", title: "Replacing cracked, faded or damaged plates", text: ps.replacement.items[0].text, img: aStd.cracked },
        { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: aStd.lost },
        { id: "match", title: "Can we match your existing plate?", text: ps.replacement.items[1].text, img: aStd.match },
      ],
      upgrade: {
        title: "Upgrading from printed to raised characters",
        text: "Like the look of raised characters? Choose 3D gel, 4D acrylic or another finish in the builder. You can change the finish without telling the DVLA, as long as the registration itself isn't changing.",
        tag: "3D Gel",
        finish: "gel",
      },
    },
    explained: {
      title: "What Are Standard",
      accent: "Number Plates?",
      lead: ps.intro.paragraphs[0],
      note: ps.intro.paragraphs[1],
      art: aStd.intro,
      compare: { pair: ["standard", "3d"], tail: "— Printed or Raised?" },
    },
    sizes: { moto: ps.sizes.paragraphs[1] },
    legal: { photo: aStd.legal },
    care: { lead: careAll("standard"), scratch: SCRATCH, photo: aStd.care },
    guides: [
      LEGAL_GUIDE("Standard"),
      {
        id: "std-3d",
        lines: ["Standard vs 3D Gel", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/3d-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: aStd.guides,
    faq: { car: aStd.faq },
    cta: { plate: aStd.cta },
  },

  short: {
    id: "short",
    product: pShort,
    name: "Short",
    nameInText: "short",
    hero: aShort.hero,
    replacement: {
      lead: replaceLead("short", "short-plate finish"),
      cards: replacementCards(pShort, aShort, "short"),
      upgrade: ANY_FINISH,
    },
    explained: {
      title: "What Are Short",
      accent: "Number Plates?",
      lead: pShort.intro.paragraphs[0],
      note: pShort.intro.paragraphs[1],
      art: aShort.intro,
      compare: { pair: ["short", "standardSize"], tail: "— Which Size Fits?" },
    },
    sizes: {
      moto: pShort.sizes.paragraphs[1],
      lead: "Short plates come in five widths, all 111mm tall. The builder picks the size that fits your registration, keeping the legal character size and spacing.",
      first: {
        title: "Short Sizes",
        text: "470, 409, 348, 287 or 226mm wide, all 111mm tall — for registrations of up to 7, 6, 5, 4 or 3 characters, spaces included.",
        figure: { w: "409mm", h: "111mm", reg: "A1 BCD" },
      },
    },
    legal: { photo: aShort.legal },
    care: { lead: careAll("short"), scratch: SCRATCH, photo: aShort.care },
    guides: [
      LEGAL_GUIDE("Short"),
      {
        id: "short-std",
        lines: ["Short vs Standard", "Size Plates"],
        lines2: ["Which size fits", "your registration."],
        href: "/standard-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: aShort.guides,
    faq: { car: aShort.faq },
    cta: { plate: aShort.cta },
  },

  oversized: {
    id: "oversized",
    product: pOver,
    name: "Oversized",
    nameInText: "oversized",
    hero: aOver.hero,
    replacement: {
      lead: replaceLead("oversized", "oversized-plate finish"),
      cards: replacementCards(pOver, aOver, "oversized"),
      upgrade: ANY_FINISH,
    },
    explained: {
      title: "What Are Oversized",
      accent: "Number Plates?",
      lead: pOver.intro.paragraphs[0],
      note: pOver.intro.paragraphs[1],
      art: aOver.intro,
      compare: { pair: ["oversized", "standardRear"], tail: "— Which Fits?" },
    },
    sizes: {
      moto: pOver.sizes.paragraphs[1],
      lead: "The oversized rear is 533mm × 152mm, for larger rear recesses; the front stays at the standard 520mm × 111mm. The characters keep the legal size and spacing.",
      first: {
        title: "Oversized Rear",
        text: "533mm × 152mm, rear only. Your front plate is made at the standard 520mm × 111mm, or a short size if your registration suits one.",
        figure: { w: "533mm", h: "152mm", reg: "AB12 CDE" },
      },
    },
    legal: { photo: aOver.legal },
    care: { lead: careAll("oversized"), scratch: SCRATCH, photo: aOver.care },
    guides: [
      LEGAL_GUIDE("Oversized"),
      {
        id: "over-std",
        lines: ["Oversized vs", "Standard Plates"],
        lines2: ["Which size fits", "your rear recess."],
        href: "/standard-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: aOver.guides,
    faq: { car: aOver.faq },
    cta: { plate: aOver.cta },
  },

  show: {
    id: "show",
    product: pShow,
    name: "Show",
    nameInText: "show",
    hero: aShow.hero,
    replacement: {
      lead: "Need to replace a damaged or worn show plate? We make show plates to order in any of our styles, with your choice of spacing — for display off the road.",
      cards: replacementCards(pShow, aShow, "show"),
      upgrade: {
        title: "Choosing a finish for your show plate",
        text: "Show plates come in every style we make — printed, 3D gel, 4D acrylic, 5D, Ghost or Bevel — so your display plate can have the look you want.",
        tag: "4D",
        finish: "acrylic",
      },
    },
    explained: {
      title: "What Are Show",
      accent: "Number Plates?",
      lead: pShow.intro.paragraphs[0],
      note: pShow.intro.paragraphs[1],
      art: aShow.intro,
      compare: { pair: ["show", "roadLegal"], tail: "— Display or Drive?" },
    },
    sizes: { moto: pShow.sizes.paragraphs[1] },
    legal: {
      photo: { ...aShow.legal, alt: "A car at a show fitted with a white show plate" },
      note: "For the road, choose “Legal Plate” in the builder: every road plate we make is made in the legal layout and spacing.",
      badges: [
        { label: "Display Only", icon: "display" },
        { label: "Shows and Events", icon: "events" },
        { label: "Custom Spacing", icon: "custom" },
        { label: "Not for Road Use", icon: "noRoad" },
      ],
    },
    care: { lead: careAll("show"), scratch: SCRATCH, photo: aShow.care },
    guides: [
      {
        id: "legal",
        lines: ["Are Show Plates", "Legal on the Road?"],
        lines2: ["What display-only", "means for you."],
        href: "/faqs#legal",
      },
      {
        id: "show-std",
        lines: ["Show vs Road-Legal", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/standard-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: aShow.guides,
    faq: { car: aShow.faq },
    cta: { plate: aShow.cta },
  },

  ev: {
    id: "ev",
    product: pEv,
    name: "EV",
    nameInText: "EV",
    hero: aEv.hero,
    replacement: {
      lead: replaceLead("EV", "green flash"),
      cards: replacementCards(pEv, aEv, "EV"),
      upgrade: ANY_FINISH,
    },
    explained: {
      title: "What Are Green Flash",
      accent: "EV Number Plates?",
      lead: pEv.intro.paragraphs[0],
      note: pEv.intro.paragraphs[1],
      art: aEv.intro,
      compare: { pair: ["ev", "plain"], tail: "— Green Flash or None?" },
    },
    sizes: { moto: pEv.sizes.paragraphs[1] },
    legal: { photo: aEv.legal },
    care: { lead: careAll("EV"), scratch: SCRATCH, photo: aEv.care },
    guides: [
      LEGAL_GUIDE("EV"),
      {
        id: "ev-std",
        lines: ["EV vs Standard", "Number Plates"],
        lines2: ["Who can have", "the green flash."],
        href: "/standard-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: aEv.guides,
    faq: { car: aEv.faq },
    cta: { plate: aEv.cta },
  },

  "3d": {
    id: "3d",
    product: p3,
    name: "3D",
    nameInText: "3D",
    hero: {
      src: "/3d/plates-3d-gel.webp",
      srcMobile: "/3d/plates-3d-gel-mobile.webp",
      width: 2000,
      height: 1000,
      alt: "A white front and a yellow rear 3D gel number plate reading AB12 CDE, with raised glossy black resin characters",
    },
    replacement: {
      lead: replaceLead("3D", "3D gel finish"),
      cards: [
        {
          id: "cracked",
          title: "Replacing lifted, cracked or cloudy gel characters",
          text: p3.replacement.items[0].text,
          img: { src: "/3d/replace-cracked.webp", w: 640, h: 568 },
        },
        {
          id: "lost",
          title: "Replacing a lost front or rear plate",
          text: p3.replacement.items[1].text,
          img: { src: "/3d/replace-lost.webp", w: 752, h: 568 },
        },
        {
          id: "match",
          title: "Can we match your existing 3D plate?",
          text: p3.replacement.items[2].text,
          img: { src: "/3d/replace-match.webp", w: 666, h: 666 },
        },
      ],
      upgrade: {
        title: "Correcting illegal spacing or upgrading from printed plates",
        text: p3.replacement.items[3].text,
        tag: "3D Gel",
        finish: "gel",
      },
    },
    explained: {
      title: "What Are 3D Gel",
      accent: "Number Plates?",
      lead: p3.intro.paragraphs[0],
      note: p3.intro.paragraphs[1],
      art: {
        src: "/3d/gel-plates.webp",
        width: 1522,
        height: 1010,
        alt: "A white front and a yellow rear 3D gel number plate with raised, glossy black characters",
      },
      compare: {
        pair: ["3d", "4d"],
        tail: "— Gel or Acrylic?",
        images: { "3d": "/3d/macro-3d-gel.webp", "4d": "/3d/macro-4d.webp" },
      },
    },
    sizes: { moto: p3.sizes.paragraphs[1] },
    legal: {
      photo: {
        src: "/3d/legal-car.webp",
        width: 1492,
        height: 868,
        alt: "The front of a dark car fitted with a white 3D gel number plate",
      },
    },
    care: {
      lead: careLead("3D", "avoid scraping ice or dirt off the raised characters with anything hard"),
      scratch: {
        title: "Avoid Scratching",
        text: "Do not scrape ice or dirt off the raised characters with anything hard.",
      },
      photo: { src: "/3d/care-plate.webp", srcMobile: "/3d/care-plate-mobile.webp" },
    },
    guides: [
      LEGAL_GUIDE("3D Gel"),
      {
        id: "3d-4d",
        lines: ["3D vs 4D", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/4d-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: {
      src: "/3d/guides-reviews-plates.webp",
      srcMobile: "/3d/guides-reviews-plates-mobile.webp",
    },
    faq: {
      car: {
        src: "/3d/faq-car.webp",
        srcMobile: "/3d/faq-car-mobile.webp",
        width: 700,
        height: 742,
        alt: "A grey car fitted with a white 3D number plate reading AB12 CDE",
      },
    },
    cta: { plate: { src: "/3d/cta-plate.webp", srcMobile: "/3d/cta-plate-mobile.webp" } },
  },

  "4d": {
    id: "4d",
    product: p4,
    name: "4D",
    nameInText: "4D",
    hero: a4.hero,
    replacement: {
      lead: replaceLead("4D", "laser-cut acrylic finish"),
      cards: [
        { id: "cracked", title: "Replacing cracked acrylic or missing characters", text: p4.replacement.items[0].text, img: a4.cracked },
        { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: a4.lost },
        { id: "match", title: "Can we match your existing 4D plate?", text: p4.replacement.items[1].text, img: a4.match },
      ],
      upgrade: {
        title: "Correcting illegal spacing or upgrading from printed plates",
        text: upgradeText("4D"),
        tag: "4D",
        finish: "acrylic",
      },
    },
    explained: {
      title: "What Are 4D",
      accent: "Number Plates?",
      lead: p4.intro.paragraphs[0],
      note: p4.compare.note!.text,
      art: a4.intro,
      compare: { pair: ["4d", "3d"], tail: "— Acrylic or Gel?" },
    },
    sizes: { moto: motoText("4D") },
    legal: { photo: a4.legal },
    care: {
      lead: careLead("4D", "avoid scraping ice or dirt off the acrylic characters with anything hard"),
      scratch: {
        title: "Avoid Scratching",
        text: "Do not scrape ice or dirt off the acrylic characters with anything hard.",
      },
      photo: a4.care,
    },
    guides: [
      LEGAL_GUIDE("4D"),
      {
        id: "4d-3d",
        lines: ["4D vs 3D Gel", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/3d-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: a4.guides,
    faq: { car: a4.faq },
    cta: { plate: a4.cta },
  },

  "5d": {
    id: "5d",
    product: p5,
    name: "5D",
    nameInText: "5D",
    hero: a5.hero,
    replacement: {
      lead: replaceLead("5D", "acrylic-and-gel finish"),
      cards: [
        { id: "cracked", title: "Replacing damaged acrylic or lifting gel", text: p5.replacement.items[0].text, img: a5.cracked },
        { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: a5.lost },
        { id: "match", title: "Can we match your existing 5D plate?", text: p5.replacement.items[1].text, img: a5.match },
      ],
      upgrade: {
        title: "Correcting illegal spacing or upgrading from printed plates",
        text: upgradeText("5D"),
        tag: "5D",
        finish: "acrylicGel",
      },
    },
    explained: {
      title: "What Are 5D",
      accent: "Number Plates?",
      lead: p5.intro.paragraphs[0],
      note: p5.intro.paragraphs[1],
      art: a5.intro,
      compare: { pair: ["5d", "4d"], tail: "— Gel Top or Flat Top?" },
    },
    sizes: { moto: motoText("5D") },
    legal: { photo: a5.legal },
    care: {
      lead: careLead("5D", "avoid scraping ice or dirt off the gel-topped characters with anything hard"),
      scratch: {
        title: "Avoid Scratching",
        text: "Do not scrape ice or dirt off the gel-topped characters with anything hard.",
      },
      photo: a5.care,
    },
    guides: [
      LEGAL_GUIDE("5D"),
      {
        id: "5d-4d",
        lines: ["5D vs 4D", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/4d-number-plates",
      },
      STYLES_GUIDE,
    ],
    guidesArt: a5.guides,
    faq: { car: a5.faq },
    cta: { plate: a5.cta },
  },

  ghost: {
    id: "ghost",
    product: pg,
    name: "Ghost",
    nameInText: "Ghost",
    hero: ag.hero,
    replacement: {
      lead: replaceLead("Ghost", "smoked Ghost finish"),
      cards: [
        { id: "cracked", title: "Replacing damaged or worn Ghost characters", text: pg.replacement.items[0].text, img: ag.cracked },
        { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: ag.lost },
        { id: "match", title: "Can we match your existing Ghost plate?", text: pg.replacement.items[1].text, img: ag.match },
      ],
      upgrade: {
        title: "Correcting illegal spacing or upgrading from printed plates",
        // Ghost's road-use status isn't confirmed yet, so no "switch freely" promise here
        text: "We can only make your registration in the correct legal layout, so a replacement may look different from a non-compliant original. A new finish doesn't need the DVLA while the registration stays the same; for Ghost, please contact us about its road-use status first.",
        tag: "Ghost",
        finish: "ghost",
      },
    },
    explained: {
      title: "What Are Ghost",
      accent: "Number Plates?",
      lead: pg.intro.paragraphs[0],
      note: pg.intro.paragraphs[1],
      art: ag.intro,
      compare: { pair: ["ghost", "3d"], tail: "— Smoked or Solid Black?" },
    },
    sizes: { moto: motoText("Ghost") },
    legal: { photo: ag.legal },
    care: {
      lead: careLead("Ghost", "avoid scraping ice or dirt off the smoked characters with anything hard"),
      scratch: {
        title: "Avoid Scratching",
        text: "Do not scrape ice or dirt off the smoked characters with anything hard.",
      },
      photo: ag.care,
    },
    guides: [
      LEGAL_GUIDE("Ghost"),
      {
        id: "ghost-3d",
        lines: ["Ghost vs 3D Gel", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/3d-number-plates",
      },
      {
        id: "styles",
        lines: ["Standard vs 3D vs", "4D vs Ghost Plates"],
        lines2: ["Compare styles,", "looks and features."],
        href: "/plate-styles",
      },
    ],
    guidesArt: ag.guides,
    faq: { car: ag.faq },
    cta: { plate: ag.cta },
  },

  bevel: {
    id: "bevel",
    product: pb,
    name: "Bevel",
    nameInText: "bevel",
    hero: ab.hero,
    replacement: {
      lead: replaceLead("bevel", "diamond-cut bevel finish"),
      cards: [
        { id: "cracked", title: "Replacing chipped edges or a damaged backing", text: pb.replacement.items[0].text, img: ab.cracked },
        { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: ab.lost },
        { id: "match", title: "Can we match your existing bevel plate?", text: pb.replacement.items[1].text, img: ab.match },
      ],
      upgrade: {
        title: "Correcting illegal spacing or upgrading from printed plates",
        text: upgradeText("bevel"),
        tag: "Bevel",
        finish: "bevel",
      },
    },
    explained: {
      title: "What Are Bevel",
      accent: "Number Plates?",
      lead: pb.intro.paragraphs[0],
      note: pb.compare.note!.text,
      art: ab.intro,
      compare: { pair: ["bevel", "4d"], tail: "— Angled or Flat Edge?" },
    },
    sizes: { moto: motoText("Bevel") },
    legal: { photo: ab.legal },
    care: {
      lead: careLead("bevel", "avoid catching the angled character edges with anything abrasive"),
      scratch: {
        title: "Protect the Edges",
        text: "Avoid catching the angled character edges with anything abrasive.",
      },
      photo: ab.care,
    },
    guides: [
      LEGAL_GUIDE("Bevel"),
      {
        id: "bevel-4d",
        lines: ["Bevel vs 4D", "Number Plates"],
        lines2: ["Key differences", "and which to choose."],
        href: "/4d-number-plates",
      },
      {
        id: "styles",
        lines: ["Standard vs 4D vs", "5D vs Bevel Plates"],
        lines2: ["Compare styles,", "looks and features."],
        href: "/plate-styles",
      },
    ],
    guidesArt: ab.guides,
    faq: { car: ab.faq },
    cta: { plate: ab.cta },
  },
};

const fp = (id: SpecialityId) => formatPrices("standard", SPECIALITY[id].format).single;
const LEGAL_CHARS = "Legal size and spacing";

/** The comparison cards: one close-up (finishes) or plate shot (formats) each */
export const COMPARE_CARDS: Record<CompareId, CompareCard> = {
  standard: {
    name: "Standard",
    price: PRICES.standard.single,
    img: "/finishes/printed.webp",
    alt: "Close-up of a standard character printed flat on a white plate",
    characters: "Printed flat onto the plate",
    edge: "Flat, no relief",
    look: "Classic and clean",
  },
  short: {
    name: "Short",
    price: fp("short"),
    img: "/formats/short.webp",
    alt: "A short white number plate reading A1 BCD",
    specs: [
      { label: "Size", value: "226–470mm × 111mm", icon: "size" },
      { label: "Fits", value: "Shorter registrations and recesses", icon: "fits" },
      { label: "Characters", value: LEGAL_CHARS, icon: "chars" },
    ],
  },
  standardSize: {
    name: "Standard",
    price: PRICES.standard.single,
    img: "/formats/standard-front.webp",
    alt: "A standard 520mm white number plate reading AB12 CDE",
    specs: [
      { label: "Size", value: "520mm × 111mm", icon: "size" },
      { label: "Fits", value: "Most registrations and cars", icon: "fits" },
      { label: "Characters", value: LEGAL_CHARS, icon: "chars" },
    ],
  },
  oversized: {
    name: "Oversized",
    price: fp("oversized"),
    img: "/formats/oversized.webp",
    alt: "A tall 533 × 152mm yellow rear number plate reading AB12 CDE",
    specs: [
      { label: "Size", value: "533mm × 152mm", icon: "size" },
      { label: "Fits", value: "Larger rear recesses", icon: "fits" },
      { label: "Plate", value: "Rear only", icon: "plate" },
    ],
  },
  standardRear: {
    name: "Standard",
    price: PRICES.standard.single,
    img: "/formats/standard-rear.webp",
    alt: "A standard 520 × 111mm yellow rear number plate reading AB12 CDE",
    specs: [
      { label: "Size", value: "520mm × 111mm", icon: "size" },
      { label: "Fits", value: "Most rear recesses", icon: "fits" },
      { label: "Plate", value: "Front or rear", icon: "plate" },
    ],
  },
  show: {
    name: "Show",
    price: fp("show"),
    img: "/formats/show.webp",
    alt: "A white show plate reading AB12CDE with custom spacing and a black border",
    specs: [
      { label: "Use", value: "Display only, off the road", icon: "use" },
      { label: "Spacing", value: "Custom, the way you like", icon: "spacing" },
      { label: "On the road", value: "Not permitted", icon: "markings" },
    ],
  },
  roadLegal: {
    name: "Road-Legal",
    price: PRICES.standard.single,
    img: "/formats/standard-front.webp",
    alt: "A road-legal white number plate reading AB12 CDE",
    specs: [
      { label: "Use", value: "On the road", icon: "use" },
      { label: "Spacing", value: "Legal layout and spacing", icon: "spacing" },
      { label: "Markings", value: "Supplier and British Standard", icon: "markings" },
    ],
  },
  ev: {
    name: "EV",
    price: fp("ev"),
    img: "/formats/ev.webp",
    alt: "A white number plate with a green flash at the left, reading AB12 CDE",
    specs: [
      { label: "Flash", value: "Green band at the left", icon: "flash" },
      { label: "For", value: "Zero-emission vehicles only", icon: "for" },
      { label: "Characters", value: LEGAL_CHARS, icon: "chars" },
    ],
  },
  plain: {
    name: "Standard",
    price: PRICES.standard.single,
    img: "/formats/standard-front.webp",
    alt: "A standard white number plate reading AB12 CDE",
    specs: [
      { label: "Flash", value: "None", icon: "flash" },
      { label: "For", value: "Any vehicle", icon: "for" },
      { label: "Characters", value: LEGAL_CHARS, icon: "chars" },
    ],
  },
  "3d": {
    name: "3D Gel",
    price: PRICES["3d"].single,
    img: "/finishes/gel.webp",
    alt: "Close-up of a domed, glossy 3D gel character",
    characters: "Domed polyurethane resin over printed characters",
    edge: "Rounded, soft",
    look: "Smooth and glossy",
  },
  "4d": {
    name: "4D",
    price: PRICES["4d"].single,
    img: "/finishes/acrylic.webp",
    alt: "Close-up of a sharp, flat-topped 4D acrylic character",
    characters: "Laser-cut solid acrylic, bonded to the plate",
    edge: "Sharp, flat-topped",
    look: "Crisp and defined",
  },
  "5d": {
    name: "5D",
    price: PRICES["5d"].single,
    img: "/finishes/acrylic-gel.webp",
    alt: "Close-up of a 5D character: laser-cut acrylic with a domed gel top",
    characters: "Laser-cut acrylic with a gel top",
    edge: "Rounded over a sharp base",
    look: "Combines depth with a glossy top layer",
  },
  ghost: {
    name: "Ghost",
    price: PRICES.ghost.single,
    img: "/finishes/ghost.webp",
    alt: "Close-up of a Ghost character with its styled, glossy finish",
    characters: "A distinctive styled character finish",
    edge: "Rounded, glossy",
    look: "Styled characters, same legal layout",
  },
  bevel: {
    name: "Bevel",
    price: PRICES.bevel.single,
    img: "/finishes/bevel.webp",
    alt: "Close-up of a bevel character with an angled, faceted edge",
    characters: "Acrylic with an angled, diamond-cut edge",
    edge: "Angled, faceted",
    look: "Faceted, catches the light",
  },
};

/* ——— SEO copy from the content docs (Product Pages/02_product-pages) ———
   Each page's headings, card titles, guides and section leads as the docs set
   them, laid over the entries above. Prices stay computed from lib/pricing.ts
   (the client's builder pricing), and links point at pages that exist. */

const ORDER_LEAD = "Enter your registration, choose front, rear or a pair, and preview before you buy.";
const guide = (id: string, lines: readonly [string, string], lines2: readonly [string, string], href: string): GuideLink => ({
  id,
  lines,
  lines2,
  href,
});
const RULES_GUIDE = guide("rules", ["UK Number Plate", "Rules Explained"], ["Character, size and", "marking rules."], "/faqs#legal");
const ALL_STYLES_GUIDE = guide("styles", ["Standard vs 3D vs", "4D vs 5D Plates"], ["Compare styles,", "looks and features."], "/plate-styles");
const items = (p: ProductContent) => p.replacement.items;

const DOCS: Partial<Record<ProductPageId, (page: ProductPageContent) => void>> = {
  standard(page) {
    const it = items(ps);
    page.replacement.heading = ["Replace a Cracked, Faded,", "Lost or Stolen Plate"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: aStd.cracked },
      { id: "lost", title: it[1].title, text: it[1].text, img: aStd.lost },
      { id: "match", title: "Can we match your existing plate?", text: "Order a single front or rear plate in the size of the one you're keeping. We'll make it in our standard printed finish; an exact match to another supplier's plate isn't guaranteed, as acrylic and print vary between makers.", img: aStd.match },
    ];
    page.explained.title = "Standard, 2D and Printed";
    page.explained.accent = "Number Plates Explained";
    page.explained.lead = ps.intro.paragraphs[0];
    page.explained.note = ps.intro.paragraphs[1];
    page.explained.compare.heading = ["Standard vs 3D and 4D", "Number Plates"];
    page.sizes.heading = ["Standard Plate Sizes and", "Reflective Acrylic Construction"];
    page.sizes.lead = ps.sizes.paragraphs[0];
    page.sizes.measure = ps.sizes.paragraphs[2];
    page.legal.heading = ["Road-Use Requirements", "for Standard Plates"];
    page.legal.note = ps.legal.paragraphs[1];
    page.order = { heading: ["How to Order Replacement", "Printed Plates Online"], lead: ORDER_LEAD };
    page.documents = { heading: ["Documents for", "Your Registration"] };
    page.delivery = { heading: ["Standard Plate Delivery", "and Ilford Collection"] };
    page.care.heading = ["Fitting Options and", "Warranty Support"];
    page.care.lead = ps.care.text;
    page.guides = [
      guide("replace", ["How to Replace a", "Number Plate in the UK"], ["Ordering, documents", "and fitting."], "/faqs#ordering"),
      guide("single", ["Single Front or Rear", "Number Plates"], ["When to buy", "just one plate."], "/faqs#ordering"),
      guide("mot", ["Number Plate MOT", "Failure Checklist"], ["What testers check", "and why plates fail."], "/faqs#legal"),
    ];
    page.faq.heading = ["Standard Replacement", "Plate FAQs"];
  },

  "3d"(page) {
    page.sizes.lead = p3.sizes.paragraphs[0];
    page.delivery = {
      lead: "Standard Royal Mail First Class delivery is £3 on orders under £15 and free on orders of £15 or more. Upgrade to Royal Mail Tracked 24 for an additional £2. Royal Mail delivery times are aims, not guarantees. Order before 2pm Monday to Friday and, once your documents are checked, we aim to dispatch the same day.",
    };
    page.care.lead = p3.care.text;
  },

  "4d"(page) {
    const it = items(p4);
    page.replacement.heading = ["Replacement 4D", "Number Plates"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: a4.cracked },
      { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: a4.lost },
      { id: "match", title: it[1].title, text: it[1].text, img: a4.match },
    ];
    page.replacement.upgrade = { title: it[2].title, text: it[2].text, tag: "4D", finish: "acrylic" };
    page.explained.title = "Laser-Cut Acrylic Characters —";
    page.explained.accent = "What Makes a Plate 4D?";
    page.explained.lead = p4.intro.paragraphs[0];
    page.explained.note = p4.intro.paragraphs[1];
    page.explained.compare.heading = ["4D vs 3D vs 4D Gel —", "Which Finish Suits You?"];
    page.sizes.heading = ["4D Number Plate Thickness,", "Sizes and Options"];
    page.sizes.lead = p4.sizes.paragraphs[0];
    page.legal.heading = ["Are 4D Number", "Plates Legal?"];
    page.legal.note = p4.legal.paragraphs[1];
    page.order = { heading: ["Order 4D Plates Online —", "Documents and Preview"], lead: ORDER_LEAD };
    page.delivery = { heading: ["4D Plate Delivery and", "Same-Day Ilford Collection"] };
    page.care.heading = ["Fitting, Cleaning and", "Warranty Support"];
    page.care.lead = p4.care.text;
    page.guides = [
      guide("legal", ["Are 4D Number", "Plates Legal?"], ["Rules, requirements", "and what to know."], "/faqs#legal"),
      guide("3d-4d", ["3D vs 4D", "Number Plates"], ["Key differences", "and which to choose."], "/3d-number-plates"),
      ALL_STYLES_GUIDE,
    ];
  },

  "5d"(page) {
    const it = items(p5);
    page.replacement.heading = ["Replacement 5D and", "4D Gel Number Plates"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: a5.cracked },
      { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: a5.lost },
      { id: "match", title: it[1].title, text: it[1].text, img: a5.match },
    ];
    page.explained.title = "4D Gel Number Plates —";
    page.explained.accent = "Our 5D Finish Explained";
    page.explained.compare.heading = ["5D vs 4D vs 3D —", "Acrylic, Gel or Both?"];
    page.sizes.heading = ["5D Plate Sizes and", "Finish Options"];
    page.sizes.lead = p5.sizes.paragraphs[0];
    page.sizes.measure = p5.sizes.paragraphs[1];
    page.legal.heading = ["Are 5D and 4D Gel", "Plates Legal?"];
    page.legal.note = p5.legal.paragraphs[1];
    page.order = { heading: ["Order 5D Plates Online —", "Documents and Preview"], lead: ORDER_LEAD };
    page.delivery = { heading: ["5D Plate Delivery and", "Ilford Collection"] };
    page.care.heading = ["Caring for Layered Plates", "and Warranty Support"];
    page.care.lead = p5.care.text;
    page.guides = [
      ALL_STYLES_GUIDE,
      RULES_GUIDE,
      guide("4d-5d", ["4D vs 5D", "Number Plates"], ["Flat acrylic", "or a gel top."], "/4d-number-plates"),
    ];
  },

  ghost(page) {
    const it = items(pg);
    page.replacement.heading = ["Replacement Ghost", "Number Plates"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: ag.cracked },
      { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: ag.lost },
      { id: "match", title: it[1].title, text: it[1].text, img: ag.match },
    ];
    page.explained.title = "Ghost Number Plates";
    page.explained.accent = `from ${gbp(PRICES.ghost.single)} per Plate`;
    page.explained.lead = pg.intro.paragraphs[0];
    page.explained.note = pg.intro.paragraphs[1];
    page.explained.compare = { pair: ["ghost", "4d"], tail: "", heading: ["Ghost vs 4D and Bevel", "Number Plates"] };
    page.sizes.heading = ["Ghost Plate Sizes and", "Specifications"];
    page.sizes.lead = pg.sizes.paragraphs[0];
    page.sizes.measure = pg.sizes.paragraphs[1];
    page.legal.heading = ["Ghost Number Plates and", "the Legal Requirements"];
    page.legal.note = pg.legal.paragraphs[1];
    page.order = { heading: ["Ordering, Documents and", "Registration Checks"], lead: ORDER_LEAD };
    page.delivery = { heading: ["Ghost Plate Delivery", "and Ilford Collection"] };
    page.care.heading = ["Care and", "Warranty Support"];
    page.care.lead = pg.care.text;
    page.guides = [
      guide("ghost-style", ["Ghost Plates: Styling", "vs Illegal Stealth Plates"], ["What's decorative", "and what isn't."], "/faqs#legal"),
      RULES_GUIDE,
      guide("anpr", ["Number Plates and", "ANPR Cameras"], ["Why plates must", "read clearly."], "/faqs#legal"),
    ];
  },

  bevel(page) {
    const it = items(pb);
    page.replacement.heading = ["Replacement Bevel", "Number Plates"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: ab.cracked },
      { id: "lost", title: "Replacing a lost front or rear plate", text: LOST_TEXT, img: ab.lost },
      { id: "match", title: it[1].title, text: it[1].text, img: ab.match },
    ];
    page.explained.title = "Diamond-Cut Number Plates —";
    page.explained.accent = "The Bevelled Edge Explained";
    page.explained.lead = pb.intro.paragraphs[0];
    page.explained.note = pb.intro.paragraphs[1];
    page.explained.compare.heading = ["Bevel vs 4D and 5D —", "Edge Shape or Gel Finish?"];
    page.sizes.heading = ["Bevel Plate Sizes and", "Profile Options"];
    page.sizes.lead = pb.sizes.paragraphs[0];
    page.sizes.measure = pb.sizes.paragraphs[1];
    page.legal.heading = ["Are Bevelled Number", "Plates Legal?"];
    page.legal.note = pb.legal.paragraphs[1];
    page.order = { heading: ["Order Bevel Plates Online —", "Documents and Preview"], lead: ORDER_LEAD };
    page.delivery = { heading: ["Bevel Plate Delivery and", "Same-Day Ilford Collection"] };
    page.care.heading = ["Bevel Plate Care and", "Warranty Support"];
    page.care.lead = pb.care.text;
    page.guides = [
      ALL_STYLES_GUIDE,
      RULES_GUIDE,
      guide("premium", ["Bevel vs 4D vs 5D:", "Which Premium Finish?"], ["Edge, depth", "and gloss compared."], "/5d-number-plates"),
    ];
  },

  oversized(page) {
    const it = items(pOver);
    page.replacement.heading = ["Replacing an Oversized", "Rear Plate"];
    page.replacement.cards = [
      { id: "cracked", title: it[0].title, text: it[0].text, img: aOver.cracked },
      { id: "lost", title: it[2].title, text: it[2].text, img: aOver.lost },
      { id: "match", title: it[1].title, text: it[1].text, img: aOver.match },
    ];
    page.explained.title = "Oversized Plate,";
    page.explained.accent = "Not Oversized Characters";
    page.explained.lead = pOver.intro.paragraphs[0];
    page.explained.note = pOver.intro.paragraphs[1];
    page.sizes.heading = ["Measure Your", "Rear Plate Recess"];
    page.sizes.lead =
      "Measure the width and height of the recess where the rear plate sits, check that the plate would sit flat without covering trim, lights or sensors, and compare with the sizes in the builder. If yours falls between sizes, contact us before ordering.";
    page.sizes.measure = "Please don't trim a plate to make it fit: trimming can remove required margins and markings.";
    page.documents = { heading: ["Documents", "You'll Need"] };
    page.delivery = {
      heading: ["Oversized Plate Delivery", "and Collection"],
      lead: "Standard Royal Mail First Class delivery is £3 on orders under £15 and free on orders of £15 or more. Upgrade to Royal Mail Tracked 24 for an additional £2. If your order and document checks are complete before 2pm on a working weekday we aim to dispatch that day. Delivery times are Royal Mail's aims, not guarantees. We deliver by Royal Mail to addresses in Great Britain; if your address is in Northern Ireland, the Channel Islands or the Isle of Man, please contact us before ordering.",
    };
    page.care.lead = pOver.care.text;
    page.guides = [
      guide("recess", ["Oversized Plates", "and Recess Fit"], ["Measuring before", "you order."], "/faqs#ordering"),
      RULES_GUIDE,
      guide("mot", ["Number Plate MOT", "Failure Checklist"], ["What testers check", "and why plates fail."], "/faqs#legal"),
    ];
    page.faq.heading = ["Oversized Number", "Plate Questions"];
  },
};

for (const [id, apply] of Object.entries(DOCS) as [ProductPageId, (page: ProductPageContent) => void][]) {
  apply(PRODUCT_PAGES[id]);
}
