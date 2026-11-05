"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { Bell, Birch, Church, Crown, Divider, LaceBand, OvalLace, Rosette } from "./art";
import { monthOf, VL, VOLOGDA_LOOK } from "./look";
import { s, VologdaStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };
const cq = (n: number) => `${n}cqw`;

export default function VologdaCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const land = kind === "thankyou";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length, 4);

  useStage(ref, (g, q) => {
    g.timeline({ defaults: { ease: "power3.out" } })
      .from(q("[data-band]"), { opacity: 0, y: (i) => (i ? 12 : -12), duration: 1.2 }, 0)
      .from(q("[data-draw]"), { drawSVG: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.003 }, 0.1)
      .from(q("[data-petal]"), { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", duration: 0.9, stagger: { each: 0.015, from: "center" } }, 0.2)
      .from(q("[data-crown]"), { y: -20, opacity: 0, duration: 1.4, stagger: 0.15 }, 0.3)
      .from(q("[data-in]"), { opacity: 0, y: 12, filter: "blur(4px)", duration: 1.1, stagger: 0.08 }, 0.5);
  }, [kind], animate);

  const names = (base: number, avail = 76) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.46);
    const st: CSSProperties = { ...disp, fontStyle: "italic", fontWeight: 300, color: VL.ink, fontSize: cq(size), lineHeight: 1 };
    return (
      <div data-in className="w-full text-center">
        <E as="h2" path="profile.partner1" className="block" style={st}>{c.a}</E>
        {c.b && (
          <>
            <p className="leading-none" style={{ ...scr, color: VL.gold, fontSize: cq(size * 0.55), margin: `${cq(size * 0.05)} 0` }}>&amp;</p>
            <E as="h2" path="profile.partner2" className="block" style={st}>{c.b}</E>
          </>
        )}
      </div>
    );
  };
  const caps = (t: ReactNode, size = 2.2, path?: string, color: string = VL.gold) => {
    const st: CSSProperties = { fontSize: cq(size), letterSpacing: "0.32em", color, textTransform: "uppercase" };
    return path ? <E as="p" path={path} className="block" style={st}>{t}</E> : <p data-in style={st}>{t}</p>;
  };
  const date = (size = 3) => dp && (
    <div data-in className="flex items-center justify-center" style={{ gap: cq(size * 0.9), color: VL.ink }}>
      <span style={{ fontSize: cq(size * 0.62), letterSpacing: "0.26em", textTransform: "uppercase", color: VL.muted }}>{dp.weekday}</span>
      <span style={{ ...disp, fontSize: cq(size * 2.1), lineHeight: 1, color: VL.gold }}>{dp.day}</span>
      <span style={{ fontSize: cq(size * 0.62), letterSpacing: "0.26em", textTransform: "uppercase", color: VL.muted }}>{monthOf(c.iso, c.lang)} {dp.year}</span>
    </div>
  );
  const place = (size = 3.2) => (c.where || c.time) && (
    <p data-in className="italic" style={{ ...disp, fontSize: cq(size), color: VL.muted, lineHeight: 1.35 }}>
      {c.time && <>{c.time} · </>}
      {c.venue && kind !== "save" ? <E path="profile.venue">{c.where}</E> : c.where}
      {c.venue && c.city && kind !== "save" && kind !== "event" ? `, ${c.city}` : ""}
    </p>
  );
  const footer = (size = 5) => c.footer && (
    <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block leading-tight" style={{ ...scr, fontSize: cq(size), color: VL.rose }}>{c.footer}</E>
  );
  const crowns = (w = 13) => (
    <div className="flex items-end justify-center" style={{ gap: cq(0.6) }}>
      <div data-crown style={{ rotate: "-12deg" }}><Crown style={{ width: cq(w) }} /></div>
      <div data-crown style={{ rotate: "12deg" }}><Crown style={{ width: cq(w) }} /></div>
    </div>
  );
  const div = (w = 44) => <div data-in style={{ width: cq(w) }}><Divider /></div>;
  const col = (gap: number, children: ReactNode, cls = "") => <div className={`relative flex h-full flex-col items-center justify-center text-center ${cls}`} style={{ gap: cq(gap) }}>{children}</div>;
  const both = `${c.a}${c.b ? ` & ${c.b}` : ""}`;

  let body: ReactNode;
  switch (kind) {
    case "save":
      body = col(2.6, <>
        <div className="relative flex items-center justify-center" style={{ width: cq(62), height: cq(62) }}>
          <Rosette className={`${s.lace} absolute inset-0 h-full w-full`} petals={12} />
          <div data-in className="relative flex flex-col items-center justify-center rounded-full" style={{ width: cq(30), height: cq(30), background: VL.cream, boxShadow: `0 0 0 0.3cqw ${VL.thread}66` }}>
            <span style={{ ...disp, fontSize: cq(11), lineHeight: 0.9, color: VL.ink }}>{dp?.day}</span>
            <span className="italic" style={{ ...disp, fontSize: cq(3), color: VL.muted }}>{monthOf(c.iso, c.lang)}</span>
          </div>
        </div>
        {caps(c.eyebrow, 2.6, "texts.eyebrow")}
        {names(8.5)}
        {caps(`${dp?.year ?? ""}${c.where ? ` · ${c.where}` : ""}`, 2, undefined, VL.muted)}
        <p data-in className="italic" style={{ ...disp, fontSize: cq(2.8), color: VL.rose }}>{c.sub}</p>
      </>);
      break;
    case "event":
      body = col(2.6, <>
        <div data-in className={s.swing}><Bell rope={18} style={{ width: cq(9) }} /></div>
        {names(7)}
        <p data-in className="italic" style={{ ...disp, fontSize: cq(3.4), color: VL.muted }}>{c.lead}</p>
        <E as="h3" path="texts.headline" className="block leading-none" style={{ ...scr, fontSize: cq(fit(c.headline, 11, 74, 0.42)), color: VL.rose }}>{c.headline}</E>
        {div(40)}
        {date(3)}
        {place(3.2)}
      </>);
      break;
    case "story":
      body = col(3.4, <>
        <div data-in style={{ width: cq(66) }}><Church /></div>
        {caps(c.eyebrow, 2.8, "texts.eyebrow")}
        {photoUrl && (
          <div data-in className="relative" style={{ width: cq(46) }}>
            <OvalLace className={`${s.lace} block h-auto w-full`} n={36} />
            <div className="absolute overflow-hidden rounded-[50%]" style={{ left: "10.9%", right: "10.9%", top: "8.6%", bottom: "8.6%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="photo" src={photoUrl} alt="" className="h-full w-full object-cover" style={{ filter: "sepia(0.18)" }} />
            </div>
          </div>
        )}
        {names(photoUrl ? 11 : 15, 74)}
        {div(50)}
        {date(4)}
        {place(4)}
      </>);
      break;
    case "post":
      body = col(0, <>
        <div className="relative flex items-center justify-center" style={{ width: cq(86), height: cq(86) }}>
          <Rosette className={`${s.lace} ${s.drift} absolute inset-0 h-full w-full opacity-80`} petals={16} />
          <div className="relative flex flex-col items-center justify-center rounded-full text-center" style={{ width: cq(56), height: cq(56), background: VL.cream, boxShadow: `0 0 0 0.3cqw ${VL.thread}66, 0 0 0 1.4cqw ${VL.cream}, 0 0 0 1.6cqw ${VL.thread}55`, gap: cq(1.2) }}>
            {caps(c.eyebrow, 1.8, "texts.eyebrow")}
            <div style={{ width: cq(46) }}>{names(7.4, 44)}</div>
            {dp && <p data-in style={{ fontSize: cq(2), letterSpacing: "0.26em", color: VL.muted, textTransform: "uppercase" }}>{dp.day} {monthOf(c.iso, c.lang)} {dp.year}</p>}
          </div>
        </div>
      </>);
      break;
    case "welcome":
      body = col(3, <>
        {crowns(15)}
        {caps(c.eyebrow, 2.5, "texts.eyebrow")}
        {names(14)}
        {div(50)}
        {date(3.4)}
        {footer(5.4)}
        <div data-in style={{ width: cq(56) }}><Birch /></div>
      </>);
      break;
    case "program":
    case "menu": {
      const menu = kind === "menu";
      body = col(menu ? 3.8 : 2.2, <>
        {menu ? <div data-in style={{ width: cq(40) }}><Rosette className={s.lace} /></div> : crowns(10)}
        <E as="h3" path="texts.headline" className="block leading-none" style={{ ...scr, fontSize: cq(fit(c.headline, menu ? 14 : 9, 76, 0.42)), color: VL.ink }}>{c.headline}</E>
        {caps(both, menu ? 2.6 : 2, undefined, VL.muted)}
        {div(40)}
        <ol className="flex w-full flex-col items-center" style={{ gap: cq(menu ? 6 : 2.6) }}>
          {c.items.map((it, i) => (
            <li data-in key={i} className="flex flex-col items-center">
              <E as="span" path={`items.${i}.title`} className="block italic" style={{ ...disp, fontSize: cq(menu ? 5.6 : 4), color: VL.ink, lineHeight: 1.1 }}>{it.title}</E>
              {it.detail && <E as="span" path={`items.${i}.detail`} className="mt-[0.6cqw] block max-w-[66cqw] leading-snug" style={{ fontSize: cq(menu ? 3.4 : 2.6), color: VL.muted, letterSpacing: "0.04em" }}>{it.detail}</E>}
              {i < c.items.length - 1 && <span className="mt-[2.2cqw]" style={{ color: VL.gold, fontSize: cq(2.6) }}>❦</span>}
            </li>
          ))}
        </ol>
        {dp && caps(dp.full, menu ? 2.4 : 1.9, undefined, VL.muted)}
      </>);
      break;
    }
    case "table":
      body = col(0, <>
        <div className="relative flex items-center justify-center" style={{ width: cq(80), height: cq(80) }}>
          <Rosette className={`${s.lace} absolute inset-0 h-full w-full`} petals={12} />
          <div className="relative flex flex-col items-center justify-center rounded-full" style={{ width: cq(42), height: cq(42), background: VL.cream, boxShadow: `0 0 0 0.3cqw ${VL.thread}66` }}>
            <E as="p" path="texts.headline" className="block uppercase" style={{ fontSize: cq(2.4), letterSpacing: "0.4em", color: VL.gold, paddingLeft: "0.4em" }}>{c.headline}</E>
            <p data-in style={{ ...disp, fontSize: cq(20), lineHeight: 0.9, color: VL.ink }}>{c.number}</p>
          </div>
        </div>
        <p data-in style={{ ...scr, fontSize: cq(4.4), color: VL.rose, marginTop: cq(-1) }}>{both}</p>
      </>);
      break;
    case "hashtag":
      body = col(3, <>
        <div data-in style={{ width: cq(30) }}><Rosette className={s.lace} /></div>
        <E as="p" path="texts.body" className="block italic" style={{ ...disp, fontSize: cq(4), color: VL.muted, maxWidth: cq(70) }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all leading-tight" style={{ ...disp, fontSize: cq(fit(c.hashtag, 8.6, 78, 0.5)), color: VL.ink }}>{c.hashtag}</E>
        {div(44)}
        <p data-in style={{ ...scr, fontSize: cq(5), color: VL.rose }}>{both}</p>
      </>);
      break;
    case "thankyou":
      body = (
        <div className="relative flex h-full items-center" style={{ gap: cq(4) }}>
          <div className="relative shrink-0" style={{ width: cq(34), height: cq(34) }}>
            <Rosette className={`${s.lace} absolute inset-0 h-full w-full`} petals={12} />
            <div className="absolute inset-[30%] flex items-center justify-center rounded-full" style={{ background: VL.cream }}>
              <span style={{ ...scr, fontSize: cq(4.6), color: VL.ink }}>{c.a[0]}{c.b ? `&${c.b[0]}` : ""}</span>
            </div>
          </div>
          <div className="flex flex-col items-start text-left" style={{ gap: cq(1.6) }}>
            <E as="h3" path="texts.headline" className="block leading-none" style={{ ...scr, fontSize: cq(fit(c.headline, 10, 48, 0.42)), color: VL.ink }}>{c.headline}</E>
            <div data-in style={{ width: cq(30) }}><Divider /></div>
            <E as="p" multiline path="texts.body" className="block italic leading-snug" style={{ ...disp, fontSize: cq(3), color: VL.muted, maxWidth: cq(46) }}>{c.body}</E>
            <p data-in style={{ ...scr, fontSize: cq(3.8), color: VL.rose }}>{both}</p>
          </div>
        </div>
      );
      break;
    case "greeting":
      body = col(2.8, <>
        <div data-in style={{ width: cq(58) }}><Birch /></div>
        {caps(c.eyebrow, 2.2, "texts.eyebrow")}
        {names(11)}
        {div(42)}
        {c.body && <E as="p" multiline path="texts.body" className="block italic leading-relaxed" style={{ ...disp, fontSize: cq(3.5), color: VL.ink, maxWidth: cq(68) }}>{c.body}</E>}
        {footer(5.4)}
      </>);
      break;
    default: // invite
      body = col(2.2, <>
        {crowns(12)}
        {caps(c.eyebrow, 2.2, "texts.eyebrow")}
        <E as="p" multiline path="profile.inviteLine" className="block italic leading-[1.45]" style={{ ...disp, fontSize: cq(3.3), color: VL.muted, maxWidth: cq(66) }}>{c.lead}</E>
        {names(11.5)}
        {div(42)}
        {date(3.2)}
        {place(3.3)}
        {footer(4.8)}
      </>);
  }

  const pad = land ? "13cqw 12cqw" : kind === "story" || kind === "menu" ? "17cqw 11cqw" : "15cqw 11cqw";
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${s.paper} ${animate ? "" : s.still} ${className}`} style={{ ...lookStyle(VOLOGDA_LOOK, design, "vologda-lace"), backgroundColor: VL.paper }}>
      <VologdaStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-band className="absolute left-0 right-0 top-0"><LaceBand tiles={land ? 16 : 12} className={`${s.lace} block w-full rotate-180`} /></div>
        <div data-band className="absolute bottom-0 left-0 right-0"><LaceBand tiles={land ? 16 : 12} className={`${s.lace} block w-full`} /></div>
        <div className="absolute" style={{ inset: `${land ? 9 : 12}cqw ${cq(4.6)}`, borderLeft: `0.25cqw solid ${VL.thread}77`, borderRight: `0.25cqw solid ${VL.thread}77` }} />
        <div className="absolute" style={{ inset: `${land ? 9 : 12}cqw ${cq(5.8)}`, borderLeft: `0.15cqw solid ${VL.thread}55`, borderRight: `0.15cqw solid ${VL.thread}55` }} />
      </div>
      <div className="absolute inset-0" style={{ padding: pad }}>{body}</div>
    </CardShell>
  );
}
