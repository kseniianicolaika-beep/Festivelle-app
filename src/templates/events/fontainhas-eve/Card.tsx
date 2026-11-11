"use client";
import type { CardProps } from "../../types";
import { Table, Olive, Taper, LT_CSS } from "./art";
import { LT_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="fontainhas-eve" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(58,38,32,.55)] ${className}`}
      vars={LT_VARS} css={LT_CSS} rootClass="evfe-root" still={!animate}
      look={{ display: F.corm, script: F.vibes, body: F.cormG, foil: `evfe-foil ${animate ? "evfe-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]", italic: true }}
      art={(s) => <Table style={{ width: s === "tall" ? "78cqw" : s === "square" ? "46cqw" : s === "wide" ? "100%" : "70cqw" }} />}
      small={<div className="flex justify-center gap-[2cqw]"><Taper className="w-1/3" /><Taper className="w-1/3" /></div>}
      deco={(s) => (
        <>
          <div className="pointer-events-none absolute inset-[3cqw] rounded-t-[40cqw] border border-[#c0643a]/50" style={s === "wide" || s === "square" ? { borderRadius: "1cqw" } : undefined} />
          {s !== "wide" && <Olive className="pointer-events-none absolute bottom-[1.4cqw] left-1/2 w-[26cqw] -translate-x-1/2" />}
        </>
      )}
    />
  );
}
