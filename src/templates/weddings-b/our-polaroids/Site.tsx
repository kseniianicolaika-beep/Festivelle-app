"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fontClass, grain, lookStyle, Sections, ScrollTrigger, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { Arrow, CalendarPage, Casa, Heart, NoPhoto, Polaroid, Postmark, Stamp, Star, Tape, Underline } from "./art";
import { POLAROID_LOOK } from "./look";
import { s, PolaroidStyles } from "./styles";

const hand: CSSProperties = { fontFamily: "var(--ws)" };
const STICKY = ["#fde58a", "#f9c6c9", "#c8e6d3", "#c9daf2", "#fbd3a6"];
const tilt = (i: number) => [-3, 2.5, -1.5, 3.5, -2.5, 1.5][i % 6];

const Label = ({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) => (
  <span className={`${s.label} text-[11px] uppercase text-[#2b2724] md:text-[12px] ${className}`} style={style}>{children}</span>
);

function SectionTitle({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div data-rise className="mb-12 text-center">
      {note && <p className="mb-1 text-[1.35rem] text-[#d2462e]" style={hand}>{note}</p>}
      <h2 data-write className="inline-block text-[3.2rem] font-bold leading-none text-[#2b2724] md:text-[4.4rem]" style={hand}>{children}</h2>
      <div data-drawon className="mx-auto -mt-1 w-48 md:w-64"><Underline className="h-4 w-full" /></div>
    </div>
  );
}

export default function PolaroidSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
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
  const longest = Math.max([...a].length, [...(b || "")].length + 2);
  const nameFs = compact ? `${Math.min(5.6, 24 / (longest * 0.5)).toFixed(2)}rem` : `min(10.5rem, ${Math.min(13, 84 / (longest * 0.5)).toFixed(2)}vw, ${Math.round(600 / (longest * 0.5))}px)`;
  useLenis(!compact);

  useStage(root, (g, q) => {
    const hero = g.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
    hero.from(q("[data-hero-pol]"), { y: -260, rotate: -24, opacity: 0, scale: 1.08, duration: 1.3, ease: "back.out(1.15)" }, 0)
      .from(q("[data-hero-pol] [data-tape]"), { scale: 1.5, opacity: 0, duration: 0.45, stagger: 0.18, ease: "power2.out" }, 1.05)
      .fromTo(q("[data-hero-pol] [data-develop]"), { opacity: 1 }, { opacity: 0, duration: 3.6, ease: "power1.inOut" }, 0.9)
      .fromTo(q("[data-hero-pol] img"), { filter: "brightness(.55) saturate(0) contrast(.8) blur(1.5px)" }, { filter: "brightness(1) saturate(.92) contrast(1.04) blur(0px)", duration: 3.8, ease: "power1.inOut" }, 0.9)
      .from(q("[data-hero-back]"), { rotate: 0, x: 40, opacity: 0, duration: 1 }, 0.6)
      .from(q("[data-hero-in]"), { opacity: 0, y: 18, duration: 0.8, stagger: 0.1 }, 0.4)
      .fromTo(q("[data-hero-name]"), { clipPath: "inset(-20% 100% -30% 0)" }, { clipPath: "inset(-20% 0% -30% 0)", duration: 1.3, stagger: 0.5, ease: "steps(14)" }, 0.6)
      .from(q("[data-hero] [data-draw]"), { drawSVG: 0, duration: 0.9, stagger: 0.12, ease: "power1.inOut" }, 1.8)
      .from(q("[data-hero-stamp]"), { scale: 1.6, rotate: 30, opacity: 0, duration: 0.5, ease: "power4.in" }, 2.2);
    if (compact) return;
    g.to(q("[data-hero-pol]"), { yPercent: -8, rotate: 6, ease: "none", scrollTrigger: { trigger: q("[data-hero]")[0], start: "top top", end: "bottom top", scrub: true } });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 36 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.1, overwrite: true }) });
    q("section [data-polaroid], [data-drop]").forEach((el, i) => g.from(el, { y: -90, rotate: i % 2 ? 14 : -12, opacity: 0, duration: 1.1, ease: "back.out(1.3)", scrollTrigger: { trigger: el, start: "top 90%" } }));
    q("[data-sticky]").forEach((el, i) => g.from(el, { rotateX: -75, transformOrigin: "50% 0%", opacity: 0, duration: 0.9, delay: (i % 3) * 0.12, ease: "back.out(1.5)", scrollTrigger: { trigger: el, start: "top 90%" } }));
    q("section [data-write]").forEach((el) => g.fromTo(el, { clipPath: "inset(-20% 100% -30% 0)" }, { clipPath: "inset(-20% 0% -30% 0)", duration: 1.1, ease: "steps(12)", scrollTrigger: { trigger: el, start: "top 88%" } }));
    q("[data-drawon]").forEach((el) => g.from(el.querySelectorAll("[data-draw]"), { drawSVG: 0, duration: 1.1, stagger: 0.08, ease: "power1.inOut", scrollTrigger: { trigger: el, start: "top 88%" } }));
  }, [compact]);

  const heroPhoto = heroUrl
    // eslint-disable-next-line @next/next/no-img-element
    ? <img data-edit-photo="hero" src={heroUrl} alt="" />
    : <div data-edit-photo="hero" className="absolute inset-0"><NoPhoto seed={2} /></div>;

  const hero = (
    <header data-hero className={`relative overflow-hidden px-6 ${compact ? "pb-16 pt-12" : "pb-20 pt-16 md:pt-10"}`} style={{ minHeight: compact ? undefined : "100svh" }}>
      <div className={`mx-auto grid max-w-6xl items-center gap-12 ${compact ? "" : "md:grid-cols-[1.05fr_1fr]"} ${compact ? "" : "md:min-h-[calc(100svh-6rem)]"}`}>
        <div className={`relative text-center ${compact ? "" : "md:text-left"}`}>
          <div data-hero-in className={`mb-6 flex flex-wrap items-center justify-center gap-3 ${compact ? "" : "md:justify-start"}`}>
            <Label style={{ transform: "rotate(-2deg)" }}>№ 01 · {L.story}</Label>
            <Star className="h-5 w-5" />
          </div>
          <h1 className="relative font-bold leading-[0.86] text-[#2b2724]" style={hand}>
            <E as="span" path="profile.partner1" className="block" style={{ fontSize: nameFs }}><span data-hero-name className="inline-block pr-3">{a}</span></E>
            {b && (
              <span className="block" style={{ fontSize: nameFs }}>
                <span data-hero-name className="inline-block pr-3"><span className="text-[#d2462e]">&amp;</span> <E path="profile.partner2">{b}</E></span>
              </span>
            )}
          </h1>
          <div className={`mx-auto mt-1 w-[78%] ${compact ? "" : "md:mx-0"}`}><Underline className="h-5 w-full" /></div>
          <p data-hero-in className="mt-4 text-[2rem] leading-tight text-[#d2462e] md:text-[2.6rem]" style={hand}>{occasionLine(profile)}!</p>
          <div data-hero-in className={`mt-7 flex flex-wrap items-center justify-center gap-3 ${compact ? "" : "md:justify-start"}`}>
            {dp && <Label style={{ transform: "rotate(1.5deg)" }}>{dp.dd}.{dp.mm}.{dp.year}</Label>}
            {where && occ !== "greeting" && <Label style={{ transform: "rotate(-1deg)" }}><E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E>{profile.venue && profile.city ? `, ${profile.city}` : ""}</Label>}
          </div>
          <div data-hero-in className={`mt-8 h-[92px] ${compact ? "" : "md:h-[104px]"}`}>
            {until && occ !== "greeting" && (
              <div className={`${s.sticky} inline-block text-left`} style={{ background: STICKY[0], transform: "rotate(-3deg)", padding: "14px 22px 16px" }}>
                <span className="block text-[3rem] font-bold leading-none text-[#2b2724]" style={hand}>{until.d}</span>
                <span className="block text-[1.25rem] leading-none text-[#2b2724]/80" style={hand}>{L.until}</span>
              </div>
            )}
          </div>
          {!compact && <Arrow className="absolute -right-6 top-[44%] hidden w-28 rotate-[-8deg] lg:block" />}
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <div data-hero-back aria-hidden className="absolute inset-x-[4%] top-[3%] rotate-[-9deg]">
            <div className={s.polaroid} style={{ paddingBottom: "20%" }}>
              <div className={s.photo} style={{ background: "linear-gradient(160deg,#cdb9a3,#8f7c6b)" }}><Heart className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 opacity-60" color="#fffdf8" /></div>
            </div>
          </div>
          <div data-hero-pol className="relative"><Polaroid develop={!compact} tapes={2} tape={0} className="relative rotate-[4deg]" captionClass="text-[2.1rem]" caption={<span className="text-[#2b2724]">{L.forever}</span>}>
            {heroPhoto}
          </Polaroid></div>
          <div data-hero-stamp className="absolute -bottom-8 -left-6 rotate-[-10deg] md:-left-12">
            <Stamp value="♥"><div className="grid h-[74px] w-[60px] place-items-center"><Heart className="w-9" /></div></Stamp>
          </div>
          {dp && <Postmark className="absolute -bottom-10 left-10 w-40 rotate-[-6deg] md:left-6" top={(profile.city || "LOVE").toUpperCase().slice(0, 16)} bottom={`${dp.dd}·${dp.mm}·${dp.year}`} mid="♥" />}
        </div>
      </div>
    </header>
  );

  const sections = {
    invitation: occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-rise className={`${s.ruled} relative mx-auto max-w-2xl rotate-[-1.2deg] px-8 pb-12 pt-14 text-[#2b2724] shadow-[0_18px_40px_-22px_rgba(60,40,20,.55)] md:px-14`} style={{ "--rule": "3.4rem", "--pt": "3.5rem" } as CSSProperties}>
          <span className={s.pin} style={{ left: "50%", top: 14, marginLeft: -7 }} />
          <p className="text-[1.4rem] text-[#d2462e]" style={{ ...hand, lineHeight: "var(--rule)" }}>{L.invited}…</p>
          <E as="p" multiline path="profile.inviteLine" className="block text-[2rem] md:text-[2.4rem]" style={{ ...hand, lineHeight: "var(--rule)" }}>{profile.inviteLine || occasionInvite(profile)}</E>
          <div data-drawon className="absolute -bottom-6 right-6 w-16 rotate-12"><Heart className="w-full" /></div>
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative px-6 py-20 md:py-28">
        <SectionTitle note={L.chapter + " 1"}>{L.story}</SectionTitle>
        <div className={`mx-auto grid max-w-5xl items-start gap-12 ${compact ? "" : "md:grid-cols-[1.25fr_0.75fr]"}`}>
          <div data-rise className={`${s.ruled} relative rotate-[0.8deg] px-8 pb-10 pt-12 shadow-[0_18px_40px_-22px_rgba(60,40,20,.55)] md:px-12`} style={{ "--rule": "2.6rem", "--pt": "3rem" } as CSSProperties}>
            <Tape i={3} className="!left-[-4%] !top-[-3%] rotate-[-30deg]" />
            <p className="text-[1.6rem] text-[#2f4f8f]" style={{ ...hand, lineHeight: "var(--rule)" }}>{lang === "ru" ? "Дорогой дневник," : lang === "hi" ? "प्रिय डायरी," : "Dear diary,"}</p>
            <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.7rem] text-[#2b2724] md:text-[1.85rem]" style={{ ...hand, lineHeight: "var(--rule)" }}>{profile.story}</E>
            <p className="text-right text-[1.6rem] text-[#d2462e]" style={{ ...hand, lineHeight: "var(--rule)" }}>— {a}{b ? ` & ${b}` : ""} ♥</p>
          </div>
          <div className="relative mx-auto w-[min(78vw,300px)] pt-6">
            <Polaroid tape={1} className="rotate-[-5deg]" captionClass="text-[1.7rem]" caption={L.with}>
              {gallery[0]
                // eslint-disable-next-line @next/next/no-img-element
                ? <img data-edit-photo="gallery" data-gallery-key={gallery[0]} src={media(gallery[0])} alt="" />
                : heroUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={heroUrl} alt="" style={{ objectPosition: "30% 40%", transform: "scale(1.5)" }} />
                  : <NoPhoto seed={4} />}
            </Polaroid>
            <div data-drawon className="absolute -right-2 -top-2 w-10"><Star className="w-full" /></div>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <SectionTitle note={L.save}>{L.details}</SectionTitle>
        <div className={`mx-auto grid max-w-4xl items-center gap-14 ${compact ? "" : "md:grid-cols-2"}`}>
          {dp && (
            <div data-drop className="mx-auto w-[min(84vw,360px)] rotate-[-2deg]" data-drawon>
              <CalendarPage iso={profile.date} lang={lang} style={{ fontSize: 17 }} />
              <p className="mt-4 text-center text-[1.6rem] text-[#2b2724]" style={hand}>{dp.weekday}{events[0]?.time ? `, ${events[0].time}` : ""}</p>
            </div>
          )}
          {where && (
            <div data-rise className={`relative text-center ${compact ? "" : "md:text-left"}`}>
              <Label className="mb-5" style={{ transform: "rotate(-2deg)" }}>{L.where}</Label>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[3rem] font-bold leading-[0.95] text-[#2b2724] md:text-[3.8rem]" style={hand}>{where}</E>
              {profile.venue && profile.city && <p className="mt-2 text-[1.8rem] text-[#d2462e]" style={hand}>{profile.city}</p>}
              <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-[1.5rem] text-[#2f4f8f] underline decoration-wavy decoration-[#d2462e]/60 underline-offset-[6px]" style={hand}>{L.directions} →</a>
            </div>
          )}
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <SectionTitle note={L.celebrate}>{L.events}</SectionTitle>
        <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-8 md:gap-10" style={{ perspective: 900 }}>
          {events.map((e, i) => (
            <div data-sticky key={i} className={`${s.sticky} w-[min(78vw,270px)] text-[#2b2724]`} style={{ background: STICKY[(i + 1) % STICKY.length], transform: `rotate(${tilt(i)}deg)` }}>
              <Tape i={i + 2} className="!top-[-7%] !h-[16%] !w-[46%] !left-[27%]" />
              <p className="whitespace-nowrap text-[2.6rem] font-bold leading-none" style={hand}>{e.time || "♥"}</p>
              <h3 className="mt-2 text-[2rem] leading-[1.05]" style={hand}>{e.name}</h3>
              <p className={`${s.mono} mt-4 text-[11px] uppercase opacity-70`}>{[dateParts(e.date, lang)?.full, e.venue].filter(Boolean).join(" · ")}</p>
            </div>
          ))}
        </div>
        {calendarUrl && <div data-rise className="mt-14 text-center"><a href={calendarUrl} className={`${s.label} text-[12px] uppercase transition hover:-rotate-2`}>+ {L.calendar}</a></div>}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div data-rise className="mx-auto max-w-4xl rotate-[0.8deg]">
          <div className="relative grid overflow-hidden bg-[#fffdf8] shadow-[0_24px_50px_-26px_rgba(60,40,20,.6)] md:grid-cols-[1.1fr_1fr]" style={{ border: "10px solid #fffdf8", outline: "1px solid rgba(43,39,36,.12)" }}>
            <div className="relative border-b border-dashed border-[#2b2724]/20 p-6 md:border-b-0 md:border-r md:p-8" data-drawon>
              <p className="text-[2.4rem] leading-none text-[#d2462e]" style={hand}>{lang === "ru" ? "Привет из" : lang === "hi" ? "प्यार भरा नमस्ते —" : "Greetings from"}</p>
              <p className="mt-1 text-[3rem] font-bold leading-none text-[#2b2724]" style={hand}>{profile.city || where}</p>
              <Casa className="mt-6 w-full" />
            </div>
            <div className="relative p-6 md:p-8">
              <div className="absolute right-5 top-5 rotate-[4deg]"><Stamp value={dp?.year?.slice(2) ?? "♥"}><div className="grid h-[70px] w-[56px] place-items-center bg-[#f3d9c8]"><Heart className="w-8" /></div></Stamp></div>
              {dp && <Postmark className="absolute right-16 top-12 w-36 opacity-90" top={(profile.city || "").toUpperCase().slice(0, 16)} bottom={`${dp.dd}·${dp.mm}·${dp.year}`} mid="♥" />}
              <div className="mt-28 space-y-1" style={{ ...hand }}>
                <Label className="mb-3" style={{ transform: "rotate(-1.5deg)" }}>{L.venue}</Label>
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block border-b border-[#2f4f8f]/25 pb-1 text-[2rem] leading-tight text-[#2b2724]">{where}</E>
                {profile.city && <p className="border-b border-[#2f4f8f]/25 pb-1 text-[2rem] leading-tight text-[#2b2724]">{profile.city}</p>}
                <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className="inline-block pt-3 text-[1.6rem] text-[#2f4f8f] underline decoration-wavy decoration-[#d2462e]/60 underline-offset-[6px]">{L.directions} →</a>
              </div>
            </div>
          </div>
          {/goa/i.test(`${profile.city} ${profile.venue}`) && (
            <div className={`${s.sticky} mx-auto mt-10 max-w-md rotate-[-1.5deg] text-[#2b2724]`} style={{ background: STICKY[3] }}>
              <p className="text-[1.9rem] font-bold leading-none" style={hand}>{L.travel}</p>
              <p className="mt-3 text-[1.35rem] leading-snug" style={hand}>{L.travelText}</p>
            </div>
          )}
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-20 md:py-28">
        <SectionTitle>{L.gallery}</SectionTitle>
        <div className={`mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-10 ${compact ? "" : "md:grid-cols-3"} md:gap-x-10`}>
          {gallery.map((k, i) => (
            <Polaroid key={k} tape={i} className="mx-auto w-full max-w-[320px]" style={{ transform: `rotate(${tilt(i + 1)}deg)` }} captionClass="text-[1.4rem] md:text-[1.7rem]" caption={dp ? `${String(i + 1).padStart(2, "0")} ♥` : "♥"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" />
            </Polaroid>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <SectionTitle note={L.attend}>{L.rsvp}</SectionTitle>
        <div data-rise className="relative mx-auto max-w-xl rotate-[-0.6deg] bg-[#fffdf8] p-7 shadow-[0_24px_50px_-26px_rgba(60,40,20,.6)] md:p-10">
          <Tape i={0} className="!left-[-6%] !top-[-3%] rotate-[-25deg]" />
          <Tape i={2} className="!left-auto !right-[-6%] !top-[-3%] rotate-[25deg]" />
          {children}
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-6 py-16">
        <div data-sticky className={`${s.sticky} mx-auto max-w-lg rotate-[1.5deg] text-[#2b2724]`} style={{ background: STICKY[2] }}>
          <p className="mb-2 text-[2rem] font-bold" style={hand}>{L.info}</p>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.45rem] leading-snug" style={hand}>{design.texts.body}</E>
        </div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.paper} relative overflow-hidden`} style={lookStyle(POLAROID_LOOK, design, "our-polaroids")}>
      <PolaroidStyles />
      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: grain(0.28, 0.75), opacity: 0.55 }} />
      <div className="relative">
        {hero}
        <Sections design={design} map={sections} />
        <footer className="relative px-6 pb-14 pt-16 text-center">
          <div data-drawon className="mx-auto w-20"><Heart className="w-full" /></div>
          <p className="mt-3 text-[2.4rem] leading-none text-[#2b2724]" style={hand}>xoxo,</p>
          <p className="mt-1 text-[3rem] font-bold leading-none text-[#d2462e]" style={hand}>{a}{b ? ` & ${b}` : ""}</p>
          {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mt-5 block max-w-md text-[1.6rem] text-[#2b2724]/80" style={hand}>{profile.blessing}</E>}
          <div className="mt-10 text-xs text-[#7b6f63]">{credit}</div>
        </footer>
      </div>
    </div>
  );
}
