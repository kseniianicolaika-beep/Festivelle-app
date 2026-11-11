"use client";
import type { CardProps } from "../../types";
import { Nalichnik, Karavai, Stitch, BirchTwig, NV_CSS } from "./art";
import { NV_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const art = (w: string) => {
    if (kind === "hashtag" || shape === "wide" || kind === "menu" || kind === "program") return <Karavai style={{ width: shape === "wide" || kind === "hashtag" ? w : shape === "tall" ? "40cqw" : "30cqw" }} />;
    if (shape === "square") return <BirchTwig style={{ width: "34cqw" }} />;
    return <Nalichnik style={{ width: shape === "tall" ? "50cqw" : "34cqw" }} />;
  };
  const rule = <BirchTwig className="mb-[0.6cqw] w-[22cqw]" />;

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("novoselye", theme, design, NV_VARS)} className={`${FONT_VARS} nv-card nv-paper ${animate ? "" : "nv-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-45px_rgba(30,40,80,.45)] ${className}`} style={{ fontFamily: F.kurale }}>
      <style href="soc-nv" precedence="default">{NV_CSS}</style>
      <Grain opacity={0.06} freq={0.8} />
      <Stitch w={600} className="absolute inset-x-0 top-[2cqw] h-[3.6cqw] w-full" />
      <Stitch w={600} className="absolute inset-x-0 bottom-[2cqw] h-[3.6cqw] w-full" />
      <div className="pointer-events-none absolute inset-x-[3cqw] inset-y-[7cqw] border-x-2 border-[#3a5a9c]/40" />
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} />
    </CardFrame>
  );
}
