"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { Bunting, Chubby, Confetti, Spark, Wreath, LS } from "./art";
import { Monogram, TapRattle, TapStar } from "./bits";
import { lsFonts } from "./fonts";
import { LS_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;
const HINT = { en: "tap the stars", ru: "нажмите на звёздочки", hi: "तारों को छूइए" };

export default function LittleStarSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  useLenis(!compact);
  useStory(root, (g, el) => {
    el.querySelectorAll<HTMLElement>(".ls-sec").forEach((s) => rise(g, s.querySelectorAll(".ls-r"), s, { y: 50, filter: "none", ease: "back.out(1.6)", duration: 0.9, stagger: 0.09 }));
    const hero = el.querySelector(".ls-hero");
    if (hero) {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      g.to(el.querySelector(".ls-px-wreath"), { rotate: 25, scrollTrigger: st });
      el.querySelectorAll(".ls-px-f").forEach((x, i) => g.to(x, { yPercent: -120 - i * 60, scrollTrigger: st }));
    }
  }, !compact);

  const head = (eyebrow: string, title: ReactNode, c = LS.butter) => (
    <div className="ls-r mb-[clamp(24px,4cqw,44px)] text-center">
      <Chubby c={c} className="mx-auto mb-3 w-9" />
      <p className="h text-[clamp(20px,2.8cqw,26px)] text-[color-mix(in_oklab,var(--ls-navy)_70%,transparent)]">{eyebrow}</p>
      <h2 className="d ls-h2 mt-1">{title}</h2>
    </div>
  );

  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="ls-sec text-center">
        <div className="ls-wrap max-w-[820px]">
          <p className="ls-r h text-[clamp(24px,3.6cqw,34px)] text-[var(--ls-peach)]">{w.invitation}</p>
          <E as="p" path="profile.inviteLine" multiline className="ls-r d mt-3 block text-[clamp(28px,5.2cqw,52px)] font-extrabold leading-[1.12]">{S.invite}</E>
          <div className="ls-r mt-8 flex justify-center gap-3" aria-hidden>{[LS.butter, LS.sky, LS.peach, LS.mint, LS.lilac].map((c) => <Chubby key={c} c={c} className="w-6" />)}</div>
        </div>
      </Sec>
    ),
    story: (
      <Sec id="story" className="ls-sec">
        <div className="ls-wrap max-w-[760px]">
          <div className="ls-r ls-tile bg-[var(--ls-mint)] text-center">
            <Confetti n={14} seed={7} className="opacity-50" />
            <div className="relative">
              <p className="h text-[clamp(22px,3.2cqw,30px)]">{w.story}</p>
              <h2 className="d ls-h2 mt-1">{w.awaiting}</h2>
              <E as="p" path="profile.story" multiline className="ls-p mx-auto mt-5 block max-w-[560px] !text-[var(--ls-navy)]">{profile.story || w.blessing}</E>
            </div>
            <div className="absolute -bottom-3 left-[18%] h-8 w-8 rotate-45 bg-[var(--ls-mint)]" />
          </div>
        </div>
      </Sec>
    ),
    details: (
      <Sec id="details" className="ls-sec">
        <div className="ls-wrap">
          {head(w.details, <>{S.date || w.soon}</>, LS.sky)}
          <div className="grid gap-[clamp(10px,1.6cqw,18px)] sm:grid-cols-[1.2fr_1fr]">
            <DaysToGo iso={profile.date} render={(n) => (
              <div className="ls-r ls-tile flex min-h-[220px] flex-col justify-between bg-[var(--ls-butter)] sm:row-span-2">
                <Spark className="absolute right-6 top-6 w-8 text-white" />
                <p className="lbl text-[11px]">{w.awaiting}</p>
                <div>
                  <p className="d leading-[.85] text-[clamp(88px,18cqw,200px)]">{n === null ? "★" : n}</p>
                  <p className="h mt-2 text-[clamp(22px,3cqw,30px)]">{n === 0 ? w.today : n === 1 ? w.day : w.days}</p>
                </div>
              </div>
            )} />
            <div className="ls-r ls-tile bg-[var(--ls-sky)]">
              <p className="lbl text-[11px]">{w.when}</p>
              <p className="d mt-2 text-[clamp(26px,3.8cqw,40px)] leading-tight">{S.date}</p>
              {S.events[0]?.time && <p className="h text-2xl">{S.events[0].time}</p>}
            </div>
            <div className="ls-r ls-tile bg-[var(--ls-peach)]">
              <p className="lbl text-[11px]">{w.where}</p>
              <E as="p" path="profile.venue" className="d mt-2 block text-[clamp(26px,3.8cqw,40px)] leading-tight">{profile.venue}</E>
              <E as="p" path="profile.city" className="h block text-2xl">{profile.city}</E>
            </div>
          </div>
          {calendarUrl && <div className="ls-r mt-8 text-center"><a href={calendarUrl} className="ls-pill">★ {w.calendar}</a></div>}
        </div>
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="ls-sec">
        <div className="ls-wrap">
          {head(w.schedule, <>{w.program}</>, LS.peach)}
          <div className="relative flex flex-wrap justify-center gap-[clamp(14px,3cqw,34px)]">
            {S.events.map((e, i) => {
              const c = [LS.butter, LS.sky, LS.mint, LS.peach, LS.lilac][i % 5];
              return (
                <div key={i} className="ls-r grid aspect-square w-[clamp(150px,26cqw,240px)] place-content-center rounded-full p-5 text-center" style={{ background: c, transform: `rotate(${i % 2 ? 4 : -4}deg)` }}>
                  <p className="lbl text-[10px]">{e.time}</p>
                  <p className="d mt-1 text-[clamp(20px,2.8cqw,28px)] leading-tight">{e.name}</p>
                  {e.date && e.date !== profile.date && <p className="h text-lg">{S.fmt(e.date)}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="ls-sec">
        <div className="ls-wrap max-w-[760px]">
          <div className="ls-r ls-tile bg-[var(--ls-navy)] text-center text-[var(--ls-cream)]">
            <Confetti n={18} seed={4} className="opacity-60" />
            <div className="relative">
              <Chubby c={LS.butter} face className="mx-auto w-14" />
              <p className="h mt-2 text-[clamp(22px,3cqw,28px)] text-[var(--ls-butter)]">{w.venue}</p>
              <E as="h2" path="profile.venue" className="d ls-h2 block">{profile.venue || profile.city}</E>
              <p className="ls-p mt-2 !text-[var(--ls-cream)] opacity-80">{S.where}</p>
              {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="ls-pill mt-7 !bg-[var(--ls-butter)] !text-[var(--ls-navy)]">{w.directions} →</a>}
            </div>
          </div>
        </div>
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="ls-sec">
        <div className="ls-wrap">
          {head(w.gallery, <>{w.hello}</>, LS.mint)}
          <div className="flex flex-wrap justify-center gap-[clamp(16px,3cqw,32px)]">
            {(S.gallery.length ? S.gallery : [heroUrl ?? null]).map((src, i) => (
              <figure key={i} className="ls-r relative w-[clamp(200px,30cqw,300px)] bg-white p-3 pb-12 shadow-[0_24px_40px_-24px_rgba(46,58,85,.5)]" style={{ transform: `rotate(${[-4, 3, -2, 5][i % 4]}deg)` }}>
                <div className="aspect-square overflow-hidden"><Photo src={src} slot={S.gallery.length ? "gallery" : "hero"} /></div>
                <Chubby c={[LS.butter, LS.peach, LS.sky][i % 3]} face className="absolute -right-4 -top-4 w-12" />
              </figure>
            ))}
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="ls-sec">
        <div className="ls-wrap max-w-[640px]">
          {head(w.rsvp, <>{S.L.attend}</>, LS.lilac)}
          <div className="ls-r ls-scallop bg-white px-[clamp(18px,5cqw,40px)] pb-[clamp(22px,5cqw,40px)] pt-[clamp(36px,6cqw,52px)] text-left shadow-[0_30px_60px_-40px_rgba(46,58,85,.5)]">{children}</div>
        </div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="ls-sec text-center">
        <div className="ls-wrap max-w-[680px]">
          {head(w.info, <>{w.with}</>, LS.sky)}
          <E as="p" path="texts.body" multiline className="ls-r ls-p block whitespace-pre-line">{S.info || w.blessing}</E>
        </div>
      </Sec>
    ),
  };

  const k = Math.min(fit(a, 8), b ? fit(b, 8) : 1);
  const name = compact ? `clamp(34px, ${10 * k}cqw, 90px)` : `clamp(42px, min(${10 * k}cqw, ${8 * k}svh), 120px)`;
  const wreath = compact ? "clamp(220px,62cqw,440px)" : "clamp(260px,min(74cqw,46svh),460px)";
  return (
    <div ref={root} className={`ls ls-site ${lsFonts}`} style={bxVars(theme, design, "playful")}>
      <style href="bx-little-star" precedence="default">{LS_CSS}</style>
      {/* ── Opening: stars pop into a wreath one by one, the monogram stamps in, the rattle wiggles awake ── */}
      <header className="ls-hero ls-cream relative flex flex-col items-center justify-center overflow-hidden px-5 pb-[clamp(40px,8svh,80px)] pt-[clamp(70px,12cqw,120px)] text-center" style={{ minHeight: compact ? "auto" : "100svh" }}>
        <Confetti n={34} seed={3} className="opacity-70" />
        <div className="absolute inset-x-0 top-0 z-[1] flex justify-center overflow-hidden">{[0, 1, 2, 3].map((i) => <Bunting key={i} n={7} className="shrink-0" style={{ flex: "0 0 clamp(390px,34cqw,560px)" }} />)}</div>
        <TapStar c={LS.sky} face className="ls-px-f left-[6%] top-[22%] w-[clamp(36px,7cqw,64px)]" />
        <TapStar c={LS.peach} className="ls-px-f right-[8%] top-[30%] w-[clamp(28px,5cqw,48px)]" />
        <TapStar c={LS.mint} className="ls-px-f bottom-[18%] left-[10%] w-[clamp(26px,4.5cqw,44px)]" />
        <TapStar c={LS.butter} face className="ls-px-f bottom-[10%] right-[9%] w-[clamp(34px,6cqw,60px)]" />
        <div className="relative mt-[clamp(8px,2svh,24px)]" style={{ width: wreath }}>
          <div className="ls-px-wreath aspect-square"><Wreath className="h-full w-full" /></div>
          <div className="absolute inset-[18%] grid place-items-center rounded-full bg-white/70 shadow-[inset_0_0_0_2px_rgba(46,58,85,.06)]">
            <Monogram a={a} b={b} size={`calc(${wreath} * .26)`} />
          </div>
          <TapRattle className="bottom-[-4%] right-[-10%] w-[26%] rotate-[24deg]" />
        </div>
        <p className="lbl ls-up mt-[clamp(14px,3svh,30px)] text-[clamp(10px,1.3cqw,12px)] opacity-70" style={dl(1.9)}>{S.line}</p>
        <h1 className="d mt-2 leading-[.95]" style={{ fontSize: name }}>
          <E path="profile.partner1" className="ls-up inline-block" style={dl(2)}>{a}</E>
          {b && <span className="h ls-up mx-[.18em] inline-block text-[.6em] text-[var(--ls-peach)]" style={dl(2.1)}>&amp;</span>}
          {b && <E path="profile.partner2" className="ls-up inline-block" style={dl(2.2)}>{b}</E>}
        </h1>
        <p className="ls-up mt-4 inline-flex flex-wrap justify-center gap-2" style={dl(2.4)}>
          {S.date && <span className="ls-pill !py-[.7em] !text-[11px] !shadow-none">{S.date}</span>}
          {profile.city && <span className="ls-pill !bg-[var(--ls-butter)] !py-[.7em] !text-[11px] !text-[var(--ls-navy)] !shadow-none">{profile.city}</span>}
        </p>
        {!compact && <p className="h ls-up mt-5 text-xl opacity-60" style={dl(3)}>✦ {HINT[S.lang]} ✦</p>}
      </header>

      {S.visible.map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative overflow-hidden bg-[var(--ls-navy)] px-6 pb-12 pt-16 text-center text-[var(--ls-cream)]">
        <Confetti n={24} seed={9} />
        <div className="relative">
          <div className="mx-auto flex w-max gap-2">{[LS.butter, LS.peach, LS.mint].map((c, i) => <Chubby key={c} c={c} face={i === 1} className="w-10" />)}</div>
          <p className="d mt-4 text-3xl">{b ? `${a} & ${b}` : a}</p>
          <E as="p" path="profile.blessing" className="h mt-2 block text-2xl text-[var(--ls-butter)]">{profile.blessing || w.with}</E>
          <div className="mt-8 text-xs opacity-70">{credit}</div>
        </div>
      </footer>
    </div>
  );
}
