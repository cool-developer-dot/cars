import Link from "next/link";
import {
  Archive,
  BadgeCheck,
  CircleAlert,
  FileCheck2,
  Gavel,
  History,
  Landmark,
  Plane,
  ScrollText,
  SearchCheck,
  Stamp,
  Wrench,
} from "lucide-react";
import ClosingCta from "@/components/infoPage/ClosingCta";
import InfoHero from "@/components/infoPage/InfoHero";
import PlateDiagram from "@/components/infoPage/PlateDiagram";
import Section from "@/components/infoPage/Section";
import PlateArt from "@/components/home/PlateArt";
import { Cards, Checklist, Chips, Note, Panel, Rows, Table } from "@/components/infoPage/blocks";
import { InfoJsonLd, infoMetadata } from "@/components/infoPage/meta";
import { COMPANY, PRICES, SPECIALITY, SPECIALITY_ORDER, type StyleId } from "@/lib/site";
import h from "@/components/home/home.module.css";
import s from "@/components/infoPage/info.module.css";

export const metadata = infoMetadata({
  title: "Legal Number Plates and Registered Suppliers | ReplacementPlates",
  description:
    "What makes a UK number plate legal: reflective material, correct characters and spacing, supplier and British Standard markings, and why you must use a registered supplier.",
  path: "/legal-number-plates",
});

const STYLES: StyleId[] = ["standard", "3d", "4d", "5d", "ghost", "bevel"];

export default function LegalPlatesPage() {
  return (
    <>
      <InfoJsonLd name="Legal Number Plates and Registered Suppliers" path="/legal-number-plates" />

      <InfoHero
        crumb="Legal number plates"
        eyebrow="The rules"
        title={["Legal Number Plates", "and Registered Suppliers"]}
        lead={
          <p>
            What makes a UK number plate legal, how characters must be sized and spaced, and why plates can only come
            from a registered supplier. This page covers the essentials.
          </p>
        }
        art={{
          src: "/3d/legal-car.webp",
          width: 1492,
          height: 868,
          alt: "A white number plate fitted to the front of a car",
        }}
        facts={[
          { Icon: BadgeCheck, title: "BS AU 145e", text: "For plates fitted from 1 Sept 2021" },
          { Icon: Stamp, title: "Supplier marking", text: "Name and postcode on every plate" },
          { Icon: Archive, title: "Records kept", text: "For three years, by law" },
          { Icon: Gavel, title: "Up to £1,000", text: "Fine for misused characters" },
        ]}
      />

      <Section
        id="what-makes-a-plate-legal"
        tone="light"
        next="dark"
        eyebrow="The legal requirements"
        title={["What Makes", "a Plate Legal"]}
        lead="Under the Road Vehicles (Display of Registration Marks) Regulations 2001 and the British Standard, number plates must:"
      >
        <div className={s.legalGrid}>
          <Panel tone="light">
            <Checklist
              items={[
                "be made from a reflective material",
                <>
                  have black characters on a <strong>white</strong> background at the front and a{" "}
                  <strong>yellow</strong> background at the rear
                </>,
                "have no background pattern",
                "have characters that are not removable or reflective",
                "be marked to show who supplied them",
                <>
                  be marked with the British Standard number, <strong>BS AU 145e</strong> for plates fitted after 1
                  September 2021
                </>,
              ]}
            />
          </Panel>
          <div className={s.platePair} aria-hidden="true">
            <figure>
              <PlateArt reg="AB12 CDE" face="white" finish="gel" />
              <figcaption>Front: white</figcaption>
            </figure>
            <figure>
              <PlateArt reg="AB12 CDE" face="yellow" finish="gel" />
              <figcaption>Rear: yellow</figcaption>
            </figure>
          </div>
        </div>
        <Note tone="light" title="Raised characters, flags and the green flash" className={s.spaced}>
          <p>
            If your plates were fitted after 1 September 2021 the characters must also be a single shade of black.
            Characters <strong>may be raised (3D)</strong>, but the whole surface of each character, including the
            sides, must be a single shade of black. Some flags, symbols and identifiers are allowed. Eligible
            zero-emission vehicles <strong>may</strong> display a green flash; it is optional.
          </p>
        </Note>
      </Section>

      <Section
        id="size-and-spacing"
        tone="dark"
        next="light"
        eyebrow="Character size and spacing"
        title={["Measured to", "the Millimetre"]}
        lead="The figures depend on the vehicle and the plate. These are the ordinary rules from the DVLA's leaflet INF104."
      >
        <div className={s.flow}>
          <Panel tone="dark" className={s.diagramPanel}>
            <PlateDiagram />
          </Panel>

          <div className={s.split}>
            <Table
              tone="dark"
              caption="Cars and most other vehicles, plates fitted from 1 September 2001"
              head={["Measurement", "Requirement"]}
              align={["left", "right"]}
              rows={[
                ["Character height", "79mm"],
                ["Character width (except 1 and I)", "50mm"],
                ["Stroke", "14mm"],
                ["Horizontal space between characters", "11mm"],
                ["Horizontal space between the two groups on a one-line plate", "33mm"],
                ["Margins (top, bottom, sides)", "11mm"],
                ["Vertical space between the two lines of a two-line plate", "19mm"],
              ]}
            />
            <div className={s.flow}>
              <Table
                tone="dark"
                caption="Motorcycles and motor tricycles (two lines)"
                head={["Measurement", "Requirement"]}
                align={["left", "right"]}
                rows={[
                  ["Character height", "64mm"],
                  ["Character width (except 1 and I)", "44mm"],
                  ["Stroke", "10mm"],
                  ["Horizontal space between characters", "10mm"],
                  ["Vertical space between the two lines", "13mm"],
                  ["Margins (top, bottom, sides)", "at least 11mm"],
                ]}
              />
              <Note tone="dark" title="Single-line motorcycle-size characters">
                <p>
                  The DVLA also gives a 30mm horizontal gap between the two groups for motorcycle-size characters laid
                  out on a single line, which it allows for some tricycles and quadricycles. That is not the vertical gap
                  on a two-line motorcycle plate.
                </p>
              </Note>
            </div>
          </div>

          <div className={s.split}>
            <Panel tone="dark">
              <span className={h.iconBlue} aria-hidden="true">
                <Plane strokeWidth={1.9} />
              </span>
              <h3 className={`${s.subhead} ${s.panelHead}`}>Qualifying Imported Vehicles</h3>
              <p className={s.body}>
                Regulation 14A allows a smaller layout only for an imported vehicle that does not have European Community
                Whole Vehicle Type Approval and whose plate-fixing area is too small for a standard plate. It is not
                available just because a vehicle is imported or Japanese.
              </p>
              <p className={s.body}>
                The layout is 64mm characters, 44mm wide with a 10mm stroke, 10mm between characters, a 5mm vertical gap
                between lines, at least 5mm margins at the top and sides, and at least 13mm below the mark, within which at
                least 5mm must separate the mark from the top of the supplier&rsquo;s name and postcode. On two lines that
                is a minimum of 151mm of height. Whether a particular vehicle qualifies is a separate check. If you think
                yours might, <Link href="/contact">contact us</Link>.
              </p>
            </Panel>
            <Rows
              tone="dark"
              items={[
                {
                  Icon: History,
                  title: "Older Plates and Historic Vehicles",
                  text: (
                    <p>
                      Earlier rules applied to some plates fitted before 1 September 2001 and to some historic vehicles,
                      including different character sizes and colours. Which rules apply depends on the plate, the vehicle
                      and its registration, so please <Link href="/contact">contact us</Link> before ordering for an older
                      vehicle.
                    </p>
                  ),
                },
                {
                  Icon: ScrollText,
                  title: "The Prescribed Font",
                  text: (
                    <p>
                      Characters must use the prescribed font, or one substantially similar, and must not be italic,
                      sloping or formed with broken strokes.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        id="registered-supplier"
        tone="light"
        next="dark"
        eyebrow="Registered suppliers"
        title={["Why You Must Use", "a Registered Supplier"]}
        lead={
          <p>
            You can only get number plates made up from a <strong>registered number plate supplier</strong>. The
            supplier must:
          </p>
        }
      >
        <div className={s.flow}>
          <Cards
            tone="light"
            cols={3}
            items={[
              {
                Icon: FileCheck2,
                title: "See Your Documents",
                text: "The documents that prove your name and address and your right to use the registration.",
                href: "/documents-you-need",
                link: "Documents you need",
              },
              {
                Icon: Archive,
                title: "Keep Records for Three Years",
                text: "A record of the plates they sell, available to the police, DVLA, DVSA and Trading Standards.",
              },
              {
                Icon: Stamp,
                title: "Mark Every Plate",
                text: "With their name and postcode and the British Standard number.",
              },
            ]}
          />
          <Note tone="light" Icon={BadgeCheck} title="Registration and markings are different things">
            <p>
              Supplier registration (our RNPS number is {COMPANY.rnps}) identifies the business. It does not replace the{" "}
              <strong>supplier name and postcode</strong> and <strong>British Standard mark</strong> that must appear on
              each plate. It also doesn&rsquo;t mean the DVLA has approved a particular plate design or finish. We are a
              registered supplier: {COMPANY.legalName}.
            </p>
          </Note>
        </div>
      </Section>

      <Section
        id="mot"
        tone="dark"
        next="light"
        eyebrow="Legal display and the MOT"
        title={["Related, but", "Not the Same"]}
      >
        <div className={s.split}>
          <Panel tone="dark">
            <h3 className={s.subhead}>
              <SearchCheck className={s.inlineIcon} aria-hidden="true" /> What the MOT Checks
            </h3>
            <p className={s.body}>
              That a plate isn&rsquo;t missing or insecure, that it is legible, that it shows the correct registration
              and that it conforms to the requirements. It doesn&rsquo;t check the supplier&rsquo;s name, postcode or
              British Standard number, but the law still requires them, and passing an MOT is never something we can
              promise.
            </p>
          </Panel>
          <Panel tone="dark" index={1}>
            <h3 className={s.subhead}>
              <CircleAlert className={s.inlineIcon} aria-hidden="true" /> When Plates Fail
            </h3>
            <p className={s.body}>
              Plates can fail an MOT if they are obscured, excessively damaged, deteriorated or delaminated, or have a
              fixing, tint or film that changes how the characters look. Misusing or rearranging characters can lead to a
              fine of up to £1,000, an MOT failure and, in some cases, withdrawal of the registration.
            </p>
          </Panel>
        </div>
      </Section>

      <Section
        id="styles-and-sources"
        tone="light"
        next="dark"
        eyebrow="Our styles and official sources"
        title={["Read the Page", "for Your Style"]}
        lead="Each style and format has its own page. Please read the page for the one you choose; for Ghost, read its page before ordering."
      >
        <div className={s.flow}>
          <div className={s.chipRow}>
            <p className={s.kicker}>Styles</p>
            <Chips
              items={[
                ...STYLES.map((id) => ({ label: PRICES[id].name.replace("gel", "Gel"), href: PRICES[id].href })),
                ...SPECIALITY_ORDER.map((id) => ({ label: SPECIALITY[id].name, href: SPECIALITY[id].path })),
              ]}
            />
          </div>
          <Cards
            tone="light"
            cols={4}
            items={[
              {
                Icon: Landmark,
                title: "GOV.UK: Rules for Number Plates",
                text: "The government's summary of the display rules.",
                href: "https://www.gov.uk/displaying-number-plates/rules-number-plates",
                link: "Read on GOV.UK",
              },
              {
                Icon: ScrollText,
                title: "DVLA Leaflet INF104",
                text: "Vehicle registration numbers and number plates.",
                href: "https://www.gov.uk/government/publications/vehicle-registration-numbers-and-number-plates",
                link: "Read INF104",
              },
              {
                Icon: Wrench,
                title: "DVSA MOT Manual",
                text: "What an MOT tester checks on registration plates.",
                href: "https://www.gov.uk/guidance/mot-inspection-manual-for-private-passenger-and-light-commercial-vehicles/0-identification-of-the-vehicle",
                link: "Read the manual",
              },
              {
                Icon: Gavel,
                title: "The 2001 Regulations",
                text: "The Road Vehicles (Display of Registration Marks) Regulations 2001.",
                href: "https://www.legislation.gov.uk/uksi/2001/561",
                link: "Read on legislation.gov.uk",
              },
            ]}
          />
        </div>
      </Section>

      <ClosingCta secondary={{ href: "/documents-you-need", label: "Documents You Need" }} />
    </>
  );
}
