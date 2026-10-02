"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Clock, MapPin, Truck } from "lucide-react";
import Reveal from "@/components/content/Reveal";
import NeonEdge from "@/components/NeonEdge/NeonEdge";
import { plateFont } from "@/lib/fonts";
import { builderUrl } from "@/lib/builderLink";
import { useHomeBuilderOptional } from "./HomeBuilder";
import h from "./home.module.css";
import s from "./GetStarted.module.css";

const POINTS = [
  { Icon: Truck, title: "Royal Mail delivery", text: "UK-wide" },
  { Icon: Clock, title: "Same-day dispatch aim", text: "(order before 2pm)" },
  { Icon: MapPin, title: "Collection available", text: "in Ilford (IG1 3QF)" },
];

export default function GetStarted() {
  const homeBuilder = useHomeBuilderOptional();
  const [reg, setReg] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = reg.trim().toUpperCase();
    if (homeBuilder) {
      homeBuilder.goToBuilder(clean ? { reg: clean } : undefined, { focusReg: !clean });
      return;
    }
    window.location.assign(builderUrl({ reg: clean }));
  };

  return (
    <section className={`${h.section} ${h.light} ${s.section}`} aria-labelledby="start-title">
      <div className={h.container}>
        <Reveal className={`${h.head} ${h.headCenter}`}>
          <p className={h.eyebrow}>Get started</p>
          <h2 id="start-title" className={h.title}>
            Order your number plates <span className={h.accent}>today.</span>
          </h2>
          <p className={h.lead}>Enter your registration and build your plates in minutes.</p>
        </Reveal>

        <Reveal index={1}>
          <form className={s.form} onSubmit={onSubmit}>
            <label className={s.field}>
              <span className="sr-only">Your registration</span>
              <span className={s.band} aria-hidden="true">
                <svg viewBox="0 0 60 40">
                  <rect width="60" height="40" fill="#012169" />
                  <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
                  <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
                  <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="12" />
                  <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="6" />
                </svg>
                UK
              </span>
              <input
                className={`${s.input} ${plateFont.className}`}
                placeholder="AB12 CDE"
                maxLength={8}
                autoComplete="off"
                spellCheck={false}
                value={reg}
                onChange={(e) => setReg(e.target.value.toUpperCase())}
              />
            </label>
            <button type="submit" className={`${h.btn} ${s.submit}`}>
              Build my plates
              <ArrowRight size={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </form>
        </Reveal>

        <Reveal index={2}>
          <ul className={s.points}>
            {POINTS.map(({ Icon, title, text }) => (
              <li key={title} className={s.point}>
                <Icon className={s.pointIcon} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* Into the footer */}
      <NeonEdge fill="#040c16" light />
    </section>
  );
}
