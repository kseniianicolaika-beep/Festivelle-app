"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { Eucalyptus, LongTable, FG_CSS } from "./art";
import { FONT_VARS, F } from "../_shared/fonts";
import { Sections, Countdown, Grain, HeroPhoto, tplVars } from "../_shared/ui";
import { useScene, useLenis, revealAll, burstFrom, gsap } from "../_shared/motion";
import { words, fmt, where, mapHref, media, dateParts, birthdayOf, lineOf } from "../_shared/words";

export const FG_VARS = { "--t-bg": "#f3f1ea", "--t-surface": "#fbfaf6", "--t-ink": "#26332a", "--t-muted": "#6e7b70", "--t-accent": "#5e7d63", "--t-gold": "#b4a276", "--foil-a": "#3f5a44", "--foil-b": "#c4b689" };
const LEAVES = ["#9fb5aa", "#b8c8be", "#8aa596", "#c7d3c9"];

function Head({ n, title }: { n: number; title: string }) {
  return (
    <div data-r className="mb-10 flex items-baseline gap-5 border-b border-[var(--t-ink)]/20 pb-4 md:mb-14">
      <span className="text-sm italic text-[var(--t-accent)]" style={{ fontFamily: F.fraun }}>No. {String(n).padStart(2, "0")}</span>
      <h2 className="text-[2.2rem] font-light leading-none md:text-[3.4rem]" style={{ fontFamily: F.corm }}>{title}</h2>
    </div>
  );
}

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const [name] = nameParts(profile);
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const age = profile.age;
  useLenis(!compact);

  useScene(root, ({ q, reduced, el }) => {
    revealAll(q, { compact, reduced });
    if (compact || reduced) return;
    const tl = gsap.timeline({ delay: 0.2 });
    tl.from(q("header [data-stem]"), { drawSVG: 0, duration: 1.8, ease: "power2.inOut" })
      .from(q("header [data-stalk]"), { drawSVG: 0, duration: 0.4, stagger: 0.04 }, "<.5")
      .from(q("header [data-leaf] ellipse"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box", opacity: 0, duration: 1, stagger: 0.03, ease: "back.out(1.4)" }, "<.1")
      .from(q("[data-fifty]"), { opacity: 0, y: 30, filter: "blur(10px)", duration: 1.8, ease: "power3.out" }, 0.3)
      .from(q("[data-hero-in]"), { opacity: 0, y: 16, stagger: 0.1, duration: 1, ease: "power3.out" }, 1);
    q("section [data-stem]").forEach((s) => gsap.from(s, { drawSVG: 0, duration: 2, ease: "power2.inOut", scrollTrigger: { trigger: s, start: "top 85%", once: true } }));
    // gentle pointer parallax on the branches
    const branches = q("[data-par]");
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
      branches.forEach((b, i) => gsap.to(b, { x: x * (12 + i * 8), y: y * (8 + i * 6), duration: 1.4, ease: "power2.out" }));
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, [compact]);

  const shake = (e: React.MouseEvent) => {
    const host = root.current;
    if (!host) return;
    gsap.fromTo(e.currentTarget, { rotate: -3 }, { rotate: 0, duration: 1.2, ease: "elastic.out(1,.3)" });
    burstFrom(host, e.currentTarget, { colors: LEAVES, n: 26, shapes: ["circle"], angle: [60, 120], velocity: [40, 160], gravity: 120, size: 14, life: 4 });
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${FONT_VARS} fg-linen relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars("fifty-garden", theme, design, FG_VARS), fontFamily: F.montserrat }}>
      <style href="cel-fg" precedence="default">{FG_CSS}</style>
      <Grain opacity={0.08} />

      <header className={`relative flex flex-col overflow-hidden px-5 md:px-12 ${compact ? "min-h-[640px] pb-10 pt-6" : "min-h-[100svh] pb-12 pt-8"}`}>
        {/* masthead */}
        <div data-hero-in className="relative z-10 flex items-center justify-between border-b border-[var(--t-ink)]/25 pb-3 text-[10px] uppercase tracking-[0.35em] md:text-[11px]">
          <span>{L.invited}</span>
          <span className="hidden md:inline">{dp ? `${dp.weekday} · ${dp.day} ${dp.month}` : ""}</span>
          <span className="italic normal-case tracking-normal text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: "1.1em" }}>No. {age ?? "—"}</span>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <div data-par className="pointer-events-none absolute -left-16 top-[4%] w-[62%] max-w-[520px] md:-left-10 md:w-[42%]">
            <div className={compact ? "" : "fg-sway"}><Eucalyptus seed={3} className="w-full" /></div>
          </div>
          <div data-par className="pointer-events-none absolute -right-14 bottom-[6%] w-[56%] max-w-[480px] md:w-[36%]">
            <div className={compact ? "" : "fg-sway"} style={{ animationDelay: "-3s" }}><Eucalyptus seed={8} from={[290, 20]} ctrl={[200, 200]} to={[20, 280]} leaves={12} className="w-full" /></div>
          </div>
          {age ? (
            <p data-fifty aria-hidden className={`relative select-none font-[250] italic leading-[0.8] tracking-[-0.05em] text-[var(--t-accent)] ${compact ? "text-[220px]" : "text-[clamp(14rem,55vw,34rem)]"}`} style={{ fontFamily: F.fraun, fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{age}</p>
          ) : null}
          <h1 className={`relative -mt-[0.1em] text-center font-light leading-[0.95] ${compact ? "text-[54px]" : "text-[clamp(3.4rem,10vw,7.5rem)]"}`} style={{ fontFamily: F.corm }}>
            <E path="profile.partner1" className="italic">{name}</E>
          </h1>
          <p data-hero-in className="relative mt-3 text-[11px] uppercase tracking-[0.45em] text-[var(--t-muted)]">{lineOf(profile)}</p>
        </div>

        <div data-hero-in className="relative z-10 grid grid-cols-2 gap-4 border-t border-[var(--t-ink)]/25 pt-4 text-[11px] uppercase tracking-[0.25em] md:grid-cols-3">
          <span>{fmt(profile)}</span>
          {venue && <E path={profile.venue ? "profile.venue" : "profile.city"} className="text-right md:text-center">{[profile.venue, profile.city].filter(Boolean).join(", ")}</E>}
          {!compact && <Countdown date={profile.date}>{(d) => <span className="hidden text-right md:block"><span className="italic normal-case tracking-normal text-[var(--t-accent)]" style={{ fontFamily: F.fraun, fontSize: "1.4em" }}>{d}</span> {L.until}</span>}</Countdown>}
        </div>
      </header>

      <Sections
        design={design}
        className="relative mx-auto max-w-6xl px-5 md:px-12"
        render={{
          invitation: (
            <section className="relative grid gap-10 py-20 md:grid-cols-[1fr_2fr] md:py-32">
              <div data-r className="text-[11px] uppercase tracking-[0.4em] text-[var(--t-accent)]">{birthdayOf(profile)}<span className="mt-3 block h-px w-16 bg-current" /></div>
              <E as="p" multiline path="profile.inviteLine" className="block text-[2rem] font-light italic leading-[1.25] md:text-[3.4rem]" style={{ fontFamily: F.corm }}>“{profile.inviteLine || occasionInvite(profile)}”</E>
            </section>
          ),
          story: (profile.story || heroUrl) ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.about} />
              <div className="grid gap-10 md:grid-cols-[5fr_6fr] md:gap-16">
                <figure data-r className="relative">
                  <div className="aspect-[4/5] overflow-hidden bg-[#dfe5dc]"><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                  <figcaption className="mt-3 text-[11px] italic text-[var(--t-muted)]" style={{ fontFamily: F.fraun }}>Fig. 1 — {name}</figcaption>
                  <Eucalyptus seed={5} leaves={8} className="pointer-events-none absolute -right-10 -top-12 w-40 rotate-12" />
                </figure>
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.45rem] font-light leading-[1.6] first-letter:float-left first-letter:mr-2 first-letter:text-[5.2rem] first-letter:italic first-letter:leading-[0.85] first-letter:text-[var(--t-accent)] md:text-[1.7rem]" style={{ fontFamily: F.corm }}>{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.details} />
              <dl className="grid md:grid-cols-3">
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="border-t border-[var(--t-ink)]/15 py-8 md:border-l md:border-t-0 md:px-8 md:first:border-l-0 md:first:pl-0">
                    <dt className="text-[10px] uppercase tracking-[0.4em] text-[var(--t-accent)]">{x.k}</dt>
                    <dd className="mt-3">
                      {x.path ? <E as="p" path={x.path} className="block text-[2.2rem] font-light leading-tight" style={{ fontFamily: F.corm }}>{x.v}</E> : <p className="text-[2.2rem] font-light leading-tight" style={{ fontFamily: F.corm }}>{x.v}</p>}
                      {x.s && <p className="mt-1 text-sm capitalize text-[var(--t-muted)]">{x.s}</p>}
                    </dd>
                  </div>
                ))}
              </dl>
              {calendarUrl && <a data-r href={calendarUrl} className="mt-8 inline-block rounded-full border border-[var(--t-ink)]/40 px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--t-ink)] hover:text-[var(--t-bg)]">{L.calendar}</a>}
            </section>
          ) : null,
          schedule: profile.events?.length ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.evening} />
              {profile.events!.map((e, i) => (
                <div key={i} data-r data-d={i * 0.08} className="grid grid-cols-[6rem_1fr] items-baseline gap-6 border-b border-[var(--t-ink)]/15 py-7 md:grid-cols-[12rem_1fr_auto]">
                  <span className="text-2xl italic text-[var(--t-accent)] md:text-3xl" style={{ fontFamily: F.fraun }}>{e.time}</span>
                  <p className="text-[1.9rem] font-light leading-tight md:text-[2.6rem]" style={{ fontFamily: F.corm }}>{e.name}</p>
                  {e.venue && <span className="col-start-2 text-[11px] uppercase tracking-[0.3em] text-[var(--t-muted)] md:col-start-3">{e.venue}</span>}
                </div>
              ))}
            </section>
          ) : null,
          venue: venue ? (n) => (
            <section className="relative py-20 md:py-28">
              <Head n={n} title={L.venue} />
              <div className="grid items-end gap-10 md:grid-cols-[1fr_1.4fr]">
                <div data-r>
                  <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="block text-[3rem] font-light italic leading-[0.95] md:text-[5rem]" style={{ fontFamily: F.corm }}>{profile.venue || profile.city}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-3 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{profile.city}</E>}
                  <a href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-full bg-[var(--t-ink)] px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-[var(--t-bg)] transition hover:bg-[var(--t-accent)]">{L.directions} →</a>
                </div>
                <button type="button" onClick={shake} aria-label="Table" className="relative cursor-pointer outline-none"><LongTable className="w-full" /></button>
              </div>
            </section>
          ) : null,
          gallery: gallery.length ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.gallery} />
              <div className={`grid grid-cols-2 gap-4 ${compact ? "" : "md:grid-cols-4"}`}>
                {gallery.map((k, i) => (
                  <figure key={k} data-r data-d={(i % 4) * 0.08} className={i % 5 === 0 ? "col-span-2 row-span-2" : ""}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </figure>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.reply} />
              <div data-r className="relative mx-auto max-w-2xl bg-[var(--t-surface)] px-6 py-12 shadow-[0_30px_60px_-40px_rgba(38,51,42,.5)] md:px-12">
                <Eucalyptus seed={11} leaves={7} className="pointer-events-none absolute -left-10 -top-10 w-32 -rotate-12" />
                {children}
              </div>
            </section>
          ) : null,
          info: info ? (n) => (
            <section className="relative py-20">
              <Head n={n} title={L.info} />
              <E as="p" multiline path="texts.body" className="block max-w-2xl whitespace-pre-line text-lg leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />

      <footer className="relative px-6 pb-14 pt-16 text-center">
        <Eucalyptus seed={2} leaves={9} from={[20, 150]} ctrl={[150, 100]} to={[280, 150]} className="mx-auto w-56" />
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-2 block text-3xl font-light italic" style={{ fontFamily: F.corm }}>{profile.blessing}</E>}
        <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{name} · {age ?? ""}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
