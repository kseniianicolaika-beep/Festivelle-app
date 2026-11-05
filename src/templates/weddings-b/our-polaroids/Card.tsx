"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, grain, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { CalendarPage, Heart, NoPhoto, Polaroid, Postmark, Scribble, Star, Stamp, Tape, Underline } from "./art";
import { POLAROID_LOOK } from "./look";
import { s, PolaroidStyles } from "./styles";

const hand: CSSProperties = { fontFamily: "var(--ws)" };
const cq = (n: number) => `${n}cqw`;
const STICKY = ["#fde58a", "#f9c6c9", "#c8e6d3", "#c9daf2"];

export default function PolaroidCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const both = `${c.a}${c.b ? ` & ${c.b}` : ""}`;
  const us = c.lang === "ru" ? "мы ♥" : c.lang === "hi" ? "हम ♥" : "us ♥";

  useStage(ref, (g, q) => {
    g.timeline({ defaults: { ease: "power3.out" } })
      .from(q("[data-polaroid]"), { y: -40, rotate: "-=10", opacity: 0, duration: 1, stagger: 0.15, ease: "back.out(1.3)" }, 0)
      .from(q("[data-tape]"), { scale: 1.4, opacity: 0, duration: 0.4, stagger: 0.08 }, 0.6)
      .fromTo(q("[data-develop]"), { opacity: 1 }, { opacity: 0, duration: 2.6, ease: "power1.inOut" }, 0.5)
      .from(q("[data-in]"), { opacity: 0, y: 10, duration: 0.8, stagger: 0.08 }, 0.4)
      .fromTo(q("[data-write]"), { clipPath: "inset(-30% 100% -30% 0)" }, { clipPath: "inset(-30% 0% -30% 0)", duration: 1.1, stagger: 0.4, ease: "steps(12)" }, 0.6)
      .from(q("[data-draw]"), { drawSVG: 0, duration: 0.8, stagger: 0.06, ease: "power1.inOut" }, 1.2);
  }, [kind], animate);

  const photo = (seed = 1) => photoUrl
    // eslint-disable-next-line @next/next/no-img-element
    ? <img data-edit-photo="photo" src={photoUrl} alt="" />
    : <NoPhoto seed={seed} />;
  const names = (size: number, color = "#2b2724") => {
    const sz = fit(both, size * scale, 84, 0.42);
    return (
      <h2 data-write className="font-bold leading-[0.95]" style={{ ...hand, fontSize: cq(sz), color }}>
        <E path="profile.partner1">{c.a}</E>{c.b && <><span className="text-[#d2462e]"> &amp; </span><E path="profile.partner2">{c.b}</E></>}
      </h2>
    );
  };
  const label = (children: ReactNode, rot = -1.5, size = 2.3) => (
    <span data-in className={`${s.label} uppercase text-[#2b2724]`} style={{ fontSize: cq(size), transform: `rotate(${rot}deg)`, padding: `${cq(size * 0.5)} ${cq(size * 1.1)}` }}>{children}</span>
  );
  const dateLabel = (size = 2.3, rot = 1.5) => dp && label(<>{dp.dd}.{dp.mm}.{dp.year}{c.time && kind !== "save" ? ` · ${c.time}` : ""}</>, rot, size);
  const whereLabel = (size = 2.1, rot = -1.5) => c.where && label(c.venue && kind !== "save" ? <E path="profile.venue">{c.where}</E> : c.where, rot, size);
  const footer = (size = 4.6) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block text-[#2b2724]/80" style={{ ...hand, fontSize: cq(size) }}>{c.footer}</E>;
  const pol = (w: number, rot: number, cap?: ReactNode, capSize = 5, tape = 0, tapes: 0 | 1 | 2 = 1, seed = 1) => (
    <Polaroid develop={animate} tape={tape} tapes={tapes} className="shrink-0" style={{ width: cq(w), transform: `rotate(${rot}deg)` }} captionClass="" caption={cap != null ? <span style={{ fontSize: cq(capSize) }}>{cap}</span> : undefined}>{photo(seed)}</Polaroid>
  );
  const col = (gap: number, children: ReactNode, cls = "") => <div className={`relative flex h-full flex-col items-center justify-center text-center ${cls}`} style={{ gap: cq(gap) }}>{children}</div>;

  let body: ReactNode;
  switch (kind) {
    case "save":
      body = col(3, <>
        <E as="p" path="texts.eyebrow" className="block text-[#d2462e]" style={{ ...hand, fontSize: cq(9), lineHeight: 1, transform: "rotate(-3deg)" }}><span data-write className="inline-block">{c.eyebrow}!</span></E>
        <div data-in style={{ width: cq(70), transform: "rotate(-2deg)" }}><CalendarPage iso={c.iso} lang={c.lang} style={{ fontSize: cq(3.4) }} /></div>
        {names(8.5)}
        <div className="flex flex-wrap items-center justify-center" style={{ gap: cq(2) }}>{whereLabel(2.3)}</div>
        <p data-in className={s.mono} style={{ fontSize: cq(2), color: "#7b6f63" }}>{c.sub}</p>
      </>);
      break;
    case "event":
      body = col(4.4, <>
        {names(10)}
        <p data-in className="text-[#2b2724]/80" style={{ ...hand, fontSize: cq(5.4) }}>{c.lead}</p>
        <div data-in className={`${s.sticky} relative`} style={{ background: STICKY[0], width: cq(72), transform: "rotate(-2.5deg)", padding: `${cq(8)} ${cq(6)}` }}>
          <Tape i={1} className="!left-[28%] !top-[-8%] !h-[16%] !w-[44%]" />
          <E as="h3" path="texts.headline" className="block font-bold leading-[1]" style={{ ...hand, fontSize: cq(fit(c.headline, 13, 60, 0.45)) }}>{c.headline}</E>
          {c.time && <p className="mt-[2cqw] text-[#d2462e]" style={{ ...hand, fontSize: cq(8) }}>{c.time}</p>}
          <Heart className="absolute bottom-[8%] right-[7%] w-[10cqw] rotate-12" />
        </div>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: cq(2.4) }}>{dp && label(c.date, 1.5, 2.6)}{whereLabel(2.6)}</div>
      </>);
      break;
    case "story":
      body = col(5, <>
        <E as="p" path="texts.eyebrow" className="block text-[#d2462e]" style={{ ...hand, fontSize: cq(8), transform: "rotate(-3deg)" }}><span data-write className="inline-block">{c.eyebrow}!</span></E>
        <div className="relative" style={{ width: cq(80), height: cq(92) }}>
          <div className="absolute left-0 top-[6%]">{pol(56, -8, "♥", 6, 3, 1, 3)}</div>
          <div className="absolute right-0 top-0">{pol(58, 6, us, 5.4, 0, 2, 1)}</div>
        </div>
        {names(13)}
        <div data-in style={{ width: cq(60) }}><Underline className="h-[4cqw] w-full" /></div>
        <div className="flex flex-col items-center" style={{ gap: cq(2.4) }}>{dateLabel(3.2)}{whereLabel(2.8)}</div>
      </>);
      break;
    case "post":
      body = col(2.6, <>
        <E as="p" path="texts.eyebrow" className="block text-[#d2462e]" style={{ ...hand, fontSize: cq(6.4), transform: "rotate(-2deg)" }}><span data-write className="inline-block">{c.eyebrow}!</span></E>
        <Polaroid develop={animate} tapes={2} tape={0} style={{ width: cq(54), transform: "rotate(3deg)" }} caption={<span className="font-bold" style={{ fontSize: cq(fit(both, 5.4, 46, 0.42)) }}>{both}</span>}>{photo()}</Polaroid>
        <div className="flex items-center" style={{ gap: cq(2) }}>{dateLabel(2.1)}</div>
      </>);
      break;
    case "welcome":
      body = col(3.4, <>
        <E as="p" path="texts.eyebrow" className="block text-[#2b2724]/80" style={{ ...hand, fontSize: cq(5.4) }}>{c.eyebrow}</E>
        {pol(58, -3, "♥", 6, 1, 2)}
        {names(12)}
        <div data-in style={{ width: cq(58) }}><Underline className="h-[3.6cqw] w-full" /></div>
        {dateLabel(2.5)}
      </>);
      break;
    case "program":
    case "menu": {
      const menu = kind === "menu";
      body = (
        <div className={`${s.ruled} relative h-full text-left text-[#2b2724]`} style={{ fontSize: cq(menu ? 4.6 : 3.4), padding: `${cq(menu ? 14 : 9)} ${cq(menu ? 9 : 8)} ${cq(8)} ${cq(menu ? 15 : 13)}` }}>
          <span className={s.pin} style={{ left: "50%", top: cq(3), marginLeft: -7 }} />
          <E as="h3" path="texts.headline" className="block font-bold leading-none" style={{ ...hand, fontSize: cq(menu ? 13 : 9) }}><span data-write className="inline-block">{c.headline}</span></E>
          <div data-in style={{ width: cq(menu ? 50 : 44) }}><Underline className="h-[3cqw] w-full" /></div>
          <p data-in className="text-[#d2462e]" style={{ ...hand, fontSize: cq(menu ? 6 : 4.6), lineHeight: "1.9em" }}>{both}</p>
          <ul className="mt-[1.9em]" style={{ display: "flex", flexDirection: "column", gap: menu ? "1.9em" : "0.95em" }}>
            {c.items.map((it, i) => (
              <li data-in key={i} className="relative">
                <span className="absolute" style={{ left: menu ? "-1.6em" : "-1.5em", top: "0.15em", fontSize: "1em" }}>
                  {menu ? <Heart className="w-[0.9em]" /> : <span className="inline-block h-[0.85em] w-[0.85em] rounded-[2px] border border-[#2b2724]/70 align-middle" />}
                  {!menu && <svg viewBox="0 0 20 20" className="absolute left-[0.05em] top-[-0.25em] w-[1.1em]" fill="none" stroke="#d2462e" strokeWidth="2.6" strokeLinecap="round"><path data-draw d="M3 10l5 6L18 2" /></svg>}
                </span>
                <E as="p" path={`items.${i}.title`} className="block font-bold leading-[1.1]" style={{ ...hand, fontSize: "1.55em" }}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className={`${s.mono} block leading-snug opacity-75`} style={{ fontSize: "0.62em", marginTop: "0.3em" }}>{it.detail}</E>}
              </li>
            ))}
          </ul>
          <div className="absolute flex justify-end" style={{ right: cq(7), bottom: cq(7) }}>{dateLabel(menu ? 3 : 2.2)}</div>
        </div>
      );
      break;
    }
    case "table":
      body = col(0, <>
        <Polaroid tapes={2} tape={2} style={{ width: cq(66), transform: "rotate(-3deg)" }} caption={<span style={{ fontSize: cq(6) }}><E path="texts.headline">{c.headline}</E></span>}>
          <div className={`${s.paper} absolute inset-0 grid place-items-center`}>
            <span className="relative font-bold leading-none text-[#d2462e]" style={{ ...hand, fontSize: cq(36) }}>
              {c.number}
              <Scribble className="absolute left-[-40%] top-[-10%] h-[120%] w-[180%]" seed={c.number + 2} />
            </span>
          </div>
        </Polaroid>
        <p data-in className="mt-[4cqw] text-[#2b2724]" style={{ ...hand, fontSize: cq(5) }}>{both}</p>
      </>);
      break;
    case "hashtag":
      body = col(3.4, <>
        <E as="p" path="texts.body" className="block text-[#2b2724]/80" style={{ ...hand, fontSize: cq(5.6), maxWidth: cq(76), lineHeight: 1.05 }}>{c.body}</E>
        <Polaroid develop={animate} tapes={2} tape={4} style={{ width: cq(62), transform: "rotate(-2.5deg)" }} caption={<E path="texts.hashtag" className="font-bold text-[#d2462e]" style={{ fontSize: cq(fit(c.hashtag, 6.4, 54, 0.42)) }}>{c.hashtag}</E>}>{photo()}</Polaroid>
        <div className="flex items-center" style={{ gap: cq(3) }}><Star className="w-[5cqw]" /><span data-in className="text-[#2b2724]" style={{ ...hand, fontSize: cq(4.6) }}>{both}</span><Star className="w-[5cqw]" /></div>
      </>);
      break;
    case "thankyou":
      body = (
        <div className="relative grid h-full grid-cols-[1fr_1.1fr] items-center" style={{ gap: cq(4) }}>
          <div className="relative h-full">
            <div className="absolute left-[2%] top-[14%]">{pol(30, -9, undefined, 4, 3, 1, 3)}</div>
            <div className="absolute left-[30%] top-[22%]">{pol(30, 6, "♥", 4.2, 0, 1, 1)}</div>
          </div>
          <div className="flex flex-col items-start text-left" style={{ gap: cq(1.6) }}>
            <E as="h3" path="texts.headline" className="block font-bold leading-[0.9] text-[#d2462e]" style={{ ...hand, fontSize: cq(fit(c.headline, 11, 46, 0.42)) }}><span data-write className="inline-block">{c.headline}!</span></E>
            <div data-in style={{ width: cq(34) }}><Underline className="h-[2.4cqw] w-full" /></div>
            <E as="p" multiline path="texts.body" className="block text-[#2b2724]" style={{ ...hand, fontSize: cq(3.6), lineHeight: 1.15 }}>{c.body}</E>
            <p data-in className="mt-[1cqw] font-bold text-[#2b2724]" style={{ ...hand, fontSize: cq(4.6) }}>xoxo, {both}</p>
          </div>
        </div>
      );
      break;
    case "greeting":
      body = col(3.4, <>
        <E as="p" path="texts.eyebrow" className="block text-[#d2462e]" style={{ ...hand, fontSize: cq(5.4) }}>{c.eyebrow}</E>
        {names(11)}
        {pol(46, 3, "♥", 6, 1, 1)}
        {c.body && <div data-in className={`${s.ruled} relative text-left`} style={{ width: cq(76), padding: `${cq(4)} ${cq(5)} ${cq(4)} ${cq(9)}`, fontSize: cq(3.2), transform: "rotate(-1deg)", "--rule": cq(6.6), "--pt": cq(4) } as CSSProperties}>
          <E as="p" multiline path="texts.body" className="block text-[#2b2724]" style={{ ...hand, fontSize: cq(4), lineHeight: "var(--rule)" }}>{c.body}</E>
        </div>}
        {footer(5)}
      </>);
      break;
    default: // invite
      body = col(2.6, <>
        {pol(50, -3, us, 5.4, 0, 2)}
        <E as="p" multiline path="profile.inviteLine" className="block text-[#2b2724]/80" style={{ ...hand, fontSize: cq(4.2), lineHeight: 1.1, maxWidth: cq(76) }}>{c.lead}</E>
        {names(11)}
        <div data-in style={{ width: cq(56) }}><Underline className="h-[3cqw] w-full" /></div>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: cq(2.4) }}>{dateLabel(2.3)}{whereLabel(2.3)}</div>
        {footer(4.4)}
      </>);
  }

  const land = kind === "thankyou";
  const pad = kind === "program" || kind === "menu" ? cq(6) : land ? `${cq(5)} ${cq(6)}` : kind === "story" ? `${cq(14)} ${cq(9)}` : `${cq(9)} ${cq(8)}`;
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${s.paper} ${className}`} style={lookStyle(POLAROID_LOOK, design, "our-polaroids")}>
      <PolaroidStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: grain(0.3, 0.75), opacity: 0.6 }} />
      {(kind === "invite" || kind === "save" || kind === "greeting" || kind === "welcome") && dp && (
        <div aria-hidden className="pointer-events-none absolute opacity-70" style={{ right: cq(3), top: cq(3), width: cq(26), transform: "rotate(8deg)" }}>
          <Postmark top={(c.city || "LOVE").toUpperCase().slice(0, 14)} bottom={`${dp.dd}·${dp.mm}·${dp.year}`} mid="♥" />
        </div>
      )}
      {(kind === "invite" || kind === "welcome") && (
        <div aria-hidden className="pointer-events-none absolute" style={{ left: cq(4), bottom: cq(4), transform: "rotate(-8deg)" }}>
          <Stamp value="♥"><div className="grid place-items-center bg-[#f3d9c8]" style={{ width: cq(11), height: cq(13.5) }}><Heart className="w-[60%]" /></div></Stamp>
        </div>
      )}
      <div className="absolute inset-0" style={{ padding: pad }}>{body}</div>
    </CardShell>
  );
}
