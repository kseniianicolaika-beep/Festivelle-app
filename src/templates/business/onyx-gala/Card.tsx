"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Sunburst, Chevrons, Fan, OG_CSS } from "./art";
import { OG_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, Grain, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "og-shine" : "";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 7.5 : tall ? 12 : 10.5) * sc, 8, 0.42);
  const caps = { fontFamily: F.cinzel, letterSpacing: "0.45em" } as const;

  const frame = (
    <>
      <div className="pointer-events-none absolute inset-[3.5cqw] border border-[var(--t-gold)]/55" />
      <div className="pointer-events-none absolute inset-[5cqw] border border-[var(--t-gold)]/25" />
    </>
  );
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[1cqw]">
      <Chevrons className="h-[2cqw] w-[30cqw]" n={10} />
      {c.date && <p className="uppercase" style={{ ...caps, fontSize: wide ? "2.2cqw" : "3cqw", letterSpacing: "0.3em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.6cqw" : "2.1cqw", letterSpacing: "0.4em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-gold)]" style={{ fontFamily: F.corm, fontSize: "3.8cqw" }}>{c.footer}</E>}
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <Fan className="w-[28cqw]" />
        <E as="p" path="texts.headline" className="mt-[2cqw] block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "3.4cqw" }}>{c.headline}</E>
        <p className={`og-foil ${shine} leading-none`} style={{ fontFamily: F.poiret, fontSize: `${40 * sc}cqw` }}>{c.number}</p>
        <p className="uppercase text-[var(--t-gold)]" style={{ ...caps, fontSize: "2.6cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[4cqw] px-[14cqw] text-center">
        <Sunburst className="w-[50cqw]" rays={15} />
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "3cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`og-foil ${shine} block break-all leading-tight`} style={{ fontFamily: F.poiret, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[38%_1fr] items-center gap-[4cqw] px-[9cqw]">
        <Sunburst className="w-full" />
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`og-foil ${shine} block uppercase leading-none`} style={{ fontFamily: F.poiret, fontSize: `${fit(c.headline, 9, 9) * sc}cqw`, letterSpacing: "0.1em" }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontFamily: F.corm, fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          <Chevrons className="h-[1.6cqw] w-[24cqw]" n={8} />
          <p className="uppercase text-[var(--t-gold)]" style={{ ...caps, fontSize: "2cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[13cqw] py-[14cqw]" : square ? "px-[11cqw] py-[9cqw]" : "px-[13cqw] py-[11cqw]"}`}>
        <div className="flex w-full flex-col items-center gap-[1.6cqw]">
          {!isList && <Sunburst className="drop-shadow-[0_1cqw_2cqw_rgba(0,0,0,.5)]" style={{ width: tall ? "62cqw" : square ? "40cqw" : "52cqw" }} />}
          {isList && <Fan style={{ width: "26cqw" }} />}
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "2.2cqw" }}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className={`block uppercase leading-[1.05] ${c.showName ? "text-[var(--t-gold)]" : `og-foil ${shine}`}`} style={{ fontFamily: c.showName ? F.cinzel : F.poiret, fontSize: `${fit(c.headline, c.showName ? 5 : tall ? 11 : 9.5, 10)}cqw`, letterSpacing: "0.12em" }}>{c.headline}</E>}
          {c.showName && <h2 className="uppercase leading-[0.98]" style={{ fontFamily: F.poiret, fontSize: `${nameSize}cqw`, letterSpacing: "0.06em" }}><E path="profile.partner1" className={`og-foil ${shine}`}>{c.name}</E></h2>}
          {c.showName && c.line && <p className="italic text-[var(--t-gold)]" style={{ fontFamily: F.corm, fontSize: tall ? "5.4cqw" : "4.6cqw", lineHeight: 1.1 }}>{c.line}</p>}
        </div>
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw] italic" style={{ fontFamily: F.corm, fontSize: tall ? "4cqw" : "3.4cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw] italic" style={{ fontFamily: F.corm, fontSize: "3.3cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="flex items-baseline gap-[2cqw]" style={{ padding: tall ? "3cqw 0" : "2.2cqw 0", borderTop: i ? "1px solid rgba(214,179,106,.28)" : undefined }}>
                <span className="og-foil" style={{ fontFamily: F.poiret, fontSize: tall ? "6cqw" : "4.6cqw" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-left">
                  <E as="p" path={`items.${i}.title`} className="block" style={{ fontFamily: F.corm, fontSize: tall ? "5.2cqw" : "4.2cqw" }}>{it.title}</E>
                  {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.9cqw" : "2.4cqw", marginTop: "0.4cqw" }}>{it.detail}</E>}
                </span>
              </li>
            ))}
          </ol>
        )}
        {isList && <p className="uppercase text-[var(--t-gold)]" style={{ ...caps, fontSize: "2.4cqw" }}>{c.name}</p>}
        <div className="w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("onyx-gala", theme, design, OG_VARS)} className={`${FONT_VARS} og-onyx og-rays ${animate ? "" : "og-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.85)] ${className}`} style={{ fontFamily: F.tenor }}>
      <style href="biz-og" precedence="default">{OG_CSS}</style>
      <Grain opacity={0.12} blend="overlay" freq={1} />
      {frame}
      {body}
    </CardFrame>
  );
}
