export type FooterLink = { label: string; href: string };

export const FOOTER_COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Plate Styles", href: "/plate-styles" },
      { label: "Delivery & Collection", href: "/delivery-collection" },
      { label: "FAQs", href: "/faqs" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Our Plates",
    links: [
      { label: "Standard Plates", href: "/plate-styles#standard" },
      { label: "3D Gel Plates", href: "/3d-number-plates" },
      { label: "4D Plates", href: "/4d-number-plates" },
      { label: "5D (4D Gel) Plates", href: "/5d-number-plates" },
      { label: "Ghost Plates", href: "/ghost-number-plates" },
      { label: "Bevel Plates", href: "/bevel-number-plates" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Documents You Need", href: "/#documents" },
      { label: "Delivery Information", href: "/delivery-collection" },
      { label: "Ilford Collection", href: "/delivery-collection#collection" },
      { label: "Returns & Cancellations", href: "/returns" },
      { label: "Warranty", href: "/faqs#warranty" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export const LEGAL_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

// Replace with real profile URLs
export const SOCIALS = [
  { label: "Facebook", icon: "facebook", href: "https://facebook.com" },
  { label: "Instagram", icon: "instagram", href: "https://instagram.com" },
  { label: "TikTok", icon: "tiktok", href: "https://tiktok.com" },
  { label: "YouTube", icon: "youtube", href: "https://youtube.com" },
] as const;
