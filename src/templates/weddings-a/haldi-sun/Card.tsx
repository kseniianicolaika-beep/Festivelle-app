"use client";
import type { ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, dateParts, fit, langOf, shapeOf } from "../_shared/data";
import { CardRoot, ff } from "../_shared/ui";
import { lari, MarigoldArt, Splash, Sun, toran, Urli, Wreath } from "./art";
import { FACES, FONTS, sunshine } from "./faces";
import "./haldi.css";

const disp = ff.display;
const YELLOW_BG = "bg-[radial-gradient(120%_85%_at_50%_42%,#ffe27a,#fbc53a_55%,#f4a226)]";

export default function HaldiCard({ kind, profile, theme, design, animate = true, className }: CardProps) {
  const [a, b] = nameParts(profile);
  const c = cardText(kind, design, profile);
  const shape = shapeOf(kind);
  const lang = langOf(profile);
  const dp = dateParts(profile.date, lang);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const still = !animate;
  const longest = b && b.length > a.length ? b : a;
  const ink = "#5a1f08";

  const names = (size: number, row = false) => {
    const s = fit(longest, size * sc, 7);
    return (
      <div data-in className={`haldi-d flex ${row ? "flex-row flex-wrap items-baseline justify-center gap-x-[2cqw]" : "flex-col items-center"} font-bold leading-[0.9]`} style={{ ...disp, color: ink }}>
        <E path="profile.partner1" className="block" style={{ fontSize: `${s}cqw` }}>{a}</E>
        {b && <span className="block leading-none" style={{ ...ff.script, fontSize: `${s * 0.6}cqw`, color: "var(--t-accent)" }}>&amp;</span>}
        {b && <E path="profile.partner2" className="block" style={{ fontSize: `${s}cqw` }}>{b}</E>}
      </div>
    );
  };
  const hand = (t: string, size: number, path?: string, rot = -2) => (path
    ? <E as="p" path={path} className="block" style={{ ...ff.script, fontSize: `${size}cqw`, color: "#9a2f12", transform: `rotate(${rot}deg)` }}>{t}</E>
    : <p data-in style={{ ...ff.script, fontSize: `${size}cqw`, color: "#9a2f12", transform: `rotate(${rot}deg)` }}>{t}</p>);
  const dateLine = (size = 3.8) => (c.date ? <p data-in className="haldi-d font-medium" style={{ ...disp, fontSize: `${size}cqw`, color: ink }}>{c.date}</p> : null);
  const where = (size = 3) => (c.where ? <E as="p" path={c.wherePath} className="block italic" style={{ fontSize: `${size}cqw`, color: ink }}>{c.where}</E> : null);
  const footer = (size = 4.6) => (c.footer ? <E as="p" path={c.footerPath} className="block" style={{ ...ff.script, fontSize: `${size}cqw`, color: "var(--t-accent)" }}>{c.footer}</E> : null);

  const root = (children: ReactNode, bg = YELLOW_BG) => (
    <CardRoot kind={kind} theme={theme} design={design} profile={profile} tplId="haldi-sun" faces={FACES} fonts={FONTS} animate={animate}
      className={`haldi haldi-b wa-paper ${bg} text-[var(--t-ink)] ${className ?? ""}`}
      scene={(k) => {
        k.gsap.from(k.q("[data-toran]"), { y: "-30%", duration: 1.2, ease: "bounce.out", delay: 0.1 });
        k.gsap.from(k.q("[data-lari]"), { y: -700, duration: 1.4, ease: "bounce.out", stagger: 0.1, delay: 0.15 });
        k.gsap.from(k.q("[data-hsun]"), { scale: 0, rotate: -90, transformOrigin: "50% 50%", duration: 1.2, ease: "back.out(2)", delay: 0.4 });
        k.gsap.from(k.q("[data-splash]"), { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 1.4, ease: "power3.out", delay: 0.3 });
        k.gsap.from(k.q("[data-wreath] [data-mg]"), { scale: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.03, delay: 0.2 });
        k.gsap.from(k.q("[data-in]"), { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(2.2)", stagger: 0.1, delay: 0.8 });
      }}>
      {children}
    </CardRoot>
  );
  const splashes = (
    <>
      <Splash className="pointer-events-none absolute -left-[18%] top-[30%] w-[60%] opacity-60" seed={3} color="#ffd34a" />
      <Splash className="pointer-events-none absolute -right-[22%] bottom-[2%] w-[70%] opacity-60" seed={7} color="#f39c34" />
    </>
  );
  // Toran + laris overlay sized in a 500-wide coordinate space, pinned to the top.
  const garlands = (h: number, laris: [number, number][], s = 1) => (
    <MarigoldArt viewBox={`0 0 500 ${h}`} par="xMidYMin slice" className="pointer-events-none absolute inset-0 h-full w-full">
      {(id) => <>{laris.map(([x, len], i) => lari(id, x, 8, len, 0.78 * s, i + 1))}{toran(id, 500, 0.62 * s, 3)}</>}
    </MarigoldArt>
  );

  // Square: post & table — a wreath of genda phool.
  if (shape === "square") {
    return root(
      <>
        {splashes}
        <Wreath className="absolute left-1/2 top-1/2 w-[84%] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ gap: "1.4cqw" }}>
          {kind === "table" ? (
            <>
              {hand(c.headline, 6, "texts.headline")}
              <p data-in className="haldi-d font-bold leading-[0.85]" style={{ ...disp, fontSize: `${26 * sc}cqw`, color: ink }}>{c.number}</p>
            </>
          ) : (
            <>
              {c.eyebrow && hand(c.eyebrow, 4, "texts.eyebrow")}
              {names(9.5)}
              {dateLine(3)}
            </>
          )}
        </div>
      </>,
    );
  }

  // Wide thank-you: laris at both edges under a toran.
  if (shape === "wide") {
    return root(
      <>
        <MarigoldArt viewBox="0 0 700 500" par="xMidYMin slice" className="pointer-events-none absolute inset-0 h-full w-full">
          {(id) => <>{lari(id, 40, 8, 330, 0.85, 1)}{lari(id, 100, 8, 220, 0.75, 2)}{lari(id, 600, 8, 220, 0.75, 4)}{lari(id, 660, 8, 330, 0.85, 5)}{toran(id, 700, 0.7, 3)}</>}
        </MarigoldArt>
        <div className="absolute inset-x-[20%] bottom-[8%] top-[22%] flex flex-col items-center justify-center text-center" style={{ gap: "1.6cqw" }}>
          <E as="p" path="texts.headline" className="haldi-d block font-bold leading-none" style={{ ...disp, fontSize: `${11 * sc}cqw`, color: ink }}>{c.headline}</E>
          <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "2.8cqw", color: ink }}>{c.body}</E>
          {hand(b ? `${a} & ${b}` : a, 4.2)}
        </div>
      </>,
    );
  }

  // Lists: cream tent-panel with a striped shamiana awning.
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    return root(
      <>
        <div className="absolute inset-x-0 top-0" style={{ height: "11cqw", background: "repeating-linear-gradient(90deg,#f7b733 0 6cqw,#fff4d6 6cqw 12cqw)" }} />
        <div className="absolute inset-x-0" style={{ top: "11cqw", height: "3.4cqw", background: "radial-gradient(circle at 25% 0,#f7b733 2.9cqw,transparent 3.05cqw) 0 0/12cqw 3.4cqw repeat-x, radial-gradient(circle at 75% 0,#fff4d6 2.9cqw,transparent 3.05cqw) 0 0/12cqw 3.4cqw repeat-x" }} />
        <div className={`absolute inset-x-[9cqw] bottom-[9cqw] flex flex-col items-center justify-between text-center ${tall ? "top-[24cqw]" : "top-[20cqw]"}`}>
          <div data-in className="flex flex-col items-center">
            <E as="p" path="texts.headline" className="haldi-d block font-bold leading-none" style={{ ...disp, fontSize: `${(tall ? 13 : 10) * sc}cqw`, color: ink }}>{c.headline}</E>
            <p style={{ ...ff.script, fontSize: `${tall ? 5.5 : 4.4}cqw`, color: "var(--t-accent)" }}>{b ? `${a} & ${b}` : a}</p>
          </div>
          <ul data-in className="w-full">
            {c.items.map((x, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: `${tall ? 3 : 1.6}cqw 0` }}>
                <MarigoldArt viewBox="-24 -24 48 48" className={tall ? "mb-[1.4cqw] w-[6cqw]" : "mb-[1cqw] w-[4.4cqw]"}>{(id) => <use href={`#${id}${i % 2 ? "y" : "o"}`} x="-22" y="-22" width="44" height="44" />}</MarigoldArt>
                <E as="p" path={`items.${i}.title`} className="haldi-d block font-semibold" style={{ ...disp, fontSize: `${tall ? 6.4 : 4.6}cqw`, color: ink }}>{x.title}</E>
                {x.detail && <E as="p" path={`items.${i}.detail`} className="block italic" style={{ fontSize: `${tall ? 3.6 : 2.8}cqw`, color: "var(--t-muted)", marginTop: "0.4cqw" }}>{x.detail}</E>}
              </li>
            ))}
          </ul>
          {dateLine(tall ? 3.6 : 3)}
        </div>
      </>,
      "bg-[#fff8ec]",
    );
  }

  // Hashtag: the sun holds the tag.
  if (kind === "hashtag") {
    return root(
      <>
        {splashes}
        <Sun className="absolute left-1/2 top-[44%] w-[108%] -translate-x-1/2 -translate-y-1/2" still={still} />
        {garlands(625, [[30, 260], [470, 260]])}
        <div className="absolute inset-x-[16cqw] top-[44%] flex -translate-y-1/2 flex-col items-center text-center" style={{ gap: "1.6cqw" }}>
          {hand(c.body, 5.4)}
          <E as="p" path="texts.hashtag" className="haldi-d block break-all font-bold leading-[1.02]" style={{ ...disp, fontSize: `${fit(c.hashtag, 9, 13) * sc}cqw`, color: ink }}>{c.hashtag}</E>
        </div>
        <p data-in className="absolute inset-x-0 bottom-[7%] text-center" style={{ ...ff.script, fontSize: "4.6cqw", color: ink }}>{b ? `${a} & ${b}` : a}</p>
      </>,
    );
  }

  // Save the date: the date lives inside the sun.
  if (kind === "save") {
    return root(
      <>
        {splashes}
        {garlands(700, [[28, 330], [472, 330]])}
        <div className="absolute inset-x-[12cqw] top-[17%] flex flex-col items-center text-center" style={{ gap: "1.2cqw" }}>
          {hand(c.eyebrow, 5.4, "texts.eyebrow")}
          {names(10, true)}
        </div>
        <div className="absolute left-1/2 top-[63%] w-[92%] -translate-x-1/2 -translate-y-1/2">
          <Sun className="w-full" still={still} />
          {dp && (
            <div data-in className="absolute inset-0 flex flex-col items-center justify-center" style={{ color: ink }}>
              <p className="haldi-d font-bold leading-[0.85]" style={{ ...disp, fontSize: "20cqw" }}>{dp.day}</p>
              <p className="haldi-d font-medium" style={{ ...disp, fontSize: "5cqw" }}>{dp.month} {dp.year}</p>
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-[5%] text-center">{where(3.4)}</div>
      </>,
    );
  }

  // Tall story & welcome, portrait invite / event / greeting — toran + laris + sun.
  const story = kind === "story", welcome = kind === "welcome";
  const vh = story ? 889 : welcome ? 750 : 700;
  return root(
    <>
      {splashes}
      <Sun className={`absolute left-1/2 w-[112%] -translate-x-1/2 -translate-y-1/2 opacity-90 ${story ? "top-[40%]" : "top-[44%]"}`} still={still} />
      {garlands(vh, story ? [[28, 520], [86, 340], [414, 340], [472, 520]] : [[28, welcome ? 400 : 360], [472, welcome ? 400 : 360]])}
      <div className={`absolute inset-x-[14cqw] flex flex-col items-center text-center ${story ? "top-[22%] bottom-[8%]" : "top-[17%] bottom-[6%]"} ${welcome ? "" : "justify-between"}`} style={{ gap: welcome ? "3cqw" : undefined }}>
        <div className="flex flex-col items-center" style={{ gap: "1.4cqw" }}>
          {kind === "event" ? (
            <>
              <p data-in style={{ fontSize: "2.6cqw", color: ink }} className="italic">{c.lead}</p>
              <E as="p" path="texts.headline" className="block leading-none" style={{ ...ff.script, fontSize: `${10 * sc}cqw`, color: "var(--t-accent)" }}>{c.headline}</E>
            </>
          ) : c.eyebrow ? hand(c.eyebrow, story ? 6 : 4.8, "texts.eyebrow") : null}
          {names(story ? 17 : welcome ? 15 : kind === "event" ? 9 : kind === "greeting" ? 11 : 13.5, kind === "event")}
        </div>
        {kind === "greeting" ? (
          c.body ? <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ fontSize: "3.6cqw", color: ink }}>{c.body}</E> : <span />
        ) : kind === "invite" && c.lead ? (
          <E as="p" multiline path={c.leadPath} className="block max-w-[64cqw] italic leading-snug" style={{ fontSize: "3.2cqw", color: ink }}>{c.lead}</E>
        ) : story ? hand(sunshine(lang), 5.6) : <span />}
        <div className="flex flex-col items-center" style={{ gap: "0.8cqw" }}>
          {dateLine(story ? 4.6 : 3.8)}
          {where(story ? 3.6 : 3)}
          {footer(story ? 5.6 : 4.6)}
        </div>
        {welcome && <div data-in className="mt-auto w-[56%]"><Urli className="w-full" /></div>}
      </div>
    </>,
  );
}
