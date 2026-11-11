"use client";
import type { CardProps } from "../../types";
import { Bouquet, Coupe, Sprig, PB_CSS } from "./art";
import { PB_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="petal-brunch" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(158,47,76,.55)] ${className}`}
      vars={PB_VARS} css={PB_CSS} rootClass="evpb-root" still={!animate}
      look={{ display: F.bodoni, script: F.vibes, body: F.cormG, foil: `evpb-foil ${animate ? "evpb-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", italic: true }}
      art={(s) => <Bouquet style={{ width: s === "tall" ? "64cqw" : s === "square" ? "30cqw" : s === "wide" ? "100%" : "46cqw" }} />}
      small={<Coupe className="w-full" />}
      deco={(s) => s === "wide" ? null : (
        <>
          <div className="pointer-events-none absolute inset-[3cqw] rounded-[3cqw] border border-[#e3c3bd]" />
          <Sprig className="pointer-events-none absolute left-1/2 top-[1.2cqw] w-[24cqw] -translate-x-1/2" />
        </>
      )}
    />
  );
}
