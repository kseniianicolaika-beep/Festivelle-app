"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, numeral, paletteVars, Photo, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { GOLD_CSS, GOLD_FACES, GOLD_PALETTE } from "./Site";
import { Diya, JAALI, Jharokha, Palace, Surya, Toran } from "./art";

const CSS = `
.gjc .an-eyebrow{font-family:var(--a-label);color:var(--a-accent)}
.gjc .an-lead{font-family:var(--a-body);font-style:italic;color:var(--a-muted);font-size:3cqw;max-width:58cqw}
.gjc .an-name,.gjc .an-head,.gjc .an-num,.gjc .an-tag{font-family:var(--a-display);background:linear-gradient(100deg,#a8741f 0%,#fbe3a2 20%,#c8912f 40%,#fff3c9 55%,#b07a22 75%,#f6d488 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:gj-foil 7s ease-in-out infinite}
.gjc .an-name{line-height:1.1}
.gjc .an-amp,.gjc .an-sub,.gjc .an-foot,.gjc .an-tagline,.gjc .an-both,.gjc .an-body,.gjc .an-item-d{font-family:var(--a-body);font-style:italic;color:var(--a-muted)}
.gjc .an-amp{color:var(--a-ink)}
.gjc .an-sub{font-size:3.6cqw;letter-spacing:0}
.gjc .an-date,.gjc .an-item-t{font-family:var(--a-display)}
.gjc .an-where{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.2em;color:var(--a-muted)}
.gjc .an-foot{color:var(--a-accent)}
.gjc .an-item+.an-item{border-top:1px solid color-mix(in oklab,var(--a-accent) 30%,transparent)}
.gjc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const n = A.age ? numeral(A.age, A.lang, true) : "";
  const sunKinds = ["invite", "save", "post", "greeting", "welcome", "event"].includes(kind);
  const rule = <div className="mb-[1.6cqw] flex items-center gap-[2cqw] text-[var(--a-accent)]"><span className="h-px w-[12cqw] bg-gradient-to-r from-transparent to-current" /><span style={{ fontSize: "2.6cqw" }}>✦</span><span className="h-px w-[12cqw] bg-gradient-to-l from-transparent to-current" /></div>;
  const sun = (w: string) => (
    <div className="relative shrink-0" style={{ width: w }}>
      <Surya className="w-full" spin={animate} />
      <p className="an-f-d absolute inset-0 flex items-center justify-center pt-[4%] leading-none" style={{ fontSize: `calc(${w} * .3)` }}><span className="gj-gold">{n || "✦"}</span></p>
    </div>
  );

  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card gjc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, GOLD_PALETTE), ...faceVars(design, "royal", GOLD_FACES), aspectRatio: ratioOf(kind), background: "radial-gradient(90% 55% at 50% 30%, #6a1520, transparent 75%), linear-gradient(180deg, var(--a-bg), var(--a-deep))", boxShadow: "0 50px 100px -40px rgba(40,4,10,.8)" }}
    >
      <BaseCSS />
      <style href="an-gold" precedence="default">{GOLD_CSS}</style>
      <style href="an-gold-card" precedence="default">{CSS}</style>
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: JAALI("#e2b356", 0.07), backgroundSize: "7cqw 7cqw" }} />
      <Grain opacity={0.2} blend="overlay" />
      <div aria-hidden className="pointer-events-none absolute inset-[2.6cqw] border border-[var(--a-accent)]/70" />
      <div aria-hidden className="pointer-events-none absolute inset-[3.8cqw] border border-[var(--a-accent)]/25" />

      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[0.75fr_1.25fr] items-center gap-[4cqw] px-[8cqw] py-[7cqw]">
          <div className="relative aspect-[3/4.3] w-full">
            <div className="absolute inset-[5%_5%_2.5%] overflow-hidden rounded-t-[50%_32%]"><Photo src={photoUrl} slot="photo" className="h-full w-full object-cover" fallback={<div className="h-full w-full bg-[#2a070b]" style={{ backgroundImage: JAALI() }} />} /></div>
            <Jharokha className="relative h-full w-full" />
          </div>
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      ) : (
        <>
          <Toran className="absolute inset-x-[2.6cqw] top-[2.6cqw] w-[calc(100%-5.2cqw)]" swags={shape === "wide" ? 6 : 4} animate={animate} />
          <div className={`absolute left-1/2 -translate-x-1/2 ${shape === "tall" ? "inset-y-[16cqw] w-[82cqw]" : shape === "square" ? "inset-y-[13cqw] w-[70cqw]" : "inset-y-[15cqw] w-[78cqw]"}`}>
            <Jharokha className="h-full w-full" fill="rgba(30,4,8,.3)" />
          </div>
          <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[14cqw] pb-[30cqw] pt-[30cqw]" : shape === "square" ? "px-[18cqw] pb-[10cqw] pt-[24cqw]" : "px-[16cqw] pb-[14cqw] pt-[26cqw]"}`} style={{ gap: shape === "tall" ? "4cqw" : "2.2cqw" }}>
            {kind === "story" && photoUrl ? (
              <div className="relative aspect-[3/4] w-[44cqw]">
                <div className="absolute inset-[5%_5%_2.5%] overflow-hidden rounded-t-[50%_32%]"><Photo src={photoUrl} slot="photo" className="h-full w-full object-cover" /></div>
                <Jharokha className="relative h-full w-full" />
              </div>
            ) : (sunKinds || kind === "story") && sun(shape === "tall" ? "40cqw" : shape === "square" ? "24cqw" : "30cqw")}
            <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
          </div>
          {(shape === "tall" || kind === "invite") && (
            <div className="pointer-events-none absolute inset-x-[2.6cqw] bottom-[2.6cqw]">
              {shape === "tall" && <Palace className="w-full opacity-90" />}
              <div className={`flex justify-center gap-[7cqw] ${shape === "tall" ? "absolute inset-x-0 bottom-[1.5cqw]" : "pb-[2cqw]"}`}>
                {[0, 1, 2].map((i) => <Diya key={i} className="w-[7cqw]" flicker={animate} delay={i * 0.4} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
