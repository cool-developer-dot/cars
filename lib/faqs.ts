import { CONTACT, DELIVERY, DELIVERY_EXAMPLE, FROM_PRICE, gbp } from "./site";

export type FaqLink = { label: string; href: string };
export type Faq = { id: string; q: string; a: string; links?: FaqLink[] };
export type FaqGroup = { id: string; title: string; items: Faq[] };

const CONTACT_LINE = `Contact us at ${CONTACT.email}, on ${CONTACT.phone} or by WhatsApp on ${CONTACT.whatsapp}`;

/** Homepage FAQs */
export const HOME_FAQS: Faq[] = [
  {
    id: "how-quickly",
    q: "How quickly can I get replacement number plates?",
    a: `For delivery: order before 2pm on a working weekday and, once your documents are checked, we aim to dispatch by Royal Mail the same day. For collection: ${DELIVERY.collectionReady}`,
  },
  {
    id: "where-collect",
    q: "Where do I collect from?",
    a: `Our Ilford collection point, IG1 3QF. ${DELIVERY.collectionReady}`,
  },
  {
    id: "other-towns",
    q: "Do you have shops in other towns?",
    a: "No — one collection point, in Ilford. Everywhere else, we deliver by Royal Mail.",
    links: [{ label: "Areas we cover", href: "/areas-we-cover" }],
  },
  {
    id: "documents",
    q: "Do I need documents?",
    a: "Yes. UK law requires proof of your name and address, and proof you're entitled to use the registration.",
    links: [{ label: "Documents you need", href: "/documents-you-need" }],
  },
  {
    id: "one-plate",
    q: "Can I replace just one plate?",
    a: "Yes. Order a single front or rear plate and tell us the size and style of the one you're keeping.",
  },
  {
    id: "stolen",
    q: "My plates were stolen. What should I do?",
    a: "Report it to the police and keep the reference number, then order replacements. If you later get fines for journeys you didn't make, your registration may have been cloned — tell the police and whoever issued the fine.",
  },
  {
    id: "change-style",
    q: "Can I change style when I replace my plates?",
    a: "Yes — go from Standard to 3D, 4D, 5D, Ghost or Bevel. The registration, typeface, spacing and markings stay the same; only the finish changes.",
  },
  {
    id: "per-plate",
    q: "Are the prices per plate or per pair?",
    a: "“From” prices are per plate. A “pair” means two plates — front and rear — and has its own pair price, shown on each product page.",
    links: [{ label: "See all prices", href: "/plate-styles" }],
  },
  {
    id: "fault",
    q: "What if my plate has a manufacturing fault?",
    a: "Contact us and we'll assess it.",
    links: [{ label: "Warranty and faulty plates", href: "/warranty" }],
  },
];

/** Full /faqs page */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        id: "cost",
        q: "How much do number plates cost?",
        a: `From ${gbp(FROM_PRICE)} for one standard plate. A pair is a front and a rear plate.`,
        links: [{ label: "Price list", href: "/prices" }],
      },
      {
        id: "just-one",
        q: "Can I order just one plate?",
        a: "Yes. Order a single front or rear plate, or a pair.",
      },
      {
        id: "change-order",
        q: "Can I change my order after I've placed it?",
        a: "Contact us straight away. You can ask for an amendment within 2 hours of placing your order. It isn't guaranteed and we'll tell you of any cost first. This doesn't affect your right to cancel before production starts.",
        links: [{ label: "Terms and conditions", href: "/terms" }],
      },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    items: [
      {
        id: "what-docs",
        q: "What documents do I need?",
        a: "Proof of your name and address, and proof you can use the registration.",
        links: [{ label: "Documents you need", href: "/documents-you-need" }],
      },
      {
        id: "passport",
        q: "Can I use my passport?",
        a: "A passport confirms your name only, so you also need a document that shows your address, such as a driving licence or a recent utility or bank statement.",
      },
      {
        id: "why-check",
        q: "Why do you need to check my documents?",
        a: "The DVLA requires a registered supplier to check identity and entitlement before supplying road-use plates.",
        links: [{ label: "Legal number plates", href: "/legal-number-plates" }],
      },
    ],
  },
  {
    id: "delivery",
    title: "Delivery and collection",
    items: [
      {
        id: "delivery-cost",
        q: "How much is delivery?",
        a: `${DELIVERY.firstClass} ${DELIVERY.tracked} ${DELIVERY.aims} For example, ${DELIVERY_EXAMPLE.charAt(0).toLowerCase()}${DELIVERY_EXAMPLE.slice(1)}`,
        links: [{ label: "Delivery and dispatch", href: "/delivery" }],
      },
      {
        id: "dispatch",
        q: "When will my order be dispatched?",
        a: "If your order and document checks are complete before 2pm on a working weekday, we aim to dispatch it that day. Delivery times are Royal Mail's aims.",
      },
      {
        id: "where-deliver",
        q: "Where do you deliver?",
        a: DELIVERY.areas,
      },
      {
        id: "collect",
        q: "Can I collect my plates?",
        a: `Yes, from Castleview Gardens, Ilford, IG1 3QF. ${DELIVERY.collectionReady}`,
        links: [{ label: "Collection in Ilford", href: "/delivery#collection" }],
      },
      {
        id: "shop-near",
        q: "Do you have a shop near me?",
        a: "We have one collection location, in Ilford. We don't have shops or branches elsewhere.",
        links: [{ label: "Areas we cover", href: "/areas-we-cover" }],
      },
    ],
  },
  {
    id: "legal",
    title: "Legal",
    items: [
      {
        id: "road-legal",
        q: "Are your plates road legal?",
        a: "Each product page explains the finish and any legal information. Road-use plates are intended to meet the legal requirements, and where a style or format needs additional checks, its page says so. Ghost's compliance information is being finalised: see the Ghost page.",
        links: [
          { label: "Ghost plates", href: "/ghost-number-plates" },
          { label: "Legal number plates", href: "/legal-number-plates" },
        ],
      },
      {
        id: "mot",
        q: "Will my plates pass an MOT?",
        a: "Correctly made plates can still fail if they're damaged, dirty, obscured or insecurely fitted. The MOT checks a plate's condition, legibility and format. The supplier's name, postcode and British Standard mark are required by law even though the MOT doesn't check them.",
      },
    ],
  },
  {
    id: "warranty",
    title: "Cancellation, warranty and problems",
    items: [
      {
        id: "cancel",
        q: "Can I cancel my order?",
        a: `You can cancel for a full refund at any time before production starts. No cancellation or administration fee applies. Once production has started, personalised plates cannot normally be cancelled for a change of mind. Your statutory rights are unaffected. ${CONTACT_LINE} as soon as possible.`,
        links: [{ label: "Returns and cancellations", href: "/returns" }],
      },
      {
        id: "warranty",
        q: "Is there a warranty?",
        a: "New orders carry a manufacturing-defect warranty: 6 months for Standard, 3D Gel and 4D, and 12 months for 5D, Ghost and Bevel, starting on the delivery or collection date. It is in addition to your statutory rights. If you were sold a longer guarantee on an earlier order, that guarantee continues to apply. A warranty is not a statement that a product is approved for road use.",
        links: [{ label: "Warranty and faulty plates", href: "/warranty" }],
      },
      {
        id: "faulty",
        q: "What if my plate is faulty?",
        a: `${CONTACT_LINE} with your order number. Photos help if you can take them, but you don't need them to make a claim; if you can't, we'll arrange another way to assess the plate. There is no 24-hour reporting deadline that removes your statutory rights.`,
        links: [{ label: "Faulty plates and warranty", href: "/warranty" }],
      },
      {
        id: "stolen",
        q: "My plates were stolen. What should I do?",
        a: "Contact the police. If you receive a fine or charge you're not responsible for, your registration may have been cloned: tell the police, and contact the organisation that sent the notice to challenge it, following the process and deadline stated on the notice. Keep your evidence.",
      },
    ],
  },
];
