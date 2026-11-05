"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { FACES, FONTS, LINES } from "./faces";
import { Constellation, DecoCorner, Dhol, FairyLights, Fan, GlStars, Moon, Shisha, StarDust } from "./art";
import "./sangeet.css";

export const FOIL = { "--wa-f1": "#94701f", "--wa-f2": "#fff1c2", "--wa-f3": "var(--t-gold)" } as CSSProperties;

export default function SangeetSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const X = LINES[S.lang];
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    const tl = k.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.set("[data-iris]", { opacity: 1 }, 0)
      .from("[data-first-star]", { scale: 0, opacity: 0, duration: 0.9, ease: "back.out(3)" }, 0.1)
      .fromTo("[data-iris]", { clipPath: "circle(0% at 50% 44%)" }, { clipPath: "circle(150% at 50% 44%)", duration: 2.4, ease: "power3.inOut" }, 0.55)
      .to("[data-first-star]", { opacity: 0, scale: 3, duration: 1.2 }, 1.1)
      .from("[data-hero] [data-cstar]", { scale: 0, opacity: 0, duration: 0.7, stagger: { each: 0.06, from: "random" }, ease: "back.out(2.5)" }, 1.0)
      .from("[data-hero] [data-cline]", { drawSVG: "0%", duration: 0.9, stagger: 0.07, ease: "power2.inOut" }, 1.3)
      .from("[data-hero] [data-clink]", { drawSVG: "50% 50%", duration: 1.2, ease: "power2.inOut" }, 2.3)
      .from("[data-hero] [data-lights]", { yPercent: -60, opacity: 0, duration: 1.6, stagger: 0.15 }, 0.9)
      .from("[data-hero] [data-mirrors] > *", { scale: 0, opacity: 0, duration: 0.8, stagger: { each: 0.05, from: "center" }, ease: "back.out(2)" }, 3.2)
      .from("[data-hero] [data-fan]", { scaleY: 0, transformOrigin: "50% 100%", opacity: 0, duration: 1.8 }, 1.4);
    tl.from("[data-names] .wa-name", { opacity: 0, letterSpacing: "0.45em", filter: "blur(14px)", duration: 2.2, stagger: 0.25, ease: "power2.out" }, 2.3)
      .from("[data-amp]", { opacity: 0, scale: 0.4, rotate: -20, duration: 1.2 }, 2.9)
      .from("[data-hero-meta] > *", { y: 14, opacity: 0, duration: 1, stagger: 0.12 }, 3.1)
      .fromTo("[data-hero] [data-constellation]", { opacity: 1 }, { opacity: 0.45, duration: 2, immediateRender: false }, 3.4);
    if (compact) return;
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-hero] [data-constellation]", { yPercent: -30, scrollTrigger: st });
    k.gsap.to("[data-hero] [data-lights]", { yPercent: -50, scrollTrigger: st });
    k.gsap.to("[data-hero-copy]", { yPercent: -25, opacity: 0, scrollTrigger: st });
    k.gsap.to("[data-hero] [data-moon]", { y: 80, scrollTrigger: st });
    revealOnScroll(k);
    k.q("[data-vinyl]").forEach((el) => k.gsap.to(el, { rotate: 360, duration: 6, repeat: -1, ease: "none" }));
    k.q("[data-arch]").forEach((el) => k.gsap.from(el, { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)", duration: 1.8, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 82%", once: true } }));
  }, [compact]);

  const has: Record<SectionId, boolean> = {
    invitation: S.occ !== "greeting", story: !!profile.story, details: !!(date || S.where), schedule: S.events.length > 0,
    venue: !!S.where, gallery: S.gallery.length > 0, rsvp: true, info: !!S.info,
  };
  const vis = S.visible.filter((id) => has[id]);
  const pad = compact ? "px-6" : "px-6 @3xl:px-16";
  const muted = { color: "var(--t-muted)" };
  const gold = { color: "var(--t-gold)" };
  const head = (n: number, title: string, sub?: string) => (
    <div data-reveal className="mb-14 flex flex-col items-center text-center">
      <Fan className="mb-5 w-28 opacity-90" />
      <p className="text-[13px] italic" style={{ ...ff.script, ...gold }}>No. {String(n).padStart(2, "0")}</p>
      <h2 className="mt-3 text-[2.3rem] uppercase leading-none tracking-[0.14em] @3xl:text-[3.2rem]" style={ff.display}>{title}</h2>
      {sub && <p className="mt-5 text-xl italic" style={{ ...ff.script, ...muted }}>{sub}</p>}
    </div>
  );
  const btn = "wa-btn border border-[var(--t-gold)] text-[var(--t-gold)] hover:bg-[var(--t-gold)] hover:text-[var(--t-bg)]";
  const frame = (children: ReactNode, cls = "") => (
    <div className={`relative border border-[var(--t-gold)]/45 ${cls}`}>
      <div className="pointer-events-none absolute inset-[6px] border border-[var(--t-gold)]/20" />
      <DecoCorner className="absolute -left-px -top-px w-12" />
      <DecoCorner className="absolute -right-px -top-px w-12 rotate-90" />
      <DecoCorner className="absolute -bottom-px -right-px w-12 rotate-180" />
      <DecoCorner className="absolute -bottom-px -left-px w-12 -rotate-90" />
      {children}
    </div>
  );

  const render = (id: SectionId, i: number) => {
    const n = i + 1;
    const alt = i % 2 === 1;
    const body = (() => {
      switch (id) {
        case "invitation":
          return (
            <div className={`mx-auto max-w-6xl py-24 ${pad}`}>
              <div className="grid items-center gap-14 @3xl:grid-cols-[0.9fr_1.1fr]">
                <div data-reveal className="relative mx-auto w-full max-w-[380px]">
                  <div data-arch className="sang-arch relative aspect-[3/4] overflow-hidden rounded-t-full border border-[var(--t-gold)]/60 p-2">
                    <div className="h-full w-full overflow-hidden rounded-t-full">
                      <Photo src={heroUrl} className="h-full w-full object-cover" style={{ filter: "saturate(.9) contrast(1.05)" }}
                        fallback={<div className="relative h-full w-full bg-[radial-gradient(circle_at_50%_70%,#3a2a6a,#0b0d22)]"><StarDust className="absolute inset-0 h-full w-full" count={60} still={compact} /><Moon className="absolute left-1/2 top-[22%] w-1/3 -translate-x-1/2" /></div>} />
                    </div>
                    <div className="pointer-events-none absolute inset-2 rounded-t-full bg-[linear-gradient(180deg,transparent_55%,rgba(11,13,34,.55))]" />
                  </div>
                  <Shisha className="absolute -bottom-7 -left-7 w-20" />
                  <Shisha className="absolute -bottom-7 -right-7 w-20" />
                </div>
                <div data-reveal="0.15">
                  {frame(
                    <div className="px-8 py-14 text-center @3xl:px-14">
                      <p className="wa-caps text-[10px]" style={gold}>{L.invitation}</p>
                      <E as="p" multiline path="profile.inviteLine" className="mx-auto mt-8 block text-[1.7rem] italic leading-[1.4] @3xl:text-[2.1rem]" style={ff.script}>{S.invite}</E>
                      <p className="mt-10 text-[1.6rem] uppercase tracking-[0.18em]" style={ff.display}><span className="wa-foil" style={FOIL}>{b ? `${a} & ${b}` : a}</span></p>
                      <p className="mt-4 text-sm tracking-[0.25em]" style={muted}>{X.night}</p>
                    </div>,
                  )}
                </div>
              </div>
            </div>
          );
        case "story":
          return (
            <div className={`relative mx-auto max-w-3xl py-28 text-center ${pad}`}>
              {head(n, L.story)}
              <Moon className="mx-auto -mt-4 mb-8 w-16" />
              <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.5rem] italic leading-[1.6] @3xl:text-[1.9rem]" style={ff.script}>{profile.story}</E>
            </div>
          );
        case "details":
          return (
            <div className={`mx-auto max-w-5xl py-24 ${pad}`}>
              {head(n, L.details)}
              <div className="grid items-center gap-12 text-center @3xl:grid-cols-[1fr_auto_1fr]">
                {date ? (
                  <div data-reveal>
                    <p className="wa-caps text-[10px]" style={muted}>{L.when}</p>
                    <p className="mt-4 text-[7rem] leading-[0.9] @3xl:text-[8.5rem]" style={ff.display}><span className="wa-foil" style={FOIL}>{date.day}</span></p>
                    <p className="text-2xl uppercase tracking-[0.3em]" style={ff.display}>{date.month} {date.year}</p>
                    <p className="mt-3 text-lg italic" style={{ ...ff.script, ...muted }}>{date.weekday}</p>
                  </div>
                ) : <div />}
                <Shisha className="mx-auto hidden w-24 @3xl:block" petals={14} />
                {S.where && (
                  <div data-reveal="0.15">
                    <p className="wa-caps text-[10px]" style={muted}>{L.where}</p>
                    <E as="p" path={S.wherePath} className="mt-6 block text-[2.4rem] uppercase leading-[1.1] tracking-[0.08em]" style={ff.display}>{S.where}</E>
                    {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-lg italic" style={{ ...ff.script, ...muted }}>{profile.city}</E>}
                    <p className="mt-6 text-[11px] tracking-[0.3em]" style={gold}>{X.dress.toUpperCase()}</p>
                  </div>
                )}
              </div>
              {calendarUrl && <div data-reveal className="mt-14 text-center"><a href={calendarUrl} className={btn}>✦ {L.calendar}</a></div>}
            </div>
          );
        case "schedule":
          return (
            <div className={`mx-auto max-w-5xl py-24 ${pad}`}>
              {head(n, X.setlist, L.events)}
              <div className="grid items-center gap-14 @3xl:grid-cols-[1fr_260px]">
                <ol className="sang-setlist">
                  {S.events.map((e, j) => (
                    <li key={j} data-reveal={j * 0.08} className="border-b border-[var(--t-gold)]/20 py-6">
                      <div className="flex items-baseline gap-4">
                        <span className="w-10 shrink-0 text-xl italic" style={{ ...ff.script, ...gold }}>{String(j + 1).padStart(2, "0")}</span>
                        <h3 className="text-[1.6rem] uppercase leading-tight tracking-[0.1em] @3xl:text-[2rem]" style={ff.display}>{e.name}</h3>
                        <span className="sang-leader mx-2 hidden flex-1 @2xl:block" />
                        <span className="ml-auto shrink-0 text-lg tracking-[0.12em] @2xl:ml-0" style={{ ...ff.display, ...gold }}>{e.time}</span>
                      </div>
                      <p className="mt-2 pl-14 text-[11px] uppercase tracking-[0.24em]" style={muted}>{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ")}</p>
                    </li>
                  ))}
                </ol>
                <div data-reveal className="relative mx-auto hidden w-[240px] @3xl:block">
                  <svg data-vinyl viewBox="0 0 200 200" className="w-full drop-shadow-[0_20px_40px_rgba(0,0,0,.5)]" aria-hidden>
                    <circle cx="100" cy="100" r="98" fill="#07081a" />
                    {Array.from({ length: 16 }, (_, q) => <circle key={q} cx="100" cy="100" r={40 + q * 3.6} fill="none" stroke="#fff" strokeOpacity={q % 3 ? 0.05 : 0.1} />)}
                    <path d="M40 60 A70 70 0 0 1 90 32" stroke="#fff" strokeOpacity=".22" strokeWidth="6" fill="none" />
                    <circle cx="100" cy="100" r="34" fill="var(--t-gold)" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="#141833" strokeOpacity=".4" />
                    <text x="100" y="106" textAnchor="middle" fontSize="16" fill="#141833" style={ff.display}>{a[0]}{b ? ` & ${b[0]}` : ""}</text>
                    <circle cx="100" cy="100" r="3" fill="#141833" />
                  </svg>
                  <p className="mt-6 text-center text-lg italic" style={{ ...ff.script, ...muted }}>{X.night}</p>
                </div>
              </div>
              {calendarUrl && !S.visible.includes("details") && <div className="mt-12 text-center"><a href={calendarUrl} className={btn}>✦ {L.calendar}</a></div>}
            </div>
          );
        case "venue":
          return (
            <div className={`mx-auto max-w-3xl py-24 text-center ${pad}`}>
              {head(n, L.venue)}
              <div data-reveal>
                <E as="p" path={S.wherePath} className="block text-[2.6rem] uppercase leading-[1.1] tracking-[0.1em] @3xl:text-[3.4rem]" style={ff.display}>{S.where}</E>
                {profile.venue && profile.city && <p className="mt-3 text-xl italic" style={{ ...ff.script, ...muted }}>{profile.city}</p>}
                <a target="_blank" rel="noreferrer" href={S.map} className={`${btn} mt-10`}>{L.directions} →</a>
                {S.goa && (
                  <div className="mx-auto mt-14 max-w-xl border-t border-[var(--t-gold)]/25 pt-10">
                    <p className="wa-caps text-[10px]" style={gold}>{L.travel}</p>
                    <p className="mt-4 text-xl italic leading-relaxed" style={{ ...ff.script, ...muted }}>{L.travelText}</p>
                  </div>
                )}
              </div>
            </div>
          );
        case "gallery":
          return (
            <div className={`mx-auto max-w-6xl py-24 ${pad}`}>
              {head(n, L.gallery)}
              <div className="columns-2 gap-3 @3xl:columns-3">
                {S.gallery.map((g, j) => (
                  <div key={g.key} data-reveal={(j % 3) * 0.08} className="mb-3 break-inside-avoid border border-[var(--t-gold)]/30 p-1.5">
                    <Photo slot="gallery" galleryKey={g.key} src={g.src} className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          );
        case "rsvp":
          return (
            <div className={`mx-auto max-w-2xl py-28 ${pad}`}>
              {head(n, L.rsvp, X.dance)}
              <div data-reveal>{frame(<div className="sang-rsvp p-7 @2xl:p-12">{children}</div>)}</div>
            </div>
          );
        case "info":
          return (
            <div className={`mx-auto max-w-2xl py-24 text-center ${pad}`}>
              {head(n, L.info)}
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl italic leading-relaxed" style={{ ...ff.script, ...muted }}>{S.info}</E>
            </div>
          );
      }
    })();
    return <Sec key={id} id={id} className={alt ? "sang-alt" : ""}>{body}</Sec>;
  };

  const nameLen = Math.max(a.length, b.length);
  const heroSize = `clamp(2rem, ${(15 * Math.min(1, 7.5 / Math.max(nameLen, 1))).toFixed(2)}cqw, 9.5rem)`;
  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "starlit-sangeet", FACES), ...ff.body }} className={`sang relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] @container ${FONTS} ${ready ? "" : "wa-pre"}`}>
      <header data-hero className={`relative isolate overflow-hidden ${compact ? "h-[660px]" : "h-[100svh] min-h-[640px]"}`}>
        <div data-first-star className="absolute left-1/2 top-[44%] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff8e6] shadow-[0_0_30px_10px_rgba(255,236,190,.8)] opacity-0" />
        <div data-iris data-in className="sang-sky absolute inset-0">
          <StarDust className="absolute inset-0 h-full w-full" count={compact ? 70 : 110} still={compact} />
          {!compact && <GlStars className="absolute inset-0" />}
          <div data-moon className="absolute right-[8%] top-[13%] w-16 @3xl:right-[12%] @3xl:w-24"><Moon className="w-full" /></div>
          <div data-lights className="absolute inset-x-[-5%] top-0"><FairyLights className="h-[70px] w-full @3xl:h-[110px]" sag={70} bulbs={compact ? 18 : 30} still={compact} /></div>
          <div data-lights className="absolute inset-x-[-5%] top-0 opacity-70"><FairyLights className="h-[120px] w-full @3xl:h-[190px]" sag={120} bulbs={compact ? 14 : 24} seed={9} still={compact} /></div>
          <div data-constellation style={{ opacity: 0.45 }} className="absolute inset-x-0 top-[26%] left-1/2 w-[170%] -translate-x-1/2 @3xl:top-[18%] @3xl:w-[min(1100px,92%)]"><Constellation className="w-full" /></div>
          <div data-fan className="absolute bottom-0 left-1/2 w-[min(820px,170%)] -translate-x-1/2"><Fan className="w-full opacity-40" rays={31} /></div>
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--t-bg)] to-transparent" />
          <div data-mirrors className="absolute inset-x-0 bottom-5 flex justify-center gap-3 overflow-hidden @3xl:bottom-8 @3xl:gap-5">
            {Array.from({ length: compact ? 7 : 15 }, (_, q) => <Shisha key={q} className={`shrink-0 ${q % 2 ? "w-7 @3xl:w-9" : "w-10 @3xl:w-12"}`} petals={q % 2 ? 8 : 12} />)}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-[18%] mx-auto h-[60%] w-[min(900px,100%)] bg-[radial-gradient(closest-side,rgba(8,9,28,.7),transparent)]" />
          <div data-hero-copy className="absolute inset-x-0 top-[24%] flex flex-col items-center px-6 text-center @3xl:top-[27%]">
            <p className="wa-caps mb-7 text-[10px]" style={gold}>{S.occ === "wedding" ? X.night : S.line}</p>
            <h1 data-names className="flex flex-col items-center leading-[0.95] @3xl:flex-row @3xl:items-baseline @3xl:gap-8" style={ff.display}>
              <E path="profile.partner1" className="wa-name wa-foil block uppercase tracking-[0.06em]" style={{ ...FOIL, fontSize: heroSize }}>{a}</E>
              {b && <span data-amp className="block text-[clamp(2.4rem,9cqw,4.6rem)] italic text-[#f4ecff]" style={ff.script}>&amp;</span>}
              {b && <E path="profile.partner2" className="wa-name wa-foil block uppercase tracking-[0.06em]" style={{ ...FOIL, fontSize: heroSize }}>{b}</E>}
            </h1>
            <div data-hero-meta className="mt-9 flex flex-col items-center gap-3">
              {S.occ === "wedding" && <p className="text-xl italic" style={{ ...ff.script, color: "#e9e0ff" }}>{S.line}</p>}
              {date && <p className="text-[13px] tracking-[0.42em]" style={ff.display}>{date.full.toUpperCase()}</p>}
              {S.where && <E as="p" path={S.wherePath} className="block text-[11px] tracking-[0.32em]" style={muted}>{S.where.toUpperCase()}</E>}
              {days !== null && days > 0 && (
                <div className="sang-count mt-5 flex items-baseline gap-3 px-6 py-2.5">
                  <span className="text-3xl" style={{ ...ff.display, ...gold }}>{days}</span>
                  <span className="text-[10px] tracking-[0.32em]">{X.until.toUpperCase()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {vis.map((id, i) => render(id, i))}

      <footer className="relative overflow-hidden pb-14 pt-10 text-center">
        <FairyLights className="mb-14 h-[80px] w-full" sag={60} bulbs={28} still={compact} seed={13} />
        <Dhol className="mx-auto mb-10 w-40 @3xl:w-52" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mb-8 block max-w-xl px-6 text-3xl italic" style={{ ...ff.script, color: "#e9e0ff" }}>{profile.blessing}</E>}
        <p className="text-5xl uppercase tracking-[0.2em]" style={ff.display}><span className="wa-foil" style={FOIL}>{a[0]}{b ? ` & ${b[0]}` : ""}</span></p>
        {S.occ === "wedding" && <p className="wa-caps mt-6 text-[10px]" style={muted}>{L.forever}</p>}
        {credit && <div className="mt-12 text-[11px] tracking-wide" style={muted}>{credit}</div>}
      </footer>
    </div>
  );
}
