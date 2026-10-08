import { Headphones, Keyboard, MessageSquareWarning } from "lucide-react";
import InfoHero from "@/components/infoPage/InfoHero";
import Section from "@/components/infoPage/Section";
import { Cards, Channels } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Accessibility | ReplacementPlates",
  description:
    "How to get help ordering number plates from ReplacementPlates if you find the website difficult to use, and what we are doing about accessibility.",
  path: "/accessibility",
  image: "/og/default.jpg",
});

export default function AccessibilityPage() {
  return (
    <>
      <InfoJsonLd name="Accessibility" path="/accessibility" />

      <InfoHero
        crumb="Accessibility"
        eyebrow="Accessibility"
        title={["Accessibility", "and Help Ordering"]}
        lead={
          <p>
            We want everyone to be able to order number plates from us. If you find any part of the website difficult to
            use, including the plate builder, checkout or providing your documents, contact us and we&rsquo;ll help you
            order another way.
          </p>
        }
      />

      <Section
        id="how-we-help"
        tone="light"
        next="dark"
        eyebrow="Accessibility"
        title={["How We", "Can Help"]}
      >
        <Cards
          tone="light"
          cols={3}
          items={[
            {
              Icon: Headphones,
              title: "Ordering With Help",
              text: "Contact us and tell us what you need. We can talk you through the builder, help you place your order and explain how to provide your documents.",
            },
            {
              Icon: Keyboard,
              title: "What We're Doing",
              text: (
                <>
                  <p>
                    We aim to build our pages so that they work with keyboards, screen readers and browser zoom, use
                    clear headings and plain language, and don&rsquo;t rely on colour alone.
                  </p>
                  <p>
                    The site has not yet had a formal accessibility audit, and some parts, such as the plate builder, may
                    be harder to use than others.
                  </p>
                </>
              ),
            },
            {
              Icon: MessageSquareWarning,
              title: "Tell Us About a Problem",
              text: (
                <>
                  <p>
                    If something doesn&rsquo;t work for you, tell us which page it&rsquo;s on and what happened.
                    We&rsquo;ll try to fix it and help you in the meantime.
                  </p>
                  <p>
                    If you&rsquo;re not happy with our response, you can contact the{" "}
                    <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">
                      Equality Advisory and Support Service
                    </a>
                    .
                  </p>
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section
        id="contact-us"
        tone="dark"
        next="footer"
        eyebrow="Contact us"
        title={["Get Help", "Ordering"]}
        lead="Email, telephone or WhatsApp: whichever is easiest for you."
      >
        <div className={s.flow}>
          <Channels tone="dark" />
        </div>
      </Section>
    </>
  );
}
