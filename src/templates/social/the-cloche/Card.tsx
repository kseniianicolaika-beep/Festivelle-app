"use client";
import type { CardProps } from "../../types";
import { Cloche, Cutlery, Fan, CL_CSS } from "./art";
import { CL_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const fan = shape === "wide" ? "w-[9cqw]" : "w-[15cqw]";
  const art = (w: string) => (kind === "menu" || kind === "program" ? <Cutlery style={{ width: shape === "tall" ? "16cqw" : "12cqw" }} /> : <Cloche style={{ width: w }} className="drop-shadow-[0_2cqw_3cqw_rgba(0,0,0,.5)]" />);
  const rule = <div className="mb-[0.8cqw] flex items-center gap-[2cqw] text-[#d7b46e]"><span className="h-px w-[10cqw] bg-current" /><span className="h-[1.4cqw] w-[1.4cqw] rotate-45 border border-current" /><span className="h-px w-[10cqw] bg-current" /></div>;

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("the-cloche", theme, design, CL_VARS)} className={`${FONT_VARS} cl-card cl-noir ${animate ? "" : "cl-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(20,0,5,.85)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="soc-cl" precedence="default">{CL_CSS}</style>
      <Grain opacity={0.14} blend="overlay" freq={1.1} />
      <div className="pointer-events-none absolute inset-[3cqw] border border-[#d7b46e]/45" />
      {["left-[3cqw] top-[3cqw]", "right-[3cqw] top-[3cqw] -scale-x-100", "bottom-[3cqw] left-[3cqw] -scale-y-100", "bottom-[3cqw] right-[3cqw] -scale-100"].map((pos) => (
        <span key={pos} className={`pointer-events-none absolute text-[#d7b46e]/80 ${pos} ${fan}`}><Fan className="w-full" /></span>
      ))}
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} />
    </CardFrame>
  );
}
