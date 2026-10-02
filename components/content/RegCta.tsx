"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { plateFont } from "@/lib/fonts";
import c from "./content.module.css";
import { builderUrl } from "@/lib/builderLink";

/** Registration entry → builder (optionally with a style preselected) */
export default function RegCta({ style }: { style?: string }) {
  const router = useRouter();
  const [reg, setReg] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(builderUrl({ reg, style }));
  };

  return (
    <form className={c.regForm} onSubmit={onSubmit}>
      <label htmlFor={`reg-${style ?? "any"}`} className="sr-only">
        Your registration
      </label>
      <input
        id={`reg-${style ?? "any"}`}
        className={`${c.regInput} ${plateFont.className}`}
        placeholder="ENTER REG"
        maxLength={8}
        autoComplete="off"
        spellCheck={false}
        value={reg}
        onChange={(e) => setReg(e.target.value.toUpperCase())}
      />
      <button type="submit" className={c.btn}>
        Build my plates
        <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </form>
  );
}
