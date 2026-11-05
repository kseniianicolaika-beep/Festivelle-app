"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, paletteVars, Photo, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { CD_CSS, CD_FACES, CD_PALETTE } from "./Site";
import { Bubbles, Chevron, CoupeTower, Fan } from "./art";

const CSS = `
.cdc .an-eyebrow,.cdc .an-where,.cdc .an-date,.cdc .an-item-d{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.26em}
.cdc .an-eyebrow{color:var(--a-accent)}
.cdc .an-where,.cdc .an-item-d{color:var(--a-muted);font-size:2.1cqw}
.cdc .an-date{font-size:2.8cqw}
.cdc .an-lead,.cdc .an-body{font-family:var(--a-body);color:var(--a-muted)}
.cdc .an-name{font-family:var(--a-display);text-transform:uppercase;letter-spacing:.06em;line-height:1.02}
.cdc .an-head,.cdc .an-num,.cdc .an-tag,.cdc .an-item-t{font-family:var(--a-display)}
.cdc .an-num,.cdc .an-head,.cdc .an-tag{background:linear-gradient(100deg,#8f6e2c 0%,#f7e2a8 20%,#b8913f 40%,#fff6d8 55%,#a07a35 75%,#f1d590 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:cd-foil 6s ease-in-out infinite}
.cdc .an-amp,.cdc .an-foot,.cdc .an-tagline,.cdc .an-both,.cdc .an-sub{font-family:var(--a-script);color:var(--a-champagne)}
.cdc .an-amp{color:var(--a-accent)}
.cdc .an-sub{font-size:5cqw;letter-spacing:0}
.cdc .an-item+.an-item{border-top:1px solid color-mix(in oklab,var(--a-accent) 28%,transparent)}
.cdc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const big = ["invite", "save", "post", "greeting", "welcome"].includes(kind) && A.age;
  const fanW = shape === "wide" ? "13cqw" : shape === "square" ? "16cqw" : "22cqw";
  const rule = <Chevron className="mb-[1.6cqw] w-[14cqw] text-[var(--a-accent)]" />;
  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card cdc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, CD_PALETTE), ...faceVars(design, "deco", CD_FACES), aspectRatio: ratioOf(kind), background: "radial-gradient(90% 50% at 50% 0%, rgba(214,179,106,.16), transparent 70%), var(--a-bg)", boxShadow: "0 50px 100px -40px rgba(0,0,0,.8)" }}
    >
      <BaseCSS />
      <style href="an-cd" precedence="default">{CD_CSS}</style>
      <style href="an-cd-card" precedence="default">{CSS}</style>
      <Grain opacity={0.14} blend="screen" freq={1.2} />
      <Bubbles count={16} animate={animate} />
      {/* stepped deco frame */}
      <div aria-hidden className="pointer-events-none absolute inset-[3cqw] border border-[var(--a-accent)]/70" />
      <div aria-hidden className="pointer-events-none absolute inset-[4.4cqw] border border-[var(--a-accent)]/25" />
      <div aria-hidden style={{ width: fanW }} className="absolute left-1/2 top-[3cqw] -translate-x-1/2 bg-[var(--a-bg)] px-[2cqw]"><Fan className="w-full text-[var(--a-accent)]" /></div>
      <div aria-hidden style={{ width: fanW }} className="absolute bottom-[3cqw] left-1/2 -translate-x-1/2 rotate-180 bg-[var(--a-bg)] px-[2cqw]"><Fan className="w-full text-[var(--a-accent)]" /></div>

      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[0.8fr_1.2fr] items-center gap-[5cqw] px-[10cqw] py-[10cqw]">
          <div className="border border-[var(--a-accent)]/60 p-[1cqw]"><Photo src={photoUrl} slot="photo" className="aspect-[4/5] w-full object-cover grayscale-[.35]" fallback={<CoupeTower animate={animate} bottle={false} rows={3} className="w-full" />} /></div>
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      ) : (
        <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[11cqw] py-[22cqw]" : shape === "square" ? "px-[12cqw] py-[11cqw]" : "px-[12cqw] py-[14cqw]"}`} style={{ gap: shape === "tall" ? "4cqw" : "2cqw" }}>
          {kind === "story" ? (
            photoUrl ? <div className="w-[60cqw] border border-[var(--a-accent)]/60 p-[1.2cqw]"><Photo src={photoUrl} slot="photo" className="aspect-[4/5] w-full object-cover grayscale-[.35]" /></div> : <CoupeTower animate={animate} className="w-[60cqw]" />
          ) : big ? (
            <p className="an-f-d leading-[.82] tracking-[-0.04em]" style={{ fontSize: shape === "square" ? "34cqw" : "48cqw" }}><span className="cd-gold">{A.age}</span></p>
          ) : kind === "event" || kind === "menu" || kind === "program" ? (
            <CoupeTower animate={animate} bottle={false} rows={3} className="w-[30cqw]" />
          ) : null}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      )}
    </div>
  );
}
