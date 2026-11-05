"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame, Grain } from "../_shared/ui";
import { Bandhanwar, Bangles, Buta, Diya, Jharokha, Kalash, Ladi, Rangoli } from "./art";
import { SHUBH, gbItems, gbSub } from "./words";
import { gbFonts } from "./fonts";
import { GB_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function GodhBharaiCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c0 = cardText(kind, design, profile);
  const c = (kind === "program" || kind === "menu") && !design.items?.length ? { ...c0, items: gbItems(profile, kind) } : c0;
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 7), b ? fit(b, 7) : 1) * sc;
  const night = kind === "story" || kind === "post" || kind === "hashtag";

  const names = (size: number, color = "text-[var(--gb-maroon)]") => (
    <h2 className={`d leading-[1.02] ${color}`} style={{ fontSize: `${size * f}cqw` }}>
      <E path="profile.partner1" className="gb-a-rise block" style={dl(1)}>{a}</E>
      {b && <span className="sc gb-a-rise block text-[.5em] leading-[1.25] text-[var(--t-gold)]" style={dl(1.15)}>&amp;</span>}
      {b && <E path="profile.partner2" className="gb-a-rise block" style={dl(1.3)}>{b}</E>}
    </h2>
  );
  const shubh = (size = 3.4, cls = "text-[var(--gb-kum)]") => <p className={`sc gb-a-rise ${cls}`} style={{ fontSize: `${size}cqw`, ...dl(0.8) }}>{SHUBH}</p>;
  const meta = (size = 2.2, cls = "text-[var(--t-muted)]") => (c.date || c.where) && (
    <div className={`lbl gb-a-rise ${cls}`} style={{ fontSize: `${size}cqw`, lineHeight: 1.7, ...dl(1.7) }}>
      {c.date && <div>{c.date}</div>}
      {c.where && <div className="opacity-80">{c.where}</div>}
    </div>
  );
  const curtain = (n: number, h = "62%") => (["l", "r"] as const).map((s) => (
    <div key={s} className={`absolute top-0 flex gap-[1.5cqw] ${s === "l" ? "left-[1cqw]" : "right-[1cqw] flex-row-reverse"}`} style={{ height: h }}>
      {Array.from({ length: n }, (_, i) => <div key={i} className="gb-sway h-full" style={{ "--sw": `${5 + i}s`, height: `${100 - i * 14}%` } as CSSProperties}><Ladi n={12} className="h-full w-auto" tone={i % 2 ? "o" : "mix"} /></div>)}
    </div>
  ));

  let body: ReactNode;
  if (night) {
    // ── maroon, diya-lit: ladis at the sides, words in foil
    const tall = kind === "story";
    body = (
      <div className="gb-maroonbg absolute inset-0">
        <Rangoli className="absolute left-1/2 w-[110%] -translate-x-1/2 opacity-[.22]" style={{ bottom: tall ? "-22%" : "-40%" }} petals={16} />
        {curtain(tall ? 3 : 2, tall ? "56%" : "70%")}
        <div className="absolute inset-x-0 top-0 z-[2]"><Bandhanwar className="w-full" swags={3} /></div>
        <div className={`absolute ${tall ? "inset-x-[22%]" : "inset-x-[18%]"} z-[3] flex flex-col items-center text-center ${tall ? "top-[24%]" : "top-[17%]"}`}>
          {kind === "hashtag" ? (
            <>
              {shubh(4, "text-[#f2c86a]")}
              <E path="texts.body" className="d gb-a-rise mt-[4cqw] block text-[#fbe9c8]" style={{ fontSize: "6.5cqw", lineHeight: 1.15, ...dl(1) }}>{c.body}</E>
              <E path="texts.hashtag" className="d foil gb-a-rise mt-[5cqw] block" style={{ fontSize: "7.4cqw", ...dl(1.3) }}>{c.hashtag}</E>
            </>
          ) : (
            <>
              {shubh(tall ? 4.8 : 3.8, "text-[#f2c86a]")}
              <div className="mt-[3cqw]">{names(tall ? 13 : 10, "text-[#fbe9c8]")}</div>
              <p className="sc gb-a-rise mt-[2cqw] text-[#f2c86a]" style={{ fontSize: tall ? "5cqw" : "4cqw", ...dl(1.5) }}>{gbSub(profile)}</p>
              <div className="mt-[3cqw]">{meta(tall ? 3 : 2.4, "text-[#fbe9c8]/80")}</div>
            </>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-[3%] z-[3] mx-auto flex items-end justify-center gap-[4cqw]" style={{ width: tall ? "80%" : "70%" }}>
          <Diya className="w-[18%]" still={!animate} />
          <Kalash className="w-[30%]" />
          <Diya className="w-[18%]" still={!animate} />
        </div>
      </div>
    );
  } else if (shape === "landscape") {
    body = (
      <div className="gb-paper absolute inset-0">
        <Grain opacity={0.22} seed={11} />
        <div className="absolute inset-x-0 top-0"><Bandhanwar className="w-full" swags={4} /></div>
        <div className="absolute bottom-[6%] left-[5%] top-[18%] flex w-[30%] flex-col items-center justify-end">
          <Bangles className="w-[70%]" />
          <Kalash className="mt-[2cqw] w-[70%]" />
        </div>
        <div className="absolute bottom-[8%] left-[38%] right-[5%] top-[20%] flex flex-col items-center justify-center text-center">
          {shubh(2.6)}
          <E path="texts.headline" as="h2" className="d gb-a-rise mt-[1cqw] block text-[var(--gb-maroon)]" style={{ fontSize: "9cqw", lineHeight: 1, ...dl(1) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="gb-a-rise mt-[2cqw] block" style={{ fontSize: "2.2cqw", lineHeight: 1.7, ...dl(1.3) }}>{c.body}</E>
          <p className="sc gb-a-rise mt-[2cqw] text-[var(--gb-kum)]" style={{ fontSize: "3cqw", ...dl(1.6) }}>{b ? `${a} & ${b}` : a}</p>
        </div>
      </div>
    );
  } else if (kind === "table") {
    body = (
      <div className="gb-paper absolute inset-0">
        <Grain opacity={0.22} seed={12} />
        <div className="absolute inset-[6%] grid place-items-center">
          <Rangoli className="absolute inset-0 h-full w-full opacity-60" petals={16} />
          <div className="relative grid aspect-square w-[44%] place-content-center rounded-full bg-[var(--gb-haldi)] text-center shadow-[0_0_0_1.2cqw_var(--gb-haldi),0_0_0_1.5cqw_var(--t-gold)]">
            <E path="texts.headline" className="lbl gb-a-rise block text-[var(--gb-kum)]" style={{ fontSize: "3cqw", ...dl(0.6) }}>{c.headline}</E>
            <p className="d gb-a-rise text-[var(--gb-maroon)]" style={{ fontSize: "22cqw", lineHeight: 1, ...dl(0.9) }}>{c.number}</p>
          </div>
        </div>
      </div>
    );
  } else {
    // ── haldi paper: bandhanwar, jharokha arch with the words inside, kalash & diyas at its foot
    const list = kind === "program" || kind === "menu";
    const tall = kind === "menu";
    body = (
      <div className="gb-paper absolute inset-0">
        <Grain opacity={0.22} seed={9} />
        <div className="absolute inset-x-0 top-0 z-[3]"><Bandhanwar className="w-full" swags={3} /></div>
        <Buta className="absolute bottom-[3cqw] left-[3cqw] w-[6cqw] text-[var(--t-gold)]" />
        <Buta className="absolute bottom-[3cqw] right-[3cqw] w-[6cqw] -scale-x-100 text-[var(--t-gold)]" />
        <div className="absolute inset-x-[7%] bottom-[11%] top-[9%]">
          <Jharokha className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 80%, transparent)" />
          <div className={`absolute inset-x-[8%] flex flex-col items-center text-center ${tall ? "bottom-[5%] top-[14%]" : "bottom-[12%] top-[20%]"}`}>
            {shubh(list ? 3 : 3.4)}
            {list ? (
              <>
                <E path="texts.headline" as="h2" className="d gb-a-rise mt-[1.5cqw] block text-[var(--gb-maroon)]" style={{ fontSize: "8cqw", lineHeight: 1.05, ...dl(1) }}>{c.headline}</E>
                <div className={`flex w-full flex-col gap-[2.6cqw] ${tall ? "mt-[10cqw] gap-[7cqw]" : "mt-[3cqw] flex-1 justify-center"}`}>
                  {c.items.map((it, i) => (
                    <div key={i} className="gb-a-rise" style={dl(1.2 + i * 0.12)}>
                      <E path={`items.${i}.title`} className="d block text-[var(--gb-kum)]" style={{ fontSize: tall ? "5.4cqw" : "3.8cqw" }}>{it.title}</E>
                      {it.detail && <E path={`items.${i}.detail`} className="mt-[.4cqw] block" style={{ fontSize: tall ? "3.3cqw" : "2.4cqw", lineHeight: 1.5 }}>{it.detail}</E>}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {(kind === "save" || kind === "welcome" || kind === "greeting" || kind === "event") && (
                  <E path="texts.eyebrow" className="lbl gb-a-rise mt-[1.4cqw] block text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", ...dl(0.9) }}>{kind === "event" ? c.headline : c.eyebrow}</E>
                )}
                <div className="mt-[2.4cqw]">{names(kind === "greeting" ? 9 : 10.5)}</div>
                <p className="sc gb-a-rise mt-[1.5cqw] text-[var(--gb-kum)]" style={{ fontSize: "3.6cqw", ...dl(1.5) }}>{gbSub(profile)}</p>
                {(kind === "invite" || kind === "greeting") && (c.lead || c.body) && (
                  <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="gb-a-rise mt-[2cqw] block" style={{ fontSize: "2.5cqw", lineHeight: 1.65, ...dl(1.6) }}>{c.body || c.lead}</E>
                )}
                <div className="mt-auto">{kind === "save" ? <p className="d foil gb-a-rise" style={{ fontSize: "6cqw", ...dl(1.7) }}>{c.date}</p> : meta()}</div>
              </>
            )}
          </div>
        </div>
        {(!list || tall) && (
          <div className="absolute inset-x-0 bottom-[2.5%] z-[2] mx-auto flex w-[46%] items-end justify-between">
            <Diya className="w-[22%]" still={!animate} />
            <Kalash className="w-[34%]" />
            <Diya className="w-[22%]" still={!animate} />
          </div>
        )}
      </div>
    );
  }

  return (
    <CardFrame id="godh-bharai" kind={kind} animate={animate} className={`gb ${gbFonts} ${className}`} style={bxVars(theme, design, "royal")}>
      <style href="bx-godh-bharai" precedence="default">{GB_CSS}</style>
      {body}
    </CardFrame>
  );
}
