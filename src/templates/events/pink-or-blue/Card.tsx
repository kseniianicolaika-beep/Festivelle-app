"use client";
import type { CardProps } from "../../types";
import { Bouquet, Cloud, Pair, PK_CSS } from "./art";
import { PK_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="pink-or-blue" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(75,53,80,.45)] ${className}`}
      vars={PK_VARS} css={PK_CSS} rootClass="evpk-root" still={!animate}
      look={{ display: F.fraun, script: F.caveat, body: F.montserrat, foil: `evpk-foil ${animate ? "evpk-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", italic: true }}
      art={(s) => <Bouquet className={animate ? "evpk-float" : ""} style={{ width: s === "tall" ? "62cqw" : s === "square" ? "30cqw" : s === "wide" ? "90%" : "44cqw" }} />}
      small={<Pair className="w-full" />}
      deco={(s) => s === "wide" ? null : (
        <>
          <Cloud className="pointer-events-none absolute left-[-6cqw] top-[38%] w-[34cqw]" />
          <Cloud className="pointer-events-none absolute right-[-8cqw] top-[58%] w-[38cqw]" />
          <div className="pointer-events-none absolute inset-[3cqw] rounded-[4cqw] border-[0.6cqw] border-white/80" />
        </>
      )}
    />
  );
}
