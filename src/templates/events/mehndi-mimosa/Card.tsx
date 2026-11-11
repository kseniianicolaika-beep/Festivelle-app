"use client";
import type { CardProps } from "../../types";
import { Palm, Toran, Posy, MM_CSS } from "./art";
import { MM_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="mehndi-mimosa" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(107,21,48,.55)] ${className}`}
      vars={MM_VARS} css={MM_CSS} rootClass="evmm-root" still={!animate} top="22cqw"
      look={{ display: F.prata, script: F.vibes, body: F.cormG, foil: `evmm-foil ${animate ? "evmm-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]" }}
      art={(s) => <Palm style={{ width: s === "tall" ? "50cqw" : s === "square" ? "24cqw" : s === "wide" ? "70%" : "34cqw" }} />}
      small={<Posy className="w-full" />}
      deco={(s) => (
        <>
          <div className="pointer-events-none absolute inset-[2.6cqw] border-[0.5cqw] border-double border-[#d9a85a]" />
          {s !== "wide" && s !== "square" && <Toran className="pointer-events-none absolute inset-x-0 top-[-1cqw] w-full" />}
        </>
      )}
    />
  );
}
