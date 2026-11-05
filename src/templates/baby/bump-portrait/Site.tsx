"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { FilmGrain, MoonPhase, PHASES, Sprockets, roman } from "./art";
import { bpWords } from "./words";
import { bpFonts } from "./fonts";
import { BP_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

export default function BumpPortraitSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  const X = bpWords(profile);
  useLenis(!compact);
  useStory(root, (g, el) => {
    const hero = el.querySelector(".bp-hero");
    if (hero) {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      g.to(el.querySelector(".bp-px-photo"), { yPercent: 18, scale: 1.08, scrollTrigger: st });
      g.to(el.querySelector(".bp-px-title"), { yPercent: -40, opacity: 0.2, scrollTrigger: st });
    }
    el.querySelectorAll<HTMLElement>(".bp-sec").forEach((s) => rise(g, s.querySelectorAll(".bp-r"), s, { y: 30, filter: "blur(4px)", duration: 1.3 }));
    el.querySelectorAll<HTMLElement>(".bp-reveal").forEach((ph) => g.fromTo(ph, { clipPath: "inset(12% 12% 12% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: ph, start: "top 90%", end: "top 30%", scrub: true } }));
    el.querySelectorAll<HTMLElement>(".bp-moons").forEach((m) => g.from(m.children, { opacity: 0, scale: 0.3, stagger: 0.12, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: m, start: "top 85%", once: true } }));
  }, !compact);

  const label = (n: number, t: string, dark = false) => (
    <p className={`bp-r lbl text-[11px] ${dark ? "text-[var(--bp-moon)]/70" : "text-[var(--t-muted)]"}`}>{X.chapter} {roman(n)} <span className="mx-2 opacity-50">—</span> {t}</p>
  );

  const ch = (id: SectionId) => S.visible.indexOf(id) + 1;
  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="bp-sec">
        <div className="bp-wrap grid gap-8 md:grid-cols-[1fr_2.4fr]">
          {label(ch("invitation"), w.invitation)}
          <E as="p" path="profile.inviteLine" multiline className="bp-r d bp-big block !text-[clamp(32px,5.6cqw,80px)] leading-[1.08]">{S.invite}</E>
        </div>
      </Sec>
    ),
    story: (
      <Sec id="story" className="bp-sec !pt-0">
        <div className="bp-wrap grid items-end gap-[clamp(28px,5cqw,80px)] md:grid-cols-[1fr_1fr]">
          <div className="bp-reveal relative aspect-[3/4] overflow-hidden"><Photo src={heroUrl} slot="hero" style={{ objectPosition: "60% 40%" }} /><FilmGrain opacity={0.12} /></div>
          <div>
            {label(ch("story"), w.story)}
            <h2 className="bp-r d mt-4 text-[clamp(36px,5.6cqw,72px)] leading-none">{w.awaiting}</h2>
            <E as="p" path="profile.story" multiline className="bp-r bp-p mt-6 block">{profile.story || w.blessing}</E>
          </div>
        </div>
      </Sec>
    ),
    details: (
      <Sec id="details" className="bp-sec bp-dark relative overflow-hidden">
        <FilmGrain opacity={0.14} />
        <div className="bp-wrap relative">
          {label(ch("details"), w.details, true)}
          <DaysToGo iso={profile.date} render={(d) => {
            const lit = d === null ? 9 : Math.max(1, Math.min(9, 9 - Math.ceil(d / 30)));
            return (
              <>
                <div className="bp-moons mt-12 grid grid-cols-9 gap-[clamp(4px,1.4cqw,20px)]">
                  {PHASES.map((k, i) => <MoonPhase key={i} k={k} className="w-full" lit={i < lit ? "var(--bp-moon)" : "rgba(243,234,217,.22)"} />)}
                </div>
                <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
                  <p className="bp-r d leading-[.85] text-[clamp(90px,20cqw,260px)]">{d === null ? "IX" : d}</p>
                  <p className="bp-r lbl max-w-[260px] pb-4 text-right text-[11px] leading-[2] opacity-80">{d === 0 ? w.today : d === 1 ? w.day : w.days}<br />{X.moons}</p>
                </div>
              </>
            );
          }} />
          <div className="mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2">
            <div className="bp-r"><p className="lbl text-[10px] opacity-60">{w.when}</p><p className="d mt-3 text-[clamp(26px,3.6cqw,44px)]">{S.date}</p>{S.events[0]?.time && <p className="tc mt-1 opacity-70">{S.events[0].time}</p>}</div>
            <div className="bp-r"><p className="lbl text-[10px] opacity-60">{w.where}</p><E as="p" path="profile.venue" className="d mt-3 block text-[clamp(26px,3.6cqw,44px)]">{profile.venue}</E><E as="p" path="profile.city" className="tc mt-1 block opacity-70">{profile.city}</E></div>
          </div>
          {calendarUrl && <a href={calendarUrl} className="bp-r bp-btn mt-12">{w.calendar}</a>}
        </div>
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="bp-sec">
        <div className="bp-wrap">
          {label(ch("schedule"), w.schedule)}
          <div className="mt-10 border-t border-[color-mix(in_oklab,var(--bp-ink)_18%,transparent)]">
            {S.events.map((e, i) => (
              <div key={i} className="bp-r grid grid-cols-[auto_1fr] items-baseline gap-x-[clamp(16px,4cqw,60px)] border-b border-[color-mix(in_oklab,var(--bp-ink)_18%,transparent)] py-[clamp(18px,3cqw,34px)] sm:grid-cols-[120px_1fr_auto]">
                <span className="tc text-sm text-[var(--t-muted)]">{e.time || "—"}</span>
                <span className="d text-[clamp(26px,4cqw,52px)] leading-none">{e.name}</span>
                <span className="lbl col-start-2 mt-2 text-[10px] text-[var(--t-muted)] sm:col-start-auto sm:mt-0">{[e.venue, e.date && e.date !== profile.date ? S.fmt(e.date) : ""].filter(Boolean).join(" · ")}</span>
              </div>
            ))}
          </div>
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="bp-sec bp-dark relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-25"><Photo src={heroUrl} slot="hero" style={{ filter: "grayscale(1) blur(2px)" }} /></div>
        <FilmGrain opacity={0.16} />
        <div className="bp-wrap relative">
          {label(ch("venue"), w.venue, true)}
          <E as="h2" path="profile.venue" className="bp-r d bp-big mt-8 block">{profile.venue || profile.city}</E>
          <p className="bp-r tc mt-4 opacity-75">{S.where}</p>
          {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="bp-r bp-btn mt-10">{w.directions}</a>}
        </div>
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="bp-sec !px-0">
        <div className="bp-wrap px-[clamp(20px,6cqw,90px)]">{label(ch("gallery"), w.gallery)}</div>
        <div className="bp-strip mt-10 overflow-x-auto">
          <div className="w-max min-w-full">
            <Sprockets />
            <div className="my-3 flex gap-3 px-3">
              {(S.gallery.length ? S.gallery : [heroUrl ?? null, heroUrl ?? null, heroUrl ?? null]).map((src, i) => (
                <div key={i} className="bp-r relative aspect-[3/2] w-[clamp(240px,40cqw,520px)] shrink-0 overflow-hidden">
                  <Photo src={src} slot={S.gallery.length ? "gallery" : "hero"} style={S.gallery.length ? undefined : { objectPosition: `${[50, 20, 80][i]}% ${[50, 30, 70][i]}%`, filter: i === 1 ? "grayscale(1)" : undefined }} />
                  <span className="tc absolute bottom-2 left-3 text-[10px] text-[#f3ead9]/80">{String(i + 1).padStart(2, "0")}A</span>
                </div>
              ))}
            </div>
            <Sprockets />
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="bp-sec">
        <div className="bp-wrap grid gap-10 md:grid-cols-[1fr_1.3fr]">
          <div>{label(ch("rsvp"), w.rsvp)}<h2 className="bp-r d mt-4 text-[clamp(36px,5.6cqw,72px)] leading-none">{S.L.attend}</h2></div>
          <div className="bp-r">{children}</div>
        </div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="bp-sec !pt-0">
        <div className="bp-wrap grid gap-8 md:grid-cols-[1fr_2.4fr]">
          {label(ch("info"), w.info)}
          <E as="p" path="texts.body" multiline className="bp-r bp-p block whitespace-pre-line">{S.info || w.blessing}</E>
        </div>
      </Sec>
    ),
  };
  const ordered = S.visible.map((id) => ({ id, node: sections[id] })).filter((x) => x.node);

  const k = Math.min(fit(a, 6), b ? fit(b, 6) : 1);
  const title = compact ? `clamp(40px, ${13 * k}cqw, 130px)` : `clamp(52px, min(${13 * k}cqw, ${15 * k}svh), 190px)`;
  return (
    <div ref={root} className={`bp bp-site ${bpFonts}`} style={bxVars(theme, design, "modern")}>
      <style href="bx-bump-portrait" precedence="default">{BP_CSS}</style>
      {/* ── Opening: letterbox — black bars part on the portrait, nine moons wax one by one, the title tracks in ── */}
      <header className="bp-hero bp-dark relative overflow-hidden" style={{ height: compact ? "clamp(560px,140cqw,820px)" : "100svh", minHeight: compact ? undefined : 560 }}>
        <div className="bp-px-photo absolute inset-0"><div className="bp-a-ken h-full w-full"><Photo src={heroUrl} slot="hero" /></div></div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,9,8,.35) 0%, transparent 30%, transparent 45%, rgba(10,9,8,.82) 100%)" }} />
        <FilmGrain opacity={0.2} />
        <div className="bp-bar bp-a-bart top-0 flex items-end justify-between px-[clamp(16px,4cqw,48px)] pb-3" style={{ height: compact ? "7%" : "clamp(44px,8svh,80px)" }}>
          <span className="lbl text-[9px] text-[#f3ead9]/60">{X.chapter} IX</span>
          <span className="tc text-[10px] text-[#f3ead9]/60">{[profile.city, S.date].filter(Boolean).join(" · ")}</span>
        </div>
        <div className="bp-bar bp-a-barb bottom-0 flex items-center justify-center gap-[clamp(6px,1.4cqw,14px)]" style={{ height: compact ? "9%" : "clamp(56px,10svh,96px)" }}>
          {PHASES.map((p, i) => <MoonPhase key={i} k={p} className="bp-a-moon w-[clamp(14px,2.6cqw,26px)]" style={dl(1.6 + i * 0.12)} />)}
        </div>
        <div className="bp-px-title absolute inset-x-0 bottom-[calc(clamp(56px,10svh,96px)+clamp(24px,6svh,64px))] z-[4] px-[clamp(20px,6cqw,90px)] text-[var(--bp-moon)]">
          <p className="lbl bp-a-in text-[clamp(9px,1.2cqw,12px)] opacity-80" style={dl(2.6)}>{S.line}</p>
          <h1 className="d mt-3 leading-[.9]" style={{ fontSize: title }}>
            <E path="profile.partner1" className="bp-a-track block" style={dl(2.8)}>{a}</E>
            {b && <span className="bp-a-track block" style={dl(3.1)}><span className="text-[.5em] italic opacity-70">&amp; </span><E path="profile.partner2">{b}</E></span>}
          </h1>
          <p className="tc bp-a-in mt-5 text-[clamp(11px,1.4cqw,14px)] opacity-80" style={dl(3.6)}>{X.tagline}</p>
        </div>
      </header>

      {ordered.map((x) => <div key={x.id}>{x.node}</div>)}

      <footer className="bp-dark relative overflow-hidden px-6 py-[clamp(80px,14cqw,160px)] text-center">
        <FilmGrain opacity={0.14} />
        <div className="relative">
          <p className="lbl text-[10px] opacity-60">{X.starring}</p>
          <p className="d mt-4 text-[clamp(32px,5cqw,56px)]">{a}{b && <> <span className="opacity-60">&amp;</span> {b}</>}</p>
          <p className="lbl mt-10 text-[10px] opacity-60">{X.introducing}</p>
          <MoonPhase k={1} className="mx-auto mt-5 w-12" />
          <p className="d mt-4 text-[clamp(28px,4cqw,44px)] italic">{X.baby}</p>
          <E as="p" path="profile.blessing" className="tc mt-10 block text-xs opacity-70">{profile.blessing || w.with}</E>
          <div className="mt-8 text-xs opacity-60">{credit}</div>
        </div>
      </footer>
    </div>
  );
}
