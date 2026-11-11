"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Network, CN_CSS } from "./art";
import { CN_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "cn-shine" : "";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 7.5 : tall ? 11.5 : 10.5) * sc, 9, 0.45);
  const caps = { fontSize: wide ? "1.7cqw" : "2.1cqw", letterSpacing: "0.45em" } as const;
  const prata = { fontFamily: F.prata } as const;

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "3cqw" }}>{c.headline}</E>
        <p className={`cn-gold ${shine} leading-none`} style={{ ...prata, fontSize: `${38 * sc}cqw` }}>{c.number}</p>
        <Network still={!animate} className="w-[46cqw]" />
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[4cqw] px-[12cqw] text-center">
        <Network still={!animate} className="w-[60cqw]" />
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`cn-gold ${shine} block break-all leading-tight`} style={{ ...prata, fontSize: `${fit(c.hashtag, 9, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[40%_1fr] items-center gap-[5cqw] px-[8cqw]">
        <Network still={!animate} className="w-full" />
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`cn-gold ${shine} block leading-none`} style={{ ...prata, fontSize: `${fit(c.headline, 9, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontFamily: F.corm, fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          <p className="uppercase text-[var(--t-muted)]" style={caps}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[11cqw] py-[13cqw]" : square ? "px-[9cqw] py-[7cqw]" : "px-[11cqw] py-[10cqw]"}`}>
        {c.eyebrow ? <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.eyebrow}</E> : <span />}
        {!isList && <Network still={!animate} style={{ width: tall ? "78cqw" : square ? "46cqw" : "66cqw" }} />}
        <div className="flex w-full flex-col items-center gap-[1.2cqw]">
          {c.headline && <E as="p" path="texts.headline" className={`block leading-[1.05] ${c.showName ? "italic text-[#f3a7b5]" : `cn-gold ${shine}`}`} style={{ fontFamily: c.showName ? F.corm : F.prata, fontSize: `${fit(c.headline, c.showName ? 6 : tall ? 11 : 9.5, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="leading-[1]" style={{ ...prata, fontSize: `${nameSize}cqw` }}><E path="profile.partner1" className={`cn-gold ${shine}`}>{c.name}</E></h2>}
          {c.showName && c.line && <p className="italic text-[#f3a7b5]" style={{ fontFamily: F.corm, fontSize: tall ? "5cqw" : "4.2cqw" }}>{c.line}</p>}
        </div>
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[66cqw] italic" style={{ fontFamily: F.corm, fontSize: tall ? "4cqw" : "3.4cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw] italic" style={{ fontFamily: F.corm, fontSize: "3.3cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full text-left">
            {c.items.map((it, i) => (
              <li key={i} className="flex items-center gap-[3cqw] border-b border-[#b7b0d6]/25" style={{ padding: tall ? "2.8cqw 0" : "2.2cqw 0" }}>
                <span className="h-[1.6cqw] w-[1.6cqw] shrink-0 rounded-full bg-[#f4ecff] shadow-[0_0_1.6cqw_0.4cqw_rgba(233,185,73,.5)]" />
                <span className="flex-1">
                  <E as="p" path={`items.${i}.title`} className="block" style={{ ...prata, fontSize: tall ? "4.6cqw" : "3.8cqw" }}>{it.title}</E>
                  {kind === "menu" && it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.7cqw" : "2.3cqw", marginTop: "0.4cqw" }}>{it.detail}</E>}
                </span>
                {kind === "program" && <E as="span" path={`items.${i}.detail`} className="uppercase text-[var(--t-accent)]" style={{ fontSize: tall ? "2.4cqw" : "2cqw", letterSpacing: "0.25em" }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-col items-center gap-[0.8cqw]">
          {c.date && <p className="uppercase" style={{ ...caps, fontSize: wide ? "2cqw" : "2.6cqw", letterSpacing: "0.3em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
          {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={caps}>{c.where}</E>}
          {c.footer && <E as="p" path={c.footerPath} className="block italic text-[#f3a7b5]" style={{ fontFamily: F.corm, fontSize: "3.8cqw" }}>{c.footer}</E>}
          {isList && <p className="uppercase text-[var(--t-muted)]" style={caps}>{c.name}</p>}
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("constellation", theme, design, CN_VARS)} className={`${FONT_VARS} cn-night ${animate ? "" : "cn-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(10,12,40,.8)] ${className}`} style={{ fontFamily: F.tenor }}>
      <style href="biz-cn" precedence="default">{CN_CSS}</style>
      {body}
    </CardFrame>
  );
}
