"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Sunburst, ZigguratFrame, Fan, DecoRule, FF_CSS } from "./art";
import { FF_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars, roman } from "../_shared/ui";
import { cardText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "ff-shine" : "";
  const age = profile.age;
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 6.5 : tall ? 10 : 9) * sc, 7, 0.5);

  const corners = (
    <>
      <Fan className="absolute left-[3cqw] top-[3cqw] w-[12cqw] rotate-90" />
      <Fan className="absolute right-[3cqw] top-[3cqw] w-[12cqw] rotate-180" />
      <Fan className="absolute bottom-[3cqw] left-[3cqw] w-[12cqw]" />
      <Fan className="absolute bottom-[3cqw] right-[3cqw] w-[12cqw] -rotate-90" />
      <div className="absolute inset-[3cqw] border border-[var(--t-gold)]/50" />
    </>
  );
  const medallion = (w: number, numSize: number, showAge = true) => (
    <div className="relative" style={{ width: `${w}cqw` }}>
      <Sunburst className="w-full" rays={tall ? 40 : 32} />
      {showAge && age ? <span className={`ff-foil ${shine} absolute inset-x-0 bottom-0 block text-center leading-[0.8]`} style={{ fontFamily: F.lime, fontSize: `${numSize}cqw` }}>{age}</span> : null}
    </div>
  );
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[1cqw]">
      {c.date && <p className="uppercase" style={{ fontFamily: F.poiret, fontSize: wide ? "2.6cqw" : "3.6cqw", letterSpacing: "0.22em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", letterSpacing: "0.45em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5cqw" }}>{c.footer}</E>}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-gold)]" style={{ fontFamily: F.poiret, fontSize: "4.4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <div className="relative mt-[2cqw]" style={{ width: "62cqw" }}>
          <Sunburst className="w-full opacity-70" />
          <span className={`ff-foil ${shine} absolute inset-x-0 bottom-[-4cqw] block text-center leading-none`} style={{ fontFamily: F.lime, fontSize: `${30 * sc}cqw` }}>{c.number}</span>
        </div>
        <DecoRule className="mt-[6cqw] w-[44cqw]" />
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[12cqw] text-center">
        {medallion(54, 0, false)}
        <E as="p" path="texts.body" className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`ff-foil ${shine} block break-all uppercase leading-tight`} style={{ fontFamily: F.poiret, fontSize: `${fit(c.hashtag, 9, 11) * sc}cqw`, letterSpacing: "0.08em" }}>{c.hashtag}</E>
        <DecoRule className="w-[46cqw]" />
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[40%_1fr] items-center gap-[4cqw] px-[9cqw]">
        {medallion(34, 16)}
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`ff-foil ${shine} block uppercase leading-none`} style={{ fontFamily: F.poiret, fontSize: `${fit(c.headline, 7.5, 9) * sc}cqw`, letterSpacing: "0.14em" }}>{c.headline}</E>
          <DecoRule className="w-[30cqw]" />
          {c.body && <E as="p" multiline path="texts.body" className="block max-w-[44cqw]" style={{ fontSize: "2.4cqw", lineHeight: 1.6 }}>{c.body}</E>}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "4.6cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center text-center ${tall ? "px-[12cqw] py-[14cqw]" : "px-[12cqw] py-[11cqw]"}`}>
        <ZigguratFrame className="absolute inset-[7cqw] h-[calc(100%-14cqw)] w-[calc(100%-14cqw)]" />
        <div className="relative flex h-full w-full flex-col items-center justify-between pt-[10cqw]">
          <div className="flex w-full flex-col items-center gap-[1.6cqw]">
            {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", letterSpacing: "0.5em" }}>{c.eyebrow}</E>}
            {!isList && c.showName && medallion(tall ? 66 : square ? 34 : 60, tall ? 31 : square ? 16 : 27)}
            {c.headline && <E as="p" path="texts.headline" className={`${c.showName ? "text-[var(--t-accent)]" : `ff-foil ${shine}`} block uppercase leading-[1.05]`} style={{ fontFamily: F.poiret, fontSize: `${fit(c.headline, c.showName ? 6 : tall ? 10 : 8.5, 10)}cqw`, letterSpacing: "0.14em" }}>{c.headline}</E>}
            {isList && <DecoRule className="w-[40cqw]" />}
            {c.showName && <h2 className="uppercase leading-[1.05]" style={{ fontFamily: F.poiret, fontSize: `${nameSize}cqw`, letterSpacing: "0.14em" }}><E path="profile.partner1" className={`ff-foil ${shine}`}>{c.name}</E></h2>}
            {c.showName && c.line && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: tall ? "7cqw" : "5.6cqw", lineHeight: 1.1 }}>{c.line}</p>}
            {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw]" style={{ fontSize: tall ? "3.4cqw" : "2.8cqw", lineHeight: 1.6, letterSpacing: "0.04em" }}>{c.lead}</E>}
            {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[64cqw]" style={{ fontSize: "2.9cqw", lineHeight: 1.6 }}>{c.body}</E>}
            {isList && (
              <ol className="w-full">
                {c.items.map((it, i) => (
                  <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "3.4cqw 0" : "2.4cqw 0" }}>
                    <span className={`ff-foil ${shine}`} style={{ fontFamily: F.lime, fontSize: "3.4cqw" }}>{roman(i + 1)}</span>
                    <E as="p" path={`items.${i}.title`} className="block uppercase" style={{ fontFamily: F.poiret, fontSize: tall ? "5.2cqw" : "4.2cqw", letterSpacing: "0.12em" }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "3cqw" : "2.4cqw", marginTop: "0.8cqw" }}>{it.detail}</E>}
                  </li>
                ))}
              </ol>
            )}
            {isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5.4cqw" }}>{c.name}{age ? ` · ${age}` : ""}</p>}
          </div>
          <div className="flex w-full flex-col items-center gap-[1.6cqw]">
            {footer && <DecoRule className="w-[40cqw]" />}
            {footer}
          </div>
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("forty-fabulous", theme, design, FF_VARS)} className={`${FONT_VARS} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.75)] ${className}`} style={{ background: "radial-gradient(80% 55% at 50% 38%, #143a30 0%, #0d1714 55%, #0a0b0c 100%)", fontFamily: F.tenor }}>
      <style href="cel-ff" precedence="default">{FF_CSS}</style>
      <div className="ff-pattern absolute inset-0 opacity-70" />
      <Grain opacity={0.16} blend="overlay" />
      {corners}
      {body}
    </CardFrame>
  );
}
