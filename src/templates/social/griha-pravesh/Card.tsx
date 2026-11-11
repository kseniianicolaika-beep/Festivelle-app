"use client";
import type { CardProps } from "../../types";
import { Doorway, Toran, Kalash, Rangoli, GP_CSS } from "./art";
import { GP_VARS, gpWord } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile, gpWord(profile));
  const shape = shapeOf(kind);
  const art = (w: string) => {
    if (kind === "hashtag" || shape === "wide") return <Rangoli style={{ width: w }} />;
    if (shape === "square" || kind === "menu" || kind === "program") return <Kalash style={{ width: shape === "square" ? "18cqw" : w }} />;
    return (
      <div className="flex items-end justify-center gap-[1cqw]" style={{ width: shape === "tall" ? "72cqw" : "58cqw" }}>
        <Kalash className="mb-[1cqw] w-[20%]" />
        <Doorway open steps={false} className="w-[54%]" />
        <Kalash className="mb-[1cqw] w-[20%] -scale-x-100" />
      </div>
    );
  };
  const rule = <svg viewBox="0 0 120 12" className="mb-[0.8cqw] w-[22cqw]" aria-hidden><path d="M0 6h46M74 6h46" stroke="#e2621d" strokeWidth=".8" /><circle cx="60" cy="6" r="4.4" fill="#f6b21b" /><circle cx="52" cy="6" r="2.2" fill="#b8261e" /><circle cx="68" cy="6" r="2.2" fill="#b8261e" /></svg>;
  const toran = shape !== "wide" && kind !== "table";

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("griha-pravesh", theme, design, GP_VARS)} className={`${FONT_VARS} gp-card gp-paper ${animate ? "" : "gp-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-45px_rgba(120,50,10,.5)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="soc-gp" precedence="default">{GP_CSS}</style>
      <Grain opacity={0.07} freq={0.8} />
      <div className="gp-border absolute inset-x-0 top-0 h-[1.2cqw]" />
      <div className="gp-border absolute inset-x-0 bottom-0 h-[1.2cqw]" />
      {toran && <Toran w={600} drops={9} className="pointer-events-none absolute inset-x-0 top-[1.2cqw] w-full" />}
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} pad={toran ? (shape === "tall" ? "px-[12cqw] pt-[22cqw] pb-[12cqw]" : shape === "square" ? "px-[10cqw] pt-[16cqw] pb-[6cqw]" : "px-[12cqw] pt-[18cqw] pb-[8cqw]") : undefined} />
    </CardFrame>
  );
}
