"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { fontClass, lookStyle, Sections, ScrollTrigger, SplitText, useLenis, useStage, useUntil } from "../_shared/kit";
import { dateParts, langOf, mapUrl, media, nameParts, occasionInvite, occasionLine, occasionOf, words } from "../_shared/text";
import { Corner, Manor, Plate, Rim, Sprig, Swash } from "./art";
import { GZ, GZHEL_LOOK } from "./look";
import { s, GzhelStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };

const Kicker = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[10.5px] font-semibold uppercase tracking-[0.38em] text-[#1c3f94] ${className}`}>{children}</p>
);

function Head({ no, kicker, title }: { no: string; kicker?: string; title: ReactNode }) {
  return (
    <div data-rise className="mb-12 flex items-end gap-5 border-b border-[#1c3f94]/25 pb-5 md:mb-16">
      <span className="text-[3.4rem] leading-none text-[#a9bfee] md:text-[5rem]" style={disp}>{no}</span>
      <div className="pb-1">
        {kicker && <Kicker className="mb-2">{kicker}</Kicker>}
        <h2 className="text-[2.2rem] leading-[1.02] text-[#0f1f4d] md:text-[3.4rem]" style={disp}>{title}</h2>
      </div>
    </div>
  );
}

const Btn = ({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) => (
  <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="inline-flex items-center gap-3 rounded-full bg-[#1c3f94] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#11286a]">
    {children}<span aria-hidden>→</span>
  </a>
);

export default function GzhelSite({ profile, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
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
  const longest = Math.max([...a].length, [...(b || "")].length);
  const nameFs = compact ? `${Math.min(4.6, 22 / (longest * 0.62)).toFixed(2)}rem` : `min(8.5rem, ${Math.min(14, 84 / (longest * 0.62)).toFixed(2)}vw, ${Math.round(620 / (longest * 0.62))}px)`;
  useLenis(!compact);

  useStage(root, (g, q) => {
    // The Painted Plate: rings turn on the wheel, the cobalt band is laid, then each brush stroke blooms.
    const plate = q("[data-hero-plate]")[0];
    const tl = g.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
    if (plate) {
      const P = (sel: string) => plate.querySelectorAll(sel);
      tl.from(plate, { scale: 0.86, rotate: -40, opacity: 0, duration: 1.4 }, 0)
        .from(P("[data-ring]"), { drawSVG: 0, duration: 1.3, stagger: 0.12, ease: "power2.inOut" }, 0.2)
        .from(P("[data-band]"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut" }, 0.4)
        .from(P("[data-draw]"), { drawSVG: 0, duration: 1.2, stagger: 0.03, ease: "power1.inOut" }, 1)
        .from(P("[data-leaf]"), { scale: 0, transformOrigin: "0% 50%", opacity: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.6)" }, 1.4)
        .from(P("[data-stroke]"), { scaleY: 0, scaleX: 0.4, transformOrigin: "50% 100%", opacity: 0, duration: 0.55, stagger: 0.11, ease: "power2.out" }, 1.7)
        .from(P("[data-dot]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.35, stagger: 0.008, ease: "back.out(3)" }, 2.4);
    }
    tl.from(q("[data-hero-in]"), { opacity: 0, y: 22, duration: 1, stagger: 0.1 }, 0.5);
    if (!compact) {
      const split = SplitText.create(q("[data-name]"), { type: "chars", charsClass: "inline-block" });
      tl.from(split.chars, { opacity: 0, yPercent: 60, duration: 0.9, stagger: 0.04 }, 0.9);
    } else tl.from(q("[data-name]"), { opacity: 0, y: 20, duration: 1, stagger: 0.2 }, 0.8);
    if (compact) return;
    g.to(q("[data-hero-plate]"), { rotate: 50, yPercent: 10, ease: "none", scrollTrigger: { trigger: q("header")[0], start: "top top", end: "bottom top", scrub: true } });
    const rise = q("[data-rise]");
    g.set(rise, { opacity: 0, y: 40 });
    ScrollTrigger.batch(rise, { start: "top 88%", once: true, onEnter: (els) => g.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, overwrite: true }) });
    q("[data-paint]").forEach((el) => {
      const t = g.timeline({ scrollTrigger: { trigger: el, start: "top 85%" } });
      t.from(el.querySelectorAll("[data-ring],[data-band],[data-draw]"), { drawSVG: 0, duration: 1.2, stagger: 0.02, ease: "power1.inOut" })
        .from(el.querySelectorAll("[data-leaf]"), { scale: 0, transformOrigin: "0% 50%", duration: 0.5, stagger: 0.04, ease: "back.out(1.6)" }, 0.5)
        .from(el.querySelectorAll("[data-stroke]"), { scaleY: 0, transformOrigin: "50% 100%", opacity: 0, duration: 0.5, stagger: 0.07 }, 0.7)
        .from(el.querySelectorAll("[data-dot]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.01 }, 1.1);
    });
    const manor = q("[data-manor]")[0];
    if (manor) g.from(manor.querySelectorAll("[data-draw]"), { drawSVG: 0, ease: "none", stagger: 0.01, scrollTrigger: { trigger: manor, start: "top 85%", end: "bottom 55%", scrub: 0.6 } });
    q("[data-cover] img").forEach((img) => g.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } }));
  }, [compact]);

  const hero = (
    <header className={`relative overflow-hidden ${s.glaze}`} style={{ minHeight: compact ? undefined : "100svh" }}>
      <div className={`relative mx-auto grid max-w-7xl items-center gap-6 px-6 ${compact ? "py-12" : "py-10 md:min-h-[100svh] md:grid-cols-[1.1fr_1fr] md:gap-10 md:px-12"}`}>
        <div className={`relative z-10 text-center ${compact ? "order-2" : "order-2 md:order-1 md:text-left"}`}>
          <div data-hero-in className={`mb-8 flex items-center justify-center gap-4 border-y border-[#1c3f94]/25 py-2.5 ${compact ? "" : "md:justify-start"}`}>
            <Kicker>Gzhel</Kicker><span className="h-1 w-1 rounded-full bg-[#1c3f94]" /><Kicker>{dp ? `№ ${dp.mm} · ${dp.year}` : "№ 01"}</Kicker>
          </div>
          <Kicker className="mb-5">{occ === "wedding" ? L.wedding : L.invited}</Kicker>
          <h1 className="leading-[0.92] text-[#0f1f4d]" style={{ ...disp, fontSize: nameFs }}>
            <E as="span" path="profile.partner1" className="block"><span data-name>{a}</span></E>
            {b && (
              <>
                <span data-hero-in className="my-1 block text-[#2a5bd7]" style={{ fontSize: "0.42em", fontStyle: "italic" }}>&amp;</span>
                <E as="span" path="profile.partner2" className="block"><span data-name>{b}</span></E>
              </>
            )}
          </h1>
          <div data-hero-in className={`mx-auto mt-6 w-56 ${compact ? "" : "md:mx-0"}`}><Swash className="w-full" /></div>
          <p data-hero-in className="mt-5 text-[1.05rem] font-light text-[#5d6b8f]">{occasionLine(profile)}</p>
          <div data-hero-in className={`mt-8 flex flex-wrap items-stretch justify-center gap-px overflow-hidden rounded-2xl border border-[#1c3f94]/20 bg-[#1c3f94]/20 ${compact ? "" : "md:inline-flex md:justify-start"}`}>
            {dp && (
              <div className="bg-white px-5 py-3 text-left">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.3em] text-[#5d6b8f]">{L.when}</p>
                <p className="mt-1 text-[1.25rem] text-[#0f1f4d]" style={disp}>{dp.full}</p>
              </div>
            )}
            {where && occ !== "greeting" && (
              <div className="bg-white px-5 py-3 text-left">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.3em] text-[#5d6b8f]">{L.where}</p>
                <p className="mt-1 text-[1.25rem] text-[#0f1f4d]" style={disp}><E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E></p>
              </div>
            )}
          </div>
          <div data-hero-in className="mt-6 h-6">
            {until && occ !== "greeting" && <Kicker className="text-[#2a5bd7]">{until.d} {L.days} · {until.h} {L.hours} · {until.m} {L.minutes}</Kicker>}
          </div>
        </div>
        <div className={`relative ${compact ? "order-1" : "order-1 md:order-2"}`}>
          <div aria-hidden className={`absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 ${s.net}`} style={{ width: "112%", maskImage: "radial-gradient(closest-side, #000 60%, transparent)", WebkitMaskImage: "radial-gradient(closest-side, #000 60%, transparent)" }} />
          <div data-hero-plate className="relative mx-auto" style={{ width: compact ? "min(78%, 360px)" : "min(82vw, 600px, 74svh)", filter: "drop-shadow(0 30px 40px rgba(17,40,106,.22)) drop-shadow(0 4px 6px rgba(17,40,106,.12))" }}>
            <Plate className="h-auto w-full" />
          </div>
        </div>
      </div>
    </header>
  );

  const cover = (
    <div data-cover className="relative px-6 pb-6 pt-4 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[28px] bg-[#dbe5fa]" style={{ aspectRatio: compact ? "4 / 5" : undefined }}>
          <div className={compact ? "absolute inset-0" : "relative aspect-[4/5] md:aspect-[21/9]"}>
            {heroUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div data-edit-photo="hero" className={`absolute inset-0 grid place-items-center ${s.net}`}><Sprig className="w-1/2" /></div>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0f1f4d]/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6 text-white md:p-10">
              <p className="text-[1.8rem] leading-none md:text-[3rem]" style={disp}>{a}{b ? ` & ${b}` : ""}</p>
              {dp && <p className="text-[10px] font-semibold uppercase tracking-[0.35em] opacity-90">{dp.dd}.{dp.mm}.{dp.year}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  let n = 0;
  const no = () => String(++n).padStart(2, "0");

  const sections = {
    invitation: occ !== "greeting" && (
      <section className="relative px-6 py-24 md:py-32">
        <div data-rise className="relative mx-auto max-w-4xl text-center">
          <div data-paint className="mx-auto w-56 md:w-72"><Sprig /></div>
          <Kicker className="mb-8 mt-6">{L.invited}</Kicker>
          <E as="p" multiline path="profile.inviteLine" className="block text-[2rem] leading-[1.25] text-[#0f1f4d] md:text-[3.2rem]" style={disp}>{profile.inviteLine || occasionInvite(profile)}</E>
          <Swash className="mx-auto mt-10 w-60" />
        </div>
      </section>
    ),
    story: profile.story && (
      <section className="relative px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Head no={no()} kicker={L.chapter} title={L.story} />
          <div className={`grid items-start gap-12 ${compact ? "" : "md:grid-cols-[0.8fr_1.2fr] md:gap-16"}`}>
            <div data-paint className="relative mx-auto w-[min(80vw,380px)]">
              <Rim className="w-full" />
              <div className="absolute inset-[15.5%] overflow-hidden rounded-full bg-[#dbe5fa]">
                {gallery[0] || heroUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img {...(gallery[0] ? { "data-edit-photo": "gallery", "data-gallery-key": gallery[0] } : {})} src={gallery[0] ? media(gallery[0]) : heroUrl!} alt="" className="h-full w-full object-cover" />
                ) : <Sprig className="mt-[25%] w-full" />}
              </div>
            </div>
            <div data-rise>
              <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.15rem] font-light leading-[1.85] text-[#24325a] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[5rem] first-letter:leading-[0.78] first-letter:text-[#1c3f94] md:text-[1.3rem]" style={{ fontFamily: "var(--wbody)" }}>{profile.story}</E>
              <p className="mt-8 text-[1.6rem] italic text-[#2a5bd7]" style={disp}>{L.forever}</p>
            </div>
          </div>
        </div>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Head no={no()} kicker={L.save} title={L.details} />
          <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
            {dp && (
              <div data-rise className="relative overflow-hidden rounded-[28px] border border-[#1c3f94]/25 bg-white p-8 md:p-12">
                <Corner className="absolute right-0 top-0 w-28 -scale-x-100" />
                <Kicker>{L.when}</Kicker>
                <p className="mt-4 text-[7rem] leading-[0.8] text-[#1c3f94] md:text-[9rem]" style={disp}>{dp.day}</p>
                <p className="mt-3 text-[1.8rem] text-[#0f1f4d]" style={disp}>{dp.month} {dp.year}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.25em] text-[#5d6b8f]">{dp.weekday}{events[0]?.time ? ` · ${events[0].time}` : ""}</p>
              </div>
            )}
            {where && (
              <div data-rise className={`relative overflow-hidden rounded-[28px] bg-[#1c3f94] p-8 text-white md:p-12 ${s.net}`} style={{ backgroundColor: GZ.cobalt, backgroundBlendMode: "overlay" }}>
                <Kicker className="text-[#a9bfee]!">{L.where}</Kicker>
                <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="mt-5 block text-[2.6rem] leading-[1.02] md:text-[3.4rem]" style={disp}>{where}</E>
                {profile.venue && profile.city && <p className="mt-3 text-sm uppercase tracking-[0.25em] text-[#dbe5fa]">{profile.city}</p>}
                <a href={mapUrl(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#1c3f94]">{L.directions} →</a>
              </div>
            )}
          </div>
        </div>
      </section>
    ),
    schedule: events.length > 0 && (
      <section className="relative px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Head no={no()} kicker={L.ceremony} title={L.events} />
          <ol className="divide-y divide-[#1c3f94]/15 border-y border-[#1c3f94]/15">
            {events.map((e, i) => (
              <li data-rise key={i} className={`grid items-baseline gap-2 py-7 ${compact ? "" : "md:grid-cols-[180px_1fr_auto] md:gap-8"}`}>
                <span className="text-[2.6rem] leading-none text-[#1c3f94] md:text-[3.2rem]" style={disp}>{e.time || String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-baseline gap-4">
                  <h3 className="text-[1.7rem] leading-tight text-[#0f1f4d] md:text-[2.2rem]" style={disp}>{e.name}</h3>
                  <span className={`${s.leader} hidden ${compact ? "" : "md:block"}`} />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#5d6b8f]">{[dateParts(e.date, lang)?.full, e.venue].filter(Boolean).join(" · ")}</p>
              </li>
            ))}
          </ol>
          {calendarUrl && <div data-rise className="mt-10"><Btn href={calendarUrl}>{L.calendar}</Btn></div>}
        </div>
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Head no={no()} kicker={L.venue} title={<E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E>} />
          <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-[1.3fr_1fr]"}`}>
            <div data-manor className="w-full"><Manor className="w-full" /></div>
            <div data-rise>
              {profile.city && <p className="text-[1.8rem] text-[#0f1f4d]" style={disp}>{profile.city}</p>}
              <div className="mt-6"><Btn href={mapUrl(profile)} external>{L.directions}</Btn></div>
              {/goa/i.test(`${profile.city} ${profile.venue}`) && (
                <div className="mt-10 border-t border-[#1c3f94]/20 pt-6">
                  <Kicker className="mb-3">{L.travel}</Kicker>
                  <p className="font-light leading-relaxed text-[#24325a]">{L.travelText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className="relative px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Head no={no()} title={L.gallery} />
          <div className={`grid grid-cols-2 gap-5 ${compact ? "" : "md:grid-cols-3 md:gap-8"}`}>
            {gallery.map((k, i) => (
              <div data-rise key={k} className={`overflow-hidden ${i % 3 === 1 ? "rounded-full" : "rounded-[28px]"} border-4 border-white shadow-[0_20px_40px_-24px_rgba(17,40,106,.5)] ring-1 ring-[#1c3f94]/25`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className="relative px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl">
          <div data-paint className="mx-auto mb-6 w-44"><Sprig /></div>
          <div data-rise className="rounded-[32px] border border-[#1c3f94]/30 bg-white p-2 shadow-[0_30px_60px_-36px_rgba(17,40,106,.55)]">
            <div className="rounded-[26px] border border-[#1c3f94]/15 p-7 md:p-10">{children}</div>
          </div>
        </div>
      </section>
    ),
    info: design?.texts?.body && (
      <section className="relative px-6 py-16">
        <div data-rise className="mx-auto max-w-2xl rounded-[28px] border border-[#1c3f94]/25 bg-white p-8 text-center md:p-12">
          <Kicker className="mb-4">{L.info}</Kicker>
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-[1.1rem] font-light leading-relaxed text-[#24325a]">{design.texts.body}</E>
        </div>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`${fontClass} ${s.root} ${s.glaze} relative overflow-hidden`} style={lookStyle(GZHEL_LOOK, design, "gzhel-garden")}>
      <GzhelStyles />
      {hero}
      {cover}
      <Sections design={design} map={sections} />
      <footer className="relative px-6 pb-14 pt-20 text-center">
        <div data-paint className="mx-auto w-40"><Plate /></div>
        <p className="mt-6 text-[2.4rem] leading-none text-[#0f1f4d]" style={disp}>{a}{b ? <span className="italic text-[#2a5bd7]"> &amp; </span> : null}{b}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mx-auto mt-4 block max-w-md text-[1.2rem] italic text-[#1c3f94]" style={disp}>{profile.blessing}</E>}
        {dp && <Kicker className="mt-5 text-[#5d6b8f]!">{dp.full}</Kicker>}
        <div className="mt-10 text-xs text-[#5d6b8f]">{credit}</div>
      </footer>
    </div>
  );
}
