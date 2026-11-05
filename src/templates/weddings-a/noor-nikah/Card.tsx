"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionOf } from "@/lib/occasions";
import { INVOCATIONS } from "@/lib/motifs";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { Crescent, DoorLeaf, GirihBand, GirihWall, khatamPath, Lantern, LightThrow, ogeeMask, ogeePath, StarRule, starPath } from "./art";
import { arabic, BRASS, FACES, FONTS, naskh } from "./faces";
import "./noor.css";

const caps: CSSProperties = { fontFamily: "var(--wa-amiri), var(--font-cormorant), serif", letterSpacing: "0.3em", textTransform: "uppercase" };

/** Ogee window onto the lamp-lit hall, doors folded open. */
function Hall({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`@container absolute ${className}`}>
      <div className="absolute inset-0 overflow-hidden" style={ogeeMask(300, 400)}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 45% at 50% 30%, #4e8a6e, #1a4a3c 55%, #082019)" }}>
          <GirihWall className="absolute inset-0" opacity={0.16} size={36} />
          <div className="absolute inset-0 opacity-30 mix-blend-screen"><LightThrow /></div>
        </div>
        <DoorLeaf side="l" className="noor-door noor-door-l" />
        <DoorLeaf side="r" className="noor-door noor-door-r" />
        {children}
      </div>
      <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        <path d={ogeePath(0, 0, 300, 400)} fill="none" stroke="var(--t-gold)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-[-2.4cqw] h-[calc(100%+4.8cqw)] w-[calc(100%+4.8cqw)]" aria-hidden>
        <path d={ogeePath(0, 0, 300, 400)} fill="none" stroke="var(--t-gold)" strokeWidth=".8" opacity=".55" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

export default function NoorCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const dp = dateParts(profile.date, langOf(profile));
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const inv = design.invocation ? INVOCATIONS[design.invocation] : null;
  const wed = occasionOf(profile) === "wedding";
  const longest = a.length >= b.length ? a : b;
  const both = b ? `${a} & ${b}` : a;

  const names = (size: number, row = false) => {
    const s = fit(longest, size * sc, 6);
    return (
      <div data-in className={`noor-names flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2.4cqw]" : "flex-col items-center"} text-center leading-[1.08]`} style={ff.display}>
        <E path="profile.partner1" className="wa-foil block" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${s * 0.62}cqw`, lineHeight: 1.1 }}>&amp;</span>}
        {b && <E path="profile.partner2" className="wa-foil block" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const head = (size = 4) => inv ? <p data-in dir="auto" className="text-[var(--t-gold)]" style={{ ...naskh, fontSize: `${size}cqw` }}>{inv.text}</p> : <Crescent className="mx-auto" glow={false} />;
  const where = (size = 3.2) => c.where ? <E as="p" path={c.wherePath} className="block italic" style={{ fontSize: `${size}cqw`, color: "var(--t-muted)" }}>{c.where}</E> : null;
  const footer = (size = 5) => c.footer ? <E as="p" path={c.footerPath} className="block text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${size}cqw` }}>{c.footer}</E> : null;
  const lanterns = (len: [number, number], w = 11) => (
    <>
      <div className="absolute top-0 z-10" style={{ left: "6%", width: `${w}cqw` }}><Lantern chain={len[0]} still={still} className="w-full" /></div>
      <div className="absolute top-0 z-10" style={{ right: "6%", width: `${w * 0.85}cqw` }}><Lantern chain={len[1]} still={still} delay={1} className="w-full" /></div>
    </>
  );
  const root = (children: ReactNode) => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="noor-nikah" faces={FACES} fonts={FONTS} animate={animate} style={{ ...BRASS, ...ff.body }} className={`noor wa-paper wa-paper-dark bg-[var(--t-bg)] text-[var(--t-ink)] ${className ?? ""}`}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 50% 40%, color-mix(in oklab, var(--t-bg) 72%, #3f7a62), var(--t-bg) 70%, color-mix(in oklab, var(--t-bg) 60%, #000))" }} />
      <GirihWall className="absolute inset-0" opacity={0.07} size={40} />
      <div className="pointer-events-none absolute inset-[2.6cqw] border border-[var(--t-gold)]/70" />
      <div className="pointer-events-none absolute inset-x-[2.6cqw] top-[2.6cqw] opacity-80"><GirihBand h={14} /></div>
      <div className="pointer-events-none absolute inset-x-[2.6cqw] bottom-[2.6cqw] opacity-80"><GirihBand h={14} /></div>
      {children}
    </CardRoot>
  );

  // ── Thank-you (landscape) ──
  if (shape === "wide") {
    return root(<>
      <Hall className="left-[7%] top-[12%] h-[76%] aspect-[3/4]"><div className="absolute left-1/2 top-[8%] w-[22%] -translate-x-1/2"><Lantern chain={20} still={still} className="w-full" /></div></Hall>
      <div className="absolute inset-y-[12%] right-[6%] flex w-[44%] flex-col items-center justify-center text-center" style={{ gap: "2cqw" }}>
        <StarRule className="w-[22cqw]" />
        <E as="p" path="texts.headline" className="wa-foil block leading-[1.15]" style={{ ...ff.script, fontSize: `${8.6 * sc}cqw` }}>{c.headline}</E>
        <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "2.8cqw", color: "var(--t-muted)" }}>{c.body}</E>
        <p style={{ ...ff.display, fontSize: "3.4cqw", color: "var(--t-gold)" }}>{both}</p>
      </div>
    </>);
  }

  // ── Table number inside a khatam star ──
  if (kind === "table") {
    return root(<>
      <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-[52%]">
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden fill="none" stroke="var(--t-gold)">
          <path d={starPath(0, 0, 98, 0.76)} strokeWidth="1.6" fill="rgba(0,0,0,.18)" />
          <path d={starPath(0, 0, 88, 0.76)} strokeWidth=".6" strokeDasharray="1 3" />
          <path d={khatamPath(0, 0, 66)} strokeWidth=".6" opacity=".5" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <E as="p" path="texts.headline" className="block" style={{ ...caps, fontSize: "2.6cqw", color: "var(--t-muted)" }}>{c.headline}</E>
          <p className="wa-foil leading-[1.05]" style={{ ...ff.display, fontSize: `${17 * sc}cqw` }}>{c.number}</p>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-[8%] text-center text-[var(--t-gold)]" style={{ ...ff.script, fontSize: "4.6cqw" }}>{both}</p>
    </>);
  }

  // ── Save the date: the date set in an eight-point star ──
  if (kind === "save") {
    return root(<>
      {lanterns([30, 60], 10)}
      <div className="absolute left-1/2 top-[12%] aspect-square w-[52%] -translate-x-1/2">
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden fill="none" stroke="var(--t-gold)">
          <path d={starPath(0, 0, 98, 0.76)} strokeWidth="1.4" fill="rgba(0,0,0,.15)" />
          <path d={khatamPath(0, 0, 70)} strokeWidth=".6" opacity=".5" />
        </svg>
        {dp && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p style={{ ...caps, fontSize: "2.2cqw", color: "var(--t-muted)" }}>{dp.weekday}</p>
            <p className="wa-foil leading-[1.05]" style={{ ...ff.display, fontSize: "15cqw" }}>{dp.day}</p>
            <p style={{ ...caps, fontSize: "2.4cqw" }}>{dp.month} {dp.year}</p>
          </div>
        )}
      </div>
      <div className="absolute inset-x-[10%] top-[56%] flex flex-col items-center text-center" style={{ gap: "2.2cqw" }}>
        {c.eyebrow && <E as="p" path="texts.eyebrow" className="block text-[var(--t-gold)]" style={{ ...caps, fontSize: "2.5cqw" }}>{c.eyebrow}</E>}
        {names(9.5)}
        {where(3)}
      </div>
    </>);
  }

  // ── Hall-window kinds: story, post, welcome, hashtag ──
  if (kind === "story" || kind === "post" || kind === "welcome" || kind === "hashtag") {
    const tall = shape === "tall", sq = shape === "square";
    const win = tall ? "left-[14%] right-[14%] top-[13%] aspect-[3/4]" : sq ? "left-1/2 top-[11%] h-[78%] aspect-[3/4] -translate-x-1/2" : "left-[17%] right-[17%] top-[11%] aspect-[3/4]";
    return root(<>
      {lanterns(tall ? [70, 150] : sq ? [40, 80] : [60, 110], tall ? 11 : 9)}
      <Hall className={win}>
        {kind === "hashtag" ? (
          <div className="absolute inset-x-[8%] top-[28%] flex flex-col items-center text-center" style={{ gap: "4cqw" }}>
            <Crescent className="w-[24cqw]" glow={false} />
            <p style={{ ...ff.script, fontSize: "8cqw", color: "var(--t-gold)" }}>{c.body}</p>
          </div>
        ) : (
          <div className="absolute inset-x-[7%] top-[15%] flex flex-col items-center text-center" style={{ gap: "3cqw" }}>
            <div className="w-[16cqw]">{inv ? null : <Crescent glow={false} />}</div>
            {inv && <p dir="auto" className="text-[var(--t-gold)]" style={{ ...naskh, fontSize: "6cqw" }}>{inv.text}</p>}
            {c.eyebrow && <E as="p" path="texts.eyebrow" className="block text-[#f3e9d2]/90" style={{ ...caps, fontSize: "3.6cqw" }}>{c.eyebrow}</E>}
            {names(15)}
            {wed && <p dir="rtl" lang="ar" className="text-[var(--t-gold)] opacity-80" style={{ ...arabic, fontSize: "9cqw", lineHeight: 1 }}>نكاح</p>}
          </div>
        )}
      </Hall>
      {!sq && (
        <div className={`absolute inset-x-[8%] flex flex-col items-center text-center ${tall ? "top-[68%]" : "top-[69%]"}`} style={{ gap: "2.2cqw" }}>
          {kind === "hashtag" ? (
            <>
              <E as="p" path="texts.hashtag" className="wa-foil block break-all leading-tight" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 8, 14) * sc}cqw` }}>{c.hashtag}</E>
              <p style={{ ...caps, fontSize: "2.2cqw", color: "var(--t-muted)" }}>{both}</p>
            </>
          ) : (
            <>
              <StarRule className="w-[36cqw]" />
              {c.date && <p style={{ ...caps, fontSize: tall ? "3cqw" : "2.6cqw", color: "var(--t-gold)" }}>{c.date}</p>}
              {where(tall ? 4 : 3.2)}
              {tall && footer(6)}
            </>
          )}
        </div>
      )}
    </>);
  }

  // ── List pieces: program & menu ──
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root(<>
      <div className={`absolute inset-x-[10%] flex flex-col items-center justify-between text-center ${tall ? "top-[8%] bottom-[7%]" : "top-[10%] bottom-[9%]"}`}>
        <div data-in className="flex flex-col items-center" style={{ gap: "1.6cqw" }}>
          <div style={{ width: `${tall ? 16 : 12}cqw` }}><Crescent glow={false} /></div>
          <E as="p" path="texts.headline" className="wa-foil block leading-[1.15]" style={{ ...ff.display, fontSize: `${(tall ? 11 : 8) * sc}cqw` }}>{c.headline}</E>
          <p style={{ ...ff.script, fontSize: `${tall ? 6.6 : 5}cqw`, color: "var(--t-gold)" }}>{both}</p>
        </div>
        <ul data-in className="w-full">
          {c.items.map((it, i) => (
            <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3 : 1.8}cqw 0` }}>
              {i > 0 && <svg viewBox="-10 -10 20 20" className="mb-[2.4cqw]" style={{ width: "3.2cqw" }} aria-hidden><path d={starPath(0, 0, 9, 0.5)} fill="var(--t-gold)" /></svg>}
              <E as="p" path={`items.${i}.title`} className="block text-[var(--t-gold)]" style={{ ...caps, fontSize: `${tall ? 3.6 : 2.7}cqw` }}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic" style={{ fontSize: `${tall ? 4.8 : 3.5}cqw`, marginTop: "1cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ul>
        <p style={{ ...caps, fontSize: `${tall ? 2.6 : 2}cqw`, color: "var(--t-muted)" }}>{c.date || dp?.full}</p>
      </div>
    </>);
  }

  // ── Portrait paper: invite, event, greeting ──
  return root(<>
    {lanterns([26, 54], 9)}
    <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute left-[11%] top-[12%] h-[79%] w-[78%]" aria-hidden>
      <path d={ogeePath(0, 0, 300, 400)} fill="rgba(0,0,0,.14)" stroke="var(--t-gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <path d={ogeePath(10, 10, 280, 390)} fill="none" stroke="var(--t-gold)" strokeWidth=".7" opacity=".5" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="absolute inset-x-[16%] top-[23%] bottom-[13%] flex flex-col items-center justify-between text-center">
      <div className="flex flex-col items-center" style={{ gap: "1.8cqw" }}>
        <div data-in style={{ width: inv ? "auto" : "10cqw" }}>{head(3.8)}</div>
        {kind === "event" ? (
          <>
            <p data-in style={{ ...caps, fontSize: "2.1cqw", color: "var(--t-muted)" }}>{c.lead}</p>
            <E as="p" path="texts.headline" className="block leading-[1.1] text-[var(--t-gold)]" style={{ ...ff.script, fontSize: `${9.5 * sc}cqw` }}>{c.headline}</E>
          </>
        ) : c.eyebrow ? <E as="p" path="texts.eyebrow" className="block text-[var(--t-gold)]" style={{ ...caps, fontSize: "2.2cqw" }}>{c.eyebrow}</E> : null}
      </div>
      {names(kind === "invite" ? 10.5 : 8.4, kind !== "invite")}
      {kind === "greeting" ? (
        <>
          {c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "3.5cqw", color: "var(--t-muted)" }}>{c.body}</E>}
          {footer(5.4)}
        </>
      ) : (
        <>
          {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block italic leading-snug" style={{ fontSize: "3.2cqw", color: "var(--t-muted)" }}>{c.lead}</E>}
          <div data-in className="flex flex-col items-center" style={{ gap: "1.2cqw" }}>
            <StarRule className="w-[30cqw]" />
            {c.date && <p style={{ ...caps, fontSize: "2.5cqw" }}>{c.date}</p>}
            {where(3.2)}
            {footer(4.6)}
          </div>
        </>
      )}
    </div>
  </>);
}
