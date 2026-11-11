"use client";
import type { CardProps } from "../../types";
import { Church, Rushnyk, Cross, KK_CSS } from "./art";
import { KK_VARS } from "./Site";
import { F } from "../../celebrate/_shared/fonts";
import { EventCard } from "../_shared/kit";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  return (
    <EventCard
      id="kupol-krestiny" kind={kind} profile={profile} theme={theme} design={design} className={`shadow-[0_50px_100px_-50px_rgba(44,59,85,.45)] ${className}`}
      vars={KK_VARS} css={KK_CSS} rootClass="evkk-root" still={!animate} top="14cqw"
      look={{ display: F.ruslan, script: F.vibes, body: F.kurale, foil: `evkk-foil ${animate ? "evkk-shine" : ""}`, accent: "text-[var(--t-accent)]", muted: "text-[var(--t-muted)]", rule: "text-[var(--t-gold)]" }}
      art={(s) => <Church style={{ width: s === "tall" ? "62cqw" : s === "square" ? "30cqw" : s === "wide" ? "90%" : "46cqw" }} />}
      small={<Cross className="mx-auto w-1/2" />}
      deco={() => (
        <>
          <Rushnyk className="pointer-events-none absolute inset-x-0 top-[2cqw] h-[5cqw] w-full" />
          <Rushnyk className="pointer-events-none absolute inset-x-0 bottom-[2cqw] h-[5cqw] w-full" />
        </>
      )}
    />
  );
}
