"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Bloom, Jharokha, RokaDefs, Thali, Toran, bandhani } from "./art";

// ROKA MARIGOLD stationery — turmeric card, bandhani dots, a dropping toran, a cusped jharokha and the roka thali.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "indian");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const hi = p.language === "hi", ru = p.language === "ru";
  const shubh = hi ? "॥ शुभ रोका ॥" : ru ? "Шубх Рока" : "Shubh Roka";
  const both = <>{a}{b && <> &amp; {b}</>}</>;

  const names = (size = 12, inline = false) => (
    <h2 className="d leading-[1.02]" style={{ fontSize: `${size * sc * fitName(a, b, 7, inline)}cqw` }}>
      <E path="profile.partner1" className={`pop ${inline ? "" : "block"}`} style={d(0.6)}>{a}</E>
      {b && <span className={`sc pop text-[var(--t-accent)] ${inline ? "mx-[.25em]" : "block"}`} style={{ fontSize: ".45em", ...d(0.8) }}>&amp;</span>}
      {b && <E path="profile.partner2" className={`pop ${inline ? "" : "block"}`} style={d(0.9)}>{b}</E>}
    </h2>
  );
  const pill = (t: React.ReactNode, size = 3) => <div className="up rounded-full bg-[var(--t-accent)] text-[var(--t-surface)]" style={{ padding: `${size * 0.4}cqw ${size * 1.4}cqw`, fontSize: `${size}cqw`, ...d(1.1) }}>{t}</div>;
  const when = (size = 3.2) => (
    <div className="flex flex-col items-center gap-[1.2cqw]">
      {c.date && pill(<>{c.date}{c.time && <> · {c.time}</>}</>, size)}
      {c.where && <E as="p" path={c.wherePath} className="up block text-[var(--t-muted)]" style={{ fontSize: `${size}cqw`, ...d(1.2) }}>{c.where}</E>}
    </div>
  );
  const footer = (size = 5) => (c.footer ? <E as="p" path={c.footerPath} className="sc up block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(1.3) }}>{c.footer}</E> : null);
  const head = (size = 9) => <E as="p" path="texts.headline" className="d pop block leading-[1.05] text-[var(--t-accent)]" style={{ fontSize: `${size * sc}cqw`, ...d(0.4) }}>{c.headline}</E>;
  const toran = (h = 22) => <div className="drop absolute inset-x-0 top-0 z-[2] overflow-hidden"><Toran className="-ml-[40%] w-[180%] max-w-none" laris={h > 20} id={kind} /></div>;
  const toranStyle = (h: number) => ({ height: `${h}cqw` });
  const arch = (inset = "6cqw", top = "16cqw") => (
    <div className="pop absolute" style={{ left: inset, right: inset, top, bottom: inset, ...d(0.3) }}>
      <Jharokha className="h-full w-full" fill="color-mix(in oklab, var(--t-surface) 88%, transparent)" />
    </div>
  );
  const items = (big = false) => (
    <ul className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up flex items-start gap-[2.6cqw] text-left" style={{ padding: `${big ? 2.6 : 1.8}cqw 0`, ...d(0.5 + i * 0.1) }}>
          <Bloom tone={i} className="mt-[.6cqw] shrink-0" style={{ width: `${big ? 6 : 5}cqw` }} />
          <div>
            <E as="p" path={`items.${i}.title`} className="d block" style={{ fontSize: `${big ? 5.4 : 4.4}cqw`, lineHeight: 1.1 }}>{it.title}</E>
            {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3}cqw`, marginTop: ".6cqw", lineHeight: 1.35 }}>{it.detail}</E>}
          </div>
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
            {toran()}
            <div className={`${col} justify-end gap-[3cqw] px-[10cqw] pb-[10cqw]`}>
              <E as="p" path="texts.eyebrow" className="sc up block text-[var(--t-accent)]" style={{ fontSize: "7cqw", ...d(0.5) }}>{c.eyebrow}</E>
              <div className="pop flex items-center gap-[3cqw]" style={d(0.7)}>
                <span className="d leading-none text-[var(--t-accent)]" style={{ fontSize: `${30 * sc}cqw` }}>{p.date ? Number(p.date.slice(8, 10)) : "✿"}</span>
                <span className="d text-left leading-[1.1]" style={{ fontSize: "6cqw" }}>{c.date.replace(/^\d+\s*/, "").split(" ").map((w, i) => <span key={i} className="block">{w}</span>)}</span>
              </div>
              {names(8, true)}
              <p className="up text-[var(--t-muted)]" style={{ fontSize: "3.6cqw", ...d(1) }}>{c.lead}{c.where && <> · <E path={c.wherePath}>{c.where}</E></>}</p>
              <Thali className="pop w-[46cqw]" />
            </div>
          </>
        );
      case "story":
        return (
          <>
            {toran()}
            {arch("7cqw", "34cqw")}
            <div className={`${col} justify-end gap-[3cqw] px-[14cqw] pb-[12cqw]`}>
              <p className="d up text-[var(--t-accent)]" style={{ fontSize: "5cqw", ...d(0.5) }}>{shubh}</p>
              <E as="p" path="texts.eyebrow" className="sc up block text-[var(--t-accent)]" style={{ fontSize: "6cqw", ...d(0.6) }}>{c.eyebrow}</E>
              {names(15)}
              {when(3.6)}
              <Thali className="pop w-[60cqw]" />
            </div>
          </>
        );
      case "post":
        return (
          <>
            {toran()}
            <div className={`${col} justify-end gap-[2cqw] px-[8cqw] pb-[7cqw]`}>
              <p className="d up text-[var(--t-accent)]" style={{ fontSize: "4cqw", ...d(0.4) }}>{shubh}</p>
              {names(11, true)}
              <E as="p" path="texts.eyebrow" className="sc up block text-[var(--t-accent)]" style={{ fontSize: "5cqw", ...d(0.9) }}>{c.eyebrow}</E>
              {when(2.8)}
              <Thali className="pop w-[40cqw]" />
            </div>
          </>
        );
      case "event":
      case "welcome":
        return (
          <>
            {toran()}
            {arch("7cqw", "30cqw")}
            <div className={`${col} justify-end gap-[2.8cqw] px-[15cqw] pb-[13cqw]`}>
              <E as="p" path="texts.eyebrow" className="up block text-[var(--t-muted)]" style={{ fontSize: "3.4cqw", ...d(0.4) }}>{c.eyebrow}</E>
              {kind === "event" ? <><p className="sc up text-[var(--t-accent)]" style={{ fontSize: "6cqw", ...d(0.5) }}>{both}</p>{head(11)}</> : names(15)}
              {when(3.2)}
              <Thali className="pop w-[44cqw]" />
            </div>
          </>
        );
      case "program":
      case "menu":
        return (
          <>
            <div className="drop absolute inset-x-0 top-0 z-[2]" style={toranStyle(14)}><Toran className="h-full w-full" laris={false} /></div>
            <div className={`${col} px-[10cqw] pb-[9cqw] pt-[20cqw]`}>
              {head(kind === "menu" ? 13 : 10)}
              <p className="sc text-[var(--t-accent)]" style={{ fontSize: "5cqw" }}>{both}</p>
              <div className="mt-[3cqw] w-full flex-1 rounded-[4cqw] bg-[var(--t-surface)]/85 px-[6cqw] py-[3cqw] shadow-[0_3cqw_6cqw_-4cqw_rgba(140,60,0,.4)]"><div className="flex h-full flex-col justify-evenly">{items(kind === "menu")}</div></div>
            </div>
          </>
        );
      case "table":
        return (
          <>
            <div className="drop absolute inset-x-0 top-0 z-[2]" style={toranStyle(16)}><Toran className="h-full w-full" laris={false} /></div>
            <div className={`${col} justify-center pt-[10cqw]`}>
              <div className="relative flex h-[60cqw] w-[60cqw] items-center justify-center">
                {Array.from({ length: 20 }, (_, i) => <Bloom key={i} tone={i} className="absolute w-[9cqw]" style={{ left: `${(50 + Math.cos((i / 20) * Math.PI * 2) * 44 - 4.5).toFixed(2)}%`, top: `${(50 + Math.sin((i / 20) * Math.PI * 2) * 44 - 4.5).toFixed(2)}%` }} />)}
                <div>
                  <E as="p" path="texts.headline" className="block text-[var(--t-muted)]" style={{ fontSize: "4cqw" }}>{c.headline}</E>
                  <p className="d pop leading-none text-[var(--t-accent)]" style={{ fontSize: `${30 * sc}cqw` }}>{c.number}</p>
                </div>
              </div>
              <p className="sc mt-[2cqw] text-[var(--t-accent)]" style={{ fontSize: "5cqw" }}>{both}</p>
            </div>
          </>
        );
      case "hashtag":
        return (
          <>
            {toran()}
            <div className={`${col} justify-end gap-[3.4cqw] px-[9cqw] pb-[11cqw]`}>
              <E as="p" path="texts.body" className="sc up block text-[var(--t-accent)]" style={{ fontSize: "7cqw", ...d(0.4) }}>{c.body}</E>
              <div className="pop rounded-[4cqw] bg-[var(--t-accent)] px-[5cqw] py-[3cqw] shadow-[0_3cqw_6cqw_-3cqw_rgba(160,40,10,.6)]" style={d(0.6)}>
                <E as="p" path="texts.hashtag" className="d block break-all leading-[1.1] text-[var(--t-surface)]" style={{ fontSize: `${8 * sc}cqw` }}>{c.hashtag}</E>
              </div>
              <p className="text-[var(--t-muted)]" style={{ fontSize: "3.2cqw" }}>{both} · {shubh}</p>
              <Thali className="pop w-[48cqw]" />
            </div>
          </>
        );
      case "thankyou":
        return (
          <>
            <div className="drop absolute inset-x-0 top-0 z-[2]" style={toranStyle(14)}><Toran className="h-full w-full" laris={false} /></div>
            <div className="relative z-[1] grid h-full grid-cols-[42%_1fr] items-center gap-[3cqw] px-[6cqw] pt-[10cqw]">
              <Thali className="pop w-full" />
              <div className="flex flex-col items-center gap-[1.6cqw] text-center">
                {head(10)}
                <E as="p" multiline path="texts.body" className="up block text-[var(--t-muted)]" style={{ fontSize: "2.8cqw", lineHeight: 1.4, ...d(0.6) }}>{c.body}</E>
                <p className="sc up text-[var(--t-accent)]" style={{ fontSize: "4.4cqw", ...d(0.8) }}>{both}</p>
              </div>
            </div>
          </>
        );
      case "greeting":
        return (
          <>
            {toran(18)}
            <div className={`${col} justify-end gap-[3cqw] px-[11cqw] pb-[10cqw]`}>
              <E as="p" path="texts.headline" className="sc pop block text-[var(--t-accent)]" style={{ fontSize: `${11 * sc}cqw`, lineHeight: 1.1, ...d(0.4) }}>{c.headline}</E>
              {names(8, true)}
              {c.body && <E as="p" multiline path="texts.body" className="up block whitespace-pre-line" style={{ fontSize: "3.8cqw", lineHeight: 1.5, ...d(0.8) }}>{c.body}</E>}
              {footer()}
              <Thali className="pop w-[42cqw]" />
            </div>
          </>
        );
      default: // invite
        return (
          <>
            {toran()}
            {arch("6cqw", "28cqw")}
            <div className={`${col} justify-end gap-[2.6cqw] px-[13cqw] pb-[11cqw]`}>
              <p className="d up text-[var(--t-accent)]" style={{ fontSize: "4.4cqw", ...d(0.5) }}>{shubh}</p>
              <E as="p" path="texts.eyebrow" className="cap up block text-[var(--t-muted)]" style={{ fontSize: "2.6cqw", ...d(0.5) }}>{c.eyebrow}</E>
              {names(12.5)}
              <E as="p" multiline path={c.leadPath} className="up block" style={{ fontSize: "3.5cqw", lineHeight: 1.4, ...d(1) }}>{c.lead}</E>
              {when(3)}
              {footer(4.6)}
              <Thali className="pop w-[40cqw]" />
            </div>
          </>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "royal"), ...shellStyle(ratio) }}
      className={`rk ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-bg)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(140,60,0,.55),0_0_0_1px_rgba(0,0,0,.04)] ${className}`}
    >
      <style href="love-rk" precedence="default">{CSS}</style>
      <RokaDefs />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: `${bandhani()}, radial-gradient(80% 60% at 50% 55%, #ffe9a8, transparent 75%)`, backgroundSize: "4.6cqw 4.6cqw, 100% 100%" }} />
      {body}
    </div>
  );
}
