"use client";
import { useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst, centerIn } from "../_shared/fx";
import { Frond, Giraffe, JG, Lion, Monkey, Monstera, Paw, Toucan, Vine } from "./art";

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const editable = !!useEdit()?.editable;
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.utils.toArray<SVGGElement>(".jg-sway").forEach((l, i) => gsap.to(l, { rotate: i % 2 ? 3 : -3, duration: 2.6 + (i % 4) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%", delay: -i * 0.4 }));
    gsap.utils.toArray<SVGGElement>(".jg-eyes").forEach((e, i) => gsap.to(e, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.09, yoyo: true, repeat: -1, repeatDelay: 3 + i, delay: 2 + i * 0.7 }));
    gsap.to(".jg-monkey", { rotate: 8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" });
    gsap.to(".jg-giraffe", { rotate: -2.5, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" });
    gsap.to(".jg-toucan", { rotate: 4, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" });
    if (!compact) {
      // the signature: the leaves part like curtains, then each friend peeks out to say hello
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(".jg-part-l", { x: 520, rotate: 8, duration: 1.8, ease: "power3.inOut" })
        .from(".jg-part-r", { x: -520, rotate: -8, duration: 1.8, ease: "power3.inOut" }, 0)
        .from(".jg-name .ch", { y: 60, scale: 0.4, autoAlpha: 0, duration: 0.9, ease: "back.out(2.4)", stagger: 0.07 }, 1.1)
        .from(".jg-up", { y: 16, autoAlpha: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.08 }, 1.4)
        .from(".jg-in-lion", { y: 220, duration: 0.9, ease: "back.out(1.6)" }, 1.6)
        .from(".jg-in-giraffe", { y: 520, duration: 1.3, ease: "power3.out" }, 1.9)
        .from(".jg-in-monkey", { y: -360, duration: 1.1, ease: "bounce.out" }, 2.2)
        .from(".jg-in-toucan", { x: -240, y: -60, rotate: -30, duration: 0.9, ease: "back.out(1.6)" }, 2.5);
      gsap.to(".jg-par-back", { yPercent: 8, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  const tap = (e: React.MouseEvent) => {
    const host = hero.current;
    if (!host) return;
    const a = (e.target as Element).closest(".jg-animal");
    const leaf = (e.target as Element).closest(".jg-sway");
    if (a && !gsap.isTweening(a)) {
      const c = centerIn(host, a);
      gsap.timeline().to(a, { y: -26, scaleY: 1.06, duration: 0.18, ease: "power2.out", transformOrigin: "50% 100%" }).to(a, { y: 0, scaleY: 1, duration: 0.9, ease: "bounce.out" });
      burst(host, c.x, c.y - 30, { colors: [JG.mustard, JG.lime, JG.terra, "#fff"], shapes: ["star", "dot"], count: 14, velocity: [80, 220], gravity: 200, size: 10 });
    } else if (leaf) {
      gsap.fromTo(leaf, { rotate: 10 }, { rotate: 0, duration: 1.6, ease: "elastic.out(1, 0.25)", transformOrigin: "50% 100%" });
    }
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <div className="mb-6 flex justify-center gap-3" aria-hidden>{[0, 1, 2].map((i) => <svg key={i} viewBox="-16 -18 32 32" className="h-6 w-6" style={{ transform: `rotate(${i * 12 - 12}deg) translateY(${i % 2 ? -6 : 0}px)` }}><Paw c={JG.terra} /></svg>)}</div>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(26px,5cqi,44px)] font-bold leading-[1.25]" style={{ fontFamily: "var(--w-display)" }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div className="relative mx-auto w-[min(76cqi,340px)]" data-pop="-2">
            <svg viewBox="-200 -330 400 360" className="absolute -left-[18%] -top-[16%] w-[70%]" aria-hidden><Monstera r={-30} s={1} /></svg>
            <div className="relative aspect-square overflow-hidden rounded-full border-[10px]" style={{ borderColor: JG.cream, boxShadow: "0 30px 60px -30px rgba(31,58,43,.6)" }}>
              {heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg data-edit-photo="hero" viewBox="-100 -100 200 200" className="h-full w-full" style={{ background: JG.sand }}><Lion s={1.1} /></svg>
              )}
            </div>
            <svg viewBox="-200 -330 400 360" className="absolute -bottom-[10%] -right-[16%] w-[60%]" aria-hidden><Frond r={40} s={1} /></svg>
          </div>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[19px] leading-[1.75] opacity-85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Grab your binoculars!", ru: "Бери бинокль!", hi: "दूरबीन ले आओ!" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Ticket tilt={-1.5}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em]" style={{ color: JG.terra }}>{L.when}</p>
              <p className="mt-2 text-[42px] font-black leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-2 text-[15px] opacity-75">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Ticket>
          )}
          {where && (
            <Ticket tilt={1.5}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em]" style={{ color: JG.terra }}>{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[36px] font-black leading-[1.05]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[15px] opacity-75">{p.city}</p>}
            </Ticket>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-center gap-3 rounded-full px-6 py-3" style={{ background: JG.deep, color: JG.cream }}>
              <svg viewBox="-16 -18 32 32" className="h-6 w-6" aria-hidden><Paw c={JG.mustard} /></svg>
              <span className="text-[28px] font-black leading-none" style={{ fontFamily: "var(--w-display)" }}>{days}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] opacity-75">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={tr(p, { en: "The safari trail", ru: "Маршрут сафари", hi: "सफ़ारी का रास्ता" })} />
        <div className="relative mx-auto mt-14 max-w-3xl">
          <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="absolute left-[30px] top-0 h-full w-[40px] @2xl:left-1/2 @2xl:-translate-x-1/2" aria-hidden><path d="M50 0 C90 160 10 320 50 500 S 90 840 50 1000" fill="none" stroke={JG.sand} strokeWidth="18" vectorEffect="non-scaling-stroke" /></svg>
          {p.events!.map((e, i) => (
            <div key={i} className={`relative mb-12 flex items-center gap-5 pl-[84px] @2xl:w-1/2 @2xl:pl-0 ${i % 2 ? "@2xl:ml-auto @2xl:pl-14" : "@2xl:flex-row-reverse @2xl:pr-14 @2xl:text-right"}`} data-pop>
              <span className={`absolute left-[22px] top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full @2xl:left-auto ${i % 2 ? "@2xl:-left-7" : "@2xl:-right-7"}`} style={{ background: JG.deep }}>
                <svg viewBox="-16 -18 32 32" className="h-7 w-7" aria-hidden><Paw c={[JG.mustard, JG.lime, JG.terra][i % 3]} r={i % 2 ? 20 : -20} /></svg>
              </span>
              <div className="rounded-[22px] bg-[var(--w-cream)] px-6 py-5 shadow-[0_20px_40px_-26px_rgba(31,58,43,.6)]">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.28em]" style={{ color: JG.terra }}>{e.time || `${tr(p, { en: "Stop", ru: "Стоянка", hi: "पड़ाव" })} ${i + 1}`}</p>
                <h3 className="mt-1 text-[26px] font-black leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
                <p className="mt-1 text-[14px] opacity-70">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-1" className="overflow-hidden rounded-[30px] shadow-[0_30px_60px_-34px_rgba(31,58,43,.6)]">
            <svg viewBox="0 0 480 360" className="block w-full" aria-hidden>
              <rect width="480" height="360" fill={JG.sand} />
              <path d="M-10 280 C80 240 140 300 220 250 S 380 150 500 180" fill="none" stroke="#9FC6D8" strokeWidth="26" strokeLinecap="round" />
              {[[60, 90], [140, 60], [400, 300], [440, 90], [90, 330]].map(([x, y], i) => <g key={i}><Monstera x={x} y={y} s={0.22} r={i * 30 - 30} c={i % 2 ? JG.leaf : JG.leaf2} /></g>)}
              <path d="M70 320 C150 300 200 200 300 170" fill="none" stroke={JG.deep} strokeOpacity=".5" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
              <path d="M280 170 L320 110 L360 170Z" fill={JG.terra} /><path d="M320 110 L320 170" stroke={JG.cream} strokeWidth="3" /><path d="M308 170 L320 140 L332 170Z" fill={JG.deep} />
              <path d="M320 110 V90 l18 6 l-18 6" fill={JG.mustard} stroke={JG.deep} strokeWidth="1.5" />
              {[[120, 230, 30], [200, 160, -10], [240, 120, 20]].map(([x, y, r], i) => <Paw key={i} x={x} y={y} r={r} s={0.5} c={JG.deep} />)}
            </svg>
          </div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Spotted on safari", ru: "Замечено на сафари", hi: "सफ़ारी में देखा" })} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 @3xl:grid-cols-3">
          {design!.gallery!.map((k, i) => (
            <figure key={k} data-pop={i % 2 ? 2 : -2} className="relative overflow-hidden rounded-[28px] border-[8px]" style={{ borderColor: JG.cream, boxShadow: "0 20px 40px -24px rgba(31,58,43,.6)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ background: JG.mustard, color: JG.deep }}>{tr(p, { en: "Spotted!", ru: "Попался!", hi: "दिखा!" })}</span>
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-110 -110 220 120" className="absolute -top-[82px] left-1/2 w-[170px] -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}>
            <Lion s={1} y={0} />
          </svg>
          <div className="relative rounded-[34px] px-6 py-12 @xl:px-12" style={{ background: JG.cream, boxShadow: "0 40px 80px -40px rgba(31,58,43,.6)" }}>
            <Heading eyebrow="RSVP" title={tr(p, { en: "Will you join the safari?", ru: "Поедешь на сафари?", hi: "क्या आप सफ़ारी पर चलेंगे?" })} />
            <p className="mx-auto mt-4 max-w-md text-center text-[17px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl" data-pop>
          <Ticket tilt={0}>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ color: JG.terra }}>{L.info}</p>
            <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[18px] leading-relaxed">{design!.texts!.body!}</E>
          </Ticket>
        </div>
      </Sec>
    ),
  };

  const name = p.partner1 || "";
  const big = Math.min(26, 92 / Math.max(3, [...name].length));

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: JG.sage, ink: JG.deep, accent: JG.terra, cream: JG.cream, display: STACKS.jungle.display, body: STACKS.jungle.body }), fontFamily: "var(--w-body)", background: "var(--w-bg)" }}
    >
      <header ref={hero} onClick={tap} className="relative isolate overflow-hidden" style={{ height: compact ? 780 : "max(100svh, 700px)", background: `radial-gradient(70% 60% at 50% 42%, #FBF8E8 0%, #E9F0D8 55%, #CFE0BC 100%)` }}>
        <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
          <g className="jg-par-back" opacity=".35"><Frond x={-20} y={300} r={-20} s={0.9} c="#8DB580" /><Frond x={420} y={320} r={-150} s={0.9} c="#8DB580" /></g>
          <Vine x1={-10} y1={30} x2={410} y2={40} sag={50} />
          <g className="jg-in-monkey"><Monkey x={320} y={58} s={0.55} /></g>
          <g className="jg-in-toucan"><path d="M0 214 C40 206 80 212 110 204" stroke="#7A5638" strokeWidth="8" strokeLinecap="round" /><Toucan x={62} y={200} s={0.55} /></g>
          <g className="jg-in-giraffe"><Giraffe x={380} y={860} s={0.95} /></g>
          <g className="jg-in-lion"><Lion x={200} y={775} s={0.72} /></g>
          <g className="jg-part-l">
            <g className="jg-sway"><Monstera x={-30} y={870} r={18} s={0.9} /></g>
            <g className="jg-sway"><Frond x={-10} y={700} r={10} s={0.8} /></g>
            <g className="jg-sway"><Monstera x={90} y={910} r={-8} s={0.5} c={JG.leaf2} /></g>
          </g>
          <g className="jg-part-r">
            <g className="jg-sway"><Monstera x={420} y={880} r={-22} s={0.75} c={JG.leaf2} /></g>
            <g className="jg-sway"><Frond x={420} y={620} r={-80} s={0.7} c={JG.leaf} /></g>
          </g>
        </svg>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
          <g className="jg-par-back" opacity=".35"><Frond x={60} y={500} r={-10} s={1.4} c="#8DB580" /><Frond x={1400} y={520} r={-160} s={1.4} c="#8DB580" /><Monstera x={1180} y={300} s={0.6} r={20} c="#8DB580" /></g>
          <Vine x1={-20} y1={20} x2={1460} y2={30} sag={90} />
          <g className="jg-in-monkey"><Monkey x={1060} y={88} s={0.9} /></g>
          <g className="jg-in-toucan"><path d="M0 330 C80 316 160 326 230 312" stroke="#7A5638" strokeWidth="12" strokeLinecap="round" /><Toucan x={150} y={308} s={0.95} /></g>
          <g className="jg-in-giraffe"><Giraffe x={1350} y={920} s={1.45} /></g>
          <g className="jg-in-lion"><Lion x={360} y={800} s={1.05} /></g>
          <g className="jg-part-l">
            <g className="jg-sway"><Monstera x={-40} y={940} r={20} s={1.5} /></g>
            <g className="jg-sway"><Frond x={-30} y={720} r={6} s={1.3} /></g>
            <g className="jg-sway"><Monstera x={520} y={960} r={-6} s={0.7} c={JG.leaf2} /></g>
            <g className="jg-sway"><Frond x={-40} y={300} r={50} s={0.9} c={JG.leaf} /></g>
          </g>
          <g className="jg-part-r">
            <g className="jg-sway"><Monstera x={1480} y={950} r={-24} s={1.3} c={JG.leaf2} /></g>
            <g className="jg-sway"><Frond x={1480} y={640} r={-70} s={1.2} c={JG.leaf} /></g>
            <g className="jg-sway"><Monstera x={980} y={980} r={10} s={0.6} /></g>
          </g>
        </svg>

        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-6 pt-[clamp(150px,30svh,250px)] text-center @3xl:pt-[clamp(150px,22svh,220px)]">
          <p className="jg-up rounded-full px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ background: JG.deep, color: JG.mustard }}>{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
          <E as="h1" path="profile.partner1" className="jg-name mt-4 block whitespace-nowrap font-black uppercase leading-[0.9]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(40px, ${big}cqi, 150px)`, color: JG.deep, textShadow: `0 5px 0 ${JG.mustard}` }}>{glyphs(name, editable)}</E>
          <p className="jg-up mt-4 text-[clamp(19px,3cqi,27px)] font-bold" style={{ fontFamily: "var(--w-display)", color: JG.terra }}>{occasionLine(p)}</p>
          <p className="jg-up mt-3 rounded-full bg-white/70 px-5 py-2 text-[15px] font-semibold">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
          {!compact && <p className="jg-up mt-4 text-[11px] font-bold uppercase tracking-[0.24em] opacity-50">{tr(p, { en: "tap the animals", ru: "нажми на зверят", hi: "जानवरों को छुओ" })}</p>}
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10 overflow-hidden">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="xMidYMax slice" className="block h-[200px] w-full" aria-hidden>
          <Lion x={720} y={210} s={0.8} />
          {[[40, 300, 20, 1], [260, 320, -10, 0.8], [520, 320, 14, 0.7], [920, 320, -14, 0.7], [1180, 320, 10, 0.8], [1420, 300, -20, 1]].map(([x, y, r, s], i) => <Monstera key={i} x={x} y={y} r={r} s={s} c={i % 2 ? JG.leaf : JG.leaf2} />)}
        </svg>
        <div className="px-6 pb-10 pt-4 text-center" style={{ background: JG.deep, color: JG.cream }}>
          <p className="text-[22px] font-black uppercase" style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "See you in the jungle!", ru: "До встречи в джунглях!", hi: "जंगल में मिलते हैं!" })}</p>
          <div className="mt-3 text-[13px] opacity-75">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.22} />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-3 block text-[clamp(32px,5.6cqi,54px)] font-black leading-[1.04]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ color: JG.terra }}>{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <div className="mt-3 flex gap-2" aria-hidden>{[0, 1, 2, 3].map((i) => <svg key={i} viewBox="-16 -18 32 32" className="h-4 w-4" style={{ transform: `translateY(${i % 2 ? -4 : 0}px) rotate(80deg)` }}><Paw c={JG.leaf2} /></svg>)}</div>
    </div>
  );
}

function Ticket({ children, tilt }: { children: ReactNode; tilt: number }) {
  return (
    <div data-pop={tilt} className="relative overflow-hidden rounded-[24px] px-8 pb-8 pt-10 text-center" style={{ background: JG.cream, transform: `rotate(${tilt}deg)`, boxShadow: "0 24px 50px -28px rgba(31,58,43,.6)" }}>
      <div className="absolute inset-x-0 top-0 h-3" style={{ background: `repeating-linear-gradient(90deg, ${JG.deep} 0 14px, ${JG.mustard} 14px 28px)` }} />
      {children}
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(217,114,75,.8)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)" }}>
      {children}
    </a>
  );
}
