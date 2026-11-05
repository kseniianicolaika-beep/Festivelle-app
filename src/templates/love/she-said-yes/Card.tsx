"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, GRAIN, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, Sunset, fontClass } from "./art";

// SHE SAID YES stationery — film-still cards: full-bleed photo, letterbox bars, a stamped YES. and a bold date.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "western");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const ru = p.language === "ru", hi = p.language === "hi";
  const amp = ru ? "и" : "&";
  const yes = ru ? "ДА." : hi ? "हाँ!" : "YES.";
  const dd = p.date ? `${p.date.slice(8, 10)}.${p.date.slice(5, 7)}.${p.date.slice(2, 4)}` : "";
  const both = <>{a}{b && <> {amp} {b}</>}</>;

  const photo = (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img data-edit-photo="photo" src={photoUrl} alt="" className="ken h-full w-full object-cover" />
      ) : (
        <div data-edit-photo="photo" className="h-full w-full"><Sunset className="ken h-full w-full" /></div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.2),transparent_30%,transparent_50%,rgba(30,10,10,.8))]" />
      <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  );
  const bars = (h = 8, top: React.ReactNode = null, bottom: React.ReactNode = null) => (
    <>
      <div className="bar absolute inset-x-0 top-0 z-[4] flex items-end justify-between bg-black px-[4cqw] pb-[1.2cqw]" style={{ ["--bar" as string]: `${h}%`, height: `${h}%` } as React.CSSProperties}>{top}</div>
      <div className="bar absolute inset-x-0 bottom-0 z-[4] flex items-start justify-between bg-black px-[4cqw] pt-[1.2cqw]" style={{ ["--bar" as string]: `${h}%`, height: `${h}%` } as React.CSSProperties}>{bottom}</div>
    </>
  );
  const mono = (t: React.ReactNode, cls = "text-white/75", size = 2) => <p className={`m ${cls}`} style={{ fontSize: `${size}cqw` }}>{t}</p>;
  const stamp = (size = 34) => <p className="d stamp sun select-none" style={{ fontSize: `${size * sc}cqw` }}>{yes}</p>;
  const names = (size = 9) => (
    <h2 className="d" style={{ fontSize: `${size * sc * fitName(a, b, 7, true)}cqw` }}>
      <E path="profile.partner1" className="up" style={d(1.9)}>{a}</E>
      {b && <span className="it mx-[.2em] text-[.5em] text-[#ffcf88]">{amp}</span>}
      {b && <E path="profile.partner2" className="up" style={d(2)}>{b}</E>}
    </h2>
  );
  const items = (big = false) => (
    <ol className="w-full">
      {c.items.map((it, i) => (
        <li key={i} className="up grid grid-cols-[auto_1fr] items-baseline gap-x-[3cqw] border-b border-[var(--t-ink)]/20" style={{ padding: `${big ? 3 : 2.2}cqw 0`, ...d(0.3 + i * 0.1) }}>
          <span className="d text-[var(--t-accent)]" style={{ fontSize: `${big ? 6 : 5}cqw` }}>{String(i + 1).padStart(2, "0")}</span>
          <div>
            <E as="p" path={`items.${i}.title`} className="d block" style={{ fontSize: `${big ? 5.4 : 4.6}cqw`, lineHeight: 1 }}>{it.title}</E>
            {it.detail && <E as="p" path={`items.${i}.detail`} className="it block text-[var(--t-muted)]" style={{ fontSize: `${big ? 3.6 : 3.1}cqw`, marginTop: ".8cqw" }}>{it.detail}</E>}
          </div>
        </li>
      ))}
    </ol>
  );

  const film = (opts: { yes?: number; names?: number; date?: number; extra?: React.ReactNode; bar?: number }) => (
    <div className="relative h-full text-[#fff6ea]">
      {photo}
      <div className="absolute inset-0 z-[2] flex items-center justify-center pb-[10%]">{stamp(opts.yes ?? 34)}</div>
      <div className="absolute inset-x-[5cqw] bottom-[12%] z-[3] flex flex-col gap-[1.6cqw]">
        {opts.extra}
        <div className="flex flex-wrap items-end justify-between gap-x-[3cqw]">
          <div>{names(opts.names ?? 9)}</div>
          {dd && <p className="d outline up text-right" style={{ fontSize: `${opts.date ?? 9}cqw`, ...d(2.1) }}>{dd}</p>}
        </div>
      </div>
      {bars(opts.bar ?? 8, mono(<>{hi ? "दृश्य 01" : ru ? "Сцена 01" : "Scene 01"} — {c.where && <E path={c.wherePath}>{c.where}</E>}</>), mono(c.date, "text-[#ffcf88]"))}
    </div>
  );

  const paper = (children: React.ReactNode, pad = "px-[9cqw] py-[11cqw]") => (
    <div className={`relative flex h-full flex-col ${pad}`}>
      <div className="absolute inset-x-0 top-0 h-[2.4cqw] bg-[var(--t-ink)]" />
      <div className="absolute inset-x-0 bottom-0 h-[2.4cqw] bg-[var(--t-ink)]" />
      {children}
    </div>
  );

  const body = (() => {
    switch (kind) {
      case "story":
        return film({ yes: 40, names: 11, date: 10, bar: 7, extra: <><E as="p" path="texts.eyebrow" className="m up block text-[#ffcf88]" style={{ fontSize: "2.8cqw", ...d(1.8) }}>{c.eyebrow}</E>{c.footer && <E as="p" path={c.footerPath} className="it block" style={{ fontSize: "4.4cqw" }}>{c.footer}</E>}</> });
      case "post":
        return film({ yes: 30, names: 7, date: 7, bar: 9 });
      case "save":
        return (
          <div className="relative h-full text-[#fff6ea]">
            {photo}
            <div className="absolute inset-x-[5cqw] top-[13%] z-[3]"><E as="p" path="texts.eyebrow" className="d up block" style={{ fontSize: `${12 * sc}cqw`, ...d(0.4) }}>{c.eyebrow}</E></div>
            <div className="absolute inset-x-[5cqw] bottom-[12%] z-[3] flex flex-col gap-[1cqw]">
              <p className="d sun stamp" style={{ fontSize: `${19 * sc}cqw` }}>{dd}</p>
              <div className="flex items-baseline justify-between">{names(6.5)}<p className="it" style={{ fontSize: "3.6cqw" }}>{c.lead}</p></div>
            </div>
            {bars(8, mono(c.where && <E path={c.wherePath}>{c.where}</E>), mono(yes, "text-[#ffcf88]"))}
          </div>
        );
      case "event":
      case "welcome":
      case "hashtag":
        return paper(
          <div className="flex h-full flex-col justify-between">
            <div>
              <E as="p" path={kind === "hashtag" ? "texts.body" : "texts.eyebrow"} className="m up block text-[var(--t-accent)]" style={{ fontSize: "2.4cqw", ...d(0.2) }}>{kind === "hashtag" ? c.body : c.eyebrow}</E>
              {kind === "event" && <E as="p" path="texts.headline" className="d up mt-[3cqw] block" style={{ fontSize: `${15 * sc}cqw`, ...d(0.4) }}>{c.headline}</E>}
              {kind === "welcome" && <h2 className="d up mt-[3cqw]" style={{ fontSize: `${16 * sc}cqw`, ...d(0.4) }}><E path="profile.partner1">{a}</E>{b && <><span className="it mx-[.15em] text-[.45em] text-[var(--t-accent)]">{amp}</span><br /><E path="profile.partner2">{b}</E></>}</h2>}
              {kind === "hashtag" && <E as="p" path="texts.hashtag" className="d sun up mt-[3cqw] block break-all" style={{ fontSize: `${8.4 * sc}cqw`, ...d(0.4) }}>{c.hashtag}</E>}
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden">{photo}<div className="absolute inset-0 z-[2] flex items-center justify-center">{stamp(16)}</div></div>
            <div className="flex items-end justify-between gap-[3cqw]">
              <div>
                {kind === "event" && <p className="d" style={{ fontSize: "6cqw" }}>{both}</p>}
                <p className="it" style={{ fontSize: "3.8cqw" }}>{kind === "hashtag" ? both : <>{c.time && <>{c.time} · </>}{c.where && <E path={c.wherePath}>{c.where}</E>}</>}</p>
              </div>
              {dd && <p className="d outline [--ol:var(--t-accent)]" style={{ fontSize: "9cqw" }}>{dd}</p>}
            </div>
          </div>,
        );
      case "program":
      case "menu":
        return paper(
          <>
            <E as="p" path="texts.headline" className="d up block" style={{ fontSize: `${(kind === "menu" ? 18 : 13) * sc}cqw`, ...d(0.2) }}>{c.headline}</E>
            <p className="it mt-[1cqw] text-[var(--t-accent)]" style={{ fontSize: "4.4cqw" }}>{both} · {dd}</p>
            <div className="mt-[4cqw] flex flex-1 flex-col justify-center">{items(kind === "menu")}</div>
            <p className="d sun" style={{ fontSize: "12cqw" }}>{yes}</p>
          </>,
        );
      case "table":
        return (
          <div className="relative h-full text-[#fff6ea]">
            {photo}
            <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center">
              <E as="p" path="texts.headline" className="m block" style={{ fontSize: "3cqw" }}>{c.headline}</E>
              <p className="d sun stamp" style={{ fontSize: `${48 * sc}cqw` }}>{c.number}</p>
            </div>
            {bars(10, mono(both), mono(yes, "text-[#ffcf88]"))}
          </div>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[48%_1fr]">
            <div className="relative overflow-hidden text-[#fff6ea]">{photo}<div className="absolute inset-0 z-[2] flex items-center justify-center">{stamp(18)}</div></div>
            <div className="flex flex-col justify-center gap-[2cqw] px-[5cqw]">
              <E as="p" path="texts.headline" className="d up block" style={{ fontSize: `${10 * sc}cqw`, ...d(0.3) }}>{c.headline}</E>
              <E as="p" multiline path="texts.body" className="it up block" style={{ fontSize: "3cqw", lineHeight: 1.35, ...d(0.5) }}>{c.body}</E>
              <p className="m text-[var(--t-accent)]" style={{ fontSize: "2.2cqw" }}>{both}</p>
            </div>
          </div>
        );
      case "greeting":
        return paper(
          <div className="flex h-full flex-col justify-between">
            <E as="p" path="texts.headline" className="d sun up block" style={{ fontSize: `${17 * sc}cqw`, ...d(0.2) }}>{c.headline}</E>
            {c.body && <E as="p" multiline path="texts.body" className="it up block whitespace-pre-line" style={{ fontSize: "4.6cqw", lineHeight: 1.4, ...d(0.5) }}>{c.body}</E>}
            <div className="flex items-end justify-between">
              <p className="d" style={{ fontSize: "6cqw" }}>{both}</p>
              {c.footer && <E as="p" path={c.footerPath} className="it block text-[var(--t-accent)]" style={{ fontSize: "4cqw" }}>{c.footer}</E>}
            </div>
          </div>,
        );
      default: // invite
        return (
          <div className="relative h-full text-[#fff6ea]">
            {photo}
            <div className="absolute inset-x-[6cqw] top-[12%] z-[3]">
              <E as="p" path="texts.eyebrow" className="m up block text-[#ffcf88]" style={{ fontSize: "2.3cqw", ...d(1.8) }}>{c.eyebrow}</E>
            </div>
            <div className="absolute inset-0 z-[2] flex items-center justify-center pb-[22%]">{stamp(32)}</div>
            <div className="absolute inset-x-[6cqw] bottom-[11%] z-[3] flex flex-col gap-[2cqw]">
              {names(10)}
              <E as="p" multiline path={c.leadPath} className="it up block" style={{ fontSize: "3.8cqw", lineHeight: 1.3, ...d(2.2) }}>{c.lead}</E>
              <div className="flex items-end justify-between">
                <p className="m" style={{ fontSize: "2.1cqw" }}>{c.date}{c.time && <> · {c.time}</>}</p>
                {dd && <p className="d outline" style={{ fontSize: "8cqw" }}>{dd}</p>}
              </div>
              {c.footer && <E as="p" path={c.footerPath} className="it block text-[#ffcf88]" style={{ fontSize: "3.6cqw" }}>{c.footer}</E>}
            </div>
            {bars(7, mono(c.where && <E path={c.wherePath}>{c.where}</E>), mono(p.city ?? "", "text-[#ffcf88]"))}
          </div>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "modern"), ...shellStyle(ratio) }}
      className={`sy ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(60,20,10,.55)] ${className}`}
    >
      <style href="love-sy" precedence="default">{CSS}</style>
      {body}
    </div>
  );
}
