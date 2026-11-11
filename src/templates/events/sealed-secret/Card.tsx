"use client";
import type { CardProps } from "../../types";
import { Envelope, Seal, RibbonRule, SS_CSS } from "./art";
import { SS_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="sealed-secret" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(62,45,74,.45)] ${className}`}
      vars={SS_VARS} css={SS_CSS} rootClass="evss-root" still={!animate}
      look={{ display: F.prata, script: F.vibes, body: F.cormG, foil: `evss-foil ${animate ? "evss-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", nameScale: 0.9 }}
      art={(s) => <Envelope style={{ width: s === "tall" ? "72cqw" : s === "square" ? "36cqw" : s === "wide" ? "100%" : "56cqw" }} />}
      small={<Seal className={`w-full ${animate ? "evss-pulse" : ""}`} />}
      deco={(s) => (
        <>
          <div className="pointer-events-none absolute inset-[3cqw] border border-[#e3d3c2]" />
          {s !== "wide" && <RibbonRule className="pointer-events-none absolute left-1/2 top-[1cqw] w-[30cqw] -translate-x-1/2" />}
        </>
      )}
    />
  );
}
