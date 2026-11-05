"use client";
import { useId, useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst, centerIn } from "../_shared/fx";
import { FeltCloud, HangStar, House, MobileBar, SM, SleepyMoon, Zzz } from "./art";

export function FeltNumber({ n, x = 0, y = 0, len = 80, s = 1 }: { n: number | string; x?: number; y?: number; len?: number; s?: number }) {
  const font = { fontFamily: "var(--pf-infant), serif", fontWeight: 700 };
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="sm-hang">
        <path d={`M0 0 L0 ${len}`} stroke={SM.ink} strokeOpacity=".3" strokeWidth="1.2" />
        <g transform={`translate(0 ${len + 70 * s}) scale(${s})`}>
          <text textAnchor="middle" y="0" fontSize="120" style={font} fill={SM.pink} stroke="#E2A6B0" strokeWidth="10" strokeLinejoin="round">{n}</text>
          <text textAnchor="middle" y="0" fontSize="120" style={font} fill={SM.pink}>{n}</text>
          <text textAnchor="middle" y="0" fontSize="120" style={font} fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 4" opacity=".9" transform="scale(.94) translate(0 -3)">{n}</text>
        </g>
      </g>
    </g>
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
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.utils.toArray<SVGGElement>(".sm-hang").forEach((h, i) => gsap.to(h, { rotate: i % 2 ? 3 : -3, duration: 3 + (i % 4) * 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%", delay: -i }));
    gsap.utils.toArray<SVGGElement>(".sm-drift").forEach((c, i) => gsap.to(c, { x: i % 2 ? 30 : -30, duration: 9 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    gsap.utils.toArray<SVGTextElement>(".sm-z").forEach((z, i) => gsap.fromTo(z, { opacity: 0, y: 10 }, { opacity: 1, y: -10, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.5 }));
    gsap.to(".sm-moon", { rotate: 3, y: -6, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" });
    gsap.to(".sm-glow", { scale: 1.08, opacity: 0.28, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" });
    gsap.to(".sm-win", { opacity: 0.6, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    if (!compact) {
      // the signature: a slow moonrise, clouds part, stars lower on their threads
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".sm-rise", { y: 420, duration: 2.6, ease: "power3.out" })
        .from(".sm-part-l", { x: 160, duration: 2.6, ease: "power2.out" }, 0)
        .from(".sm-part-r", { x: -160, duration: 2.6, ease: "power2.out" }, 0)
        .from(".sm-drop", { y: -360, duration: 1.8, ease: "bounce.out", stagger: 0.18 }, 0.6)
        .from(".sm-text .ch", { autoAlpha: 0, y: 14, duration: 1, ease: "power2.out", stagger: 0.07 }, 1.6)
        .from(".sm-text [data-up]", { autoAlpha: 0, y: 12, duration: 1, ease: "power2.out", stagger: 0.12 }, 2);
      gsap.to(".sm-par", { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  const tap = (e: React.MouseEvent) => {
    const host = hero.current;
    if (!host) return;
    const star = (e.target as Element).closest(".sm-hang");
    const moon = (e.target as Element).closest(".sm-moon");
    if (star) {
      gsap.fromTo(star, { rotate: 24 }, { rotate: 0, duration: 3.2, ease: "elastic.out(1, 0.12)", transformOrigin: "50% 0%", overwrite: true });
      const s = star.querySelector(".sm-star") ?? star;
      const c = centerIn(host, s);
      burst(host, c.x, c.y, { colors: [SM.moon, "#fff", SM.pink], shapes: ["star", "dot"], count: 12, velocity: [60, 180], gravity: 80, size: 9 });
    } else if (moon) {
      gsap.fromTo(moon, { rotate: -10 }, { rotate: 0, duration: 2, ease: "elastic.out(1, 0.25)", transformOrigin: "50% 50%" });
      gsap.fromTo(".sm-pom", { y: 0 }, { y: -10, duration: 0.2, yoyo: true, repeat: 3, ease: "power1.out" });
      const c = centerIn(host, moon);
      burst(host, c.x, c.y, { colors: [SM.moon, SM.lilac, "#fff"], shapes: ["star"], count: 16, velocity: [90, 240], gravity: 40, size: 10 });
    }
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-2xl text-center" data-pop>
          <Twinkle />
          <E as="p" multiline path="profile.inviteLine" className="mt-6 block text-[clamp(28px,5cqi,44px)] italic leading-[1.3]" style={{ fontFamily: "var(--w-display)", fontWeight: 500 }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div className="relative mx-auto w-[min(74cqi,340px)]" data-pop="-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[40px] p-3" style={{ background: SM.cream, boxShadow: "0 30px 60px -34px rgba(46,58,85,.45)" }}>
              <div className="relative h-full overflow-hidden rounded-t-full rounded-b-[30px]">
                {heroUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <svg data-edit-photo="hero" viewBox="-150 -170 300 380" className="h-full w-full" style={{ background: SM.powder }}><SleepyMoon id={`${uid}-ph`} s={0.9} /></svg>
                )}
              </div>
              <div className="pointer-events-none absolute inset-[7px] rounded-t-full rounded-b-[34px] border-[1.5px] border-dashed" style={{ borderColor: SM.blue }} />
            </div>
          </div>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[19px] leading-[1.8] opacity-80">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "A very first birthday", ru: "Самый первый день рождения", hi: "पहला जन्मदिन" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Stitched pop="-1">
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]" style={{ color: SM.blue }}>{L.when}</p>
              <p className="mt-2 text-[44px] italic leading-none" style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-3 text-[15px] opacity-70">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Stitched>
          )}
          {where && (
            <Stitched pop="1">
              <p className="text-[12px] font-bold uppercase tracking-[0.3em]" style={{ color: SM.blue }}>{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[40px] italic leading-[1.05]" style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{where}</E>
              {p.venue && p.city && <p className="mt-3 text-[15px] opacity-70">{p.city}</p>}
            </Stitched>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-center gap-3 rounded-full px-6 py-3" style={{ background: SM.cream, boxShadow: "0 10px 30px -14px rgba(46,58,85,.4)" }}>
              <span className="text-[30px] italic leading-none" style={{ fontFamily: "var(--w-display)", fontWeight: 600, color: "var(--w-accent)" }}>{days}</span>
              <span className="text-[12px] font-bold uppercase tracking-[0.22em] opacity-60">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} />
        <div className="relative mx-auto mt-6 max-w-5xl">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="hidden h-[50px] w-full @3xl:block" aria-hidden><path d="M60 50 Q 500 -10 940 50" fill="none" stroke="#C9A77A" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>
          <div className="grid gap-12 @3xl:grid-cols-3 @3xl:gap-6">
            {p.events!.map((e, i) => (
              <div key={i} className="flex flex-col items-center text-center" data-pop>
                <svg viewBox="-40 0 80 150" className="h-[130px] w-auto" aria-hidden style={{ overflow: "visible" }}>
                  <HangStar len={[70, 40, 70][i % 3]} s={0.9} c={[SM.moon, SM.pink, SM.lilac][i % 3]} />
                </svg>
                <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.3em]" style={{ color: SM.blue }}>{e.time || String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-[32px] italic leading-tight" style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{e.name}</h3>
                <p className="mt-1 text-[15px] opacity-65">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-1" className="relative overflow-hidden rounded-[36px]" style={{ background: `linear-gradient(180deg, ${SM.powder}, ${SM.sky})` }}>
            <svg viewBox="0 0 480 360" className="block w-full" aria-hidden>
              <circle cx="380" cy="80" r="34" fill={SM.moon} /><circle cx="394" cy="70" r="30" fill={SM.powder} />
              <FeltCloud x={120} y={90} s={0.6} cls="sm-drift" /><FeltCloud x={330} y={170} s={0.45} cls="sm-drift" />
              <path d="M0 300 C120 270 360 270 480 300 L480 360 L0 360Z" fill={SM.mint} />
              <House x={240} y={300} s={1.05} />
              <path d="M60 330 C120 316 170 340 220 316" stroke={SM.ink} strokeOpacity=".35" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-65">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Tiny moments", ru: "Маленькие мгновения", hi: "नन्हे पल" })} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-5 @3xl:grid-cols-3">
          {design!.gallery!.map((k, i) => (
            <figure key={k} data-pop className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] p-2" style={{ background: SM.cream }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="h-full w-full rounded-t-full rounded-b-[22px] object-cover" />
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-150 -170 300 300" className="absolute -top-[86px] left-1/2 w-[150px] -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}><SleepyMoon id={`${uid}-rs`} s={0.7} /></svg>
          <Stitched pop="0" big>
            <Heading eyebrow="RSVP" title={tr(p, { en: "Will you come to the party?", ru: "Придёте на праздник?", hi: "क्या आप पार्टी में आएँगे?" })} />
            <p className="mx-auto mt-4 max-w-md text-center text-[17px] opacity-65">{tr(p, { en: "Let us know by a little reply below", ru: "Ответьте нам, пожалуйста, ниже", hi: "कृपया नीचे जवाब दें" })}</p>
            <div className="mt-8 text-left">{children}</div>
          </Stitched>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <Stitched pop="0">
            <p className="text-[12px] font-bold uppercase tracking-[0.3em]" style={{ color: SM.blue }}>{L.info}</p>
            <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[18px] leading-relaxed">{design!.texts!.body!}</E>
          </Stitched>
        </div>
      </Sec>
    ),
  };

  const name = p.partner1 || "";
  const big = Math.min(26, 120 / Math.max(3, [...name].length));

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: SM.sky, ink: SM.ink, accent: "#C7798A", display: STACKS.moon.display, body: STACKS.moon.body }), fontFamily: "var(--w-body)", background: `linear-gradient(180deg, ${SM.powder} 0%, var(--w-bg) 30%, var(--w-bg) 100%)` }}
    >
      <header ref={hero} onClick={tap} className="relative isolate overflow-hidden" style={{ height: compact ? 780 : "max(100svh, 700px)", background: `linear-gradient(180deg, #CFDCF0 0%, ${SM.powder} 45%, ${SM.sky} 100%)` }}>
        <div className="sm-par absolute inset-0">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <MobileBar w={400} y={28} />
            <g className="sm-drop"><HangStar x={52} y={42} len={110} s={0.7} /></g>
            <g className="sm-drop"><FeltCloud x={110} y={190} s={0.42} /></g>
            <g className="sm-drop"><HangStar x={290} y={36} len={70} s={0.6} c={SM.pink} /></g>
            {p.age ? <g className="sm-drop"><FeltNumber n={p.age} x={348} y={42} len={60} s={0.62} /></g> : <g className="sm-drop"><HangStar x={348} y={42} len={110} s={0.7} c={SM.lilac} /></g>}
            <g className="sm-rise"><SleepyMoon id={`${uid}-mm`} x={200} y={290} s={0.82} /><Zzz x={250} y={200} s={0.8} /></g>
            <g className="sm-part-l"><FeltCloud x={40} y={800} s={1.1} /><FeltCloud x={120} y={830} s={0.9} c="#F4F7FC" /></g>
            <g className="sm-part-r"><FeltCloud x={360} y={790} s={1.1} /><FeltCloud x={280} y={835} s={0.9} c="#F4F7FC" /></g>
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <MobileBar w={1440} y={36} />
            <g className="sm-drop"><HangStar x={210} y={52} len={190} s={1} /></g>
            <g className="sm-drop"><FeltCloud x={380} y={250} s={0.7} /></g>
            <g className="sm-drop"><HangStar x={520} y={30} len={90} s={0.8} c={SM.pink} /></g>
            <g className="sm-drop"><HangStar x={930} y={30} len={110} s={0.8} c={SM.lilac} /></g>
            <g className="sm-drop"><FeltCloud x={1080} y={230} s={0.6} /></g>
            {p.age ? <g className="sm-drop"><FeltNumber n={p.age} x={1230} y={52} len={130} s={1} /></g> : <g className="sm-drop"><HangStar x={1230} y={52} len={180} s={1} /></g>}
            <g className="sm-rise"><SleepyMoon id={`${uid}-dm`} x={720} y={290} s={1.05} /><Zzz x={800} y={180} /></g>
            <g className="sm-part-l"><FeltCloud x={120} y={830} s={1.8} /><FeltCloud x={340} y={870} s={1.3} c="#F4F7FC" /><FeltCloud x={60} y={640} s={0.7} o={0.8} cls="sm-drift" /></g>
            <g className="sm-part-r"><FeltCloud x={1320} y={820} s={1.8} /><FeltCloud x={1100} y={875} s={1.3} c="#F4F7FC" /><FeltCloud x={1380} y={600} s={0.7} o={0.8} cls="sm-drift" /></g>
          </svg>
        </div>
        <div className="sm-text absolute inset-x-0 top-[51%] z-20 mx-auto flex max-w-3xl flex-col items-center px-6 text-center @3xl:top-[54%]">
          <p data-up className="text-[12px] font-bold uppercase tracking-[0.34em]" style={{ color: "var(--w-accent)" }}>{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
          <E as="h1" path="profile.partner1" className="mt-3 block italic leading-[0.95]" style={{ fontFamily: "var(--w-display)", fontWeight: 600, fontSize: `clamp(64px, ${big}cqi, 150px)` }}>{glyphs(name, editable)}</E>
          <p data-up className="mt-2 text-[clamp(20px,3cqi,28px)] italic" style={{ fontFamily: "var(--w-display)", fontWeight: 500, color: "var(--w-accent)" }}>{occasionLine(p)}</p>
          <p data-up className="mt-4 text-[14px] font-semibold tracking-wide opacity-70">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
          {!compact && <p data-up className="mt-4 text-[11px] font-bold uppercase tracking-[0.26em] opacity-40">{tr(p, { en: "tap the stars", ru: "коснись звёздочек", hi: "तारों को छुओ" })}</p>}
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10 overflow-hidden">
        <svg viewBox="0 0 1440 180" preserveAspectRatio="xMidYMax slice" className="block h-[150px] w-full" aria-hidden>
          {[80, 300, 560, 820, 1080, 1340].map((x, i) => <FeltCloud key={x} x={x} y={150 - (i % 2) * 20} s={1.4 + (i % 3) * 0.2} c={i % 2 ? "#F7F9FD" : "#FFFFFF"} />)}
        </svg>
        <div className="bg-white px-6 pb-10 pt-2 text-center">
          <p className="text-[26px] italic" style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{tr(p, { en: "Sweet dreams & see you soon", ru: "Сладких снов и до встречи", hi: "मीठे सपने, जल्द मिलेंगे" })}</p>
          <div className="mt-3 text-[13px] opacity-60">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.18} />
    </div>
  );
}

function Twinkle() {
  return (
    <svg viewBox="-60 -20 120 40" className="mx-auto w-24" aria-hidden>
      {[-40, 0, 40].map((x, i) => <path key={x} d={`M${x} ${-10 + i * 0} Q${x} 0 ${x + 9} 0 Q${x} 0 ${x} 10 Q${x} 0 ${x - 9} 0 Q${x} 0 ${x} -10Z`} fill={i === 1 ? SM.gold : SM.blue} transform={i === 1 ? "" : `translate(0 4) scale(1)`} />)}
    </svg>
  );
}

function Heading({ eyebrow, title, align = "center", path }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-2 block text-[clamp(36px,6cqi,58px)] italic leading-[1.05]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-bold uppercase tracking-[0.32em]" style={{ color: SM.blue }}>{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)", fontWeight: 600 }}>{title}</h2>}
      <svg viewBox="0 0 120 12" className="mt-3 w-24" aria-hidden><path d="M2 6 H118" stroke={SM.blue} strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" /><circle cx="60" cy="6" r="4" fill={SM.gold} /></svg>
    </div>
  );
}

function Stitched({ children, pop, big }: { children: ReactNode; pop: string; big?: boolean }) {
  return (
    <div data-pop={pop} className={`relative rounded-[32px] text-center ${big ? "px-6 py-12 @xl:px-12" : "px-8 py-9"}`} style={{ background: SM.cream, boxShadow: "0 30px 60px -36px rgba(46,58,85,.45)" }}>
      <div className="pointer-events-none absolute inset-[9px] rounded-[25px] border-[1.5px] border-dashed" style={{ borderColor: "rgba(157,181,218,.8)" }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(46,58,85,.5)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)" }}>
      {children}
    </a>
  );
}
