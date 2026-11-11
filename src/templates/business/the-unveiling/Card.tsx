"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Plinth, UV_CSS } from "./art";
import { UV_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, Grain, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "uv-shine" : "";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 8 : tall ? 13.5 : 12) * sc, 8, 0.45);
  const caps = { fontSize: wide ? "1.7cqw" : "2.1cqw", letterSpacing: "0.45em" } as const;
  const bod = { fontFamily: F.bodoni } as const;
  // Post / save / story reveal the object; the invitation keeps it veiled — the point is to come and see.
  const veiled = kind === "invite" || kind === "save" || kind === "event";

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-gold)]" style={{ ...caps, fontSize: "3cqw" }}>{c.headline}</E>
        <p className={`uv-gold ${shine} italic leading-none`} style={{ ...bod, fontSize: `${42 * sc}cqw` }}>{c.number}</p>
        <p className="italic" style={{ fontFamily: F.corm, fontSize: "4.6cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[12cqw] text-center">
        <Plinth veiled={false} className="w-[40cqw]" />
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-gold)]" style={caps}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`uv-gold ${shine} block break-all italic leading-tight`} style={{ ...bod, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[34%_1fr] items-center gap-[5cqw] px-[8cqw]">
        <Plinth veiled={false} className="w-full" />
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`uv-gold ${shine} block italic leading-none`} style={{ ...bod, fontSize: `${fit(c.headline, 10, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontFamily: F.corm, fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          <p className="uppercase text-[var(--t-gold)]" style={caps}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[12cqw] py-[13cqw]" : square ? "px-[10cqw] py-[8cqw]" : "px-[12cqw] py-[10cqw]"}`}>
        <div className="flex w-full flex-col items-center gap-[1.2cqw]">
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-gold)]" style={caps}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className={`block italic leading-[1.02] ${c.showName ? "text-[var(--t-muted)]" : `uv-gold ${shine}`}`} style={{ ...bod, fontSize: `${fit(c.headline, c.showName ? 6 : tall ? 13 : 11, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="italic leading-[0.95]" style={{ ...bod, fontSize: `${nameSize}cqw` }}><E path="profile.partner1" className={`uv-gold ${shine}`}>{c.name}</E></h2>}
          {c.showName && c.line && <p className="italic text-[var(--t-muted)]" style={{ fontFamily: F.corm, fontSize: tall ? "5cqw" : "4.2cqw" }}>{c.line}</p>}
        </div>
        {!isList && <Plinth veiled={veiled} style={{ width: tall ? "58cqw" : square ? "30cqw" : "40cqw" }} />}
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw] italic" style={{ fontFamily: F.corm, fontSize: tall ? "4cqw" : "3.4cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw] italic" style={{ fontFamily: F.corm, fontSize: "3.3cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "3cqw 0" : "2.2cqw 0", borderTop: i ? "1px solid rgba(184,149,90,.35)" : undefined }}>
                <E as="p" path={`items.${i}.title`} className="block italic" style={{ ...bod, fontSize: tall ? "5.6cqw" : "4.6cqw" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.9cqw" : "2.5cqw", marginTop: "0.5cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-col items-center gap-[0.8cqw]">
          {c.date && <p className="uppercase" style={{ ...caps, fontSize: wide ? "2cqw" : "2.6cqw", letterSpacing: "0.3em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
          {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={caps}>{c.where}</E>}
          {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-accent)]" style={{ ...bod, fontSize: "3.6cqw" }}>{c.footer}</E>}
          {isList && <p className="uppercase text-[var(--t-gold)]" style={caps}>{c.name}</p>}
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("the-unveiling", theme, design, UV_VARS)} className={`${FONT_VARS} uv-ivory ${animate ? "uv-float" : "uv-still"} text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(125,29,58,.4)] ${className}`} style={{ fontFamily: F.tenor }}>
      <style href="biz-uv" precedence="default">{UV_CSS}</style>
      <Grain opacity={0.07} freq={0.9} />
      {body}
    </CardFrame>
  );
}
