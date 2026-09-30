import type { Faq } from "./faqs";
import { DELIVERY, PRICES, gbp, type StyleId } from "./site";

export type ProductContent = {
  id: Extract<StyleId, "3d" | "4d" | "5d" | "bevel">;
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
const COLLECT_FAQ: Faq = {
  id: "collect",
  q: "Can I collect the same day?",
  a: DELIVERY.collectionReady,
};

export const PRODUCTS: Record<ProductContent["id"], ProductContent> = {
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
      heading: "Replacement 3D plates for damaged, lost or worn plates",
      items: [
        {
          title: "Lifted, cracked or cloudy gel",
          text: "If the resin on a plate has lifted, cracked or clouded, contact us and we'll assess it — if it's a plate we made and it's a manufacturing fault, we'll advise on next steps. Otherwise a new plate is usually the practical fix.",
        },
        {
          title: "A lost front or rear plate",
          text: "Order just the one you've lost, in the size of the plate you're keeping.",
        },
        {
          title: "Matching your existing 3D plate",
          text: "We can make your replacement in the same size and 3D gel finish from our range. We can't guarantee it will look identical to a plate made by a different supplier, since gel depth and finish vary between manufacturers.",
        },
        {
          title: "Correcting spacing or upgrading from print",
          text: "We can only make your registration in the correct legal layout, so a replacement may look different from a non-compliant original. You can switch from printed to 3D gel, or to another finish, without telling the DVLA, as long as the registration itself isn't changing.",
        },
      ],
    },
    compare: {
      heading: "3D vs 4D — gel or acrylic?",
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
        linkLabel: "See our 5D plates (4D gel)",
      },
    },
    sizes: {
      heading: "3D plate sizes and options",
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
      heading: "Caring for your 3D plates",
      text: `Wash with car shampoo and a soft cloth; avoid scraping ice or dirt off the raised characters with anything hard. New orders carry a 6-month manufacturing-defect warranty from the delivery or collection date, in addition to your statutory rights. ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "per-plate", q: `Is the ${single("3d")} price per plate or for a pair?`, a: `Per plate. A pair (front and rear) is ${pair("3d")}.` },
      { id: "legal", q: "Are 3D gel number plates legal in the UK?", a: "Yes, when made correctly — see the legal section above." },
      { id: "one", q: "Can I replace just one 3D plate?", a: "Yes. Order a single front or rear plate in the size of the one you're keeping." },
      { id: "match", q: "Can you match a 3D plate made by another supplier?", a: "We'll match the size and use our 3D gel finish, but an exact visual match to a different manufacturer's plate isn't guaranteed — gel depth and finish vary between suppliers." },
      { id: "raised", q: "Are raised characters legal, or only printed ones?", a: "Raised characters are permitted, provided the plate meets the size, spacing, colour and marking rules." },
      { id: "moto", q: "Can I get 3D gel on a short or motorcycle plate?", a: "Enter your registration in the builder to see the sizes offered; for motorcycle, choose “motorcycle” to see current 3D options for your registration." },
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
    intro: {
      eyebrow: "Laser-cut acrylic",
      heading: "What makes a plate 4D?",
      paragraphs: [
        "4D number plates have characters cut from solid black acrylic and bonded onto a reflective acrylic plate, rather than printed or gel-domed on top of it. The result is a sharp, flat-topped character with a defined edge.",
      ],
    },
    replacement: {
      heading: "Replacement 4D number plates",
      items: [
        {
          title: "Cracked acrylic or missing characters",
          text: "If a character has come loose, cracked, or the backing plate is damaged, the fix is a full replacement plate — we don't sell individual replacement characters as a repair, since a plate with mismatched or re-applied characters may not meet the display requirements.",
        },
        {
          title: "Replacing one plate",
          text: "Order a single front or rear plate. We'll match our own acrylic depth and finish; an exact match to another manufacturer's 4D plate isn't guaranteed, as acrylic thickness varies between suppliers.",
        },
        {
          title: "A compliant layout",
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
        text: "Some suppliers call an acrylic-plus-gel finish “4D gel” — on ReplacementPlates that's our 5D product.",
        href: "/5d-number-plates",
        linkLabel: "See 5D plates",
      },
    },
    sizes: {
      heading: "4D sizes and options",
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
      heading: "Fitting, cleaning and warranty",
      text: `Wash with car shampoo and a soft cloth. New orders carry a 6-month manufacturing-defect warranty from the delivery or collection date, in addition to your statutory rights. ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "per-plate", q: `Is ${single("4d")} per plate or per pair?`, a: `Per plate. A pair is ${pair("4d")}.` },
      { id: "thickness", q: "What thickness are your 4D characters?", a: "We're confirming the exact specification against our current catalogue and will update this page once it's verified." },
      { id: "gel", q: "What's the difference between 4D acrylic and 4D gel?", a: "Acrylic-only 4D has sharp, flat-topped characters. A gel-topped version — sometimes called 4D gel — is our 5D product.", links: [{ label: "5D plates", href: "/5d-number-plates" }] },
      { id: "legal", q: "Are 4D plates legal? Will they pass an MOT?", a: "They're legal when made to the current rules. Passing an MOT depends on the plate being correctly fitted, clean and undamaged, not just correctly made." },
      { id: "match", q: "Can you match a 4D plate from another maker?", a: "We'll match size and use our own acrylic finish; an identical visual match to a different supplier's plate isn't guaranteed." },
      { id: "formats", q: "Do you sell 4D in short formats?", a: "The builder shows the sizes and options offered for your registration." },
      COLLECT_FAQ,
      { id: "dispatch", q: "What's the difference between dispatch and delivery?", a: "Dispatch is when we send your order; delivery is when Royal Mail gets it to you, on their own next-working-day aim, not a guarantee." },
      { id: "ev", q: "Can I get an EV badge on a 4D plate?", a: "If your vehicle is eligible, choose the EV or UK+EV option in the builder." },
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
    intro: {
      eyebrow: "Our 5D finish explained",
      heading: "4D gel number plates — what is 5D?",
      paragraphs: [
        "Some suppliers call this construction “4D gel”; on ReplacementPlates we call it 5D. It starts the same way as our 4D plates — laser-cut solid acrylic characters — with a gel layer added on top.",
        "The result combines the sharp edge of laser-cut acrylic with the glossy finish of a gel top. Naming for this construction varies across the market; this section describes our own product.",
      ],
    },
    replacement: {
      heading: "Replacement 5D and 4D gel plates",
      items: [
        {
          title: "Damaged acrylic or lifting gel",
          text: "If the acrylic has cracked or the gel layer has lifted, the fix is a new plate. If it's one of ours and you think it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Matching a single plate",
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
      heading: "5D sizes and finish options",
      paragraphs: [
        COMMON_SIZE,
        "Measure your existing plate and the mounting area before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Are 5D and 4D gel plates legal?",
      paragraphs: [
        `${LEGAL_CORE} This is separate from the DVSA MOT check, which looks at condition, legibility, security and fitting.`,
      ],
    },
    care: {
      heading: "Caring for layered plates",
      text: `Wash with car shampoo and a soft cloth. New orders carry a 12-month manufacturing-defect warranty from the delivery or collection date, in addition to your statutory rights. ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "name", q: "Why do you call it 5D when some sites say 4D gel?", a: "It's our name for an acrylic-plus-gel construction; other suppliers use different terms for similar or different builds. Our specification is described above." },
      { id: "vs3d", q: "How is 5D different from 3D gel?", a: "3D gel domes resin over printed characters. 5D starts with laser-cut acrylic (like 4D) and adds a gel top layer." },
      { id: "per-plate", q: `Is ${single("5d")} per plate or per pair?`, a: `Per plate. A pair is ${pair("5d")}.` },
      { id: "match", q: "Can you match another maker's 4D gel plate?", a: "We'll match size and use our own 5D construction; an identical visual match to a plate made by a different supplier isn't guaranteed, as construction varies between manufacturers." },
      { id: "sizes", q: "What sizes are available?", a: "The builder will show what fits your registration once you enter it." },
      { id: "legal", q: "Are 5D plates legal?", a: "Yes, when made to the current rules — see the legal section above." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is Tracked 24 worth the upgrade?", a: "It adds tracking and Royal Mail's own next-working-day aim, on top of the standard First Class service." },
      { id: "fault", q: "What if my plate develops a fault?", a: "Contact us and we'll assess it." },
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
    intro: {
      eyebrow: "Diamond-cut",
      heading: "The bevelled edge explained",
      paragraphs: [
        "Bevel — also called bevelled or diamond-cut — characters are acrylic, cut with an angled edge rather than a flat or domed one. The angled edge catches light differently depending on the viewing angle, giving a faceted look.",
        "It's one of our premium styles — only 5D is priced higher.",
      ],
    },
    replacement: {
      heading: "Replacement bevel number plates",
      items: [
        {
          title: "Chipped edges or damaged backing",
          text: "If a character's edge has chipped or the backing plate is damaged, a new plate is the fix. If it's ours and you believe it's a manufacturing fault, contact us and we'll assess it.",
        },
        {
          title: "Matching the edge profile",
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
      heading: "Bevel sizes and profile options",
      paragraphs: [
        COMMON_SIZE,
        "Measure your existing plate and the mounting area before ordering a replacement size.",
      ],
    },
    legal: {
      heading: "Are bevelled number plates legal?",
      paragraphs: [
        `${LEGAL_CORE} This is separate from the DVSA MOT check, which looks at condition, legibility, security and fitting.`,
      ],
    },
    care: {
      heading: "Bevel plate care",
      text: `Wash with car shampoo and a soft cloth; avoid catching the angled edge with anything abrasive. New orders carry a 12-month manufacturing-defect warranty from the delivery or collection date, in addition to your statutory rights. ${WARRANTY_TAIL}`,
    },
    faqs: [
      { id: "diamond", q: "Is bevel the same as diamond-cut?", a: "Yes — different names for the same angled-edge finish." },
      { id: "per-plate", q: `Is ${single("bevel")} the price per plate or per pair?`, a: `Per plate. A pair is ${pair("bevel")}.` },
      { id: "vs", q: "How is bevel different from 4D or 5D?", a: "4D has a flat-topped acrylic edge; 5D adds a gel top; bevel is cut with an angled, faceted edge instead." },
      { id: "badge", q: "Can I add a UK, EV or other badge to a Bevel plate?", a: "If your vehicle is eligible, choose the badge option in the builder alongside your Bevel plates." },
      { id: "match", q: "Can you match another supplier's bevel plate?", a: "We'll match it to our own profile; an identical match to a different manufacturer isn't guaranteed." },
      { id: "formats", q: "Do you offer bevel in short formats?", a: "The builder shows the sizes and options offered for your registration. Bevel describes the character edge, not the plate's shape." },
      { id: "legal", q: "Are bevelled plates legal?", a: "Yes, when made to the current rules — see the legal section above." },
      { id: "delivery", q: "Is the price inclusive of delivery?", a: "The plate price is separate from delivery. First Class is £3 on orders under £15 and free from £15, and Tracked 24 is an additional £2." },
      COLLECT_FAQ,
      { id: "tracked", q: "Is the Tracked 24 upgrade available on Bevel orders?", a: "Yes. The same delivery options and charges apply across every style." },
    ],
  },
};
