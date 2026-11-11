"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Eclipse, Stars, EC_CSS } from "./art";
import { EC_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const shine = animate ? "ec-shine" : "";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 8 : tall ? 13 : 11.5) * sc, 8, 0.45);
  const caps = { fontSize: wide ? "1.7cqw" : "2.1cqw", letterSpacing: "0.5em" } as const;
  const bod = { fontFamily: F.bodoni } as const;

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <div className="relative grid w-[64cqw] place-items-center">
          <Eclipse className="w-full" />
          <p className={`ec-gold ${shine} absolute italic leading-none`} style={{ ...bod, fontSize: `${26 * sc}cqw` }}>{c.number}</p>
        </div>
        <E as="p" path="texts.headline" className="mt-[2cqw] block uppercase text-[var(--t-muted)]" style={{ ...caps, fontSize: "2.8cqw" }}>{c.headline}</E>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[4cqw] px-[12cqw] text-center">
        <Eclipse className="w-[48cqw]" />
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`ec-gold ${shine} block break-all italic leading-tight`} style={{ ...bod, fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[36%_1fr] items-center gap-[5cqw] px-[8cqw]">
        <Eclipse className="w-full" />
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`ec-gold ${shine} block italic leading-none`} style={{ ...bod, fontSize: `${fit(c.headline, 10, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.7cqw", lineHeight: 1.5 }}>{c.body}</E>}
          <p className="uppercase text-[var(--t-accent)]" style={caps}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[12cqw] py-[14cqw]" : square ? "px-[10cqw] py-[8cqw]" : "px-[12cqw] py-[10cqw]"}`}>
        {c.eyebrow ? <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={caps}>{c.eyebrow}</E> : <span />}
        {!isList && <Eclipse style={{ width: tall ? "64cqw" : square ? "36cqw" : "50cqw" }} />}
        <div className="flex w-full flex-col items-center gap-[1.4cqw]">
          {c.headline && <E as="p" path="texts.headline" className={`block italic leading-[1.02] ${c.showName ? "text-[var(--t-accent)]" : `ec-gold ${shine}`}`} style={{ ...bod, fontSize: `${fit(c.headline, c.showName ? 6.5 : tall ? 13 : 11, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="italic leading-[0.95]" style={{ ...bod, fontSize: `${nameSize}cqw` }}><E path="profile.partner1" className={`ec-gold ${shine}`}>{c.name}</E></h2>}
          {c.showName && c.line && <p className="uppercase text-[var(--t-accent)]" style={{ ...caps, fontSize: tall ? "2.6cqw" : "2.2cqw" }}>{c.line}</p>}
        </div>
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw]" style={{ fontSize: tall ? "3.5cqw" : "3cqw", lineHeight: 1.5 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw]" style={{ fontSize: "3cqw", lineHeight: 1.5 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full border-l border-[var(--t-gold)]/40 pl-[5cqw] text-left">
            {c.items.map((it, i) => (
              <li key={i} className="relative" style={{ padding: tall ? "2.6cqw 0" : "2cqw 0" }}>
                <span className="absolute top-[45%] h-[1.6cqw] w-[1.6cqw] rounded-full bg-[var(--t-gold)]" style={{ left: "-5.8cqw" }} />
                <E as="p" path={`items.${i}.title`} className="block italic" style={{ ...bod, fontSize: tall ? "5cqw" : "4.2cqw" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: tall ? "2.4cqw" : "2cqw", letterSpacing: "0.3em", marginTop: "0.4cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-col items-center gap-[0.8cqw]">
          {c.date && <p className="uppercase" style={{ ...caps, fontSize: wide ? "2cqw" : "2.6cqw", letterSpacing: "0.35em" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
          {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={caps}>{c.where}</E>}
          {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-accent)]" style={{ ...bod, fontSize: "3.6cqw" }}>{c.footer}</E>}
          {isList && <p className="uppercase text-[var(--t-accent)]" style={caps}>{c.name}</p>}
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("eclipse-launch", theme, design, EC_VARS)} className={`${FONT_VARS} ec-night ${animate ? "ec-pulse" : "ec-still"} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.85)] ${className}`} style={{ fontFamily: F.tenor }}>
      <style href="biz-ec" precedence="default">{EC_CSS}</style>
      <Stars n={50} />
      {body}
    </CardFrame>
  );
}
