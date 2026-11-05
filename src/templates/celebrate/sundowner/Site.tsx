"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Sun, Palm, Shimmer, Wave, SKY, SEA, SD_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, lineOf } from "../_shared/words";

export const SD_VARS = { "--t-bg": "#16152b", "--t-surface": "#211d3a", "--t-ink": "#fff3e3", "--t-muted": "#d9b9a6", "--t-accent": "#ff9b5e", "--t-gold": "#ffc47a", "--foil-a": "#f0603c", "--foil-b": "#ffe0a3" };
const SPARKS = ["#ffc47a", "#ff9b5e", "#ffe0a3", "#f0603c", "#ffffff"];

function Head({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div data-r className="mb-10 md:mb-14">
      {kicker && <p className="sd-hand text-2xl text-[var(--t-accent)] md:text-3xl">{kicker}</p>}
      <h2 className="text-[2.6rem] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] md:text-[4.6rem]" style={{ fontFamily: F.brico }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [party, setParty] = useState(false);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const age = profile.age;
  useLenis(!compact);

  useScene(root, ({ q, reduced }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const tl = gsap.timeline();
    tl.from(q("[data-sky]"), { opacity: 0, duration: 1.4, ease: "power2.out" })
      .from(q("[data-sun]"), { yPercent: -90, duration: 2.4, ease: "power3.out" }, 0.2)
      .from(q("[data-palm]"), { y: 120, opacity: 0, duration: 1.6, stagger: 0.15, ease: "power3.out" }, 0.4)
      .from(q("[data-hero-in]"), { y: 30, opacity: 0, duration: 1.1, stagger: 0.1, ease: "power3.out" }, 0.9);
    const hero = q("header")[0];
    gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(q("[data-sun]"), { yPercent: 70, ease: "none" }, 0)
      .to(q("[data-night]"), { opacity: 0.92, ease: "none" }, 0)
      .to(q("[data-shim]"), { opacity: 0.15, ease: "none" }, 0);
  }, [compact]);

  const drop = () => {
    const host = root.current;
    const sun = host?.querySelector("[data-sun]");
    setParty((p) => !p);
    if (host && sun) burstFrom(host, sun, { colors: SPARKS, n: 50, shapes: ["circle", "strip"], angle: [200, 340], velocity: [300, 800], gravity: 700, size: 9 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] ${party ? "sd-party" : ""}`} style={{ ...tplVars("sundowner", theme, design, SD_VARS), fontFamily: F.brico }}>
      <style href="cel-sd" precedence="default">{SD_CSS}</style>

      <header className={`relative overflow-hidden ${compact ? "h-[680px]" : "h-[100svh] min-h-[640px]"}`}>
        {/* sky */}
        <div data-sky className="absolute inset-x-0 top-0 h-[62%]" style={{ background: SKY }} />
        <div data-night aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[62%] opacity-0" style={{ background: "linear-gradient(180deg,#07081a 0%,#14163a 70%,#2b2552 100%)" }}>
          {Array.from({ length: 40 }, (_, i) => <span key={i} className="absolute rounded-full bg-white" style={{ left: `${(i * 53) % 100}%`, top: `${(i * 29) % 70}%`, width: 1 + (i % 3), height: 1 + (i % 3), opacity: 0.4 + (i % 5) * 0.12 }} />)}
        </div>
        {/* age numeral sits on the horizon; sun behind; both clipped by the horizon */}
        <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden">
          <div data-sun className={`absolute left-1/2 -translate-x-1/2 ${compact ? "bottom-[-90px] w-[300px]" : "bottom-[-12vmin] w-[min(74vw,440px)]"}`} onClick={compact ? undefined : drop} role={compact ? undefined : "button"} aria-label="Sun" style={{ cursor: compact ? undefined : "pointer" }}>
            <Sun className="w-full" />
          </div>
          {age ? <p data-hero-in aria-hidden className={`absolute inset-x-0 bottom-[-0.12em] select-none text-center font-extrabold leading-[0.8] tracking-[-0.06em] text-[#fff3e3] mix-blend-soft-light ${compact ? "text-[200px]" : "text-[clamp(10rem,34vw,22rem)]"}`}>{age}</p> : null}
        </div>
        {/* sea */}
        <div className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden" style={{ background: SEA }}>
          {age ? <p aria-hidden className={`absolute inset-x-0 top-[-0.2em] select-none text-center font-extrabold leading-[0.8] tracking-[-0.06em] text-[#ffc47a] opacity-[.08] blur-[3px] ${compact ? "text-[200px]" : "text-[clamp(10rem,34vw,22rem)]"}`} style={{ transform: "scaleY(-1)" }}>{age}</p> : null}
          <div data-shim className="absolute left-1/2 top-0 h-[42%] w-[min(90vw,560px)] -translate-x-1/2"><Shimmer className="h-full w-full" lines={compact ? 10 : 16} /></div>
        </div>
        <div className="absolute inset-x-0 top-[62%] h-px bg-[#ffe0a3]/70" />
        {/* palms */}
        <div data-palm className={`pointer-events-none absolute bottom-[30%] ${compact ? "-left-14 w-[190px]" : "-left-16 w-[min(46vw,340px)] md:-left-6"}`}><Palm className="w-full" /></div>
        <div data-palm className={`pointer-events-none absolute bottom-[34%] ${compact ? "-right-16 w-[160px]" : "-right-14 w-[min(40vw,300px)] md:right-0"}`}><Palm flip className="w-full" /></div>
        <Grain opacity={0.12} blend="overlay" />

        {/* words */}
        <div className={`absolute inset-x-0 top-0 flex flex-col items-center px-5 text-center ${compact ? "pt-12" : "pt-[9svh] md:pt-[6svh]"}`}>
          <p data-hero-in className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[#ffe0a3]">{L.invited}</p>
          <h1 data-hero-in className={`mt-2 font-extrabold uppercase leading-[0.86] tracking-[-0.04em] text-[#fff8ec] drop-shadow-[0_6px_30px_rgba(90,20,60,.35)] ${compact ? "text-[60px]" : "text-[clamp(3.8rem,15vw,10rem)]"}`}>
            <E path="profile.partner1">{name}</E>
          </h1>
          <p data-hero-in className={`sd-hand -mt-1 text-[#fff8ec] [text-shadow:0_2px_16px_rgba(90,20,60,.6)] ${compact ? "text-3xl" : "text-[2.2rem] md:text-5xl"}`}>{lineOf(profile)}</p>
        </div>
        <div className={`absolute inset-x-0 bottom-0 flex flex-col items-center px-5 text-center ${compact ? "pb-8" : "pb-[6svh]"}`}>
          <Wave live={!compact} className="h-10 w-[min(80vw,420px)] text-[#ffc47a]/80" bars={compact ? 36 : 56} />
          <p data-hero-in className="mt-4 text-lg font-bold uppercase tracking-[0.08em] md:text-2xl">{dp ? `${dp.weekday} · ${dp.day} ${dp.month}` : fmt(profile)}</p>
          {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-1 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
          {!compact && <p data-hero-in className="sd-hand mt-3 text-xl text-[var(--t-accent)]">{party ? "♫ ♪ ♫" : "tap the sun ↑"}</p>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-6xl px-5 md:px-12"
        render={{
          invitation: (
            <section className="relative py-24 md:py-32">
              <E as="p" multiline path="profile.inviteLine" className="block text-[2.2rem] font-bold leading-[1.05] tracking-[-0.02em] md:text-[4.6rem]">{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="sd-hand mt-8 text-3xl text-[var(--t-accent)]">{d} {L.until} ☀︎</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative grid items-center gap-12 py-20 md:grid-cols-[1fr_1fr] md:py-28">
              <div data-r className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-[linear-gradient(180deg,#ec7a45,#2a1640)]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                <Sun className="absolute -right-8 -top-8 w-28" />
              </div>
              <div>
                <Head title={L.about} kicker={name} />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-lg leading-relaxed text-[var(--t-ink)]/85 md:text-xl">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative py-20 md:py-28">
              <Head title={L.details} kicker="golden hour" />
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.monthShort}` : fmt(profile), s: dp ? `${dp.weekday} ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="relative overflow-hidden rounded-[28px] p-7" style={{ background: ["linear-gradient(160deg,#ec7a45,#b33f4f)", "linear-gradient(160deg,#ffc47a,#ec7a45)", "linear-gradient(160deg,#3b4f7a,#13233f)"][i] }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] opacity-80">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-10 block text-[2.4rem] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">{x.v}</E> : <p className="mt-10 text-[2.6rem] font-extrabold uppercase leading-[0.9] tracking-[-0.02em]">{x.v}</p>}
                    {x.s && <p className="mt-2 text-sm capitalize opacity-85">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <a data-r href={calendarUrl} className="mt-8 inline-flex rounded-full bg-[var(--t-ink)] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[var(--t-bg)] transition hover:bg-[var(--t-gold)]">+ {L.calendar}</a>}
            </section>
          ) : null,
          schedule: profile.events?.length ? () => (
            <section className="relative py-20 md:py-28">
              <Head title={L.evening} kicker="the set" />
              {profile.events!.map((e, i) => (
                <div key={i} data-r data-d={i * 0.08} className="grid grid-cols-[5.5rem_1fr] items-center gap-5 border-t border-white/15 py-6 md:grid-cols-[9rem_1fr_auto]">
                  <span className="sd-hand text-3xl text-[var(--t-gold)] md:text-4xl">{e.time}</span>
                  <p className="text-2xl font-extrabold uppercase leading-none tracking-[-0.01em] md:text-5xl">{e.name}</p>
                  <Wave live={!compact} bars={16} className="hidden h-8 w-28 text-[var(--t-accent)] md:flex" />
                </div>
              ))}
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative py-20 md:py-28">
              <div data-r className="relative overflow-hidden rounded-[36px] px-7 pb-10 pt-40 md:px-14 md:pt-56" style={{ background: `${SKY}` }}>
                <Sun className="absolute left-1/2 top-6 w-56 -translate-x-1/2 md:w-80" />
                <div className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: SEA }} />
                <Palm className="absolute -left-10 bottom-[30%] w-40 md:w-60" />
                <div className="relative">
                  <p className="sd-hand text-3xl text-[#ffe0a3]">{L.venue}</p>
                  <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[3.2rem] font-extrabold uppercase leading-[0.85] tracking-[-0.03em] md:text-[7rem]">{profile.venue || profile.city}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-2 block text-xs font-semibold uppercase tracking-[0.4em] text-[#ffe0a3]">{profile.city}</E>}
                  <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#fff3e3] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#2a1640] transition hover:bg-[#ffc47a]">{L.directions} →</a>
                </div>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative py-20">
              <Head title={L.gallery} />
              <div className={`flex snap-x gap-4 overflow-x-auto pb-4 ${compact ? "" : "md:grid md:grid-cols-3 md:overflow-visible"}`}>
                {gallery.map((k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={k} data-r data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-[70%] shrink-0 snap-center rounded-[24px] object-cover md:w-full" />
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative py-20">
              <Head title={L.reply} kicker="see you at sunset" />
              <div data-r className="rounded-[32px] border border-white/15 bg-white/[.06] p-6 backdrop-blur-xl md:p-12">{children}</div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative py-20">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block max-w-2xl whitespace-pre-line text-lg leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative overflow-hidden px-6 pb-14 pt-16 text-center">
        <Sun className="mx-auto w-32" />
        {profile.blessing && <E as="p" path="profile.blessing" className="sd-hand mt-2 block text-4xl text-[var(--t-gold)]">{profile.blessing}</E>}
        <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.2em]">{name}{age ? ` · ${age}` : ""}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
