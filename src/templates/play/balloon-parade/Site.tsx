"use client";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst, centerIn } from "../_shared/fx";
import { BALLOON_COLORS, BP, Balloon, BalloonGrad, Bear, Bunny, Bunting, Cloud, Duck, Lawn, NumberDefs, NumberGlyph } from "./art";

const CONFETTI = [BP.coral, BP.butter, BP.mint, BP.sky, BP.blush, BP.lilac];

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const editable = !!useEdit()?.editable;
  const [popped, setPopped] = useState(!!compact);
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  useLenis(!compact);

  // ── ambient life + scroll reveals ──
  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    gsap.utils.toArray<SVGGElement>(".bp-balloon, .bp-num").forEach((b, i) => {
      gsap.to(b, { rotate: i % 2 ? 4.5 : -4.5, duration: 2.6 + (i % 5) * 0.45, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%", delay: -i * 0.7 });
    });
    gsap.utils.toArray<SVGGElement>(".bp-flag").forEach((f, i) => gsap.to(f, { rotate: i % 2 ? 7 : -7, duration: 1.8 + (i % 3) * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%", delay: -i * 0.3 }));
    gsap.utils.toArray<SVGGElement>(".bp-eyes").forEach((e, i) => gsap.to(e, { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.09, yoyo: true, repeat: -1, repeatDelay: 3 + i * 1.3, delay: 1 + i }));
    gsap.utils.toArray<SVGGElement>(".bp-ear-r").forEach((e, i) => gsap.to(e, { rotate: 14, duration: 0.25, yoyo: true, repeat: -1, repeatDelay: 4 + i * 2, ease: "power2.inOut" }));
    gsap.utils.toArray<SVGGElement>(".bp-drift").forEach((b, i) => gsap.fromTo(b, { y: 0 }, { y: -700, x: i % 2 ? 60 : -60, duration: 26 + i * 6, ease: "none", repeat: -1, delay: -i * 9 }));
    gsap.utils.toArray<HTMLElement>(".bp-cloud").forEach((c, i) => gsap.to(c, { x: i % 2 ? -40 : 40, duration: 14 + i * 3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    gsap.utils.toArray<HTMLElement>(".bp-hang").forEach((c, i) => gsap.to(c, { rotate: i % 2 ? 1.6 : -1.6, duration: 2.4 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% -60px" }));
    if (!compact) {
      gsap.from(".bp-scene", { yPercent: 18, duration: 1.6, ease: "elastic.out(1, 0.75)" });
      gsap.to(".bp-scene-sky", { yPercent: -10, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".bp-parade").forEach((el) => gsap.fromTo(el, { xPercent: -30 }, { xPercent: 110, duration: 28, ease: "none", repeat: -1 }));
      gsap.utils.toArray<SVGGElement>(".bp-walk").forEach((el, i) => gsap.to(el, { y: -5, duration: 0.32, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.12 }));
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  // ── the signature: pop the big balloon to reveal the name ──
  const pop = useCallback(() => {
    if (popped || !hero.current) return;
    const host = hero.current;
    const cover = host.querySelector(".bp-cover-body");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPopped(true);
    if (reduce || !cover) return;
    const c = centerIn(host, cover);
    burst(host, c.x, c.y, { colors: CONFETTI, count: 46, shapes: ["rect", "dot", "rect", "star"], velocity: [220, 620], gravity: 640, size: 11 });
    gsap.fromTo(".bp-burst line", { drawSVG: "0% 10%", opacity: 1 }, { drawSVG: "70% 100%", opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.timeline()
      .to(".bp-cover", { scale: 1.12, duration: 0.09, ease: "power1.out" })
      .to(".bp-cover", { scale: 1.4, autoAlpha: 0, duration: 0.07 })
      .fromTo(".bp-reveal", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "<")
      .from(".bp-name .ch", { y: 70, scale: 0.2, rotate: () => gsap.utils.random(-40, 40), autoAlpha: 0, duration: 1.1, ease: "elastic.out(1, 0.45)", stagger: 0.06 }, "<")
      .from(".bp-reveal [data-up]", { y: 24, autoAlpha: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.08 }, "<0.25")
      .to(".bp-critter", { y: -22, duration: 0.22, ease: "power2.out", yoyo: true, repeat: 3, stagger: 0.07 }, "<");
  }, [popped]);

  useEffect(() => {
    if (popped) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setPopped(true);
    gsap.set(".bp-reveal", { autoAlpha: 0 });
    const t = setTimeout(pop, 6500);
    return () => clearTimeout(t);
  }, [popped, pop]);

  // tap any balloon in the scene: pop + re-inflate
  const tapScene = (e: React.MouseEvent) => {
    const b = (e.target as Element).closest(".bp-balloon");
    if (!b || !hero.current || b.closest(".bp-cover")) return;
    const body = b.querySelector(".bp-body");
    if (!body || gsap.isTweening(body)) return;
    const c = centerIn(hero.current, body);
    burst(hero.current, c.x, c.y, { colors: [b.getAttribute("data-color") || BP.coral, "#fff", BP.butter], count: 22, velocity: [140, 380] });
    gsap.timeline().to(body, { scale: 1.15, duration: 0.08 }).to(body, { scale: 0, duration: 0.05, transformOrigin: "50% 100%" }).to(body, { scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)", delay: 1 });
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <svg viewBox="0 0 300 50" className="mx-auto mb-6 w-48" aria-hidden><Bunting w={300} sag={10} n={7} y={4} /></svg>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(26px,5.2cqi,46px)] font-semibold leading-[1.22]" style={{ fontFamily: "var(--w-display)" }}>
            {p.inviteLine || occasionInvite(p)}
          </E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-[min(78cqi,340px)]" data-pop="-4">
            <svg viewBox="-60 -150 120 170" className="w-full" aria-hidden style={{ overflow: "visible" }}>
              <defs>
                <clipPath id={`${uid}-bclip`}><path d="M0 -12 C-33 -21 -50 -46 -50 -73 C-50 -105 -28 -129 0 -129 C28 -129 50 -105 50 -73 C50 -46 33 -21 0 -12Z" /></clipPath>
              </defs>
              <path d="M0 -10 C6 0 -6 6 2 20" stroke={BP.ink} strokeOpacity=".35" fill="none" />
              <path d="M-6 -6 L0 -13 L6 -6 Q0 -3 -6 -6Z" fill={BP.coral} />
              <path d="M0 -10 C-35 -19 -54 -45 -54 -74 C-54 -108 -30 -133 0 -133 C30 -133 54 -108 54 -74 C54 -45 35 -19 0 -10Z" fill={BP.coral} />
              {heroUrl ? (
                <image data-edit-photo="hero" href={heroUrl} x="-50" y="-130" width="100" height="120" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}-bclip)`} />
              ) : (
                <g clipPath={`url(#${uid}-bclip)`} data-edit-photo="hero"><rect x="-50" y="-130" width="100" height="120" fill={BP.blush} /><Bunny x={0} y={-8} s={0.62} /></g>
              )}
              <ellipse cx="-26" cy="-104" rx="6" ry="13" transform="rotate(28 -26 -104)" fill="#fff" opacity=".45" />
            </svg>
          </div>
          <div data-pop="2">
            <Heading eyebrow={L.about.toUpperCase()} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[19px] leading-[1.75] text-[var(--w-ink)]/85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Come and join the parade", ru: "Приходи на праздник", hi: "परेड में शामिल हों" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Ticket color={BP.butter} tilt={-2}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em] opacity-70">{L.when}</p>
              <p className="mt-2 text-[40px] font-semibold leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-2 text-[15px] opacity-75">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Ticket>
          )}
          {where && (
            <Ticket color={BP.mint} tilt={2}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em] opacity-70">{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[34px] font-semibold leading-[1.05]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[15px] opacity-75">{p.city}</p>}
            </Ticket>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_10px_30px_-12px_rgba(47,58,86,.35)]">
              <span className="text-[28px] font-semibold leading-none text-[var(--w-accent)]" style={{ fontFamily: "var(--w-display)" }}>{days}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] opacity-70">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} />
        <div className="mx-auto mt-6 grid max-w-5xl gap-x-6 gap-y-4 @3xl:grid-cols-3">
          {p.events!.map((e, i) => {
            const c = BALLOON_COLORS[(i * 2 + 1) % 6];
            return (
              <div key={i} className="flex flex-col items-center" data-pop={i % 2 ? 3 : -3}>
                <svg viewBox="-60 -230 120 232" className="h-[170px] w-auto" aria-hidden style={{ overflow: "visible" }}>
                  <defs><BalloonGrad id={`${uid}-s${i}`} c={c} /></defs>
                  <Balloon id={`${uid}-s${i}`} c={c} len={100} tilt={i % 2 ? 5 : -5} />
                </svg>
                <div className="bp-hang -mt-1 w-full max-w-[320px] rounded-[26px] bg-[var(--w-paper)] px-7 py-7 text-center shadow-[0_24px_50px_-26px_rgba(47,58,86,.45)] ring-1 ring-black/5">
                  <p className="text-[12px] font-extrabold tracking-[0.3em]" style={{ color: c === BP.butter ? "#c99a2e" : c }}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-[28px] font-semibold leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
                  <p className="mt-2 text-[15px] opacity-75">{[fmtDate(p, e.date), e.time].filter(Boolean).join(" · ")}</p>
                  {e.venue && <p className="text-[15px] opacity-60">{e.venue}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 @3xl:grid-cols-2">
          <div data-pop="-2" className="relative overflow-hidden rounded-[32px] bg-[#E8F2DA] shadow-[0_30px_60px_-34px_rgba(47,58,86,.5)]">
            <MiniMap uid={uid} />
          </div>
          <div data-pop className="text-center @3xl:text-left">
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Giggles & snapshots", ru: "Улыбки и снимки", hi: "हँसी और यादें" })} />
        <div className="relative mx-auto mt-10 max-w-6xl px-6">
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" className="absolute inset-x-0 top-2 h-10 w-full" aria-hidden><path d="M0 10 Q500 70 1000 10" fill="none" stroke={BP.ink} strokeOpacity=".3" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
          <div className="grid grid-cols-2 gap-5 pt-8 @3xl:grid-cols-4">
            {design!.gallery!.map((k, i) => (
              <figure key={k} data-pop={i % 2 ? 4 : -4} className="relative rounded-[6px] bg-white p-2.5 pb-9 shadow-[0_18px_34px_-20px_rgba(47,58,86,.5)]" style={{ transform: `rotate(${[-3, 2, -1.5, 3][i % 4]}deg)` }}>
                <span className="absolute -top-3 left-1/2 h-6 w-3 -translate-x-1/2 rounded-sm" style={{ background: BALLOON_COLORS[i % 6] }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="aspect-square w-full rounded-[3px] object-cover" />
              </figure>
            ))}
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28 @3xl:pt-36">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-160 -120 320 110" className="absolute -top-[104px] left-1/2 w-[340px] -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}>
            <g transform="translate(-70 30)"><Bear s={0.8} /></g>
            <g transform="translate(70 34)"><Bunny s={0.8} flip /></g>
          </svg>
          <div className="relative rounded-[36px] bg-[var(--w-paper)] px-6 py-12 shadow-[0_40px_80px_-40px_rgba(47,58,86,.5)] ring-1 ring-black/5 @xl:px-12">
            <Heading eyebrow="RSVP" title={L.rsvp} />
            <p className="mx-auto mt-4 max-w-md text-center text-[17px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl rounded-[28px] border-2 border-dashed border-[var(--w-accent)]/40 px-8 py-10 text-center" data-pop>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[var(--w-accent)]">{L.info}</p>
          <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[18px] leading-relaxed">{design!.texts!.body!}</E>
        </div>
      </Sec>
    ),
  };

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden bg-[var(--w-bg)] text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: BP.cream, ink: BP.ink, accent: BP.coral, paper: BP.paper, display: STACKS.balloon.display, body: STACKS.balloon.body }), fontFamily: "var(--w-body)" }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(${BP.blush} 1.6px, transparent 1.8px), radial-gradient(${BP.mint} 1.6px, transparent 1.8px), radial-gradient(${BP.butter} 1.6px, transparent 1.8px)`, backgroundSize: "140px 160px, 190px 150px, 230px 210px", backgroundPosition: "0 0, 60px 80px, 120px 30px" }} />
      {/* ── HERO ── */}
      <header ref={hero} onClick={tapScene} className="relative isolate flex flex-col overflow-hidden" style={{ height: compact ? 760 : "max(100svh, 680px)" }}>
        <div className="bp-scene-sky absolute inset-0 -z-10" style={{ background: `linear-gradient(180deg, #FDE9DA 0%, #FFF3E4 45%, ${BP.cream} 100%)` }} />
        <svg viewBox="0 0 1000 120" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 h-[78px] w-full @3xl:h-[110px]" aria-hidden><Bunting w={1000} sag={34} n={15} y={-4} /></svg>
        <svg className="bp-cloud absolute left-[6%] top-[14%] w-[110px] @3xl:w-[170px]" viewBox="-80 -50 160 64" aria-hidden><Cloud /></svg>
        <svg className="bp-cloud absolute right-[8%] top-[22%] w-[90px] @3xl:w-[150px]" viewBox="-80 -50 160 64" aria-hidden><Cloud o={0.85} /></svg>

        <div className="relative z-20 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-6 pt-[clamp(104px,15svh,150px)] text-center">
          <div className="bp-reveal flex flex-col items-center">
            <p data-up className="rounded-full bg-white/80 px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.3em] text-[var(--w-accent)] shadow-sm">{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
            <E as="h1" path="profile.partner1" className="bp-name mt-4 block font-semibold leading-[0.9] tracking-[-0.02em]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(64px, ${Math.min(30, 120 / Math.max(3, [...(p.partner1 || "")].length))}cqi, 210px)`, color: "var(--w-ink)" }}>
              {glyphs(p.partner1 || "", editable)}
            </E>
            <p data-up className="mt-3 text-[clamp(18px,3cqi,26px)] font-semibold" style={{ fontFamily: "var(--w-display)", color: "var(--w-accent)" }}>{occasionLine(p)}</p>
            <p data-up className="mt-3 text-[15px] font-semibold opacity-70">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
            {!compact && <p data-up className="mt-5 text-[12px] font-bold uppercase tracking-[0.22em] opacity-45">{tr(p, { en: "psst — tap the balloons", ru: "нажми на шарики", hi: "गुब्बारों को छुओ" })}</p>}
          </div>
          {!popped && (
            <button type="button" onClick={(e) => { e.stopPropagation(); pop(); }} className="bp-cover absolute left-1/2 top-[clamp(70px,9svh,110px)] z-30 w-[min(58cqi,270px)] -translate-x-1/2 cursor-pointer" aria-label={tr(p, { en: "Pop the balloon", ru: "Лопни шарик", hi: "गुब्बारा फोड़ो" })}>
              <svg viewBox="-70 -320 140 330" className="w-full" style={{ overflow: "visible" }}>
                <defs><BalloonGrad id={`${uid}-cv`} c={BP.lilac} /></defs>
                <g className="bp-cover-bob"><g className="bp-cover-body"><Balloon id={`${uid}-cv`} c={BP.lilac} len={150} s={1.35} cls="bp-cover-b" /></g></g>
                <g className="bp-burst" transform="translate(0 -230)" stroke={BP.coral} strokeWidth="5" strokeLinecap="round" opacity="0">
                  {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 60} y1={Math.sin(a) * 60} x2={Math.cos(a) * 120} y2={Math.sin(a) * 120} />; })}
                </g>
                <g transform="translate(14 -68) rotate(8)">
                  <rect x="-4" y="0" width="82" height="34" rx="8" fill="#fff" stroke={BP.ink} strokeOpacity=".2" />
                  <circle cx="6" cy="17" r="3" fill="none" stroke={BP.ink} strokeOpacity=".4" />
                  <text x="42" y="23" textAnchor="middle" fontSize="15" fontWeight="700" fill={BP.ink} style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "Pop me!", ru: "Лопни!", hi: "फोड़ो!" })}</text>
                </g>
              </svg>
            </button>
          )}
        </div>

        <div className="bp-scene absolute inset-0 z-10">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <defs>{BALLOON_COLORS.map((c, i) => <BalloonGrad key={i} id={`${uid}-m${i}`} c={c} />)}<NumberDefs uid={`${uid}m`} /></defs>
            <g transform="translate(0 714)"><Lawn w={400} h={130} seed={2} /></g>
            <Balloon id={`${uid}-m0`} c={BALLOON_COLORS[0]} x={48} y={752} len={150} tilt={-14} s={0.8} />
            <Balloon id={`${uid}-m3`} c={BALLOON_COLORS[3]} x={48} y={752} len={205} tilt={-1} s={0.76} />
            <Balloon id={`${uid}-m1`} c={BALLOON_COLORS[1]} x={48} y={752} len={120} tilt={13} s={0.7} />
            <Bear x={78} y={826} s={0.95} />
            <Balloon id={`${uid}-m2`} c={BALLOON_COLORS[2]} x={350} y={754} len={160} tilt={14} s={0.8} />
            <Balloon id={`${uid}-m4`} c={BALLOON_COLORS[4]} x={350} y={754} len={212} tilt={1} s={0.76} />
            <Balloon id={`${uid}-m5`} c={BALLOON_COLORS[5]} x={350} y={754} len={118} tilt={-13} s={0.7} />
            <Bunny x={320} y={826} s={0.95} />
            {p.age ? <NumberGlyph uid={`${uid}m`} n={p.age} x={214} y={782} s={0.62} /> : null}
            <Duck x={196} y={832} s={0.85} />
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <defs>{BALLOON_COLORS.map((c, i) => <BalloonGrad key={i} id={`${uid}-d${i}`} c={c} />)}<NumberDefs uid={uid} /></defs>
            <g opacity=".55">
              <Balloon id={`${uid}-d4`} c={BALLOON_COLORS[4]} x={420} y={430} len={60} s={0.38} cls="bp-drift" />
              <Balloon id={`${uid}-d2`} c={BALLOON_COLORS[2]} x={1010} y={520} len={60} s={0.32} cls="bp-drift" />
              <Balloon id={`${uid}-d1`} c={BALLOON_COLORS[1]} x={1100} y={260} len={60} s={0.26} cls="bp-drift" />
            </g>
            <g transform="translate(0 720)"><Lawn w={1440} h={180} seed={5} /></g>
            {[[-26, 300, 0], [-12, 380, 3], [2, 330, 1], [14, 250, 4], [-4, 210, 5]].map(([t, l, c], i) => (
              <Balloon key={i} id={`${uid}-d${c}`} c={BALLOON_COLORS[c]} x={186} y={780} len={l} tilt={t} s={1.05 - i * 0.04} />
            ))}
            <Bear x={225} y={880} s={1.35} />
            {[[24, 300, 2], [10, 390, 1], [-4, 330, 3], [-16, 250, 0], [4, 220, 5]].map(([t, l, c], i) => (
              <Balloon key={i} id={`${uid}-d${c}`} c={BALLOON_COLORS[c]} x={1254} y={782} len={l} tilt={t} s={1.05 - i * 0.04} />
            ))}
            <Bunny x={1214} y={880} s={1.35} />
            {p.age ? <NumberGlyph uid={uid} n={p.age} x={744} y={826} s={0.72} /> : null}
            <Duck x={720} y={884} s={1.1} />
            <Duck x={470} y={884} s={0.8} flip />
            <Bunny x={980} y={884} s={0.7} flip />
          </svg>
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      {/* ── FOOTER: the parade ── */}
      <footer className="relative mt-10 overflow-hidden">
        <div className="relative h-[200px]">
          {!compact && (
            <div className="bp-parade pointer-events-none absolute -bottom-[34px] left-0 w-[260px]" aria-hidden>
              <svg viewBox="-20 -240 300 250" className="w-full" style={{ overflow: "visible" }}>
                <defs>{BALLOON_COLORS.map((c, i) => <BalloonGrad key={i} id={`${uid}-f${i}`} c={c} />)}</defs>
                <g className="bp-walk"><Balloon id={`${uid}-f0`} c={BP.coral} x={30} y={-66} len={110} tilt={-6} s={0.6} /><Bear x={0} y={0} s={0.7} flip /></g>
                <g className="bp-walk"><Balloon id={`${uid}-f3`} c={BP.sky} x={122} y={-50} len={120} s={0.6} /><Duck x={100} y={0} s={0.7} /></g>
                <g className="bp-walk"><Balloon id={`${uid}-f1`} c={BP.butter} x={220} y={-60} len={100} tilt={6} s={0.6} /><Bunny x={198} y={0} s={0.7} /></g>
              </svg>
            </div>
          )}
        </div>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative -mt-[40px] block h-[90px] w-full" aria-hidden><Lawn w={1440} h={120} seed={9} /></svg>
        <div className="bg-[#9CC98A] px-6 pb-10 pt-4 text-center text-[#2f4a33]">
          <p className="text-[24px] font-semibold" style={{ fontFamily: "var(--w-display)" }}>{L.see}</p>
          <div className="mt-3 text-[13px] opacity-75">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.22} />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[var(--w-accent)]">{eyebrow}</p>
      {path ? (
        <E as="h2" path={path} className="mt-3 block text-[clamp(34px,6cqi,56px)] font-semibold leading-[1.02]" style={{ fontFamily: "var(--w-display)" }}>{title}</E>
      ) : (
        <h2 className="mt-3 text-[clamp(34px,6cqi,56px)] font-semibold leading-[1.02]" style={{ fontFamily: "var(--w-display)" }}>{title}</h2>
      )}
      <svg viewBox="0 0 160 14" className="mt-3 w-28" aria-hidden><path d="M2 8 Q 22 0 42 8 T 82 8 T 122 8 T 158 8" fill="none" stroke="var(--w-accent)" strokeWidth="3.5" strokeLinecap="round" /></svg>
    </div>
  );
}

function Ticket({ color, tilt, children }: { color: string; tilt: number; children: ReactNode }) {
  return (
    <div data-pop={tilt} className="relative" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="relative overflow-hidden rounded-[22px] px-8 py-8 text-center shadow-[0_24px_50px_-28px_rgba(47,58,86,.55)]" style={{ background: color }}>
        <div className="absolute inset-2 rounded-[16px] border-2 border-dashed border-white/70" />
        <span className="absolute -left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[var(--w-bg)]" />
        <span className="absolute -right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-[var(--w-bg)]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--w-accent)] px-6 py-3 text-[15px] font-bold text-white shadow-[0_12px_24px_-10px_var(--w-accent)] transition hover:-translate-y-0.5 active:translate-y-0">
      {children}
    </a>
  );
}

function MiniMap({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 520 380" className="block w-full" aria-hidden>
      <defs><BalloonGrad id={`${uid}-pin`} c={BP.coral} /></defs>
      <rect width="520" height="380" fill="#EAF3DC" />
      <path d="M-10 250 C120 210 180 300 300 260 S 470 200 540 230" fill="none" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
      <path d="M180 -10 C200 100 150 200 210 390" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" />
      <path d="M380 -10 C360 80 420 140 400 390" fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="90" cy="110" rx="70" ry="48" fill="#BFE0F0" />
      <path d="M40 112 q20 -8 40 0 t40 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      {[[300, 100], [460, 90], [100, 320], [470, 330], [270, 330]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}><circle r="22" fill="#A8D08E" /><circle cx="-12" cy="6" r="16" fill="#95C47D" /><circle cx="14" cy="8" r="14" fill="#B6DA9C" /></g>
      ))}
      <path d="M60 300 C120 290 180 240 230 250 S 300 190 300 160" fill="none" stroke={BP.ink} strokeOpacity=".5" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <Balloon id={`${uid}-pin`} c={BP.coral} x={300} y={168} len={46} s={0.62} />
      <ellipse cx="300" cy="170" rx="12" ry="4" fill={BP.ink} opacity=".15" />
      <circle cx="60" cy="300" r="7" fill={BP.ink} opacity=".55" />
    </svg>
  );
}
