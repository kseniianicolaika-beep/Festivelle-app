"use client";
import { useRef } from "react";
import gsap from "gsap";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite } from "@/lib/occasions";
import { LENIS_CSS, Sections, Split, labels, mapUrl, media, useCountdown, useLenis, useScrollStage, vars, fitName } from "../_shared/kit";
import { CSS, fontClass } from "./fonts";
import { JAALI, Lantern, MughalArch, Rings, silk } from "./art";

// RING CEREMONY — emerald lantern-light for a grand sagai. Zari-edged emerald silk parts inside a cusped Mughal arch,
// lanterns glow on, and two gold rings draw themselves and interlock.
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
  const sagai = hi ? "सगाई समारोह" : ru ? "Сагаи · обручение" : "The Sagai";
  useLenis(!compact);
  useScrollStage(root, compact, (el) => {
    el.querySelectorAll<HTMLElement>(".rc-lan").forEach((n, i) => gsap.to(n, { y: 80 + i * 30, ease: "none", scrollTrigger: { trigger: el.querySelector(".rc-hero"), start: "top top", end: "bottom top", scrub: true } }));
    el.querySelectorAll<HTMLElement>(".rc-arch-sec").forEach((n) => gsap.from(n, { clipPath: "inset(100% 0 0 0)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 82%", once: true } }));
  });

  const sec = compact ? "px-6 py-14" : "px-6 py-20 md:py-28";
  const Title = ({ children: c }: { children: React.ReactNode }) => (
    <div data-rv className="mb-12 flex items-center justify-center gap-4 text-center">
      <span className="h-px w-10 bg-[var(--t-gold)]/70 md:w-20" />
      <svg viewBox="0 0 20 20" className="w-3" aria-hidden><path d="M10 0l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="var(--t-gold)" /></svg>
      <p className="k text-sm text-[var(--t-gold)]">{c}</p>
      <svg viewBox="0 0 20 20" className="w-3" aria-hidden><path d="M10 0l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" fill="var(--t-gold)" /></svg>
      <span className="h-px w-10 bg-[var(--t-gold)]/70 md:w-20" />
    </div>
  );
  const Panel = ({ children: c, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div data-rv className={`relative rounded-t-[200px] border border-[var(--t-gold)]/50 bg-[var(--t-surface)]/80 p-8 pt-16 text-center shadow-[0_40px_80px_-50px_rgba(0,0,0,.8)] md:p-12 md:pt-20 ${className}`}>
      <div className="pointer-events-none absolute inset-2 rounded-t-[192px] border border-[var(--t-gold)]/20" />
      {c}
    </div>
  );

  return (
    <div ref={root} lang={p.language ?? "en"} style={vars(theme, design, "playfair")} className={`rc ${fontClass} relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)]`}>
      <style href="love-rc" precedence="default">{CSS + LENIS_CSS}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.16]" style={{ backgroundImage: JAALI, backgroundSize: "56px 56px" }} />

      {/* ── Intro ── */}
      <header data-section="intro" className={`rc-hero relative overflow-hidden ${compact ? "min-h-[660px]" : "min-h-[100svh]"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,210,120,.18),transparent_70%)]" />
        {[["left-[6%]", 60, "0s", 1], ["left-[22%]", 130, "-1.4s", 0.8], ["right-[22%]", 110, "-2.6s", 0.8], ["right-[6%]", 40, "-.7s", 1]].map(([pos, ch, delay, s], i) => (
          <div key={i} className={`rc-lan absolute top-0 ${pos} ${compact && i % 3 ? "hidden" : ""} ${!compact && (i === 1 || i === 2) ? "hidden md:block" : ""}`}>
            <div className={compact ? "" : "drop"} style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <Lantern chain={ch as number} className="rc-swing w-12 md:w-16" style={{ animationDelay: delay as string, transform: `scale(${s})` }} />
            </div>
          </div>
        ))}
        <div className={`relative z-[2] mx-auto flex ${compact ? "min-h-[660px]" : "min-h-[100svh]"} max-w-5xl items-end justify-center px-5 pt-24`}>
          <div className={`relative w-full ${compact ? "max-w-[340px]" : "max-w-[520px]"}`}>
            <MughalArch className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 70%, transparent)" />
            <div className="relative flex flex-col items-center px-8 pb-12 pt-[26%] text-center md:px-14">
              <p className="k up text-xs text-[var(--t-gold)]" style={{ animationDelay: "2.4s" }}>{sagai}</p>
              <Rings id="rc-hero" className={`mt-4 ${compact ? "w-36" : "w-40 md:w-48"}`} />
              <h1 className={`d mt-4 leading-[1.04] ${compact ? "text-[44px]" : "text-[clamp(46px,6.4vw,84px)]"}`}>
              <span style={{ fontSize: `${fitName(a, b, 7, false)}em` }}>
                <E path="profile.partner1" className="block"><Split text={a} cls="up gold inline-block" delay={2.6} step={0.05} /></E>
                {b && <span className="i up block text-[.5em] text-[var(--t-accent)]" style={{ animationDelay: "3s" }}>{amp}</span>}
                {b && <E path="profile.partner2" className="block"><Split text={b} cls="up gold inline-block" delay={2.9} step={0.05} /></E>}
              </span>
            </h1>
              <p className="i up mt-5 text-xl md:text-2xl" style={{ animationDelay: "3.4s" }}>{date}</p>
              {where && <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="k up mt-2 block text-xs text-[var(--t-muted)]" style={{ animationDelay: "3.5s" }}>{where}</E>}
            </div>
          </div>
        </div>
        {!compact && (
          <>
            <div aria-hidden className="cl pointer-events-none absolute inset-y-0 left-0 z-[5] w-1/2" style={silk("l")} />
            <div aria-hidden className="cr pointer-events-none absolute inset-y-0 right-0 z-[5] w-1/2" style={silk("r")} />
          </>
        )}
      </header>

      <main className="relative z-[2]">
        <Sections
          design={design}
          render={{
            invitation: (
              <section className={`${sec} mx-auto max-w-3xl text-center`}>
                <Title>{L.invitation}</Title>
                <div data-rv><E as="p" multiline path="profile.inviteLine" className="i block text-[clamp(28px,3.8vw,46px)] leading-[1.3]">{p.inviteLine || occasionInvite(p)}</E></div>
                <p data-rv className="k mt-8 text-xs text-[var(--t-muted)]">{hi ? "दोनों परिवारों के आशीर्वाद के साथ" : ru ? "С благословения наших семей" : "With the blessings of our families"}</p>
              </section>
            ),
            story: p.story && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title>{L.story}</Title>
                <div className={`grid items-center gap-12 ${compact ? "" : "md:grid-cols-2"}`}>
                  <div className="rc-arch-sec relative mx-auto aspect-[3/4] w-full max-w-[360px]">
                    <div className="absolute inset-0 overflow-hidden rounded-t-full">
                      {heroUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img data-edit-photo="hero" src={heroUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div data-edit-photo="hero" className="flex h-full w-full items-center justify-center bg-[var(--t-surface)]"><Rings id="rc-por" className="w-2/3" /></div>
                      )}
                    </div>
                    <div className="pointer-events-none absolute -inset-3 rounded-t-full border border-[var(--t-gold)]/60" />
                  </div>
                  <div data-rv><E as="p" multiline path="profile.story" className="i block whitespace-pre-line text-[clamp(22px,2.4vw,30px)] leading-[1.6]">{p.story}</E></div>
                </div>
              </section>
            ),
            details: (p.date || where) && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title>{L.details}</Title>
                <div className={`grid gap-6 ${compact ? "" : "md:grid-cols-2"}`}>
                  <Panel>
                    <p className="k text-xs text-[var(--t-gold)]">{L.when}</p>
                    <p className="d gold mt-4 text-4xl md:text-5xl">{date}</p>
                    {p.events?.[0]?.time && <p className="i mt-3 text-xl text-[var(--t-muted)]">{p.events[0].time}</p>}
                  </Panel>
                  <Panel>
                    <p className="k text-xs text-[var(--t-gold)]">{L.where}</p>
                    <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d gold mt-4 block text-4xl md:text-5xl">{where}</E>
                    {p.venue && p.city && <p className="i mt-3 text-xl text-[var(--t-muted)]">{p.city}</p>}
                  </Panel>
                </div>
                {cd && (
                  <div data-rv className="mt-12 flex justify-center gap-6 md:gap-12">
                    {[[cd.d, L.days], [cd.h, L.hrs], [cd.m, L.min], [cd.s, L.sec]].map(([n, l], i) => (
                      <div key={i} className="text-center"><p className="d gold text-4xl tabular-nums md:text-5xl">{String(n).padStart(2, "0")}</p><p className="k mt-1 text-[10px] text-[var(--t-muted)]">{l}</p></div>
                    ))}
                  </div>
                )}
              </section>
            ),
            schedule: !!p.events?.length && (
              <section className={`${sec} mx-auto max-w-5xl`}>
                <Title>{L.events}</Title>
                <div data-rv-stagger className={`grid gap-6 ${compact ? "" : "md:grid-cols-3"}`}>
                  {p.events.map((e, i) => (
                    <div key={i} className="relative rounded-t-full border border-[var(--t-gold)]/50 px-6 pb-8 pt-14 text-center">
                      <Lantern chain={0} className="absolute -top-8 left-1/2 w-9 -translate-x-1/2" />
                      <p className="k text-xs text-[var(--t-gold)]">{e.time}</p>
                      <p className="d mt-3 text-3xl leading-tight">{e.name}</p>
                      <p className="i mt-2 text-[var(--t-muted)]">{[formatDate(e.date, p.language), e.venue].filter(Boolean).join(" · ")}</p>
                    </div>
                  ))}
                </div>
                {calendarUrl && <div data-rv className="mt-12 text-center"><a href={calendarUrl} className="k inline-flex rounded-full border border-[var(--t-gold)] px-7 py-3 text-xs text-[var(--t-gold)] transition hover:bg-[var(--t-gold)] hover:text-[var(--t-bg)]">{L.calendar}</a></div>}
              </section>
            ),
            venue: where && (
              <section className={`${sec} mx-auto max-w-3xl`}>
                <Title>{L.venue}</Title>
                <Panel className="mx-auto max-w-xl pb-14">
                  <div className="flex justify-center gap-10"><Lantern chain={20} className="w-10" /><Lantern chain={50} className="w-10" /><Lantern chain={20} className="w-10" /></div>
                  <E as="p" path={p.venue ? "profile.venue" : "profile.city"} className="d gold mt-6 block text-[clamp(36px,5vw,60px)] leading-tight">{where}</E>
                  {p.venue && p.city && <p className="i mt-2 text-xl text-[var(--t-muted)]">{p.city}</p>}
                  <a href={mapUrl(p)} target="_blank" rel="noreferrer" className="k mt-8 inline-flex rounded-full border border-[var(--t-gold)] px-7 py-3 text-xs text-[var(--t-gold)] transition hover:bg-[var(--t-gold)] hover:text-[var(--t-bg)]">{L.directions}</a>
                </Panel>
              </section>
            ),
            gallery: gallery.length > 0 && (
              <section className={`${sec} mx-auto max-w-6xl`}>
                <Title>{L.gallery}</Title>
                <div className={`grid gap-5 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                  {gallery.map((k) => (
                    <figure key={k} data-rv className="overflow-hidden rounded-t-full border border-[var(--t-gold)]/60 p-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-t-full object-cover" />
                    </figure>
                  ))}
                </div>
              </section>
            ),
            rsvp: children && (
              <section className={`${sec} mx-auto max-w-xl`}>
                <Panel>
                  <Rings id="rc-rsvp" className="mx-auto w-24" />
                  <p className="d gold mt-3 text-4xl">{L.rsvp}</p>
                  <p className="i mt-1 text-lg text-[var(--t-muted)]">{L.attend}</p>
                  <div className="mt-8 text-left">{children}</div>
                </Panel>
              </section>
            ),
            info: info && (
              <section className={`${sec} mx-auto max-w-2xl text-center`}>
                <Title>{L.info}</Title>
                <E as="p" multiline path="texts.body" className="i block whitespace-pre-line text-2xl leading-relaxed text-[var(--t-muted)]">{info}</E>
              </section>
            ),
          }}
        />
      </main>

      <footer className="relative z-[2] pb-16 pt-10 text-center">
        <Rings id="rc-foot" className="mx-auto w-28" />
        {p.blessing && <E as="p" path="profile.blessing" className="i mt-6 block text-3xl text-[var(--t-accent)]">{p.blessing}</E>}
        <p className="d gold mt-4 text-3xl">{a}{b && <span className="i mx-3 text-[var(--t-accent)]">{amp}</span>}{b}</p>
        <p className="k mt-2 text-xs text-[var(--t-muted)]">{sagai} · {date}</p>
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
