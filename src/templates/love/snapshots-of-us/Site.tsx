"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine } from "@/lib/occasions";
import { LENIS_CSS, Sections, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, Eucalyptus, LINEN, Memory, Polaroid, Tape, fontClass } from "./art";

export const CAPTIONS = {
  en: ["the café, in the rain", "first coffee", "Goa sunsets", "the question", "see you there"],
  ru: ["то кафе под дождём", "первый кофе", "закаты в Гоа", "тот самый вопрос", "до встречи"],
  hi: ["बारिश वाला कैफ़े", "पहली कॉफ़ी", "गोवा की शामें", "वो सवाल", "वहीं मिलते हैं"],
};
// hero polaroid layout: [left%, top%, rotate, memory kind]
const SPOTS: [number, number, number, number][] = [[4, 12, -9, 0], [24, 2, 5, 1], [38, 16, -3, 9], [58, 4, 7, 3], [76, 14, -6, 2]];

// SNAPSHOTS OF US — five polaroids from the story so far drop onto a linen table and settle; names in marker.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const lang = p.language === "ru" ? "ru" : p.language === "hi" ? "hi" : "en";
  const caps = CAPTIONS[lang];
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const amp = lang === "ru" ? "и" : "&";
  const extra = gallery.slice(0, 4);
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    el.querySelectorAll<HTMLElement>(".su-snap").forEach((n, i) => gsap.to(n, { y: -40 - (i % 3) * 30, ease: "none", scrollTrigger: { trigger: el.querySelector(".su-hero"), start: "top top", end: "bottom top", scrub: true } }));
    el.querySelectorAll<HTMLElement>(".su-pin").forEach((n) => gsap.from(n, { y: -60, rotate: -14, opacity: 0, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: n, start: "top 85%", once: true } }));
  });

  const photoFor = (slot: number) => {
    if (slot === 2) return heroUrl ? { src: heroUrl, edit: "hero" as const } : null;
    const g = extra[slot > 2 ? slot - 1 : slot];
    return g ? { src: media(g), edit: "gallery" as const, key: g } : null;
  };
  const snap = (slot: number) => {
    const ph = photoFor(slot);
    return ph ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img data-edit-photo={ph.edit} data-gallery-key={"key" in ph ? ph.key : undefined} src={ph.src} alt="" className={`h-full w-full object-cover ${compact ? "" : "dev"}`} style={{ animationDelay: `${1 + slot * 0.2}s` }} />
    ) : (
      <div data-edit-photo={slot === 2 ? "hero" : undefined} className={`h-full w-full ${compact ? "" : "dev"}`} style={{ animationDelay: `${1 + slot * 0.2}s` }}><Memory kind={SPOTS[slot][3] === 9 ? 3 : SPOTS[slot][3]} /></div>
    );
  };

  const sec = compact ? "px-6 py-14" : "px-6 py-20 md:py-28";
  const Title = ({ children: c, n }: { children: React.ReactNode; n: number }) => (
    <div data-rv className="mb-10 text-center">
      <p className="cap text-[var(--t-accent)]">{String(n).padStart(2, "0")}</p>
      <p className="h mt-1 text-5xl md:text-6xl">{c}</p>
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "playfair")} className={`su ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-su" precedence="default">{CSS + LENIS_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: LINEN }} />

      {/* ── Intro: polaroids drop onto the table ── */}
      <header data-section="intro" className={`su-hero relative overflow-hidden ${compact ? "min-h-[680px]" : "min-h-[100svh]"}`}>
        <Eucalyptus className="absolute -left-6 -top-6 w-32 rotate-[-30deg] md:w-44" />
        <Eucalyptus className="absolute -bottom-10 -right-4 w-28 rotate-[150deg] md:w-40" />
        <div className={`relative mx-auto max-w-6xl px-4 ${compact ? "pt-10" : "pt-[8vh]"}`}>
          {/* desktop / wide: scattered table */}
          <div className={`relative mx-auto h-[320px] w-full max-w-[1000px] ${compact ? "hidden" : "hidden md:block md:h-[440px]"}`}>
            {SPOTS.map(([l, t, r], i) => (
              <div key={i} className="su-snap absolute w-[22%]" style={{ left: `${l}%`, top: `${t}%`, zIndex: i === 2 ? 5 : i }}>
                <Polaroid className="drop" style={{ ["--r" as string]: `${r}deg`, ["--fx" as string]: `${(i - 2) * 40}px`, animationDelay: `${0.2 + i * 0.18}s`, fontSize: "clamp(14px,1.5vw,20px)" } as React.CSSProperties} caption={caps[i]} tape={i}>{snap(i)}</Polaroid>
              </div>
            ))}
          </div>
          {/* phone / compact: tight stack */}
          <div className={`relative mx-auto h-[330px] w-full max-w-[360px] ${compact ? "" : "md:hidden"}`}>
            {[0, 1, 3, 4, 2].map((i, k) => (
              <div key={i} className="absolute w-[52%]" style={{ left: `${[2, 46, 4, 44, 24][k]}%`, top: `${[2, 6, 40, 44, 18][k]}%`, zIndex: k }}>
                <Polaroid className={compact ? "" : "drop"} style={{ ["--r" as string]: `${[-8, 6, 5, -7, -2][k]}deg`, transform: compact ? `rotate(${[-8, 6, 5, -7, -2][k]}deg)` : undefined, animationDelay: `${0.2 + k * 0.18}s`, fontSize: "15px" } as React.CSSProperties} caption={caps[i]} tape={i}>{snap(i)}</Polaroid>
              </div>
            ))}
          </div>
          <div className={`relative z-10 text-center ${compact ? "mt-6" : "mt-8 md:mt-4"}`}>
            <p className="cap up text-[var(--t-accent)]" style={{ animationDelay: "1.6s" }}>{L.engagementOf}</p>
            <h1 className={`h ${compact ? "text-[64px]" : "text-[clamp(64px,9vw,140px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 8, true)}em` }}>
              <E path="profile.partner1" className={compact ? "" : "write inline-block"} style={{ animationDelay: "1.8s" }}>{a}</E>
              {b && <span className="di mx-3 text-[.4em] text-[var(--t-accent)]">{amp}</span>}
              {b && <E path="profile.partner2" className={compact ? "" : "write inline-block"} style={{ animationDelay: "2.3s" }}>{b}</E>}
            </span>
            </h1>
            <svg viewBox="0 0 300 14" className="mx-auto -mt-2 w-56 md:w-80" aria-hidden><path d="M4 9C60 3 140 12 296 5" stroke="var(--t-accent)" strokeWidth="3" fill="none" strokeLinecap="round" className={compact ? "" : "write"} style={{ animationDelay: "2.8s" }} /></svg>
            <p className="di up mt-3 text-xl md:text-2xl" style={{ animationDelay: "3s" }}>{occasionLine(p)} · {date}</p>
            {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="cap up mt-2 block text-[var(--t-muted)]" style={{ animationDelay: "3.1s" }}>{where}{p.venue && p.city ? `, ${p.city}` : ""}</E>}
          </div>
        </div>
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} mx-auto max-w-2xl`}>
                <div data-rv className="su-pin relative rotate-[-1deg] bg-[#fffef8] px-8 py-12 text-center shadow-[0_20px_40px_-26px_rgba(30,40,30,.5)] md:px-14" style={{ backgroundImage: "repeating-linear-gradient(180deg,transparent 0 34px,rgba(94,125,99,.18) 34px 35px)" }}>
                  <Tape tone={1} className="-top-3 left-1/2 h-7 w-32 -translate-x-1/2 rotate-2" />
                  <E as="p" multiline path="profile.inviteLine" className="h block text-[clamp(34px,4.6vw,52px)] leading-[1.1]">{p.inviteLine || occasionInvite(p)}</E>
                  <p className="h mt-6 text-3xl text-[var(--t-accent)]">— {a} {amp} {b}</p>
                </div>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title n={1}>{L.story}</Title>
                <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-[1fr_1.2fr]"}`}>
                  <div data-rv className="su-pin mx-auto w-[78%] max-w-[340px]">
                    <Polaroid className="rotate-[-4deg]" style={{ fontSize: "22px" }} caption={caps[0]} tape={2}><Memory kind={0} /></Polaroid>
                  </div>
                  <div data-rv><E as="p" multiline path="profile.story" className="di block whitespace-pre-line text-[clamp(22px,2.4vw,30px)] leading-[1.55]">{p.story}</E></div>
                </div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} mx-auto max-w-4xl`}>
                <Title n={2}>{L.details}</Title>
                <div data-rv className="su-pin relative mx-auto flex max-w-2xl rotate-[1deg] overflow-hidden rounded-[10px] bg-[#fffef8] shadow-[0_24px_44px_-28px_rgba(30,40,30,.55)]">
                  <Tape tone={3} className="-top-2 left-8 h-6 w-24 -rotate-6" />
                  <div className="flex-1 p-8 md:p-10">
                    <p className="cap text-[var(--t-accent)]">{L.when}</p>
                    <p className="d mt-2 text-3xl md:text-4xl">{date}</p>
                    {p.events?.[0]?.time && <p className="h mt-1 text-3xl text-[var(--t-muted)]">{p.events[0].time}</p>}
                    <p className="cap mt-6 text-[var(--t-accent)]">{L.where}</p>
                    <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-2 block text-3xl md:text-4xl">{where}</E>
                    {p.venue && p.city && <p className="h text-3xl text-[var(--t-muted)]">{p.city}</p>}
                  </div>
                  <div className="flex w-28 flex-col items-center justify-center border-l-2 border-dashed border-[var(--t-gold)] bg-[var(--t-accent)] text-white md:w-40">
                    {cd ? <><p className="d text-5xl md:text-6xl">{cd.d}</p><p className="cap mt-1">{L.days}</p></> : <p className="h text-4xl">♥</p>}
                  </div>
                </div>
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} mx-auto max-w-2xl`}>
                <Title n={3}>{L.events}</Title>
                <div data-rv className="su-pin relative rotate-[-1.5deg] bg-[#fffef8] px-8 py-10 shadow-[0_20px_40px_-26px_rgba(30,40,30,.5)]" style={{ backgroundImage: "linear-gradient(90deg,transparent 46px,rgba(200,85,61,.35) 46px 47px,transparent 47px),repeating-linear-gradient(180deg,transparent 0 44px,rgba(94,125,99,.18) 44px 45px)" }}>
                  <Tape tone={0} className="-top-3 right-10 h-7 w-28 rotate-3" />
                  <ol className="space-y-4 pl-10">
                    {p.events.map((e, i) => (
                      <li key={i} className="h text-3xl md:text-4xl">
                        <span className="mr-3 text-[var(--t-accent)]">{e.time}</span>{e.name}
                        {e.venue && <span className="block text-2xl text-[var(--t-muted)]">@ {e.venue}</span>}
                      </li>
                    ))}
                  </ol>
                </div>
                {calendarUrl && <div data-rv className="mt-10 text-center"><a href={calendarUrl} className="h inline-flex rounded-full bg-[var(--t-accent)] px-7 py-3 text-2xl text-white shadow-[0_10px_24px_-12px_rgba(40,70,50,.7)] transition hover:-rotate-2">+ {L.calendar}</a></div>}
              </section>
            ),
            venue: where && (
              <section className={`${sec} mx-auto max-w-4xl text-center`}>
                <Title n={4}>{L.venue}</Title>
                <div data-rv className="su-pin mx-auto w-[72%] max-w-[320px]"><Polaroid className="rotate-[3deg]" style={{ fontSize: "22px" }} caption={caps[4]} tape={3}><Memory kind={4} /></Polaroid></div>
                <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-10 block text-[clamp(34px,5vw,56px)]">{where}</E></div>
                {p.venue && p.city && <p data-rv className="h text-3xl text-[var(--t-muted)]">{p.city}</p>}
                <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="h mt-6 inline-flex rounded-full border-2 border-[var(--t-ink)] px-7 py-2.5 text-2xl transition hover:bg-[var(--t-ink)] hover:text-[var(--t-bg)]">{L.directions} →</a>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Title n={5}>{L.gallery}</Title>
                <div className={`grid gap-8 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                  {gallery.map((k, i) => (
                    <div key={k} data-rv className="su-pin">
                      <Polaroid style={{ transform: `rotate(${[-4, 3, -2, 5, -5, 2][i % 6]}deg)`, fontSize: "18px" }} tape={i}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </Polaroid>
                    </div>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} mx-auto max-w-xl`}>
                <div data-rv className="su-pin relative bg-[#fffef8] p-8 shadow-[0_24px_50px_-28px_rgba(30,40,30,.55)] md:p-10">
                  <Tape tone={2} className="-top-3 left-6 h-7 w-24 -rotate-6" /><Tape tone={1} className="-top-3 right-6 h-7 w-24 rotate-6" />
                  <p className="h text-center text-6xl">{L.rsvp}</p>
                  <p className="di mt-1 text-center text-lg text-[var(--t-muted)]">{L.attend}</p>
                  <div className="mt-8">{children}</div>
                </div>
              </section>
            ),
            info: info && (
              <section className={`${sec} mx-auto max-w-2xl text-center`}>
                <Title n={6}>{L.info}</Title>
                <E as="p" multiline path="texts.body" className="h block whitespace-pre-line text-3xl leading-snug">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative pb-14 pt-10 text-center">
        <Eucalyptus className="mx-auto w-16 rotate-90" />
        {p.blessing && <E as="p" path="profile.blessing" className="h mt-4 block text-4xl text-[var(--t-accent)]">{p.blessing}</E>}
        <p className="h mt-2 text-5xl">{a} {amp} {b}</p>
        <p className="cap mt-3 text-[var(--t-muted)]">{L.toWedding}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
