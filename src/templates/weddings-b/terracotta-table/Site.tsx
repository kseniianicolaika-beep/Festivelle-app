"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fontClass, lookStyle, ScrollTrigger, Sections, SplitText, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { Candle, Dust, Pampas, Scene, Villa } from "./art";
import { TERRA_LOOK } from "./look";
import { s, TerraStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const Label = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`${s.label} text-[10px] ${className}`}>{children}</p>;
const Scn = ({ n, title, light }: { n: string; title: string; light?: boolean }) => (
  <div data-rise className={`mb-10 flex items-center justify-center gap-4 ${light ? "text-[#f6dcc4]" : "text-[var(--t-accent)]"}`}>
    <span className="h-px w-10 bg-current opacity-50" />
    <Label>{`Scene ${n} — ${title}`}</Label>
    <span className="h-px w-10 bg-current opacity-50" />
  </div>
);

export default function TerracottaSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
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
  useLenis(!compact);

  useStage(root, (g, q) => {
    const hero = q("header")[0];
    // ambient life — plumes sway on their stems, candles breathe, bulbs twinkle
    q("[data-plume]").forEach((el, i) => g.fromTo(el, { rotation: -1.6 - (i % 3) }, { rotation: 1.8 + (i % 2), svgOrigin: (el as SVGGElement).dataset.o, duration: 3.2 + (i % 4) * 0.7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: -i * 0.6 }));
    g.to(q("[data-flame]"), { scaleY: 0.8, scaleX: 1.08, opacity: 0.75, transformOrigin: "50% 100%", duration: 0.28, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.09, from: "random" } });
    g.to(q("[data-bulb]"), { opacity: 0.55, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.15, from: "random" } });
    const tl = g.timeline({ defaults: { ease: "power3.out" } });
    tl.from(q("[data-bar]"), { height: "50.5%", duration: 2.4, ease: "power3.inOut" }, 0.2)
      .from(q("[data-scene]"), { scale: 1.14, filter: "brightness(0.55) saturate(0.7)", duration: 3.2, ease: "power2.out" }, 0)
      .from(q("[data-sun]"), { y: 90, duration: 3.4, ease: "power2.out" }, 0.3)
      .from(q("[data-bar] > *"), { opacity: 0, duration: 1 }, 2.1)
      .from(q("[data-hin]"), { opacity: 0, y: 16, duration: 1.3, stagger: 0.15 }, 2.2);
    if (!compact) {
      const split = SplitText.create(q("[data-n]"), { type: "chars", charsClass: "inline-block" });
      tl.from(split.chars, { opacity: 0, y: 30, filter: "blur(10px)", duration: 1.5, stagger: 0.05 }, 1.5);
    } else tl.from(q("[data-n]"), { opacity: 0, y: 20, duration: 1.4, stagger: 0.2 }, 1.4);
    if (compact) return;
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
    g.to(q("[data-bar]"), { height: 0, ease: "none", scrollTrigger: { ...st, end: "60% top" } });
    g.to(q("[data-scene]"), { yPercent: 12, scale: 1.06, ease: "none", scrollTrigger: st });
    g.to(q("[data-title]"), { yPercent: -40, opacity: 0, ease: "none", scrollTrigger: st });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 40 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.3, stagger: 0.12, ease: "power3.out", overwrite: true }) });
    q("[data-archin]").forEach((el) => g.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.8, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 82%" } }));
    const v = q("[data-villa]")[0];
    if (v) g.from(v.querySelectorAll("[data-draw]"), { drawSVG: 0, ease: "none", stagger: 0.01, scrollTrigger: { trigger: v, start: "top 85%", end: "bottom 55%", scrub: 0.7 } });
    const ph = q("[data-portrait] img")[0];
    if (ph) g.fromTo(ph, { scale: 1.2, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: "none", scrollTrigger: { trigger: ph, start: "top bottom", end: "bottom top", scrub: true } });
  }, [compact]);

  const px = compact ? "px-6" : "px-6 md:px-12";
  const hero = (
    <header className="relative overflow-hidden bg-[#1c100a]" style={{ height: compact ? 720 : "100svh", minHeight: compact ? undefined : 600 }}>
      <div data-scene className="absolute inset-0"><Scene className="h-full w-full" /></div>
      {!compact && <Dust className="pointer-events-none absolute inset-0 h-full w-full" />}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7e3c4]/25 via-transparent to-[#1c100a]/35" />
      <div data-title className={`absolute inset-x-0 top-[15%] text-center ${px}`}>
        <Label className="text-[#6b3520]"><span data-hin className="inline-block">{occ === "wedding" ? L.wedding : L.invited}</span></Label>
        <h1 className={`${s.title} mt-5 flex flex-wrap items-baseline justify-center gap-x-[0.28em] font-extralight italic leading-[0.95] text-[#4a2214]`} style={{ ...disp, fontSize: compact ? "3.6rem" : "clamp(3.5rem, 9.5vw, 8.6rem)" }}>
          <E path="profile.partner1"><span data-n>{a}</span></E>
          {b && <><span data-hin className="text-[0.6em] text-[#b8572f]">&amp;</span><E path="profile.partner2"><span data-n>{b}</span></E></>}
        </h1>
        <p data-hin className="mt-4 text-[1.3rem] italic text-[#6b3520] md:text-[1.6rem]" style={disp}>{occ === "wedding" ? L.getting : occasionLine(profile)}</p>
      </div>
      {/* letterbox bars — cinema framing with the credits inside */}
      <div data-bar className={`absolute inset-x-0 top-0 flex h-[8%] items-center justify-between bg-[#140b07] text-[#e9cdb0]/70 ${px}`}>
        <Label>{L.invited}</Label>
        <Label className="hidden sm:block">Assagão · {dp?.year ?? ""}</Label>
      </div>
      <div data-bar className={`absolute inset-x-0 bottom-0 flex h-[11%] items-center justify-between gap-4 bg-[#140b07] text-[#e9cdb0] ${px}`}>
        <Label className="truncate">{[dp?.full, where].filter(Boolean).join("  ·  ")}</Label>
        {until && occ !== "greeting" && <Label className="shrink-0 text-[#e3b483]">{until.d} {L.days}</Label>}
      </div>
    </header>
  );

  const portrait = (
    <section data-portrait className={`relative overflow-hidden py-20 md:py-28 ${px}`}>
      <div className={`mx-auto grid max-w-5xl items-center gap-10 ${compact ? "" : "md:grid-cols-[1fr_auto_1fr]"}`}>
        <div data-rise className={`hidden text-right ${compact ? "" : "md:block"}`}>
          <Label className="text-[var(--t-accent)]">Scene II</Label>
          <p className="mt-4 text-[2.2rem] font-light italic leading-tight" style={disp}>{L.forever}</p>
        </div>
        <div className="relative mx-auto" style={{ width: compact ? "min(76%, 340px)" : "min(78vw, 380px)" }}>
          <div aria-hidden className={`${s.arch} absolute -inset-3 border border-[var(--t-accent)]/50`} />
          <div data-archin className={`${s.arch} relative aspect-[3/4] overflow-hidden bg-[#e8c3a3]`}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "sepia(0.18) saturate(1.05)" }} />
            ) : (
              <div data-edit-photo="hero" className="absolute inset-0"><Scene className="h-full w-full" lights={false} /></div>
            )}
          </div>
          <div className="pointer-events-none absolute -bottom-6 -left-16 w-28 md:-left-24 md:w-40"><Pampas seed={5} color="#e7cfa9" /></div>
        </div>
        <div data-rise className={`text-center ${compact ? "" : "md:text-left"}`}>
          <Label className="text-[var(--t-muted)]">{dp?.weekday}</Label>
          <p className="mt-3 text-[2rem] italic" style={disp}>{dp?.full}</p>
        </div>
      </div>
    </section>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className={`${s.clay} relative overflow-hidden py-24 text-center text-[#fbeee0] md:py-32 ${px}`}>
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[2%] hidden w-40 opacity-80 md:block"><Pampas seed={9} /></div>
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-[2%] hidden w-40 -scale-x-100 opacity-80 md:block"><Pampas seed={13} /></div>
        <Scn n="III" title={L.invited} light />
        <E as="p" multiline path="profile.inviteLine" className="mx-auto block max-w-4xl text-[2.1rem] font-extralight italic leading-[1.25] md:text-[3.5rem]" style={disp}>{profile.inviteLine || occasionInvite(profile)}</E>
      </section>
    ),
    story: profile.story && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <Scn n="IV" title={L.story} />
        <div className={`mx-auto grid max-w-5xl items-center gap-12 ${compact ? "" : "md:grid-cols-[1.2fr_0.8fr] md:gap-16"}`}>
          <div data-rise>
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.45rem] font-light leading-[1.6] md:text-[1.75rem]" style={disp}>{profile.story}</E>
          </div>
          <div data-archin className={`${s.arch} relative mx-auto aspect-[3/4] w-[min(70vw,300px)] overflow-hidden`}>
            <Scene className="h-full w-full" lights={false} />
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <Scn n="V" title={L.details} />
        <div className={`mx-auto grid max-w-4xl gap-8 ${compact ? "" : "md:grid-cols-2"}`}>
          {dp && (
            <div data-rise className={`${s.arch} relative bg-[var(--t-surface)] px-8 pb-12 pt-20 text-center shadow-[0_30px_60px_-40px_rgba(90,40,20,.5)]`}>
              <div aria-hidden className={`${s.arch} pointer-events-none absolute inset-3 border border-[var(--t-accent)]/35`} />
              <Label className="text-[var(--t-accent)]">{L.when}</Label>
              <p className="mt-4 text-[6.5rem] font-extralight italic leading-none text-[var(--t-accent)]" style={disp}>{dp.day}</p>
              <p className="mt-1 text-[1.7rem] italic" style={disp}>{dp.month} {dp.year}</p>
              <Label className="mt-4 text-[var(--t-muted)]">{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</Label>
            </div>
          )}
          {where && (
            <div data-rise className={`${s.arch} relative flex flex-col items-center bg-[var(--t-surface)] px-8 pb-12 pt-20 text-center shadow-[0_30px_60px_-40px_rgba(90,40,20,.5)]`}>
              <div aria-hidden className={`${s.arch} pointer-events-none absolute inset-3 border border-[var(--t-accent)]/35`} />
              <Label className="text-[var(--t-accent)]">{L.where}</Label>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-6 block text-[2.6rem] font-light italic leading-[1.05]" style={disp}>{where}</E>
              {profile.venue && profile.city && <Label className="mt-3 text-[var(--t-muted)]">{profile.city}</Label>}
              <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className={`${s.pill} ${s.label} relative mt-8 text-[10px] text-[var(--t-accent)]`}>{L.directions} →</a>
            </div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <Scn n="VI" title={L.events} />
        <div className="relative mx-auto max-w-5xl">
          <div aria-hidden className={`absolute inset-x-[8%] top-[52px] hidden h-px bg-[var(--t-accent)]/40 ${compact ? "" : "md:block"}`} />
          <div className={`grid gap-8 ${compact ? "" : events.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {events.map((e, i) => (
              <div data-rise key={i} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 w-12"><Candle /></div>
                <div className={`${s.arch} -mt-2 w-full bg-[var(--t-surface)] px-6 pb-9 pt-12 shadow-[0_24px_50px_-36px_rgba(90,40,20,.55)]`}>
                  <p className="text-[2.4rem] font-extralight italic leading-none text-[var(--t-accent)]" style={disp}>{e.time || "·"}</p>
                  <h3 className="mt-3 text-[1.7rem] font-light leading-tight" style={disp}>{e.name}</h3>
                  <Label className="mt-3 text-[var(--t-muted)]">{[dateParts(e.date, lang)?.full, e.venue].filter(Boolean).join(" · ")}</Label>
                </div>
              </div>
            ))}
          </div>
        </div>
        {calendarUrl && <div data-rise className="mt-12 text-center"><a href={calendarUrl} className={`${s.pill} ${s.label} text-[10px] text-[var(--t-accent)]`}>{L.calendar} +</a></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className={`relative overflow-hidden py-20 md:py-28 ${px}`}>
        <Scn n="VII" title={L.venue} />
        <div className={`mx-auto grid max-w-5xl items-center gap-12 ${compact ? "" : "md:grid-cols-[1.1fr_0.9fr]"}`}>
          <div data-villa className="mx-auto w-full max-w-[520px]"><Villa /></div>
          <div data-rise className={`text-center ${compact ? "" : "md:text-left"}`}>
            <E as="h2" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[3rem] font-extralight italic leading-[1] md:text-[4.4rem]" style={disp}>{where}</E>
            {profile.venue && profile.city && <Label className="mt-4 text-[var(--t-muted)]">{profile.city}</Label>}
            <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className={`${s.pill} ${s.label} mt-8 text-[10px] text-[var(--t-accent)]`}>{L.directions} →</a>
            {/goa/i.test(`${profile.city} ${profile.venue}`) && (
              <div className="mt-10 border-t border-[var(--t-accent)]/25 pt-6">
                <Label className="mb-3 text-[var(--t-accent)]">{L.travel}</Label>
                <p className="text-[1.2rem] font-light italic leading-relaxed text-[var(--t-muted)]" style={disp}>{L.travelText}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className={`relative py-20 md:py-28 ${px}`}>
        <Scn n="VIII" title={L.gallery} />
        <div className={`mx-auto max-w-6xl columns-2 gap-4 ${compact ? "" : "md:columns-3 md:gap-6"}`}>
          {gallery.map((k, i) => (
            <div data-rise key={k} className="mb-4 break-inside-avoid md:mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className={`w-full object-cover ${i % 3 === 0 ? `${s.arch} aspect-[3/4]` : "aspect-[4/5] rounded-[4px]"}`} />
            </div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className={`${s.tile} relative py-20 md:py-28 ${px}`}>
        <div data-rise className={`${s.arch} relative mx-auto max-w-xl bg-[var(--t-surface)] px-7 pb-12 pt-24 shadow-[0_40px_80px_-40px_rgba(60,20,8,.6)] md:px-12`}>
          <div aria-hidden className={`${s.arch} pointer-events-none absolute inset-3 border border-[var(--t-accent)]/30`} />
          <div className="relative">
            <p className="mb-8 text-center text-[2.6rem] font-extralight italic leading-none text-[var(--t-accent)]" style={disp}>{L.reply}</p>
            {children}
          </div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className={`relative py-20 ${px}`}>
        <div data-rise className="mx-auto max-w-2xl text-center">
          <Label className="mb-5 text-[var(--t-accent)]">{L.info}</Label>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.35rem] font-light leading-relaxed" style={disp}>{design.texts.body}</E>
        </div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.sand} relative overflow-hidden`} style={{ ...lookStyle(TERRA_LOOK, design, "terracotta-table"), background: undefined }}>
      <TerraStyles />
      {hero}
      {portrait}
      <Sections design={design} map={sections} />
      <footer className={`${s.night} relative px-6 pb-12 pt-20 text-center text-[#ecd3b8]`}>
        <div className="mx-auto w-16 opacity-90"><Candle /></div>
        <p className="mt-4 text-[3.6rem] font-extralight italic leading-none" style={disp}>{a}{b ? <span className="mx-3 text-[0.5em] text-[#e3b483]">&amp;</span> : null}{b}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-5 block text-[1.5rem] italic text-[#e3b483]" style={disp}>{profile.blessing}</E>}
        <Label className="mt-8 text-[#ecd3b8]/60">{[dp?.full, where].filter(Boolean).join(" · ")}</Label>
        <div className="mt-10 text-xs text-[#ecd3b8]/60">{credit}</div>
      </footer>
    </div>
  );
}
