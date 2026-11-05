"use client";
import type { CSSProperties } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { INVOCATIONS } from "@/lib/motifs";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { archMask, archPath, ArchMark, Damask, Diya, PalaceLake, Toran, ZariBand } from "./art";
import { FACES, FONTS, GOLD } from "./faces";
import "./maharani.css";

const caps: CSSProperties = { fontFamily: "var(--wa-display)", letterSpacing: "0.3em", textTransform: "uppercase" };
const deva: CSSProperties = { fontFamily: "var(--font-rozha), var(--font-deva), var(--wa-amiri), serif" };

/** A window onto the lake palace, cut as a cusped arch with gold mouldings. */
function ArchWindow({ className = "", still, children, aspect = [300, 400], low = false }: { className?: string; still: boolean; children?: React.ReactNode; aspect?: [number, number]; low?: boolean }) {
  const [w, h] = aspect;
  return (
    <div className={`@container absolute ${className}`}>
      <div className="absolute inset-0" style={archMask(w, h)}>
        <PalaceLake className="h-full w-full" still={still} low={low} />
        <div className="absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_28%,rgba(12,4,24,.5),transparent_80%)]" />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-[-2.2cqw] h-[calc(100%+4.4cqw)] w-[calc(100%+4.4cqw)] overflow-visible" aria-hidden>
        <path d={archPath(w * 0.04, h * 0.03, w * 0.92, h * 0.97, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        <path d={archPath(0, 0, w, h, 4)} fill="none" stroke="var(--t-gold)" strokeWidth=".7" opacity=".6" vectorEffect="non-scaling-stroke" />
      </svg>
      {children}
    </div>
  );
}

export default function MaharaniCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const dp = dateParts(profile.date, langOf(profile));
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const inv = design.invocation ? INVOCATIONS[design.invocation] : null;
  const longest = a.length >= b.length ? a : b;
  const both = b ? `${a} & ${b}` : a;

  const names = (size: number, opts: { row?: boolean } = {}) => {
    const s = fit(longest, size * sc, 6);
    return (
      <div data-in className={`mah-names flex ${opts.row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.4cqw]" : "flex-col items-center"} text-center leading-[1.04]`} style={ff.display}>
        <E path="profile.partner1" className="wa-foil block tracking-[0.07em]" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block text-[#ffd98a]" style={{ fontFamily: "var(--wa-vibes), cursive", fontSize: `${s * 0.66}cqw`, lineHeight: 1.1 }}>&amp;</span>}
        {b && <E path="profile.partner2" className="wa-foil block tracking-[0.07em]" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const invocation = (size = 3.4) => inv ? <p data-in dir="auto" className="text-[var(--t-gold)]" style={{ ...deva, fontSize: `${size}cqw` }}>{inv.text}</p> : null;
  const where = (size = 3.4) => c.where ? <E as="p" path={c.wherePath} className="block italic" style={{ fontSize: `${size}cqw`, color: "var(--t-muted)" }}>{c.where}</E> : null;
  const footer = (size = 5.2) => c.footer ? <E as="p" path={c.footerPath} className="block text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${size}cqw` }}>{c.footer}</E> : null;
  const diyas = (n: number, w: number, cls = "") => <div className={`flex items-end justify-center ${cls}`} style={{ gap: `${w * 0.5}cqw` }}>{Array.from({ length: n }, (_, i) => <Diya key={i} still={still} delay={i * 0.35} className="" />).map((d, i) => <div key={i} style={{ width: `${i === (n - 1) / 2 ? w * 1.25 : w}cqw` }}>{d}</div>)}</div>;
  const frame = (
    <>
      <div className="absolute inset-0" style={{ background: "radial-gradient(90% 70% at 50% 40%, color-mix(in oklab, var(--t-bg) 72%, #a3402a), var(--t-bg) 72%, color-mix(in oklab, var(--t-bg) 70%, #000))" }} />
      <Damask className="absolute inset-0" opacity={0.16} />
      <div className="pointer-events-none absolute inset-[2.6cqw] border border-[var(--t-gold)]/70" />
      <div className="pointer-events-none absolute inset-[3.6cqw] border border-[var(--t-gold)]/30" />
    </>
  );
  const root = (cls: string, children: React.ReactNode) => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="maharani" faces={FACES} fonts={FONTS} animate={animate} style={{ ...GOLD, ...ff.body }} className={`mah wa-paper wa-paper-dark bg-[var(--t-bg)] text-[var(--t-ink)] ${cls} ${className ?? ""}`}>
      {frame}
      {children}
    </CardRoot>
  );
  const toran = (top = "3.6cqw", inset = "3.6cqw") => <div className="absolute z-10" style={{ top, left: inset, right: inset }}><Toran className="w-full" w={700} swags={4} still={still} /></div>;

  // ── Thank-you (landscape): palace window + note ──
  if (shape === "wide") {
    return root("", <>
      <ArchWindow className="left-[7%] top-[9%] h-[82%] aspect-[3/4]" still={still} />
      <div className="absolute inset-y-[10%] right-[6%] flex w-[39%] flex-col items-center justify-center text-center" style={{ gap: "2cqw" }}>
        <ArchMark className="w-[5cqw] text-[var(--t-gold)]" />
        <E as="p" path="texts.headline" className="wa-foil block leading-[1.1]" style={{ ...ff.script, fontSize: `${9 * sc}cqw` }}>{c.headline}</E>
        <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "2.8cqw", color: "var(--t-muted)" }}>{c.body}</E>
        <div className="w-[22cqw] opacity-80"><ZariBand /></div>
        <p style={{ ...caps, fontSize: "2.2cqw" }}>{both}</p>
      </div>
    </>);
  }

  // ── Table number ──
  if (kind === "table") {
    return root("", <>
      {toran("3.6cqw", "3.6cqw")}
      <div className="absolute left-1/2 top-[22%] aspect-[3/4] w-[44%] -translate-x-1/2">
        <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={archPath(0, 0, 300, 400, 4)} fill="rgba(0,0,0,.18)" stroke="var(--t-gold)" strokeWidth="2.4" />
          <path d={archPath(16, 16, 268, 384, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="1" opacity=".5" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[6cqw]">
          <E as="p" path="texts.headline" className="block" style={{ ...caps, fontSize: "2.4cqw", color: "var(--t-muted)" }}>{c.headline}</E>
          <p className="wa-foil font-light leading-none" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: `${21 * sc}cqw` }}>{c.number}</p>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-[8%] text-center text-[var(--t-gold)]" style={{ ...ff.script, fontSize: "5cqw" }}>{both}</p>
    </>);
  }

  // ── Window kinds: save, story, post, welcome, hashtag ──
  if (kind === "save" || kind === "story" || kind === "post" || kind === "welcome" || kind === "hashtag") {
    const tall = shape === "tall";
    const sq = shape === "square";
    const win = tall ? "left-[12%] right-[12%] top-[12%] h-[56%]" : sq ? "left-1/2 top-[13%] h-[74%] aspect-[3/4] -translate-x-1/2" : kind === "save" ? "left-1/2 top-[11%] h-[50%] aspect-[3/4] -translate-x-1/2" : "left-[16%] right-[16%] top-[11%] h-[52%]";
    const nameIn = tall || sq || kind === "welcome";
    return root("", <>
      {toran("3.6cqw", "3.6cqw")}
      <ArchWindow className={win} still={still} low={nameIn && kind !== "hashtag"}>
        {nameIn && kind !== "hashtag" && (
          <div className="absolute inset-x-[6%] top-[19%] flex flex-col items-center text-center" style={{ gap: "2.4cqw" }}>
            {invocation(4.4)}
            {c.eyebrow && <E as="p" path="texts.eyebrow" className="block text-[#f6e7c8]/90" style={{ ...caps, fontSize: "3.6cqw" }}>{c.eyebrow}</E>}
            {names(12.5)}
          </div>
        )}
      </ArchWindow>
      <div className={`absolute inset-x-[8%] flex flex-col items-center text-center ${tall ? "top-[71%]" : sq ? "hidden" : "top-[65%]"}`} style={{ gap: tall ? "2.6cqw" : "2cqw" }}>
        {kind === "hashtag" ? (
          <>
            <p style={{ ...ff.script, fontSize: "6cqw", color: "var(--t-gold)" }}>{c.body}</p>
            <E as="p" path="texts.hashtag" className="wa-foil block break-all leading-tight" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 7.4, 14) * sc}cqw`, letterSpacing: "0.04em" }}>{c.hashtag}</E>
            <p style={{ ...caps, fontSize: "2.2cqw", color: "var(--t-muted)" }}>{both}</p>
          </>
        ) : kind === "save" ? (
          <>
            {c.eyebrow && <E as="p" path="texts.eyebrow" className="block" style={{ ...caps, fontSize: "2.6cqw", color: "var(--t-gold)" }}>{c.eyebrow}</E>}
            {names(8.6, { row: true })}
            {dp && <p className="wa-foil font-light" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "7cqw", letterSpacing: "0.08em" }}>{dp.dd} · {dp.mm} · {dp.year}</p>}
            {where(3)}
          </>
        ) : (
          <>
            {c.date && <p style={{ ...caps, fontSize: tall ? "3cqw" : "2.6cqw", color: "var(--t-gold)" }}>{c.date}</p>}
            {where(tall ? 4 : 3.2)}
            {tall && footer(6)}
          </>
        )}
      </div>
      {(tall || kind === "welcome") && <div className="absolute inset-x-0 bottom-[3.8cqw]">{diyas(5, tall ? 9 : 7)}</div>}
    </>);
  }

  // ── List pieces: program & menu ──
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root("", <>
      {toran("3.6cqw", "3.6cqw")}
      <div className={`absolute inset-x-[10%] flex flex-col items-center text-center ${tall ? "top-[14%] bottom-[9%]" : "top-[20%] bottom-[10%]"} justify-between`}>
        <div data-in className="flex flex-col items-center" style={{ gap: "1.6cqw" }}>
          <ArchMark className="w-[7cqw] text-[var(--t-gold)]" />
          <E as="p" path="texts.headline" className="wa-foil block leading-[1.1]" style={{ ...ff.display, fontSize: `${(tall ? 8.4 : 6.4) * sc}cqw`, letterSpacing: "0.12em" }}>{c.headline}</E>
          <p style={{ ...ff.script, fontSize: `${tall ? 6.4 : 5}cqw`, color: "var(--t-gold)" }}>{both}</p>
        </div>
        <ul data-in className="w-full">
          {c.items.map((it, i) => (
            <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3 : 1.8}cqw 0` }}>
              {i > 0 && <span className="mb-[2.4cqw] block text-[var(--t-gold)]" style={{ fontSize: "2.4cqw" }}>◆</span>}
              <E as="p" path={`items.${i}.title`} className="block" style={{ ...caps, fontSize: `${tall ? 3.6 : 2.8}cqw`, color: "var(--t-gold)" }}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic" style={{ fontSize: `${tall ? 4.6 : 3.4}cqw`, color: "var(--t-ink)", marginTop: "1cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ul>
        {diyas(3, tall ? 10 : 7)}
      </div>
    </>);
  }

  // ── Portrait paper: invite, event, greeting ──
  return root("", <>
    {toran("3.6cqw", "3.6cqw")}
    <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute left-[9%] right-[9%] top-[13%] bottom-[11%] h-[76%] w-[82%]" aria-hidden>
      <path d={archPath(0, 0, 300, 400, 5)} fill="rgba(0,0,0,.16)" stroke="var(--t-gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <path d={archPath(9, 9, 282, 391, 5)} fill="none" stroke="var(--t-gold)" strokeWidth=".7" opacity=".5" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="absolute inset-x-[15%] top-[27%] bottom-[18%] flex flex-col items-center justify-between text-center">
      <div className="flex flex-col items-center" style={{ gap: "1.8cqw" }}>
        {invocation()}
        {kind === "event" ? (
          <>
            <p data-in style={{ ...caps, fontSize: "2.1cqw", color: "var(--t-muted)" }}>{c.lead}</p>
            <E as="p" path="texts.headline" className="block leading-none text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${10 * sc}cqw` }}>{c.headline}</E>
          </>
        ) : c.eyebrow ? <E as="p" path="texts.eyebrow" className="block" style={{ ...caps, fontSize: "2.2cqw", color: "var(--t-gold)" }}>{c.eyebrow}</E> : null}
      </div>
      {names(kind === "invite" ? 10.5 : 8.4, { row: kind !== "invite" })}
      {kind === "greeting" ? (
        <>
          {c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "3.5cqw", color: "var(--t-muted)" }}>{c.body}</E>}
          {footer(5.6)}
        </>
      ) : (
        <>
          {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block italic leading-snug" style={{ fontSize: "3.2cqw", color: "var(--t-muted)" }}>{c.lead}</E>}
          <div data-in className="flex flex-col items-center" style={{ gap: "1.2cqw" }}>
            <div className="w-[26cqw] opacity-80"><ZariBand /></div>
            {c.date && <p style={{ ...caps, fontSize: "2.5cqw" }}>{c.date}</p>}
            {where(3.2)}
            {footer(4.8)}
          </div>
        </>
      )}
    </div>
    <div className="absolute inset-x-0 bottom-[4.6cqw]">{diyas(3, 7.5)}</div>
  </>);
}
