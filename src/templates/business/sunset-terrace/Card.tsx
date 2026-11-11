"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { SunSea, Palm, Balustrade, ST_CSS } from "./art";
import { ST_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, Grain, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 9 : tall ? 15 : 13) * sc, 7, 0.42);
  const small = { fontSize: wide ? "1.8cqw" : "2.3cqw", letterSpacing: "0.32em" } as const;

  const scene = (w: string) => (
    <div className="relative mx-auto" style={{ width: w }}>
      <SunSea className="w-full" />
      <div className="absolute bottom-[26%] left-[-3%] w-[20%]"><Palm className="w-full" /></div>
      <div className="absolute bottom-[26%] right-[3%] w-[14%]"><Palm flip className="w-full" /></div>
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <E as="p" path="texts.headline" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "3.2cqw", letterSpacing: "0.4em" }}>{c.headline}</E>
        <p className="st-grad leading-none tracking-[-0.04em]" style={{ fontFamily: F.fraun, fontSize: `${44 * sc}cqw` }}>{c.number}</p>
        <Balustrade className="mt-[2cqw] h-[6cqw] w-[56cqw]" />
        <p className="mt-[2cqw] italic" style={{ fontFamily: F.fraun, fontSize: "4.4cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[4cqw] px-[12cqw] text-center">
        {scene("62cqw")}
        <E as="p" path="texts.body" className="block uppercase text-[var(--t-muted)]" style={small}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="st-grad block break-all leading-[1] tracking-[-0.02em]" style={{ fontFamily: F.fraun, fontSize: `${fit(c.hashtag, 11, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[42%_1fr] items-center gap-[5cqw] px-[8cqw]">
        {scene("100%")}
        <div className="flex flex-col items-start gap-[1.6cqw]">
          <E as="p" path="texts.headline" className="st-grad block leading-[0.9] tracking-[-0.03em]" style={{ fontFamily: F.fraun, fontSize: `${fit(c.headline, 11, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.8cqw", lineHeight: 1.45 }}>{c.body}</E>}
          <p className="uppercase text-[var(--t-muted)]" style={small}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col justify-between ${tall ? "px-[10cqw] py-[12cqw]" : square ? "px-[8cqw] py-[7cqw]" : "px-[9cqw] py-[9cqw]"}`}>
        <div className="flex items-center justify-between uppercase text-[var(--t-muted)]" style={small}>
          {c.eyebrow ? <E path="texts.eyebrow">{c.eyebrow}</E> : <span />}
          {c.date && !isList && <span>{c.date}</span>}
        </div>
        <div className="flex flex-col gap-[1.6cqw]">
          {c.headline && <E as="p" path="texts.headline" className={`block leading-[0.95] tracking-[-0.03em] ${c.showName ? "italic text-[var(--t-accent)]" : "st-grad"}`} style={{ fontFamily: F.fraun, fontSize: `${fit(c.headline, c.showName ? 7 : tall ? 15 : 12, 9)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="leading-[0.88] tracking-[-0.04em]" style={{ fontFamily: F.fraun, fontSize: `${nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.showName && c.line && <p className="st-grad italic" style={{ fontFamily: F.fraun, fontSize: tall ? "6cqw" : "5cqw", lineHeight: 1.1 }}>{c.line}</p>}
        </div>
        {!isList && scene(tall ? "80cqw" : square ? "48cqw" : "70cqw")}
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block" style={{ fontSize: tall ? "3.6cqw" : "3.1cqw", lineHeight: 1.45 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block" style={{ fontSize: "3.1cqw", lineHeight: 1.5 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="grid grid-cols-[22cqw_1fr] items-baseline gap-[3cqw]" style={{ padding: tall ? "3cqw 0" : "2.2cqw 0", borderTop: "1px solid rgba(62,36,24,.15)" }}>
                {kind === "program"
                  ? <E as="p" path={`items.${i}.detail`} className="st-grad block tabular-nums" style={{ fontFamily: F.fraun, fontSize: tall ? "5.4cqw" : "4.4cqw" }}>{it.detail || "—"}</E>
                  : <span className="st-grad" style={{ fontFamily: F.fraun, fontSize: tall ? "5.4cqw" : "4.4cqw" }}>{String(i + 1).padStart(2, "0")}</span>}
                <span>
                  <E as="p" path={`items.${i}.title`} className="block tracking-[-0.01em]" style={{ fontFamily: F.fraun, fontSize: tall ? "5.2cqw" : "4.2cqw" }}>{it.title}</E>
                  {kind === "menu" && it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.9cqw" : "2.4cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
                </span>
              </li>
            ))}
          </ol>
        )}
        <div className="flex flex-col gap-[0.6cqw]">
          <Balustrade className="mb-[2cqw] h-[4.5cqw] w-full opacity-90" />
          {c.date && isList === false && c.time && <p style={{ fontFamily: F.fraun, fontSize: "4cqw" }}>{c.time}</p>}
          {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={small}>{c.where}</E>}
          {isList && <p className="uppercase text-[var(--t-muted)]" style={small}>{c.name}</p>}
          {c.footer && <E as="p" path={c.footerPath} className="block italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: "3.6cqw" }}>{c.footer}</E>}
        </div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("sunset-terrace", theme, design, ST_VARS)} className={`${FONT_VARS} st-paper ${animate ? "" : "st-still"} text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(62,36,24,.5)] ${className}`} style={{ fontFamily: F.brico }}>
      <style href="biz-st" precedence="default">{ST_CSS}</style>
      <Grain opacity={0.08} freq={0.9} />
      {body}
    </CardFrame>
  );
}
