"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, grain, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts, toRoman } from "../_shared/text";
import { Chevrons, CornerFan, Fan } from "./art";
import { GATSBY_LOOK } from "./look";
import { s, GatsbyStyles } from "./styles";

const GOLD = "linear-gradient(160deg,#8c6a2e,#f6e3a8 28%,#a67f3a 52%,#f3d98f 78%,#8c6a2e)";
const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };
const cq = (n: number) => `${n}cqw`;

/** The gilt frame: a double cut-corner border, quarter-sun corners. */
function Frame({ land }: { land: boolean }) {
  const o = land ? 2.6 : 3.6;
  return (
    <div aria-hidden data-frame className="pointer-events-none absolute inset-0">
      <div className={`${s.notch} absolute`} style={{ inset: cq(o), padding: cq(0.32), background: GOLD, "--n": cq(5) } as CSSProperties}>
        <div className={`${s.notch} h-full w-full bg-[#0d0b0a]`} style={{ "--n": cq(4.8) } as CSSProperties} />
      </div>
      <div className={`${s.notch} absolute opacity-60`} style={{ inset: cq(o + 1.7), padding: cq(0.16), background: GOLD, "--n": cq(3.8) } as CSSProperties}>
        <div className={`${s.notch} h-full w-full`} style={{ "--n": cq(3.7), background: "radial-gradient(120% 70% at 50% 0%, #1c1712, #0d0b0a 60%)" } as CSSProperties} />
      </div>
      {(["", "-scale-x-100", "-scale-y-100", "-scale-100"] as const).map((t, i) => (
        <CornerFan key={i} className={`absolute ${t}`} style={{ width: cq(11), [i % 2 ? "right" : "left"]: cq(o + 2.6), [i > 1 ? "bottom" : "top"]: cq(o + 2.6) } as CSSProperties} />
      ))}
    </div>
  );
}

const Eb = ({ children, size = 2.1, className = "", path }: { children: ReactNode; size?: number; className?: string; path?: string }) =>
  path ? <E as="p" path={path} className={`block uppercase text-[#d6b36a] ${className}`} style={{ fontSize: cq(size), letterSpacing: "0.46em" }}>{children}</E>
    : <p className={`uppercase text-[#d6b36a] ${className}`} style={{ fontSize: cq(size), letterSpacing: "0.46em" }}>{children}</p>;

export default function GatsbyCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const land = kind === "thankyou";
  const tall = kind === "story" || kind === "menu";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length);

  useStage(ref, (g, q) => {
    const tl = g.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q("[data-frame] > div"), { opacity: 0, scale: 1.04, duration: 1.2, stagger: 0.15 }, 0)
      .from(q("[data-ray]"), { drawSVG: 0, duration: 1.1, stagger: { each: 0.012, from: "center" } }, 0.2)
      .from(q("[data-draw]"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut" }, 0.2)
      .from(q("[data-in]"), { opacity: 0, y: 14, duration: 1, stagger: 0.09 }, 0.5);
  }, [kind], animate);

  const names = (base: number, avail = 74, stacked = true) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.84);
    return (
      <div data-in className="w-full text-center">
        <E as="h2" path="profile.partner1" className={`${s.foil} block uppercase leading-[1.02]`} style={{ ...disp, fontSize: cq(size), letterSpacing: "0.1em" }}>{c.a}</E>
        {c.b && (
          <>
            <p className="leading-none text-[#e9cf98]" style={{ ...scr, fontSize: cq(size * 0.72), margin: stacked ? `${cq(size * 0.02)} 0 ${cq(size * 0.12)}` : 0 }}>&amp;</p>
            <E as="h2" path="profile.partner2" className={`${s.foil} block uppercase leading-[1.02]`} style={{ ...disp, fontSize: cq(size), letterSpacing: "0.1em" }}>{c.b}</E>
          </>
        )}
      </div>
    );
  };
  const dateLine = (size = 4.2) => dp && (
    <p data-in className="uppercase text-[#f1e3bf]" style={{ ...disp, fontSize: cq(size), letterSpacing: "0.28em" }}>
      {dp.dd}<span className="text-[#d6b36a]" style={{ margin: `0 ${cq(size * 0.35)}` }}>◆</span>{dp.monthShort}<span className="text-[#d6b36a]" style={{ margin: `0 ${cq(size * 0.35)}` }}>◆</span>{dp.year}
    </p>
  );
  const place = (size = 2.1) => (c.where || c.time) && (
    <p data-in className="uppercase text-[#a89a7c]" style={{ fontSize: cq(size), letterSpacing: "0.34em", lineHeight: 1.7 }}>
      {c.time && <>{c.time}<span className="mx-[1.2cqw] text-[#d6b36a]">·</span></>}
      {c.venue && kind !== "save" ? <E path="profile.venue">{c.where}</E> : c.where}
      {c.venue && c.city && kind !== "save" && kind !== "event" ? ` · ${c.city}` : ""}
    </p>
  );
  const footer = (size = 4.6) => c.footer && (
    <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block leading-tight text-[#e9cf98]" style={{ ...scr, fontSize: cq(size) }}>{c.footer}</E>
  );
  const fan = (w: number, rings = true) => <div data-in style={{ width: cq(w) }}><Fan rays={rings ? 34 : 24} rings={rings} /></div>;
  const chev = (w = 50) => <div data-in style={{ width: cq(w) }}><Chevrons /></div>;
  const gap = (n: number) => ({ gap: cq(n) });

  let body: ReactNode;
  switch (kind) {
    case "save":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(2.6)}>
          {fan(38, false)}
          <Eb path="texts.eyebrow" size={2.6}>{c.eyebrow}</Eb>
          {dp && (
            <div data-in className="flex items-center" style={{ ...disp, gap: cq(2) }}>
              {[dp.dd, dp.mm, dp.year.slice(2)].map((n, i) => (
                <span key={i} className="flex items-center" style={{ gap: cq(2) }}>
                  {i > 0 && <span className="text-[#d6b36a]" style={{ fontSize: cq(4) }}>◆</span>}
                  <span className={s.foil} style={{ fontSize: cq(17), lineHeight: 1 }}>{n}</span>
                </span>
              ))}
            </div>
          )}
          {chev(54)}
          {names(7.4)}
          {place(2.2)}
          <p data-in className="italic text-[#a89a7c]" style={{ fontSize: cq(2.4) }}>{c.sub}</p>
        </div>
      );
      break;
    case "event":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(2.4)}>
          {fan(34, false)}
          {names(5.6)}
          <p data-in className="text-[#cfc2a4]" style={{ fontSize: cq(2.7) }}>{c.lead}</p>
          <E as="h3" path="texts.headline" className={`${s.foil} block uppercase leading-tight`} style={{ ...disp, fontSize: cq(fit(c.headline, 9.5, 74, 0.8)), letterSpacing: "0.12em" }}>{c.headline}</E>
          {chev(48)}
          {dateLine(3.8)}
          {place(2.1)}
        </div>
      );
      break;
    case "story":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(3.6)}>
          {fan(photoUrl ? 50 : 64)}
          <Eb path="texts.eyebrow" size={2.8}>{c.eyebrow}</Eb>
          {photoUrl && (
            <div data-in className={`${s.arch} p-[0.4cqw]`} style={{ width: cq(42), background: GOLD }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="photo" src={photoUrl} alt="" className={`${s.arch} aspect-[3/4] w-full object-cover`} style={{ filter: "sepia(0.25) contrast(1.05)" }} />
            </div>
          )}
          {names(photoUrl ? 9 : 13)}
          {chev(56)}
          {dateLine(5)}
          {place(2.8)}
        </div>
      );
      break;
    case "post":
      body = (
        <div className="relative flex h-full flex-col items-center justify-center text-center" style={gap(2.4)}>
          <div aria-hidden className="absolute left-1/2 top-[50%] w-[118cqw] -translate-x-1/2 -translate-y-[70%] opacity-25"><Fan rays={48} /></div>
          <div aria-hidden className="absolute inset-[14%]" style={{ background: "radial-gradient(closest-side, #0d0b0a 40%, transparent)" }} />
          <Eb path="texts.eyebrow" size={2.3} className="relative">{c.eyebrow}</Eb>
          <div className="relative w-full">{names(9.5, 70)}</div>
          {chev(42)}
          {dateLine(3.6)}
          {place(1.9)}
        </div>
      );
      break;
    case "welcome":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(3)}>
          {fan(50)}
          <Eb path="texts.eyebrow" size={2.4}>{c.eyebrow}</Eb>
          {names(12)}
          {chev(56)}
          {dateLine(4.2)}
          {place(2.2)}
          {footer(5)}
        </div>
      );
      break;
    case "program":
    case "menu":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(kind === "menu" ? 3.4 : 2.2)}>
          {fan(kind === "menu" ? 46 : 32, false)}
          <E as="h3" path="texts.headline" className={`${s.foil} block uppercase leading-tight`} style={{ ...disp, fontSize: cq(fit(c.headline, kind === "menu" ? 10 : 6.4, 72, 0.82)), letterSpacing: "0.16em" }}>{c.headline}</E>
          <p data-in className="text-[#e9cf98]" style={{ ...scr, fontSize: cq(kind === "menu" ? 6 : 4.2) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
          {chev(44)}
          <ol className="flex w-full flex-col items-center" style={gap(kind === "menu" ? 5 : 2.6)}>
            {c.items.map((it, i) => (
              <li data-in key={i} className="flex flex-col items-center">
                {kind === "program" && <span className="text-[#d6b36a]" style={{ ...disp, fontSize: cq(2.6), letterSpacing: "0.3em" }}>{toRoman(i + 1)}</span>}
                <E as="span" path={`items.${i}.title`} className="block uppercase text-[#f1e3bf]" style={{ ...disp, fontSize: cq(kind === "menu" ? 4.6 : 3.5), letterSpacing: "0.2em" }}>{it.title}</E>
                {it.detail && <E as="span" path={`items.${i}.detail`} className="mt-[0.6cqw] block max-w-[70cqw] font-light leading-snug text-[#b8ab8e]" style={{ fontSize: cq(kind === "menu" ? 3.4 : 2.5) }}>{it.detail}</E>}
                {kind === "menu" && i < c.items.length - 1 && <span className="mt-[3cqw] text-[#d6b36a]" style={{ fontSize: cq(2.4) }}>◆</span>}
              </li>
            ))}
          </ol>
          {dateLine(kind === "menu" ? 3.6 : 2.8)}
        </div>
      );
      break;
    case "table":
      body = (
        <div className="relative flex h-full flex-col items-center justify-center text-center">
          <div data-in aria-hidden className="absolute left-1/2 top-1/2 w-[96cqw] -translate-x-1/2 -translate-y-[62%] opacity-40"><Fan rays={44} /></div>
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[46cqw] w-[46cqw] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, #0d0b0a 55%, transparent 72%)" }} />
          <E as="p" path="texts.headline" className="relative block uppercase text-[#d6b36a]" style={{ fontSize: cq(3), letterSpacing: "0.6em", paddingLeft: "0.6em" }}>{c.headline}</E>
          <p data-in className={`${s.foil} relative leading-none`} style={{ ...disp, fontSize: cq(26), marginTop: cq(1) }}>{c.number}</p>
          <div data-in className="relative mt-[2cqw]" style={{ width: cq(36) }}><Chevrons /></div>
          <p data-in className="relative mt-[2cqw] text-[#e9cf98]" style={{ ...scr, fontSize: cq(4.6) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "hashtag":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(3)}>
          {fan(46)}
          <E as="p" path="texts.body" className="block uppercase text-[#d6b36a]" style={{ fontSize: cq(2.5), letterSpacing: "0.4em", lineHeight: 1.8, maxWidth: cq(70) }}>{c.body}</E>
          <E as="p" path="texts.hashtag" className={`${s.foil} block break-all leading-tight`} style={{ ...disp, fontSize: cq(fit(c.hashtag, 9, 76, 0.66)), letterSpacing: "0.04em" }}>{c.hashtag}</E>
          {chev(50)}
          <p data-in className="text-[#e9cf98]" style={{ ...scr, fontSize: cq(5.4) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
          {dateLine(3.2)}
        </div>
      );
      break;
    case "thankyou":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(1.8)}>
          {fan(26, false)}
          <E as="h3" path="texts.headline" className={`${s.foil} block uppercase leading-none`} style={{ ...disp, fontSize: cq(fit(c.headline, 9, 70, 0.84)), letterSpacing: "0.16em" }}>{c.headline}</E>
          <div data-in style={{ width: cq(34) }}><Chevrons /></div>
          <E as="p" multiline path="texts.body" className="block max-w-[64cqw] font-light leading-snug text-[#cfc2a4]" style={{ fontSize: cq(2.3) }}>{c.body}</E>
          <p data-in className="text-[#e9cf98]" style={{ ...scr, fontSize: cq(4.4) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "greeting":
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(2.8)}>
          {fan(44)}
          <Eb path="texts.eyebrow" size={2.3}>{c.eyebrow}</Eb>
          {names(10.5)}
          {chev(48)}
          {c.body && <E as="p" multiline path="texts.body" className="block max-w-[66cqw] font-light leading-relaxed text-[#cfc2a4]" style={{ fontSize: cq(2.9) }}>{c.body}</E>}
          {footer(5.2)}
        </div>
      );
      break;
    default: // invite
      body = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(2.4)}>
          {fan(40, false)}
          <Eb path="texts.eyebrow" size={2.2}>{c.eyebrow}</Eb>
          <E as="p" multiline path="profile.inviteLine" className="block max-w-[66cqw] font-light leading-[1.55] text-[#cfc2a4]" style={{ fontSize: cq(2.8) }}>{c.lead}</E>
          {names(9.6)}
          {chev(50)}
          {dp && <p data-in className="uppercase text-[#a89a7c]" style={{ fontSize: cq(2.1), letterSpacing: "0.5em" }}>{dp.weekday}</p>}
          {dateLine(4.2)}
          {place(2.1)}
          {footer(4.4)}
        </div>
      );
  }

  const pad = land ? "10cqw 14cqw" : tall ? "14cqw 13cqw" : "13cqw 12cqw";
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${animate ? "" : s.still} ${className}`} style={{ ...lookStyle(GATSBY_LOOK, design, "gatsby-vows"), background: "#0b0a09" }}>
      <GatsbyStyles />
      <Frame land={land} />
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ backgroundImage: grain(0.22, 0.9), opacity: 0.5 }} />
      <div className="absolute inset-0" style={{ padding: pad }}>{body}</div>
    </CardShell>
  );
}
