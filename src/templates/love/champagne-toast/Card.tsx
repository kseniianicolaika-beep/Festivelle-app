"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Corner, Fan, Glass, Sunburst, Tower } from "./art";

// CHAMPAGNE TOAST stationery — onyx board, gold-foil deco frame with stepped corners, a coupe tower.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "western");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const amp = p.language === "ru" ? "и" : "&";

  const names = (size = 11, inline = false) => (
    <h2 className="d leading-[1]" style={{ fontSize: `${size * sc * fitName(a, b, 6, inline)}cqw` }}>
      <E path="profile.partner1" className={`gold up ${inline ? "" : "block"}`} style={d(0.4)}>{a}</E>
      {b && <span className={`i fade normal-case text-[var(--t-accent)] ${inline ? "mx-[.3em]" : "block"}`} style={{ fontSize: ".55em", letterSpacing: 0, lineHeight: 1.3, ...d(0.8) }}>{amp}</span>}
      {b && <E path="profile.partner2" className={`gold up ${inline ? "" : "block"}`} style={d(0.6)}>{b}</E>}
    </h2>
  );
  const k = (t: React.ReactNode, size = 2.2, path?: string, cls = "text-[var(--t-gold)]", delay = 0.2) =>
    path ? <E as="p" path={path} className={`k up block ${cls}`} style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</E> : <p className={`k up ${cls}`} style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</p>;
  const rule = (w = 40) => <div className="rule mx-auto" style={{ width: `${w}cqw` }} />;
  const when = (size = 3) => (
    <div className="up flex flex-col items-center gap-[1cqw]" style={d(1)}>
      {c.date && <p className="k" style={{ fontSize: `${size}cqw` }}>{c.date}</p>}
      {(c.time || c.where) && <p className="i text-[var(--t-muted)]" style={{ fontSize: `${size * 1.25}cqw` }}>{c.time}{c.time && c.where ? " · " : ""}{c.where && <E path={c.wherePath}>{c.where}</E>}</p>}
    </div>
  );
  const footer = (size = 4.4) => (c.footer ? <E as="p" path={c.footerPath} className="i fade block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(1.3) }}>{c.footer}</E> : null);
  const head = (size = 8, path = "texts.headline") => <E as="p" path={path} className="d gold up block leading-[1.05]" style={{ fontSize: `${size * sc}cqw`, ...d(0.3) }}>{c.headline}</E>;
  const items = (big = false) => (
    <ul className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up flex flex-col items-center" style={{ padding: `${big ? 3.4 : 2.4}cqw 0`, ...d(0.5 + i * 0.12) }}>
          <E as="p" path={`items.${i}.title`} className="k block" style={{ fontSize: `${big ? 4.6 : 3.2}cqw` }}>{it.title}</E>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="i block text-[var(--t-muted)]" style={{ fontSize: `${big ? 5.2 : 3.6}cqw`, marginTop: "1.4cqw", lineHeight: 1.3 }}>{it.detail}</E>}
          {i < c.items.length - 1 && <svg viewBox="0 0 20 6" className="mt-[2.4cqw] w-[4cqw]" aria-hidden><path d="M0 3h7M13 3h7M10 0l3 3-3 3-3-3Z" stroke="var(--t-gold)" strokeWidth=".6" fill="none" /></svg>}
        </li>
      ))}
    </ul>
  );
  const frame = (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-[3cqw] border border-[var(--t-gold)]/60" />
      <div aria-hidden className="pointer-events-none absolute inset-[4.4cqw] border border-[var(--t-gold)]/25" />
      <Corner className="absolute left-[3cqw] top-[3cqw] w-[11cqw]" />
      <Corner className="absolute right-[3cqw] top-[3cqw] w-[11cqw] rotate-90" />
      <Corner className="absolute bottom-[3cqw] right-[3cqw] w-[11cqw] rotate-180" />
      <Corner className="absolute bottom-[3cqw] left-[3cqw] w-[11cqw] -rotate-90" />
    </>
  );
  const col = "relative flex h-full flex-col items-center text-center";
  const glow = <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_80%,rgba(255,200,120,.16),transparent_70%)]" />;

  const body = (() => {
    switch (kind) {
      case "save":
        return (
          <div className={`${col} justify-between px-[11cqw] py-[12cqw]`}>
            {frame}
            <Fan className="w-[22cqw]" />
            {k(c.eyebrow, 2.6, "texts.eyebrow")}
            <div className="up" style={d(0.4)}>
              <p className="d gold leading-none" style={{ fontSize: `${30 * sc}cqw` }}>{p.date ? p.date.slice(8, 10) + "." + p.date.slice(5, 7) : "—"}</p>
              <p className="d mt-[2cqw] tracking-[.5em]" style={{ fontSize: "5cqw" }}>{p.date?.slice(0, 4)}</p>
            </div>
            {names(6.4, true)}
            <div className="flex flex-col items-center gap-[1cqw]">
              <p className="i text-[var(--t-muted)]" style={{ fontSize: "4cqw" }}>{c.lead}</p>
              {c.where && k(<E path={c.wherePath}>{c.where}</E>, 2.2, undefined, "text-[var(--t-gold)]", 1)}
            </div>
          </div>
        );
      case "story":
        return (
          <div className={`${col} justify-between py-[14cqw]`}>
            {glow}
            <Sunburst className="absolute inset-x-0 bottom-0 h-[55%] w-full" />
            {frame}
            <div className="relative flex flex-col items-center gap-[3cqw] px-[10cqw]">
              <Fan className="w-[26cqw]" />
              {k(c.eyebrow, 3, "texts.eyebrow")}
              {names(14)}
            </div>
            <Tower id="ct-cs" className="rise relative w-[64cqw]" />
            <div className="relative flex flex-col items-center gap-[2cqw]">{when(3.6)}{footer(6)}</div>
          </div>
        );
      case "post":
        return (
          <div className={`${col} justify-center gap-[3cqw] px-[10cqw]`}>
            {glow}
            <Sunburst className="absolute inset-x-0 bottom-0 h-[60%] w-full" />
            {frame}
            <div className="relative flex flex-col items-center gap-[2cqw]">
              {k(c.eyebrow, 2.4, "texts.eyebrow")}
              {names(10, true)}
              <Tower id="ct-cp" className="rise mt-[2cqw] w-[44cqw]" />
              {when(2.6)}
            </div>
          </div>
        );
      case "event":
        return (
          <div className={`${col} justify-center gap-[3.4cqw] px-[12cqw]`}>
            {frame}
            <Glass className="w-[16cqw]" />
            {k(c.eyebrow, 2.2, "texts.eyebrow", "text-[var(--t-muted)]")}
            <p className="i up text-[var(--t-accent)]" style={{ fontSize: "6cqw", ...d(0.3) }}>{a}{b && <> {amp} {b}</>}</p>
            {head(9.5)}
            {rule(36)}
            {when(3.2)}
          </div>
        );
      case "welcome":
        return (
          <div className={`${col} justify-between px-[11cqw] py-[13cqw]`}>
            {glow}
            {frame}
            <Fan className="w-[30cqw]" />
            <div className="flex flex-col items-center gap-[3cqw]">
              <E as="p" path="texts.eyebrow" className="i up block text-[var(--t-muted)]" style={{ fontSize: "5.4cqw", ...d(0.2) }}>{c.eyebrow}</E>
              {names(14)}
            </div>
            <Tower id="ct-cw" className="rise w-[50cqw]" />
            {when(3)}
          </div>
        );
      case "program":
      case "menu":
        return (
          <div className={`${col} px-[12cqw] py-[13cqw]`}>
            {frame}
            <Fan className="w-[20cqw]" />
            <div className="mt-[3cqw]">{head(kind === "menu" ? 11 : 8)}</div>
            <p className="i mt-[1cqw] text-[var(--t-accent)]" style={{ fontSize: "4.4cqw" }}>{a}{b && <> {amp} {b}</>}</p>
            <div className="mt-[2cqw] flex w-full flex-1 flex-col justify-evenly">{items(kind === "menu")}</div>
            {kind === "menu" ? <Tower id="ct-cm" pour={false} className="w-[46cqw]" /> : <Glass className="w-[12cqw]" />}
          </div>
        );
      case "table":
        return (
          <div className={`${col} justify-center`}>
            {glow}
            {frame}
            <Sunburst className="absolute inset-x-0 bottom-0 h-[50%] w-full opacity-70" />
            <div className="relative flex flex-col items-center gap-[2cqw]">
              <Fan className="w-[26cqw]" />
              <E as="p" path="texts.headline" className="k block text-[var(--t-gold)]" style={{ fontSize: "3.4cqw" }}>{c.headline}</E>
              <p className="d gold up leading-none" style={{ fontSize: `${38 * sc}cqw` }}>{String(c.number).padStart(2, "0")}</p>
              <p className="i text-[var(--t-accent)]" style={{ fontSize: "4.6cqw" }}>{a}{b && <> {amp} {b}</>}</p>
            </div>
          </div>
        );
      case "hashtag":
        return (
          <div className={`${col} justify-center gap-[4cqw] px-[11cqw]`}>
            {frame}
            <div className="flex items-end gap-[1cqw]"><Glass className="w-[14cqw] -rotate-12" /><Glass className="w-[14cqw] rotate-12" /></div>
            <E as="p" path="texts.body" className="i up block text-[var(--t-accent)]" style={{ fontSize: "7cqw", ...d(0.2) }}>{c.body}</E>
            <E as="p" path="texts.hashtag" className="d gold up block break-all leading-[1.1]" style={{ fontSize: `${8 * sc}cqw`, letterSpacing: ".02em", textTransform: "none", ...d(0.4) }}>{c.hashtag}</E>
            {rule(40)}
            {k(<>{a}{b && <> {amp} {b}</>}</>, 2.2)}
          </div>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[44%_1fr]">
            {frame}
            <div className="relative flex items-end justify-center overflow-hidden pb-[7cqw]">
              <Sunburst className="absolute inset-x-0 bottom-0 h-[70%] w-full" />
              <Tower id="ct-ct" className="rise relative w-[32cqw]" />
            </div>
            <div className="relative flex flex-col items-center justify-center gap-[2.4cqw] pr-[7cqw] text-center">
              <Fan className="w-[14cqw]" />
              {head(8.5)}
              <E as="p" multiline path="texts.body" className="i up block text-[var(--t-muted)]" style={{ fontSize: "3cqw", lineHeight: 1.35, ...d(0.6) }}>{c.body}</E>
              <p className="i up text-[var(--t-accent)]" style={{ fontSize: "4.4cqw", ...d(0.9) }}>{a}{b && <> {amp} {b}</>}</p>
            </div>
          </div>
        );
      case "greeting":
        return (
          <div className={`${col} justify-center gap-[3.4cqw] px-[12cqw]`}>
            {glow}
            {frame}
            <div className="flex items-end gap-[1cqw]"><Glass className="w-[15cqw] -rotate-12" /><Glass className="w-[15cqw] rotate-12" /></div>
            {head(10)}
            {c.eyebrow && k(c.eyebrow, 2.2, "texts.eyebrow")}
            {names(7, true)}
            {c.body && <E as="p" multiline path="texts.body" className="i up block whitespace-pre-line" style={{ fontSize: "4.2cqw", lineHeight: 1.4, ...d(0.8) }}>{c.body}</E>}
            {footer(5)}
          </div>
        );
      default: // invite
        return (
          <div className={`${col} justify-between px-[12cqw] py-[12cqw]`}>
            {glow}
            {frame}
            <div className="flex flex-col items-center gap-[2.4cqw]">
              <Fan className="w-[24cqw]" />
              {k(c.eyebrow, 2.2, "texts.eyebrow")}
            </div>
            {names(12)}
            <div className="flex flex-col items-center gap-[2.6cqw]">
              <E as="p" multiline path={c.leadPath} className="i up block max-w-[64cqw]" style={{ fontSize: "4cqw", lineHeight: 1.35, ...d(0.9) }}>{c.lead}</E>
              {rule(34)}
              {when(2.6)}
              {footer()}
            </div>
            {photoUrl ? null : null}
          </div>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "deco"), ...shellStyle(ratio) }}
      className={`ct ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.7),0_0_0_1px_rgba(0,0,0,.2)] ${className}`}
    >
      <style href="love-ct" precedence="default">{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.06]" style={{ backgroundImage: "repeating-linear-gradient(45deg,var(--t-gold) 0 1px,transparent 1px 3cqw),repeating-linear-gradient(-45deg,var(--t-gold) 0 1px,transparent 1px 3cqw)" }} />
      {body}
    </div>
  );
}
