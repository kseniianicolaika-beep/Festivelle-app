"use client";
import type { CardProps } from "../../types";
import { Chapel, DoveOlive, CrossRule, CD_CSS } from "./art";
import { CD_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="chapel-doves" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(38,58,82,.45)] ${className}`}
      vars={CD_VARS} css={CD_CSS} rootClass="evcd-root" still={!animate}
      look={{ display: F.corm, script: F.vibes, body: F.cormG, foil: `evcd-foil ${animate ? "evcd-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", italic: true }}
      art={(s) => <Chapel style={{ width: s === "tall" ? "62cqw" : s === "square" ? "30cqw" : s === "wide" ? "90%" : "44cqw" }} />}
      small={<DoveOlive className="w-full" />}
      deco={(s) => (
        <>
          <div className="pointer-events-none absolute inset-[3cqw] border border-[#c9a36a]/60" style={s === "wide" || s === "square" ? undefined : { borderRadius: "40cqw 40cqw 1cqw 1cqw" }} />
          {s !== "wide" && <CrossRule className="pointer-events-none absolute bottom-[0.8cqw] left-1/2 w-[30cqw] -translate-x-1/2" />}
        </>
      )}
    />
  );
}
