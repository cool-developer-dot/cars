import Link from "next/link";
import { BarChart3, Lock, Megaphone, ShoppingCart } from "lucide-react";
import HelpSection from "@/components/infoPage/HelpSection";
import InfoHero from "@/components/infoPage/InfoHero";
import LegalDoc, { type Clause } from "@/components/infoPage/LegalDoc";
import Section from "@/components/infoPage/Section";
import { Table } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";

export const metadata = infoMetadata({
  title: "Cookie Policy | ReplacementPlates",
  description:
    "How ReplacementPlates uses cookies and similar technologies, and how to accept, reject or change your choices.",
  path: "/cookies",
});

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const CLAUSES: Clause[] = [
  {
    id: "what-cookies-are",
    num: "1",
    title: "What Cookies Are",
    body: (
      <p>
        Cookies are small files placed on your device when you visit a website. Similar technologies do the same job.
        We use them to make the site work and, if you agree, to understand how it is used.
      </p>
    ),
  },
  {
    id: "types",
    num: "2",
    title: "The Types We Use",
    body: (
      <>
        <Table
          tone="light"
          head={["Type", "What it does", "Do we ask first?"]}
          rows={[
            [
              "Strictly necessary",
              "Makes the site and your basket work, keeps it secure and remembers your cookie choice",
              "No. The law exempts these",
            ],
            ["Analytics", "Helps us understand which pages are used, so we can improve the site", "Yes"],
            ["Marketing", "Measures or personalises advertising", "Yes"],
          ]}
        />
        <p>
          Some cookies don&rsquo;t need your consent, such as those strictly necessary to provide something you ask for.
          The law also has a small number of narrow exceptions, for example for some basic statistical analytics where
          strict conditions are met and you can easily object. Advertising cookies always need consent. We&rsquo;ve
          chosen to ask for your consent before setting any analytics or marketing cookies. See the{" "}
          <a
            href="https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/"
            {...ext}
          >
            ICO&rsquo;s guidance on the exceptions
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    num: "3",
    title: "Your Choices",
    body: (
      <>
        <ul>
          <li>When you first visit, you can accept or reject non-essential cookies, or choose which categories to allow.</li>
          <li>You can change or withdraw your choice at any time using the cookie settings link at the bottom of every page.</li>
          <li>You can also block or delete cookies in your browser settings; some parts of the site may then not work properly.</li>
        </ul>
        <p>Rejecting non-essential cookies won&rsquo;t stop you using the site or placing an order.</p>
        <p>
          Where a cookie involves personal information, see our <Link href="/privacy">privacy policy</Link>. For general
          guidance, see the{" "}
          <a href="https://ico.org.uk/for-the-public/online/cookies/" {...ext}>
            Information Commissioner&rsquo;s Office
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <>
      <InfoJsonLd name="Cookie Policy" path="/cookies" />

      <InfoHero
        crumb="Cookie policy"
        eyebrow="Cookies"
        title={["Cookie", "Policy"]}
        lead={
          <p>
            How ReplacementPlates uses cookies and similar technologies, and how to accept, reject or change your
            choices.
          </p>
        }
        updated="28 September 2026"
        facts={[
          { Icon: Lock, title: "Strictly necessary", text: "Exempt from consent" },
          { Icon: BarChart3, title: "Analytics", text: "Only if you agree" },
          { Icon: Megaphone, title: "Marketing", text: "Only if you agree" },
          { Icon: ShoppingCart, title: "Reject and still order", text: "Nothing stops you buying" },
        ]}
      />

      <Section id="policy" tone="light" next="dark">
        <LegalDoc clauses={CLAUSES} label="Cookie policy" />
      </Section>

      <HelpSection
        related={[
          { label: "Privacy policy", href: "/privacy" },
          { label: "Terms and conditions", href: "/terms" },
        ]}
      />
    </>
  );
}
