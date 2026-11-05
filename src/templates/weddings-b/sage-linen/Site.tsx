"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fit, fontClass, lookStyle, ScrollTrigger, Sections, SplitText, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { Bouquet, LongTable, Spray, Sprig, Wash } from "./art";
import { SAGE_LOOK } from "./look";
import { s, SageStyles } from "./styles";

const serif: CSSProperties = { fontFamily: "var(--wd)" };
const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`${s.label} text-[10.5px] text-[var(--t-muted)] ${className}`}>{children}</p>;
const Folio = ({ n, title }: { n: string; title: string }) => (
  <div data-rise className="mb-12 flex items-end gap-5 md:mb-16">
    <span className="text-[3.4rem] font-light italic leading-none text-[var(--t-accent)] md:text-[4.6rem]" style={serif}>{n}</span>
    <div className="flex-1 pb-3"><div className={s.rule} /></div>
    <span className={`${s.label} pb-2 text-[10.5px] text-[var(--t-muted)]`}>{title}</span>
  </div>
);

/** Grows every [data-leaf] from its stem point and draws [data-stem] lines. */
function grow(g: typeof import("gsap").default, root: Element, at?: gsap.TimelineVars["scrollTrigger"]) {
  const tl = g.timeline(at ? { scrollTrigger: at } : {});
  tl.from(root.querySelectorAll("[data-stem]"), { drawSVG: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.25 }, 0);
  root.querySelectorAll<SVGGElement>("[data-leaf]").forEach((el, i) => {
    tl.from(el, { scale: 0, opacity: 0, svgOrigin: el.dataset.o, duration: 0.9, ease: "back.out(1.6)" }, 0.35 + i * 0.045);
  });
  return tl;
}

export default function SageSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const L = words(profile);
  const lang = langOf(profile);
  const occ = occasionOf(profile);
  const [a, b] = nameParts(profile);
  const dp = dateParts(profile.date, lang);
  const until = useUntil(profile.date);
  const where = profile.venue || profile.city || "";
  const gallery = design?.gallery ?? [];
  const events = profile.events ?? [];
  const nameCq = fit("x".repeat(Math.max([...a].length, [...(b || "")].length)), 24, 96, 0.5);
  useLenis(!compact);

  useStage(root, (g, q) => {
    const hero = q("header")[0];
    const tl = grow(g, q("[data-bouquet]")[0]);
    tl.from(q("[data-mast]"), { opacity: 0, y: -8, duration: 1, stagger: 0.1 }, 0.1)
      .from(q("[data-hrule]"), { scaleX: 0, transformOrigin: "0 50%", duration: 1.6, ease: "power3.inOut" }, 0.2);
    const h1 = q("h1")[0];
    if (!compact) {
      const split = SplitText.create(q("[data-n]"), { type: "chars", charsClass: "inline-block" });
      tl.from(split.chars, { opacity: 0, y: 18, filter: "blur(8px)", duration: 1.3, ease: "power3.out", stagger: 0.06 }, 0.9);
    } else tl.from(q("[data-n]"), { opacity: 0, y: 16, duration: 1.2, stagger: 0.2 }, 0.8);
    tl.from(h1, { textShadow: "0 0px 0 rgba(255,255,255,0), 0 0px 0 rgba(40,45,35,0)", duration: 1.6 }, 1.8)
      .from(q("[data-hin]"), { opacity: 0, y: 14, duration: 1.1, stagger: 0.12 }, 1.6);
    g.to(q("[data-flame]"), { scaleY: 0.82, opacity: 0.7, transformOrigin: "50% 100%", duration: 0.35, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.13, from: "random" } });
    if (compact) return;
    g.to(q("[data-bouquet]"), { yPercent: -8, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    g.to(h1, { yPercent: 14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    const ph = q("[data-photo] img")[0];
    if (ph) g.fromTo(ph, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.12, ease: "none", scrollTrigger: { trigger: q("[data-photo]")[0], start: "top bottom", end: "bottom top", scrub: true } });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 36 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.4, stagger: 0.12, ease: "power3.out", overwrite: true }) });
    q("[data-grow]").forEach((el) => grow(g, el, { trigger: el, start: "top 85%" }));
    const tbl = q("[data-table]")[0];
    if (tbl) g.from(tbl.querySelectorAll("[data-draw]"), { drawSVG: 0, ease: "none", stagger: 0.02, scrollTrigger: { trigger: tbl, start: "top 85%", end: "bottom 55%", scrub: 0.8 } });
    q("[data-big]").forEach((el) => g.from(el, { opacity: 0, letterSpacing: "0.12em", duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }));
  }, [compact]);

  const px = compact ? "px-6" : "px-6 md:px-14";
  const hero = (
    <header className="relative flex flex-col overflow-hidden" style={{ minHeight: compact ? 760 : "100svh" }}>
      <div className={`relative z-10 flex items-center justify-between pt-6 ${px}`}>
        <Label className="!text-[var(--t-ink)]"><span data-mast className="inline-block">{dp ? `№ ${dp.dd}·${dp.mm}` : "№ 01"}<span className="hidden sm:inline"> — {occ === "wedding" ? L.wedding : L.invited}</span></span></Label>
        <Label><span data-mast className="inline-block">{dp?.full}</span></Label>
      </div>
      <div className={`relative z-10 mt-4 ${px}`}><div data-hrule className={s.rule} /></div>
      <div className={`relative grid flex-1 items-center ${px} ${compact ? "grid-cols-1" : "md:grid-cols-[1.2fr_0.8fr]"}`}>
        <div data-bouquet className={`pointer-events-none relative order-1 mx-auto ${compact ? "-mb-6 w-[56%]" : "-mb-6 mt-2 w-[min(64vw,300px)] md:order-2 md:mb-0 md:mt-0 md:w-auto"}`}>
          <Wash className="absolute left-[-20%] top-[22%] h-[60%] w-[140%]" color="#b9cbb8" opacity={0.3} />
          <Bouquet className={`relative mx-auto block h-auto w-full ${compact ? "" : "md:h-[min(82svh,760px)] md:w-auto"}`} />
        </div>
        <div className={`relative z-10 order-2 pb-10 ${compact ? "" : "md:order-1 md:pb-0"}`} style={{ containerType: "inline-size" }}>
          <p data-hin className="mb-5 text-[1.35rem] italic text-[var(--t-accent)]" style={serif}>{occ === "wedding" ? L.getting : occasionLine(profile)}</p>
          <h1 className={`${s.press} font-light`} style={{ ...serif, fontSize: `${nameCq}cqw`, lineHeight: 0.84, letterSpacing: "-0.02em" }}>
            <E path="profile.partner1" className="block"><span data-n>{a}</span></E>
            {b && (
              <>
                <span data-hin className="block pl-[18cqw] text-[0.42em] italic leading-[1.1] text-[var(--t-accent)]">&amp;</span>
                <E path="profile.partner2" className="block pl-[9cqw]"><span data-n>{b}</span></E>
              </>
            )}
          </h1>
        </div>
      </div>
      <div className={`relative z-10 pb-6 ${px}`}>
        <div data-hrule className={s.rule} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Label><span data-hin className="inline-block">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</span></Label>
          {until && occ !== "greeting" && <Label className="!text-[var(--t-ink)]"><span data-hin className="inline-block">{until.d} {L.until}</span></Label>}
        </div>
      </div>
    </header>
  );

  const photo = (
    <section className={`relative py-16 md:py-24 ${px}`}>
      <div className={`mx-auto grid max-w-6xl items-end gap-8 ${compact ? "" : "md:grid-cols-[1.4fr_0.6fr] md:gap-14"}`}>
        <figure data-photo className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
          {heroUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(0.82) contrast(0.98)" }} />
          ) : (
            <div data-edit-photo="hero" className="absolute inset-0 flex items-center justify-center bg-[#e7e9df]"><Spray className="w-2/3" /></div>
          )}
        </figure>
        <div data-rise className="pb-2">
          <Label>Fig. I</Label>
          <p className="mt-4 text-[1.9rem] italic leading-[1.2] md:text-[2.3rem]" style={serif}>{L.forever}</p>
          <div className={`mt-6 ${s.rule}`} />
          <p className={`${s.label} mt-4 text-[10px] text-[var(--t-muted)]`}>{a}{b ? ` & ${b}` : ""}</p>
        </div>
      </div>
    </section>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className={`relative flex flex-col items-center justify-center py-24 text-center md:py-36 ${px}`}>
        <div data-grow className="w-52 md:w-64"><Sprig seed={4} nodes={5} /></div>
        <Label className="mb-8 mt-6">{L.invited}</Label>
        <E as="p" multiline path="profile.inviteLine" className={`${s.press} block max-w-4xl text-[2.1rem] font-light italic leading-[1.25] md:text-[3.6rem]`} style={serif}>{profile.inviteLine || occasionInvite(profile)}</E>
      </section>
    ),
    story: profile.story && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <div className="mx-auto max-w-6xl">
          <Folio n="II" title={L.story} />
          <div className={`grid gap-10 ${compact ? "" : "md:grid-cols-[0.42fr_1fr] md:gap-16"}`}>
            <div data-rise className="relative">
              <h2 className="text-[3rem] font-light leading-[0.95] md:text-[4.8rem]" style={serif}>{L.story}</h2>
              <div data-grow className="mt-8 w-48 -rotate-6 md:w-60"><Sprig seed={13} seeded /></div>
            </div>
            <div data-rise>
              <E as="p" multiline path="profile.story" className={`block whitespace-pre-line max-w-2xl text-[1.6rem] leading-[1.55] first-letter:float-left first-letter:mr-3 first-letter:text-[5.2rem] first-letter:font-light first-letter:leading-[0.78] first-letter:text-[var(--t-accent)] md:text-[2.15rem]`} style={serif}>{profile.story}</E>
            </div>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <div className="mx-auto max-w-6xl">
          <Folio n="III" title={L.details} />
          <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-2 md:gap-0"}`}>
            {dp && (
              <div data-rise className={`flex items-center gap-6 ${compact ? "" : "md:border-r md:border-[color-mix(in_oklab,var(--t-ink)_18%,transparent)] md:pr-12"}`}>
                <span data-big className={`${s.press} font-light leading-[0.8]`} style={{ ...serif, fontSize: "clamp(8rem,17vw,15rem)" }}>{dp.day}</span>
                <div>
                  <Label>{L.when}</Label>
                  <p className="mt-3 text-[2rem] italic leading-tight" style={serif}>{dp.month}<br />{dp.year}</p>
                  <p className={`${s.label} mt-3 text-[10px] text-[var(--t-muted)]`}>{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</p>
                </div>
              </div>
            )}
            {where && (
              <div data-rise className={compact ? "" : "md:pl-12"}>
                <Label>{L.where}</Label>
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-3 block text-[2.6rem] font-light leading-[1.05] md:text-[3.4rem]" style={serif}>{where}</E>
                {profile.venue && profile.city && <p className="mt-2 text-xl italic text-[var(--t-muted)]" style={serif}>{profile.city}</p>}
                <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className={`${s.label} ${s.link} mt-6 inline-block text-[10.5px]`}>{L.directions} →</a>
              </div>
            )}
          </div>
          {until && <p data-rise className="mt-16 text-center text-[1.5rem] italic text-[var(--t-muted)]" style={serif}>{until.d} {L.days} · {until.h} {L.hours} · {until.m} {L.minutes}</p>}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <div className="mx-auto max-w-5xl">
          <Folio n="IV" title={L.events} />
          <div data-table className="mx-auto mb-14 max-w-4xl"><LongTable /></div>
          <ol className="flex flex-col">
            {events.map((e, i) => (
              <li data-rise key={i} className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 border-t border-[color-mix(in_oklab,var(--t-ink)_16%,transparent)] py-7 md:grid-cols-[150px_1fr_auto]">
                <span className="text-[1.6rem] italic text-[var(--t-accent)] md:text-[2rem]" style={serif}>{e.time || "—"}</span>
                <div>
                  <h3 className="text-[1.9rem] font-light leading-tight md:text-[2.5rem]" style={serif}>{e.name}</h3>
                  {e.venue && <p className={`${s.label} mt-2 text-[10px] text-[var(--t-muted)]`}>{e.venue}</p>}
                </div>
                <p className={`${s.label} col-span-2 mt-2 text-[10px] text-[var(--t-muted)] md:col-span-1 md:mt-0`}>{dateParts(e.date, lang)?.full}</p>
              </li>
            ))}
          </ol>
          {calendarUrl && <div data-rise className="mt-10"><a href={calendarUrl} className={`${s.label} ${s.link} text-[10.5px]`}>{L.calendar} +</a></div>}
        </div>
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className={`relative overflow-hidden py-24 text-center md:py-36 ${px}`}>
        <Wash className="absolute left-1/2 top-1/2 h-[80%] w-[min(1100px,130vw)] -translate-x-1/2 -translate-y-1/2" color="#c3d1c0" opacity={0.32} />
        <div className="relative mx-auto max-w-4xl">
          <Label>{L.venue}</Label>
          <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className={`${s.press} mt-6 block text-[3.2rem] font-light italic leading-[0.98] md:text-[6.4rem]`} style={serif}>{where}</E>
          {profile.venue && profile.city && <p className={`${s.label} mt-6 text-[11px] text-[var(--t-muted)]`}>{profile.city}</p>}
          <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className={`${s.label} ${s.link} mt-10 inline-block text-[10.5px]`}>{L.directions} →</a>
          {/goa/i.test(`${profile.city} ${profile.venue}`) && (
            <div data-rise className="mx-auto mt-14 max-w-xl"><Label className="mb-3">{L.travel}</Label><p className="text-[1.3rem] italic leading-relaxed text-[var(--t-muted)]" style={serif}>{L.travelText}</p></div>
          )}
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <div className="mx-auto max-w-6xl">
          <Folio n="V" title={L.gallery} />
          <div className={`grid grid-cols-2 gap-4 ${compact ? "" : "md:grid-cols-12 md:gap-8"}`}>
            {gallery.map((k, i) => {
              const span = ["md:col-span-7", "md:col-span-5 md:mt-24", "md:col-span-4", "md:col-span-8"][i % 4];
              return (
                <figure data-rise key={k} className={compact ? "" : span}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className={`w-full object-cover ${i % 4 === 0 || i % 4 === 3 ? "aspect-[4/3]" : "aspect-[3/4]"}`} />
                  <figcaption className={`${s.label} mt-3 text-[9.5px] text-[var(--t-muted)]`}>Fig. {i + 2}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <div data-rise className="relative mx-auto max-w-xl">
          <div className={`${s.cotton} ${s.deckle} relative px-7 pb-12 pt-16 shadow-[0_30px_60px_-30px_rgba(40,50,40,.35)] md:px-12`}>
            <div className="pointer-events-none absolute -right-2 -top-2 w-40 md:w-48"><Spray seed={21} /></div>
            <p className="mb-8 text-[2.6rem] font-light italic leading-none md:text-[3.2rem]" style={serif}>{L.reply}</p>
            {children}
          </div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className={`relative py-20 ${px}`}>
        <div data-rise className="mx-auto max-w-2xl text-center">
          <Label className="mb-6">{L.info}</Label>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.45rem] leading-relaxed" style={serif}>{design.texts.body}</E>
        </div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.linen} relative overflow-hidden`} style={{ ...lookStyle(SAGE_LOOK, design, "sage-linen"), background: undefined }}>
      <SageStyles />
      {hero}
      {photo}
      <Sections design={design} map={sections} />
      <footer className={`relative pb-14 pt-20 text-center ${px}`}>
        <div data-grow className="mx-auto w-44"><Sprig seed={31} nodes={5} /></div>
        <p className={`${s.press} mt-4 text-[4rem] font-light italic leading-none`} style={serif}>{a[0]}<span className="mx-2 text-[0.5em] text-[var(--t-accent)]">&amp;</span>{b?.[0]}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-6 block text-[1.6rem] italic text-[var(--t-muted)]" style={serif}>{profile.blessing}</E>}
        <div className={`mx-auto mt-10 max-w-6xl ${s.rule}`} />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Label>{dp?.full}</Label>
          <div className="text-xs text-[var(--t-muted)]">{credit}</div>
        </div>
      </footer>
    </div>
  );
}
