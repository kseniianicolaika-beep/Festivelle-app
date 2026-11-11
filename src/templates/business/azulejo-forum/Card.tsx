"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Tile, Border, AZ_CSS } from "./art";
import { AZ_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 7.5 : tall ? 11.5 : 10) * sc, 8, 0.45);
  const caps = { fontSize: wide ? "1.7cqw" : "2.2cqw", letterSpacing: "0.35em" } as const;
  const prata = { fontFamily: F.prata } as const;

  // A tile frame: a row of tiles top and bottom, borders down the sides.
  const tiles = (n: number) => <div className="flex">{Array.from({ length: n }, (_, i) => <Tile key={i} variant={i} className="aspect-square flex-1" />)}</div>;
  const frame = !wide && (
    <>
      <div className="absolute inset-x-0 top-0">{tiles(square ? 5 : 6)}</div>
      <div className="absolute inset-x-0 bottom-0">{tiles(square ? 5 : 6)}</div>
    </>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "3cqw" }}>{c.headline}</E>
        <p className="leading-none text-[var(--t-accent)]" style={{ ...prata, fontSize: `${34 * sc}cqw` }}>{c.number}</p>
        <p className="italic" style={{ fontFamily: F.corm, fontSize: "4.4cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[12cqw] text-center">
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.body}</E>
        <div className="az-plaque px-[5cqw] py-[4cqw]"><E as="p" path="texts.hashtag" className="block break-all leading-tight text-[var(--t-accent)]" style={{ ...prata, fontSize: `${fit(c.hashtag, 8.5, 10) * sc}cqw` }}>{c.hashtag}</E></div>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[32%_1fr] items-stretch">
        <div className="grid grid-cols-2 content-center">{Array.from({ length: 6 }, (_, i) => <Tile key={i} variant={i} className="aspect-square w-full" />)}</div>
        <div className="flex flex-col items-center justify-center gap-[1.6cqw] px-[6cqw] text-center">
          <E as="p" path="texts.headline" className="block leading-none text-[var(--t-accent)]" style={{ ...prata, fontSize: `${fit(c.headline, 8, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block italic" style={{ fontFamily: F.corm, fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          <Border className="h-[1.6cqw] w-[24cqw]" />
          <p className="uppercase text-[var(--t-muted)]" style={caps}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    const pad = square ? "py-[23cqw] px-[9cqw]" : tall ? "py-[22cqw] px-[9cqw]" : "py-[20cqw] px-[9cqw]";
    body = (
      <div className={`relative flex h-full flex-col items-center justify-center gap-[3cqw] text-center ${pad}`}>
        <div className={`az-plaque flex w-full flex-col items-center gap-[1.4cqw] ${square ? "px-[5cqw] py-[4cqw]" : "px-[6cqw] py-[6cqw]"}`}>
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className="block leading-[1.05] text-[var(--t-accent)]" style={{ ...prata, fontSize: `${fit(c.headline, c.showName ? 6 : tall ? 10 : 9, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="leading-[1.02]" style={{ ...prata, fontSize: `${nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.showName && c.line && <p className="italic text-[var(--t-accent)]" style={{ fontFamily: F.corm, fontSize: tall ? "5cqw" : "4.2cqw" }}>{c.line}</p>}
          {isList && (
            <ol className="mt-[1cqw] w-full text-left">
              {c.items.map((it, i) => (
                <li key={i} className="flex items-baseline gap-[2.4cqw] border-t border-[#c9d3e6]" style={{ padding: tall ? "2.4cqw 0" : "1.8cqw 0" }}>
                  <span className="text-[var(--t-accent)]" style={{ ...prata, fontSize: tall ? "4cqw" : "3.4cqw" }}>{i + 1}</span>
                  <span className="flex-1">
                    <E as="p" path={`items.${i}.title`} className="block" style={{ ...prata, fontSize: tall ? "4cqw" : "3.4cqw" }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.6cqw" : "2.2cqw", marginTop: "0.4cqw" }}>{it.detail}</E>}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[70cqw] italic" style={{ fontFamily: F.corm, fontSize: tall ? "4cqw" : "3.4cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[70cqw] italic" style={{ fontFamily: F.corm, fontSize: "3.3cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {(c.date || c.where) && (
          <div className="flex flex-col items-center gap-[0.8cqw]">
            {c.date && <p className="uppercase" style={{ ...caps, fontSize: wide ? "2cqw" : "2.8cqw", letterSpacing: "0.25em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
            {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={caps}>{c.where}</E>}
          </div>
        )}
        {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-accent)]" style={{ fontFamily: F.corm, fontSize: "3.6cqw" }}>{c.footer}</E>}
        {isList && <p className="uppercase text-[var(--t-muted)]" style={caps}>{c.name}</p>}
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("azulejo-forum", theme, design, AZ_VARS)} className={`${FONT_VARS} az-paper ${animate ? "" : "az-still"} text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(19,41,75,.45)] ${className}`} style={{ fontFamily: F.tenor }}>
      <style href="biz-az" precedence="default">{AZ_CSS}</style>
      {frame}
      {body}
    </CardFrame>
  );
}
