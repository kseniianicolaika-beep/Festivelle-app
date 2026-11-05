"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { Scene, SunMark, type SceneLayout } from "./art";
import { FACES, FONTS } from "./faces";
import "./ashwem.css";

const serif = { fontFamily: "var(--font-cormorant), var(--font-deva), Georgia, serif" };

export default function AshwemCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const dp = dateParts(profile.date, langOf(profile));
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const longest = Math.max(a.length, b.length);
  const full = kind === "save" || kind === "story" || kind === "post" || kind === "welcome" || kind === "hashtag";

  const names = ({ size, light, row }: { size: number; light?: boolean; row?: boolean }) => {
    const s = fit(b ? (longest > a.length ? b : a) : a, size * sc, 7);
    return (
      <div data-in className={`flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[3cqw]" : "flex-col items-center"} text-center leading-[0.92]`} style={{ ...ff.display, color: light ? "#fff6e8" : "var(--t-ink)", textShadow: light ? "0 2px 18px rgba(50,15,35,.5)" : undefined }}>
        <E path="profile.partner1" className="block tracking-[0.03em]" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block" style={{ ...ff.script, fontSize: `${s * 0.55}cqw`, color: light ? "#ffd79a" : "var(--t-accent)", margin: row ? 0 : `${s * 0.04}cqw 0` }}>&amp;</span>}
        {b && <E path="profile.partner2" className="block tracking-[0.03em]" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const where = ({ light, size = 2.3 }: { light?: boolean; size?: number } = {}) => c.where ? <E as="p" path={c.wherePath} className="block uppercase" style={{ fontSize: `${size}cqw`, letterSpacing: "0.3em", color: light ? "rgba(255,240,225,.85)" : "var(--t-muted)" }}>{c.where}</E> : null;

  // ── Full-bleed golden hour (save, story, post, welcome, hashtag) ──
  if (full) {
    const layout: SceneLayout = shape === "tall" ? "tall" : shape === "square" ? "square" : "portrait";
    const tall = shape === "tall";
    return (
      <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="ashwem-dusk" faces={FACES} fonts={FONTS} animate={animate} className={`bg-[#1d1736] ${className ?? ""}`}>
        <Scene layout={layout} className="absolute inset-0 h-full w-full" still={still} />
        <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_28%,rgba(25,12,35,.35),transparent_75%)]" />
        <div className="absolute inset-[3.2cqw] border border-[#ffe2b8]/35" />
        <div className={`absolute inset-x-0 flex flex-col items-center px-[8cqw] text-center text-[#fff6e8] ${tall ? "top-[13%]" : "top-[11%]"}`} style={{ gap: tall ? "4cqw" : "2.6cqw" }}>
          {kind === "hashtag" ? (
            <>
              <p data-in style={{ ...ff.script, fontSize: "7cqw", color: "#ffd79a" }}>{c.body}</p>
              <E as="p" path="texts.hashtag" className="block break-all leading-[1.05]" style={{ ...ff.display, fontSize: `${fit(c.hashtag, 10, 14) * sc}cqw` }}>{c.hashtag}</E>
              <p data-in className="uppercase" style={{ fontSize: "2.2cqw", letterSpacing: "0.34em" }}>{b ? `${a} & ${b}` : a}</p>
            </>
          ) : (
            <>
              {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase" style={{ fontSize: `${tall ? 2.8 : 2.2}cqw`, letterSpacing: "0.38em" }}>{c.eyebrow}</E>}
              {names({ size: tall ? 17 : shape === "square" ? 10.5 : 14, light: true })}
              {kind === "save" && dp ? (
                <p data-in className="flex items-center gap-[2.5cqw]" style={{ ...ff.display, fontSize: "8cqw" }}><span>{dp.dd}</span><span className="h-[6cqw] w-px bg-[#ffd79a]/70" /><span>{dp.mm}</span><span className="h-[6cqw] w-px bg-[#ffd79a]/70" /><span>{dp.year.slice(2)}</span></p>
              ) : c.date ? <p data-in className="uppercase" style={{ fontSize: `${tall ? 3 : 2.4}cqw`, letterSpacing: "0.36em" }}>{c.date}</p> : null}
              {where({ light: true, size: tall ? 2.7 : 2.1 })}
              {c.footer && tall && <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: "6.5cqw", color: "#ffd79a" }}>{c.footer}</E>}
            </>
          )}
        </div>
      </CardRoot>
    );
  }

  // ── Wide thank-you: painted panel + note ──
  if (shape === "wide") {
    return (
      <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="ashwem-dusk" faces={FACES} fonts={FONTS} animate={animate} className={`wa-paper bg-[var(--t-surface)] text-[var(--t-ink)] ${className ?? ""}`}>
        <div className="absolute inset-y-[4cqw] left-[4cqw] w-[44%] overflow-hidden shadow-[0_1cqw_3cqw_-1cqw_rgba(60,20,30,.4)]"><Scene layout="tall" className="h-full w-full" still={still} /></div>
        <div className="absolute inset-y-0 right-0 flex w-[52%] flex-col items-center justify-center px-[5cqw] text-center" style={{ gap: "2cqw" }}>
          <SunMark className="w-[12cqw] text-[var(--t-gold)]" />
          <E as="p" path="texts.headline" className="block leading-none" style={{ ...ff.script, fontSize: `${9 * sc}cqw`, color: "var(--t-accent)" }}>{c.headline}</E>
          <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ ...serif, fontSize: "3cqw", color: "var(--t-muted)" }}>{c.body}</E>
          <p className="uppercase" style={{ ...ff.display, fontSize: "3cqw", letterSpacing: "0.2em" }}>{b ? `${a} & ${b}` : a}</p>
          {c.where && where({ size: 1.6 })}
        </div>
      </CardRoot>
    );
  }

  // ── Table number: sun medallion ──
  if (kind === "table") {
    return (
      <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="ashwem-dusk" faces={FACES} fonts={FONTS} animate={animate} className={`wa-paper bg-[var(--t-surface)] text-[var(--t-ink)] ${className ?? ""}`}>
        <div className="absolute inset-[4cqw] border border-[var(--t-gold)]/50" />
        <div className="absolute left-1/2 top-[11%] aspect-square w-[46%] -translate-x-1/2 overflow-hidden rounded-full shadow-[0_1.5cqw_4cqw_-1.5cqw_rgba(60,20,30,.5)]"><Scene layout="square" className="h-full w-full" still={still} palms={false} /></div>
        <div className="absolute inset-x-0 bottom-[10%] text-center">
          <E as="p" path="texts.headline" className="block uppercase" style={{ fontSize: "2.6cqw", letterSpacing: "0.5em", color: "var(--t-muted)" }}>{c.headline}</E>
          <p className="font-light leading-[0.9]" style={{ ...serif, fontSize: `${24 * sc}cqw` }}>{c.number}</p>
        </div>
      </CardRoot>
    );
  }

  // ── Paper pieces: invite, event, greeting, program, menu ──
  const list = kind === "program" || kind === "menu";
  const tallPaper = kind === "menu";
  return (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="ashwem-dusk" faces={FACES} fonts={FONTS} animate={animate} className={`wa-paper bg-[var(--t-surface)] text-[var(--t-ink)] ${className ?? ""}`}>
      <div className="absolute inset-[3cqw] border border-[var(--t-gold)]/45" />
      <div className={`absolute inset-x-[6cqw] top-[6cqw] overflow-hidden ${list ? (tallPaper ? "h-[17%]" : "h-[22%]") : "h-[41%]"}`} style={{ borderRadius: list ? "50cqw 50cqw 0 0" : "0" }}>
        <Scene layout="card" className="h-full w-full" still={still} />
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,230,190,.35)]" />
      </div>
      <div className={`absolute inset-x-[9cqw] bottom-[7cqw] flex flex-col items-center text-center ${list ? (tallPaper ? "top-[24%]" : "top-[31%]") : "top-[49%]"} justify-between`}>
        {list ? (
          <>
            <div data-in className="flex flex-col items-center" style={{ gap: "1.4cqw" }}>
              <E as="p" path="texts.headline" className="block leading-none" style={{ ...ff.display, fontSize: `${(tallPaper ? 11 : 8.5) * sc}cqw` }}>{c.headline}</E>
              <p style={{ ...ff.script, fontSize: `${tallPaper ? 6 : 4.6}cqw`, color: "var(--t-accent)" }}>{b ? `${a} & ${b}` : a}</p>
            </div>
            <ul data-in className="w-full">
              {c.items.map((it, i) => (
                <li key={i} className="flex flex-col items-center" style={{ padding: `${tallPaper ? 3 : 1.6}cqw 0` }}>
                  {i > 0 && <span className="mb-[2cqw] block h-px w-[10cqw] bg-[var(--t-gold)]/60" />}
                  <E as="p" path={`items.${i}.title`} className="block uppercase" style={{ fontSize: `${tallPaper ? 3.4 : 2.6}cqw`, letterSpacing: "0.3em" }}>{it.title}</E>
                  {it.detail && <E as="p" path={`items.${i}.detail`} className="block italic" style={{ ...serif, fontSize: `${tallPaper ? 4.6 : 3.4}cqw`, color: "var(--t-muted)", marginTop: "0.8cqw" }}>{it.detail}</E>}
                </li>
              ))}
            </ul>
            <p className="uppercase" style={{ fontSize: "2cqw", letterSpacing: "0.34em", color: "var(--t-muted)" }}>{c.date || dp?.full}</p>
          </>
        ) : kind === "greeting" ? (
          <>
            <E as="p" path="texts.eyebrow" className="block uppercase" style={{ fontSize: "2.2cqw", letterSpacing: "0.36em", color: "var(--t-muted)" }}>{c.eyebrow}</E>
            {names({ size: 10, row: true })}
            {c.body && <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ ...serif, fontSize: "3.6cqw", color: "var(--t-muted)" }}>{c.body}</E>}
            {c.footer && <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: "6cqw", color: "var(--t-accent)" }}>{c.footer}</E>}
          </>
        ) : (
          <>
            <div data-in className="flex flex-col items-center" style={{ gap: "1.6cqw" }}>
              {kind === "event" ? (
                <>
                  <p className="uppercase" style={{ fontSize: "2cqw", letterSpacing: "0.34em", color: "var(--t-muted)" }}>{c.lead}</p>
                  <E as="p" path="texts.headline" className="block leading-none" style={{ ...ff.script, fontSize: `${10 * sc}cqw`, color: "var(--t-accent)" }}>{c.headline}</E>
                </>
              ) : (
                <>
                  {c.eyebrow && <E as="p" path="texts.eyebrow" className="block uppercase" style={{ fontSize: "2.1cqw", letterSpacing: "0.38em", color: "var(--t-muted)" }}>{c.eyebrow}</E>}
                </>
              )}
            </div>
            {names({ size: kind === "event" ? 9 : 12.5, row: kind === "event" })}
            {kind === "invite" && c.lead && <E as="p" multiline path={c.leadPath} className="block max-w-[70cqw] italic leading-snug" style={{ ...serif, fontSize: "3.3cqw", color: "var(--t-muted)" }}>{c.lead}</E>}
            <div data-in className="flex flex-col items-center" style={{ gap: "1cqw" }}>
              <div className="flex items-center gap-[2cqw] text-[var(--t-gold)]"><span className="h-px w-[8cqw] bg-current" /><SunMark className="w-[6cqw]" /><span className="h-px w-[8cqw] bg-current" /></div>
              {c.date && <p className="uppercase" style={{ fontSize: "3cqw", letterSpacing: "0.3em" }}>{c.date}</p>}
              {where({ size: 2 })}
              {c.footer && <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: "5cqw", color: "var(--t-accent)" }}>{c.footer}</E>}
            </div>
          </>
        )}
      </div>
    </CardRoot>
  );
}
