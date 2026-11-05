"use client";
import { useId, useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E, useEdit } from "@/components/designs/Editable";
import { occasionInvite, occasionLine } from "@/lib/occasions";
import type { SectionId } from "@/lib/templates";
import { STACKS } from "../_shared/fonts";
import { Grain, Sec, ScrollTrigger, aboutTitle, dateBits, fmtDate, fontClass, glyphs, gsap, kl, mapUrl, media, orderedSections, popOnScroll, tr, useAnim, useDaysToGo, useLenis, worldVars } from "../_shared/kit";
import { burst, centerIn } from "../_shared/fx";
import { Basket, Blanket, Grass, Kite, Marigold, PC, Squirrel, Sun, Toran, Tree } from "./art";

const PETALS = [PC.marigold, PC.saffron, PC.flame, "#FFD27A"];

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
    gsap.to(".pc-rays", { rotate: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
    gsap.utils.toArray<SVGGElement>(".pc-kite").forEach((k, i) => {
      gsap.to(k, { rotate: i % 2 ? 7 : -7, y: i % 2 ? 10 : -12, x: i % 2 ? -8 : 8, duration: 2.2 + i * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 60%" });
    });
    gsap.utils.toArray<SVGPathElement>(".pc-tail").forEach((t, i) => gsap.to(t, { skewX: 14, duration: 0.7 + i * 0.1, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
    gsap.utils.toArray<SVGGElement>(".pc-drop").forEach((d, i) => gsap.to(d, { rotate: i % 2 ? 5 : -5, duration: 1.8 + (i % 4) * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
    gsap.to(".pc-canopy", { rotate: 1.4, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 100%" });
    gsap.to(".pc-tailq", { rotate: 8, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "90% 90%" });
    gsap.to(".pc-sun", { scale: 1.04, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" });
    if (!compact) {
      // the signature: kites swoop up on their strings, then the name pops in under a shower of marigold petals
      const tl = gsap.timeline({ delay: 0.25 });
      tl.from(".pc-fly", { x: () => gsap.utils.random(-160, 160), y: 520, rotate: () => gsap.utils.random(-60, 60), duration: 2.4, ease: "power3.out", stagger: 0.25 })
        .fromTo(".pc-string", { drawSVG: "0%" }, { drawSVG: "100%", duration: 2.2, ease: "power2.out", stagger: 0.25 }, 0.2)
        .from(".pc-sunrise", { y: 160, rotate: -40, duration: 1.8, ease: "back.out(1.4)" }, 0)
        .from(".pc-name .ch", { y: 50, scale: 0.3, autoAlpha: 0, rotate: () => gsap.utils.random(-25, 25), duration: 1, ease: "back.out(2.6)", stagger: 0.07 }, 1.2)
        .from(".pc-text [data-up]", { y: 18, autoAlpha: 0, duration: 0.7, ease: "back.out(2)", stagger: 0.08 }, 1.5)
        .call(() => {
          const h = hero.current;
          if (!h) return;
          for (let i = 0; i < 5; i++) burst(h, (h.offsetWidth * (i + 0.5)) / 5, -10, { colors: PETALS, shapes: ["dot", "rect"], count: 10, velocity: [40, 140], gravity: 260, size: 11, spread: 120, duration: 3.2 });
        }, [], 1.3);
      gsap.to(".pc-par", { yPercent: 8, ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
    }
    popOnScroll(compact, reduce);
    return () => ScrollTrigger.getAll().forEach((s) => s.kill());
  }, [compact]);

  const tap = (e: React.MouseEvent) => {
    const host = hero.current;
    if (!host) return;
    const kite = (e.target as Element).closest(".pc-loop");
    const sun = (e.target as Element).closest(".pc-sun");
    if (kite && !gsap.isTweening(kite)) {
      gsap.timeline().to(kite, { rotate: "+=360", y: "+=60", duration: 1.1, ease: "power2.inOut", transformOrigin: "50% 50%" }).to(kite, { y: "-=60", duration: 0.8, ease: "back.out(2)" }, 0.6);
    } else if (sun) {
      gsap.fromTo(".pc-rays", { rotate: 0 }, { rotate: 180, duration: 1.2, ease: "power3.out", transformOrigin: "50% 50%" });
      const c = centerIn(host, sun);
      burst(host, c.x, c.y, { colors: PETALS, count: 24, shapes: ["dot", "rect"], velocity: [140, 360], gravity: 380, size: 11 });
    }
  };

  const sections: Partial<Record<SectionId, ReactNode>> = {
    invitation: (
      <Sec id="invitation" className="px-6 py-20 @3xl:py-28">
        <div className="mx-auto max-w-3xl text-center" data-pop>
          <svg viewBox="-80 -20 160 40" className="mx-auto mb-6 w-32" aria-hidden>{[-50, -25, 0, 25, 50].map((x, i) => <Marigold key={x} x={x} y={0} s={0.9} c={i % 2 ? PC.saffron : PC.marigold} />)}</svg>
          <E as="p" multiline path="profile.inviteLine" className="block text-[clamp(26px,5cqi,44px)] font-semibold leading-[1.3]" style={{ fontFamily: "var(--w-display)" }}>{p.inviteLine || occasionInvite(p)}</E>
        </div>
      </Sec>
    ),
    story: (p.story || heroUrl) && (
      <Sec id="story" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <Polaroid tilt={-4} className="mx-auto w-[min(76cqi,340px)]" caption={p.partner1}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <svg data-edit-photo="hero" viewBox="-120 -150 240 240" className="h-full w-full" style={{ background: PC.sky }}><Sun x={60} y={-90} s={0.4} /><Kite x={-40} y={-60} s={0.6} r={-14} /></svg>
            )}
          </Polaroid>
          <div data-pop>
            <Heading eyebrow={L.about} title={aboutTitle(p)} align="left" />
            {p.story && <E as="p" multiline path="profile.story" className="mt-6 block whitespace-pre-line text-[19px] leading-[1.75] opacity-85">{p.story}</E>}
          </div>
        </div>
      </Sec>
    ),
    details: (p.date || where) && (
      <Sec id="details" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.party} title={tr(p, { en: "Pack a hat, come play!", ru: "Бери панамку — и к нам!", hi: "टोपी पहनो, खेलने आओ!" })} />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 @2xl:grid-cols-2">
          {p.date && (
            <Tag tilt={-2} color={PC.marigold}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em] opacity-70">{L.when}</p>
              <p className="mt-2 text-[42px] font-bold leading-none" style={{ fontFamily: "var(--w-display)" }}>{db ? `${db.day} ${db.month}` : fmtDate(p)}</p>
              <p className="mt-2 text-[15px] opacity-75">{[db?.weekday, p.events?.[0]?.time].filter(Boolean).join(" · ")}</p>
            </Tag>
          )}
          {where && (
            <Tag tilt={2} color={PC.teal}>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.28em] opacity-70">{L.where}</p>
              <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="mt-2 block text-[36px] font-bold leading-[1.05]" style={{ fontFamily: "var(--w-display)" }}>{where}</E>
              {p.venue && p.city && <p className="mt-2 text-[15px] opacity-75">{p.city}</p>}
            </Tag>
          )}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4" data-pop>
          {days !== null && days > 0 && (
            <span className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_10px_30px_-14px_rgba(74,35,16,.4)]">
              <svg viewBox="-70 -70 140 140" className="h-8 w-8" aria-hidden><Sun s={0.55} /></svg>
              <span className="text-[28px] font-bold leading-none" style={{ fontFamily: "var(--w-display)", color: PC.flame }}>{days}</span>
              <span className="text-[13px] font-bold uppercase tracking-[0.2em] opacity-65">{L.until}</span>
            </span>
          )}
          {calendarUrl && <Pill href={calendarUrl}>{L.calendar}</Pill>}
        </div>
      </Sec>
    ),
    schedule: !!p.events?.length && (
      <Sec id="schedule" className="px-6 py-16 @3xl:py-24">
        <Heading eyebrow={L.program} title={L.plan} />
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 @3xl:grid-cols-3">
          {p.events!.map((e, i) => {
            const pair = [[PC.flame, PC.marigold], [PC.teal, PC.pink], [PC.violet, PC.marigold]][i % 3];
            return (
              <div key={i} className="relative rounded-[24px] bg-white px-7 pb-8 pt-[92px] text-center shadow-[0_24px_50px_-30px_rgba(74,35,16,.5)]" data-pop={i % 2 ? 2 : -2}>
                <svg viewBox="-60 -70 120 140" className="absolute -top-14 left-1/2 w-[74px] -translate-x-1/2" aria-hidden style={{ overflow: "visible" }}><Kite s={0.7} r={i % 2 ? 12 : -12} a={pair[0]} b={pair[1]} /></svg>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ color: pair[0] }}>{e.time || String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-[28px] font-bold leading-tight" style={{ fontFamily: "var(--w-display)" }}>{e.name}</h3>
                <p className="mt-2 text-[15px] opacity-70">{[fmtDate(p, e.date), e.venue].filter(Boolean).join(" · ")}</p>
              </div>
            );
          })}
        </div>
      </Sec>
    ),
    venue: where && (
      <Sec id="venue" className="px-6 py-16 @3xl:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 @3xl:grid-cols-2">
          <div data-pop="-2" className="overflow-hidden rounded-[30px] shadow-[0_30px_60px_-34px_rgba(74,35,16,.5)]"><ParkMap uid={uid} /></div>
          <div className="text-center @3xl:text-left" data-pop>
            <Heading eyebrow={L.where} title={where} align="left" path={p.venue ? "profile.venue" : "profile.city"} />
            {p.venue && p.city && <p className="mt-3 text-[18px] opacity-70">{p.city}</p>}
            <div className="mt-8"><Pill href={mapUrl(p)} target="_blank">{L.directions} →</Pill></div>
          </div>
        </div>
      </Sec>
    ),
    gallery: !!design?.gallery?.length && (
      <Sec id="gallery" className="py-16 @3xl:py-24">
        <Heading eyebrow={L.gallery} title={tr(p, { en: "Sunny snapshots", ru: "Солнечные снимки", hi: "धूप भरी तस्वीरें" })} />
        <div className="relative mx-auto mt-12 max-w-6xl px-6 py-10" style={{ backgroundImage: `linear-gradient(90deg, rgba(210,69,43,.14) 50%, transparent 50%), linear-gradient(rgba(210,69,43,.14) 50%, transparent 50%)`, backgroundSize: "36px 36px" }}>
          <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-4">
            {design!.gallery!.map((k, i) => (
              <Polaroid key={k} tilt={[-4, 3, -2, 4][i % 4]}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </Polaroid>
            ))}
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="px-5 pb-20 pt-28">
        <div className="relative mx-auto max-w-2xl" data-pop>
          <svg viewBox="-60 -100 120 100" className="absolute -top-[78px] right-[10%] w-[96px]" aria-hidden style={{ overflow: "visible" }}><Squirrel s={1} flip /></svg>
          <div className="relative rounded-[34px] bg-white px-6 py-12 shadow-[0_40px_80px_-40px_rgba(74,35,16,.5)] @xl:px-12">
            <div className="absolute inset-x-0 top-0 h-4 rounded-t-[34px]" style={{ backgroundImage: `linear-gradient(90deg, ${PC.flame} 50%, #fff 50%)`, backgroundSize: "24px 100%", opacity: 0.6 }} />
            <Heading eyebrow="RSVP" title={L.rsvp} />
            <p className="mx-auto mt-4 max-w-md text-center text-[17px] opacity-70">{L.rsvpSub}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: !!design?.texts?.body && (
      <Sec id="info" className="px-6 py-14">
        <div className="mx-auto max-w-2xl" data-pop>
          <Tag tilt={0} color={PC.marigold}>
            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] opacity-70">{L.info}</p>
            <E as="p" multiline path="texts.body" className="mt-4 block whitespace-pre-line text-[18px] leading-relaxed">{design!.texts!.body!}</E>
          </Tag>
        </div>
      </Sec>
    ),
  };

  const name = p.partner1 || "";
  const big = Math.min(26, 110 / Math.max(3, [...name].length));

  return (
    <div
      ref={root}
      className={`${fontClass} @container relative overflow-hidden text-[var(--w-ink)]`}
      style={{ ...worldVars(design, { bg: PC.cream, ink: PC.ink, accent: PC.flame, display: STACKS.picnic.display, body: STACKS.picnic.body }), fontFamily: "var(--w-body)", background: "var(--w-bg)" }}
    >
      <header ref={hero} onClick={tap} className="relative isolate overflow-hidden" style={{ height: compact ? 780 : "max(100svh, 700px)", background: `linear-gradient(180deg, ${PC.sky} 0%, #DDF1EE 40%, #FFF3DA 75%)` }}>
        <div className="pc-par absolute inset-0">
          <svg viewBox="0 0 400 844" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full @3xl:hidden" aria-hidden>
            <g className="pc-sunrise"><Sun x={318} y={150} s={0.5} /></g>
            <path className="pc-string" d="M84 280 C120 480 170 640 200 860" fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.2" />
            <path className="pc-string" d="M296 356 C280 520 230 700 200 860" fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.2" />
            <g className="pc-fly"><g className="pc-loop"><Kite x={84} y={236} s={0.62} r={-12} /></g></g>
            <g className="pc-fly"><g className="pc-loop"><Kite x={296} y={330} s={0.42} r={14} a={PC.teal} b={PC.pink} /></g></g>
            <g transform="translate(0 690)"><Grass w={400} h={154} /></g>
            <Tree x={28} y={760} s={0.62} /><Tree x={380} y={770} s={0.55} />
            <Blanket id={`${uid}-mb`} x={200} y={790} s={0.62} />
            <Basket x={240} y={790} s={0.62} />
            <Squirrel x={140} y={800} s={0.62} />
          </svg>
          <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 hidden h-full w-full @3xl:block" aria-hidden>
            <g className="pc-sunrise"><Sun x={1250} y={200} s={0.85} /></g>
            <path className="pc-string" d="M230 300 C320 520 560 720 720 930" fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.4" />
            <path className="pc-string" d="M1120 380 C1060 560 860 760 720 930" fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.4" />
            <path className="pc-string" d="M960 590 C900 720 800 830 720 930" fill="none" stroke={PC.ink} strokeOpacity=".35" strokeWidth="1.4" />
            <g className="pc-fly"><g className="pc-loop"><Kite x={230} y={250} s={0.85} r={-14} /></g></g>
            <g className="pc-fly"><g className="pc-loop"><Kite x={1120} y={340} s={0.62} r={16} a={PC.teal} b={PC.pink} /></g></g>
            <g className="pc-fly"><g className="pc-loop"><Kite x={960} y={560} s={0.4} r={8} a={PC.violet} b={PC.marigold} /></g></g>
            <g transform="translate(0 700)"><Grass w={1440} h={200} /></g>
            <Tree x={110} y={790} s={1.25} /><Tree x={1330} y={800} s={1.15} /><Tree x={1460} y={760} s={0.8} flowers={false} />
            <Blanket id={`${uid}-db`} x={720} y={820} s={1.15} />
            <Basket x={810} y={815} s={1} />
            <Squirrel x={560} y={830} s={1} />
          </svg>
        </div>
        <svg viewBox="0 0 1000 120" preserveAspectRatio="xMidYMin slice" className="absolute inset-x-0 top-0 z-10 h-[86px] w-full @3xl:h-[120px]" aria-hidden><Toran w={1000} sag={30} n={20} y={-4} /></svg>

        <div className="pc-text relative z-20 mx-auto flex max-w-3xl flex-col items-center px-6 pt-[clamp(120px,40svh,330px)] text-center @3xl:pt-[clamp(140px,19svh,190px)]">
          <p data-up className="rounded-full bg-white/80 px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ color: PC.flame }}>{design?.texts?.eyebrow ? <E path="texts.eyebrow">{design.texts.eyebrow}</E> : L.invited}</p>
          <E as="h1" path="profile.partner1" className="pc-name mt-3 block font-extrabold leading-[0.95]" style={{ fontFamily: "var(--w-display)", fontSize: `clamp(60px, ${big}cqi, 180px)`, color: PC.ink, textShadow: `0 4px 0 ${PC.marigold}` }}>{glyphs(name, editable)}</E>
          <p data-up className="mt-3 text-[clamp(19px,3cqi,27px)] font-bold" style={{ fontFamily: "var(--w-display)", color: PC.flame }}>{occasionLine(p)}</p>
          <p data-up className="mt-3 rounded-full bg-white/75 px-5 py-2 text-[15px] font-semibold">{[fmtDate(p), where].filter(Boolean).join("  ·  ")}</p>
          {!compact && <p data-up className="mt-4 text-[11px] font-bold uppercase tracking-[0.24em] opacity-45">{tr(p, { en: "tap a kite or the sun", ru: "коснись змея или солнца", hi: "पतंग या सूरज को छुओ" })}</p>}
        </div>
      </header>

      {orderedSections(design).map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="relative mt-10 overflow-hidden">
        <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" className="block h-[170px] w-full" aria-hidden>
          <g transform="translate(0 60)"><Grass w={1440} h={160} /></g>
          <Tree x={140} y={200} s={0.6} /><Tree x={1300} y={205} s={0.55} />
          <Basket x={720} y={190} s={0.8} /><Squirrel x={640} y={196} s={0.8} />
        </svg>
        <div className="bg-[#8EBF63] px-6 pb-10 pt-2 text-center text-[#2E4A1E]">
          <p className="text-[24px] font-bold" style={{ fontFamily: "var(--w-display)" }}>{L.see}</p>
          <div className="mt-3 text-[13px] opacity-75">{credit}</div>
        </div>
      </footer>
      <Grain opacity={0.22} />
    </div>
  );
}

function Heading({ eyebrow, title, align = "center", path }: { eyebrow: string; title: string; align?: "center" | "left"; path?: string }) {
  const c = align === "center" ? "items-center text-center" : "items-center text-center @3xl:items-start @3xl:text-left";
  const cls = "mt-3 block text-[clamp(34px,6cqi,56px)] font-bold leading-[1.04]";
  return (
    <div className={`flex flex-col ${c}`} data-pop>
      <p className="text-[12px] font-extrabold uppercase tracking-[0.3em]" style={{ color: PC.flame }}>{eyebrow}</p>
      {path ? <E as="h2" path={path} className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</E> : <h2 className={cls} style={{ fontFamily: "var(--w-display)" }}>{title}</h2>}
      <svg viewBox="-60 -10 120 20" className="mt-3 w-24" aria-hidden><path d="M-56 0 H56" stroke={PC.marigold} strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" /><Marigold s={0.7} /></svg>
    </div>
  );
}

function Polaroid({ children, tilt = 0, className = "", caption }: { children: ReactNode; tilt?: number; className?: string; caption?: string }) {
  return (
    <figure data-pop={tilt} className={`relative bg-white p-3 pb-12 shadow-[0_24px_44px_-24px_rgba(74,35,16,.55)] ${className}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] opacity-80" style={{ background: "repeating-linear-gradient(45deg, rgba(247,183,51,.75) 0 6px, rgba(255,255,255,.6) 6px 12px)" }} />
      <div className="aspect-square overflow-hidden">{children}</div>
      {caption && <figcaption className="absolute bottom-3 left-0 right-0 text-center text-[20px] font-bold" style={{ fontFamily: "var(--w-display)" }}>{caption}</figcaption>}
    </figure>
  );
}

function Tag({ children, tilt, color }: { children: ReactNode; tilt: number; color: string }) {
  return (
    <div data-pop={tilt} className="relative rounded-[22px] bg-white px-8 py-9 text-center shadow-[0_24px_50px_-28px_rgba(74,35,16,.5)]" style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="absolute inset-x-0 top-0 h-3 rounded-t-[22px]" style={{ background: color }} />
      <svg viewBox="-14 -14 28 28" className="absolute -right-3 -top-3 h-9 w-9" aria-hidden><Marigold s={1} c={color === PC.teal ? PC.saffron : PC.marigold} /></svg>
      {children}
    </div>
  );
}

function Pill({ href, children, target }: { href: string; children: ReactNode; target?: string }) {
  return (
    <a href={href} target={target} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold text-white shadow-[0_12px_26px_-12px_rgba(210,69,43,.7)] transition hover:-translate-y-0.5" style={{ background: "var(--w-accent)" }}>
      {children}
    </a>
  );
}

function ParkMap({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 480 360" className="block w-full" aria-hidden>
      <rect width="480" height="360" fill="#CFE6A8" />
      <path d="M-10 200 C100 160 200 260 320 210 S 460 140 500 170" fill="none" stroke="#F3E3C0" strokeWidth="24" strokeLinecap="round" />
      <ellipse cx="370" cy="270" rx="80" ry="44" fill="#9ED8E0" /><path d="M330 270 q14 -8 28 0 t28 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      {[[70, 110], [150, 80], [400, 90], [90, 300], [230, 320]].map(([x, y], i) => <Tree key={i} x={x} y={y} s={0.3} flowers={i % 2 === 0} />)}
      <Blanket id={`${uid}-pm`} x={240} y={140} s={0.3} />
      <Kite x={250} y={60} s={0.35} r={-10} />
      <path d="M40 330 C110 300 160 220 236 150" fill="none" stroke={PC.ink} strokeOpacity=".5" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
    </svg>
  );
}
