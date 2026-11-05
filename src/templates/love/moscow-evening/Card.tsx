"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, GRAIN, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Birch, Doily, LaceBand, Mansion, Seal, snow } from "./art";
import { Envelope } from "./Envelope";

// MOSCOW EVENING stationery — ivory cotton with Vologda-lace edges, silver birch, a wax seal and handwriting.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "russian");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const ru = p.language === "ru";
  const amp = ru ? "и" : "&";
  const both = <>{a}{b && <> {amp} {b}</>}</>;
  const uid = `me-${kind}`;

  const names = (size = 12, inline = false) => (
    <h2 className="d leading-[.98]" style={{ fontSize: `${size * sc * fitName(a, b, 8, inline)}cqw` }}>
      <E path="profile.partner1" className={`up ${inline ? "" : "block"}`} style={d(0.3)}>{a}</E>
      {b && <span className={`h up text-[var(--t-accent)] ${inline ? "mx-[.2em]" : "block"}`} style={{ fontSize: ".55em", lineHeight: 1.3, ...d(0.5) }}>{amp}</span>}
      {b && <E path="profile.partner2" className={`up ${inline ? "" : "block"}`} style={d(0.6)}>{b}</E>}
    </h2>
  );
  const cap = (t: React.ReactNode, size = 2.2, path?: string, delay = 0.1) =>
    path ? <E as="p" path={path} className="cap up block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</E> : <p className="cap up text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</p>;
  const when = (size = 3.8) => (
    <div className="up" style={d(0.9)}>
      {c.date && <p className="it" style={{ fontSize: `${size}cqw` }}>{c.date}{c.time && <> · {c.time}</>}</p>}
      {c.where && <E as="p" path={c.wherePath} className="cap mt-[1cqw] block text-[var(--t-muted)]" style={{ fontSize: `${size * 0.55}cqw` }}>{c.where}</E>}
    </div>
  );
  const footer = (size = 6) => (c.footer ? <E as="p" path={c.footerPath} className="h ink write block" style={{ fontSize: `${size}cqw`, ...d(1.2) }}>{c.footer}</E> : null);
  const head = (size = 10) => <E as="p" path="texts.headline" className="d up block leading-none" style={{ fontSize: `${size * sc}cqw`, ...d(0.2) }}>{c.headline}</E>;
  const items = (big = false) => (
    <ol className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up" style={{ padding: `${big ? 2.6 : 2}cqw 0`, ...d(0.4 + i * 0.1) }}>
          <div className="flex items-baseline gap-[2cqw]">
            <E as="span" path={`items.${i}.title`} className="d shrink-0" style={{ fontSize: `${big ? 5.6 : 4.8}cqw` }}>{it.title}</E>
            <span className="flex-1 border-b border-dotted border-[var(--t-gold)]" />
          </div>
          {it.detail && <E as="p" path={`items.${i}.detail`} className="it block text-left text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3.2}cqw`, marginTop: ".6cqw" }}>{it.detail}</E>}
        </li>
      ))}
    </ol>
  );
  const lace = (
    <>
      <div className="absolute inset-x-0 top-0 z-[2] h-[34px]"><LaceBand id={`${uid}-t`} className="h-full w-full" flip /></div>
      <div className="absolute inset-x-0 bottom-0 z-[2] h-[34px]"><LaceBand id={`${uid}-b`} className="h-full w-full" /></div>
      <div className="pointer-events-none absolute inset-x-[3.4cqw] inset-y-[11cqw] border border-[var(--t-gold)]/40" />
    </>
  );
  const birch = (h = "100%") => <Birch className="absolute -left-[4cqw] bottom-0 w-[18cqw] opacity-90" style={{ height: h }} />;
  const col = "relative z-[1] flex h-full flex-col items-center text-center";

  const body = (() => {
    switch (kind) {
      case "save":
        return (
          <div className="relative flex h-full flex-col items-center justify-center gap-[5cqw] px-[8cqw]" style={{ background: "linear-gradient(180deg,#8f9bae,#d8d5cd 60%,var(--t-bg))" }}>
            <div className={`absolute inset-0 ${animate ? "me-snow" : ""}`} style={snow(0.6)} />
            {birch("92%")}
            <div className="relative">{cap(c.eyebrow, 3, "texts.eyebrow")}</div>
            <Envelope a={a} b={b} opened={!animate} className="relative w-[76cqw]" seal="13cqw" style={{ ["--rise" as string]: "-40%" }}>
              <div className="flex h-full flex-col items-center justify-start pt-[6%] text-center">
                <p className="d leading-none" style={{ fontSize: `${17 * sc}cqw` }}>{p.date ? p.date.slice(8, 10) + "·" + p.date.slice(5, 7) : "—"}</p>
                <p className="it" style={{ fontSize: "3.6cqw" }}>{p.date?.slice(0, 4)}</p>
              </div>
            </Envelope>
            <div className="relative flex flex-col items-center gap-[1.4cqw]">
              {names(8, true)}
              <p className="h ink" style={{ fontSize: "5cqw" }}>{c.lead}</p>
              {c.where && <E as="p" path={c.wherePath} className="cap block text-[var(--t-muted)]" style={{ fontSize: "2.2cqw" }}>{c.where}</E>}
            </div>
          </div>
        );
      case "story":
        return (
          <div className={`${col} justify-between pb-[12cqw] pt-[14cqw]`} style={{ background: "linear-gradient(180deg,#5f6f86 0%,#9aa6b8 34%,#dad7cf 60%,var(--t-bg) 100%)" }}>
            <div className={`absolute inset-0 ${animate ? "me-snow" : ""}`} style={snow(0.7)} />
            <Birch className="absolute -left-[6cqw] bottom-0 h-[105%] w-[26cqw]" />
            <Birch flip className="absolute -right-[4cqw] bottom-0 h-[88%] w-[20cqw]" />
            <div className="relative flex flex-col items-center gap-[2cqw]">
              <E as="p" path="texts.eyebrow" className="cap up block text-white" style={{ fontSize: "3cqw", ...d(0.1) }}>{c.eyebrow}</E>
              {photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="photo" src={photoUrl} alt="" className="up mt-[3cqw] aspect-[4/5] w-[50cqw] rotate-[-3deg] border-[2cqw] border-b-[7cqw] border-white object-cover shadow-[0_3cqw_6cqw_-3cqw_rgba(0,0,0,.5)] [filter:sepia(.3)]" style={d(0.4)} />
              )}
            </div>
            <div className="relative flex flex-col items-center gap-[2.4cqw] px-[12cqw]">
              <Mansion className="w-[56cqw] opacity-50" />
              {names(12)}
              {when(4.6)}
              {footer(7)}
            </div>
          </div>
        );
      case "post":
        return (
          <div className={`${col} justify-center gap-[2.4cqw] px-[10cqw]`}>
            {lace}
            {birch()}
            <Doily className="up aspect-square w-[58cqw]">
              <div className="px-[8cqw]">
                <E as="p" path="texts.eyebrow" className="h ink block" style={{ fontSize: "5.4cqw" }}>{c.eyebrow}</E>
                {names(8.5)}
                <p className="it mt-[1cqw]" style={{ fontSize: "3cqw" }}>{c.date}</p>
              </div>
            </Doily>
          </div>
        );
      case "event":
      case "welcome":
        return (
          <div className={`${col} justify-center gap-[3.4cqw] px-[13cqw] py-[14cqw]`}>
            {lace}
            {birch("80%")}
            <Seal a={a} b={b} className="up h-[16cqw] w-[16cqw]" style={{ fontSize: "5.6cqw" }} />
            {cap(c.eyebrow, 2.4, "texts.eyebrow")}
            {kind === "event" ? <><p className="h ink up" style={{ fontSize: "7cqw", ...d(0.3) }}>{both}</p>{head(11)}</> : names(15)}
            <svg viewBox="0 0 120 10" className="w-[30cqw]" aria-hidden><path d="M0 5h48M72 5h48" stroke="var(--t-gold)" strokeWidth=".6" /><path d="M54 5c2-4 4-4 6 0s4 4 6 0" fill="none" stroke="var(--t-gold)" strokeWidth=".8" /></svg>
            {when(4)}
          </div>
        );
      case "program":
      case "menu":
        return (
          <div className={`${col} px-[12cqw] pb-[14cqw] pt-[15cqw]`}>
            {lace}
            {head(kind === "menu" ? 13 : 10)}
            <p className="h ink up mt-[1.4cqw]" style={{ fontSize: "5.6cqw", ...d(0.3) }}>{both}</p>
            <div className="mt-[3cqw] flex w-full flex-1 flex-col justify-evenly">{items(kind === "menu")}</div>
            <Seal a={a} b={b} className="h-[12cqw] w-[12cqw]" style={{ fontSize: "4.2cqw" }} />
          </div>
        );
      case "table":
        return (
          <div className={`${col} justify-center`}>
            {lace}
            <Doily className="aspect-square w-[66cqw]">
              <div>
                <E as="p" path="texts.headline" className="cap block text-[var(--t-accent)]" style={{ fontSize: "2.8cqw" }}>{c.headline}</E>
                <p className="d up leading-none" style={{ fontSize: `${30 * sc}cqw` }}>{c.number}</p>
                <p className="h ink" style={{ fontSize: "4.4cqw" }}>{both}</p>
              </div>
            </Doily>
          </div>
        );
      case "hashtag":
        return (
          <div className={`${col} justify-center gap-[4cqw] px-[11cqw]`}>
            {lace}
            {birch("85%")}
            <Seal a={a} b={b} className="up h-[18cqw] w-[18cqw]" style={{ fontSize: "6.4cqw" }} />
            <E as="p" path="texts.body" className="h ink up block" style={{ fontSize: "8cqw", ...d(0.2) }}>{c.body}</E>
            <E as="p" path="texts.hashtag" className="d up block break-all leading-[1.05]" style={{ fontSize: `${8.4 * sc}cqw`, ...d(0.4) }}>{c.hashtag}</E>
            {cap(both, 2.2)}
          </div>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[40%_1fr]">
            {lace}
            <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#8f9bae,#d8d5cd 70%,var(--t-bg))" }}>
              <div className={`absolute inset-0 ${animate ? "me-snow" : ""}`} style={snow(0.5)} />
              <Birch className="absolute left-[2cqw] bottom-0 h-full w-[16cqw]" />
              <Birch flip className="absolute right-[2cqw] bottom-0 h-[80%] w-[12cqw]" />
            </div>
            <div className="relative z-[1] flex flex-col items-center justify-center gap-[1.6cqw] px-[5cqw] text-center">
              {head(10)}
              <E as="p" multiline path="texts.body" className="it up block text-[var(--t-muted)]" style={{ fontSize: "2.9cqw", lineHeight: 1.4, ...d(0.4) }}>{c.body}</E>
              <p className="h ink write" style={{ fontSize: "5cqw", ...d(0.8) }}>{both}</p>
            </div>
          </div>
        );
      case "greeting":
        return (
          <div className={`${col} justify-center gap-[3cqw] px-[12cqw] py-[14cqw]`}>
            {lace}
            <Seal a={a} b={b} className="h-[16cqw] w-[16cqw]" style={{ fontSize: "5.6cqw" }} />
            <E as="p" path="texts.headline" className="h ink up block" style={{ fontSize: `${11 * sc}cqw`, lineHeight: 1.1, ...d(0.2) }}>{c.headline}</E>
            {names(8, true)}
            {c.body && <E as="p" multiline path="texts.body" className="it up block whitespace-pre-line" style={{ fontSize: "4cqw", lineHeight: 1.55, ...d(0.6) }}>{c.body}</E>}
            {footer()}
          </div>
        );
      default: // invite
        return (
          <div className={`${col} justify-between px-[12cqw] pb-[14cqw] pt-[15cqw]`}>
            {lace}
            {birch("70%")}
            <div className="flex flex-col items-center gap-[2cqw]">
              <Seal a={a} b={b} className="up h-[15cqw] w-[15cqw]" style={{ fontSize: "5.2cqw" }} />
              {cap(c.eyebrow, 2.3, "texts.eyebrow", 0.2)}
            </div>
            {names(13.5)}
            <div className="flex flex-col items-center gap-[2.4cqw]">
              <E as="p" multiline path={c.leadPath} className="h ink up block" style={{ fontSize: "5.2cqw", lineHeight: 1.3, ...d(0.8) }}>{c.lead}</E>
              {when()}
              {footer(5.4)}
            </div>
          </div>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "lora"), ...shellStyle(ratio) }}
      className={`me ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(60,40,20,.5),0_0_0_1px_rgba(0,0,0,.04)] ${className}`}
    >
      <style href="love-me" precedence="default">{CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: GRAIN }} />
      {body}
    </div>
  );
}
