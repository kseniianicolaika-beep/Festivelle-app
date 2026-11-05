"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { Motes } from "../_shared/Motes";
import { Cloud, Moon, Star, Twinkle, Dots } from "./art";
import { cnFonts } from "./fonts";
import { CN_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function CloudNineSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  useLenis(!compact);
  useStory(root, (g, el) => {
    const hero = el.querySelector(".cn-hero");
    if (hero) {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      g.to(el.querySelectorAll(".cn-px-front"), { yPercent: -28, scrollTrigger: st });
      g.to(el.querySelectorAll(".cn-px-back"), { yPercent: -8, scrollTrigger: st });
      g.to(el.querySelector(".cn-px-moon"), { yPercent: 40, scale: 0.85, scrollTrigger: st });
      g.to(el.querySelector(".cn-px-text"), { yPercent: 30, opacity: 0, scrollTrigger: { ...st, end: "70% top" } });
    }
    el.querySelectorAll<HTMLElement>(".cn-sec").forEach((s) => rise(g, s.querySelectorAll(".cn-r"), s));
    el.querySelectorAll<HTMLElement>(".cn-line").forEach((p) => g.from(p, { scaleY: 0, ease: "none", scrollTrigger: { trigger: p.closest("section"), start: "top 70%", end: "bottom 60%", scrub: true } }));
    el.querySelectorAll<HTMLElement>(".cn-px-cloud").forEach((c, i) => g.fromTo(c, { xPercent: i % 2 ? 12 : -12 }, { xPercent: i % 2 ? -12 : 12, ease: "none", scrollTrigger: { trigger: c.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
  }, !compact);

  const head = (eyebrow: string, title: ReactNode) => (
    <div className="cn-r mb-[clamp(28px,5cqw,52px)]">
      <Twinkle className="mx-auto mb-4 h-4 w-4 text-[var(--t-gold)]" />
      <p className="lbl text-[11px] text-[var(--t-muted)]">{eyebrow}</p>
      <h2 className="d i cn-h">{title}</h2>
    </div>
  );

  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="cn-sec">
        <div className="cn-wrap">
          <Star className="cn-r mx-auto mb-8 h-10 w-10" />
          <E as="p" path="profile.inviteLine" multiline className="cn-r d i block text-[clamp(30px,6.2cqw,64px)] leading-[1.18]">{S.invite}</E>
          <p className="cn-r lbl mt-10 text-[11px] text-[var(--t-muted)]">{S.line}</p>
          <p className="cn-r d mt-3 text-[clamp(26px,4.4cqw,40px)]"><E path="profile.partner1">{a}</E>{b && <> <span className="i text-[var(--t-gold)]">&amp;</span> <E path="profile.partner2">{b}</E></>}</p>
        </div>
      </Sec>
    ),
    story: (
      <Sec id="story" className="cn-sec">
        <div className="cn-wrap">
          {head(w.story, <>{w.awaiting}</>)}
          <div className="cn-r mb-10 flex items-center justify-center gap-[clamp(8px,2cqw,18px)]" aria-hidden>
            {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((f, i) => (
              <span key={i} className="block rounded-full" style={{ width: "clamp(12px,2.4cqw,22px)", aspectRatio: "1", background: `radial-gradient(circle at ${100 - f * 60}% 50%, #f3dcac ${f * 70}%, color-mix(in oklab, var(--t-accent) 30%, #fff) ${f * 70 + 8}%)`, boxShadow: "0 0 12px rgba(243,220,172,.6)" }} />
            ))}
          </div>
          <E as="p" path="profile.story" multiline className="cn-r cn-p block">{profile.story || w.blessing}</E>
        </div>
      </Sec>
    ),
    details: (
      <Sec id="details" className="cn-sec">
        <div className="cn-wrap">
          {head(w.details, <>{S.date || w.soon}</>)}
          <DaysToGo iso={profile.date} render={(n) => (
            <div className="cn-r cn-pillow mx-auto mb-12 flex w-[min(100%,420px)] flex-col items-center px-8 py-9">
              <span className="d foil cn-a-sheen block text-[clamp(64px,13cqw,120px)] leading-none">{n === null ? "·" : n}</span>
              <span className="lbl mt-2 text-[11px] text-[var(--t-muted)]">{n === 0 ? w.today : n === 1 ? w.day : w.days}</span>
            </div>
          )} />
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="cn-r cn-card px-7 py-8">
              <p className="lbl text-[10px] text-[var(--t-muted)]">{w.when}</p>
              <p className="d mt-3 text-[clamp(24px,3.6cqw,32px)]">{S.date}</p>
              {S.events[0]?.time && <p className="mt-1 text-sm text-[var(--t-muted)]">{S.events[0].time}</p>}
            </div>
            <div className="cn-r cn-card px-7 py-8">
              <p className="lbl text-[10px] text-[var(--t-muted)]">{w.where}</p>
              <E as="p" path="profile.venue" className="d mt-3 block text-[clamp(24px,3.6cqw,32px)]">{profile.venue}</E>
              <E as="p" path="profile.city" className="mt-1 block text-sm text-[var(--t-muted)]">{profile.city}</E>
            </div>
          </div>
          {calendarUrl && <a href={calendarUrl} className="cn-r cn-btn mt-10">{w.calendar}</a>}
        </div>
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="cn-sec">
        <div className="cn-wrap">
          {head(w.schedule, <>{w.program}</>)}
          <div className="relative mx-auto max-w-[520px] text-left">
            <div className="cn-line absolute bottom-6 left-[17px] top-3 w-0 origin-top border-l border-dashed border-[color-mix(in_oklab,var(--t-gold)_80%,transparent)]" aria-hidden />
            {S.events.map((e, i) => (
              <div key={i} className="cn-r relative flex gap-6 pb-10 last:pb-0">
                <Star className="relative z-[1] mt-1 h-9 w-9 shrink-0" tone={i % 2 ? "blue" : "gold"} />
                <div>
                  <p className="lbl text-[10px] text-[var(--t-muted)]">{[e.time, e.date && e.date !== profile.date ? S.fmt(e.date) : ""].filter(Boolean).join(" · ")}</p>
                  <p className="d i mt-1 text-[clamp(26px,4cqw,36px)] leading-tight">{e.name}</p>
                  {e.venue && <p className="mt-1 text-sm text-[var(--t-muted)]">{e.venue}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="cn-sec overflow-hidden">
        <div className="cn-px-cloud pointer-events-none absolute -left-[10%] top-[18%] w-[46%] opacity-70"><Cloud v={1} className="w-full" /></div>
        <div className="cn-px-cloud pointer-events-none absolute -right-[12%] bottom-[10%] w-[52%] opacity-60"><Cloud v={0} className="w-full" /></div>
        <div className="cn-wrap relative">
          {head(w.venue, <E path="profile.venue">{profile.venue || profile.city}</E>)}
          <p className="cn-r cn-p">{S.where}</p>
          {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="cn-r cn-btn mt-8">{w.directions} →</a>}
        </div>
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="cn-sec">
        <div className="cn-wrap">
          {head(w.gallery, <>{w.hello}</>)}
          {S.gallery.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {S.gallery.map((src, i) => <div key={src} className={`cn-r cn-arch aspect-[3/4] ${i % 3 === 1 ? "sm:translate-y-8" : ""}`}><Photo src={src} slot="gallery" /></div>)}
            </div>
          ) : (
            <div className="cn-r relative mx-auto w-[min(78%,380px)]">
              <div className="cn-arch aspect-[3/4] shadow-[0_40px_80px_-40px_rgba(60,80,130,.6)]"><Photo src={heroUrl} slot="hero" /></div>
              <Moon className="absolute -right-[14%] -top-[10%] w-[34%]" />
              <Cloud v={2} className="absolute -bottom-[10%] -left-[16%] w-[62%]" />
            </div>
          )}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="cn-sec">
        <div className="cn-wrap max-w-[620px]">
          {head(w.rsvp, <>{S.L.attend}</>)}
          <div className="cn-r cn-card relative p-[clamp(20px,5cqw,44px)] text-left">{children}</div>
        </div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="cn-sec">
        <div className="cn-wrap">
          {head(w.info, <>{w.with}</>)}
          <E as="p" path="texts.body" multiline className="cn-r cn-p block whitespace-pre-line">{S.info || w.blessing}</E>
        </div>
      </Sec>
    ),
  };

  const k = Math.min(fit(a, 7), fit(b, 7));
  const big = compact ? `clamp(56px, ${22 * k}cqw, 170px)` : `clamp(64px, min(${22 * Math.min(fit(a, 7), fit(b, 7))}cqw, ${(14 * Math.min(fit(a, 7), fit(b, 7))).toFixed(2)}svh), 190px)`;
  const bank = compact ? "clamp(110px,30cqw,220px)" : "clamp(130px,min(36cqw,24svh),240px)";
  return (
    <div ref={root} className={`cn cn-site ${cnFonts}`} style={bxVars(theme, design, "playful")}>
      <style href="bx-cloud-nine" precedence="default">{CN_CSS}</style>
      {/* ── Opening: the clouds part, a sleepy moon rises, the nursery stars drop on their threads ── */}
      <header className="cn-hero cn-sky gap-[clamp(10px,2svh,28px)] pt-[clamp(40px,8svh,90px)]" style={{ minHeight: compact ? "clamp(560px,150cqw,820px)" : "100svh" }}>
        <Dots n={70} seed={3} className="absolute inset-0 h-[70%] w-full opacity-70" />
        {!compact && <Motes color={[1, 0.96, 0.86]} count={90} size={7} rise={0.004} />}
        <div className="cn-px-back pointer-events-none absolute inset-x-0 bottom-[6%]">
          <Cloud v={0} className="cn-drift absolute bottom-0 left-[-12%] w-[62%] opacity-80" tint="#b9c8e6" />
          <Cloud v={1} className="cn-drift absolute bottom-[4%] right-[-10%] w-[54%] opacity-80" tint="#c3cfe9" style={{ animationDelay: "-12s" }} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-[8%]" aria-hidden>
          {[{ h: 70, s: 8, d: 1.3, t: "gold" }, { h: 140, s: 5.5, d: 1.55, t: "blue" }, { h: 40, s: 6, d: 1.4, t: "blush" }, { h: 160, s: 5, d: 1.7, t: "gold" }, { h: 90, s: 7, d: 1.45, t: "blue" }].map((x, i) => (
            <div key={i} className={`cn-hang ${i === 2 ? "hidden sm:block" : ""}`} style={{ "--dl": `${x.d}s`, "--sw": `${4 + i}s`, width: `clamp(22px,${x.s}cqw,54px)` } as CSSProperties}>
              <Star hang={x.h} tone={x.t as "gold"} className="w-full" />
            </div>
          ))}
        </div>
        <div className="cn-px-moon pointer-events-none relative z-[1] mx-auto w-[clamp(130px,min(30cqw,24svh),240px)]">
          <div className="cn-a-rise"><Moon className="cn-float w-full" /></div>
        </div>
        <div className="cn-px-text relative z-[4] px-5" style={{ paddingBottom: bank }}>
          <p className="lbl cn-a-fade text-[clamp(10px,1.4cqw,13px)] text-white/85" style={dl(1.4)}>{S.line}</p>
          <h1 className="d i cn-names mt-4 leading-[.92]" style={{ fontSize: big }}>
            <E path="profile.partner1" className="cn-a-name block" style={dl(1.7)}>{a}</E>
            {b && <span className="cn-a-fade block text-[.42em] not-italic text-[#fff3d6]" style={dl(2.1)}>&amp;</span>}
            {b && <E path="profile.partner2" className="cn-a-name block" style={dl(2.2)}>{b}</E>}
          </h1>
          <p className="lbl cn-a-fade mt-7 text-[clamp(10px,1.5cqw,13px)] text-white/90" style={dl(2.7)}>{[S.date, profile.city].filter(Boolean).join("  ·  ")}</p>
        </div>
        <div className="cn-px-front pointer-events-none absolute inset-x-0 bottom-[-2px] z-[3]">
          <div className="cn-a-partl absolute bottom-0 left-[-14%] w-[72%]" style={{ height: bank }}><Cloud v={0} stretch className="h-full w-full" /></div>
          <div className="cn-a-partr absolute bottom-[-2%] right-[-14%] w-[72%]" style={{ height: bank }}><Cloud v={1} stretch className="h-full w-full" /></div>
          <div className="relative h-[clamp(36px,8cqw,90px)] w-full" style={{ background: "linear-gradient(180deg, transparent, var(--t-bg) 70%)" }} />
        </div>
        {!compact && <p className="lbl cn-a-fade absolute bottom-6 z-[4] text-[10px] text-[var(--t-muted)]" style={dl(3.2)}>{w.scroll}</p>}
      </header>

      {S.visible.map((id, i) => <div key={id} className={i % 2 ? "cn-band" : ""}>{sections[id]}</div>)}

      <footer className="cn-sky relative overflow-hidden px-6 pb-12 pt-28 text-center text-white">
        <Cloud v={2} className="absolute -top-6 left-[-6%] w-[44%] rotate-180 opacity-90" />
        <Cloud v={1} className="absolute -top-8 right-[-8%] w-[50%] rotate-180 opacity-90" />
        <Moon className="mx-auto w-20" sheen={false} />
        <p className="d i mt-4 text-3xl">{S.b ? `${a} & ${b}` : a}</p>
        <E as="p" path="profile.blessing" className="lbl mt-3 block text-[10px] text-white/80">{profile.blessing || w.with}</E>
        <div className="mt-8 text-xs text-white/70">{credit}</div>
      </footer>
    </div>
  );
}
