"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame, Photo } from "../_shared/ui";
import { FilmGrain, MoonPhase, PHASES } from "./art";
import { bpWords } from "./words";
import { bpFonts } from "./fonts";
import { BP_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function BumpPortraitCard({ kind, profile, theme, design, photoUrl, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const X = bpWords(profile);
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 6), b ? fit(b, 6) : 1) * sc;
  const photo = (cls = "", st?: CSSProperties) => <div className={`absolute overflow-hidden ${cls}`} style={st}><div className="bp-a-ken h-full w-full"><Photo src={photoUrl} slot="photo" /></div></div>;
  const moons = (w: string, start = 0.8) => <div className="flex items-center justify-center gap-[1.4cqw]">{PHASES.map((p, i) => <MoonPhase key={i} k={p} className="bp-a-moon" style={{ width: w, ...dl(start + i * 0.1) }} />)}</div>;

  let body: ReactNode;
  if (kind === "program" || kind === "menu") {
    const tall = kind === "menu";
    body = (
      <div className="absolute inset-0 bg-[var(--bp-ivory)]">
        {photo("inset-x-0 top-0", { height: tall ? "24%" : "30%" })}
        <div className="absolute inset-x-0 top-0 h-[3cqw] bg-[#0d0c0b]" />
        <div className="absolute inset-x-0 bg-[#0d0c0b] py-[2.4cqw]" style={{ top: tall ? "24%" : "30%" }}>{moons("3.4cqw")}</div>
        <div className="absolute inset-x-[9%] bottom-[6%] flex flex-col items-center text-center" style={{ top: tall ? "31%" : "40%" }}>
          <p className="lbl text-[var(--t-muted)]" style={{ fontSize: "1.9cqw" }}>{X.chapter} IX</p>
          <E path="texts.headline" as="h2" className="d bp-a-in mt-[1.4cqw] block" style={{ fontSize: "8cqw", lineHeight: 1, ...dl(0.6) }}>{c.headline}</E>
          <div className={`flex w-full flex-col ${tall ? "mt-[8cqw] gap-[6cqw]" : "mt-[4cqw] flex-1 justify-center gap-[3cqw]"}`}>
            {c.items.map((it, i) => (
              <div key={i} className="bp-a-in" style={dl(0.9 + i * 0.12)}>
                <E path={`items.${i}.title`} className="lbl block text-[var(--t-muted)]" style={{ fontSize: "2cqw" }}>{it.title}</E>
                {it.detail && <E path={`items.${i}.detail`} className="d mt-[.8cqw] block" style={{ fontSize: "3.8cqw", lineHeight: 1.25 }}>{it.detail}</E>}
              </div>
            ))}
          </div>
          {tall && <div className="mt-auto flex flex-col items-center"><MoonPhase k={1} className="w-[8cqw]" lit="var(--bp-ink)" dark="transparent" ring="rgba(0,0,0,.2)" /><p className="lbl mt-[2cqw] text-[var(--t-muted)]" style={{ fontSize: "1.8cqw" }}>{b ? `${a} & ${b}` : a}</p></div>}
        </div>
      </div>
    );
  } else if (kind === "table") {
    body = (
      <div className="bp-dark absolute inset-0 grid place-items-center text-center">
        <FilmGrain opacity={0.18} />
        <div className="relative w-[64%]">
          <MoonPhase k={1} className="w-full" lit="rgba(243,234,217,.1)" ring="rgba(243,234,217,.35)" />
          <div className="absolute inset-0 grid place-content-center">
            <E path="texts.headline" className="lbl mb-[2cqw] block opacity-70" style={{ fontSize: "2.6cqw" }}>{c.headline}</E>
            <p className="d bp-a-track" style={{ fontSize: "22cqw", lineHeight: 0.9, ...dl(0.5) }}>{c.number}</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[7%]">{moons("3.6cqw", 0.3)}</div>
      </div>
    );
  } else if (shape === "landscape") {
    body = (
      <div className="absolute inset-0 bg-[var(--bp-ivory)]">
        {photo("inset-y-0 left-0 w-[50%]")}
        <FilmGrain opacity={0.1} className="right-1/2" />
        <div className="absolute inset-y-[10%] left-[55%] right-[5%] flex flex-col justify-center">
          <E path="texts.headline" as="h2" className="d bp-a-track block" style={{ fontSize: "8.4cqw", lineHeight: 1, ...dl(0.5) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="bp-a-in mt-[2.4cqw] block text-[color-mix(in_oklab,var(--bp-ink)_75%,transparent)]" style={{ fontSize: "2.1cqw", lineHeight: 1.75, ...dl(1) }}>{c.body}</E>
          <p className="lbl bp-a-in mt-[3cqw] text-[var(--t-muted)]" style={{ fontSize: "1.5cqw", ...dl(1.3) }}>{b ? `${a} & ${b}` : a}</p>
          <div className="mt-[3cqw] flex justify-start gap-[1cqw]">{PHASES.map((p, i) => <MoonPhase key={i} k={p} className="w-[2.4cqw]" lit="var(--bp-ink)" dark="rgba(0,0,0,.06)" ring="rgba(0,0,0,.25)" />)}</div>
        </div>
      </div>
    );
  } else {
    // full-bleed portrait in letterbox
    const tall = shape === "tall";
    const sq = shape === "square";
    const bar = tall ? "11cqw" : sq ? "8cqw" : "9cqw";
    body = (
      <div className="bp-dark absolute inset-0">
        {photo("inset-0")}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.25) 0%, transparent 30%, transparent 42%, rgba(10,9,8,.85) 100%)" }} />
        <FilmGrain opacity={0.2} />
        <div className="bp-bar bp-a-bart top-0 flex items-end justify-between px-[4cqw] pb-[1.6cqw]" style={{ height: bar }}>
          <span className="lbl text-[#f3ead9]/60" style={{ fontSize: "1.7cqw" }}>{X.chapter} IX</span>
          <span className="tc text-[#f3ead9]/60" style={{ fontSize: "1.8cqw" }}>{kind === "save" ? "" : c.date}</span>
        </div>
        <div className="bp-bar bp-a-barb bottom-0 flex items-center justify-center" style={{ height: bar }}>{moons(tall ? "3.6cqw" : "3cqw", 1.4)}</div>
        <div className="absolute inset-x-[6cqw] z-[4] text-[var(--bp-moon)]" style={{ bottom: `calc(${bar} + ${tall ? 10 : 5}cqw)` }}>
          {kind === "hashtag" ? (
            <>
              <E path="texts.body" className="lbl bp-a-in block opacity-80" style={{ fontSize: "2.4cqw", ...dl(1.6) }}>{c.body}</E>
              <E path="texts.hashtag" className="d bp-a-track mt-[2cqw] block" style={{ fontSize: "9cqw", lineHeight: 1, ...dl(1.9) }}>{c.hashtag}</E>
            </>
          ) : (
            <>
              <E path="texts.eyebrow" className="lbl bp-a-in block opacity-80" style={{ fontSize: tall ? "2.6cqw" : "2.1cqw", ...dl(1.6) }}>{kind === "event" ? c.headline : c.eyebrow}</E>
              <h2 className="d mt-[1.6cqw] leading-[.92]" style={{ fontSize: `${(tall ? 17 : sq ? 12 : 14) * f}cqw` }}>
                <E path="profile.partner1" className="bp-a-track block" style={dl(1.9)}>{a}</E>
                {b && <span className="bp-a-track block" style={dl(2.2)}><span className="text-[.5em] italic opacity-70">&amp; </span><E path="profile.partner2">{b}</E></span>}
              </h2>
              {kind === "save" && <p className="d bp-a-in mt-[2.4cqw]" style={{ fontSize: "6.4cqw", ...dl(2.4) }}>{c.date}</p>}
              {(kind === "invite" || kind === "story" || kind === "greeting") && (c.lead || c.body) && (
                <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="bp-a-in mt-[2.4cqw] block opacity-85" style={{ fontSize: tall ? "3.6cqw" : "2.7cqw", lineHeight: 1.6, maxWidth: "80%", ...dl(2.5) }}>{c.body || c.lead}</E>
              )}
              {c.where && kind !== "greeting" && <p className="tc bp-a-in mt-[2cqw] opacity-75" style={{ fontSize: tall ? "2.6cqw" : "2cqw", ...dl(2.7) }}>{c.where}</p>}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <CardFrame id="bump-portrait" kind={kind} animate={animate} className={`bp ${bpFonts} ${className}`} style={bxVars(theme, design, "modern")}>
      <style href="bx-bump-portrait" precedence="default">{BP_CSS}</style>
      {body}
    </CardFrame>
  );
}
