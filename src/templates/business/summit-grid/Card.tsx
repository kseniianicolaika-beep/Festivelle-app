"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Module, SG_CSS } from "./art";
import { SG_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit, dateParts } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const dp = dateParts(profile);
  const nameSize = fit(c.name.toUpperCase(), (wide ? 8 : tall ? 13 : 11.5) * sc, 7, 0.4);
  const label = { fontSize: wide ? "1.7cqw" : "2.1cqw", letterSpacing: "0.22em" } as const;
  const unb = { fontFamily: F.unb } as const;

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative grid h-full grid-rows-[1fr_auto] p-[7cqw]">
        <div className="flex items-start justify-between">
          <E as="p" path="texts.headline" className="block font-semibold uppercase" style={{ ...label, fontSize: "3cqw" }}>{c.headline}</E>
          <Module cells={4} className="w-[34cqw]" />
        </div>
        <div className="flex items-end justify-between border-t-[0.6cqw] border-[var(--t-ink)] pt-[2cqw]">
          <p className="font-semibold leading-[0.8] tracking-[-0.06em] text-[var(--t-accent)]" style={{ ...unb, fontSize: `${46 * sc}cqw` }}>{c.number}</p>
          <p className="max-w-[40cqw] text-right font-semibold uppercase" style={label}>{c.name}</p>
        </div>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col justify-between p-[8cqw]">
        <Module className="w-[60cqw]" />
        <div>
          <E as="p" path="texts.body" className="block font-semibold uppercase text-[var(--t-muted)]" style={label}>{c.body}</E>
          <E as="p" path="texts.hashtag" className="mt-[1cqw] block break-all font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--t-accent)]" style={{ ...unb, fontSize: `${fit(c.hashtag, 11, 9) * sc}cqw` }}>{c.hashtag}</E>
        </div>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[1fr_38%] items-center gap-[5cqw] px-[7cqw]">
        <div className="flex flex-col gap-[1.6cqw] border-l-[0.8cqw] border-[var(--t-accent)] pl-[4cqw]">
          <E as="p" path="texts.headline" className="block font-semibold uppercase leading-[0.9] tracking-[-0.04em]" style={{ ...unb, fontSize: `${fit(c.headline, 10, 8) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.7cqw", lineHeight: 1.45 }}>{c.body}</E>}
          <p className="font-semibold uppercase text-[var(--t-muted)]" style={label}>{c.name}</p>
        </div>
        <Module className="w-full" />
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col ${tall ? "gap-[5cqw] p-[8cqw]" : square ? "gap-[3cqw] p-[6cqw]" : "gap-[4cqw] p-[7cqw]"}`}>
        <div className="flex items-center justify-between border-b-[0.5cqw] border-[var(--t-ink)] pb-[1.5cqw] font-semibold uppercase" style={label}>
          {c.eyebrow ? <E path="texts.eyebrow" className="text-[var(--t-accent)]">{c.eyebrow}</E> : <span>{isList ? c.name : ""}</span>}
          <span>{c.showName ? c.line : ""}</span>
        </div>
        {isList && <Module cells={8} className={tall ? "w-[56cqw] self-end" : "w-[40cqw] self-end"} />}
        {!isList && <Module cells={square ? 8 : 16} className={square ? "w-[46cqw] self-end" : tall ? "w-[70cqw] self-end" : "w-[54cqw] self-end"} />}
        <div className="flex flex-1 flex-col justify-end gap-[2cqw]">
          {c.headline && <E as="p" path="texts.headline" className={`block font-semibold uppercase leading-[0.9] tracking-[-0.04em] ${c.showName ? "text-[var(--t-accent)]" : ""}`} style={{ ...unb, fontSize: `${fit(c.headline, c.showName ? 6 : tall ? 13 : 11, 8)}cqw` }}>{c.headline}</E>}
          {c.showName && <h2 className="font-semibold uppercase leading-[0.86] tracking-[-0.05em]" style={{ ...unb, fontSize: `${nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>}
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[70cqw]" style={{ fontSize: tall ? "3.5cqw" : "3cqw", lineHeight: 1.4 }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block" style={{ fontSize: "3cqw", lineHeight: 1.5 }}>{c.body}</E>}
          {isList && (
            <ol className="w-full border-t-[0.5cqw] border-[var(--t-ink)]">
              {c.items.map((it, i) => (
                <li key={i} className="grid grid-cols-[18cqw_1fr] items-baseline gap-[3cqw] border-b border-[var(--t-ink)]/20" style={{ padding: tall ? "2.6cqw 0" : "2cqw 0" }}>
                  {kind === "program"
                    ? <E as="p" path={`items.${i}.detail`} className="block font-semibold tabular-nums text-[var(--t-accent)]" style={{ ...unb, fontSize: tall ? "4.4cqw" : "3.6cqw" }}>{it.detail || "—"}</E>
                    : <span className="font-semibold text-[var(--t-accent)]" style={{ ...unb, fontSize: tall ? "4.4cqw" : "3.6cqw" }}>{String(i + 1).padStart(2, "0")}</span>}
                  <span>
                    <E as="p" path={`items.${i}.title`} className="block font-medium" style={{ fontSize: tall ? "4.4cqw" : "3.6cqw" }}>{it.title}</E>
                    {kind === "menu" && it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.8cqw" : "2.3cqw", marginTop: "0.5cqw" }}>{it.detail}</E>}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {(c.date || c.where || c.footer) && (
          <div className="grid grid-cols-2 gap-[3cqw] border-t-[0.5cqw] border-[var(--t-ink)] pt-[2cqw]">
            {c.date && (
              <div>
                <p className="font-semibold tabular-nums leading-none tracking-[-0.03em]" style={{ ...unb, fontSize: wide ? "4cqw" : "6cqw" }}>{dp && kind !== "event" ? `${dp.dd}.${dp.mm}.${String(dp.year).slice(2)}` : c.date}</p>
                {c.time && <p className="mt-[0.6cqw] text-[var(--t-muted)]" style={{ fontSize: "2.4cqw" }}>{c.time}</p>}
              </div>
            )}
            <div>
              {c.where && <E as="p" path={c.wherePath} className="block font-semibold leading-tight" style={{ fontSize: "2.8cqw" }}>{c.where}</E>}
              {c.footer && <E as="p" path={c.footerPath} className="mt-[0.6cqw] block text-[var(--t-muted)]" style={{ fontSize: "2.4cqw" }}>{c.footer}</E>}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("summit-grid", theme, design, SG_VARS)} className={`${FONT_VARS} sg-paper ${animate ? "" : "sg-still"} text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(35,26,28,.45)] ${className}`} style={{ fontFamily: F.montserrat }}>
      <style href="biz-sg" precedence="default">{SG_CSS}</style>
      {body}
    </CardFrame>
  );
}
