"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Cake, Drape, VC_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, lineOf, birthdayOf } from "../_shared/words";

export const VC_VARS = { "--t-bg": "#2b0b14", "--t-surface": "#3a1120", "--t-ink": "#f7e6e0", "--t-muted": "#d2afa8", "--t-accent": "#f08aa0", "--t-gold": "#d8a657", "--foil-a": "#8b5e22", "--foil-b": "#f5d58f" };
const CONF = ["#f5d58f", "#d8a657", "#f3a7b5", "#ffffff", "#e2526b"];

function Head({ title, script }: { title: string; script?: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      {script && <p className="text-3xl text-[var(--t-accent)] md:text-4xl" style={{ fontFamily: F.vibes }}>{script}</p>}
      <h2 className="vc-foil text-[2.4rem] italic leading-none md:text-[3.8rem]" style={{ fontFamily: F.playfair }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [wished, setWished] = useState(false);
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
    const iris = q("[data-iris]")[0] as HTMLElement | undefined;
    if (iris) iris.style.animation = "none";
    const tl = gsap.timeline();
    tl.fromTo(iris ?? [], { clipPath: "circle(0% at 50% 46%)" }, { clipPath: "circle(150% at 50% 46%)", duration: 2.2, ease: "power3.inOut", delay: 0.3, clearProps: "clipPath" })
      .from(q("[data-drape='l']"), { xPercent: 40, duration: 2, ease: "power3.out" }, "<.3")
      .from(q("[data-drape='r']"), { xPercent: -40, duration: 2, ease: "power3.out" }, "<")
      .from(q("[data-cake]"), { y: 60, opacity: 0, duration: 1.6, ease: "power3.out" }, "<.3")
      .from(q("[data-hero-in]"), { y: 24, opacity: 0, filter: "blur(6px)", stagger: 0.12, duration: 1.2, ease: "power3.out" }, "<.3");
  }, [compact]);

  const wish = () => {
    const host = root.current;
    if (!host || wished) return;
    setWished(true);
    const cake = host.querySelector("[data-cake]");
    const flames = host.querySelectorAll("[data-cake] [data-flame]");
    const smoke = host.querySelectorAll("[data-cake] [data-smoke]");
    gsap.to(flames, { scaleY: 0, scaleX: 0.4, opacity: 0, duration: 0.35, stagger: 0.12, ease: "power2.in" });
    gsap.fromTo(smoke, { opacity: 0, y: 0, drawSVG: "0% 0%" }, { opacity: 0.8, y: -18, drawSVG: "0% 100%", duration: 1.2, stagger: 0.12, delay: 0.2, ease: "power1.out" });
    gsap.to(smoke, { opacity: 0, y: -40, duration: 1.4, delay: 1.6, stagger: 0.1 });
    if (cake) setTimeout(() => burstFrom(host, cake, { colors: CONF, n: 80, shapes: ["rect", "strip", "circle"], angle: [230, 310], velocity: [500, 1000], gravity: 800, size: 9 }, -80), 800);
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} vc-velvet relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("velvet-cake", theme, design, VC_VARS), fontFamily: F.cormG }}>
      <style href="cel-vc" precedence="default">{VC_CSS}</style>

      <header data-iris className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[700px] pb-10 pt-12" : "vc-iris min-h-[100svh] pb-12 pt-14"}`} style={{ background: "radial-gradient(55% 45% at 50% 52%, rgba(255,190,150,.22), transparent 70%)" }}>
        <div data-drape="l" className={`pointer-events-none absolute inset-y-0 left-0 ${compact ? "w-[70px]" : "w-[18vw] max-w-[220px]"}`}><Drape className="h-full w-full" /></div>
        <div data-drape="r" className={`pointer-events-none absolute inset-y-0 right-0 ${compact ? "w-[70px]" : "w-[18vw] max-w-[220px]"}`}><Drape flip className="h-full w-full" /></div>
        <Grain opacity={0.16} blend="overlay" freq={1.1} />

        <p data-hero-in className="relative text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
        <h1 className={`relative mt-3 italic leading-[0.95] ${compact ? "text-[60px]" : "text-[clamp(3.8rem,12vw,8.5rem)]"}`} style={{ fontFamily: F.playfair }}>
          <E path="profile.partner1" className="vc-foil vc-shine">{name}</E>
        </h1>
        <p data-hero-in className={`relative text-[var(--t-accent)] ${compact ? "text-4xl" : "text-[2.6rem] md:text-6xl"}`} style={{ fontFamily: F.vibes }}>{lineOf(profile)}</p>

        <button type="button" data-cake onClick={compact ? undefined : wish} aria-label={L.blow} className={`relative mt-4 outline-none ${compact ? "w-[230px] cursor-default" : "w-[min(62vw,300px)] cursor-pointer md:w-[330px]"}`}>
          {age ? <span aria-hidden className="vc-foil absolute -right-6 top-[12%] italic leading-none opacity-90 md:-right-20" style={{ fontFamily: F.playfair, fontSize: compact ? "64px" : "clamp(4rem,12vw,7rem)" }}>{age}</span> : null}
          <Cake className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" />
        </button>

        {!compact && <p data-hero-in className="relative mt-4 text-sm italic text-[var(--t-muted)]">{wished ? `✦ ${L.wished} ✦` : L.blow}</p>}
        <div data-hero-in className="relative mt-6 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-px w-12 bg-current" /><p className="text-2xl italic text-[var(--t-ink)]" style={{ fontFamily: F.playfair }}>{fmt(profile)}</p><span className="h-px w-12 bg-current" /></div>
        {venue && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
      </header>

      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <p data-r className="text-5xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{birthdayOf(profile)}</p>
              <E as="p" multiline path="profile.inviteLine" className="mt-6 block text-[1.9rem] italic leading-[1.4] md:text-[2.8rem]" style={{ fontFamily: F.playfair }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-8 text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]"><span className="vc-foil mr-2 text-3xl italic tracking-normal" style={{ fontFamily: F.playfair }}>{d}</span>{L.until}</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
              <div data-r className="relative mx-auto w-[min(76vw,380px)]">
                <div className="aspect-[4/5] rounded-[200px_200px_12px_12px] p-[3px]" style={{ background: "linear-gradient(135deg,#f5d58f,#8b5e22,#f5d58f)" }}>
                  <div className="h-full w-full overflow-hidden rounded-[198px_198px_10px_10px] bg-[#4a0f22]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <Head title={L.about} script={name} />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.45rem] leading-[1.65] md:text-[1.6rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head title={L.details} />
              <div className="grid gap-px overflow-hidden rounded-[24px] border border-[var(--t-gold)]/40 bg-[var(--t-gold)]/30 md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="bg-[#33101c] px-6 py-12 text-center">
                    <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--t-gold)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className="mt-4 block text-[2rem] italic leading-tight" style={{ fontFamily: F.playfair }}>{x.v}</E> : <p className="mt-4 text-[2rem] italic leading-tight" style={{ fontFamily: F.playfair }}>{x.v}</p>}
                    {x.s && <p className="mt-1 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-gold)]/60 px-6 py-2.5 text-[11px] uppercase tracking-[0.35em] text-[var(--t-gold)] transition hover:bg-[var(--t-gold)]/10">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head title={L.evening} />
              {profile.events!.map((e, i) => (
                <div key={i} data-r data-d={i * 0.08} className="flex items-baseline gap-4 py-5">
                  <p className="shrink-0 text-[1.6rem] italic md:text-[2.2rem]" style={{ fontFamily: F.playfair }}>{e.name}</p>
                  <span className="mb-2 flex-1 border-b border-dotted border-[var(--t-gold)]/60" />
                  <span className="shrink-0 text-sm uppercase tracking-[0.3em] text-[var(--t-gold)]">{e.time}</span>
                </div>
              ))}
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="vc-foil vc-shine block text-[3rem] italic leading-none md:text-[5.5rem]" style={{ fontFamily: F.playfair }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-[var(--t-gold)] px-7 py-3 text-[11px] uppercase tracking-[0.35em] text-[#2b0b14] transition hover:brightness-110">{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-[14px] border border-[var(--t-gold)]/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head title={L.reply} />
              <div data-r className="rounded-[28px] border border-[var(--t-gold)]/50 bg-[#33101c]/90 px-6 py-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)] md:px-12">{children}</div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
              <Head title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-14 pt-10 text-center">
        <Cake lit={false} candles={3} className="mx-auto w-24 opacity-90" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-4 block text-4xl text-[var(--t-accent)]" style={{ fontFamily: F.vibes }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
