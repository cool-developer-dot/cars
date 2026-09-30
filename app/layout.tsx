import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import OpeningIntro from "@/components/intro/OpeningIntro";
import MotionProvider from "@/components/MotionProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Replacement Number Plates | ReplacementPlates",
    template: "%s | ReplacementPlates",
  },
  description:
    "Replacement number plates made to order by a DVLA-registered supplier (RNPS 75449). Royal Mail delivery or Ilford collection.",
  openGraph: { siteName: "ReplacementPlates", locale: "en_GB", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <head>
        {/* Hero background: lighter file for phones/tablets, full-size for desktop */}
        <link
          rel="preload"
          href="/hero-bg-mobile.webp"
          as="image"
          type="image/webp"
          media="(max-width: 899px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/hero-bg.webp"
          as="image"
          type="image/webp"
          media="(min-width: 900px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/logo-rp.webp"
          as="image"
          type="image/webp"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;var seen=false;try{seen=sessionStorage.getItem("rp-intro-seen")==="1"}catch(e){}if(!reduced&&!seen){var el=document.createElement("div");el.id="rp-intro-pending-cover";el.setAttribute("aria-hidden","true");el.style.cssText="position:fixed;inset:0;z-index:9999;pointer-events:none;background:radial-gradient(circle at 50% 46%,rgba(20,90,170,0.16),transparent 42%),linear-gradient(180deg,#0A1A2D 0%,#071421 55%,#05101C 100%)";document.documentElement.appendChild(el);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <OpeningIntro>
            <Navbar />
            {children}
            <Footer />
          </OpeningIntro>
        </MotionProvider>
      </body>
    </html>
  );
}
