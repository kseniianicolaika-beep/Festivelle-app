"use client";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, prefersReduced, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst } from "../_shared/fx";
import { Alien, Hills, Moon, Pad, Planet, Puff, Rocket, SP, Stars } from "./art";

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const editable = !!useEdit()?.editable;
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  const [launched, setLaunched] = useState(!!compact);
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.utils.toArray<SVGElement>(".sp-tw").forEach((s, i) => gsap.to(s, { opacity: 0.15, scale: 0.6, transformOrigin: "50% 50%", duration: 0.8 + (i % 5) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: (i % 7) * 0.3 }));
    gsap.to(".sp-beacon", { opacity: 0.2, duration: 0.6, yoyo: true, repeat: -1, ease: "steps(1)" });
    gsap.to(".sp-wave", { rotate: -28, duration: 0.45, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".sp-alien", { y: -6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".sp-ringed", { rotate: 4, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 50%" });
    gsap.utils.toArray<HTMLElement>(".sp-float").forEach((f, i) => gsap.to(f, { y: i % 2 ? 10 : -10, rotate: i % 2 ? 2 : -2, duration: 3 + i * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" }));
    if (!compact) {
      gsap.to(".sp-par", { yPercent: 14, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".sp-shoot").forEach((s, i) => gsap.fromTo(s, { x: 0, y: 0, autoAlpha: 0 }, { x: -420, y: 220, autoAlpha: 1, duration: 1.1, ease: "power1.in", repeat: -1, repeatDelay: 6 + i * 4, delay: 3 + i * 5 }));
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  // ── the signature: 3 · 2 · 1 · lift-off ──
  const launch = useCallback(() => {
    const host = hero.current;
    if (!host) return;
    if (prefersReduced()) return setLaunched(true);
    const tl = gsap.timeline({ onComplete: () => setLaunched(true) });
    gsap.set(".sp-lift", { y: 0 });
    gsap.set(".sp-orbiter", { autoAlpha: 0 });
    tl.set(".sp-count", { autoAlpha: 1 });
    ["3", "2", "1"].forEach((n, i) => {
      tl.fromTo(`.sp-n${i}`, { scale: 2.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(2)" }, i * 0.85)
        .to(`.sp-n${i}`, { scale: 0.6, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, i * 0.85 + 0.55)
        .fromTo(".sp-ring", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: "none" }, i * 0.85);
    });
    tl.to(".sp-lift", { x: "+=2", duration: 0.05, repeat: 15, yoyo: true, ease: "none" }, 1.9)
      .fromTo(".sp-flame", { scaleY: 0.2, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 1.9)
      .to(".sp-flame", { scaleY: 1.25, scaleX: 0.9, duration: 0.08, repeat: 30, yoyo: true, ease: "none" }, 2.2)
      .fromTo(".sp-smoke .sp-puff", { scale: 0.1, autoAlpha: 0.95, transformOrigin: "50% 50%" }, { scale: () => gsap.utils.random(1.4, 2.4), x: () => gsap.utils.random(-140, 140), y: () => gsap.utils.random(-20, 10), autoAlpha: 0, duration: 2.6, ease: "power2.out", stagger: 0.06 }, 2)
      .set(".sp-count", { autoAlpha: 0 }, 2.55)
      .fromTo(".sp-blast", { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.4)" }, 2.55)
      .to(".sp-blast", { autoAlpha: 0, y: -30, duration: 0.5 }, 3.4)
      .to(".sp-lift", { y: -1500, duration: 2.6, ease: "power2.in" }, 2.6)
      .fromTo(".sp-reveal", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 3.3)
      .from(".sp-name .ch", { autoAlpha: 0, scale: 0.2, y: -40, rotate: () => gsap.utils.random(-30, 30), duration: 0.9, ease: "back.out(2.2)", stagger: 0.07 }, 3.3)
      .from(".sp-reveal [data-up]", { autoAlpha: 0, y: 18, duration: 0.6, ease: "power2.out", stagger: 0.08 }, 3.6)
      .call(() => {
        const n = host.querySelector(".sp-name");
        if (!n) return;
        const a = host.getBoundingClientRect();
        const b = n.getBoundingClientRect();
        burst(host, b.left - a.left + b.width / 2, b.top - a.top + b.height / 2, { colors: [SP.mustard, SP.cream, SP.pink, SP.teal], shapes: ["star", "dot"], count: 30, velocity: [120, 360], gravity: 120, size: 12 });
      }, [], 3.6)
      .set(".sp-lift", { y: 0, autoAlpha: 0 }, 5.4)
      .to(".sp-lift", { autoAlpha: 1, duration: 0.8 }, 5.6)
      .to(".sp-flame", { autoAlpha: 0, duration: 0.4 }, 5.4)
      .set(".sp-orbiter", { autoAlpha: 1 }, 4.4);
  }, []);

  useEffect(() => {
    if (compact) return;
    if (prefersReduced()) return setLaunched(true);
    gsap.set(".sp-reveal", { autoAlpha: 0 });
    gsap.set(".sp-flame", { autoAlpha: 0 });
    const t = setTimeout(launch, 700);
    return () => clearTimeout(t);
  }, [compact, launch]);

  useAnim(hero, ({ reduce }) => {
    if (reduce || compact) return;
    gsap.utils.toArray<SVGGElement>(".sp-orbiter").forEach((o) => {
      const path = o.ownerSVGElement?.querySelector(".sp-orbit-path");
      if (path) gsap.to(o.querySelector(".sp-mini"), { motionPath: { path: path as SVGPathElement, align: path as SVGPathElement, alignOrigin: [0.5, 0.5], autoRotate: 90 }, duration: 16, ease: "none", repeat: -1 });
    });
  }, [compact]);

  const tapSky = (e: React.MouseEvent) => {
    if (!hero.current || (e.target as Element).closest("button,a")) return;
    const r = hero.current.getBoundingClientRect();
    burst(hero.current, e.clientX - r.left, e.clientY - r.top, { colors: [SP.mustard, SP.cream, SP.lilac], shapes: ["star"], count: 12, velocity: [80, 220], gravity: 60, size: 13 });
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.4em] text-[var(--w-mustard)]">✦ {tr(p, { en: "Incoming transmission", ru: "Входящее сообщение", hi: "नया संदेश" })} ✦</p>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(24px,4.4cqi,40px)] font-medium leading-[1.35]" style={{ fontFamily: "var(--w-display)" }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div className="sp-float relative mx-auto w-[min(78cqi,360px)]" data-pop="-3">
            <div className="relative aspect-square overflow-hidden rounded-full ring-[10px] ring-[#E9DCC0] shadow-[0_0_0_14px_rgba(255,244,220,.08),0_30px_70px_-20px_rgba(0,0,0,.7)]">
              {heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg data-edit-photo="hero" viewBox="-100 -100 200 200" className="h-full w-full" style={{ background: SP.indigo }}><Stars w={200} h={200} n={30} tw={false} /><Alien y={60} s={1.4} /></svg>
              )}
              <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, rgba(255,255,255,.35), transparent 40%)" }} />
            </div>
            <span className="absolute -right-2 top-6 rounded-full bg-[var(--w-accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white">{tr(p, { en: "Captain", ru: "Капитан", hi: "कप्तान" })}</span>
          </div>
          <div data-pop>
            <Heading eyebrow={tr(p, { en: "Crew file", ru: "Досье экипажа", hi: "क्रू फ़ाइल" })} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[18px] leading-[1.75] opacity-85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Mission briefing", ru: "Брифинг миссии", hi: "मिशन की जानकारी" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Panel tag={tr(p, { en: "Launch date", ru: "Дата старта", hi: "लॉन्च की तारीख़" })}>
              <p className="text-[clamp(34px,5cqi,44px)] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.monthShort}` : fmtDate(p)}</p>
              <p className="mt-3 text-[15px] opacity-75">{[db?.weekday, db?.year, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Panel>
          )}
          {where && (
            <Panel tag={tr(p, { en: "Launch pad", ru: "Стартовая площадка", hi: "लॉन्च पैड" })}>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="block text-[clamp(28px,4.4cqi,38px)] font-bold leading-[1.05]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-3 text-[15px] opacity-75">{p.city}</p>}
            </Panel>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-baseline gap-3 rounded-[14px] border border-[var(--w-mustard)]/50 bg-black/25 px-6 py-3 font-mono">
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--w-mustard)]">T−</span>
              <span className="text-[30px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{days}</span>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] opacity-70">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={tr(p, { en: "Flight plan", ru: "План полёта", hi: "उड़ान योजना" })} />
        <div className="relative mx-auto mt-14 max-w-4xl">
          <svg viewBox="0 0 800 120" preserveAspectRatio="none" className="absolute left-0 top-10 hidden h-[120px] w-full @3xl:block" aria-hidden><path d="M20 90 C 220 -10 580 -10 780 90" fill="none" stroke={SP.cream} strokeOpacity=".3" strokeWidth="2" strokeDasharray="4 10" vectorEffect="non-scaling-stroke" /></svg>
          <div className="relative grid gap-10 @3xl:grid-cols-3">
            {p.events!.map((e, i) => {
              const c = [SP.teal, SP.mustard, SP.pink, SP.lilac][i % 4];
              return (
                <div key={i} className={`flex items-center gap-5 @3xl:flex-col @3xl:text-center ${i === 1 ? "@3xl:-mt-6" : "@3xl:mt-10"}`} data-pop>
                  <svg viewBox="-60 -60 120 120" className="h-[92px] w-[92px] shrink-0" aria-hidden style={{ overflow: "visible" }}><Planet id={`${uid}-ev${i}`} r={34} c={c} ring={i % 2 === 0} tilt={-14 + i * 10} /></svg>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--w-mustard)]">{tr(p, { en: "Stage", ru: "Этап", hi: "चरण" })} {i + 1}{e.time ? ` · ${e.time}` : ""}</p>
                    <h3 className="mt-1 text-[24px] font-bold leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
                    <p className="mt-1 text-[14px] opacity-70">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-2" className="overflow-hidden rounded-[28px] border border-white/15 bg-[#1B2050]"><StarChart uid={uid} /></div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={tr(p, { en: "Coordinates", ru: "Координаты", hi: "निर्देशांक" })} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Mission photos", ru: "Фото с орбиты", hi: "मिशन की तस्वीरें" })} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 @3xl:grid-cols-3">
          {design!.gallery!.map((k, i) => (
            <figure key={k} data-pop={i % 2 ? 2 : -2} className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
              {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((c) => <span key={c} className={`absolute h-5 w-5 border-[var(--w-mustard)] ${c}`} />)}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-white/80">IMG_{String(i + 1).padStart(3, "0")}</span>
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-60 -110 120 110" className="sp-float absolute -top-[96px] right-[8%] w-[110px]" aria-hidden style={{ overflow: "visible" }}><Alien s={1.1} c="#9BD67B" /></svg>
          <div className="relative rounded-[32px] px-6 py-12 @xl:px-12" style={{ background: SP.cream, color: SP.ink, boxShadow: "0 40px 90px -40px rgba(0,0,0,.8)" }}>
            <Heading eyebrow="RSVP" title={tr(p, { en: "Join the crew?", ru: "Полетишь с нами?", hi: "क्रू में शामिल होंगे?" })} dark />
            <p className="mx-auto mt-4 max-w-md text-center text-[16px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl" data-pop>
          <Panel tag={L.info}><E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[17px] leading-relaxed">{design!.texts!.body!}</E></Panel>
        </div>
      </Sec>
    ),
  };

  const big = Math.min(17, 92 / Math.max(3, [...(p.partner1 || "")].length));
  const orbit = (w: number, h: number) => `M${w * 0.08} ${h * 0.5} C ${w * 0.1} ${h * 0.12} ${w * 0.9} ${h * 0.12} ${w * 0.92} ${h * 0.45} S ${w * 0.1} ${h * 0.9} ${w * 0.08} ${h * 0.5}Z`;

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-cream)]`}
      style={{ ...worldVars(design, { bg: SP.night, ink: SP.cream, accent: SP.red, cream: SP.cream, mustard: SP.mustard, display: STACKS.star.display, body: STACKS.star.body }), fontFamily: "var(--w-body)", background: `linear-gradient(180deg, var(--w-bg) 0%, ${SP.indigo} 55%, #2A2F6C 100%)` }}
    >
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 4000"><Stars w={1000} h={4000} n={260} seed={11} tw={false} /></svg>

      <header ref={hero} onClick={tapSky} className="relative isolate overflow-hidden" style={{ height: compact ? 760 : "max(100svh, 680px)", background: `radial-gradient(120% 70% at 50% 100%, #3B3F86 0%, #232A5C 45%, ${SP.night} 100%)` }}>
        <div className="sp-par absolute inset-0">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <Stars w={400} h={720} n={70} seed={4} />
            <path className="sp-orbit-path" d={orbit(400, 640)} fill="none" stroke="none" />
            <Moon x={336} y={110} r={30} />
            <g className="sp-ringed"><Planet id={`${uid}-m1`} x={60} y={520} r={44} c={SP.lilac} ring /></g>
            <Planet id={`${uid}-m2`} x={344} y={640} r={30} c={SP.teal} />
            <Alien x={344} y={614} s={0.5} />
            <g transform="translate(0 700)"><Hills w={400} h={144} /></g>
            <g className="sp-orbiter" style={{ opacity: compact ? 0 : undefined }}><g className="sp-mini"><Rocket id={`${uid}-mo`} s={0.12} flame /></g></g>
            <Pad x={200} y={790} s={0.6} />
            <g className="sp-lift"><Rocket id={`${uid}-mr`} x={214} y={786} s={0.62} /></g>
            <g className="sp-smoke">{[-50, -20, 10, 40, -70, 70].map((dx, i) => <Puff key={i} x={214 + dx} y={792} s={0.6} />)}</g>
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <Stars w={1440} h={760} n={170} seed={7} />
            <path className="sp-orbit-path" d={orbit(1440, 760)} fill="none" stroke="none" />
            <Moon x={1210} y={150} r={56} />
            <g className="sp-ringed"><Planet id={`${uid}-d1`} x={230} y={360} r={86} c={SP.lilac} ring /></g>
            <Planet id={`${uid}-d2`} x={1180} y={660} r={58} c={SP.teal} />
            <Alien x={1180} y={610} s={0.9} />
            <Planet id={`${uid}-d3`} x={110} y={140} r={16} c={SP.pink} />
            <g transform="translate(0 720)"><Hills w={1440} h={180} /></g>
            <g className="sp-orbiter" style={{ opacity: compact ? 0 : undefined }}><g className="sp-mini"><Rocket id={`${uid}-do`} s={0.16} flame /></g></g>
            <Pad x={720} y={850} s={0.95} />
            <g className="sp-lift"><Rocket id={`${uid}-dr`} x={742} y={846} s={0.95} /></g>
            <g className="sp-smoke">{[-90, -40, 10, 60, -130, 110].map((dx, i) => <Puff key={i} x={742 + dx} y={852} s={0.95} />)}</g>
          </svg>
        </div>
        {!compact && [0, 1].map((i) => <span key={i} className="sp-shoot pointer-events-none absolute h-[2px] w-[90px] rotate-[-28deg] rounded-full opacity-0" style={{ right: `${10 + i * 30}%`, top: `${12 + i * 10}%`, background: "linear-gradient(90deg, #fff, transparent)" }} />)}

        {/* countdown overlay */}
        {!compact && (
          <div className="pointer-events-none absolute left-1/2 top-[clamp(110px,18svh,190px)] z-30 -translate-x-1/2">
            <div className="sp-count relative grid h-[150px] w-[150px] place-items-center opacity-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden><circle cx="50" cy="50" r="46" fill="rgba(20,24,51,.4)" stroke="rgba(255,244,220,.2)" strokeWidth="2" /><circle className="sp-ring" cx="50" cy="50" r="46" fill="none" stroke={SP.mustard} strokeWidth="3" transform="rotate(-90 50 50)" /></svg>
              {["3", "2", "1"].map((n, i) => <span key={n} className={`sp-n${i} absolute text-[86px] font-bold leading-none opacity-0`} style={{ fontFamily: "var(--w-display)" }}>{n}</span>)}
            </div>
            <p className="sp-blast absolute left-1/2 top-[50px] -translate-x-1/2 whitespace-nowrap text-[clamp(30px,6cqi,56px)] font-black uppercase italic text-[var(--w-mustard)] opacity-0" style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "Blast off!", ru: "Поехали!", hi: "उड़ान!" })}</p>
          </div>
        )}

        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 pt-[clamp(84px,13svh,140px)] text-center">
          <div className="sp-reveal flex flex-col items-center">
            <p data-up className="font-mono text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--w-mustard)]">{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : `✦ ${L.invited} ✦`}</p>
            <E as="h1" path="profile.partner1" className="sp-name mt-5 block font-black uppercase leading-[0.92]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(54px, ${big}cqi, 150px)`, color: SP.cream, textShadow: `0 0 40px rgba(242,184,75,.35), 0 4px 0 ${SP.red}` }}>
              {glyphs(p.partner1 || "", editable)}
            </E>
            <p data-up className="mt-4 text-[clamp(17px,2.6cqi,24px)] font-medium" style={{ fontFamily: "var(--w-display)", color: SP.mustard }}>{occasionLine(p)}</p>
            <p data-up className="mt-4 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[14px] tracking-wide">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
            {!compact && launched && (
              <button type="button" data-up onClick={(e) => { e.stopPropagation(); setLaunched(false); launch(); }} className="mt-5 rounded-full bg-[var(--w-accent)] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_-10px_var(--w-accent)]">
                {tr(p, { en: "Launch again", ru: "Ещё раз", hi: "फिर से लॉन्च" })} ↑
              </button>
            )}
          </div>
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-16 overflow-hidden">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" className="block h-[200px] w-full" aria-hidden>
          <Planet id={`${uid}-ft`} x={1180} y={90} r={40} c={SP.pink} ring />
          <g transform="translate(0 90)"><Hills w={1440} h={170} /></g>
          <Alien x={300} y={190} s={0.8} />
        </svg>
        <div className="bg-[#3B3F86] px-6 pb-10 pt-2 text-center">
          <p className="text-[20px] font-bold uppercase" style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "See you in orbit!", ru: "До встречи на орбите!", hi: "अंतरिक्ष में मिलते हैं!" })}</p>
          <div className="mt-3 text-[13px] opacity-70">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.14} blend="overlay" />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path, dark }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string; dark?: boolean }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-3 block text-[clamp(28px,5cqi,48px)] font-bold uppercase leading-[1.05]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.4em]" style={{ color: dark ? SP.red : SP.mustard }}>◦ {eyebrow} ◦</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <svg viewBox="0 0 160 20" className="mt-3 w-32" aria-hidden><path d="M4 14 C 40 0 120 0 156 14" fill="none" stroke={dark ? SP.red : SP.cream} strokeOpacity=".5" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" /><circle cx="80" cy="4" r="4" fill={dark ? SP.red : SP.mustard} /></svg>
    </div>
  );
}

function Panel({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div data-pop className="relative rounded-[24px] border-[1.5px] border-dashed border-white/25 bg-white/[.04] px-8 pb-8 pt-10 text-center">
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--w-mustard)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#141833]">{tag}</span>
      {children}
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--w-accent)] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_-12px_var(--w-accent)] transition hover:-translate-y-0.5">
      {children}
    </a>
  );
}

function StarChart({ uid }: { uid: string }) {
  const pts = [[60, 300], [130, 240], [190, 270], [250, 190], [330, 210], [400, 120]];
  return (
    <svg viewBox="0 0 480 380" className="block w-full" aria-hidden>
      <Stars w={480} h={380} n={60} seed={21} tw={false} />
      {[80, 150, 220].map((r) => <circle key={r} cx="400" cy="120" r={r} fill="none" stroke="#fff" strokeOpacity=".08" />)}
      <path d={`M${pts.map((q) => q.join(" ")).join(" L")}`} fill="none" stroke={SP.mustard} strokeOpacity=".7" strokeWidth="2" strokeDasharray="4 7" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 0 : 4} fill={SP.cream} />)}
      <Planet id={`${uid}-dest`} x={400} y={120} r={30} c={SP.red} ring />
      <g transform="translate(60 300) rotate(50)"><Rocket id={`${uid}-sc`} s={0.16} /></g>
    </svg>
  );
}
