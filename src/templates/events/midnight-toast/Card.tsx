"use client";
import type { CardProps } from "../../types";
import { Clock, Flutes, Moon, DecoRule, MT_CSS } from "./art";
import { MT_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="midnight-toast" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-40px_rgba(0,0,0,.75)] ${className}`}
      vars={MT_VARS} css={MT_CSS} rootClass="evmt-root" still={!animate}
      look={{ display: F.poiret, script: F.vibes, body: F.tenor, foil: `evmt-foil ${animate ? "evmt-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", upper: true, nameScale: 0.85 }}
      art={(s) => s === "wide" ? <Flutes className="w-full" /> : <Clock style={{ width: s === "tall" ? "56cqw" : s === "square" ? "28cqw" : "40cqw" }} />}
      small={<Flutes className="w-full" />}
      deco={(s) => (
        <>
          <div className="pointer-events-none absolute inset-[2.4cqw] border border-[#d8b46a]/60" />
          <div className="pointer-events-none absolute inset-[3.6cqw] border border-[#d8b46a]/25" />
          {s !== "wide" && <Moon className="pointer-events-none absolute right-[6cqw] top-[6cqw] w-[9cqw]" />}
          {s !== "wide" && <DecoRule className="pointer-events-none absolute bottom-[1cqw] left-1/2 w-[30cqw] -translate-x-1/2" />}
        </>
      )}
    />
  );
}
