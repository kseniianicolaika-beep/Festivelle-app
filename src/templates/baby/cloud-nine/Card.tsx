"use client";
import type { CSSProperties, ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { cardText, shapeOf, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { CardFrame, Grain } from "../_shared/ui";
import { Cloud, Moon, Star, Twinkle, Dots } from "./art";
import { cnFonts } from "./fonts";
import { CN_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

/** The dusk sky with moon, hanging stars and a cloud bank — reused as window, panel or full bleed. */
function Sky({ moon = 34, stars = true, className = "", moonTop = "12%", children }: { moon?: number; stars?: boolean; className?: string; moonTop?: string; children?: ReactNode }) {
  return (
    <div className={`cn-sky absolute inset-0 overflow-hidden ${className}`}>
      <Dots n={46} seed={5} className="absolute inset-0 h-[70%] w-full opacity-80" />
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: moonTop, width: `${moon}%` }}>
        <div className="cn-a-rise"><Moon className="cn-float w-full" /></div>
      </div>
      {stars && (
        <div className="absolute inset-x-[10%] top-0 flex justify-between" aria-hidden>
          {[{ h: 46, w: 9, d: 0.9, t: "gold" }, { h: 96, w: 6.5, d: 1.1, t: "blue" }, { h: 30, w: 7, d: 1.3, t: "blush" }, { h: 70, w: 8, d: 1.0, t: "gold" }].map((x, i) => (
            <div key={i} className="cn-hang" style={{ "--dl": `${x.d}s`, "--sw": `${4 + i}s`, width: `${x.w}%` } as CSSProperties}><Star hang={x.h} tone={x.t as "gold"} className="w-full" /></div>
          ))}
        </div>
      )}
      <Twinkle className="cn-tw absolute left-[18%] top-[48%] w-[3%] text-white" />
      <Twinkle className="cn-tw absolute right-[16%] top-[40%] w-[2.4%] text-white" style={{ "--tw": "2.2s" } as CSSProperties} />
      {children}
      <div className="absolute inset-x-0 bottom-[-1%]">
        <div className="cn-a-partl absolute bottom-0 left-[-22%] w-[80%]"><Cloud v={0} className="w-full" /></div>
        <div className="cn-a-partr absolute bottom-[-3%] right-[-24%] w-[84%]"><Cloud v={1} className="w-full" /></div>
      </div>
    </div>
  );
}

export default function CloudNineCard({ kind, profile, theme, design, animate = true, className = "" }: CardProps) {
  const c = cardText(kind, design, profile);
  const [a, b] = nameParts(profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const f = Math.min(fit(a, 8), b ? fit(b, 8) : 1) * sc;
  const vars = bxVars(theme, design, "playful");

  const names = (size: number, light = false) => (
    <h2 className={`d i leading-[.95] ${light ? "text-white" : ""}`} style={{ fontSize: `${size * f}cqw` }}>
      <E path="profile.partner1" className="cn-a-name block" style={dl(1.1)}>{a}</E>
      {b && <span className={`cn-a-fade block text-[.42em] not-italic leading-[1.2] ${light ? "text-[#fff3d6]" : ""}`} style={dl(1.4)}><span className="foil">&amp;</span></span>}
      {b && <E path="profile.partner2" className="cn-a-name block" style={dl(1.5)}>{b}</E>}
    </h2>
  );
  const lbl = (path: string, text: string, size = 2.3, cls = "") => text ? <E path={path} className={`lbl cn-a-fade block ${cls}`} style={{ fontSize: `${size}cqw`, ...dl(0.9) }}>{text}</E> : null;
  const meta = (size = 2.4, cls = "text-[var(--t-muted)]") => (c.date || c.where) && (
    <p className={`lbl cn-a-fade ${cls}`} style={{ fontSize: `${size}cqw`, ...dl(2) }}>{c.date}{c.date && c.where && <span className="mx-[1.4cqw] text-[var(--t-gold)]">✦</span>}{c.where}</p>
  );

  let body: ReactNode;
  if (kind === "story" || kind === "post" || kind === "hashtag" || kind === "table") {
    // ── full-bleed dusk sky
    const tall = kind === "story";
    body = (
      <Sky moon={kind === "table" ? 26 : tall ? 40 : 22} moonTop={tall ? "13%" : kind === "table" ? "6%" : "6%"} stars={kind !== "table"}>
        <div className={`absolute inset-x-[7%] z-[4] text-center text-white ${tall ? "top-[37%]" : kind === "table" ? "top-[30%]" : "top-[27%]"}`}>
          {kind === "table" ? (
            <>
              <E path="texts.headline" className="lbl cn-a-fade block" style={{ fontSize: "3.4cqw", ...dl(0.8) }}>{c.headline}</E>
              <p className="d i cn-a-name leading-none" style={{ fontSize: "30cqw", textShadow: "0 4px 30px rgba(60,70,120,.35)", ...dl(1) }}>{c.number}</p>
            </>
          ) : kind === "hashtag" ? (
            <>
              <E path="texts.body" className="d i cn-a-fade block" style={{ fontSize: "6cqw", ...dl(0.8) }}>{c.body}</E>
              <E path="texts.hashtag" className="lbl cn-a-name mt-[4cqw] block" style={{ fontSize: "5cqw", letterSpacing: ".12em", ...dl(1.1) }}>{c.hashtag}</E>
            </>
          ) : (
            <>
              {lbl("texts.eyebrow", c.eyebrow, tall ? 3.2 : 2.6, "text-white/85")}
              <div className="mt-[3cqw]">{names(tall ? 17 : 11, true)}</div>
              {tall && c.lead && <p className="d i cn-a-fade mt-[5cqw] text-white/90" style={{ fontSize: "5cqw", ...dl(2) }}>{c.lead}</p>}
            </>
          )}
        </div>
        {kind !== "table" && kind !== "hashtag" && (
          <div className="absolute inset-x-0 z-[3] text-center" style={{ bottom: tall ? "7%" : "5%" }}>{meta(tall ? 3.2 : 2.5)}</div>
        )}
      </Sky>
    );
  } else if (shape === "landscape") {
    // ── thank-you: sky arch on the left, words on cotton paper
    body = (
      <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--t-surface)_86%,#f5e9d6)]">
        <Grain opacity={0.2} seed={7} />
        <div className="absolute bottom-[8%] left-[5%] top-[8%] w-[38%] overflow-hidden" style={{ borderRadius: "999px 999px 2cqw 2cqw" }}>
          <Sky moon={44} moonTop="14%" />
        </div>
        <div className="absolute inset-y-0 left-[46%] right-[5%] flex flex-col items-center justify-center text-center">
          <Twinkle className="mb-[2cqw] w-[2.4cqw] text-[var(--t-gold)]" />
          <E path="texts.headline" as="h2" className="d i cn-a-name block leading-none" style={{ fontSize: "9.5cqw", ...dl(0.6) }}>{c.headline}</E>
          <E path="texts.body" as="p" multiline className="d cn-a-fade mt-[2.4cqw] block text-[color-mix(in_oklab,var(--t-ink)_80%,transparent)]" style={{ fontSize: "2.6cqw", lineHeight: 1.45, ...dl(1.2) }}>{c.body}</E>
          <p className="lbl cn-a-fade mt-[3cqw] text-[var(--t-muted)]" style={{ fontSize: "1.6cqw", ...dl(1.6) }}>{b ? `${a} & ${b}` : a}</p>
        </div>
      </div>
    );
  } else {
    // ── portrait stationery: cotton paper with an arched window onto the night sky
    const list = kind === "program" || kind === "menu";
    const tall = kind === "menu" || kind === "welcome";
    const archW = list ? 46 : 64;
    body = (
      <div className="absolute inset-0 bg-[color-mix(in_oklab,var(--t-surface)_86%,#f5e9d6)]">
        <Grain opacity={0.2} seed={4} />
        <div className="absolute inset-[3cqw] border border-[color-mix(in_oklab,var(--t-gold)_55%,transparent)]" style={{ borderRadius: "1.2cqw" }} />
        <div className="absolute left-1/2 -translate-x-1/2 overflow-hidden" style={{ top: "8cqw", width: `${archW}cqw`, aspectRatio: list ? "1 / 1.05" : "1 / 1.12", borderRadius: "999px 999px 0 0" }}>
          <Sky moon={46} moonTop="16%" stars={!list} />
        </div>
        <div className="absolute inset-x-[8cqw] flex flex-col items-center text-center" style={{ top: `${8 + archW * (list ? 1.05 : 1.12) + 3}cqw`, bottom: "8cqw" }}>
          {list ? (
            <>
              <E path="texts.headline" as="h2" className="d i cn-a-name block leading-none" style={{ fontSize: "9cqw", ...dl(0.6) }}>{c.headline}</E>
              <div className="mt-[4cqw] flex w-full flex-1 flex-col justify-center gap-[3cqw]">
                {c.items.map((it, i) => (
                  <div key={i} className="cn-a-fade" style={dl(1 + i * 0.15)}>
                    <E path={`items.${i}.title`} className="lbl block text-[var(--t-ink)]" style={{ fontSize: "2.5cqw" }}>{it.title}</E>
                    {it.detail && <E path={`items.${i}.detail`} className="d i mt-[.8cqw] block text-[var(--t-muted)]" style={{ fontSize: "3.6cqw" }}>{it.detail}</E>}
                    {i < c.items.length - 1 && <Twinkle className="mx-auto mt-[2.4cqw] w-[1.8cqw] text-[var(--t-gold)]" />}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {lbl("texts.eyebrow", c.eyebrow, 2.3, "text-[var(--t-muted)]")}
              {kind === "event" && c.headline && <E path="texts.headline" className="d cn-a-fade mt-[1.5cqw] block text-[var(--t-gold)]" style={{ fontSize: "4.6cqw", ...dl(0.9) }}>{c.headline}</E>}
              <div className="mt-[2cqw]">{names(tall ? 11 : kind === "save" ? 9 : 10.5)}</div>
              {kind === "save" && c.date && <p className="d foil cn-a-fade mt-[2.5cqw]" style={{ fontSize: "7cqw", lineHeight: 1, ...dl(1.8) }}>{c.date}</p>}
              {(c.lead || c.body) && (
                <E path={c.body ? "texts.body" : "profile.inviteLine"} as="p" multiline className="d i cn-a-fade mt-[3cqw] block text-[color-mix(in_oklab,var(--t-ink)_78%,transparent)]" style={{ fontSize: kind === "greeting" ? "3.4cqw" : "3.6cqw", lineHeight: 1.35, ...dl(1.7) }}>{c.body || c.lead}</E>
              )}
              <div className="mt-auto">{kind === "save" ? (c.where && <p className="lbl cn-a-fade text-[var(--t-muted)]" style={{ fontSize: "2.2cqw", ...dl(2) }}>{c.where}</p>) : meta(2.2)}</div>
              {c.footer && <E path="texts.footer" className="d i cn-a-fade mt-[1.6cqw] block text-[var(--t-gold)]" style={{ fontSize: "3.4cqw", ...dl(2.2) }}>{c.footer}</E>}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <CardFrame id="cloud-nine" kind={kind} animate={animate} className={`cn ${cnFonts} ${className}`} style={{ ...vars, background: "var(--t-surface)" }}>
      <style href="bx-cloud-nine" precedence="default">{CN_CSS}</style>
      {body}
    </CardFrame>
  );
}
