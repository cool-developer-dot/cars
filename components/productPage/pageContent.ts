import type { PlateFinish } from "@/components/home/PlateArt";
import { PRODUCTS, type ProductContent } from "@/lib/products";
import { PRICES } from "@/lib/site";

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

/** The finishes the comparison cards can show */
export type CompareId = "3d" | "4d" | "5d" | "ghost" | "bevel";

export type GuideLink = {
  id: string;
  /** Two fixed lines, as designed */
  lines: readonly [string, string];
  lines2: readonly [string, string];
  href: string;
};

export type ProductPageContent = {
  id: ProductPageId;
  product: ProductContent;
  /** The style as headings name it: "3D", "4D", "5D", "Bevel" */
  name: string;
  /** Lower-case form for running text: "3D", "bevel" */
  nameInText: string;
  hero: PageImage & { srcMobile: string };
  replacement: {
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
    compare: { pair: readonly [CompareId, CompareId]; tail: string; images?: Partial<Record<CompareId, string>> };
  };
  sizes: { moto: string };
  legal: { photo: PageImage };
  care: { lead: string; scratch: { title: string; text: string }; photo: { src: string; srcMobile: string } };
  guides: readonly GuideLink[];
  guidesArt: { src: string; srcMobile: string };
  faq: { car: PageImage & { srcMobile: string } };
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
const art = (dir: string, name: string, finishWords: string) => ({
  hero: {
    src: `/${dir}/hero.webp`,
    srcMobile: `/${dir}/hero-mobile.webp`,
    width: 2000,
    height: 1000,
    alt: `A white front and a yellow rear ${name} number plate reading AB12 CDE, with ${finishWords}`,
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
    alt: `A grey car fitted with a white ${name} number plate reading AB12 CDE`,
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

export const PRODUCT_PAGES: Record<ProductPageId, ProductPageContent> = {
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

/** The finish comparison cards: copy from lib/products.ts, one macro photo each */
export const COMPARE_CARDS: Record<
  CompareId,
  { name: string; price: number; img: string; alt: string; characters: string; edge: string; look: string }
> = {
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
    alt: "Close-up of a Ghost character: a glossy, dark smoked finish",
    characters: "Dark smoked characters",
    edge: "Rounded, glossy",
    look: "Subtle, tinted stealth look",
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
