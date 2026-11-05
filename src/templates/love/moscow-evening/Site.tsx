"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { GRAIN, LENIS_CSS, Sections, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { Birch, Doily, LaceBand, Mansion, Seal, snow } from "./art";
import { Envelope } from "./Envelope";

// MOSCOW EVENING — a letter from an old Moscow mansion. Snow, silver birches, an ivory envelope sealed in wax:
// the seal lifts, the flap opens and the letter rises; the rest of the site reads like that letter.
export default function Site({ profile: p, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = nameParts(p);
  const L = labels(p);
  const cd = useCountdown(p.date, !compact);
  const where = p.venue || p.city || "";
  const date = formatDate(p.date, p.language);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const ru = p.language === "ru", hi = p.language === "hi";
  const amp = ru ? "и" : "&";
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    el.querySelectorAll(".me-birch").forEach((n, i) => gsap.to(n, { yPercent: i % 2 ? -12 : -6, ease: "none", scrollTrigger: { trigger: el.querySelector(".me-hero"), start: "top top", end: "bottom top", scrub: true } }));
    const env = el.querySelector(".me-env");
    if (env) gsap.to(env, { y: -60, scale: 0.94, opacity: 0.5, ease: "none", scrollTrigger: { trigger: el.querySelector(".me-hero"), start: "40% top", end: "bottom top", scrub: true } });
  });

  const sec = compact ? "px-6 py-12" : "px-6 py-16 md:px-16 md:py-24";
  const Head = ({ children: c }: { children: React.ReactNode }) => (
    <div data-rv className="mb-10 text-center">
      <p className="cap text-[var(--t-accent)]">{c}</p>
      <svg viewBox="0 0 120 10" className="mx-auto mt-3 w-28" aria-hidden><path d="M0 5h48M72 5h48" stroke="var(--t-gold)" strokeWidth=".6" /><path d="M54 5c2-4 4-4 6 0s4 4 6 0" fill="none" stroke="var(--t-gold)" strokeWidth=".8" /></svg>
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "lora")} className={`me ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-me" precedence="default">{CSS + LENIS_CSS}</style>

      {/* ── Intro: winter dusk, birches, the sealed letter ── */}
      <header data-section="intro" className={`me-hero relative overflow-hidden ${compact ? "min-h-[640px]" : "min-h-[100svh]"}`} style={{ background: "linear-gradient(180deg,#5f6f86 0%,#9aa6b8 30%,#d9d6cf 62%,var(--t-bg) 100%)" }}>
        <Mansion className="absolute bottom-[4%] left-1/2 w-[min(1100px,180%)] -translate-x-1/2 opacity-[.18]" />
        <div aria-hidden className={`absolute inset-0 opacity-90 ${compact ? "" : "me-snow"}`} style={snow(1)} />
        <Birch className={`me-birch absolute -left-6 bottom-0 h-[105%] ${compact ? "w-20" : "w-24 md:w-40"}`} />
        <Birch flip className={`me-birch absolute bottom-0 right-[2%] h-[90%] opacity-90 ${compact ? "w-16" : "w-20 md:w-32"}`} />
        <Birch className={`me-birch absolute bottom-0 right-[-3%] hidden h-[110%] md:block ${compact ? "md:hidden" : "w-36"}`} />
        <div className={`relative z-[2] mx-auto flex ${compact ? "min-h-[640px]" : "min-h-[100svh]"} max-w-3xl flex-col items-center justify-end px-6 ${compact ? "pb-14" : "pb-[8vh]"}`}>
          <Envelope a={a} b={b} opened={compact} className={`me-env w-full ${compact ? "max-w-[330px]" : "max-w-[560px]"}`} style={{ ["--rise" as string]: "-58%", containerType: "inline-size" } as React.CSSProperties}>
            <div className="flex h-full flex-col items-center justify-start px-[6%] pt-[7%] text-center">
              <p className="cap text-[var(--t-accent)]" style={{ fontSize: "2.2cqw" }}>{L.engagementOf}</p>
              <h1 className="d mt-[2%] leading-[.95]" style={{ fontSize: "11cqw" }}>
              <span style={{ fontSize: `${fitName(a, b, 8, true)}em` }}>
                <E path="profile.partner1">{a}</E>
                {b && <span className="h mx-[.2em] text-[.6em] text-[var(--t-accent)]">{amp}</span>}
                {b && <E path="profile.partner2">{b}</E>}
              </span>
            </h1>
              <p className="it mt-[2%]" style={{ fontSize: "3.6cqw" }}>{date}{where && <> · <E path={p.venue ? "profile.venue" : "profile.city"}>{where}</E></>}</p>
            </div>
          </Envelope>
        </div>
      </header>

      {/* ── The letter ── */}
      <main className="relative z-[2] mx-auto -mt-2 max-w-4xl px-3 pb-12 md:px-6">
        <div className="relative bg-[var(--t-surface)] shadow-[0_40px_80px_-50px_rgba(60,40,20,.5)]" style={{ backgroundImage: GRAIN }}>
          <div className="absolute inset-x-0 -top-[33px] h-[34px]"><LaceBand id="me-top" className="h-full w-full" flip /></div>
          <div className="pointer-events-none absolute inset-4 border border-[var(--t-gold)]/40 md:inset-6" />
          <Sections
            design={design}
            render={{
              invitation: (
                <section className={`${sec} relative`}>
                  <p data-rv className="h ink text-3xl md:text-4xl">{ru ? "Дорогие наши," : hi ? "प्रिय मित्रों," : "Dearest friends,"}</p>
                  <div data-rv><E as="p" multiline path="profile.inviteLine" className="h ink lined mt-4 block text-[26px] md:text-[34px]">{p.inviteLine || occasionInvite(p)}</E></div>
                  <p data-rv className="h ink mt-6 text-right text-3xl md:text-4xl">{a}{b && <> {amp} {b}</>}</p>
                </section>
              ),
              story: p.story && (
                <section className={`${sec} relative`}>
                  <Head>{L.story}</Head>
                  <div className={`grid items-start gap-10 ${compact ? "" : "md:grid-cols-[.8fr_1.2fr]"}`}>
                    <figure data-rv className="relative mx-auto w-full max-w-[300px] rotate-[-2deg] bg-white p-3 pb-10 shadow-[0_20px_40px_-24px_rgba(60,40,20,.6)]">
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="aspect-[4/5] w-full object-cover [filter:sepia(.35)_saturate(.8)]" />
                      ) : (
                        <div data-edit-photo="hero" className="relative aspect-[4/5] w-full overflow-hidden bg-[#dfe3e8]"><Birch className="absolute left-1/4 h-full w-1/3" /></div>
                      )}
                      <figcaption className="h ink absolute inset-x-0 bottom-2 text-center text-xl">{p.city ?? ""}</figcaption>
                      {["-left-2 -top-2", "-right-2 -top-2 rotate-90", "-bottom-2 -right-2 rotate-180", "-bottom-2 -left-2 -rotate-90"].map((c) => <span key={c} className={`absolute h-6 w-6 ${c}`} style={{ background: "linear-gradient(135deg,#c9b99b 50%,transparent 50%)" }} />)}
                    </figure>
                    <div data-rv><E as="p" multiline path="profile.story" className="it block whitespace-pre-line text-[22px] leading-[1.7] first-letter:float-left first-letter:mr-2 first-letter:font-[family-name:var(--me-display)] first-letter:text-[3.6em] first-letter:not-italic first-letter:leading-[.85] first-letter:text-[var(--t-accent)] md:text-[24px]">{p.story}</E></div>
                  </div>
                </section>
              ),
              details: (p.date || where) && (
                <section className={`${sec} relative text-center`}>
                  <Head>{L.details}</Head>
                  <Doily className="mx-auto aspect-square w-[min(330px,82vw)]">
                    <div data-rv>
                      <p className="cap text-[var(--t-accent)]">{p.date ? new Date(p.date + "T12:00:00Z").toLocaleDateString(ru ? "ru-RU" : hi ? "hi-IN" : "en-GB", { weekday: "long", timeZone: "UTC" }) : ""}</p>
                      <p className="d mt-1 text-[84px] leading-none">{p.date ? Number(p.date.slice(8, 10)) : "—"}</p>
                      <p className="it text-xl">{date.replace(/^\d+\s*/, "")}</p>
                      {p.events?.[0]?.time && <p className="cap mt-2 text-[var(--t-muted)]">{p.events[0].time}</p>}
                    </div>
                  </Doily>
                  <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-8 block text-4xl">{where}</E></div>
                  {p.venue && p.city && <p data-rv className="it mt-1 text-xl text-[var(--t-muted)]">{p.city}</p>}
                  {cd && <p data-rv className="h ink mt-6 text-2xl">{ru ? `До нашего вечера — ${cd.d} ${L.days}` : hi ? `बस ${cd.d} ${L.days} शेष` : `${cd.d} ${L.days} until our evening`}</p>}
                </section>
              ),
              schedule: !!p.events?.length && (
                <section className={`${sec} relative`}>
                  <Head>{L.events}</Head>
                  <div data-rv className="mx-auto max-w-lg border border-[var(--t-gold)]/50 bg-[var(--t-bg)]/60 px-6 py-8 md:px-10">
                    <p className="d text-center text-3xl">{ru ? "Бальная книжка" : hi ? "शाम का क्रम" : "Carnet de bal"}</p>
                    <ol className="mt-6 space-y-5">
                      {p.events.map((e, i) => (
                        <li key={i} className="flex items-baseline gap-3">
                          <span className="it shrink-0 text-lg text-[var(--t-accent)]">{e.time}</span>
                          <span className="flex-1 border-b border-dotted border-[var(--t-gold)]" />
                          <span className="d shrink-0 text-right text-2xl">{e.name}</span>
                        </li>
                      ))}
                    </ol>
                    {calendarUrl && <div className="mt-8 text-center"><a href={calendarUrl} className="cap border-b border-[var(--t-accent)] pb-1 text-[var(--t-accent)]">{L.calendar}</a></div>}
                  </div>
                </section>
              ),
              venue: where && (
                <section className={`${sec} relative text-center`}>
                  <Head>{L.venue}</Head>
                  <Mansion className="mx-auto w-full max-w-xl" />
                  <div data-rv><E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d mt-6 block text-[clamp(34px,5vw,56px)] leading-tight">{where}</E></div>
                  {p.venue && p.city && <p data-rv className="it mt-1 text-xl text-[var(--t-muted)]">{p.city}</p>}
                  <a data-rv href={mapUrl(p)} target="_blank" rel="noreferrer" className="cap mt-8 inline-block border border-[var(--t-ink)]/60 px-6 py-3 transition hover:bg-[var(--t-ink)] hover:text-[var(--t-surface)]">{L.directions}</a>
                </section>
              ),
              gallery: gallery.length > 0 && (
                <section className={`${sec} relative`}>
                  <Head>{L.gallery}</Head>
                  <div className={`grid gap-6 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                    {gallery.map((k, i) => (
                      <figure key={k} data-rv className={`relative bg-white p-2.5 pb-6 shadow-[0_16px_30px_-20px_rgba(60,40,20,.6)] ${["-rotate-2", "rotate-1", "rotate-[2.5deg]", "-rotate-1"][i % 4]}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-square w-full object-cover [filter:sepia(.2)]" />
                      </figure>
                    ))}
                  </div>
                </section>
              ),
              rsvp: children && (
                <section className={`${sec} relative`}>
                  <Head>{L.rsvp}</Head>
                  <div data-rv className="mx-auto max-w-lg">
                    <p className="h ink mb-6 text-center text-3xl">{L.attend}</p>
                    {children}
                  </div>
                </section>
              ),
              info: info && (
                <section className={`${sec} relative`}>
                  <Head>{L.info}</Head>
                  <E as="p" multiline path="texts.body" className="h ink lined block whitespace-pre-line text-2xl">{info}</E>
                </section>
              ),
            }}
          />
          <div className="relative pb-16 pt-6 text-center">
            {p.blessing && <E as="p" path="profile.blessing" className="h ink block text-4xl">{p.blessing}</E>}
            <p className="h ink mt-2 text-3xl">{ru ? "Ваши" : hi ? "आपके" : "Yours,"} {a}{b && <> {amp} {b}</>}</p>
            <Seal a={a} b={b} className="mx-auto mt-6 h-20 w-20 text-[28px]" />
          </div>
          <div className="absolute inset-x-0 -bottom-[33px] h-[34px]"><LaceBand id="me-bot" className="h-full w-full" /></div>
        </div>
      </main>
      <footer className="relative pb-12 pt-12 text-center">
        <p className="cap text-[var(--t-muted)]">{date} · {p.city}</p>
        {credit && <div className="mt-8 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
