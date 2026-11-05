"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CoupeTower, Corner, CN_CSS } from "./art";
import { CN_VARS } from "./Site";
import { FONT_VARS, F } from "../_shared/fonts";
import { CardFrame, Grain, tplVars, roman } from "../_shared/ui";
import { cardText, shapeOf, fit } from "../_shared/words";

export default function Card({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const shine = animate ? "cn-shine" : "";
  const wide = shape === "wide";
  const nameSize = fit(c.name, (wide ? 9 : shape === "tall" ? 15 : 13.5) * sc, 7);
  const age = profile.age;

  const frame = (
    <>
      <div className="absolute inset-[3.2cqw] border border-[var(--t-gold)]/60" />
      <div className="absolute inset-[4.6cqw] border border-[var(--t-gold)]/25" />
      <Corner className="absolute left-[2.9cqw] top-[2.9cqw] w-[9cqw]" />
      <Corner className="absolute right-[2.9cqw] top-[2.9cqw] w-[9cqw] rotate-90" />
      <Corner className="absolute bottom-[2.9cqw] right-[2.9cqw] w-[9cqw] rotate-180" />
      <Corner className="absolute bottom-[2.9cqw] left-[2.9cqw] w-[9cqw] -rotate-90" />
    </>
  );

  const eyebrow = c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase text-[var(--t-muted)]" style={{ fontSize: wide ? "1.7cqw" : "2.3cqw", letterSpacing: "0.5em" }}>{c.eyebrow}</E>;
  const nameEl = (size = nameSize) => (
    <h2 className="relative italic leading-[0.95]" style={{ fontFamily: F.bodoni, fontSize: `${size}cqw` }}>
      <E path="profile.partner1" className={`cn-foil ${shine}`}>{c.name}</E>
    </h2>
  );
  const line = c.line && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: wide ? "4.4cqw" : "6.4cqw", lineHeight: 1.1 }}>{c.line}</p>;
  const rule = <div className="flex items-center justify-center gap-[2cqw] text-[var(--t-gold)]"><span className="h-px w-[9cqw] bg-current opacity-70" /><span className="h-[1.1cqw] w-[1.1cqw] rotate-45 bg-current" /><span className="h-px w-[9cqw] bg-current opacity-70" /></div>;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[1cqw]">
      {rule}
      {c.date && <p className="italic" style={{ fontFamily: F.bodoni, fontSize: wide ? "3cqw" : "4.4cqw" }}>{c.date}{c.time && <span className="text-[var(--t-muted)]"> · {c.time}</span>}</p>}
      {c.where && <E as="p" path={c.wherePath} className="block uppercase text-[var(--t-muted)]" style={{ fontSize: "2.1cqw", letterSpacing: "0.42em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5cqw", marginTop: "0.6cqw" }}>{c.footer}</E>}
    </div>
  );
  const ageBg = age && c.showName && (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none leading-none" style={{ fontFamily: F.bodoni, fontSize: shape === "tall" ? "96cqw" : wide ? "52cqw" : "80cqw", color: "transparent", WebkitTextStroke: "0.25cqw rgba(216,180,106,.22)" }}>{age}</span>
  );

  const list = c.items.length > 0 && (
    <ol className="w-full" style={{ marginTop: "2cqw" }}>
      {c.items.map((it, i) => (
        <li key={i} className="flex flex-col items-center text-center" style={{ padding: shape === "tall" ? "3.2cqw 0" : "2.2cqw 0", borderTop: i ? "1px solid rgba(216,180,106,.22)" : undefined }}>
          <span className="italic text-[var(--t-gold)]" style={{ fontFamily: F.bodoni, fontSize: "2.6cqw" }}>{roman(i + 1)}</span>
          <E as="p" path={`items.${i}.title`} className="block italic" style={{ fontFamily: F.bodoni, fontSize: shape === "tall" ? "6.4cqw" : "5cqw", lineHeight: 1.1 }}>{it.title}</E>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: shape === "tall" ? "3.2cqw" : "2.5cqw", marginTop: "0.8cqw", letterSpacing: "0.04em" }}>{it.detail}</E>}
        </li>
      ))}
    </ol>
  );

  let body: React.ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <CoupeTower className="w-[20cqw]" stream={false} />
        <E as="p" path="texts.headline" className="mt-[2cqw] block uppercase text-[var(--t-muted)]" style={{ fontSize: "3cqw", letterSpacing: "0.6em" }}>{c.headline}</E>
        <p className={`cn-foil ${shine} italic leading-none`} style={{ fontFamily: F.bodoni, fontSize: `${38 * sc}cqw` }}>{c.number}</p>
        <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[12cqw] text-center">
        <CoupeTower className="w-[34cqw]" />
        <E as="p" path="texts.body" className="block text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`cn-foil ${shine} block break-all italic leading-tight`} style={{ fontFamily: F.bodoni, fontSize: `${fit(c.hashtag, 11, 10) * sc}cqw` }}>{c.hashtag}</E>
        {rule}
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[38%_1fr] items-center px-[8cqw]">
        <div className="relative flex items-center justify-center"><CoupeTower className="w-[30cqw]" /></div>
        <div className="flex flex-col items-center gap-[1.6cqw] text-center">
          <E as="p" path="texts.headline" className={`cn-foil ${shine} block italic leading-none`} style={{ fontFamily: F.bodoni, fontSize: `${11 * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block max-w-[44cqw] italic text-[var(--t-ink)]/85" style={{ fontFamily: F.bodoni, fontSize: "2.8cqw", lineHeight: 1.45 }}>{c.body}</E>}
          {rule}
          <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    const isList = kind === "menu" || kind === "program";
    const towerW = shape === "tall" ? (isList ? 30 : 56) : shape === "square" ? 26 : isList ? 22 : 36;
    body = (
      <div className={`relative flex h-full flex-col items-center text-center ${shape === "tall" ? "justify-between px-[11cqw] py-[14cqw]" : "justify-between px-[11cqw] py-[10cqw]"}`}>
        {ageBg}
        <CoupeTower className="relative shrink-0" style={{ width: `${towerW}cqw` }} stream={!isList} filled />
        <div className="relative flex w-full flex-col items-center gap-[1.6cqw]" style={{ marginTop: "-1cqw" }}>
          {eyebrow}
          {c.headline && <E as="p" path="texts.headline" className={`${c.showName ? "" : `cn-foil ${shine}`} block italic leading-[1.02]`} style={{ fontFamily: F.bodoni, fontSize: c.showName ? `${fit(c.headline, 8, 12)}cqw` : `${(shape === "tall" ? 14 : 11) * sc}cqw`, color: c.showName ? "var(--t-accent)" : undefined }}>{c.headline}</E>}
          {c.showName && nameEl(c.headline && kind !== "greeting" ? nameSize * 0.8 : nameSize)}
          {c.showName && line}
          {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[70cqw] italic text-[var(--t-ink)]/80" style={{ fontFamily: F.bodoni, fontSize: shape === "tall" ? "4cqw" : "3.3cqw", lineHeight: 1.45, marginTop: "1cqw" }}>{c.lead}</E>}
          {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[72cqw] italic text-[var(--t-ink)]/85" style={{ fontFamily: F.bodoni, fontSize: "3.4cqw", lineHeight: 1.5 }}>{c.body}</E>}
          {list}
          {!c.showName && isList && <p className="text-[var(--t-accent)]" style={{ fontFamily: F.vibes, fontSize: "5.4cqw", marginTop: "1cqw" }}>{c.name}{age ? ` · ${age}` : ""}</p>}
        </div>
        <div className="relative w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars("champagne-noir", theme, design, CN_VARS)} className={`${FONT_VARS} text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.7)] ${className}`} style={{ background: "radial-gradient(90% 60% at 50% 30%, #2a1c14 0%, #120d0c 55%, #0a0808 100%)", fontFamily: F.tenor }}>
      <style href="cel-cn" precedence="default">{CN_CSS}</style>
      <Grain opacity={0.22} blend="overlay" />
      {frame}
      {body}
    </CardFrame>
  );
}
