"use client";

import { ArrowRight } from "lucide-react";
import { useHomeBuilderOptional } from "./HomeBuilder";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/** Opens the single homepage builder instead of navigating to /build. */
export default function StartBuildingButton({ className, children }: Props) {
  const homeBuilder = useHomeBuilderOptional();

  const onClick = () => {
    if (homeBuilder) {
      homeBuilder.openBuilder();
      return;
    }
    window.location.href = "/#build-your-plate";
  };

  return (
    <button type="button" className={className} onClick={onClick}>
      {children ?? (
        <>
          Start building
          <ArrowRight strokeWidth={2.4} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
