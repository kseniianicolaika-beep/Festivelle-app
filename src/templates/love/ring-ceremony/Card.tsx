"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { JAALI, Lantern, MughalArch, Rings } from "./art";

// RING CEREMONY stationery — emerald board, jaali lattice, a gold cusped arch, hanging lanterns and interlocked rings.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "indian");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const ru = p.language === "ru", hi = p.language === "hi";
  const amp = ru ? "и" : "&";
  const both = <>{a}{b && <> {amp} {b}</>}</>;
  const id = `rc-${kind}`;
  const sagai = hi ? "सगाई समारोह" : ru ? "Сагаи · обручение" : "The Sagai";

  const names = (size = 12, inline = false) => (
    <h2 className="d leading-[1.05]" style={{ fontSize: `${size * sc * fitName(a, b, 7, inline)}cqw` }}>
      <E path="profile.partner1" className={`gold up ${inline ? "" : "block"}`} style={d(0.6)}>{a}</E>
      {b && <span className={`i up text-[var(--t-accent)] ${inline ? "mx-[.25em]" : "block"}`} style={{ fontSize: ".5em", lineHeight: 1.3, ...d(0.8) }}>{amp}</span>}
      {b && <E path="profile.partner2" className={`gold up ${inline ? "" : "block"}`} style={d(0.9)}>{b}</E>}
    </h2>
  );
  const k = (t: React.ReactNode, size = 2.4, path?: string, delay = 0.3) =>
    path ? <E as="p" path={path} className="k up block text-[var(--t-gold)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</E> : <p className="k up text-[var(--t-gold)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</p>;
  const when = (size = 3.8) => (
    <div className="up" style={d(1.1)}>
      {c.date && <p className="i" style={{ fontSize: `${size}cqw` }}>{c.date}{c.time && <> · {c.time}</>}</p>}
      {c.where && <E as="p" path={c.wherePath} className="k mt-[1cqw] block text-[var(--t-muted)]" style={{ fontSize: `${size * 0.58}cqw` }}>{c.where}</E>}
    </div>
  );
  const footer = (size = 4.6) => (c.footer ? <E as="p" path={c.footerPath} className="i up block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(1.3) }}>{c.footer}</E> : null);
  const head = (size = 9) => <E as="p" path="texts.headline" className="d gold up block leading-[1.05]" style={{ fontSize: `${size * sc}cqw`, ...d(0.3) }}>{c.headline}</E>;
  const lanterns = (n = 2, w = 9) => (
    <div aria-hidden className="pointer-events-none absolute inset-x-[7cqw] top-0 z-[3] flex justify-between">
      {Array.from({ length: n }, (_, i) => <Lantern key={i} chain={30 + (i % 2) * 40} className="rc-swing" style={{ width: `${w}cqw`, animationDelay: `${-i * 1.3}s` }} />)}
    </div>
  );
  const arch = (inset = "6cqw", top = "8cqw") => <div className="absolute" style={{ left: inset, right: inset, top, bottom: inset }}><MughalArch className="h-full w-full" fill="color-mix(in oklab, var(--t-surface) 75%, transparent)" /></div>;
  const items = (big = false) => (
    <ul className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up flex flex-col items-center" style={{ padding: `${big ? 2.8 : c.items.length > 4 ? 1 : 1.8}cqw 0`, ...d(0.5 + i * 0.1) }}>
          <E as="p" path={`items.${i}.title`} className="d block" style={{ fontSize: `${big ? 5.6 : 4.2}cqw` }}>{it.title}</E>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="i block text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3.1}cqw`, marginTop: ".6cqw" }}>{it.detail}</E>}
          {i < c.items.length - 1 && <svg viewBox="0 0 20 20" className="mt-[1.4cqw] w-[2cqw]" aria-hidden><path d="M10 0l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="var(--t-gold)" /></svg>}
        </li>
      ))}
    </ul>
  );
  const col = "relative z-[1] flex h-full flex-col items-center text-center";

  const body = (() => {
    switch (kind) {
      case "save":
        return (
          <>
            {arch("7cqw", "16cqw")}
            {lanterns(2)}
            <div className={`${col} justify-center gap-[3cqw] px-[16cqw] pt-[22cqw]`}>
              {k(c.eyebrow, 2.6, "texts.eyebrow")}
              <p className="d gold up leading-none" style={{ fontSize: `${26 * sc}cqw`, ...d(0.5) }}>{p.date ? Number(p.date.slice(8, 10)) : "—"}</p>
              <p className="i up" style={{ fontSize: "5.6cqw", ...d(0.7) }}>{c.date.replace(/^\d+\s*/, "")}</p>
              <Rings id={id} className="w-[30cqw]" />
              {names(7, true)}
              <p className="i text-[var(--t-muted)]" style={{ fontSize: "3.6cqw" }}>{c.lead}{c.where && <> · <E path={c.wherePath}>{c.where}</E></>}</p>
            </div>
          </>
        );
      case "story":
      case "welcome":
      case "event":
        return (
          <>
            {arch("7cqw", kind === "story" ? "24cqw" : "18cqw")}
            {lanterns(kind === "story" ? 3 : 2, kind === "story" ? 11 : 9)}
            <div className={`${col} justify-center gap-[3cqw] px-[16cqw] ${kind === "story" ? "pt-[34cqw]" : "pt-[26cqw]"}`}>
              {k(kind === "story" ? c.eyebrow : c.eyebrow || sagai, kind === "story" ? 3 : 2.4, "texts.eyebrow")}
              <Rings id={id} className={kind === "story" ? "w-[44cqw]" : "w-[32cqw]"} />
              {kind === "event" ? <><p className="i up text-[var(--t-accent)]" style={{ fontSize: "6cqw", ...d(0.5) }}>{both}</p>{head(10)}</> : names(kind === "story" ? 15 : 13)}
              {when(kind === "story" ? 4.6 : 3.8)}
              {kind === "story" && footer(6)}
              {kind === "story" && photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="photo" src={photoUrl} alt="" className="up mt-[2cqw] aspect-square w-[34cqw] rounded-full border border-[var(--t-gold)] object-cover p-[1cqw]" style={d(1.4)} />
              )}
            </div>
          </>
        );
      case "post":
        return (
          <>
            {lanterns(2, 8)}
            <div className={`${col} justify-center gap-[2cqw] px-[14cqw]`}>
              <Rings id={id} className="w-[30cqw]" />
              {names(10, true)}
              {k(c.eyebrow, 2.4, "texts.eyebrow", 1)}
              {when(3.2)}
            </div>
          </>
        );
      case "program":
      case "menu":
        return (
          <>
            {arch("6cqw", "5cqw")}
            <div className={`${col} px-[14cqw] pb-[9cqw] ${kind === "menu" ? "pt-[34cqw]" : "pt-[28cqw]"}`}>
              {k(sagai, 2.4)}
              {head(kind === "menu" ? 12 : 9)}
              <p className="i text-[var(--t-accent)]" style={{ fontSize: "4.6cqw" }}>{both}</p>
              <div className="mt-[2cqw] flex w-full flex-1 flex-col justify-evenly">{items(kind === "menu")}</div>
              {kind === "menu" && <Rings id={id} className="w-[22cqw]" />}
            </div>
          </>
        );
      case "table":
        return (
          <>
            {lanterns(2, 8)}
            <div className={`${col} justify-center`}>
              <div className="relative flex h-[56cqw] w-[48cqw] items-center justify-center">
                <MughalArch className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 75%, transparent)" />
                <div className="relative pt-[8cqw]">
                  <E as="p" path="texts.headline" className="k block text-[var(--t-gold)]" style={{ fontSize: "2.8cqw" }}>{c.headline}</E>
                  <p className="d gold up leading-none" style={{ fontSize: `${26 * sc}cqw` }}>{c.number}</p>
                </div>
              </div>
              <p className="i mt-[3cqw] text-[var(--t-accent)]" style={{ fontSize: "4.6cqw" }}>{both}</p>
            </div>
          </>
        );
      case "hashtag":
        return (
          <>
            {lanterns(3, 8)}
            <div className={`${col} justify-center gap-[3.4cqw] px-[11cqw] pt-[14cqw]`}>
              <Rings id={id} className="w-[30cqw]" />
              <E as="p" path="texts.body" className="i up block text-[var(--t-accent)]" style={{ fontSize: "7cqw", ...d(0.3) }}>{c.body}</E>
              <E as="p" path="texts.hashtag" className="d gold up block break-all leading-[1.1]" style={{ fontSize: `${8 * sc}cqw`, ...d(0.5) }}>{c.hashtag}</E>
              {k(both, 2.2)}
            </div>
          </>
        );
      case "thankyou":
        return (
          <div className="relative z-[1] grid h-full grid-cols-[40%_1fr] items-center">
            <div className="relative h-full">
              <div className="absolute inset-[5cqw]"><MughalArch className="h-full w-full" fill="color-mix(in oklab, var(--t-surface) 75%, transparent)" /></div>
              <Rings id={id} className="absolute left-1/2 top-[56%] w-[26cqw] -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="flex flex-col items-center gap-[1.6cqw] pr-[6cqw] text-center">
              {head(9)}
              <E as="p" multiline path="texts.body" className="i up block text-[var(--t-muted)]" style={{ fontSize: "2.9cqw", lineHeight: 1.4, ...d(0.5) }}>{c.body}</E>
              <p className="i up text-[var(--t-accent)]" style={{ fontSize: "4.4cqw", ...d(0.8) }}>{both}</p>
            </div>
          </div>
        );
      case "greeting":
        return (
          <>
            {lanterns(2, 9)}
            <div className={`${col} justify-center gap-[3cqw] px-[12cqw] pt-[12cqw]`}>
              <Rings id={id} className="w-[30cqw]" />
              {head(11)}
              {names(7.5, true)}
              {c.body && <E as="p" multiline path="texts.body" className="i up block whitespace-pre-line" style={{ fontSize: "4cqw", lineHeight: 1.5, ...d(0.7) }}>{c.body}</E>}
              {footer(5)}
            </div>
          </>
        );
      default: // invite
        return (
          <>
            {arch("6cqw", "14cqw")}
            {lanterns(2)}
            <div className={`${col} justify-center gap-[2.4cqw] px-[15cqw] pt-[24cqw]`}>
              {k(c.eyebrow, 2.3, "texts.eyebrow")}
              <Rings id={id} className="w-[28cqw]" />
              {names(11.5)}
              <E as="p" multiline path={c.leadPath} className="i up block" style={{ fontSize: "3.6cqw", lineHeight: 1.4, ...d(1) }}>{c.lead}</E>
              {when(3.4)}
              {footer(4.4)}
            </div>
          </>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "playfair"), ...shellStyle(ratio) }}
      className={`rc ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-bg)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(0,0,0,.7)] ${className}`}
    >
      <style href="love-rc" precedence="default">{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.14]" style={{ backgroundImage: JAALI, backgroundSize: "9cqw 9cqw" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,210,120,.14),transparent_70%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-[2.6cqw] border border-[var(--t-gold)]/45" />
      {body}
    </div>
  );
}
