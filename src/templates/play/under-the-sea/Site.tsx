"use client";
import { useId, useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, gsap, kl, mapUrl, media, orderedSections, popOnScroll, segments, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst } from "../_shared/fx";
import { Anemone, Coral, Fish, Kelp, Octopus, Puffer, Rays, Reef, Rock, SEA, Shell, Starfish, Turtle } from "./art";

export default function Site({ profile: p, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const uid = useId().replace(/[^a-z0-9]/gi, "");
  const editable = !!useEdit()?.editable;
  const L = kl(p);
  const days = useDaysToGo(p.date);
  const db = dateBits(p);
  const where = p.venue || p.city;
  const name = p.partner1 || "";
  const segs = segments(name, editable);
  useLenis(!compact);

  useAnim(root, ({ reduce }) => {
    if (reduce) return;
    // ambient reef life
    gsap.utils.toArray<SVGGElement>(".us-kelp").forEach((k, i) => gsap.to(k, { rotate: i % 2 ? 5 : -5, skewX: i % 2 ? 3 : -3, duration: 3 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%", delay: -i }));
    gsap.utils.toArray<SVGGElement>(".us-tail").forEach((t, i) => gsap.to(t, { scaleY: 0.7, rotate: 8, duration: 0.28 + (i % 3) * 0.05, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "100% 50%" }));
    gsap.utils.toArray<SVGGElement>(".us-anem").forEach((a, i) => gsap.to(a, { rotate: 6, duration: 2 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" }));
    gsap.utils.toArray<SVGGElement>(".us-ray").forEach((r, i) => gsap.to(r, { opacity: 0.06, duration: 3 + i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: -i }));
    gsap.to(".us-arm-l", { rotate: -12, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "100% 100%" });
    gsap.to(".us-arm-r", { rotate: 14, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "0% 100%" });
    gsap.to(".us-octo-peek", { y: 14, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(".us-puffer", { y: -10, rotate: 4, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.utils.toArray<SVGGElement>(".us-swim").forEach((f, i) => gsap.to(f, { y: i % 2 ? 12 : -12, duration: 2 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    gsap.utils.toArray<SVGGElement>(".us-cruise").forEach((f, i) => gsap.fromTo(f, { x: -500 }, { x: 1900, duration: 34 + i * 10, ease: "none", repeat: -1, delay: -i * 14 }));
    gsap.to(".us-flip-f", { rotate: -16, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "0% 0%" });
    // rising bubbles
    gsap.utils.toArray<HTMLElement>(".us-bub").forEach((b, i) => {
      gsap.fromTo(b, { y: 0, x: 0, autoAlpha: 0 }, { y: () => -(hero.current?.offsetHeight ?? 800) * (0.7 + (i % 4) * 0.1), autoAlpha: 1, duration: 7 + (i % 5) * 1.6, ease: "none", repeat: -1, delay: (i * 0.73) % 7 });
      gsap.to(b, { x: i % 2 ? 14 : -14, duration: 1.4 + (i % 3) * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
    // the signature: every letter bubbles up from the reef and pops into place
    if (!compact) {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from(".us-scene", { y: 60, autoAlpha: 0, duration: 1.4, ease: "power2.out" })
        .from(".us-name .ch", { y: () => (hero.current?.offsetHeight ?? 800) * 0.75, x: () => gsap.utils.random(-50, 50), scale: 0.6, duration: 2.4, ease: "power2.out", stagger: 0.16 }, 0.2)
        .set(".us-lb", { autoAlpha: 1 }, 0.2)
        .to(".us-lb", { scale: 1.6, autoAlpha: 0, duration: 0.35, ease: "power2.out", stagger: 0.16 }, 2.5)
        .from(".us-up", { y: 20, autoAlpha: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.1 }, 2.6);
      gsap.to(".us-deep", { yPercent: 12, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  const tap = (e: React.MouseEvent) => {
    if (!hero.current) return;
    const r = hero.current.getBoundingClientRect();
    const fish = (e.target as Element).closest(".us-fish, .us-puffer");
    if (fish && !gsap.isTweening(fish)) {
      if (fish.classList.contains("us-puffer")) gsap.timeline().to(fish, { scale: 1.45, duration: 0.25, ease: "back.out(3)", transformOrigin: "50% 50%" }).to(fish, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.4)", delay: 0.6 });
      else gsap.timeline().to(fish, { x: 90, scaleX: 0.85, duration: 0.25, ease: "power3.out" }).to(fish, { scaleX: 1, duration: 0.2 }).to(fish, { x: 0, duration: 2.2, ease: "sine.inOut" });
    }
    burst(hero.current, e.clientX - r.left, e.clientY - r.top, { colors: ["#ffffff", SEA.aqua, "#d9f7ff"], count: 14, shapes: ["bubble"], velocity: [60, 160], gravity: -260, size: 16, spread: 140, up: true, duration: 2 });
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <svg viewBox="-70 -30 140 60" className="mx-auto mb-6 w-24" aria-hidden><Fish x={0} y={0} s={0.55} c={SEA.orange} /></svg>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(26px,5cqi,44px)] font-semibold leading-[1.28] text-[var(--w-foam)]" style={{ fontFamily: "var(--w-display)" }}>
            {p.inviteLine || occasionInvite(p)}
          </E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <Porthole uid={`${uid}st`} className="mx-auto w-[min(76cqi,360px)]" pop="-3">
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <svg data-edit-photo="hero" viewBox="-100 -100 200 200" className="h-full w-full" style={{ background: SEA.shallow }}><Turtle x={-10} y={0} s={1.2} /></svg>
            )}
          </Porthole>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[19px] leading-[1.75] text-[var(--w-foam)]/85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Dive in with us", ru: "Ныряй к нам", hi: "हमारे साथ गोता लगाइए" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Glass pop="-2" icon={<Starfish s={1.3} r={-12} />}>
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[var(--w-aqua)]">{L.when}</p>
              <p className="mt-2 text-[38px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-2 text-[15px] opacity-75">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Glass>
          )}
          {where && (
            <Glass pop="2" icon={<Shell s={1.4} r={8} />}>
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[var(--w-aqua)]">{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[34px] font-bold leading-[1.05]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[15px] opacity-75">{p.city}</p>}
            </Glass>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5" data-pop>
          {days !== null && days > 0 && (
            <span className="relative grid h-[124px] w-[124px] place-items-center rounded-full text-center" style={{ background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.55), rgba(255,255,255,.08) 45%, rgba(159,227,218,.18) 70%, rgba(255,255,255,.45) 100%)", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.55)" }}>
              <span>
                <span className="block text-[36px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{days}</span>
                <span className="mt-1 block px-3 text-[10px] font-bold uppercase leading-tight tracking-[0.14em] opacity-80">{L.until}</span>
              </span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} />
        <div className="relative mx-auto mt-14 max-w-xl">
          <div className="absolute bottom-0 left-[38px] top-0 w-[3px] rounded-full" style={{ background: "repeating-linear-gradient(180deg, rgba(255,255,255,.55) 0 8px, transparent 8px 18px)" }} />
          {p.events!.map((e, i) => (
            <div key={i} className="relative mb-10 flex items-start gap-6" data-pop>
              <div className="relative z-10 grid h-[78px] w-[78px] shrink-0 place-items-center rounded-full text-center" style={{ background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.7), rgba(159,227,218,.25) 55%, rgba(255,255,255,.4))", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.6)" }}>
                <span className="text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-[var(--w-ink)]">{e.time || `${(i + 1) * 5} m`}</span>
              </div>
              <div className="pt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--w-aqua)]">{tr(p, { en: "Depth", ru: "Глубина", hi: "गहराई" })} {(i + 1) * 5} m</p>
                <h3 className="mt-1 text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
                <p className="mt-1 text-[15px] opacity-75">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          ))}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <Porthole uid={`${uid}vn`} className="mx-auto w-[min(80cqi,380px)]" pop="3">
            <IslandMap />
          </Porthole>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-75">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Treasures from the deep", ru: "Сокровища глубин", hi: "गहराई के ख़ज़ाने" })} />
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-6 @3xl:grid-cols-3">
          {design!.gallery!.map((k, i) => (
            <Porthole key={k} uid={`${uid}g${i}`} className={i % 2 ? "translate-y-6" : ""} pop={String(i % 2 ? 3 : -3)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
            </Porthole>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-32">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-80 -70 160 90" className="us-octo-peek absolute -top-[92px] left-1/2 w-[190px] -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}><Octopus s={0.9} /></svg>
          <div className="relative rounded-[36px] px-6 py-12 ring-1 ring-white/25 @xl:px-12" style={{ background: "linear-gradient(180deg, rgba(236,251,248,.96), rgba(214,244,239,.94))", color: SEA.ink, boxShadow: "0 40px 90px -40px rgba(0,0,0,.6)" }}>
            <Heading eyebrow="RSVP" title={L.rsvp} dark />
            <p className="mx-auto mt-4 max-w-md text-center text-[17px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <Glass pop="0" className="mx-auto max-w-2xl" icon={<Shell s={1.2} c="#F2D3E4" />}>
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--w-aqua)]">{L.info}</p>
          <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[18px] leading-relaxed">{design!.texts!.body!}</E>
        </Glass>
      </Sec>
    ),
  };

  const bubbles = Array.from({ length: compact ? 0 : 18 }, (_, i) => ({ left: `${(i * 37 + 7) % 96}%`, size: 6 + ((i * 7) % 18) }));

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-foam)]`}
      style={{ ...worldVars(design, { bg: SEA.deep, ink: SEA.ink, accent: SEA.coral, foam: SEA.foam, aqua: SEA.aqua, display: STACKS.sea.display, body: STACKS.sea.body }), fontFamily: "var(--w-body)", background: `linear-gradient(180deg, #3A9DB0 0%, #2A7F98 18%, #1D5F7E 50%, var(--w-bg) 100%)` }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.6) 1px, transparent 1.4px), radial-gradient(rgba(159,227,218,.5) 1.2px, transparent 1.6px)", backgroundSize: "120px 140px, 170px 190px", backgroundPosition: "0 0, 50px 70px" }} />

      {/* ── HERO ── */}
      <header ref={hero} onClick={tap} className="relative isolate overflow-hidden" style={{ height: compact ? 760 : "max(100svh, 680px)", background: "linear-gradient(180deg, #D6F6F0 0%, #A6E4DD 30%, #63BDC6 70%, #3A9DB0 100%)" }}>
        <svg viewBox="0 0 1000 800" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full" style={{ WebkitMaskImage: "linear-gradient(#000, transparent 85%)", maskImage: "linear-gradient(#000, transparent 85%)" }} aria-hidden><Rays id={`${uid}-ray`} w={1000} h={800} n={7} /></svg>
        <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[38px] w-full" aria-hidden>
          <path d="M0 0 H1000 V18 C 940 30 880 8 820 20 S 700 30 640 18 S 520 6 460 20 S 340 32 280 18 S 160 6 100 20 S 30 28 0 18Z" fill="#fff" opacity=".55" />
        </svg>
        <div className="us-scene us-deep absolute inset-0">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <g className="us-cruise" opacity=".5"><g className="us-swim"><Turtle x={0} y={430} s={0.55} /></g></g>
            <Kelp x={22} y={844} h={330} s={0.9} /><Kelp x={58} y={850} h={230} s={0.8} c="#5FAE8C" flip />
            <Kelp x={372} y={846} h={300} s={0.9} flip /><Kelp x={340} y={850} h={190} s={0.8} c="#3F8A6E" />
            <g className="us-swim"><Fish x={310} y={548} s={0.6} c={SEA.orange} flip /></g>
            <g className="us-swim"><Puffer x={86} y={600} s={0.55} /></g>
            <g className="us-swim"><Fish x={250} y={640} s={0.42} c={SEA.lilac} stripes={false} /></g>
            <g transform="translate(0 714)"><Reef w={400} h={130} seed={3} /></g>
            <Coral x={110} y={770} s={0.7} c={SEA.coral} /><Anemone x={300} y={772} s={0.8} />
            <g className="us-octo-peek"><Octopus x={350} y={752} s={0.6} /></g>
            <Rock x={360} y={812} s={0.62} />
            <Starfish x={200} y={808} s={0.9} r={14} /><Shell x={60} y={812} s={0.8} r={-12} /><Shell x={250} y={822} s={0.6} r={10} c="#F2D3E4" />
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <g className="us-cruise" opacity=".55"><g className="us-swim"><Turtle x={0} y={260} s={0.8} /></g></g>
            <g className="us-cruise" opacity=".6"><Fish x={-120} y={520} s={0.3} c={SEA.yellow} stripes={false} /><Fish x={-80} y={545} s={0.26} c={SEA.yellow} stripes={false} /><Fish x={-150} y={560} s={0.28} c={SEA.yellow} stripes={false} /></g>
            <Kelp x={60} y={900} h={560} s={1} /><Kelp x={120} y={905} h={420} c="#5FAE8C" flip /><Kelp x={200} y={905} h={300} c="#3F8A6E" />
            <Kelp x={1380} y={900} h={540} flip /><Kelp x={1320} y={905} h={380} c="#5FAE8C" /><Kelp x={1250} y={905} h={260} c="#3F8A6E" flip />
            <g className="us-swim"><Fish x={1120} y={470} s={0.95} c={SEA.orange} flip /></g>
            <g className="us-swim"><Puffer x={300} y={520} s={0.85} /></g>
            <g className="us-swim"><Fish x={1000} y={640} s={0.6} c={SEA.lilac} stripes={false} flip /></g>
            <g className="us-swim"><Fish x={420} y={690} s={0.5} c={SEA.pink} stripes={false} /></g>
            <g transform="translate(0 730)"><Reef w={1440} h={170} seed={8} /></g>
            <Coral x={330} y={800} s={1.1} c={SEA.coral} /><Coral x={1060} y={805} s={0.9} c="#F4B860" /><Anemone x={500} y={808} s={1.1} /><Anemone x={880} y={812} s={0.9} c={SEA.lilac} />
            <g className="us-octo-peek"><Octopus x={1180} y={742} s={0.95} /></g>
            <Rock x={1190} y={840} s={1} />
            <Starfish x={720} y={850} s={1.2} r={14} /><Shell x={600} y={862} s={1.1} r={-12} /><Shell x={960} y={868} s={0.9} r={10} c="#F2D3E4" /><Starfish x={230} y={870} s={0.8} r={-20} c="#F6CF6B" />
          </svg>
        </div>
        {bubbles.map((b, i) => <span key={i} className="us-bub pointer-events-none absolute bottom-[8%] rounded-full" style={{ left: b.left, width: b.size, height: b.size, opacity: 0, boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.75), inset -3px -3px 0 rgba(255,255,255,.25)" }} />)}

        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-6 pt-[clamp(80px,13svh,140px)] text-center" style={{ color: SEA.ink }}>
          <p className="us-up rounded-full bg-white/60 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
          <E as="h1" path="profile.partner1" className="us-name mt-4 block font-bold leading-[0.95] tracking-[-0.01em]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(60px, ${Math.min(30, 110 / Math.max(3, [...name].length))}cqi, 190px)`, color: SEA.ink, textShadow: "0 3px 0 rgba(255,255,255,.55)" }}>
            {segs
              ? segs.map((c, i) => (
                  <span key={i} className="ch relative inline-block" style={{ whiteSpace: "pre" }}>
                    {c}
                    {c.trim() && <span className="us-lb pointer-events-none absolute left-1/2 top-1/2 h-[1.05em] w-[1.05em] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ opacity: 0, boxShadow: "inset 0 0 0 2px rgba(255,255,255,.85), inset -6px -6px 0 rgba(255,255,255,.2)" }} />}
                  </span>
                ))
              : name}
          </E>
          <p className="us-up mt-3 text-[clamp(18px,3cqi,26px)] font-semibold" style={{ fontFamily: "var(--w-display)", color: "#C8553D" }}>{occasionLine(p)}</p>
          <p className="us-up mt-3 rounded-full bg-white/55 px-5 py-2 text-[15px] font-semibold backdrop-blur-sm">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
          {!compact && <p className="us-up mt-5 text-[12px] font-bold uppercase tracking-[0.22em] opacity-50">{tr(p, { en: "tap the fish", ru: "коснись рыбки", hi: "मछली को छुओ" })}</p>}
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10">
        <svg viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice" className="block h-[160px] w-full" aria-hidden>
          <g transform="translate(0 40)"><Reef w={1440} h={160} seed={4} /></g>
          <Coral x={200} y={120} s={0.8} /><Anemone x={420} y={126} s={0.9} c={SEA.lilac} /><Coral x={1180} y={124} s={0.7} c="#F4B860" /><Anemone x={980} y={128} s={0.8} />
          <Starfish x={720} y={150} s={1} r={10} /><Shell x={560} y={160} s={0.9} />
        </svg>
        <div className="px-6 pb-10 pt-2 text-center" style={{ background: SEA.sand, color: SEA.ink }}>
          <p className="text-[24px] font-bold" style={{ fontFamily: "var(--w-display)" }}>{tr(p, { en: "See you under the sea!", ru: "До встречи под водой!", hi: "समंदर में मिलते हैं!" })}</p>
          <div className="mt-3 text-[13px] opacity-75">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.18} blend="overlay" />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path, dark }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string; dark?: boolean }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-3 block text-[clamp(32px,5.6cqi,54px)] font-bold leading-[1.04]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-bold uppercase tracking-[0.3em]" style={{ color: dark ? "#C8553D" : SEA.aqua }}>{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <svg viewBox="0 0 200 16" className="mt-3 w-32" aria-hidden><path d="M2 9 C 18 1 34 1 50 9 S 82 17 98 9 S 130 1 146 9 S 182 17 198 9" fill="none" stroke={dark ? "#C8553D" : SEA.aqua} strokeWidth="3" strokeLinecap="round" /></svg>
    </div>
  );
}

function Glass({ children, icon, pop, className = "" }: { children: ReactNode; icon?: ReactNode; pop: string; className?: string }) {
  return (
    <div data-pop={pop} className={`relative rounded-[28px] px-8 pb-8 pt-12 text-center ring-1 ring-white/25 ${className}`} style={{ background: "linear-gradient(160deg, rgba(255,255,255,.18), rgba(255,255,255,.06))", boxShadow: "0 30px 60px -36px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.3)" }}>
      {icon && <svg viewBox="-30 -30 60 60" className="absolute -top-8 left-1/2 w-16 -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}>{icon}</svg>}
      {children}
    </div>
  );
}

function Porthole({ uid, children, className = "", pop }: { uid: string; children: ReactNode; className?: string; pop?: string }) {
  return (
    <div data-pop={pop} className={`relative aspect-square ${className}`}>
      <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 210deg, #F3D9A0, #B8873C, #F6E2B0, #9C6E2E, #E9C77F, #B8873C, #F3D9A0)", boxShadow: "0 30px 60px -28px rgba(0,0,0,.6)" }} />
      <div className="absolute inset-[7%] overflow-hidden rounded-full" style={{ boxShadow: "inset 0 0 0 4px rgba(90,60,20,.35)" }}>
        {children}
        <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "linear-gradient(140deg, rgba(255,255,255,.4), transparent 38%), radial-gradient(circle at 50% 50%, transparent 60%, rgba(14,53,80,.35))" }} />
      </div>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <span key={`${uid}${i}`} className="absolute h-[4.2%] w-[4.2%] rounded-full" style={{ left: `${(50 + Math.cos(a) * 46.5 - 2.1).toFixed(2)}%`, top: `${(50 + Math.sin(a) * 46.5 - 2.1).toFixed(2)}%`, background: "radial-gradient(circle at 35% 35%, #FFF1C9, #9C6E2E)" }} />;
      })}
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold shadow-[0_12px_30px_-12px_rgba(0,0,0,.5)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)", color: "#fff" }}>
      {children}
    </a>
  );
}

function IslandMap() {
  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" aria-hidden>
      <rect width="300" height="300" fill="#7FD3D0" />
      {[60, 110, 220, 260].map((y, i) => <path key={i} d={`M${20 + i * 30} ${y} q12 -8 24 0 t24 0`} fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />)}
      <path d="M70 170 C60 120 120 90 170 100 C230 110 250 160 220 200 C190 240 100 230 70 170Z" fill="#F3DDB0" stroke="#E2C48C" strokeWidth="4" />
      <path d="M90 168 C100 140 140 126 170 132 C200 140 210 170 190 190 C160 210 110 200 90 168Z" fill="#A8D08E" />
      <path d="M130 150 C126 130 128 116 132 100" stroke="#8B6239" strokeWidth="5" fill="none" strokeLinecap="round" />
      {[-60, -20, 20, 60, 100].map((a) => <path key={a} d={`M132 100 q ${(Math.cos((a * Math.PI) / 180) * 14).toFixed(1)} ${(-10 + Math.sin((a * Math.PI) / 180) * 6).toFixed(1)} ${(Math.cos((a * Math.PI) / 180) * 26).toFixed(1)} ${(Math.sin((a * Math.PI) / 180) * 14).toFixed(1)}`} stroke="#4E9C7E" strokeWidth="7" fill="none" strokeLinecap="round" />)}
      <path d="M70 250 C110 230 140 230 165 200" fill="none" stroke="#123B4A" strokeOpacity=".55" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
      <path d="M156 186 l18 18 M174 186 l-18 18" stroke="#F08A6A" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 250 l16 -4 l-2 -12 z" fill="#fff" />
      <path d="M40 254 C46 262 72 262 78 254Z" fill="#C8553D" />
    </svg>
  );
}
