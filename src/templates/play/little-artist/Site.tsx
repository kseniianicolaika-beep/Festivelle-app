"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, gsap, kl, mapUrl, media, orderedSections, popOnScroll, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { Blob, Brush, Crayon, Easel, LA, PAINTS, Palette, WcDefs } from "./art";

type Splash = { x: number; y: number; ci: number; seed: number; r: number; k: number };

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const n = useRef(0);
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.to(".la-brush", { rotate: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
    gsap.to(".la-palette", { y: -6, rotate: -2, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.utils.toArray<SVGGElement>(".la-eyes").forEach((e) => gsap.to(e, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.09, yoyo: true, repeat: -1, repeatDelay: 3.5 }));
    gsap.utils.toArray<SVGGElement>(".la-crayon").forEach((c, i) => gsap.to(c, { y: -6, duration: 1.2 + i * 0.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.3 }));
    if (!compact) {
      // the signature: paint drops fall, bloom into watercolour washes, then a brush paints the name on
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".la-drop", { y: -500, scaleY: 1.6, duration: 0.7, ease: "power2.in", stagger: 0.12 })
        .to(".la-drop", { autoAlpha: 0, duration: 0.01, stagger: 0.12 }, 0.7)
        .from(".la-hero-blob", { scale: 0, transformOrigin: "50% 50%", duration: 1.6, ease: "expo.out", stagger: 0.12 }, 0.68)
        .fromTo(".la-name", { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 1.5, ease: "power2.inOut" }, 1.2)
        .fromTo(".la-sweep", { left: "0%", autoAlpha: 1 }, { left: "100%", duration: 1.5, ease: "power2.inOut" }, 1.2)
        .to(".la-sweep", { autoAlpha: 0, duration: 0.3 }, 2.7)
        .from(".la-up", { y: 16, autoAlpha: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.1 }, 2.2)
        .from(".la-char", { y: 200, duration: 1.2, ease: "back.out(1.4)", stagger: 0.15 }, 1);
      gsap.to(".la-par", { yPercent: 10, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  useEffect(() => {
    const el = hero.current?.querySelector(`[data-k="${n.current}"]`);
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.from(el, { scale: 0, transformOrigin: "50% 50%", duration: 1.4, ease: "expo.out" });
  }, [splashes]);

  const tap = (e: React.MouseEvent) => {
    if (compact || !hero.current || (e.target as Element).closest("a,button,[contenteditable]")) return;
    const r = hero.current.getBoundingClientRect();
    n.current += 1;
    const k = n.current;
    setSplashes((s) => [...s.slice(-11), { x: e.clientX - r.left, y: e.clientY - r.top, ci: k % PAINTS.length, seed: k * 7, r: 50 + (k % 4) * 18, k }]);
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="relative mx-auto max-w-3xl text-center" data-pop>
          <svg viewBox="-150 -60 300 120" className="pointer-events-none absolute left-1/2 top-1/2 -z-0 w-[min(100%,620px)] -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden><WcDefs id={`${uid}-iv`} /><Blob id={`${uid}-iv`} r={52} ci={5} seed={12} x={-40} /><Blob id={`${uid}-iv`} r={40} ci={1} seed={5} x={60} y={10} /></svg>
          <E as="p" multiline path="profile.inviteLine" className="relative block text-[clamp(34px,6.4cqi,60px)] font-bold leading-[1.1]" style={{ fontFamily: "var(--w-display)" }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div className="relative mx-auto w-[min(74cqi,330px)]" data-pop="-2">
            <svg viewBox="-20 -40 240 390" className="w-full" aria-hidden><Easel /></svg>
            <div className="absolute overflow-hidden" style={{ left: `${(14 / 240) * 100}%`, top: `${(34 / 390) * 100}%`, width: `${(212 / 240) * 100}%`, height: `${(252 / 390) * 100}%`, padding: "4%" }}>
              {heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg data-edit-photo="hero" viewBox="-100 -120 200 240" className="h-full w-full"><WcDefs id={`${uid}-ph`} /><Blob id={`${uid}-ph`} r={70} ci={3} seed={3} /><Palette s={0.7} y={30} /></svg>
              )}
            </div>
          </div>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" ci={2} />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[18px] leading-[1.8] opacity-85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Bring your brightest smile", ru: "Приходи в хорошем настроении", hi: "सबसे प्यारी मुस्कान लाना" })} ci={0} />
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Chip color={LA.coral} code="No. 01" tilt={-2}>
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] opacity-60">{L.when}</p>
              <p className="mt-1 text-[46px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-2 text-[14px] opacity-70">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Chip>
          )}
          {where && (
            <Chip color={LA.teal} code="No. 02" tilt={2}>
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] opacity-60">{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-[42px] font-bold leading-[1]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[14px] opacity-70">{p.city}</p>}
            </Chip>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="relative inline-flex items-center gap-3 px-7 py-4">
              <svg viewBox="-70 -45 140 90" preserveAspectRatio="none" className="absolute -inset-x-4 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+32px)]" aria-hidden><WcDefs id={`${uid}-cd`} /><Blob id={`${uid}-cd`} r={44} ci={1} seed={9} x={0} /></svg>
              <span className="relative text-[36px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{days}</span>
              <span className="relative text-[12px] font-bold uppercase tracking-[0.2em] opacity-70">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} ci={4} />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 @3xl:grid-cols-3">
          {p.events!.map((e, i) => (
            <Chip key={i} color={PAINTS[(i * 2 + 3) % PAINTS.length]} code={e.time || `No. ${String(i + 1).padStart(2, "0")}`} tilt={[-2, 1.5, -1][i % 3]}>
              <h3 className="text-[36px] font-bold leading-[1]" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
              <p className="mt-2 text-[14px] opacity-70">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
            </Chip>
          ))}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-1" className="relative overflow-hidden rounded-[6px] bg-white p-3 shadow-[0_30px_60px_-34px_rgba(53,42,69,.5)]">
            <svg viewBox="0 0 480 340" className="block w-full" aria-hidden>
              <WcDefs id={`${uid}-mp`} />
              <rect width="480" height="340" fill={LA.paper} />
              <Blob id={`${uid}-mp`} x={110} y={100} r={80} ci={6} seed={2} />
              <Blob id={`${uid}-mp`} x={380} y={250} r={70} ci={3} seed={8} />
              <Blob id={`${uid}-mp`} x={360} y={70} r={46} ci={6} seed={4} />
              <path d="M-10 210 C120 170 220 260 330 190 S 470 150 500 170" fill="none" stroke={LA.sun} strokeOpacity=".7" strokeWidth="20" strokeLinecap="round" filter={`url(#${uid}-mp-wc)`} />
              <path d="M60 300 C140 270 220 220 260 160" fill="none" stroke={LA.ink} strokeOpacity=".55" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
              <Brush x={262} y={150} s={0.5} r={20} c={LA.coral} />
              <path d="M250 150 l12 -12 l12 12 l-12 12z" fill={LA.coral} />
            </svg>
          </div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} ci={3} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "The gallery wall", ru: "Наша галерея", hi: "हमारी गैलरी" })} ci={5} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 @3xl:grid-cols-3">
          {design!.gallery!.map((k, i) => (
            <figure key={k} data-pop={i % 2 ? 2 : -2} className="relative p-[10px]" style={{ background: PAINTS[i % PAINTS.length], boxShadow: "0 20px 40px -24px rgba(53,42,69,.6), inset 0 0 0 3px rgba(255,255,255,.35)", transform: `rotate(${[-2, 1.5, -1, 2][i % 4]}deg)` }}>
              <div className="bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
              </div>
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-24">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-110 -90 220 180" className="absolute -right-4 -top-16 w-[120px] rotate-12" aria-hidden style={{ overflow: "visible" }}><Palette s={0.9} /></svg>
          <div className="relative rounded-[8px] bg-white px-6 pb-12 pt-14 shadow-[0_40px_80px_-40px_rgba(53,42,69,.55)] @xl:px-12">
            <div className="absolute inset-x-6 -top-3 flex justify-between" aria-hidden>{Array.from({ length: 14 }, (_, i) => <span key={i} className="h-7 w-3 rounded-full border-2 border-[#9A93A8] bg-[var(--w-bg)]" />)}</div>
            <Heading eyebrow="RSVP" title={L.rsvp} ci={1} />
            <p className="mx-auto mt-4 max-w-md text-center text-[16px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl">
          <Chip color={LA.sun} code={L.info} tilt={0}>
            <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[17px] leading-relaxed">{design!.texts!.body!}</E>
          </Chip>
        </div>
      </Sec>
    ),
  };

  const name = p.partner1 || "";
  const big = Math.min(30, 130 / Math.max(3, [...name].length));

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: LA.paper, ink: LA.ink, accent: LA.violet, display: STACKS.artist.display, body: STACKS.artist.body }), fontFamily: "var(--w-body)", background: "var(--w-bg)" }}
    >
      <header ref={hero} onClick={tap} className="relative isolate cursor-crosshair overflow-hidden" style={{ height: compact ? 760 : "max(100svh, 680px)" }}>
        <div className="la-par absolute inset-0">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <WcDefs id={`${uid}-m`} />
            <Blob id={`${uid}-m`} x={110} y={330} r={130} ci={5} seed={1} cls="la-hero-blob" />
            <Blob id={`${uid}-m`} x={290} y={400} r={120} ci={1} seed={2} cls="la-hero-blob" />
            <Blob id={`${uid}-m`} x={200} y={260} r={80} ci={3} seed={3} cls="la-hero-blob" />
            <Blob id={`${uid}-m`} x={340} y={120} r={50} ci={2} seed={4} cls="la-hero-blob" />
            <Blob id={`${uid}-m`} x={60} y={110} r={40} ci={0} seed={5} cls="la-hero-blob" />
            {[[110, 330, 5], [290, 400, 1], [200, 260, 3]].map(([x, y, c], i) => <circle key={i} className="la-drop" cx={x} cy={y} r="9" fill={PAINTS[c]} opacity={compact ? 0 : 1} />)}
            <g className="la-char"><Palette x={110} y={730} s={0.95} r={-8} /></g>
            <g className="la-char"><Brush x={290} y={760} s={0.95} r={-28} c={LA.coral} /></g>
            <g className="la-char">{[LA.sky, LA.sun, LA.leaf].map((c, i) => <g key={c} className="la-crayon"><Crayon x={340 + i * 20} y={860} r={8 - i * 8} c={c} s={0.8} /></g>)}</g>
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <WcDefs id={`${uid}-d`} />
            <Blob id={`${uid}-d`} x={520} y={420} r={250} ci={5} seed={1} cls="la-hero-blob" />
            <Blob id={`${uid}-d`} x={930} y={470} r={230} ci={1} seed={2} cls="la-hero-blob" />
            <Blob id={`${uid}-d`} x={740} y={300} r={150} ci={3} seed={3} cls="la-hero-blob" />
            <Blob id={`${uid}-d`} x={1250} y={170} r={90} ci={2} seed={4} cls="la-hero-blob" />
            <Blob id={`${uid}-d`} x={180} y={200} r={70} ci={0} seed={5} cls="la-hero-blob" />
            <Blob id={`${uid}-d`} x={1300} y={700} r={60} ci={6} seed={6} cls="la-hero-blob" />
            {[[520, 420, 5], [930, 470, 1], [740, 300, 3]].map(([x, y, c], i) => <circle key={i} className="la-drop" cx={x} cy={y} r="14" fill={PAINTS[c]} opacity={compact ? 0 : 1} />)}
            <g className="la-char"><Palette x={220} y={720} s={1.5} r={-10} /></g>
            <g className="la-char"><Brush x={1170} y={760} s={1.5} r={-30} c={LA.coral} /></g>
            <g className="la-char">{[LA.sky, LA.sun, LA.leaf, LA.violet].map((c, i) => <g key={c} className="la-crayon"><Crayon x={1260 + i * 30} y={930} r={10 - i * 7} c={c} s={1.2} /></g>)}</g>
          </svg>
          <svg className="absolute inset-0 h-full w-full" aria-hidden>
            <WcDefs id={`${uid}-t`} />
            {splashes.map((s) => <g key={s.k} data-k={s.k}><Blob id={`${uid}-t`} x={s.x} y={s.y} r={s.r} ci={s.ci} seed={s.seed} /></g>)}
          </svg>
        </div>

        <div className="relative z-20 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 pb-[18svh] text-center @3xl:pb-[6svh]">
          <p className="la-up text-[13px] font-bold uppercase tracking-[0.3em]" style={{ color: LA.violet }}>{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
          <div className="relative mt-2">
            <E as="h1" path="profile.partner1" className="la-name block font-bold leading-[0.9]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(84px, ${big}cqi, 230px)` }}>{name}</E>
            {!compact && (
              <svg viewBox="-20 -170 60 190" className="la-sweep pointer-events-none absolute top-1/2 w-[clamp(46px,7cqi,90px)] -translate-x-1/3 -translate-y-[70%] opacity-0" aria-hidden style={{ overflow: "visible" }}><Brush s={1} r={-25} c={LA.ink} /></svg>
            )}
          </div>
          <p className="la-up mt-1 text-[clamp(26px,4.4cqi,40px)] font-bold" style={{ fontFamily: "var(--w-display)", color: LA.coral }}>{occasionLine(p)}</p>
          <p className="la-up mt-3 rounded-full bg-white/70 px-5 py-2 text-[14px] font-semibold">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
          {!compact && <p className="la-up mt-4 text-[11px] font-bold uppercase tracking-[0.24em] opacity-45">{tr(p, { en: "tap anywhere to paint", ru: "нажми, чтобы рисовать", hi: "रंग भरने के लिए छुओ" })}</p>}
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10 overflow-hidden px-6 pb-10 pt-16 text-center">
        <svg viewBox="0 0 600 120" className="mx-auto w-[min(90%,520px)]" aria-hidden>
          {PAINTS.map((c, i) => <Crayon key={c} x={60 + i * 80} y={120} r={i % 2 ? 6 : -6} c={c} s={0.95} />)}
        </svg>
        <p className="mt-6 text-[36px] font-bold" style={{ fontFamily: "var(--w-display)" }}>{L.see}</p>
        <div className="mt-2 text-[13px] opacity-65">{credit}</div>
      </footer>
      <Grain opacity={0.3} />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path, ci = 0 }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string; ci?: number }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "relative mt-1 block text-[clamp(44px,8cqi,72px)] font-bold leading-[0.95]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-bold uppercase tracking-[0.3em] opacity-60">{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <svg viewBox="0 0 200 20" className="mt-1 w-40" aria-hidden><path d="M4 12 C40 4 90 16 130 8 S 190 10 196 9" fill="none" stroke={PAINTS[ci % PAINTS.length]} strokeWidth="9" strokeLinecap="round" opacity=".8" /></svg>
    </div>
  );
}

function Chip({ color, code, tilt, children }: { color: string; code: string; tilt: number; children: ReactNode }) {
  return (
    <div data-pop={tilt} className="overflow-hidden rounded-[6px] bg-white shadow-[0_24px_50px_-28px_rgba(53,42,69,.5)]" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative h-24" style={{ background: color }}>
        <span className="absolute bottom-2 right-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">{code}</span>
      </div>
      <div className="px-7 py-6 text-left">{children}</div>
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(142,107,184,.8)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)" }}>
      {children}
    </a>
  );
}
