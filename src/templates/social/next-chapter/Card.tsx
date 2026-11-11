"use client";
import type { CardProps } from "../../types";
import { OpenBook, Pressed, Flourish, NC_CSS } from "./art";
import { NC_VARS, ncWord, ncBook } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile, ncWord(profile));
  const shape = shapeOf(kind);
  const book = ncBook(profile);
  const art = (w: string) => {
    if (kind === "menu" || kind === "program" || shape === "square") return <Flourish style={{ width: shape === "square" ? "34cqw" : "40cqw" }} />;
    return <OpenBook still title={book.title} note={book.note} style={{ width: shape === "portrait" ? "62cqw" : shape === "tall" ? "70cqw" : w }} />;
  };
  const rule = <Flourish className="mb-[0.6cqw] w-[24cqw]" />;

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("next-chapter", theme, design, NC_VARS)} className={`${FONT_VARS} nc-card nc-paper ${animate ? "" : "nc-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-45px_rgba(60,20,20,.45)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="soc-nc" precedence="default">{NC_CSS}</style>
      <Grain opacity={0.08} freq={0.75} />
      {shape !== "wide" && <><Pressed className="pointer-events-none absolute left-[4cqw] top-[3cqw] w-[9cqw] -rotate-12" /><Pressed hue="#d9b7d9" className="pointer-events-none absolute bottom-[3cqw] right-[4cqw] w-[8cqw] rotate-[160deg]" /></>}
      <div className="pointer-events-none absolute inset-[3cqw] border border-[#5e1a26]/20" />
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} />
    </CardFrame>
  );
}
