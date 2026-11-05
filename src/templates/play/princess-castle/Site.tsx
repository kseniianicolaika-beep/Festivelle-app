"use client";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, prefersReduced, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst, centerIn } from "../_shared/fx";
import { Crown, Facade, Hill, PR, Sparkle, Tower, Unicorn } from "./art";

const DOOR: CSSProperties = {
  background: `linear-gradient(180deg, rgba(255,255,255,.18), rgba(0,0,0,.06)), repeating-linear-gradient(90deg, #E7A3B2 0 22%, #D98E9F 22% 23.5%)`,
  boxShadow: "inset 0 0 0 3px rgba(201,162,122,.9), inset 0 0 30px rgba(74,34,48,.25)",
};

export function Gate({ uid, children, open, onOpen, label }: { uid: string; children: ReactNode; open: boolean; onOpen?: () => void; label?: string }) {
  return (
    <div className="pr-gate relative w-full" style={{ aspectRatio: "760 / 900", containerType: "inline-size" }}>
      <div className="absolute overflow-hidden" style={{ left: "18.03%", width: "63.95%", top: "33.33%", height: "66.67%", borderRadius: "50% 50% 0 0 / 40.5% 40.5% 0 0", background: `radial-gradient(120% 80% at 50% 10%, #7A4C8C 0%, ${PR.night} 45%, #3A2346 100%)` }}>
        <svg viewBox="0 0 100 130" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: 22 }, (_, i) => <circle key={i} className="pr-tw" cx={(i * 37) % 100} cy={(i * 53) % 90} r={i % 4 ? 0.35 : 0.6} fill="#FFE9C9" />)}
          <path d="M0 22 Q 50 44 100 22" fill="none" stroke={PR.goldL} strokeOpacity=".5" strokeWidth=".3" />
          {Array.from({ length: 9 }, (_, i) => { const t = (i + 0.5) / 9; return <circle key={i} className="pr-bulb" cx={t * 100} cy={+(22 + Math.sin(t * Math.PI) * 11 + 1.2).toFixed(2)} r="1" fill="#FFE29A" />; })}
        </svg>
        <div className="pr-inside absolute inset-0 flex flex-col items-center justify-center px-[6cqw] pt-[10cqw] text-center">{children}</div>
        {!open && (
          <button type="button" onClick={onOpen} className="pr-doors absolute inset-0 cursor-pointer" aria-label={label} style={{ perspective: "1400px" }}>
            <span className="pr-door-l absolute inset-y-0 left-0 w-1/2" style={{ ...DOOR, transformOrigin: "0% 50%" }}>
              <Hinges side="l" />
            </span>
            <span className="pr-door-r absolute inset-y-0 right-0 w-1/2" style={{ ...DOOR, transformOrigin: "100% 50%" }}>
              <Hinges side="r" />
            </span>
            <span className="pr-plaque absolute left-1/2 top-[56%] -translate-x-1/2 whitespace-nowrap rounded-full px-[3.4cqw] py-[1.2cqw] text-[2.6cqw] font-semibold uppercase tracking-[0.2em]" style={{ background: PR.cream, color: PR.deep, boxShadow: `0 0 0 2px ${PR.gold}` }}>{label}</span>
          </button>
        )}
      </div>
      <svg viewBox="0 0 760 900" className="pointer-events-none absolute inset-0 h-full w-full" style={{ overflow: "visible" }} aria-hidden><Facade id={uid} /></svg>
    </div>
  );
}

function Hinges({ side }: { side: "l" | "r" }) {
  const s = side === "l";
  return (
    <svg viewBox="0 0 100 260" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
      {[70, 190].map((y) => <g key={y}><path d={s ? `M0 ${y} H62 l8 4 l-8 4 H0Z` : `M100 ${y} H38 l-8 4 l8 4 H100Z`} fill={PR.gold} /><circle cx={s ? 12 : 88} cy={y + 4} r="2" fill={PR.plum} opacity=".5" /><circle cx={s ? 40 : 60} cy={y + 4} r="2" fill={PR.plum} opacity=".5" /></g>)}
      <circle cx={s ? 84 : 16} cy="140" r="9" fill="none" stroke={PR.gold} strokeWidth="3.5" />
      <circle cx={s ? 84 : 16} cy="128" r="3.5" fill={PR.gold} />
      {s && <path d="M100 148 c-3 -4 -8 -2 -6 2 l6 7Z" fill={PR.plum} opacity=".6" />}
      {!s && <path d="M0 148 c3 -4 8 -2 6 2 l-6 7Z" fill={PR.plum} opacity=".6" />}
    </svg>
  );
}

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const editable = !!useEdit()?.editable;
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  const [open, setOpen] = useState(!!compact);
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.utils.toArray<SVGElement>(".pr-tw").forEach((s, i) => gsap.to(s, { opacity: 0.2, duration: 0.9 + (i % 5) * 0.3, yoyo: true, repeat: -1, ease: "sine.inOut", delay: (i % 7) * 0.2 }));
    gsap.utils.toArray<SVGElement>(".pr-bulb").forEach((s, i) => gsap.to(s, { opacity: 0.4, duration: 0.8, yoyo: true, repeat: -1, ease: "sine.inOut", delay: (i % 3) * 0.3 }));
    gsap.utils.toArray<SVGPathElement>(".pr-flag").forEach((f, i) => gsap.to(f, { skewY: 8, scaleX: 0.9, duration: 0.7 + (i % 3) * 0.15, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "0% 50%" }));
    gsap.to(".pr-uni", { rotate: -4, y: 4, duration: 2.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "0% 100%" });
    gsap.to(".pr-cloud", { x: 40, duration: 12, yoyo: true, repeat: -1, ease: "sine.inOut" });
    if (!compact) gsap.to(".pr-gate-wrap", { yPercent: -6, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  // the signature: the castle doors swing open onto a starlit hall and the name
  const openDoors = useCallback(() => {
    if (open) return;
    if (prefersReduced()) return setOpen(true);
    const host = hero.current;
    gsap.timeline({ onComplete: () => setOpen(true) })
      .to(".pr-plaque", { autoAlpha: 0, y: 10, duration: 0.3 })
      .to(".pr-door-l", { rotateY: 98, duration: 1.7, ease: "power3.inOut" }, 0.15)
      .to(".pr-door-r", { rotateY: -98, duration: 1.7, ease: "power3.inOut" }, 0.15)
      .fromTo(".pr-inside", { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.4, ease: "power2.out" }, 0.5)
      .from(".pr-name .ch", { y: 30, autoAlpha: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.07 }, 1)
      .call(() => {
        const c = host?.querySelector(".pr-inside .pr-crown");
        if (host && c) { const pt = centerIn(host, c); burst(host, pt.x, pt.y, { colors: [PR.goldL, "#fff", PR.rose, PR.lilac], shapes: ["star", "dot"], count: 34, velocity: [120, 380], gravity: 160, size: 12 }); }
      }, [], 1);
  }, [open]);

  useEffect(() => {
    if (open) return;
    if (prefersReduced()) return setOpen(true);
    gsap.set(".pr-inside", { autoAlpha: 0 });
    gsap.fromTo(".pr-gate-wrap", { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, ease: "power3.out" });
    const t = setTimeout(openDoors, 3800);
    return () => clearTimeout(t);
  }, [open, openDoors]);

  const tap = (e: React.MouseEvent) => {
    const host = hero.current;
    const el = (e.target as Element).closest(".pr-crown, .pr-uni");
    if (!host || !el) return;
    const c = centerIn(host, el);
    gsap.fromTo(el, { rotate: -8 }, { rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.3)", transformOrigin: "50% 100%" });
    burst(host, c.x, c.y, { colors: [PR.goldL, PR.rose, PR.lilac, "#fff"], shapes: ["star"], count: 18, velocity: [80, 240], gravity: 80, size: 11 });
  };

  const name = p.partner1 || "";
  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <svg viewBox="-60 -40 120 70" className="mx-auto mb-6 w-20" aria-hidden><Crown s={0.9} /></svg>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(26px,5cqi,44px)] leading-[1.35]" style={{ fontFamily: "var(--w-display)" }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div className="relative mx-auto w-[min(72cqi,330px)]" data-pop="-2">
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full p-[10px]" style={{ background: `linear-gradient(160deg, ${PR.goldL}, ${PR.gold})` }}>
              <div className="h-full overflow-hidden rounded-t-full">
                {heroUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg data-edit-photo="hero" viewBox="-100 -170 200 260" className="h-full w-full" style={{ background: PR.stone }}><Unicorn x={-30} y={80} s={1.6} /></svg>
                )}
              </div>
            </div>
            <svg viewBox="-60 -40 120 70" className="absolute -top-6 left-1/2 w-20 -translate-x-1/2" aria-hidden><Crown s={0.9} /></svg>
          </div>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[21px] leading-[1.7] opacity-85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "A royal celebration", ru: "Королевский праздник", hi: "शाही जश्न" })} />
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <ArchCard pop="-1">
              <p className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: PR.deep }}>{L.when}</p>
              <p className="mt-3 text-[40px] leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? db.day : ""}</p>
              <p className="mt-1 text-[24px]" style={{ fontFamily: "var(--w-display)" }}>{db ? db.month : fmtDate(p)}</p>
              <p className="mt-2 text-[16px] opacity-70">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </ArchCard>
          )}
          {where && (
            <ArchCard pop="1">
              <p className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: PR.deep }}>{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-3 block text-[34px] leading-[1.1]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[16px] opacity-70">{p.city}</p>}
            </ArchCard>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-center gap-3 rounded-full px-6 py-3" style={{ background: PR.cream, boxShadow: `0 0 0 1.5px ${PR.gold}, 0 12px 30px -16px rgba(74,34,48,.5)` }}>
              <span className="text-[30px] leading-none" style={{ fontFamily: "var(--w-display)", color: PR.deep }}>{days}</span>
              <span className="text-[13px] font-semibold uppercase tracking-[0.22em] opacity-70">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 @3xl:grid-cols-3">
          {p.events!.map((e, i) => (
            <ArchCard key={i} pop={String(i % 2 ? 1 : -1)}>
              <svg viewBox="-12 -12 24 24" className="mx-auto h-6 w-6" aria-hidden><Sparkle c={PR.gold} cls="" /></svg>
              <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: PR.deep }}>{e.time || String(i + 1)}</p>
              <h3 className="mt-2 text-[28px] leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
              <p className="mt-2 text-[16px] opacity-70">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
            </ArchCard>
          ))}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-1" className="overflow-hidden rounded-t-full p-[10px]" style={{ background: `linear-gradient(160deg, ${PR.goldL}, ${PR.gold})` }}>
            <svg viewBox="0 0 400 420" className="block w-full rounded-t-full" aria-hidden style={{ background: `linear-gradient(180deg, ${PR.lilac}, ${PR.blush})` }}>
              <g transform="translate(0 300)"><Hill w={400} h={120} /></g>
              <Tower x={150} y={330} w={56} h={150} roof={1.3} />
              <Tower x={250} y={330} w={56} h={150} roof={1.3} rc={PR.deep} />
              <Tower x={200} y={340} w={80} h={190} roof={1.2} />
              <path d="M60 410 C110 380 150 370 190 340" stroke={PR.plum} strokeOpacity=".45" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
              {[[70, 80], [320, 120], [110, 170], [330, 220]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} s={0.8} c="#fff" />)}
            </svg>
          </div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[20px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Royal portraits", ru: "Королевские портреты", hi: "शाही तस्वीरें" })} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 @3xl:grid-cols-3">
          {design!.gallery!.map((k) => (
            <figure key={k} data-pop className="overflow-hidden rounded-t-full p-[6px]" style={{ background: `linear-gradient(160deg, ${PR.goldL}, ${PR.gold})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-t-full object-cover" />
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-60 -150 140 150" className="absolute -top-[100px] left-[6%] w-[110px]" aria-hidden style={{ overflow: "visible" }}><Unicorn s={0.95} /></svg>
          <div className="relative rounded-t-[200px] rounded-b-[28px] px-6 pb-12 pt-20 @xl:px-12" style={{ background: PR.cream, boxShadow: `0 0 0 1.5px ${PR.gold}, 0 40px 80px -40px rgba(74,34,48,.5)` }}>
            <div className="pointer-events-none absolute inset-[10px] rounded-t-[190px] rounded-b-[20px] border border-dashed" style={{ borderColor: PR.gold }} />
            <Heading eyebrow="RSVP" title={tr(p, { en: "Will you come to the ball?", ru: "Придёшь на бал?", hi: "क्या आप दावत में आएँगे?" })} />
            <p className="mx-auto mt-4 max-w-md text-center text-[18px] opacity-70">{L.rsvpSub}</p>
            <div className="relative mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <ArchCard pop="0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.3em]" style={{ color: PR.deep }}>{L.info}</p>
            <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[19px] leading-relaxed">{design!.texts!.body!}</E>
          </ArchCard>
        </div>
      </Sec>
    ),
  };

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: PR.blush, ink: PR.plum, accent: PR.deep, display: STACKS.castle.display, body: STACKS.castle.body }), fontFamily: "var(--w-body)", background: "var(--w-bg)" }}
    >
      <header ref={hero} onClick={tap} className="relative isolate flex flex-col items-center justify-end overflow-hidden" style={{ height: compact ? 800 : "max(100svh, 700px)", background: `linear-gradient(180deg, #E5D6F0 0%, #F4DCE6 50%, ${PR.blush} 100%)` }}>
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          {Array.from({ length: 26 }, (_, i) => <Sparkle key={i} x={(i * 211) % 1440} y={(i * 97) % 520} s={0.5 + (i % 3) * 0.3} c={i % 2 ? "#fff" : PR.goldL} />)}
          <g className="pr-cloud" opacity=".85">{[[180, 160], [1240, 230], [980, 90]].map(([x, y], i) => <path key={i} transform={`translate(${x} ${y}) scale(${1 - i * 0.2})`} d="M-70 14 C-86 14 -88 -6 -72 -10 C-72 -32 -44 -40 -32 -26 C-24 -50 14 -52 22 -28 C36 -40 66 -32 60 -10 C80 -8 80 14 60 14Z" fill="#fff" />)}</g>
        </svg>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[130px] w-full" aria-hidden><Hill w={1440} h={200} /></svg>
        <div className="relative z-10 mb-auto mt-[9svh] flex flex-col items-center text-center @3xl:hidden" aria-hidden={false}>
          <svg viewBox="-60 -40 120 70" className="w-16" aria-hidden><Crown /></svg>
          <svg viewBox="0 0 320 70" className="mt-2 w-[min(82cqi,330px)]" aria-hidden>
            <path d="M14 18 H306 L292 36 L306 54 H14 L28 36Z" fill={PR.deep} />
            <path d="M40 10 H280 V46 H40Z" fill={PR.rose} />
            <path d="M40 46 L54 58 V46Z M280 46 L266 58 V46Z" fill={PR.deep} opacity=".7" />
            <text x="160" y="33" textAnchor="middle" fontSize="14" letterSpacing="1.5" textLength="216" lengthAdjust="spacingAndGlyphs" fill={PR.cream} style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "A ROYAL INVITATION", ru: "КОРОЛЕВСКОЕ ПРИГЛАШЕНИЕ", hi: "शाही निमंत्रण" })}</text>
          </svg>
          <p className="mt-3 text-[18px] italic opacity-75">{open ? tr(p, { en: "welcome to the castle", ru: "добро пожаловать в замок", hi: "महल में स्वागत है" }) : tr(p, { en: "the castle doors are about to open…", ru: "двери замка вот-вот откроются…", hi: "महल के दरवाज़े खुलने वाले हैं…" })}</p>
        </div>
        <div className="pr-gate-wrap relative z-10 mb-[3svh]" style={{ width: compact ? "min(92cqi, 560px)" : "min(92cqi, calc((100svh - 40px) * 0.8), 640px)" }}>
          <Gate uid={uid} open={open} onOpen={openDoors} label={tr(p, { en: "Open the doors", ru: "Открой двери", hi: "दरवाज़े खोलो" })}>
            <svg viewBox="-60 -40 120 70" className="w-[16cqw]" aria-hidden style={{ overflow: "visible" }}><Crown s={1} /></svg>
            <p className="mt-[2cqw] text-[2.4cqw] font-semibold uppercase tracking-[0.3em]" style={{ color: PR.goldL }}>{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
            <E as="h1" path="profile.partner1" className="pr-name mt-[1.5cqw] block leading-[0.95]" style={{ fontFamily: "var(--w-display)", fontSize: `${Math.min(15, 64 / Math.max(3, [...name].length))}cqw`, color: PR.cream, textShadow: "0 0.4cqw 2cqw rgba(0,0,0,.25)" }}>{glyphs(name, editable)}</E>
            <p className="mt-[1.5cqw] text-[3.6cqw] italic" style={{ fontFamily: "var(--w-body)", color: PR.rose }}>{occasionLine(p)}</p>
            <p className="mt-[2.4cqw] text-[2.5cqw] tracking-wide" style={{ color: PR.cream, opacity: 0.85 }}>{fmtDate(p)}</p>
            <p className="text-[2.5cqw] tracking-wide" style={{ color: PR.cream, opacity: 0.85 }}>{where}</p>
          </Gate>
          <svg viewBox="-60 -150 140 160" className="absolute -right-[4%] bottom-0 w-[22%]" aria-hidden style={{ overflow: "visible" }}><Unicorn s={1} flip /></svg>
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10 overflow-hidden text-center">
        <svg viewBox="0 0 760 330" className="mx-auto block w-[min(80%,420px)]" aria-hidden>
          <Tower x={230} y={330} w={90} h={150} roof={1.3} />
          <Tower x={530} y={330} w={90} h={150} roof={1.3} rc={PR.deep} />
          <Tower x={380} y={330} w={130} h={200} roof={1.2} />
        </svg>
        <div className="px-6 pb-10 pt-6" style={{ background: PR.stone }}>
          <p className="text-[28px]" style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "Happily ever after starts here", ru: "И жили они долго и счастливо", hi: "और फिर सब खुशी-खुशी रहे" })}</p>
          <div className="mt-3 text-[14px] opacity-70">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.2} />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-3 block text-[clamp(34px,6cqi,56px)] leading-[1.08]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[13px] font-semibold uppercase tracking-[0.32em]" style={{ color: PR.deep }}>{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <svg viewBox="-60 -8 120 16" className="mt-3 w-28" aria-hidden><path d="M-56 0 H-12 M12 0 H56" stroke={PR.gold} strokeWidth="1.4" /><path d="M0 -6 L6 0 L0 6 L-6 0Z" fill={PR.gold} /></svg>
    </div>
  );
}

function ArchCard({ children, pop }: { children: ReactNode; pop: string }) {
  return (
    <div data-pop={pop} className="relative rounded-t-[160px] rounded-b-[22px] px-8 pb-9 pt-14 text-center" style={{ background: PR.cream, boxShadow: `0 0 0 1.5px ${PR.gold}, 0 30px 60px -36px rgba(74,34,48,.5)` }}>
      <div className="pointer-events-none absolute inset-[8px] rounded-t-[152px] rounded-b-[16px] border border-dashed" style={{ borderColor: PR.goldL }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold tracking-wide text-white shadow-[0_12px_26px_-12px_rgba(192,97,122,.8)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)" }}>
      {children}
    </a>
  );
}
