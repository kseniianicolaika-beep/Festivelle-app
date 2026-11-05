"use client";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { KINDS } from "@/lib/templates";
import { cardCopy, shellStyle, vars, fitName } from "../_shared/kit";
import { CSS, Eucalyptus, LINEN, Memory, Polaroid, Tape, fontClass } from "./art";
import { CAPTIONS } from "./Site";

// SNAPSHOTS OF US stationery — polaroids taped onto linen, eucalyptus, marker handwriting.
export default function Card({ kind, profile: p, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardCopy(kind, design, p, "western");
  const [a, b] = nameParts(p);
  const ratio = KINDS[kind].ratio;
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const d = (s: number) => ({ animationDelay: `${s}s` });
  const lang = p.language === "ru" ? "ru" : p.language === "hi" ? "hi" : "en";
  const caps = CAPTIONS[lang];
  const amp = lang === "ru" ? "и" : "&";
  const both = <>{a}{b && <> {amp} {b}</>}</>;

  const img = (k: number) =>
    k === 2 && photoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img data-edit-photo="photo" src={photoUrl} alt="" className="dev h-full w-full object-cover" style={d(0.8)} />
    ) : (
      <div className="dev h-full w-full" style={d(0.8 + k * 0.1)}><Memory kind={k === 2 ? 3 : k} /></div>
    );
  const pol = (k: number, w: string, pos: React.CSSProperties, r: number, delay: number, cap = true, fs = "3.6cqw") => (
    <div className="absolute" style={{ width: w, ...pos }}>
      <Polaroid className="dropc" style={{ ["--r" as string]: `${r}deg`, animationDelay: `${delay}s`, fontSize: fs } as React.CSSProperties} caption={cap ? caps[k] : undefined} tape={k}>{img(k)}</Polaroid>
    </div>
  );
  const names = (size = 14, inline = true) => (
    <h2 className="h" style={{ fontSize: `${size * sc * fitName(a, b, 8, inline)}cqw` }}>
      <E path="profile.partner1" className={`write inline-block ${inline ? "" : "block"}`} style={d(1.3)}>{a}</E>
      {b && <span className={`di mx-[.2em] text-[.38em] text-[var(--t-accent)] ${inline ? "" : "block"}`}>{amp}</span>}
      {b && <E path="profile.partner2" className={`write inline-block ${inline ? "" : "block"}`} style={d(1.7)}>{b}</E>}
    </h2>
  );
  const cap = (t: React.ReactNode, size = 2.3, path?: string, delay = 1.2) =>
    path ? <E as="p" path={path} className="cap up block text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</E> : <p className="cap up text-[var(--t-accent)]" style={{ fontSize: `${size}cqw`, ...d(delay) }}>{t}</p>;
  const when = (size = 4.4) => (
    <div className="up" style={d(2)}>
      {c.date && <p className="di" style={{ fontSize: `${size}cqw` }}>{c.date}{c.time && <> · {c.time}</>}</p>}
      {c.where && <E as="p" path={c.wherePath} className="cap mt-[.6cqw] block text-[var(--t-muted)]" style={{ fontSize: `${size * 0.5}cqw` }}>{c.where}</E>}
    </div>
  );
  const head = (size = 14) => <E as="p" path="texts.headline" className="h up block" style={{ fontSize: `${size * sc}cqw`, ...d(0.4) }}>{c.headline}</E>;
  const note = (children: React.ReactNode, cls = "", r = -1.5) => (
    <div className={`relative bg-[#fffef8] shadow-[0_2cqw_4cqw_-2cqw_rgba(30,40,30,.5)] ${cls}`} style={{ transform: `rotate(${r}deg)`, backgroundImage: "repeating-linear-gradient(180deg,transparent 0 6.4cqw,rgba(94,125,99,.2) 6.4cqw calc(6.4cqw + 1px))" }}>
      <Tape tone={1} className="-top-[2cqw] left-1/2 h-[5cqw] w-[24cqw] -translate-x-1/2 rotate-2" />
      {children}
    </div>
  );
  const col = "relative z-[1] flex h-full flex-col items-center text-center";

  const body = (() => {
    switch (kind) {
      case "story":
        return (
          <div className="relative h-full">
            {pol(0, "50cqw", { left: "4cqw", top: "8cqw" }, -8, 0.1)}
            {pol(1, "46cqw", { right: "4cqw", top: "22cqw" }, 7, 0.3)}
            {pol(3, "40cqw", { left: "8cqw", top: "58cqw" }, 5, 0.5)}
            {pol(2, "46cqw", { right: "8cqw", top: "66cqw" }, -4, 0.7)}
            <div className="absolute inset-x-[6cqw] bottom-[12cqw] z-[2] text-center">
              {cap(c.eyebrow, 3.2, "texts.eyebrow")}
              {names(17)}
              {when(5)}
            </div>
          </div>
        );
      case "post":
        return (
          <div className="relative h-full">
            {pol(0, "34cqw", { left: "4cqw", top: "6cqw" }, -9, 0.1, false)}
            {pol(2, "36cqw", { left: "32cqw", top: "3cqw" }, 3, 0.3, false)}
            {pol(3, "34cqw", { right: "3cqw", top: "8cqw" }, 8, 0.5, false)}
            <div className="absolute inset-x-[6cqw] bottom-[7cqw] text-center">{names(13)}{cap(c.eyebrow, 2.4, "texts.eyebrow", 2)}</div>
          </div>
        );
      case "save":
        return (
          <div className="relative h-full">
            {pol(2, "54cqw", { left: "23cqw", top: "9cqw" }, -4, 0.2, false)}
            {pol(4, "30cqw", { right: "4cqw", top: "4cqw" }, 9, 0.5, false)}
            <div className="absolute inset-x-[6cqw] bottom-[8cqw] text-center">
              {cap(c.eyebrow, 3, "texts.eyebrow")}
              <p className="d up leading-none" style={{ fontSize: `${16 * sc}cqw`, ...d(1.4) }}>{p.date ? `${p.date.slice(8, 10)}.${p.date.slice(5, 7)}.${p.date.slice(0, 4)}` : ""}</p>
              {names(11)}
              <p className="di text-[var(--t-muted)]" style={{ fontSize: "3.6cqw" }}>{c.lead}{c.where && <> · <E path={c.wherePath}>{c.where}</E></>}</p>
            </div>
          </div>
        );
      case "program":
      case "menu":
        return (
          <div className={`${col} px-[9cqw] py-[10cqw]`}>
            <Eucalyptus className="absolute -right-[4cqw] -top-[4cqw] w-[24cqw] rotate-[200deg]" />
            {head(kind === "menu" ? 20 : 16)}
            <p className="di text-[var(--t-accent)]" style={{ fontSize: "4.4cqw" }}>{both}</p>
            {note(
              <ul className="px-[7cqw] py-[5cqw] text-left">
                {c.items.map((it, i) => (
                  <li key={i} className="up" style={{ padding: `${kind === "menu" ? 2.4 : 1.4}cqw 0`, ...d(0.5 + i * 0.12) }}>
                    <E as="p" path={`items.${i}.title`} className="h block" style={{ fontSize: `${kind === "menu" ? 7.4 : 6.4}cqw` }}>{it.title}</E>
                    {it.detail && <E as="p" path={`items.${i}.detail`} className="di block text-[var(--t-muted)]" style={{ fontSize: `${kind === "menu" ? 3.8 : 3.2}cqw` }}>{it.detail}</E>}
                  </li>
                ))}
              </ul>,
              "mt-[5cqw] w-full flex-1 flex flex-col justify-center",
            )}
          </div>
        );
      case "table":
        return (
          <div className="relative h-full">
            {pol(3, "46cqw", { left: "27cqw", top: "6cqw" }, -3, 0.1, false)}
            <div className="absolute inset-x-0 bottom-[6cqw] z-[2] text-center">
              <E as="p" path="texts.headline" className="cap block text-[var(--t-accent)]" style={{ fontSize: "3cqw" }}>{c.headline}</E>
              <p className="h leading-[.8]" style={{ fontSize: `${22 * sc}cqw` }}>{c.number}</p>
            </div>
          </div>
        );
      case "hashtag":
        return (
          <div className="relative h-full">
            {pol(1, "46cqw", { left: "5cqw", top: "6cqw" }, -7, 0.1, false)}
            {pol(2, "46cqw", { right: "5cqw", top: "12cqw" }, 6, 0.3, false)}
            <div className="absolute inset-x-[7cqw] bottom-[9cqw] z-[2] text-center">
              <E as="p" path="texts.body" className="h up block text-[var(--t-accent)]" style={{ fontSize: "8cqw", ...d(1) }}>{c.body}</E>
              <E as="p" path="texts.hashtag" className="d up block break-all" style={{ fontSize: `${7.6 * sc}cqw`, ...d(1.3) }}>{c.hashtag}</E>
              {cap(both, 2.2, undefined, 1.6)}
            </div>
          </div>
        );
      case "thankyou":
        return (
          <div className="relative grid h-full grid-cols-[46%_1fr]">
            <div className="relative">
              {pol(0, "24cqw", { left: "3cqw", top: "6cqw" }, -8, 0.1, false, "2.4cqw")}
              {pol(2, "26cqw", { left: "16cqw", top: "16cqw" }, 5, 0.3, false, "2.4cqw")}
            </div>
            <div className="relative z-[1] flex flex-col items-center justify-center gap-[1cqw] pr-[5cqw] text-center">
              {head(13)}
              <E as="p" multiline path="texts.body" className="di up block text-[var(--t-muted)]" style={{ fontSize: "2.9cqw", lineHeight: 1.4, ...d(0.6) }}>{c.body}</E>
              <p className="h text-[var(--t-accent)]" style={{ fontSize: "6cqw" }}>{both}</p>
            </div>
          </div>
        );
      case "greeting":
        return (
          <div className={`${col} justify-center gap-[3cqw] px-[9cqw]`}>
            {pol(1, "34cqw", { right: "5cqw", top: "5cqw" }, 8, 0.1, false)}
            <Eucalyptus className="absolute -left-[4cqw] top-[2cqw] w-[22cqw] -rotate-[20deg]" />
            <div className="mt-[30cqw]">{head(16)}</div>
            {c.body && note(<E as="p" multiline path="texts.body" className="h block whitespace-pre-line px-[6cqw] py-[5cqw] text-left" style={{ fontSize: "5.4cqw", lineHeight: "6.4cqw" }}>{c.body}</E>, "w-full")}
            {c.footer && <E as="p" path={c.footerPath} className="h block text-[var(--t-accent)]" style={{ fontSize: "7cqw" }}>{c.footer}</E>}
          </div>
        );
      case "event":
      case "welcome":
      default: // invite
        return (
          <div className="relative h-full">
            {pol(0, "38cqw", { left: "3cqw", top: "5cqw" }, -9, 0.1, kind !== "invite", "3cqw")}
            {pol(2, "42cqw", { left: "29cqw", top: "2cqw" }, 3, 0.3, false)}
            {pol(3, "36cqw", { right: "2cqw", top: "9cqw" }, 9, 0.5, false)}
            <Eucalyptus className="absolute -bottom-[6cqw] -right-[4cqw] w-[24cqw] rotate-[150deg]" />
            <div className="absolute inset-x-[8cqw] bottom-[9cqw] z-[2] flex flex-col items-center gap-[1.6cqw] text-center">
              {cap(c.eyebrow, 2.3, "texts.eyebrow")}
              {kind === "event" ? <><p className="di text-[var(--t-accent)]" style={{ fontSize: "5cqw" }}>{both}</p>{head(15)}</> : names(kind === "welcome" ? 18 : 15, kind !== "welcome")}
              {kind === "invite" && <E as="p" multiline path={c.leadPath} className="di up block" style={{ fontSize: "3.8cqw", lineHeight: 1.35, ...d(2) }}>{c.lead}</E>}
              {when(4)}
              {kind === "invite" && c.footer && <E as="p" path={c.footerPath} className="h block text-[var(--t-accent)]" style={{ fontSize: "6cqw" }}>{c.footer}</E>}
            </div>
          </div>
        );
    }
  })();

  return (
    <div
      lang={p.language ?? "en"}
      style={{ ...vars(theme, design, "playfair"), ...shellStyle(ratio), backgroundImage: LINEN }}
      className={`su ${fontClass} ${animate ? "" : "still"} relative w-full overflow-hidden rounded-[2px] bg-[var(--t-bg)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(30,40,30,.45),0_0_0_1px_rgba(0,0,0,.04)] ${className}`}
    >
      <style href="love-su" precedence="default">{CSS}</style>
      {body}
    </div>
  );
}
