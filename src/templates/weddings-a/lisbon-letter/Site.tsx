"use client";
import { useRef, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { eventWhen, siteData, toRoman } from "../_shared/data";
import { revealOnScroll, useDaysLeft, useLenis, useScene } from "../_shared/motion";
import { ff, Photo, rootVars, Sec } from "../_shared/ui";
import { Bougainvillea, Church, Flourish, Postmark, Stamp, TileField, WaxSeal } from "./art";
import { FACES, FONTS, SALUTE } from "./faces";
import "./lisbon.css";

const PAGE = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix"];

export default function LisbonSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const S = siteData(profile, design);
  const { a, b, L, W, date } = S;
  const T = SALUTE[S.lang];
  const ini = b ? `${a[0] ?? ""}${b[0] ?? ""}` : (a[0] ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const days = useDaysLeft(profile.date);
  useLenis(!compact);

  const ready = useScene(ref, (k) => {
    const g = k.gsap;
    const stage = k.root.querySelector<HTMLElement>("[data-stage]");
    const letter = k.root.querySelector<HTMLElement>("[data-letter]");
    const env = k.root.querySelector<HTMLElement>("[data-env]");
    if (stage && letter && env) {
      const lr = letter.getBoundingClientRect(), er = env.getBoundingClientRect();
      const s0 = Math.min((er.height * 0.86) / lr.height, (er.width * 0.9) / lr.width);
      const dy = er.top + er.height / 2 - (lr.top + lr.height / 2);
      g.set([env, "[data-env-front]"], { display: "block" });
      g.set(letter, { opacity: 1, scale: s0, y: dy + er.height * 0.04 });
      g.set("[data-letter-copy]", { opacity: 0 });
      const tl = g.timeline({ defaults: { ease: "power3.inOut" } });
      tl.from([env, "[data-env-front]"], { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, 0)
        .to("[data-seal]", { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.9)
        .to("[data-seal-l]", { rotate: -18, x: -14, y: 10, opacity: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "power2.in" }, 1.4)
        .to("[data-seal-r]", { rotate: 16, x: 14, y: 12, opacity: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "power2.in" }, 1.4)
        .to("[data-flap]", { rotateX: 90, duration: 0.55, ease: "power2.in" }, 1.75)
        .set("[data-flap]", { opacity: 0 }, 2.3)
        .fromTo("[data-flap-back]", { rotateX: -90, opacity: 1 }, { rotateX: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, 2.3)
        .to(letter, { y: dy - er.height * 0.62, duration: 1.1, ease: "power2.out" }, 2.75)
        .to("[data-env-parts]", { y: "70%", opacity: 0, duration: 1, ease: "power2.in" }, 3.5)
        .set("[data-env-front]", { zIndex: 1 }, 3.4)
        .to(letter, { y: 0, scale: 1, duration: 1.3, ease: "power3.inOut" }, 3.55)
        .set([env, "[data-env-front]"], { display: "none" }, 4.7)
        .to("[data-letter-copy]", { opacity: 1, duration: 0.01 }, 4.2)
        .from("[data-letter-copy] > *", { y: 14, opacity: 0, filter: "blur(4px)", duration: 1.1, stagger: 0.1, ease: "power3.out" }, 4.2);
      const split = new k.Split("[data-names] .wa-name", { type: "chars", charsClass: "wa-ch" });
      tl.from(split.chars, { opacity: 0, y: 10, rotate: -6, duration: 0.9, stagger: 0.05, ease: "back.out(2)" }, 4.45);
      tl.from("[data-church] path", { drawSVG: "0%", duration: 2.4, stagger: 0.015, ease: "power1.inOut" }, 4.4);
    }
    if (compact) return;
    revealOnScroll(k, { y: 28 });
    k.q("[data-sheet]").forEach((el, i) => k.gsap.from(el, { y: 80, rotate: i % 2 ? 2.5 : -2.5, opacity: 0, duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
    k.q("[data-draw-on-scroll] path").forEach((el) => k.gsap.from(el, { drawSVG: "0%", duration: 2.2, ease: "power1.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
    k.gsap.to("[data-hero-tiles]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true } });
  }, [compact]);

  const has = (id: SectionId): boolean => {
    switch (id) {
      case "invitation": return S.occ !== "greeting";
      case "story": return !!profile.story;
      case "details": return !!(date || S.where);
      case "schedule": return S.events.length > 0;
      case "venue": return !!S.where;
      case "gallery": return S.gallery.length > 0;
      case "rsvp": return true;
      case "info": return !!S.info;
      default: return false;
    }
  };
  const vis = S.visible.filter(has);
  const pad = compact ? "px-6 py-14" : "px-6 py-16 @2xl:px-16 @2xl:py-20";
  const heading = (title: string, eyebrow?: string) => (
    <div data-reveal className="mb-10 flex flex-col items-center text-center">
      {eyebrow && <p className="wa-caps mb-3 text-[10px] text-[var(--t-muted)]">{eyebrow}</p>}
      <h2 className="text-[2.5rem] italic leading-none text-[var(--t-ink)] @2xl:text-[3.3rem]" style={ff.display}>{title}</h2>
      <Flourish className="mt-4 w-36 text-[var(--t-accent)]" />
    </div>
  );
  const sheet = (i: number, body: ReactNode, cls = "") => (
    <div data-sheet className={`lis-sheet lis-laid wa-paper relative mx-auto ${compact ? "w-[92%]" : "w-[min(92%,880px)]"} ${cls}`} style={{ rotate: compact ? undefined : `${i % 2 ? 0.35 : -0.35}deg` }}>
      <div className={`relative z-[2] ${pad}`}>{body}</div>
      <p className="absolute bottom-4 left-0 right-0 z-[2] text-center text-[11px] italic tracking-[0.2em] text-[var(--t-muted)]">— {PAGE[i] ?? i + 1} —</p>
    </div>
  );

  const section = (id: SectionId, i: number): ReactNode => {
    switch (id) {
      case "invitation":
        return sheet(i, (
          <div className="mx-auto max-w-2xl">
            <p data-reveal className="text-[2.1rem] text-[var(--t-accent)] @2xl:text-[2.6rem]" style={ff.script}>{T.dear}</p>
            <E as="p" multiline path="profile.inviteLine" className="mt-6 block text-[1.5rem] italic leading-[1.55] @2xl:text-[1.85rem]" style={ff.body}>{S.invite}</E>
            <figure data-reveal className="relative mx-auto mt-12 max-w-xl">
              <div className="relative p-[18px] shadow-[0_24px_50px_-28px_rgba(19,41,75,.6)]">
                <TileField size={36} className="absolute inset-0 h-full w-full" />
                <Photo src={heroUrl} className="relative block aspect-[4/5] w-full object-cover ring-4 ring-[#fbfcff]"
                  fallback={<div className="relative grid aspect-[4/5] w-full place-items-center bg-[#fbfcff] ring-4 ring-[#fbfcff]"><Church className="w-3/4 text-[var(--t-accent)]" /></div>} />
              </div>
              <Bougainvillea className="pointer-events-none absolute -right-10 -top-12 w-40 @2xl:-right-20 @2xl:w-52" seed={4} />
              <Bougainvillea className="pointer-events-none absolute -bottom-10 -left-10 w-32 rotate-180 @2xl:-left-16 @2xl:w-40" seed={9} />
            </figure>
            <div data-reveal className="mt-14 text-right">
              <p className="text-2xl text-[var(--t-muted)]" style={ff.script}>{T.love}</p>
              <p className="mt-1 text-[2.4rem] text-[var(--t-accent)]" style={ff.script}>{b ? `${a} & ${b}` : a}</p>
            </div>
          </div>
        ));
      case "story":
        return sheet(i, (
          <div className="mx-auto max-w-2xl">
            {heading(L.story)}
            <E as="p" multiline path="profile.story" className="lis-dropcap block whitespace-pre-line text-[1.35rem] leading-[1.75] @2xl:text-[1.55rem]" style={ff.body}>{profile.story}</E>
          </div>
        ));
      case "details":
        return sheet(i, (
          <div>
            {heading(L.details, T.mass)}
            <div className="grid items-center gap-10 @2xl:grid-cols-[1fr_1fr]">
              <div data-reveal data-draw-on-scroll className="mx-auto w-full max-w-xs text-[var(--t-accent)]"><Church className="w-full" /></div>
              <div data-reveal="0.1" className="text-center @2xl:text-left">
                {date && (
                  <>
                    <p className="wa-caps text-[10px] text-[var(--t-muted)]">{date.weekday}</p>
                    <p className="mt-2 text-[6.5rem] leading-[0.85] text-[var(--t-accent)]" style={{ fontFamily: "var(--wa-garamond), Georgia, serif" }}>{date.day}</p>
                    <p className="mt-1 text-3xl italic" style={ff.display}>{date.month} {date.year}</p>
                    <p className="mt-2 text-sm tracking-[0.3em] text-[var(--t-muted)]">{toRoman(+date.day)} · {toRoman(+date.mm)} · {toRoman(+date.year)}</p>
                  </>
                )}
                {S.where && (
                  <div className="mt-8 border-t border-[var(--t-accent)]/20 pt-6">
                    <E as="p" path={S.wherePath} className="block text-[1.9rem] italic leading-tight" style={ff.display}>{S.where}</E>
                    {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-1 block tracking-[0.25em] text-[var(--t-muted)]">{profile.city}</E>}
                  </div>
                )}
                {calendarUrl && <a href={calendarUrl} className="wa-btn mt-8 bg-[var(--t-accent)] text-white">✝ {L.calendar}</a>}
              </div>
            </div>
          </div>
        ));
      case "schedule":
        return sheet(i, (
          <div className="mx-auto max-w-2xl">
            {heading(L.events)}
            <ol className="space-y-7">
              {S.events.map((e, j) => (
                <li key={j} data-reveal={j * 0.08} className="grid grid-cols-[auto_1fr] items-baseline gap-x-5">
                  <span className="text-[1.7rem] italic text-[var(--t-accent)]" style={{ fontFamily: "var(--wa-garamond), Georgia, serif" }}>{e.time || toRoman(j + 1)}</span>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="shrink-0 text-[1.75rem] leading-tight" style={ff.display}>{e.name}</h3>
                      <span className="mb-1 h-px flex-1 border-b border-dotted border-[var(--t-accent)]/40" />
                    </div>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.22em] text-[var(--t-muted)]">{[eventWhen({ ...e, time: undefined }, S.lang), e.venue].filter(Boolean).join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ));
      case "venue":
        return sheet(i, (
          <div>
            {heading(L.venue)}
            <div data-reveal className="relative grid overflow-hidden border border-[var(--t-accent)]/25 bg-[#fbfcff] @2xl:grid-cols-2">
              <div className="relative min-h-[260px] overflow-hidden">
                <TileField size={70} className="absolute inset-0 h-full w-full" variant="estrela" />
                <div className="absolute inset-[14%] grid place-items-center bg-[#fbfcff]/92 p-4"><Church className="w-full text-[var(--t-accent)]" /></div>
              </div>
              <div className="relative p-8 @2xl:p-10">
                <Stamp className="absolute right-5 top-5 h-20 w-16 rotate-3" />
                <Postmark className="absolute right-12 top-16 w-40 -rotate-12 text-[var(--t-accent)] opacity-60" top={(profile.city || "GOA").toUpperCase()} mid={date ? `${date.dd}.${date.mm}.${date.year}` : ""} />
                <div className="mt-24 space-y-3">
                  <E as="p" path={S.wherePath} className="block border-b border-[var(--t-ink)]/20 pb-2 text-[1.7rem] italic" style={ff.display}>{S.where}</E>
                  {profile.venue && profile.city && <E as="p" path="profile.city" className="block border-b border-[var(--t-ink)]/20 pb-2 text-xl italic" style={ff.display}>{profile.city}</E>}
                  {S.goa && <p className="border-b border-[var(--t-ink)]/20 pb-2 text-xl italic" style={ff.display}>Goa, India</p>}
                </div>
                <a target="_blank" rel="noreferrer" href={S.map} className="wa-btn mt-8 border border-[var(--t-accent)] text-[var(--t-accent)] hover:bg-[var(--t-accent)] hover:text-white">{L.directions} →</a>
              </div>
            </div>
            {S.goa && (
              <div data-reveal className="mx-auto mt-10 max-w-xl text-center">
                <p className="wa-caps text-[10px] text-[var(--t-muted)]">{L.travel}</p>
                <p className="mt-3 text-lg italic leading-relaxed text-[var(--t-muted)]">{L.travelText}</p>
              </div>
            )}
          </div>
        ));
      case "gallery":
        return sheet(i, (
          <div>
            {heading(L.gallery)}
            <div className="grid grid-cols-2 gap-5 @2xl:grid-cols-3">
              {S.gallery.map((g, j) => (
                <div key={g.key} data-reveal={(j % 3) * 0.08} className="relative bg-white p-2 pb-8 shadow-[0_14px_30px_-16px_rgba(19,41,75,.5)]" style={{ rotate: `${[-2, 1.5, -1, 2, -1.5, 1][j % 6]}deg` }}>
                  <Photo slot="gallery" galleryKey={g.key} src={g.src} className="aspect-[4/5] w-full object-cover" />
                  <span className="lis-tape left-1/2 top-[-4%] -translate-x-1/2 rotate-[-3deg]" />
                </div>
              ))}
            </div>
          </div>
        ));
      case "rsvp":
        return sheet(i, (
          <div className="mx-auto max-w-xl">
            {heading(L.rsvp, T.reply)}
            <p data-reveal className="-mt-4 mb-8 text-center text-xl italic text-[var(--t-muted)]">{L.attend}</p>
            <div data-reveal className="relative p-[14px]">
              <TileField size={28} className="absolute inset-0 h-full w-full" variant="estrela" />
              <div className="relative bg-[var(--t-surface)] p-6 @2xl:p-9">{children}</div>
            </div>
          </div>
        ));
      case "info":
        return sheet(i, (
          <div className="mx-auto max-w-xl text-center">
            {heading(L.info)}
            <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl italic leading-relaxed text-[var(--t-muted)]">{S.info}</E>
          </div>
        ));
      default: return null;
    }
  };

  return (
    <div ref={ref} lang={profile.language ?? "en"} style={{ ...rootVars(theme, design, "lisbon-letter", FACES), ...ff.body }} className={`lis lis-wall relative overflow-hidden text-[var(--t-ink)] @container ${FONTS} ${ready ? "" : "wa-pre"}`}>
      {/* ── Hero: the envelope on an azulejo wall; it opens into the letter ── */}
      <header data-hero className={`relative isolate overflow-hidden ${compact ? "h-[700px]" : "h-[100svh] min-h-[700px]"}`} style={{ perspective: "1600px" }}>
        <div data-hero-tiles className="absolute -inset-y-[10%] inset-x-0"><TileField size={compact ? 90 : 128} className="h-full w-full" /></div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(10,26,72,.05),rgba(10,26,72,.4))]" />
        <div data-stage className="absolute inset-0 flex items-center justify-center">
          {/* the letter (final hero) */}
          <div data-letter data-in className="lis-laid wa-paper lis-sheet relative z-[3] flex h-[88%] w-[min(90%,620px)] flex-col items-center overflow-hidden text-center">
            <div className="relative z-[2] h-[46px] w-full shrink-0 @2xl:h-[56px]"><TileField size={compact ? 46 : 56} className="h-full w-full" variant="estrela" /></div>
            <div data-letter-copy className="relative z-[2] flex flex-1 flex-col items-center justify-evenly px-6 pb-6 pt-3">
              <p className="wa-caps text-[10px] text-[var(--t-muted)]">{S.occ === "wedding" ? W.wedding : S.line}</p>
              <h1 data-names className="flex flex-col items-center leading-[0.95] text-[var(--t-ink)]" style={ff.display}>
                <E path="profile.partner1" className="wa-name block text-[clamp(3rem,13cqw,5.6rem)] italic">{a}</E>
                {b && <span className="block text-[clamp(2.4rem,9cqw,3.6rem)] leading-[0.8] text-[var(--t-accent)]" style={ff.script}>&amp;</span>}
                {b && <E path="profile.partner2" className="wa-name block text-[clamp(3rem,13cqw,5.6rem)] italic">{b}</E>}
              </h1>
              <div data-church className="w-[min(58%,250px)] text-[var(--t-accent)]"><Church className="w-full" /></div>
              <div className="flex flex-col items-center gap-1.5">
                {date && <p className="text-[13px] uppercase tracking-[0.34em]">{date.weekday} · {date.full}</p>}
                {S.where && <E as="p" path={S.wherePath} className="block text-lg italic text-[var(--t-muted)]" style={ff.display}>{S.where}{profile.venue && profile.city ? `, ${profile.city}` : ""}</E>}
                {days !== null && days > 0 && <p className="mt-2 text-2xl text-[var(--t-accent)]" style={ff.script}>{days} {W.days}</p>}
              </div>
            </div>
            <Postmark className="absolute right-[4%] top-[64px] z-[3] w-[30%] max-w-[150px] -rotate-12 text-[var(--t-accent)] opacity-50 @2xl:top-[74px]" top={(profile.city || "GOA").toUpperCase()} mid={date ? `${date.dd}.${date.mm}.${date.year.slice(2)}` : ""} />
          </div>

          {/* the envelope (opening only): back half sits behind the letter, the pocket in front of it */}
          <div data-env className="lis-env absolute left-1/2 top-1/2 z-[1] aspect-[1.45/1] w-[min(94%,680px)] -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: "preserve-3d" }}>
            <div data-env-parts className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 overflow-hidden bg-[#eef1f7] shadow-[0_40px_80px_-30px_rgba(10,26,72,.7)]">
                <TileField size={40} className="absolute inset-[3%] h-[94%] w-[94%] opacity-90" />
              </div>
              {/* the flap once it has swung past upright: liner side showing, behind the letter */}
              <div data-flap-back className="absolute inset-x-0 bottom-full h-[62%] opacity-0" style={{ transformOrigin: "50% 100%" }}>
                <div className="absolute inset-0 overflow-hidden [clip-path:polygon(0_100%,100%_100%,55%_7%,50%_0,45%_7%)]">
                  <div className="absolute inset-0 bg-[#f2f4f9]" /><TileField size={30} className="absolute inset-[4%] h-[92%] w-[92%]" />
                </div>
              </div>
            </div>
          </div>
          <div data-env-front className="lis-env pointer-events-none absolute left-1/2 top-1/2 z-[6] aspect-[1.45/1] w-[min(94%,680px)] -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: "preserve-3d", perspective: "1400px" }}>
            <div data-env-parts className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              <svg viewBox="0 0 145 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full drop-shadow-[0_-2px_3px_rgba(10,26,72,.12)]" aria-hidden>
                <path d="M0 0 L66 54 Q72.5 59 79 54 L145 0 V100 H0Z" fill="#f7f8fb" />
                <path d="M0 100 L60 50 M145 100 L85 50" stroke="#13294b" strokeOpacity=".08" strokeWidth=".4" />
              </svg>
              <div className="lis-laid absolute inset-0 opacity-50 [clip-path:polygon(0_0,45.5%_54%,50%_58%,54.5%_54%,100%_0,100%_100%,0_100%)]" />
              <p className="absolute bottom-[9%] left-0 right-0 text-center text-[clamp(1.4rem,5cqw,2.4rem)] text-[var(--t-accent)]" style={ff.script}>{b ? `${a} & ${b}` : a}</p>
              <Stamp className="absolute right-[5%] top-[60%] h-[24%] w-[14%] rotate-2" value={date?.year ?? ""} />
              {/* closed flap + seal */}
              <div data-flap className="lis-flap absolute inset-x-0 top-0 h-[62%]">
                <svg viewBox="0 0 145 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full drop-shadow-[0_3px_4px_rgba(10,26,72,.18)]" aria-hidden>
                  <path d="M0 0 H145 L80 58 Q72.5 63 65 58Z" fill="#f2f4f9" />
                </svg>
                <div data-seal className="absolute left-1/2 top-[94%] w-[22%] -translate-x-1/2 -translate-y-1/2"><WaxSeal initials={ini} split className="w-full drop-shadow-[0_6px_8px_rgba(5,15,45,.45)]" /></div>
              </div>
            </div>
          </div>
        </div>
        {!compact && <p className="absolute bottom-5 left-0 right-0 z-[6] text-center text-[10px] uppercase tracking-[0.4em] text-white/80 motion-reduce:hidden">{T.post}</p>}
      </header>

      {/* azulejo dado between the hero and the pages */}
      <div className="relative h-3 bg-[var(--t-accent)]" />

      <main className={`relative flex flex-col ${compact ? "gap-10 py-12" : "gap-14 py-20 @2xl:gap-20 @2xl:py-28"}`}>
        {!compact && <Bougainvillea className="pointer-events-none absolute -left-6 top-8 w-44 opacity-90 @3xl:w-60" seed={2} />}
        {!compact && <Bougainvillea className="pointer-events-none absolute -right-6 top-[40%] w-40 opacity-90 @3xl:w-56" seed={7} flip />}
        {vis.map((id, i) => <Sec key={id} id={id}>{section(id, i)}</Sec>)}
      </main>

      {/* ── Footer: sealed with love ── */}
      <footer className="relative overflow-hidden pb-14 pt-20 text-center">
        <div className="absolute inset-0"><TileField size={96} className="h-full w-full" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--t-bg),color-mix(in_oklab,var(--t-bg)_70%,transparent)_30%,color-mix(in_oklab,var(--t-bg)_70%,transparent))]" />
        <div data-reveal className="relative mx-auto w-[min(88%,520px)] bg-[var(--t-surface)]/95 px-8 pb-10 pt-12 shadow-[0_30px_60px_-30px_rgba(10,26,72,.6)]">
          <WaxSeal initials={ini} className="mx-auto -mt-24 mb-6 w-28 drop-shadow-[0_8px_10px_rgba(5,15,45,.4)]" />
          {profile.blessing && <E as="p" path="profile.blessing" className="mb-6 block text-3xl text-[var(--t-accent)]" style={ff.script}>{profile.blessing}</E>}
          <p className="text-[2.6rem] italic leading-none" style={ff.display}>{b ? `${a} & ${b}` : a}</p>
          {date && <p className="mt-4 text-sm tracking-[0.3em] text-[var(--t-muted)]">{date.roman}</p>}
          {S.occ === "wedding" && <p className="wa-caps mt-6 text-[10px] text-[var(--t-muted)]">{L.forever}</p>}
          {credit && <div className="mt-8 text-[11px] tracking-wide text-[var(--t-muted)]">{credit}</div>}
        </div>
      </footer>
    </div>
  );
}
