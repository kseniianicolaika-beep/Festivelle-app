"use client";
import type { CardProps } from "../../types";
import { designVars } from "@/lib/themes";
import { BaseCSS, KindBody } from "../_shared/CardKit";
import { annivFontVars } from "../_shared/fonts";
import { cardText, faceVars, Grain, paletteVars, Photo, ratioOf, shapeOf, useAnniv } from "../_shared/kit";
import { PEARL_CSS, PEARL_FACES, PEARL_PALETTE } from "./Site";
import { Doves, LocketRing, Strand } from "./art";

const CSS = `
.pyc .an-eyebrow{font-family:var(--a-label);color:var(--a-accent)}
.pyc .an-lead{font-family:var(--a-display);font-style:italic;color:var(--a-muted)}
.pyc .an-name,.pyc .an-head,.pyc .an-num,.pyc .an-item-t,.pyc .an-date,.pyc .an-body{font-family:var(--a-display);font-weight:300}
.pyc .an-name{letter-spacing:-.015em}
.pyc .an-head{font-style:italic}
.pyc .an-amp,.pyc .an-foot,.pyc .an-tagline,.pyc .an-both{font-family:var(--a-script);color:var(--a-accent)}
.pyc .an-sub{font-family:var(--a-display);font-style:italic;color:var(--a-muted);font-size:3.4cqw}
.pyc .an-where{font-family:var(--a-label);text-transform:uppercase;color:var(--a-muted)}
.pyc .an-item+.an-item{border-top:1px solid color-mix(in oklab,var(--a-line) 70%,transparent)}
.pyc .an-item-d{font-family:var(--a-display);font-style:italic}
.pyc .an-tag{font-family:var(--a-display);font-weight:300}
.pyc .an-num{font-style:italic}
.pyc .an-body{font-style:italic;color:var(--a-muted)}
.pyc[data-still] *{animation:none!important}
`;

export default function Card({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const A = useAnniv(profile, design);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const photoKinds = kind === "story" || kind === "thankyou" || kind === "post";
  const ghost = ["invite", "save", "greeting", "welcome"].includes(kind) && A.age;
  const rule = <svg viewBox="0 0 120 12" className="mb-[1.6cqw] w-[22cqw]" aria-hidden><line x1="0" y1="6" x2="50" y2="6" stroke="var(--a-line)" strokeWidth=".7" /><line x1="70" y1="6" x2="120" y2="6" stroke="var(--a-line)" strokeWidth=".7" /><circle cx="60" cy="6" r="3.6" fill="#f3ece3" stroke="#bfae93" strokeWidth=".5" /><circle cx="59" cy="5" r="1" fill="#fff" /></svg>;
  const locket = (w: string) => (
    <div className="relative mx-auto" style={{ width: w }}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[50%]">
        <Photo src={photoUrl} slot="photo" className="h-full w-full object-cover sepia-[.15] saturate-[.85]" fallback={<div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_40%_35%,#fff,#efe6da)]"><Doves className="w-2/3 text-[var(--a-accent)]" /></div>} />
        <div className="pointer-events-none absolute inset-0 rounded-[50%] shadow-[inset_0_0_6cqw_rgba(246,241,232,.9)]" />
      </div>
      <LocketRing animate={animate} rx={180} ry={240} r={7} count={44} className="pointer-events-none absolute -inset-[8%] h-[116%] w-[116%]" />
    </div>
  );

  return (
    <div
      lang={profile.language ?? "en"}
      data-shape={shape}
      data-still={animate ? undefined : ""}
      className={`an-card pyc @container relative w-full overflow-hidden text-[var(--a-ink)] ${annivFontVars} ${className}`}
      style={{ ...designVars(theme, design), ...paletteVars(design, PEARL_PALETTE), ...faceVars(design, "classic", PEARL_FACES), aspectRatio: ratioOf(kind), background: "radial-gradient(120% 90% at 50% 0%, #fffdf9, var(--a-paper) 55%, var(--a-bg))", boxShadow: "0 50px 100px -45px rgba(70,50,25,.5), 0 0 0 1px rgba(150,130,100,.18)" }}
    >
      <BaseCSS />
      <style href="an-pearl" precedence="default">{PEARL_CSS}</style>
      <style href="an-pearl-card" precedence="default">{CSS}</style>
      <Grain opacity={0.32} />
      {/* deckled cotton edge */}
      <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1.2cqw_rgba(255,255,255,.55),inset_0_0_4cqw_rgba(160,140,110,.18)]" />
      <div aria-hidden className="pointer-events-none absolute inset-[3.6cqw] border border-[var(--a-line)]/70" />

      <div className="absolute inset-x-0 top-0">
        <Strand count={A.age && A.age <= 60 ? Math.max(A.age, 15) : 30} width={1000} sag={shape === "wide" ? 70 : shape === "tall" ? 150 : 120} r={shape === "tall" ? 15 : 12} animate={animate} className="w-full" />
      </div>
      {ghost && <p aria-hidden className={`py-deboss an-f-d pointer-events-none absolute inset-x-0 text-center font-light italic leading-none ${shape === "tall" ? "top-[24%] text-[90cqw]" : "top-[22%] text-[78cqw]"}`}>{A.age}</p>}

      {kind === "thankyou" ? (
        <div className="relative grid h-full grid-cols-[0.8fr_1.2fr] items-center gap-[5cqw] px-[9cqw] pt-[8cqw] pb-[6cqw]">
          {locket("100%")}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
        </div>
      ) : (
        <div className={`relative flex h-full flex-col items-center justify-center ${shape === "tall" ? "px-[10cqw] pt-[34cqw] pb-[12cqw]" : shape === "wide" ? "px-[10cqw] pt-[14cqw] pb-[7cqw]" : shape === "square" ? "px-[12cqw] pt-[22cqw] pb-[9cqw]" : "px-[11cqw] pt-[28cqw] pb-[11cqw]"}`} style={{ gap: shape === "tall" ? "6cqw" : "3cqw" }}>
          {photoKinds && kind !== "post" && locket(shape === "tall" ? "52cqw" : "38cqw")}
          {kind === "post" && <p className="an-f-d py-lustre -mb-[2cqw] text-[26cqw] font-light italic leading-none">{A.age}</p>}
          <KindBody kind={kind} c={c} profile={profile} design={design} a={A.a} b={A.b} rule={rule} />
          {(kind === "invite" || kind === "greeting") && <Doves className="w-[30cqw] text-[var(--a-accent)] opacity-70" />}
        </div>
      )}
    </div>
  );
}
