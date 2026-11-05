"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, paletteVars, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { TN_CSS, TN_FACES, TN_PALETTE } from "./Site";
import { Odometer, Postmark, Print, Ribbon, TnFilters } from "./art";

const CSS = `
.tnc .an-eyebrow,.tnc .an-where,.tnc .an-item-d{font-family:var(--a-label);text-transform:uppercase;letter-spacing:.22em}
.tnc .an-eyebrow{color:var(--a-accent)}
.tnc .an-where,.tnc .an-item-d{color:var(--a-muted);font-size:2.2cqw}
.tnc .an-lead{font-family:var(--a-display);font-style:italic;color:var(--a-muted)}
.tnc .an-name,.tnc .an-head,.tnc .an-num,.tnc .an-item-t,.tnc .an-tag{font-family:var(--a-display);font-style:italic}
.tnc .an-amp,.tnc .an-foot,.tnc .an-tagline,.tnc .an-both,.tnc .an-sub{font-family:var(--a-script);color:var(--a-accent)}
.tnc .an-sub{font-size:4.6cqw;letter-spacing:0;color:var(--a-sepia)}
.tnc .an-amp{font-size:.7em}
.tnc .an-date{font-family:var(--a-label);font-size:3cqw;letter-spacing:.18em;text-transform:uppercase}
.tnc .an-body{font-family:var(--a-display);font-style:italic}
.tnc .an-item+.an-item{border-top:1px dashed color-mix(in oklab,var(--a-muted) 45%,transparent)}
.tnc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const twoFrames = ["invite", "save", "story", "post", "greeting", "thankyou", "welcome"].includes(kind);
  const stamp = A.since && profile.date ? `'${String(A.since).slice(2)} ${profile.date.slice(5, 7)} ${profile.date.slice(8, 10)}` : undefined;
  const lab = (s: string) => <span className="tn-hand" style={{ fontSize: shape === "tall" ? "4.6cqw" : "3.6cqw", color: "var(--a-sepia)" }}>{s}</span>;
  const frames = (w: string, h: string) => (
    <div className="relative mx-auto" style={{ width: w, height: h }}>
      <div className="absolute left-0 top-0 z-[1] w-[56%]"><Print era="then" src={photoUrl} slot="photo" tilt={-5} stamp={stamp} label={lab(`${A.L.then}${A.since ? ", " + A.since : ""}`)} /></div>
      <div className="absolute bottom-0 right-0 z-[2] w-[56%]"><Print era="now" src={photoUrl} slot="photo" tilt={4} label={lab(`${A.L.now}${A.year ? ", " + A.year : ""}`)} /></div>
      <Ribbon animate={animate} className="absolute left-[-8%] top-[34%] z-[3] h-[34%] w-[116%]" />
    </div>
  );
  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card tnc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, TN_PALETTE), ...faceVars(design, "lora", TN_FACES), aspectRatio: ratioOf(kind), background: "var(--a-bg)", boxShadow: "0 40px 90px -40px rgba(60,35,20,.55)" }}
    >
      <BaseCSS />
      <style href="an-tn" precedence="default">{TN_CSS}</style>
      <style href="an-tn-card" precedence="default">{CSS}</style>
      <TnFilters />
      <Grain opacity={0.4} />
      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[1fr_1fr] items-center gap-[4cqw] px-[7cqw] py-[6cqw]">
          {frames("90%", "42cqw")}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} />
        </div>
      ) : (
        <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[9cqw] py-[10cqw]" : "px-[9cqw] py-[8cqw]"}`} style={{ gap: shape === "tall" ? "5cqw" : "3cqw" }}>
          {twoFrames ? frames(shape === "tall" ? "80cqw" : shape === "square" ? "46cqw" : "70cqw", shape === "tall" ? "86cqw" : shape === "square" ? "44cqw" : "58cqw") : (
            <p className="an-f-d font-bold leading-none" style={{ fontSize: shape === "tall" ? "20cqw" : "16cqw" }}>{A.age ? <Odometer from={0} to={A.age} animate={animate} /> : <Odometer from={A.since} to={A.year} animate={animate} />}</p>
          )}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} gap={shape === "tall" ? "2.6cqw" : "1.6cqw"} />
          {kind === "invite" && <Postmark city={profile.city ?? ""} date={A.dateNum} className="absolute bottom-[3cqw] right-[3cqw] w-[30cqw] -rotate-6 opacity-80" />}
        </div>
      )}
    </div>
  );
}
