"use client";

import type { ReactNode } from "react";
import type { BuildState } from "@/components/BuildYourPlate/buildConfig";
import { builderUrl } from "@/lib/builderLink";
import { useHomeBuilderOptional } from "./HomeBuilder";

/**
 * A link that pre-fills the homepage builder and brings it into view. On
 * the homepage it acts in place; anywhere else it navigates to the builder
 * with the same settings in the URL.
 */
export default function BuilderLink({
  seed,
  options = false,
  className,
  children,
  ...rest
}: {
  seed?: Partial<BuildState>;
  /** Open the builder's extra options on arrival (sizes, hex…) */
  options?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const homeBuilder = useHomeBuilderOptional();
  const href = builderUrl({ style: seed?.styleId, reg: seed?.reg, amount: seed?.amount });

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!homeBuilder) return;
        e.preventDefault();
        homeBuilder.goToBuilder(seed, { options });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
