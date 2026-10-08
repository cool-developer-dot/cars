import { Building2, MessageCircle } from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY } from "@/lib/site";

/*
 * Withheld from launch (client decision D-17): no reviews have been supplied
 * or approved, so this page only says so. It is kept out of search, the
 * sitemap and the navigation until real reviews exist; never add sample or
 * imported ratings here.
 */
export const metadata = infoMetadata({
  title: "Reviews | ReplacementPlates",
  description:
    "Customer reviews of Private Number Plate Maker Ltd and of ReplacementPlates, shown separately with their sources.",
  path: "/reviews",
  index: false,
});

export default function ReviewsPage() {
  return (
    <>
      <InfoJsonLd name="Reviews" path="/reviews" />

      <InfoHero
        crumb="Reviews"
        eyebrow="Reviews"
        title={["Customer", "Reviews"]}
        lead={<p>We don&rsquo;t have any reviews of ReplacementPlates to show yet.</p>}
        art={{
          src: "/4d/hero.webp",
          srcMobile: "/4d/hero-mobile.webp",
          width: 2000,
          height: 1000,
          alt: "A white front and a yellow rear number plate on a dark surface",
        }}
      />

      <Section
        id="how-reviews-will-appear"
        tone="light"
        next="dark"
        eyebrow="When reviews are available"
        title={["Shown Separately,", "With Their Sources"]}
        lead={
          <p>
            ReplacementPlates is a trading name of {COMPANY.legalName}. When reviews are available, we will show reviews
            of the company separately from reviews of ReplacementPlates, each with the platform it was posted on.
          </p>
        }
      >
        <Cards
          tone="light"
          cols={2}
          items={[
            {
              Icon: Building2,
              title: "About Us",
              text: "Who we are, our DVLA supplier registration and our company details.",
              href: "/about",
              link: "About ReplacementPlates",
            },
            {
              Icon: MessageCircle,
              title: "Contact Us",
              text: "Questions about an order, documents or collection? Message, call or email us.",
              href: "/contact",
              link: "Contact us",
            },
          ]}
        />
      </Section>

      <ClosingCta />
    </>
  );
}
