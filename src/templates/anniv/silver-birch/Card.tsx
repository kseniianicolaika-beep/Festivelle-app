"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, paletteVars, Photo, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { SB_CSS, SB_FACES, SB_PALETTE } from "./Site";
import { Flake, Grove, Snow, Trunk } from "./art";

const CSS = `
.sbc .an-eyebrow,.sbc .an-where,.sbc .an-item-d{font-family:var(--a-label);text-transform:uppercase}
.sbc .an-eyebrow{color:var(--a-accent)}
.sbc .an-where,.sbc .an-item-d{color:var(--a-muted);letter-spacing:.14em}
.sbc .an-lead,.sbc .an-body{font-family:var(--a-body);color:var(--a-muted);font-style:italic}
.sbc .an-name,.sbc .an-head,.sbc .an-item-t,.sbc .an-date,.sbc .an-tag{font-family:var(--a-display)}
.sbc .an-num{font-family:var(--a-display)}
.sbc .an-head{color:var(--a-ink)}
.sbc .an-num{background:linear-gradient(105deg,#6f7f90 0%,#dfe6ed 18%,#8d9cab 34%,#ffffff 50%,#9aa8b6 66%,#e8eef3 82%,#6f7f90 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sb-foil 9s ease-in-out infinite;filter:drop-shadow(0 .3cqw .4cqw rgba(30,42,56,.25))}
.sbc .an-amp,.sbc .an-foot,.sbc .an-tagline,.sbc .an-both,.sbc .an-sub{font-family:var(--a-script);color:var(--a-accent)}
.sbc .an-sub{font-size:4.4cqw;letter-spacing:0}
.sbc .an-item+.an-item{border-top:1px solid var(--a-line)}
.sbc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const numKinds = ["invite", "save", "post", "greeting", "welcome", "story"].includes(kind);
  const rule = <div className="mb-[1.6cqw] flex items-center gap-[2cqw] text-[var(--a-muted)]"><span className="h-px w-[10cqw] bg-current opacity-40" /><Flake className="w-[3.4cqw]" /><span className="h-px w-[10cqw] bg-current opacity-40" /></div>;
  const amp = A.lang === "ru" ? "и" : "&";
  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card sbc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, SB_PALETTE), ...faceVars(design, "playfair", SB_FACES), aspectRatio: ratioOf(kind), background: "linear-gradient(180deg,#ffffff,var(--a-paper) 50%,var(--a-bg))", boxShadow: "0 40px 90px -40px rgba(30,42,56,.5)" }}
    >
      <BaseCSS />
      <style href="an-sb" precedence="default">{SB_CSS}</style>
      <style href="an-sb-card" precedence="default">{CSS}</style>
      <Grain opacity={0.22} />
      {/* letterpress: birch trunks pressed along the left edge */}
      {shape !== "wide" ? (
        <div aria-hidden className="absolute bottom-0 left-0 top-0 w-[24cqw]">
          <Trunk seed={3} h={1000} w={44} branches className={`absolute bottom-0 h-full ${shape === "tall" ? "left-[-20cqw]" : "left-[-14cqw]"}`} />
          <Trunk seed={8} h={900} w={26} className="absolute bottom-0 left-[-8cqw] h-[86%] opacity-70" />
        </div>
      ) : (
        <Grove count={6} seed={17} h={500} spread={1400} animate={animate} className="absolute inset-x-0 bottom-0 h-[55%] w-full opacity-40" />
      )}
      {shape !== "wide" && <div aria-hidden className="absolute bottom-0 right-0 top-0 w-[16cqw]"><Trunk seed={21} h={1000} w={22} className="absolute bottom-0 right-[-10cqw] h-[94%] opacity-60" /></div>}
      <Snow count={shape === "tall" ? 34 : 22} animate={animate} seed={kind.length + 3} />
      <div aria-hidden className="pointer-events-none absolute inset-[3.4cqw] border border-[var(--a-line)]" />

      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[0.8fr_1.2fr] items-center gap-[5cqw] px-[9cqw] py-[7cqw]">
          <div className="bg-white p-[1.4cqw] shadow-[0_2cqw_4cqw_-2cqw_rgba(30,42,56,.5)]"><Photo src={photoUrl} slot="photo" className="aspect-[4/5] w-full object-cover grayscale-[.2]" fallback={<div className="aspect-[4/5] bg-[var(--a-bg)]" />} /></div>
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} amp={amp} rule={rule} />
        </div>
      ) : (
        <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[16cqw] py-[14cqw]" : "px-[16cqw] py-[10cqw]"}`} style={{ gap: shape === "tall" ? "4cqw" : "2.4cqw" }}>
          {kind === "story" && photoUrl && <div className="w-[56cqw] bg-white p-[1.4cqw] shadow-[0_2cqw_4cqw_-2cqw_rgba(30,42,56,.5)]"><Photo src={photoUrl} slot="photo" className="aspect-[4/5] w-full object-cover grayscale-[.2]" /></div>}
          {numKinds && A.age && <p className="sb-silver an-f-d leading-[.9]" style={{ fontSize: kind === "story" ? "26cqw" : shape === "square" ? "24cqw" : "30cqw" }}>{A.age}</p>}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} amp={amp} rule={rule} />
        </div>
      )}
    </div>
  );
}
