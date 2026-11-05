"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, paletteVars, Photo, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { RUBY_CSS, RUBY_FACES, RUBY_PALETTE } from "./Site";
import { DecoCorner, Rings, Ruby, VELVET } from "./art";

const CSS = `
.rbc .an-eyebrow{font-family:var(--a-label);color:var(--a-accent)}
.rbc .an-lead{font-family:var(--a-body);font-style:italic;color:var(--a-muted);font-size:3.4cqw}
.rbc .an-name,.rbc .an-head,.rbc .an-num,.rbc .an-tag{font-family:var(--a-display);background:linear-gradient(100deg,#9a6a2c 0%,#f6dc9c 22%,#b8823d 42%,#ffeec4 58%,#a5722f 78%,#f2d391 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rb-foil 8s ease-in-out infinite}
.rbc .an-name{line-height:1.08}
.rbc .an-amp,.rbc .an-foot,.rbc .an-tagline,.rbc .an-both{font-family:var(--a-script);color:var(--a-ink)}
.rbc .an-sub{font-family:var(--a-script);color:var(--a-muted);font-size:5cqw;letter-spacing:0}
.rbc .an-date,.rbc .an-item-t{font-family:var(--a-display)}
.rbc .an-where,.rbc .an-item-d{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.18em;color:var(--a-muted)}
.rbc .an-item+.an-item{border-top:1px solid color-mix(in oklab,var(--a-accent) 30%,transparent)}
.rbc .an-body{font-family:var(--a-body);font-style:italic;color:var(--a-muted)}
.rbc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const ghost = ["invite", "save", "story", "post", "greeting", "welcome"].includes(kind) && A.age;
  const rule = <div className="mb-[2cqw] flex items-center gap-[2cqw] text-[var(--a-accent)]"><span className="h-px w-[12cqw] bg-gradient-to-r from-transparent to-current" /><span className="block h-[2cqw] w-[2cqw] rotate-45 bg-[radial-gradient(circle_at_35%_30%,#ff9fb0,#c01334_60%,#5e0617)]" /><span className="h-px w-[12cqw] bg-gradient-to-l from-transparent to-current" /></div>;
  const gemW = shape === "tall" ? "34cqw" : shape === "wide" ? "13cqw" : shape === "square" ? "18cqw" : "24cqw";

  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card rbc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, RUBY_PALETTE), ...faceVars(design, "playfair", RUBY_FACES), aspectRatio: ratioOf(kind), background: VELVET, backgroundColor: "var(--a-bg)", boxShadow: "0 50px 100px -40px rgba(30,0,8,.8)" }}
    >
      <BaseCSS />
      <style href="an-ruby" precedence="default">{RUBY_CSS}</style>
      <style href="an-ruby-card" precedence="default">{CSS}</style>
      <Grain opacity={0.25} blend="overlay" freq={1.3} />
      <div aria-hidden className="pointer-events-none absolute inset-[3.5cqw] border border-[color-mix(in_oklab,var(--a-accent)_60%,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-[5cqw] border border-[color-mix(in_oklab,var(--a-accent)_25%,transparent)]" />
      {[["left-[2.4cqw] top-[2.4cqw]", ""], ["right-[2.4cqw] top-[2.4cqw]", "rotate-90"], ["bottom-[2.4cqw] right-[2.4cqw]", "rotate-180"], ["bottom-[2.4cqw] left-[2.4cqw]", "-rotate-90"]].map(([pos, rot], i) => (
        <DecoCorner key={i} className={`absolute w-[11cqw] text-[var(--a-accent)] ${pos} ${rot}`} />
      ))}
      {ghost && <p aria-hidden className={`rb-outline an-f-d pointer-events-none absolute inset-x-0 text-center leading-none ${shape === "tall" ? "top-[30%] text-[96cqw]" : shape === "square" ? "top-[8%] text-[70cqw]" : "top-[24%] text-[82cqw]"}`}>{A.age}</p>}

      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[0.75fr_1.25fr] items-center gap-[5cqw] px-[10cqw] py-[8cqw]">
          <div className="overflow-hidden rounded-t-full border border-[var(--a-accent)] p-[1cqw]"><Photo src={photoUrl} slot="photo" className="aspect-[3/4] w-full rounded-t-full object-cover" fallback={<div className="flex aspect-[3/4] items-center justify-center"><Ruby className="w-2/3" glint={animate} /></div>} /></div>
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      ) : (
        <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[11cqw] py-[14cqw]" : shape === "wide" ? "px-[12cqw] py-[8cqw]" : "px-[12cqw] py-[12cqw]"}`} style={{ gap: shape === "tall" ? "5cqw" : "2.6cqw" }}>
          {kind === "story" && photoUrl ? (
            <div className="w-[56cqw] overflow-hidden rounded-t-full border border-[var(--a-accent)] p-[1.2cqw]"><Photo src={photoUrl} slot="photo" className="aspect-[4/5] w-full rounded-t-full object-cover" /></div>
          ) : kind === "table" || kind === "menu" || kind === "program" ? (
            <Rings className="w-[22cqw]" />
          ) : (
            <div style={{ width: gemW }}><Ruby className="w-full drop-shadow-[0_2cqw_4cqw_rgba(255,40,80,.35)]" glint={animate} /></div>
          )}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      )}
    </div>
  );
}
