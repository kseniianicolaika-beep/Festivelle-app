"use client";
import type { CardProps } from "../../types";
import { Mortarboard, Laurel, Diploma, CP_CSS } from "./art";
import { CP_VARS, cpWord, classOf } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile, cpWord(profile));
  const shape = shapeOf(kind);
  const cls = classOf(profile);
  const art = (w: string) => {
    if (kind === "menu" || kind === "program") return <Diploma style={{ width: shape === "tall" ? "44cqw" : "34cqw" }} />;
    if (shape === "square") return <Mortarboard style={{ width: "26cqw" }} />;
    if (kind === "hashtag" || shape === "wide") return <Mortarboard style={{ width: w }} />;
    return (
      <div className="relative flex flex-col items-center" style={{ width: shape === "tall" ? "62cqw" : "46cqw" }}>
        <Laurel className="w-full" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-[8%]">
          <Mortarboard className="w-[46%]" />
          {cls && <p className="mt-[1cqw] uppercase text-[#a7802f]" style={{ fontFamily: F.tenor, fontSize: "2cqw", letterSpacing: "0.35em" }}>{cls}</p>}
        </div>
      </div>
    );
  };
  const rule = <svg viewBox="0 0 120 12" className="mb-[0.8cqw] w-[22cqw]" aria-hidden><path d="M0 6h48M72 6h48" stroke="#c9a24e" strokeWidth=".8" /><path d="M60 1l5 5-5 5-5-5z" fill="#6e1630" /></svg>;

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("cap-and-laurel", theme, design, CP_VARS)} className={`${FONT_VARS} cp-card cp-paper ${animate ? "" : "cp-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-45px_rgba(60,10,20,.45)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="soc-cp" precedence="default">{CP_CSS}</style>
      <Grain opacity={0.06} freq={0.8} />
      <div className="pointer-events-none absolute inset-[3cqw] border-2 border-[#6e1630]/70" />
      <div className="pointer-events-none absolute inset-[4.4cqw] border border-[#c9a24e]/70" />
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} />
    </CardFrame>
  );
}
