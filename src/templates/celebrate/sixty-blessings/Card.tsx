"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { INVOCATIONS } from "@/lib/motifs";
import { Kuthuvilakku, Kalasam, Thoranam, MandapamArch, KOLAM_BG, SB_CSS } from "./art";
import { SB_VARS, ritual } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars } from "../_shared/ui";
import { cardText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "sb-shine" : "";
  const age = profile.age;
  const isList = kind === "menu" || kind === "program";
  const inv = design.invocation ? INVOCATIONS[design.invocation] : null;
  const nameSize = fit(c.name, (wide ? 7 : tall ? 11 : 10) * sc, 8, 0.5);
  const cinzel = (s: string, size: number, path?: string, cls = "text-[var(--t-muted)]") => s ? (path ? <E as="p" path={path} className={`block uppercase ${cls}`} style={{ fontFamily: F.cinzel, fontSize: `${size}cqw`, letterSpacing: "0.3em" }}>{s}</E> : <p className={`uppercase ${cls}`} style={{ fontFamily: F.cinzel, fontSize: `${size}cqw`, letterSpacing: "0.3em" }}>{s}</p>) : null;
  const divider = <div className="flex items-center justify-center gap-[2cqw] text-[var(--t-gold)]"><span className="h-px w-[9cqw] bg-current" /><span className="h-[1.4cqw] w-[1.4cqw] rotate-45 border border-current" /><span className="h-px w-[9cqw] bg-current" /></div>;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[1cqw]">
      {divider}
      {c.date && <p style={{ fontFamily: F.cinzel, fontSize: wide ? "2.6cqw" : "3.6cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {cinzel(c.where, wide ? 1.7 : 2.1, c.wherePath)}
      {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-accent)]" style={{ fontSize: "4.2cqw" }}>{c.footer}</E>}
    </div>
  );
  const thoranam = (
    <div className={`absolute inset-x-0 top-0 flex ${animate ? "sb-sway" : ""}`}>
      {Array.from({ length: 3 }, (_, i) => <Thoranam key={i} strands={!wide && !square} className="w-1/3 shrink-0" />)}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-end pb-[10cqw] text-center">
        <Kalasam className="w-[16cqw]" />
        {cinzel(c.headline, 3.4, "texts.headline", "text-[var(--t-accent)] mt-[2cqw]")}
        <p className={`sb-foil ${shine} leading-none`} style={{ fontFamily: F.yatra, fontSize: `${34 * sc}cqw` }}>{c.number}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[10cqw] pt-[16cqw] text-center">
        <Kuthuvilakku className="w-[16cqw]" />
        <E as="p" path="texts.body" className="block italic text-[var(--t-muted)]" style={{ fontSize: "5.6cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`sb-foil ${shine} block break-all leading-tight`} style={{ fontFamily: F.yatra, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
        {divider}
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[1fr_1.4fr_1fr] items-end px-[6cqw] pb-[6cqw] pt-[14cqw]">
        <Kuthuvilakku className="mx-auto w-[13cqw]" />
        <div className="flex flex-col items-center gap-[1.4cqw] pb-[2cqw] text-center">
          <E as="p" path="texts.headline" className={`sb-foil ${shine} block leading-none`} style={{ fontFamily: F.yatra, fontSize: `${fit(c.headline, 9, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontSize: "2.8cqw", lineHeight: 1.45 }}>{c.body}</E>}
          {divider}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: F.yatra, fontSize: "3.8cqw" }}>{c.name}</p>
        </div>
        <Kuthuvilakku className="mx-auto w-[13cqw]" />
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center ${tall ? "px-[8cqw] pb-[10cqw] pt-[30cqw]" : square ? "px-[10cqw] pb-[6cqw] pt-[16cqw]" : "px-[9cqw] pb-[8cqw] pt-[22cqw]"}`}>
        <div className={`relative flex h-full w-full flex-col items-center justify-between px-[6cqw] pb-[5cqw] text-center ${isList ? "pt-[36cqw]" : "pt-[16cqw]"}`}>
          <MandapamArch className="absolute inset-0 h-full w-full" />
          <div className="relative flex w-full flex-col items-center gap-[1.4cqw]">
            {inv && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.deva, fontSize: "3.6cqw" }} dir="auto">{inv.text}</p>}
            {!isList && <Kalasam className={`shrink-0 ${tall ? "w-[18cqw]" : square ? "w-[9cqw]" : "w-[13cqw]"}`} />}
            {c.eyebrow && cinzel(c.eyebrow, 2, "texts.eyebrow")}
            {c.showName && !isList && kind !== "greeting" && cinzel(ritual(profile), 2, undefined, "text-[var(--t-accent)]")}
            {c.showName && !isList && age ? <p className={`sb-foil ${shine} leading-[0.95]`} style={{ fontFamily: F.yatra, fontSize: `${tall ? 26 : square ? 13 : 20}cqw` }}>{age}</p> : null}
            {c.headline && <E as="p" path="texts.headline" className={`${c.showName ? "text-[var(--t-accent)]" : `sb-foil ${shine}`} block leading-tight`} style={{ fontFamily: F.yatra, fontSize: `${fit(c.headline, c.showName ? 7 : tall ? 11 : 9, 10)}cqw` }}>{c.headline}</E>}
            {c.showName && <h2 className="leading-[1.05]" style={{ fontFamily: F.yatra, fontSize: `${nameSize}cqw` }}><E path="profile.partner1" className={`sb-foil ${shine}`}>{c.name}</E></h2>}
            {c.showName && c.line && <p className="italic text-[var(--t-muted)]" style={{ fontSize: tall ? "4.4cqw" : "3.6cqw" }}>{c.line}</p>}
            {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[60cqw] italic" style={{ fontSize: tall ? "3.9cqw" : "3.2cqw", lineHeight: 1.45 }}>{c.lead}</E>}
            {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[62cqw] italic" style={{ fontSize: "3.3cqw", lineHeight: 1.45 }}>{c.body}</E>}
            {isList && (
              <ol className="w-full">
                {c.items.map((it, i) => (
                  <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "2.4cqw 0" : "1.6cqw 0", borderTop: i ? "1px solid rgba(212,162,76,.3)" : undefined }}>
                    <E as="p" path={`items.${i}.title`} className="block" style={{ fontFamily: F.yatra, fontSize: tall ? "5cqw" : "4cqw" }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic text-[var(--t-muted)]" style={{ fontSize: tall ? "3.4cqw" : "2.8cqw" }}>{it.detail}</E>}
                  </li>
                ))}
              </ol>
            )}
            {isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.yatra, fontSize: "4.4cqw" }}>{c.name}{age ? ` · ${age}` : ""}</p>}
          </div>
          <div className="relative w-full">{footer}</div>
        </div>
        {!square && <Kuthuvilakku className="absolute bottom-[3cqw] left-[2.5cqw] w-[11cqw]" />}
        {!square && <Kuthuvilakku className="absolute bottom-[3cqw] right-[2.5cqw] w-[11cqw]" />}
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("sixty-blessings", theme, design, SB_VARS)} className={`${FONT_VARS} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(60,10,18,.8)] ${className}`} style={{ background: "radial-gradient(85% 60% at 50% 40%, #5c1520 0%, #3d0b12 60%, #2a070c 100%)", fontFamily: F.cormG }}>
      <style href="cel-sb" precedence="default">{SB_CSS}</style>
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: KOLAM_BG, backgroundSize: "16cqw" }} />
      <Grain opacity={0.14} blend="overlay" />
      <div className="absolute inset-[2.4cqw] border border-[var(--t-gold)]/40" />
      {body}
      {thoranam}
    </CardFrame>
  );
}
