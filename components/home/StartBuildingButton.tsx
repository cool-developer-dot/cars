"use client";

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { builderUrl } from "@/lib/builderLink";
import { useHomeBuilderOptional } from "./HomeBuilder";

type Props = {
  className?: string;
  children?: ReactNode;
  /** Put the cursor in the registration field on arrival */
  focusReg?: boolean;
};

/** Brings the customer to the one plate builder (homepage, section 2) */
export default function StartBuildingButton({ className, children, focusReg = false }: Props) {
  const homeBuilder = useHomeBuilderOptional();

  return (
    <a
      href={builderUrl()}
      className={className}
      onClick={(e) => {
        if (!homeBuilder) return; // another page: follow the link home
        e.preventDefault();
        homeBuilder.goToBuilder(undefined, { focusReg });
      }}
    >
      {children ?? (
        <>
          Start building
          <ArrowRight strokeWidth={2.4} aria-hidden="true" />
        </>
      )}
    </a>
  );
}
