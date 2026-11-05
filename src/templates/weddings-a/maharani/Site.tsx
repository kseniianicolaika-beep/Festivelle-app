"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, fit, siteData } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { archMask, archPath, ArchMark, Damask, Diya, Jaali, PalaceLake, pointedPath, Toran, ZariBand } from "./art";
import { GoldDust } from "./dust";
import { FACES, FONTS, GOLD } from "./faces";
import "./maharani.css";

const caps: CSSProperties = { fontFamily: "var(--wa-cinzel), var(--wa-corsc), var(--font-rozha), serif", letterSpacing: "0.32em", textTransform: "uppercase" };
const deva: CSSProperties = { fontFamily: "var(--font-rozha), var(--font-deva), var(--wa-amiri), serif" };

/** Lotus rosette medallion (date). */
function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden fill="none" stroke="var(--t-gold)">
      <circle r="96" strokeWidth=".8" opacity=".6" /><circle r="90" strokeWidth=".6" strokeDasharray="1 3" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d="M0 -88C7 -78 7 -68 0 -60C-7 -68 -7 -78 0 -88Z" strokeWidth=".9" transform={`rotate(${i * 15})`} />)}
      <circle r="60" strokeWidth=".8" /><circle r="56" strokeWidth=".4" strokeDasharray="1 2" />
    </svg>
  );
}

export default function MaharaniSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  const ready = useScene(ref, (k) => {
    const tl = k.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".mah-curtain", { width: "50%" }, { width: compact ? "8%" : "9%", duration: 2.8, ease: "power3.inOut" }, 0.5)
      .fromTo(".mah-curtain", { scaleY: 1 }, { scaleY: 1.015, duration: 0.6, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.5)
      .from("[data-arch]", { scale: 1.06, opacity: 0.4, filter: "brightness(.4)", duration: 3, ease: "power2.out" }, 0.6)
      .from("[data-toran]", { yPercent: -60, opacity: 0, duration: 1.6, ease: "back.out(1.4)" }, 1.4)
      .from("[data-diya]", { scale: 0, opacity: 0, transformOrigin: "50% 90%", duration: 0.9, stagger: 0.1, ease: "back.out(2)" }, 1.9);
    tl.fromTo("[data-in]", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 1.9)
      .from("[data-names] .wa-name", { opacity: 0, letterSpacing: "0.5em", filter: "blur(10px)", y: 10, duration: 2, stagger: 0.25, ease: "power2.out" }, 1.95)
      .from("[data-amp]", { opacity: 0, scale: 0.5, duration: 1.2 }, 2.4)
      .from("[data-hero-meta] > *", { y: 14, opacity: 0, duration: 1, stagger: 0.12 }, 2.6);
    if (compact) return;
    const st = { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true };
    k.gsap.to("[data-arch] [data-lake]", { yPercent: 8, scrollTrigger: st });
    k.gsap.to("[data-hero-copy]", { y: -50, opacity: 0.2, scrollTrigger: st });
    revealOnScroll(k);
    k.q("[data-draw]").forEach((el) => k.gsap.from(el, { drawSVG: "0%", duration: 2.6, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
  }, [compact]);

  const has = (id: SectionId) => {
    switch (id) {
      case "invitation": return S.occ !== "greeting";
      case "story": return !!profile.story;
      case "details": return !!(date || S.where);
      case "schedule": return S.events.length > 0;
      case "venue": return !!S.where;
      case "gallery": return S.gallery.length > 0;
      case "rsvp": return true;
      case "info": return !!S.info;
    }
  };
  const vis = S.visible.filter(has);
  const pad = compact ? "px-6" : "px-6 @3xl:px-14";
  const muted = { color: "var(--t-muted)" };
  const head = (title: string) => (
    <div data-reveal className="mb-14 flex flex-col items-center text-center">
      <ArchMark className="mb-5 w-10 text-[var(--t-gold)]" />
      <h2 className="text-[1.35rem] @3xl:text-[1.7rem]" style={{ ...caps, color: "var(--t-gold)" }}>{title}</h2>
      <div className="mt-5 w-40 opacity-80"><ZariBand /></div>
    </div>
  );
  const nameSize = fit(a.length >= b.length ? a : b, 14, 6);

  const render = (id: SectionId, i: number): ReactNode => {
    const alt = i % 2 === 1;
    const sbg: CSSProperties = { background: alt ? "color-mix(in oklab, var(--t-bg) 86%, #000)" : "var(--t-bg)" };
    switch (id) {
      case "invitation":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            <div className="mx-auto grid max-w-6xl items-center gap-14 @4xl:grid-cols-[1fr_1.05fr]">
              <figure data-reveal className="relative mx-auto w-full max-w-[420px]">
                <div className="mah-arch-glow relative aspect-[3/4]">
                  <div className="absolute inset-0" style={archMask(300, 400)}>
                    <Photo src={heroUrl} className="h-full w-full object-cover" fallback={<PalaceLake className="h-full w-full" still={compact} />} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,180,90,.12),transparent_45%,rgba(40,5,12,.45))] mix-blend-soft-light" />
                  </div>
                  <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
                    <path d={archPath(0, 0, 300, 400, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-[-16px] h-[calc(100%+32px)] w-[calc(100%+32px)]" aria-hidden>
                    <path d={pointedPath(0, 0, 300, 400, 0.6)} fill="none" stroke="var(--t-gold)" strokeWidth="1" opacity=".5" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </figure>
              <div className="text-center @4xl:text-left">
                <p data-reveal className="mb-6 text-[11px]" style={{ ...caps, color: "var(--t-gold)" }}>{L.invitation}</p>
                <E as="p" multiline path="profile.inviteLine" className="block text-[1.9rem] italic leading-[1.35] @3xl:text-[2.5rem]" style={ff.body}>{S.invite}</E>
                <p data-reveal className="mt-10 text-[2.6rem] leading-tight @3xl:text-[3.2rem]" style={{ ...ff.script, color: "var(--t-gold)" }}>{a}{b && <><span className="mx-3" style={{ fontFamily: "var(--wa-vibes)" }}>&amp;</span>{b}</>}</p>
                {profile.tradition && <p className="mt-4 text-[11px]" style={{ ...caps, ...muted }}>{profile.tradition}</p>}
              </div>
            </div>
          </Sec>
        );
      case "story":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.story)}
            <div data-reveal className="relative mx-auto max-w-3xl px-2 text-center @3xl:px-16">
              <span className="absolute -left-1 -top-10 text-[7rem] leading-none opacity-30 @3xl:left-4" style={{ ...ff.script, color: "var(--t-gold)" }}>“</span>
              <E as="p" multiline path="profile.story" className="relative block whitespace-pre-line text-[1.55rem] italic leading-[1.6] @3xl:text-[1.9rem]" style={ff.body}>{profile.story}</E>
              <div className="mx-auto mt-12 flex items-end justify-center gap-6">{[0, 1, 2].map((d) => <Diya key={d} className={d === 1 ? "w-14" : "w-10"} still={compact} delay={d * 0.4} />)}</div>
            </div>
          </Sec>
        );
      case "details":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.details)}
            <div className="mx-auto grid max-w-5xl items-center gap-14 text-center @3xl:grid-cols-2">
              {date && (
                <div data-reveal className="relative mx-auto aspect-square w-[min(78vw,330px)] @3xl:w-[340px]">
                  <Rosette className={`absolute inset-0 h-full w-full ${compact ? "" : "mah-rosette"}`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px]" style={{ ...caps, ...muted }}>{date.weekday}</p>
                    <p className="wa-foil text-[5.4rem] font-light leading-none" style={{ ...ff.body, ...GOLD }}>{date.day}</p>
                    <p className="text-[12px]" style={caps}>{date.month}</p>
                    <p className="mt-1 text-[12px]" style={{ ...caps, ...muted }}>{date.year}</p>
                  </div>
                </div>
              )}
              {S.where && (
                <div data-reveal="0.15">
                  <p className="text-[10px]" style={{ ...caps, ...muted }}>{L.where}</p>
                  <E as="p" path={S.wherePath} className="mt-5 block text-[2.4rem] leading-[1.1] @3xl:text-[2.9rem]" style={{ ...ff.body, fontWeight: 500 }}>{S.where}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-[12px]" style={{ ...caps, color: "var(--t-gold)" }}>{profile.city}</E>}
                  {calendarUrl && <a href={calendarUrl} className="wa-btn mt-10 border border-[var(--t-gold)]/70 text-[var(--t-gold)] hover:bg-[var(--t-gold)]/10">✦ {L.calendar}</a>}
                </div>
              )}
            </div>
          </Sec>
        );
      case "schedule":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.events)}
            <div className={`mx-auto grid max-w-6xl justify-center gap-x-6 gap-y-14 ${S.events.length > 2 ? "@3xl:grid-cols-3" : "@3xl:grid-cols-2"} @2xl:grid-cols-2`}>
              {S.events.map((e, j) => (
                <div key={j} data-reveal={j * 0.1} className="relative mx-auto w-full max-w-[300px]">
                  <Diya className="absolute -top-9 left-1/2 z-10 w-14 -translate-x-1/2" still={compact} delay={j * 0.3} />
                  <div className="relative aspect-[4/5]">
                    <div className="absolute inset-0" style={{ ...archMask(300, 400), background: "radial-gradient(90% 60% at 50% 30%, color-mix(in oklab, var(--t-accent) 22%, var(--t-surface)), var(--t-surface))" }} />
                    <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                      <path d={archPath(0, 0, 300, 400, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                      <path d={archPath(12, 12, 276, 388, 4)} fill="none" stroke="var(--t-gold)" strokeWidth=".8" opacity=".5" vectorEffect="non-scaling-stroke" />
                    </svg>
                    <div className="absolute inset-x-6 bottom-8 top-[30%] flex flex-col items-center justify-start text-center">
                      <p className="text-[11px]" style={{ ...caps, color: "var(--t-gold)" }}>{String(j + 1).padStart(2, "0")}</p>
                      <h3 className="mt-3 text-[1.9rem] leading-tight" style={{ ...ff.body, fontWeight: 500 }}>{e.name}</h3>
                      <div className="my-4 h-px w-12 bg-[var(--t-gold)]/60" />
                      <p className="text-[13px] leading-relaxed" style={muted}>{eventWhen(e, S.lang)}</p>
                      {e.venue && <p className="mt-1 text-[13px] italic" style={muted}>{e.venue}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {calendarUrl && !vis.includes("details") && <div className="mt-14 text-center"><a href={calendarUrl} className="wa-btn border border-[var(--t-gold)]/70 text-[var(--t-gold)]">✦ {L.calendar}</a></div>}
          </Sec>
        );
      case "venue":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.venue)}
            <div data-reveal className="relative mx-auto max-w-5xl overflow-hidden rounded-t-[999px] border border-[var(--t-gold)]/50 p-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] @2xl:aspect-[16/9]">
                <PalaceLake wide className="absolute inset-0 hidden h-full w-full @2xl:block" still={compact} />
                <PalaceLake className="absolute inset-0 h-full w-full @2xl:hidden" still={compact} />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-[#14050a] via-[#14050a]/70 to-transparent px-6 pb-10 pt-24 text-center text-[#f6e7c8]">
                  <E as="p" path={S.wherePath} className="block text-[2.2rem] leading-tight @3xl:text-[3rem]" style={{ ...ff.body, fontWeight: 500 }}>{S.where}</E>
                  {profile.venue && profile.city && <p className="mt-2 text-[11px]" style={{ ...caps, color: "var(--t-gold)" }}>{profile.city}</p>}
                  <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn mt-7 bg-[var(--t-gold)] text-[#2a070c] hover:brightness-110">{L.directions} →</a>
                </div>
              </div>
            </div>
            {S.goa && (
              <div data-reveal className="mx-auto mt-14 max-w-2xl text-center">
                <p className="text-[10px]" style={{ ...caps, color: "var(--t-gold)" }}>{L.travel}</p>
                <p className="mt-4 text-xl leading-relaxed" style={muted}>{L.travelText}</p>
              </div>
            )}
          </Sec>
        );
      case "gallery":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.gallery)}
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 @3xl:grid-cols-3 @3xl:gap-6">
              {S.gallery.map((g, j) => (
                <div key={g.key} data-reveal={(j % 3) * 0.08} className="relative aspect-[3/4]">
                  <div className="absolute inset-0" style={archMask(300, 400)}><Photo slot="gallery" galleryKey={g.key} src={g.src} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div>
                  <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden><path d={archPath(0, 0, 300, 400, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg>
                </div>
              ))}
            </div>
          </Sec>
        );
      case "rsvp":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 ${pad}`}>
            {head(L.rsvp)}
            <div data-reveal className="mah-patra relative mx-auto max-w-2xl rounded-[2px] px-6 pb-10 pt-12 @2xl:px-12"
              style={{ "--t-ink": "#3a0d12", "--t-muted": "#7a4b3a", "--t-bg": "#fbf0d8", "--t-surface": "#fffaf0", "--t-accent": "#9a2a1e" } as CSSProperties}>
              <div className="absolute inset-x-0 top-0"><ZariBand /></div>
              <p className="mb-8 text-center text-[1.7rem] italic" style={{ ...ff.body, color: "#7a1c1c" }}>{L.attend}</p>
              {children}
            </div>
          </Sec>
        );
      case "info":
        return (
          <Sec key={id} id={id} style={sbg} className={`py-24 text-center ${pad}`}>
            {head(L.info)}
            <E as="p" multiline path="texts.body" className="mx-auto block max-w-2xl whitespace-pre-line text-xl leading-relaxed" style={muted}>{S.info}</E>
          </Sec>
        );
    }
  };

  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "maharani", FACES), ...GOLD, ...ff.body }} className={`mah @container relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: the velvet parts on a candlelit jharokha ── */}
      <header data-hero className={`relative isolate flex flex-col items-center justify-center overflow-hidden pt-[70px] ${compact ? "h-[720px]" : "h-[100svh] min-h-[700px]"}`}
        style={{ background: "radial-gradient(80% 60% at 50% 45%, color-mix(in oklab, var(--t-bg) 70%, #a3402a), var(--t-bg) 70%, color-mix(in oklab, var(--t-bg) 70%, #000))" }}>
        <Damask className="absolute inset-0" opacity={0.16} />
        <div className="absolute left-[12%] top-[30%] hidden w-[11%] opacity-70 @5xl:block"><Jaali /></div>
        <div className="absolute right-[12%] top-[30%] hidden w-[11%] opacity-70 @5xl:block"><Jaali /></div>
        <div data-toran className="absolute inset-x-0 top-[38px] z-10"><Toran className="w-full" w={1400} swags={7} clear={0.2} still={compact} /></div>

        <div data-hero-copy className="relative z-[5] flex flex-col items-center">
          <div data-arch className="mah-arch-glow @container relative aspect-[3/4]" style={{ height: compact ? 430 : "min(66svh, 104cqw)" }}>
            <div className="absolute inset-0 overflow-hidden" style={archMask(300, 400)}>
              <div data-lake className="absolute inset-[-6%_0_-6%_0]"><PalaceLake className="h-full w-full" still={compact} /></div>
              <div className="absolute inset-0 bg-[radial-gradient(70%_40%_at_50%_26%,rgba(12,4,24,.55),transparent_80%)]" />
            </div>
            <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
              <path d={archPath(0, 0, 300, 400, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-[-14px] h-[calc(100%+28px)] w-[calc(100%+28px)]" aria-hidden>
              <path d={archPath(0, 0, 300, 400, 4)} fill="none" stroke="var(--t-gold)" strokeWidth=".9" opacity=".6" vectorEffect="non-scaling-stroke" />
            </svg>
            <svg viewBox="0 0 300 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-[-34px] h-[calc(100%+68px)] w-[calc(100%+68px)]" aria-hidden>
              <path d={pointedPath(0, 0, 300, 400, 0.62)} fill="none" stroke="var(--t-gold)" strokeWidth="1" strokeDasharray="2 5" opacity=".6" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="mah-names absolute inset-x-[8%] top-[13%] flex flex-col items-center text-center" style={GOLD}>
              {S.invocation && <p data-in className="mb-3 text-[15px] text-[var(--t-gold)]" dir="auto" style={deva}>{S.invocation.text}</p>}
              <p data-in className="mb-4 text-[9.5px] text-[#f6e7c8]/85" style={caps}>{S.occ === "wedding" ? W.wedding : S.line}</p>
              <h1 data-names data-in className="flex flex-col items-center leading-[1.02]" style={ff.display}>
                <E path="profile.partner1" className="wa-name wa-foil block tracking-[0.08em]" style={{ fontSize: `${nameSize}cqw` }}>{a}</E>
                {b && <span data-amp className="block text-[#ffd98a]" style={{ fontFamily: "var(--wa-vibes), cursive", fontSize: `${nameSize * 0.7}cqw`, lineHeight: 1.1 }}>&amp;</span>}
                {b && <E path="profile.partner2" className="wa-name wa-foil block tracking-[0.08em]" style={{ fontSize: `${nameSize}cqw` }}>{b}</E>}
              </h1>
            </div>
          </div>
          {/* sill with diyas */}
          <div className="relative z-10 -mt-[6px] w-full">
            <div className="mx-auto h-[10px] w-[min(92cqw,520px)] bg-[linear-gradient(180deg,#e6b85c,#8a5a1c)] shadow-[0_10px_30px_rgba(0,0,0,.5)]" />
            <div className="mx-auto -mt-[46px] flex w-[min(86cqw,480px)] items-end justify-between px-2">
              {[0, 1, 2, 3, 4].map((d) => <div key={d} data-diya><Diya className={d === 2 ? "w-14" : "w-11"} still={compact} delay={d * 0.35} /></div>)}
            </div>
          </div>
          <div data-hero-meta data-in className="mt-6 flex flex-col items-center gap-2 text-center">
            {date && <p className="text-[12px] text-[var(--t-gold)]" style={caps}>{date.full}</p>}
            {S.where && <E as="p" path={S.wherePath} className="block text-[17px] italic">{S.where}</E>}
            {days !== null && days > 0 && <p className="mt-2 text-[11px] opacity-80" style={caps}><span className="text-[var(--t-gold)]">{days}</span> · {W.days}</p>}
          </div>
        </div>

        <div className="mah-pelmet" />
        <div className="mah-curtain mah-curtain-l" />
        <div className="mah-curtain mah-curtain-r" />
        {!compact && <GoldDust className="absolute inset-0 z-30" />}
      </header>

      {vis.map((id, i) => render(id, i))}

      <footer className="relative overflow-hidden pb-14 pt-20 text-center" style={{ background: "color-mix(in oklab, var(--t-bg) 80%, #000)" }}>
        <Damask className="absolute inset-0" opacity={0.1} />
        <div className="relative mx-auto mb-8 aspect-[3/4] w-28">
          <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full" aria-hidden><path d={archPath(10, 10, 280, 380, 4)} fill="none" stroke="var(--t-gold)" strokeWidth="3" /></svg>
          <p className="wa-foil absolute inset-0 flex items-center justify-center pt-6 text-4xl" style={{ ...ff.display, ...GOLD }}>{a[0]}{b && <span className="mx-1 text-3xl" style={{ fontFamily: "var(--wa-vibes)" }}>&amp;</span>}{b?.[0]}</p>
        </div>
        {profile.blessing && <E as="p" path="profile.blessing" className="relative mx-auto mb-6 block max-w-xl px-6 text-3xl text-[var(--t-gold)]" style={ff.script}>{profile.blessing}</E>}
        {S.occ === "wedding" && <p className="relative text-[10px] opacity-70" style={caps}>{L.forever}</p>}
        <div className="relative mx-auto mt-8 flex justify-center gap-5">{[0, 1, 2].map((d) => <Diya key={d} className="w-9" still={compact} delay={d * 0.5} />)}</div>
        {credit && <div className="relative mt-10 text-[11px] tracking-wide opacity-60">{credit}</div>}
      </footer>
    </div>
  );
}
