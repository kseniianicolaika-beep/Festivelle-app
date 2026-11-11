"use client";
import type { CardProps } from "../../types";
import { Table, Sprig, Taper, LT_CSS } from "./art";
import { LT_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { CardBody } from "../_shared/kit";
import { cardText, shapeOf } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const art = (w: string) => {
    if (shape === "wide") return <div className="flex items-end justify-center gap-[2cqw]" style={{ width: w }}><Taper className="w-[22%]" /><Taper className="w-[26%]" /><Taper className="w-[22%]" /></div>;
    if (kind === "story") return <Table vertical seats={5} style={{ width: "44cqw" }} />;
    if (shape === "square" || kind === "menu" || kind === "program") return <Sprig style={{ width: w }} />;
    return <Table seats={4} style={{ width: shape === "portrait" ? "76cqw" : w }} />;
  };
  const rule = <Sprig className="mb-[1cqw] w-[20cqw]" />;

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("long-table", theme, design, LT_VARS)} className={`${FONT_VARS} lt-card lt-linen ${animate ? "" : "lt-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-45px_rgba(80,40,10,.55)] ${className}`} style={{ fontFamily: F.cormG }}>
      <style href="soc-lt" precedence="default">{LT_CSS}</style>
      <Grain opacity={0.08} freq={0.9} />
      <div className="pointer-events-none absolute inset-[3.2cqw] border border-[#b5562f]/35" />
      <div className="pointer-events-none absolute inset-[4.2cqw] border border-[#b5562f]/15" />
      <CardBody kind={kind} c={c} design={design} art={art} rule={rule} />
    </CardFrame>
  );
}
