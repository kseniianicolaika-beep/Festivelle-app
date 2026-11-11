"use client";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { FONT_VARS } from "../../celebrate/_shared/fonts";
import { CardFrame, Grain, tplVars } from "../../celebrate/_shared/ui";
import { holidayText, shapeOf, fit } from "./words";
import type { Skin } from "./HolidaySite";

type Art = ComponentType<{ className?: string; style?: CSSProperties; animate?: boolean }>;

/**
 * Every paper/social piece for a holiday suite. The suite supplies its centrepiece art, an optional backdrop
 * (borders, garlands, snow) and a `still` class that freezes CSS animation for PNG export.
 */
export function HolidayCard({ skin, props, Art, backdrop, still, grain = 0.14, artScale = 1 }: { skin: Skin; props: CardProps; Art: Art; backdrop?: ReactNode; still: string; grain?: number; artScale?: number }) {
  const { kind, profile, theme, design, animate = true, className = "" } = props;
  const c = holidayText(kind, design, profile, skin.fest);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const it = skin.displayItalic ? "italic" : "";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 7 : tall ? 11 : 10) * sc, 10, 0.45);
  const rule = <div className="flex items-center justify-center gap-[2cqw] text-[var(--t-gold)]"><span className="h-px w-[10cqw] bg-current" /><span className="h-[1.1cqw] w-[1.1cqw] rotate-45 bg-current" /><span className="h-px w-[10cqw] bg-current" /></div>;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[0.8cqw]">
      {rule}
      {c.date && <p className={it} style={{ fontFamily: skin.display, fontSize: wide ? "2.8cqw" : "4cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.7cqw" : "2.2cqw", letterSpacing: "0.38em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ fontFamily: skin.script, fontSize: "5cqw" }}>{c.footer}</E>}
    </div>
  );
  const artW = (w: number) => `${w * artScale}cqw`;

  let body: ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "3.4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className={`${skin.foil} leading-none ${it}`} style={{ fontFamily: skin.display, fontSize: `${40 * sc}cqw` }}>{c.number}</p>
        <p className="text-[var(--t-accent)]" style={{ fontFamily: skin.script, fontSize: "6cqw" }}>{c.fest}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[14cqw] text-center">
        <Art animate={animate} style={{ width: artW(34) }} />
        <E as="p" path="texts.body" className="block text-[var(--t-accent)]" style={{ fontFamily: skin.script, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`${skin.foil} block break-all leading-tight ${it}`} style={{ fontFamily: skin.display, fontSize: `${fit(c.hashtag, 9, 11) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[38%_1fr] items-center gap-[4cqw] px-[9cqw]">
        <Art animate={animate} className="w-full" />
        <div className="flex flex-col items-center gap-[1.4cqw] text-center">
          <E as="p" path="texts.headline" className={`${skin.foil} block leading-none ${it}`} style={{ fontFamily: skin.display, fontSize: `${fit(c.headline, 9, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.8cqw", lineHeight: 1.4 }}>{c.body}</E>}
          {rule}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: skin.script, fontSize: "4.6cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[14cqw] py-[14cqw]" : square ? "px-[10cqw] py-[7cqw]" : "px-[14cqw] py-[11cqw]"}`}>
        <div className="flex w-full flex-col items-center gap-[1.2cqw]">
          {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", letterSpacing: "0.45em" }}>{c.eyebrow}</E>}
          {c.showName && <h2 className="leading-[1.02]" style={{ fontFamily: skin.script, fontSize: `${nameSize}cqw`, color: "var(--t-accent)" }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.showName && c.line && <p className="uppercase text-[var(--t-muted)]" style={{ fontSize: tall ? "2.4cqw" : "2cqw", letterSpacing: "0.3em" }}>{c.line}</p>}
          {c.headline && <E as="p" path="texts.headline" className={`${skin.foil} block leading-[1.02] ${it}`} style={{ fontFamily: skin.display, fontSize: `${fit(c.headline, isList ? (tall ? 12 : 10) : tall ? 15 : square ? 11 : 13, 9) * sc}cqw` }}>{c.headline}</E>}
        </div>
        {!isList && <Art animate={animate} className="drop-shadow-[0_2cqw_3cqw_rgba(0,0,0,.3)]" style={{ width: artW(tall ? 58 : square ? 26 : kind === "greeting" ? 34 : 40) }} />}
        {isList && <Art animate={animate} style={{ width: artW(tall ? 30 : 22) }} />}
        {c.lead && !square && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw]" style={{ fontSize: tall ? "3.7cqw" : "3.1cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw]" style={{ fontSize: "3.1cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((x, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "3.2cqw 0" : "2.2cqw 0", borderTop: i ? `1px solid ${skin.line}` : undefined }}>
                <E as="p" path={`items.${i}.title`} className={`block ${it}`} style={{ fontFamily: skin.display, fontSize: tall ? "5.6cqw" : "4.6cqw" }}>{x.title}</E>
                {x.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "3.2cqw" : "2.7cqw", marginTop: "0.6cqw" }}>{x.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        {isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: skin.script, fontSize: "6cqw" }}>{c.name}</p>}
        <div className="w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars(skin.id, theme, design, skin.vars)} className={`${FONT_VARS} ${skin.rootClass} ${animate ? "" : still} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.6)] ${className}`} style={{ fontFamily: skin.body }}>
      <style href={skin.cssHref} precedence="default">{skin.css}</style>
      {grain > 0 && <Grain opacity={grain} blend="overlay" freq={1} />}
      {backdrop}
      {body}
    </CardFrame>
  );
}
