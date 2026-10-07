import type { Faq } from "./faqs";
import { builderUrl, type BuilderLinkOptions } from "./builderLink";
import { ADD_ON_PRICES } from "./pricing";
import {
  DELIVERY,
  PRICES,
  SPECIALITY,
  formatLinkOptions,
  formatPrices,
  gbp,
  type PlateFormat,
  type SpecialityId,
  type StyleId,
} from "./site";

/** Every product page: a plate style (finish) or a speciality format */
export type ProductPageId = StyleId | SpecialityId;

export type ProductContent = {
  id: ProductPageId;
  /** The style the page prices and preselects (defaults to the id, for style pages) */
  style?: StyleId;
  /** A speciality format's builder presets (size, badge, show plate) */
  format?: PlateFormat;
  /** The registration the hero's builder card starts with (a short one on the short page) */
  sampleReg?: string;
  /** The docs' hero wording on a style page: the "Buy …" heading and the two option cards */
  buy?: {
    title: string;
    single: { title: string; text: string };
    pair: { title: string; text: string };
  };
  /** Hero wording where the style-page defaults don't fit (speciality pages) */
  hero?: {
    eyebrow: string;
    /** "Build my short plates" */
    noun: string;
    single: { title: string; text: string; label: string };
    pair: { title: string; text: string; label: string };
  };
  path: string;
  metaTitle: string;
  metaDescription: string;
  /** Short name used in buttons: "Build my 3D plates" */
  short: string;
  h1: string;
  lead: string;
  intro: { eyebrow: string; heading: string; paragraphs: string[] };
  replacement: { heading: string; items: { title: string; text: string }[] };
  compare: {
    heading: string;
    columns: string[];
    /** Column index matching this product, to highlight it */
    highlight: number;
    rows: { label: string; values: string[] }[];
    note?: { text: string; href?: string; linkLabel?: string };
  };
  sizes: { heading: string; paragraphs: string[] };
  legal: { heading: string; paragraphs: string[] };
  care: { heading: string; text: string };
  faqs: Faq[];
};

/** The style a page sells */
export const styleOf = (p: ProductContent): StyleId => p.style ?? (p.id as StyleId);

/** One plate and a pair, for the page's format in `style` (its own by default) */
export const pagePrices = (p: ProductContent, style: StyleId = styleOf(p)) =>
  p.format ? formatPrices(style, p.format) : { single: PRICES[style].single, pair: PRICES[style].pair };

/** A "build" link from this page: its style and format, plus anything chosen */
export const pageBuildUrl = (p: ProductContent, opts: BuilderLinkOptions = {}) =>
  builderUrl({ style: styleOf(p), ...formatLinkOptions(p.format, opts.reg), ...opts });

/** Headline single / pair prices, formatted — from lib/site.ts */
const single = (id: StyleId) => gbp(PRICES[id].single);
const pair = (id: StyleId) => gbp(PRICES[id].pair);

const COMMON_SIZE =
  "A common standard car-plate size is 520mm × 111mm. Other sizes may be available for some registrations; the builder shows what is offered for this style once you enter your registration.";
const LEGAL_CORE =
  "Yes, when made correctly: solid black, non-reflective characters at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings.";
const MOT_SCOPE =
  "This is separate from the DVSA MOT check, which looks at whether characters are correctly formed, evenly spaced, secure and not obscured — it doesn't check for the supplier's name, postcode or BS mark on the plate.";
const WARRANTY_TAIL =
  "A warranty covers manufacturing defects; it is not a statement that a product is approved for road use. If you think a plate has a fault, contact us and we'll assess it.";
/** The client hasn't confirmed Ghost's construction and compliance yet (see the homepage and /plate-styles) */
const GHOST_STATUS =
  "Ghost's specific construction and compliance information is being finalised. Please contact us for its current status before ordering Ghost plates for road use.";
/** A speciality format's prices in Standard, its cheapest style */
const fmt = (id: SpecialityId) => formatPrices("standard", SPECIALITY[id].format);
const fSingle = (id: SpecialityId) => gbp(fmt(id).single);
const fPair = (id: SpecialityId) => gbp(fmt(id).pair);
const WARRANTY_ALL =
  "New orders carry a manufacturing-defect warranty from the delivery or collection date — 6 months for Standard, 3D Gel and 4D, and 12 months for 5D, Ghost and Bevel — in addition to your statutory rights.";
const ANY_STYLE =
  "Yes. Choose Standard, 3D Gel, 4D, 5D, Ghost or Bevel in the builder; the price updates as you choose.";
/** The docs' warranty paragraph: months follow the style (lib/site.ts WARRANTY_MONTHS) */
const warranty = (months: number) =>
  `New orders carry a ${months}-month manufacturing-defect warranty from the delivery or collection date, in addition to your statutory rights. ${WARRANTY_TAIL}`;
const TRACKED_FAQ = (q: string): Faq => ({
  id: "tracked",
  q,
  a: "It adds tracking and Royal Mail's own next-working-day aim, on top of the standard First Class service.",
});
const COLLECT_FAQ: Faq = {
  id: "collect",
  q: "Can I collect the same day?",
  a: DELIVERY.collectionReady,
};

export const PRODUCTS: Record<ProductContent["id"], ProductContent> = {
  standard: {
    id: "standard",
    path: "/standard-number-plates",
    metaTitle: `Standard Number Plates from ${single("standard")} | 2D Printed`,
    metaDescription:
      `Standard printed number plates made to order, from ${single("standard")} per plate. The simplest, lowest-priced way to replace a plate. Royal Mail delivery or Ilford collection.`,
    short: "Standard",
    h1: "Standard Replacement Number Plates",
    lead: "Flat, printed characters on a reflective acrylic plate — our lowest-priced style, single or in a pair.",
    buy: {
      title: `Standard Replacement Number Plates from ${single("standard")} per plate`,
      single: {
        title: "White front or yellow rear replacement plates",
        text: `${single("standard")} per plate — order just the front or the rear.`,
      },
      pair: { title: `Front and rear pairs — ${pair("standard")} per pair`, text: "Order both together." },
    },
    intro: {
      eyebrow: "Printed plates",
      heading: "Standard, 2D and printed number plates explained",
      paragraphs: [
        "A standard number plate — also called 2D or printed — has flat characters printed directly onto a reflective acrylic plate, with no raised or domed finish.",
        "It's the simplest and least expensive of our styles, and it meets exactly the same legal requirements for character size, spacing, colour and markings as our raised-character styles.",
      ],
    },
    replacement: {
      heading: "Replace a cracked, faded, lost or stolen plate",
      items: [
        {
          title: "Correcting a damaged or incorrectly displayed plate",
          text: "If your current plate is cracked, faded, or was made with incorrect spacing, a new standard plate made to the current rules fixes all three. We make your registration to the legal layout, so a replacement for a non-compliant original may look different from it.",
        },
        {
          title: "Replace only the plate you need",
          text: "Order a single front or rear plate, or a pair — whichever you need.",
        },
      ],
    },
    compare: {
      heading: "Standard vs 3D and 4D number plates",
      columns: ["Standard", "3D gel", "4D"],
      highlight: 0,
      rows: [
        { label: "Characters", values: ["Printed flat", "Domed resin", "Laser-cut acrylic"] },
        { label: "Look", values: ["Classic", "Smooth, glossy", "Sharp, defined"] },
        { label: "From", values: [single("standard"), single("3d"), single("4d")] },
      ],
      note: { text: "Standard is our lowest-priced style and the simplest like-for-like replacement. For a raised finish, see 3D or 4D.", href: "/3d-number-plates", linkLabel: "3D plates" },
    },
    sizes: {
      heading: "Standard plate sizes and reflective acrylic construction",
      paragraphs: [
        "Standard plates are made on the same reflective acrylic base as our other styles — white reflective at the front, yellow reflective at the rear — with printed rather than raised characters.",
        COMMON_SIZE,
        "Measure your existing plate and the mounting area on the car before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Road-use requirements for standard plates",
      paragraphs: [
        "Standard plates meet the same legal requirements as every style we make: correct Charles Wright characters, correct spacing, the right reflective background, solid black non-reflective characters, and the required supplier and British Standard markings.",
        "This is separate from the DVSA MOT check, which looks at condition, legibility, security and fitting rather than the supplier markings.",
      ],
    },
    care: {
      heading: "Fitting options and warranty support",
      text: `If a fixing option such as sticky pads or a screw kit is available for your order, you'll see it at checkout. ${warranty(6)}`,
    },
    faqs: [
      { id: "per-plate", q: `Is ${single("standard")} the price for one plate or a pair?`, a: `One plate. A front-and-rear pair is ${pair("standard")}.` },
      { id: "one", q: "Can I order just a rear, or just a front, plate?", a: "Yes — choose front, rear or both in the builder." },
      { id: "2d", q: "What's the difference between “standard” and “2D”?", a: "Same product — flat, printed characters, as opposed to a raised 3D, 4D, 5D, Ghost or Bevel finish." },
      { id: "material", q: "What's the plate made from?", a: "Reflective acrylic, with the registration printed directly onto it." },
      { id: "fixings", q: "Do you offer fixing pads or screws?", a: "Where available, you'll see fixing options at checkout." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade worth it for a standard plate?", a: "It adds tracking and Royal Mail's own next-working-day aim — the same option applies whichever style you order." },
      { id: "private-reg", q: "Can I order a plate for a newly assigned private registration?", a: "Yes, with the matching entitlement document — your V5C or retention certificate showing that registration.", links: [{ label: "Documents you'll need", href: "/faqs#documents" }] },
      { id: "trailer", q: "I need a plate for a trailer — can it be a standard plate?", a: "A trailer must display the same number plate as the vehicle towing it. Order the plate in the size that fits your trailer." },
      { id: "stolen", q: "My plate was lost or stolen — what next?", a: "Report a theft to the police, keep the reference number, then order a replacement.", links: [{ label: "Lost or stolen plates", href: "/faqs#warranty" }] },
    ],
  },

  "3d": {
    id: "3d",
    path: "/3d-number-plates",
    metaTitle: `3D Number Plates from ${single("3d")} | 3D Gel Plates`,
    metaDescription:
      `3D gel number plates with raised, domed resin characters, made to order. Single plates from ${single("3d")}, pairs from ${pair("3d")}. Royal Mail delivery or Ilford collection.`,
    short: "3D",
    h1: "3D Number Plates",
    lead: "Raised, domed resin characters — single plates or matching pairs, made to order.",
    intro: {
      eyebrow: "3D gel explained",
      heading: "What are 3D gel number plates?",
      paragraphs: [
        "3D number plates — also called 3D gel or domed resin plates — have raised characters built up from polyurethane resin over solid black characters on a reflective acrylic plate.",
        "They're sometimes confused with an older style printed flat with two-tone shading to look raised. Plates fitted since 1 September 2021 must use a single shade of black, so that shaded-print style isn't permitted. Genuine raised 3D gel characters in solid black are a different product.",
      ],
    },
    replacement: {
      heading: "Replacement 3D number plates for damaged, lost or worn plates",
      items: [
        {
          title: "Replacing lifted, cracked or cloudy gel characters",
          text: "If the resin on a plate has lifted, cracked or clouded, contact us and we'll assess it — if it's a plate we made and it's a manufacturing fault, we'll advise on next steps. Otherwise a new plate is usually the practical fix.",
        },
        {
          title: "Replacing a lost front or rear plate",
          text: "Order just the one you've lost, in the size of the plate you're keeping.",
        },
        {
          title: "Can we match your existing 3D plate?",
          text: "We can make your replacement in the same size and 3D gel finish from our range. We can't guarantee it will look identical to a plate made by a different supplier, since gel depth and finish vary between manufacturers.",
        },
        {
          title: "Correcting illegal spacing or upgrading from printed plates",
          text: "If an existing plate has incorrect character spacing, we can only make your registration in the correct legal layout — so a replacement may look different from a non-compliant original. You can also switch from a standard printed plate to 3D gel, or from 3D to another finish, without needing to tell the DVLA, as long as the registration itself isn't changing.",
        },
      ],
    },
    compare: {
      heading: "3D vs 4D number plates — gel or acrylic?",
      columns: ["3D gel", "4D"],
      highlight: 0,
      rows: [
        { label: "Characters", values: ["Domed polyurethane resin over printed characters", "Laser-cut solid acrylic, bonded to the plate"] },
        { label: "Edge", values: ["Rounded, soft", "Sharp, flat-topped"] },
        { label: "Look", values: ["Smooth and glossy", "Crisp and defined"] },
        { label: "From", values: [single("3d"), single("4d")] },
      ],
      note: {
        text: "Looking for a gel finish with the depth of laser-cut acrylic underneath it?",
        href: "/5d-number-plates",
        linkLabel: "See our 5D plates (also called 4D gel)",
      },
    },
    sizes: {
      heading: "3D number plate sizes and options",
      paragraphs: [
        COMMON_SIZE,
        "3D gel finishes may be available on selected motorcycle plate formats — the builder will show what's currently offered for your registration.",
        "Measuring for a replacement: measure both your existing plate and the available mounting area on the car, since a plate that's the right size on paper still needs to fit the actual recess and fixing points.",
      ],
    },
    legal: {
      heading: "Are 3D number plates legal in the UK?",
      paragraphs: [
        "Yes, when made correctly: solid black, non-reflective characters in the Charles Wright typeface at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings. Raised characters are permitted under the current rules.",
        MOT_SCOPE,
      ],
    },
    care: {
      heading: "Caring for your 3D plates and warranty support",
      text: `Wash with car shampoo and a soft cloth; avoid scraping ice or dirt off the raised characters with anything hard. ${warranty(6)}`,
    },
    faqs: [
      { id: "per-plate", q: `Is the ${single("3d")} price per plate or for a pair?`, a: `Per plate. A pair (front and rear) is ${pair("3d")}.` },
      { id: "legal", q: "Are 3D gel number plates legal in the UK?", a: "Yes, when made correctly — see “Are 3D Number Plates Legal” above." },
      { id: "one", q: "Can I replace just one 3D plate?", a: "Yes. Order a single front or rear plate in the size of the one you're keeping." },
      { id: "match", q: "Can you match a 3D plate made by another supplier?", a: "We'll match the size and use our 3D gel finish, but an exact visual match to a different manufacturer's plate isn't guaranteed — gel depth and finish vary between suppliers." },
      { id: "raised", q: "Are raised characters legal, or only printed ones?", a: "Raised characters are permitted, provided the plate meets the size, spacing, colour and marking rules — see above." },
      { id: "moto", q: "Can I get 3D gel on a short or motorcycle plate?", a: "Enter your registration in the builder to see the sizes offered; for motorcycle, choose “motorcycle” in the builder to see current 3D options for your registration.", links: [{ label: "Short plates", href: "/short-number-plates" }] },
      { id: "private-reg", q: "Do I need new documents if I'm putting on a newly assigned private registration?", a: "Whether you need a fresh entitlement document depends on whether the registration has just been assigned or retained to your vehicle — check your V5C or retention certificate (V778) matches what you're ordering against." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade worth it?", a: "It adds tracking and Royal Mail's own next-working-day delivery aim, subject to their service terms — useful if you want visibility on your order's progress." },
      { id: "fitting", q: "Will fitting a 3D plate damage the gel?", a: "Handle the plate by its edges and use the fixing method suited to your car (sticky pads or screws); avoid pressing directly on the raised characters." },
      { id: "fault", q: "What if my plate has a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  "4d": {
    id: "4d",
    path: "/4d-number-plates",
    metaTitle: `4D Number Plates from ${single("4d")} | Laser-Cut Acrylic`,
    metaDescription:
      `4D number plates with laser-cut acrylic characters, made to order. Single plates from ${single("4d")}, pairs from ${pair("4d")}. Royal Mail delivery or Ilford collection.`,
    short: "4D",
    h1: "4D Number Plates",
    lead: "Laser-cut acrylic characters, bonded to the plate — single plates or matching pairs, made to order.",
    buy: {
      title: `Buy 4D Number Plates from ${single("4d")} per plate`,
      single: { title: "Single front or rear 4D plates", text: `${single("4d")} per plate.` },
      pair: { title: `4D number plate pairs — ${pair("4d")} per pair`, text: `Order both plates together at ${pair("4d")}.` },
    },
    intro: {
      eyebrow: "Laser-cut acrylic",
      heading: "Laser-cut acrylic characters — what makes a plate 4D?",
      paragraphs: [
        "4D number plates have characters cut from solid black acrylic and bonded onto a reflective acrylic plate, rather than printed or gel-domed on top of it. The result is a sharp, flat-topped character with a defined edge.",
        "Some suppliers call an acrylic-plus-gel finish “4D gel” — on ReplacementPlates that's our 5D product.",
      ],
    },
    replacement: {
      heading: "Replacement 4D number plates",
      items: [
        {
          title: "Cracked acrylic, damaged backing or missing characters",
          text: "If a character has come loose, cracked, or the backing plate is damaged, the fix is a full replacement plate — we don't sell individual replacement characters as a repair for a plate that's already on the road, since a plate with mismatched or re-applied characters may not meet the display requirements.",
        },
        {
          title: "Replacing one plate and matching character depth",
          text: "Order a single front or rear plate. We'll match our own acrylic depth and finish; an exact match to another manufacturer's 4D plate isn't guaranteed, as acrylic thickness varies between suppliers.",
        },
        {
          title: "A new compliant layout for incorrectly spaced plates",
          text: "We make your registration to the correct legal spacing, so a replacement for a non-compliant plate may look different from the original — that's the version that meets the current rules.",
        },
      ],
    },
    compare: {
      heading: "4D vs 3D vs 4D gel — which finish suits you?",
      columns: ["3D gel", "4D", "5D (4D gel)"],
      highlight: 1,
      rows: [
        { label: "Characters", values: ["Domed resin", "Laser-cut acrylic", "Laser-cut acrylic with a gel top"] },
        { label: "Edge", values: ["Rounded, soft", "Sharp, flat-topped", "Rounded over a sharp base"] },
        { label: "From", values: [single("3d"), single("4d"), single("5d")] },
      ],
      note: {
        text: "Looking for 4D gel? Some suppliers call an acrylic-plus-gel finish “4D gel” — on ReplacementPlates that's our 5D product.",
        href: "/5d-number-plates",
        linkLabel: "See 5D plates",
      },
    },
    sizes: {
      heading: "4D number plate thickness, sizes and options",
      paragraphs: [
        "Our 4D characters are laser-cut from solid acrylic. If you're looking for a deeper, gel-topped finish, see our 5D plates, also known as 4D gel.",
        COMMON_SIZE,
        "Measuring for a replacement: measure your existing plate and the mounting area on the car — a size that matches on paper still needs to fit the actual recess and fixings.",
      ],
    },
    legal: {
      heading: "Are 4D number plates legal?",
      paragraphs: [LEGAL_CORE, MOT_SCOPE],
    },
    care: {
      heading: "Fitting, cleaning and warranty support",
      text: `Wash with car shampoo and a soft cloth. ${warranty(6)}`,
    },
    faqs: [
      { id: "per-plate", q: `Is ${single("4d")} per plate or per pair?`, a: `Per plate. A pair is ${pair("4d")}.` },
      { id: "thickness", q: "What thickness are your 4D characters?", a: "We're confirming the exact specification against our current catalogue and will update this page once it's verified." },
      { id: "gel", q: "What's the difference between 4D acrylic and 4D gel?", a: "Acrylic-only 4D has sharp, flat-topped characters. A gel-topped version — sometimes called 4D gel — is our 5D product.", links: [{ label: "5D plates", href: "/5d-number-plates" }] },
      { id: "legal", q: "Are 4D plates legal? Will they pass an MOT?", a: "They're legal when made to the current rules — see above. Passing an MOT depends on the plate being correctly fitted, clean and undamaged, not just correctly made." },
      { id: "match", q: "Can you match a 4D plate from another maker?", a: "We'll match size and use our own acrylic finish; an identical visual match to a different supplier's plate isn't guaranteed." },
      { id: "formats", q: "Do you sell 4D in short or hex formats?", a: "The builder shows the sizes and options offered for your registration.", links: [{ label: "Short plates", href: "/short-number-plates" }] },
      COLLECT_FAQ,
      { id: "dispatch", q: "What's the difference between dispatch and delivery?", a: "Dispatch is when we send your order; delivery is when Royal Mail gets it to you, on their own next-working-day aim, not a guarantee." },
      { id: "ev", q: "Can I get an EV badge on a 4D plate?", a: "If your vehicle is eligible, choose the EV or UK+EV option in the builder.", links: [{ label: "EV plates", href: "/ev-number-plates" }] },
      { id: "loose", q: "Loose or damaged character — is that covered?", a: "If it's a manufacturing fault, contact us and we'll assess it." },
    ],
  },

  "5d": {
    id: "5d",
    path: "/5d-number-plates",
    metaTitle: `5D Number Plates from ${single("5d")} | 4D Gel Plates`,
    metaDescription:
      `5D number plates — acrylic characters with a gel top layer, made to order. Single plates from ${single("5d")}, pairs from ${pair("5d")}. Royal Mail delivery or Ilford collection.`,
    short: "5D",
    h1: "5D Number Plates",
    lead: "Laser-cut acrylic characters with a gel top layer — also known as 4D gel — single plates or matching pairs.",
    buy: {
      title: `Buy 5D Gel Number Plates from ${single("5d")} per plate`,
      single: { title: "Single front or rear 5D plates", text: `${single("5d")} per plate.` },
      pair: { title: `Single 5D plates and pairs — ${pair("5d")} per pair`, text: `${single("5d")} per plate, or ${pair("5d")} for a front-and-rear pair.` },
    },
    intro: {
      eyebrow: "Our 5D finish explained",
      heading: "4D gel number plates — our 5D finish explained",
      paragraphs: [
        "Some suppliers call this construction “4D gel”; on ReplacementPlates we call it 5D. It starts the same way as our 4D plates — laser-cut solid acrylic characters — with a gel layer added on top.",
        "The result combines the sharp edge of laser-cut acrylic with the glossy finish of a gel top. Naming for this construction varies across the market; this section describes our own product.",
      ],
    },
    replacement: {
      heading: "Replacement 5D and 4D gel number plates",
      items: [
        {
          title: "Damaged acrylic, gel lifting or worn backing",
          text: "If the acrylic has cracked or the gel layer has lifted, the fix is a new plate. If it's one of ours and you think it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Matching a single plate's finish and overall depth",
          text: "Order a single front or rear plate and we'll match it to our own 5D construction. We can't guarantee an identical match to a different supplier's acrylic-plus-gel plate, since construction and depth vary between makers.",
        },
      ],
    },
    compare: {
      heading: "5D vs 4D vs 3D — acrylic, gel or both?",
      columns: ["3D gel", "4D", "5D"],
      highlight: 2,
      rows: [
        { label: "Construction", values: ["Domed resin over printed characters", "Laser-cut acrylic", "Laser-cut acrylic with a gel top"] },
        { label: "Look", values: ["Smooth, glossy", "Sharp, defined", "Combines depth with a glossy top layer"] },
        { label: "From", values: [single("3d"), single("4d"), single("5d")] },
      ],
    },
    sizes: {
      heading: "5D plate sizes and finish options",
      paragraphs: [
        COMMON_SIZE,
        "Measure your existing plate and the mounting area before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Are 5D and 4D gel plates legal?",
      paragraphs: [
        LEGAL_CORE,
        "This is separate from the DVSA MOT check, which looks at condition, legibility, security and fitting.",
      ],
    },
    care: {
      heading: "Caring for layered plates and warranty support",
      text: `Wash with car shampoo and a soft cloth. ${warranty(12)}`,
    },
    faqs: [
      { id: "name", q: "Why do you call it 5D when some sites say 4D gel?", a: "It's our name for an acrylic-plus-gel construction; other suppliers use different terms for similar or different builds. Our specification is described above." },
      { id: "vs3d", q: "How is 5D different from 3D gel?", a: "3D gel domes resin over printed characters. 5D starts with laser-cut acrylic (like 4D) and adds a gel top layer.", links: [{ label: "3D plates", href: "/3d-number-plates" }, { label: "4D plates", href: "/4d-number-plates" }] },
      { id: "per-plate", q: `Is ${single("5d")} per plate or per pair?`, a: `Per plate. A pair is ${pair("5d")}.` },
      { id: "match-other", q: "Can you match another maker's 4D gel plate?", a: "We'll match it to our own 5D construction; an identical visual match to a different supplier isn't guaranteed." },
      { id: "match", q: "Can I order a 5D plate to match one I already have?", a: "We'll match size and use our own 5D construction; an identical visual match to a plate made by a different supplier isn't guaranteed, as construction varies between manufacturers." },
      { id: "sizes", q: "What sizes are available?", a: "See the sizes above; the builder will show what fits your registration." },
      { id: "legal", q: "Are 5D plates legal?", a: "Yes, when made to the current rules — see above." },
      COLLECT_FAQ,
      TRACKED_FAQ("Is Tracked 24 worth the upgrade?"),
      { id: "fault", q: "What if my plate develops a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  ghost: {
    id: "ghost",
    path: "/ghost-number-plates",
    metaTitle: `Ghost Number Plates from ${single("ghost")} | Royal Mail Delivery`,
    metaDescription:
      `Ghost number plates, made to order from ${single("ghost")} per plate. A distinctive character finish. Royal Mail delivery or Ilford collection.`,
    short: "Ghost",
    h1: "Ghost Number Plates",
    lead: "A distinctive styled character finish, made to order — single plates or matching pairs.",
    buy: {
      title: `Buy Ghost Plates from ${single("ghost")} per plate`,
      single: { title: "Single front or rear Ghost plates", text: `${single("ghost")} per plate.` },
      pair: { title: `Single plates and pairs — ${pair("ghost")} per pair`, text: `${single("ghost")} per plate, or ${pair("ghost")} for a front-and-rear pair.` },
    },
    intro: {
      eyebrow: "Our Ghost finish",
      heading: `Ghost number plates from ${single("ghost")} per plate`,
      paragraphs: [
        "Ghost is a styled character finish available on request. It refers to a distinctive visual treatment of the characters rather than a change to the plate's legal layout, size or colour rules.",
        "“Ghost” is used differently by different suppliers in this market — this page describes our own product, not a generic industry standard.",
      ],
    },
    replacement: {
      heading: "Replacement Ghost number plates",
      items: [
        {
          title: "Replacing a damaged plate",
          text: "If a Ghost plate is damaged, order a replacement in the same size. If it's one of ours and you think it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Matching your existing finish",
          text: "Order a single front or rear plate and we'll match it to our own Ghost finish. An identical visual match to a different supplier's product isn't guaranteed, since Ghost styling varies between makers.",
        },
      ],
    },
    compare: {
      heading: "Ghost vs 4D and Bevel number plates",
      columns: ["4D", "Bevel", "Ghost"],
      highlight: 2,
      rows: [
        { label: "What changes", values: ["Character depth (laser-cut acrylic)", "Character edge (angled cut)", "Character styling"] },
        { label: "From", values: [single("4d"), single("bevel"), single("ghost")] },
      ],
      note: { text: GHOST_STATUS, href: "/contact", linkLabel: "Contact us" },
    },
    sizes: {
      heading: "Ghost plate sizes and specifications",
      paragraphs: [
        COMMON_SIZE,
        "Measure your existing plate and the mounting area before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Ghost number plates and the legal requirements",
      paragraphs: [
        "UK number plates must meet requirements covering character shape, size, spacing, colour and markings. We're completing a specific check to confirm exactly how our Ghost finish meets each of those requirements, and we'll update this page once that's done. If it matters for your purchase now, contact us and we can give you the latest position.",
        "“Ghost” describes a styling choice, not a change to the underlying rules — the characters still need to read clearly against the reflective background. It's a separate matter from plates or coatings designed to defeat automatic number plate recognition cameras: we don't make or sell anything designed for that purpose, and we don't promote Ghost on that basis.",
      ],
    },
    care: {
      heading: "Care and warranty support",
      text: `Wash with car shampoo and a soft cloth. ${warranty(12)}`,
    },
    faqs: [
      { id: "what", q: "What is a Ghost number plate?", a: "A styled character finish, available on our standard plate sizes. See the description above for what our version involves." },
      { id: "per-plate", q: `Is ${single("ghost")} per plate or per pair?`, a: `Per plate. A pair is ${pair("ghost")}.` },
      { id: "legal", q: "Are Ghost plates road legal?", a: "We're finalising a specific check of how this exact finish meets the current number plate requirements — see the section above, and contact us if you'd like the latest position before ordering.", links: [{ label: "Contact us", href: "/contact" }] },
      { id: "anpr", q: "Do Ghost plates help avoid speed or ANPR cameras?", a: "No — we don't make or sell anything designed to defeat number plate recognition cameras. The characters still need to read clearly against the reflective background." },
      { id: "one", q: "Can I replace just one Ghost plate?", a: "Yes. Order a single front or rear plate and we'll match it to our own finish." },
      { id: "match", q: "Can you match a Ghost plate from another supplier?", a: "We'll match it to our own version of the finish; other suppliers' Ghost products may be built differently, so an identical match isn't guaranteed." },
      { id: "sizes", q: "What sizes are available?", a: "See the sizes above; the builder will show what fits your registration." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is Tracked 24 available for Ghost orders?", a: "Yes. Upgrade to Royal Mail Tracked 24 for an additional £2 on any style." },
      { id: "fault", q: "What if my plate has a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  short: {
    id: "short",
    style: "standard",
    format: SPECIALITY.short.format,
    sampleReg: "A1 BCD",
    path: SPECIALITY.short.path,
    metaTitle: `Short Number Plates from ${fSingle("short")} | Cut-to-Size Plates`,
    metaDescription:
      `Short number plates for shorter registrations, with legal character size and spacing, made to order in any style. Single plates from ${fSingle("short")}, pairs from ${fPair("short")}.`,
    short: "Short",
    h1: "Short Number Plates",
    lead: "Narrower plates for shorter registrations — legal character size and spacing, made to order in any style.",
    hero: {
      eyebrow: "Short plates",
      noun: "short",
      single: { title: "Single short front or rear plates", text: `Order one short plate — front or rear — from ${fSingle("short")}.`, label: "Single short front or rear plate" },
      pair: { title: `Matching pairs of short plates — ${fPair("short")} per pair`, text: `Order both short plates together from ${fPair("short")} for the pair.`, label: "Matching short front & rear plates" },
    },
    intro: {
      eyebrow: "Short plates",
      heading: "What are short number plates?",
      paragraphs: [
        "A short number plate is narrower than the standard 520mm, to suit a shorter registration such as a dateless private number. The characters stay at the legal size and spacing — the plate is shorter, not the characters.",
        "Our short sizes run from 470mm (up to seven characters, including the space) down to 226mm (up to three), all 111mm tall. The builder picks the size that fits your registration, in any of our styles.",
      ],
    },
    replacement: {
      heading: "Replacement short number plates",
      items: [
        {
          title: "Damaged or worn short plates",
          text: "If a short plate is cracked, faded or damaged, a new plate is the fix. Order a single front or rear plate, or a matching pair, at the size your registration needs.",
        },
        {
          title: "Matching the plate you're keeping",
          text: "Order a single front or rear plate in the same short size and style as the one you're keeping. An exact match to another supplier's plate isn't guaranteed, as materials and finish vary between makers.",
        },
      ],
    },
    compare: {
      heading: "Short vs standard size — which fits?",
      columns: ["Short", "Standard"],
      highlight: 0,
      rows: [
        { label: "Size", values: ["226–470mm × 111mm", "520mm × 111mm"] },
        { label: "From", values: [fSingle("short"), single("standard")] },
      ],
    },
    sizes: {
      heading: "Short plate sizes and options",
      paragraphs: [
        "Short sizes: 470mm (up to 7 characters), 409mm (6), 348mm (5), 287mm (4) and 226mm (3), all 111mm tall — character counts include the space.",
        "Short plates may also be available on selected motorcycle formats — the builder will show what's currently offered for your registration.",
        "Measuring for a replacement: measure your existing plate and the mounting area on the car — a size that matches on paper still needs to fit the actual recess and fixings.",
      ],
    },
    legal: {
      heading: "Are short number plates legal?",
      paragraphs: [
        "Yes, when made correctly: solid black characters at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings. A short plate fits a shorter registration by being narrower — never by squeezing the characters.",
        MOT_SCOPE,
      ],
    },
    care: {
      heading: "Caring for your short plates",
      text: `Wash with car shampoo and a soft cloth. ${WARRANTY_ALL} ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "sizes", q: "What sizes do short plates come in?", a: "470mm, 409mm, 348mm, 287mm and 226mm wide, all 111mm tall. The builder picks the size that fits your registration." },
      { id: "price", q: "How much more is a short plate?", a: `A short plate is £${ADD_ON_PRICES.shortPlateSingle} more than the same style at standard size, and a short pair is £${ADD_ON_PRICES.shortPlateBoth} more. In Standard that's ${fSingle("short")} for one plate and ${fPair("short")} for a pair.` },
      { id: "styles", q: "Can I have a short plate in 3D, 4D or another style?", a: ANY_STYLE },
      { id: "legal", q: "Are short plates legal?", a: "Yes, when the characters keep the legal size and spacing — see the legal section above." },
      { id: "mixed", q: "Can I have a short front and a standard rear?", a: "Yes. The builder lets you choose each plate's size separately." },
      { id: "fit", q: "Will a short plate fit my car?", a: "Measure your plate's mounting area first; a short plate suits a shorter registration and a recess with room around it." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade available?", a: "Yes. The same delivery options and charges apply across every plate we make." },
      { id: "fault", q: "What if my plate has a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  oversized: {
    id: "oversized",
    style: "standard",
    format: SPECIALITY.oversized.format,
    path: SPECIALITY.oversized.path,
    metaTitle: "Oversized Number Plates | ReplacementPlates",
    metaDescription:
      "Oversized rear number plates for vehicles with a larger plate recess, made to order. Royal Mail delivery or Ilford collection.",
    short: "Oversized",
    h1: "Oversized Number Plates",
    lead: "Oversized rear number plates for vehicles whose rear plate recess is larger than a standard plate. Each is made to order.",
    hero: {
      eyebrow: "Oversized plates",
      noun: "oversized",
      single: { title: "Single oversized rear plates", text: `Order one 533 × 152mm rear plate from ${fSingle("oversized")}.`, label: "Oversized rear plate" },
      pair: { title: `Standard front + oversized rear — ${fPair("oversized")} per pair`, text: "A standard 520mm front with an oversized rear, ordered together.", label: "Standard front & oversized rear" },
    },
    intro: {
      eyebrow: "Oversized rear",
      heading: "Oversized plate, not oversized characters",
      paragraphs: [
        "An oversized plate has a larger blank. The characters are not made larger: their size, stroke and spacing follow the rules that apply to your vehicle and plate. The extra plate area is simply plate.",
        "A common standard car-plate size is 520mm × 111mm; the builder shows the oversized rear sizes offered for your registration — currently 533mm × 152mm.",
      ],
    },
    replacement: {
      heading: "Replacing an oversized rear plate",
      items: [
        {
          title: "Cracked, faded or delaminated",
          text: "Order a replacement in the same size. If it's one of ours and you think it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Rear only — and your front plate",
          text: "You can order a single rear plate. If you're not sure what fits at the front, contact us before ordering.",
        },
        {
          title: "Lost or stolen",
          text: "If your plate was stolen, tell the police first, then order a replacement.",
        },
      ],
    },
    compare: {
      heading: "Oversized vs standard rear — which fits?",
      columns: ["Oversized", "Standard"],
      highlight: 0,
      rows: [
        { label: "Size", values: ["533mm × 152mm", "520mm × 111mm"] },
        { label: "From", values: [fSingle("oversized"), single("standard")] },
      ],
    },
    sizes: {
      heading: "Oversized plate sizes and options",
      paragraphs: [
        "Oversized rear: 533mm × 152mm. The front plate is made at the standard 520mm × 111mm, or a short size if your registration suits one.",
        "Oversized plates are a car and van size; for motorcycles the builder shows the formats offered for your registration.",
        "Measuring for a replacement: measure your existing plate and the mounting area on the car — a size that matches on paper still needs to fit the actual recess and fixings.",
      ],
    },
    legal: {
      heading: "Are oversized number plates legal?",
      paragraphs: [
        "Yes, when made correctly: solid black characters at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings. A larger plate doesn't change the character rules — the characters aren't enlarged to fill it.",
        MOT_SCOPE,
      ],
    },
    care: {
      heading: "Caring for your oversized plates",
      text: "New orders carry a manufacturing-defect warranty that follows the finish you choose: 6 months for Standard, 3D Gel and 4D, and 12 months for 5D, Ghost and Bevel, from the delivery or collection date, in addition to your statutory rights. A warranty covers manufacturing defects; it is not a statement that a product is approved for road use.",
    },
    faqs: [
      { id: "characters", q: "Does oversized mean bigger characters?", a: "No. Characters keep the size the regulations require; the extra size is the plate." },
      { id: "fit", q: "Will an oversized plate fit my vehicle?", a: "Measure your rear plate recess and compare with the builder. If you're not sure, contact us before ordering.", links: [{ label: "Contact us", href: "/contact" }] },
      { id: "styles", q: "Can I get an oversized plate in 3D or 4D?", a: "The builder shows which finishes are available for this size and their prices for your registration." },
      { id: "collect", q: "How do I collect my plate?", a: DELIVERY.collectionReady },
      { id: "front", q: "Can I have an oversized front plate?", a: "The oversized size is for the rear. If you're not sure what fits at the front, contact us before ordering." },
      { id: "price", q: "How much more is an oversized plate?", a: `An oversized rear is £${ADD_ON_PRICES.oversizedRear} more than the same style at standard size. In Standard that's ${fSingle("oversized")} for the rear, or ${fPair("oversized")} with a standard front.` },
    ],
  },

  show: {
    id: "show",
    style: "standard",
    format: SPECIALITY.show.format,
    path: SPECIALITY.show.path,
    metaTitle: `Show Plates from ${fSingle("show")} | Custom Display Number Plates`,
    metaDescription:
      `Show plates with custom spacing, for car shows, events and display — not for road use. Made to order in any style, from ${fSingle("show")} per plate or ${fPair("show")} a pair.`,
    short: "Show",
    h1: "Show Number Plates",
    lead: "Custom-spaced plates for shows, events and display — made to order, not for use on the road.",
    hero: {
      eyebrow: "Show plates · display only",
      noun: "show",
      single: { title: "Single show plates", text: `Order one show plate from ${fSingle("show")}.`, label: "Single show plate" },
      pair: { title: `Matching pairs of show plates — ${fPair("show")} per pair`, text: `Order a front and rear show plate together from ${fPair("show")}.`, label: "Matching front & rear show plates" },
    },
    intro: {
      eyebrow: "Display only",
      heading: "What are show plates?",
      paragraphs: [
        "Show plates are made for display — at car shows and events, in a garage or showroom, or as a gift. Because they're not for the road, the characters can be spaced the way you like rather than in the legal layout.",
        "Show plates must not be displayed on a vehicle used on public roads. For a plate you can drive with, choose a road-legal plate in the builder.",
      ],
    },
    replacement: {
      heading: "Replacement show plates",
      items: [
        {
          title: "Replacing a damaged show plate",
          text: "If a show plate is cracked, faded or damaged, order a new one in the style and spacing you want — single plates or a matching pair.",
        },
        {
          title: "Matching a show plate you have",
          text: "We'll make your plate in our own finish and preview your spacing before you order. An exact match to another supplier's plate isn't guaranteed, as materials and finish vary between makers.",
        },
      ],
    },
    compare: {
      heading: "Show plate vs road-legal plate — display or drive?",
      columns: ["Show", "Road legal"],
      highlight: 0,
      rows: [
        { label: "Use", values: ["Display only, off the road", "On the road"] },
        { label: "Spacing", values: ["Custom spacing", "Legal layout and spacing"] },
        { label: "From", values: [fSingle("show"), single("standard")] },
      ],
    },
    sizes: {
      heading: "Show plate sizes and options",
      paragraphs: [
        COMMON_SIZE,
        "Show plates may also be available in selected motorcycle formats — the builder will show what's currently offered.",
        "Measuring for display: check the space where the plate will sit, whether that's a stand, a wall or a vehicle at a show.",
      ],
    },
    legal: {
      heading: "Are show plates legal?",
      paragraphs: [
        "Not on the road. Show plates are for display only. On a vehicle used on public roads, number plates must have solid black characters at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings — and displaying a plate that doesn't can lead to a fine and an MOT failure.",
      ],
    },
    care: {
      heading: "Caring for your show plates",
      text: `Wash with car shampoo and a soft cloth. ${WARRANTY_ALL} ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "road", q: "Can I drive with show plates on my car?", a: "No. Show plates are for display only — at shows, events, in a garage or as a gift. On the road you need a road-legal plate." },
      { id: "what", q: "What can a show plate say?", a: "Up to seven letters and numbers, spaced the way you like. The builder previews your plate before you order." },
      { id: "price", q: `Is ${fSingle("show")} per plate or per pair?`, a: `Per plate in Standard. A pair is ${fPair("show")}; other styles are priced as on the road-legal plates.` },
      { id: "styles", q: "Can I have a show plate in 3D, 4D or another style?", a: ANY_STYLE },
      { id: "legal-option", q: "How do I order a road-legal plate instead?", a: "Choose “Legal Plate” in the builder's first step; your plate is then made in the legal layout and spacing.", links: [{ label: "Plate styles", href: "/plate-styles" }] },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade available?", a: "Yes. The same delivery options and charges apply across every plate we make." },
      { id: "fault", q: "What if my plate has a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  ev: {
    id: "ev",
    style: "standard",
    format: SPECIALITY.ev.format,
    path: SPECIALITY.ev.path,
    metaTitle: `EV Green Flash Number Plates from ${fSingle("ev")} | Electric Vehicle Plates`,
    metaDescription:
      `Green flash number plates for zero-emission vehicles, made to order in any style. Single plates from ${fSingle("ev")}, pairs from ${fPair("ev")}. Royal Mail delivery or Ilford collection.`,
    short: "EV",
    h1: "EV Green Flash Number Plates",
    lead: "The green flash for zero-emission vehicles — single plates or matching pairs, made to order in any style.",
    hero: {
      eyebrow: "EV plates",
      noun: "EV",
      single: { title: "Single front or rear EV plates", text: `Order one plate with the green flash from ${fSingle("ev")}.`, label: "Single EV front or rear plate" },
      pair: { title: `Matching pairs of EV plates — ${fPair("ev")} per pair`, text: `Order both plates with the green flash from ${fPair("ev")} for the pair.`, label: "Matching EV front & rear plates" },
    },
    intro: {
      eyebrow: "Green flash",
      heading: "What are green flash EV number plates?",
      paragraphs: [
        "EV number plates carry a green flash — a green band at the left-hand side of the plate — showing the vehicle produces zero emissions at the tailpipe. Zero-emission vehicles in the UK have been able to display it since 8 December 2020.",
        "Only zero-emission vehicles are eligible; hybrids and plug-in hybrids aren't. The flash is optional, and the rest of the plate follows the usual rules for characters, spacing, background and markings.",
      ],
    },
    replacement: {
      heading: "Replacement EV number plates",
      items: [
        {
          title: "Damaged, faded or lost EV plates",
          text: "If an EV plate is cracked, faded or lost, order a new one with the green flash — a single front or rear plate, or a matching pair.",
        },
        {
          title: "Matching your existing EV plate",
          text: "We'll make your replacement in the same size with our green flash, in the style you choose. An exact match to another supplier's plate isn't guaranteed, as materials and finish vary between makers.",
        },
      ],
    },
    compare: {
      heading: "EV vs standard plates — green flash or none?",
      columns: ["EV", "Standard"],
      highlight: 0,
      rows: [
        { label: "Flash", values: ["Green band at the left", "None"] },
        { label: "For", values: ["Zero-emission vehicles only", "Any vehicle"] },
        { label: "From", values: [fSingle("ev"), single("standard")] },
      ],
    },
    sizes: {
      heading: "EV plate sizes and options",
      paragraphs: [
        COMMON_SIZE,
        "The green flash may also be available on selected motorcycle formats — the builder will show what's currently offered for your registration.",
        "Measuring for a replacement: measure your existing plate and the mounting area on the car — a size that matches on paper still needs to fit the actual recess and fixings.",
      ],
    },
    legal: {
      heading: "Are green flash EV plates legal?",
      paragraphs: [
        "Yes, on a zero-emission vehicle, when the plate is made correctly: solid black characters at the legal size and spacing, on the correct reflective background, with the required supplier and British Standard markings, and the green flash at the left. Only zero-emission vehicles may display the flash.",
        MOT_SCOPE,
      ],
    },
    care: {
      heading: "Caring for your EV plates",
      text: `Wash with car shampoo and a soft cloth. ${WARRANTY_ALL} ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "who", q: "Which vehicles can have a green flash?", a: "Only zero-emission vehicles. Hybrids and plug-in hybrids aren't eligible." },
      { id: "required", q: "Do I have to have the green flash on my EV?", a: "No. It's optional for zero-emission vehicles." },
      { id: "price", q: "How much is the green flash?", a: `It adds £${ADD_ON_PRICES.badgeSingle} to a single plate and £${ADD_ON_PRICES.badgeBoth} to a pair in most styles. In Standard that's ${fSingle("ev")} for one plate and ${fPair("ev")} for a pair.` },
      { id: "styles", q: "Can I have an EV plate in 3D, 4D or another style?", a: ANY_STYLE },
      { id: "legal", q: "Are green flash plates legal?", a: "Yes, on a zero-emission vehicle and when made to the current rules — see the legal section above." },
      { id: "flag", q: "Can I have a flag and the green flash?", a: "The builder offers one badge per plate: a UK, England or Scotland flag, or the green flash." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade available?", a: "Yes. The same delivery options and charges apply across every plate we make." },
      { id: "fault", q: "What if my plate has a fault?", a: "Contact us and we'll assess it." },
    ],
  },

  bevel: {
    id: "bevel",
    path: "/bevel-number-plates",
    metaTitle: `Bevel Number Plates from ${single("bevel")} | Diamond-Cut`,
    metaDescription:
      `Bevel number plates with angled, diamond-cut character edges, made to order. Single plates from ${single("bevel")}, pairs from ${pair("bevel")}. Royal Mail delivery or Ilford collection.`,
    short: "Bevel",
    h1: "Bevel Number Plates",
    lead: "Acrylic characters with an angled, diamond-cut edge — single plates or matching pairs.",
    buy: {
      title: `Buy Bevel Number Plates from ${single("bevel")} per plate`,
      single: { title: "Single front or rear bevel plates", text: `${single("bevel")} per plate.` },
      pair: { title: `Single bevel plates and pairs — ${pair("bevel")} per pair`, text: `${single("bevel")} per plate, or ${pair("bevel")} for a front-and-rear pair.` },
    },
    intro: {
      eyebrow: "Diamond-cut",
      heading: "Diamond-cut number plates — the bevelled edge explained",
      paragraphs: [
        "Bevel — also called bevelled or diamond-cut — characters are acrylic, cut with an angled edge rather than a flat or domed one. The angled edge catches light differently depending on the viewing angle, giving a faceted look.",
        "It's one of our premium styles — only 5D is priced higher.",
      ],
    },
    replacement: {
      heading: "Replacement bevel number plates",
      items: [
        {
          title: "Damaged character edges or backing",
          text: "If a character's edge has chipped or the backing plate is damaged, a new plate is the fix. If it's ours and you believe it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Matching the edge profile on a single replacement",
          text: "Order a single front or rear plate and we'll match it to our own bevel profile. An exact match to another maker's bevelled plate isn't guaranteed, as edge angle and depth vary between suppliers.",
        },
      ],
    },
    compare: {
      heading: "Bevel vs 4D and 5D — edge shape or gel finish?",
      columns: ["4D", "5D", "Bevel"],
      highlight: 2,
      rows: [
        { label: "Construction", values: ["Laser-cut acrylic, flat-topped", "Acrylic with a gel top", "Acrylic with an angled, diamond-cut edge"] },
        { label: "Look", values: ["Sharp, defined", "Deep, glossy", "Faceted, catches the light"] },
        { label: "From", values: [single("4d"), single("5d"), single("bevel")] },
      ],
      note: { text: "Bevel describes the angled edge of the characters. It is not a plate shape." },
    },
    sizes: {
      heading: "Bevel plate sizes and profile options",
      paragraphs: [
        COMMON_SIZE,
        "Measure your existing plate and the mounting area before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Are bevelled number plates legal?",
      paragraphs: [
        LEGAL_CORE,
        "This is separate from the DVSA MOT check, which looks at condition, legibility, security and fitting.",
      ],
    },
    care: {
      heading: "Bevel plate care and warranty support",
      text: `Wash with car shampoo and a soft cloth; avoid catching the angled edge with anything abrasive. ${warranty(12)}`,
    },
    faqs: [
      { id: "diamond", q: "Is bevel the same as diamond-cut?", a: "Yes — different names for the same angled-edge finish." },
      { id: "per-plate", q: `Is ${single("bevel")} the price per plate or per pair?`, a: `Per plate. A pair is ${pair("bevel")}.` },
      { id: "vs", q: "How is bevel different from 4D or 5D?", a: "4D has a flat-topped acrylic edge; 5D adds a gel top; bevel is cut with an angled, faceted edge instead.", links: [{ label: "4D plates", href: "/4d-number-plates" }, { label: "5D plates", href: "/5d-number-plates" }] },
      { id: "badge", q: "Can I add a UK, EV or other badge to a Bevel plate?", a: "If your vehicle is eligible, choose the badge option in the builder alongside your Bevel plates." },
      { id: "match", q: "Can you match another supplier's bevel plate?", a: "We'll match it to our own profile; an identical match to a different manufacturer isn't guaranteed." },
      { id: "formats", q: "Do you offer bevel in short or hex formats?", a: "The builder shows the sizes and options offered for your registration. Bevel describes the character edge, not the plate's shape." },
      { id: "legal", q: "Are bevelled plates legal?", a: "Yes, when made to the current rules — see above." },
      { id: "delivery", q: "Is the price inclusive of delivery?", a: "The plate price is separate from delivery. First Class is £3 on orders under £15 and free from £15, and Tracked 24 is an additional £2; see the delivery section above." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade available on Bevel orders?", a: "Yes. The same delivery options and charges apply across every style." },
    ],
  },
};
