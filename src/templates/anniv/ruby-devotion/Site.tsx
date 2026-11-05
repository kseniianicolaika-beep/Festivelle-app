"use client";
import { useRef } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { designVars } from "@/lib/themes";
import { formatDate } from "@/lib/profile";
import { BaseCSS } from "../_shared/CardKit";
import { annivFontVars, STACK } from "../_shared/fonts";
import { faceVars, Grain, media, paletteVars, Photo, Sections, standardReveals, useAnniv, useDaysLeft, useLenis, useMotion, yearsWord } from "../_shared/kit";
import { DecoCorner, FOLDS, Rings, Ruby, VELVET } from "./art";

export const RUBY_PALETTE = { bg: "#24060F", ink: "#F6E4DC", accent: "#D9A85A", ruby: "#D21F43", muted: "#C9A5A0", deep: "#160309" };
export const RUBY_FACES = { display: STACK.prata, script: STACK.vibes, body: STACK.cormorant, label: STACK.cormsc };

export const RUBY_CSS = `
.rb{background:${VELVET};background-color:var(--a-bg);color:var(--a-ink);font-family:var(--a-body)}
.rb-gold{background:linear-gradient(100deg,#9a6a2c 0%,#f6dc9c 22%,#b8823d 42%,#ffeec4 58%,#a5722f 78%,#f2d391 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rb-foil 8s ease-in-out infinite}
.rb-outline{color:transparent;-webkit-text-stroke:1px color-mix(in oklab,var(--a-accent) 55%,transparent)}
@keyframes rb-foil{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.rb-glint{transform-box:fill-box;transform-origin:center;animation:rb-glint 3.6s ease-in-out infinite both}
@keyframes rb-glint{0%,70%,100%{opacity:0;transform:scale(.2) rotate(0)}82%{opacity:1;transform:scale(1) rotate(45deg)}}
.rb-pulse{animation:rb-pulse 4s ease-in-out infinite}
@keyframes rb-pulse{0%,100%{opacity:.25}50%{opacity:.5}}
.rb-curtain-l{animation:rb-cl 2.6s cubic-bezier(.7,0,.2,1) .5s both}
.rb-curtain-r{animation:rb-cr 2.6s cubic-bezier(.7,0,.2,1) .5s both}
@keyframes rb-cl{to{transform:translateX(-102%) skewX(-4deg)}}
@keyframes rb-cr{to{transform:translateX(102%) skewX(4deg)}}
.rb-gem{animation:rb-gem 2.4s cubic-bezier(.16,1,.3,1) 1.2s both}
@keyframes rb-gem{from{opacity:0;transform:scale(.6) rotate(-25deg);filter:blur(10px)}to{opacity:1;transform:none;filter:none}}
.rb-rise{animation:rb-rise 1.8s cubic-bezier(.16,1,.3,1) both}
@keyframes rb-rise{from{opacity:0;transform:translateY(26px);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.rb main{counter-reset:ch}.rb-num:before{counter-increment:ch;content:counter(ch,upper-roman)}
.rb-rule{display:flex;align-items:center;gap:14px;color:var(--a-accent)}
.rb-rule:before,.rb-rule:after{content:"";height:1px;width:64px;background:linear-gradient(90deg,transparent,currentColor)}
.rb-rule:after{transform:scaleX(-1)}
.rb-frame{position:relative;border:1px solid color-mix(in oklab,var(--a-accent) 55%,transparent);outline:1px solid color-mix(in oklab,var(--a-accent) 25%,transparent);outline-offset:6px}
.rb-btn{display:inline-flex;align-items:center;gap:.7rem;border:1px solid var(--a-accent);padding:.85rem 1.7rem;font-family:var(--a-label);letter-spacing:.3em;text-transform:uppercase;font-size:12px;color:var(--a-ink);transition:background .5s,color .5s}
.rb-btn:hover{background:var(--a-accent);color:var(--a-deep)}
`;

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const gem = (cls = "h-3 w-3") => <span aria-hidden className={`inline-block rotate-45 bg-[radial-gradient(circle_at_35%_30%,#ff9fb0,#c01334_60%,#5e0617)] shadow-[0_0_10px_rgba(255,60,90,.6)] ${cls}`} />;

export default function Site({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const A = useAnniv(profile, design);
  const L = A.L;
  const days = useDaysLeft(profile.date);
  useLenis(!compact);
  useMotion(root, !compact, (g) => {
    standardReveals(g);
    g.to(".rb-hero-gem", { rotate: 50, scale: 0.8, yPercent: 30, ease: "none", scrollTrigger: { trigger: ".rb-hero", start: "top top", end: "bottom top", scrub: true } });
    g.to(".rb-hero-num", { yPercent: -25, ease: "none", scrollTrigger: { trigger: ".rb-hero", start: "top top", end: "bottom top", scrub: true } });
    g.utils.toArray<HTMLElement>(".rb-frame").forEach((el) => g.from(el, { clipPath: "inset(50% 0 50% 0)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 85%", once: true } }));
  });

  const nextHead = (title: string) => (
    <div className="mb-12 text-center" data-rise>
      <p className="rb-num rb-gold an-f-d text-[15px] tracking-[.3em]" />
      <div className="rb-rule mx-auto mt-3 w-fit">{gem()}</div>
      <h2 className="an-cap mt-4 text-[13px] text-[var(--a-muted)]">{title}</h2>
    </div>
  );

  const sections = {
    invitation: (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <div data-rise><Rings className="mx-auto mb-10 w-36" /></div>
        <E as="p" multiline path="profile.inviteLine" className="an-f-d block text-[clamp(1.6rem,4.4cqw,2.5rem)] leading-[1.5]" >{A.invite}</E>
      </section>
    ),
    story: profile.story && (
      <section className="mx-auto max-w-5xl px-6 py-24">
        {nextHead(L.story)}
        <div className="relative grid items-center gap-12 @3xl:grid-cols-2">
          {A.since && (
            <div className="relative text-center" data-rise>
              <p className="rb-outline an-f-d text-[clamp(6rem,24cqw,13rem)] leading-[.8]">{A.since}</p>
              <p className="an-f-s -mt-6 text-5xl text-[var(--a-accent)] @3xl:-mt-10">{A.year ? `— ${A.year}` : ""}</p>
            </div>
          )}
          <div data-rise>
            <E as="p" multiline path="profile.story" className="an-f-b block whitespace-pre-line text-[clamp(1.35rem,3.2cqw,1.75rem)] leading-[1.65] first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--a-display)] first-letter:text-[4.2em] first-letter:leading-[.8] first-letter:text-[var(--a-accent)]">{profile.story}</E>
            {A.age && <p className="an-cap mt-8 text-[12px] text-[var(--a-accent)]">{A.age} {yearsWord(A.age, A.lang)} · {L.together}</p>}
          </div>
        </div>
      </section>
    ),
    details: (profile.date || A.where) && (
      <section className="mx-auto max-w-4xl px-6 py-20">
        {nextHead(L.details)}
        <div className="rb-frame grid bg-black/15 backdrop-blur-sm @2xl:grid-cols-2">
          {profile.date && (
            <div className="p-10 text-center @2xl:border-r @2xl:border-[color-mix(in_oklab,var(--a-accent)_35%,transparent)]">
              <p className="an-cap text-[12px] text-[var(--a-muted)]">{L.when}</p>
              <p className="an-f-d mt-4 text-[clamp(1.8rem,4.5cqw,2.4rem)]">{A.date}</p>
              {A.events[0]?.time && <p className="mt-1 text-lg text-[var(--a-muted)]">{A.events[0].time}</p>}
            </div>
          )}
          {A.where && (
            <div className="p-10 text-center">
              <p className="an-cap text-[12px] text-[var(--a-muted)]">{L.where}</p>
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="an-f-d mt-4 block text-[clamp(1.8rem,4.5cqw,2.4rem)]">{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-1 block text-lg text-[var(--a-muted)]">{profile.city}</E>}
            </div>
          )}
        </div>
      </section>
    ),
    schedule: A.events.length > 0 && (
      <section className="mx-auto max-w-5xl px-6 py-20">
        {nextHead(L.events)}
        <div className="grid gap-6 @3xl:grid-cols-3" data-stagger>
          {A.events.map((e, i) => (
            <div key={i} className="rb-frame relative bg-black/20 px-6 pb-9 pt-12 text-center">
              <DecoCorner className="absolute left-2 top-2 w-7 text-[var(--a-accent)]" />
              <DecoCorner className="absolute right-2 top-2 w-7 rotate-90 text-[var(--a-accent)]" />
              <p className="rb-gold an-f-d text-5xl">{e.time?.replace(/\s?(am|pm)/i, "") || ROMAN[i]}</p>
              <p className="an-cap mt-1 text-[11px] text-[var(--a-muted)]">{/pm/i.test(e.time ?? "") ? "pm" : /am/i.test(e.time ?? "") ? "am" : ""}</p>
              <h3 className="an-f-d mt-5 text-[1.7rem] leading-tight">{e.name}</h3>
              <p className="mt-2 text-lg italic text-[var(--a-muted)]">{[formatDate(e.date, profile.language), e.venue].filter(Boolean).join(" · ")}</p>
            </div>
          ))}
        </div>
        {calendarUrl && <div className="mt-12 text-center" data-rise><a href={calendarUrl} className="rb-btn">{gem("h-2 w-2")} {L.calendar}</a></div>}
      </section>
    ),
    venue: A.where && (
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        {nextHead(L.venue)}
        <div data-rise>
          <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="rb-gold an-f-d block text-[clamp(2.6rem,9cqw,5rem)] leading-[1.05]">{profile.venue || profile.city}</E>
          {profile.venue && profile.city && <p className="an-cap mt-4 text-[12px] text-[var(--a-muted)]">{profile.city}</p>}
          <a target="_blank" rel="noreferrer" href={A.mapUrl} className="rb-btn mt-10">{L.directions} →</a>
        </div>
      </section>
    ),
    gallery: A.gallery.length > 0 && (
      <section className="mx-auto max-w-6xl px-6 py-20">
        {nextHead(L.gallery)}
        <div className="grid grid-cols-2 gap-6 @3xl:grid-cols-3" data-stagger>
          {A.gallery.map((k) => (
            <div key={k} className="rb-frame overflow-hidden rounded-t-full p-2"><Photo src={media(k)} slot="gallery" galleryKey={k} className="aspect-[3/4] w-full rounded-t-full object-cover" /></div>
          ))}
        </div>
      </section>
    ),
    rsvp: children && (
      <section className="mx-auto max-w-xl px-6 py-20">
        {nextHead(L.rsvp)}
        <div className="rb-frame relative bg-[#fbf3ea] px-7 py-12 text-[#2a0a12] shadow-[0_50px_90px_-40px_rgba(0,0,0,.8)] @md:px-12" data-rise>
          <Ruby className="absolute -top-8 left-1/2 w-16 -translate-x-1/2" glint={false} />
          <p className="an-f-d mb-8 text-center text-3xl">{L.reply}</p>
          {children}
        </div>
      </section>
    ),
    info: A.info && (
      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        {nextHead(L.info)}
        <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--a-muted)]" >{A.info}</E>
      </section>
    ),
  };

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`rb an-site @container relative overflow-hidden ${annivFontVars}`} style={{ ...designVars(theme, design), ...paletteVars(design, RUBY_PALETTE), ...faceVars(design, "playfair", RUBY_FACES) }}>
      <BaseCSS />
      <style href="an-ruby" precedence="default">{RUBY_CSS}</style>
      <Grain opacity={0.22} blend="overlay" freq={1.2} />

      {/* ── Opening: velvet curtains part; the ruby turns into the light ── */}
      <header data-section="intro" className={`rb-hero relative flex flex-col items-center justify-center overflow-hidden px-6 text-center ${compact ? "min-h-[700px] py-20" : "min-h-[100svh] py-24"}`}>
        <DecoCorner className="absolute left-4 top-4 w-14 text-[var(--a-accent)] opacity-70 @3xl:left-8 @3xl:top-8 @3xl:w-20" />
        <DecoCorner className="absolute right-4 top-4 w-14 rotate-90 text-[var(--a-accent)] opacity-70 @3xl:right-8 @3xl:top-8 @3xl:w-20" />
        <DecoCorner className="absolute bottom-4 left-4 w-14 -rotate-90 text-[var(--a-accent)] opacity-70 @3xl:bottom-8 @3xl:left-8 @3xl:w-20" />
        <DecoCorner className="absolute bottom-4 right-4 w-14 rotate-180 text-[var(--a-accent)] opacity-70 @3xl:bottom-8 @3xl:right-8 @3xl:w-20" />
        <p aria-hidden className="rb-hero-num rb-outline an-f-d pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(18rem,70cqw,48rem)] leading-none">{A.age ?? "∞"}</p>
        <div className="relative">
          <div className="rb-hero-gem mx-auto w-[min(34cqw,190px)]"><div className="rb-gem"><Ruby className="w-full drop-shadow-[0_20px_40px_rgba(255,40,80,.35)]" /></div></div>
          <p className="rb-rise an-cap mt-10 text-[12px] text-[var(--a-accent)]" style={{ animationDelay: "2s" }}>{A.milestone}</p>
          <h1 className="rb-rise an-f-d mt-6 text-[clamp(3.2rem,11cqw,7.4rem)] leading-[1]" style={{ animationDelay: "2.3s" }}>
            <E path="profile.partner1" className="rb-gold">{A.a}</E>
            {A.b && <><span className="an-f-s mx-4 block text-[.6em] leading-[1.1] text-[var(--a-ink)] @3xl:inline">&amp;</span><E path="profile.partner2" className="rb-gold">{A.b}</E></>}
          </h1>
          <p className="rb-rise an-f-s mt-5 text-[clamp(1.8rem,4cqw,2.6rem)] text-[var(--a-muted)]" style={{ animationDelay: "2.7s" }}>{A.line}</p>
          <div className="rb-rise rb-rule mx-auto mt-8 w-fit" style={{ animationDelay: "3s" }}>{gem("h-2 w-2")}</div>
          <p className="rb-rise an-f-d mt-5 text-xl @md:text-2xl" style={{ animationDelay: "3.1s" }}>{A.date}{A.where && <span className="text-[var(--a-muted)]"> · <E path={profile.venue ? "profile.venue" : "profile.city"}>{A.where}</E></span>}</p>
          {days !== null && days > 0 && <p className="rb-rise an-cap mt-6 text-[11px] text-[var(--a-accent)]" style={{ animationDelay: "3.3s" }}>{days} {L.days}</p>}
        </div>
        {heroUrl && (
          <div className="rb-rise relative mt-14 w-[min(70cqw,360px)]" style={{ animationDelay: "3.4s" }}>
            <div className="rb-frame overflow-hidden rounded-t-full p-2"><Photo src={heroUrl} className="aspect-[4/5] w-full rounded-t-full object-cover" /></div>
          </div>
        )}
        {!compact && (
          <div aria-hidden className="pointer-events-none fixed inset-0 z-50 flex motion-reduce:hidden">
            <div className="rb-curtain-l h-full w-1/2 origin-top-left shadow-[20px_0_60px_rgba(0,0,0,.6)]" style={{ background: `linear-gradient(90deg,transparent 80%,rgba(0,0,0,.4)), ${FOLDS}` }}><div className="absolute inset-x-0 bottom-0 h-6 bg-[repeating-linear-gradient(90deg,#d9a85a_0_2px,transparent_2px_6px)] opacity-80" /></div>
            <div className="rb-curtain-r h-full w-1/2 origin-top-right shadow-[-20px_0_60px_rgba(0,0,0,.6)]" style={{ background: `linear-gradient(270deg,transparent 80%,rgba(0,0,0,.4)), ${FOLDS}` }}><div className="absolute inset-x-0 bottom-0 h-6 bg-[repeating-linear-gradient(90deg,#d9a85a_0_2px,transparent_2px_6px)] opacity-80" /></div>
          </div>
        )}
      </header>

      <main className="relative">
        <Sections design={design} render={sections} />
      </main>

      <footer className="relative px-6 pb-16 pt-16 text-center">
        <div data-rise>
          <Rings className="mx-auto w-28" />
          <p className="rb-gold an-f-d mt-6 text-5xl">{A.a[0]}{A.b && <span className="an-f-s mx-2 text-3xl">&amp;</span>}{A.b?.[0]}</p>
          {profile.blessing && <E as="p" path="profile.blessing" className="an-f-s mt-6 block text-4xl text-[var(--a-accent)]">{profile.blessing}</E>}
          <p className="an-cap mt-4 text-[11px] text-[var(--a-muted)]">{L.forever}</p>
          {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--a-muted)]">{credit}</div>}
        </div>
      </footer>
    </div>
  );
}
