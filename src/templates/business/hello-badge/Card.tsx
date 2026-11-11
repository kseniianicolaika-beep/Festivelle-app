"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { Strap, Coffee, HB_CSS } from "./art";
import { HB_VARS } from "./Site";
import { FONT_VARS, F } from "../../celebrate/_shared/fonts";
import { CardFrame, tplVars } from "../../celebrate/_shared/ui";
import { bizText, shapeOf, fit, words } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = bizText(kind, design, profile);
  const L = words(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const nameSize = fit(c.name, (wide ? 8 : tall ? 12 : 11) * sc, 9, 0.45);
  const lbl = { fontSize: wide ? "1.8cqw" : "2.3cqw", letterSpacing: "0.22em" } as const;

  const badge = (w: string) => (
    <div className="flex flex-col items-center" style={{ width: w }}>
      <Strap className="h-[14cqw] w-[30%]" />
      <div className={`hb-card -mt-[0.5cqw] w-full overflow-hidden rounded-[3cqw] ${animate ? "hb-swing" : ""}`}>
        <div className="mx-auto mt-[1.4cqw] h-[1.4cqw] w-[14%] rounded-full bg-[#e3e6dd]" />
        <div className="mt-[1.4cqw] bg-[var(--t-accent)] px-[4cqw] py-[2.4cqw] text-left text-[#fffdf8]">
          <p className="font-bold leading-none tracking-[-0.02em]" style={{ fontSize: "5.4cqw" }}>{L.hello}</p>
          <p className="mt-[0.6cqw] uppercase opacity-80" style={{ fontSize: "1.8cqw", letterSpacing: "0.25em" }}>{c.line}</p>
        </div>
        <div className="px-[4cqw] pb-[3.4cqw] pt-[2.4cqw] text-left">
          <h2 className="font-semibold leading-[0.95]" style={{ fontFamily: F.caveat, fontSize: `${nameSize}cqw` }}><E path="profile.partner1">{c.name}</E></h2>
        </div>
      </div>
    </div>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[2cqw] text-center">
        <E as="p" path="texts.headline" className="block font-semibold uppercase text-[var(--t-gold)]" style={{ ...lbl, fontSize: "3cqw" }}>{c.headline}</E>
        <div className="hb-card grid h-[48cqw] w-[48cqw] place-items-center rounded-full"><p className="font-bold leading-none tracking-[-0.05em] text-[var(--t-accent)]" style={{ fontSize: `${30 * sc}cqw` }}>{c.number}</p></div>
        <p className="font-semibold" style={{ fontFamily: F.caveat, fontSize: "5cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[4cqw] px-[12cqw] text-center">
        <Coffee className="w-[44cqw]" />
        <E as="p" path="texts.body" className="block font-semibold uppercase text-[var(--t-muted)]" style={lbl}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all font-bold leading-[1] tracking-[-0.03em] text-[var(--t-accent)]" style={{ fontSize: `${fit(c.hashtag, 10, 10) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[38%_1fr] items-center gap-[5cqw] px-[8cqw]">
        <Coffee className="w-full" />
        <div className="flex flex-col items-start gap-[1.6cqw]">
          <E as="p" path="texts.headline" className="block font-bold leading-[0.95] tracking-[-0.03em] text-[var(--t-accent)]" style={{ fontSize: `${fit(c.headline, 9, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.8cqw", lineHeight: 1.45 }}>{c.body}</E>}
          <p className="font-semibold" style={{ fontFamily: F.caveat, fontSize: "4.4cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[10cqw] py-[10cqw]" : square ? "px-[8cqw] py-[6cqw]" : "px-[10cqw] py-[7cqw]"}`}>
        {c.eyebrow ? <E as="p" path="texts.eyebrow" className="block font-semibold uppercase text-[var(--t-accent)]" style={lbl}>{c.eyebrow}</E> : <span />}
        {c.showName ? badge(tall ? "70cqw" : square ? "50cqw" : "64cqw") : (
          <div className="flex w-full flex-col items-center gap-[2cqw]">
            {c.headline && <E as="p" path="texts.headline" className="block font-bold leading-none tracking-[-0.03em] text-[var(--t-accent)]" style={{ fontSize: `${fit(c.headline, tall ? 12 : 10, 9)}cqw` }}>{c.headline}</E>}
            {isList && (
              <ol className="mt-[1cqw] grid w-full gap-[1.6cqw]">
                {c.items.map((it, i) => (
                  <li key={i} className="hb-card flex items-center gap-[3cqw] rounded-[2.4cqw] text-left" style={{ padding: tall ? "2.6cqw 3.4cqw" : "2cqw 3cqw" }}>
                    {kind === "program" && <E as="span" path={`items.${i}.detail`} className="shrink-0 rounded-full bg-[#eef1ea] font-semibold tabular-nums text-[var(--t-gold)]" style={{ fontSize: tall ? "3cqw" : "2.6cqw", padding: "0.8cqw 2cqw" }}>{it.detail || "—"}</E>}
                    <span className="flex-1">
                      <E as="p" path={`items.${i}.title`} className="block font-semibold" style={{ fontSize: tall ? "4cqw" : "3.4cqw" }}>{it.title}</E>
                      {kind === "menu" && it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: tall ? "2.7cqw" : "2.3cqw" }}>{it.detail}</E>}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw]" style={{ fontSize: "3.1cqw", lineHeight: 1.5 }}>{c.body}</E>}
          </div>
        )}
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[68cqw] font-medium" style={{ fontSize: tall ? "3.6cqw" : "3.1cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        <div className="flex flex-wrap justify-center gap-[1.6cqw]">
          {c.date && <span className="hb-card rounded-full font-semibold" style={{ fontSize: wide ? "2cqw" : "2.5cqw", padding: "1.2cqw 3cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</span>}
          {c.where && <E path={c.wherePath} className="hb-card rounded-full font-semibold" style={{ fontSize: wide ? "2cqw" : "2.5cqw", padding: "1.2cqw 3cqw" }}>{c.where}</E>}
          {isList && <span className="font-semibold" style={{ fontFamily: F.caveat, fontSize: "4.4cqw" }}>{c.name}</span>}
        </div>
        {c.footer && <E as="p" path={c.footerPath} className="block font-semibold" style={{ fontFamily: F.caveat, fontSize: "4.6cqw" }}>{c.footer}</E>}
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("hello-badge", theme, design, HB_VARS)} className={`${FONT_VARS} hb-sage ${animate ? "hb-steam" : "hb-still"} text-[var(--t-ink)] shadow-[0_40px_80px_-40px_rgba(38,51,42,.4)] ${className}`} style={{ fontFamily: F.brico }}>
      <style href="biz-hb" precedence="default">{HB_CSS}</style>
      {body}
    </CardFrame>
  );
}
