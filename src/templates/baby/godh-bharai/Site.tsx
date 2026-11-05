"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { Motes } from "../_shared/Motes";
import { Bandhanwar, Bangles, Buta, Diya, Jharokha, Kalash, Ladi, Rangoli } from "./art";
import { SHUBH, gbSub, gbTitle } from "./words";
import { gbFonts } from "./fonts";
import { GB_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

/** Genda-phool ladi curtain — two halves that part on load and settle as side drapes. */
function Curtain({ strands = 8, compact = false }: { strands?: number; compact?: boolean }) {
  const half = (side: "l" | "r") => (
    <div className={`gb-cur${side} absolute top-0 flex h-[74%] w-1/2 justify-between ${side === "l" ? "left-0 pl-[1%]" : "right-0 flex-row-reverse pr-[1%]"}`} style={{ transform: `translateX(${side === "l" ? "-" : ""}${compact ? 82 : 80}%)` }}>
      {Array.from({ length: strands }, (_, i) => (
        <div key={i} className={`gb-sway h-full ${i >= 4 ? "hidden sm:block" : ""}`} style={{ "--sw": `${5 + (i % 3)}s`, height: `${100 - ((i * 37) % 5) * 5}%` } as CSSProperties}>
          <Ladi n={14} className="h-full w-auto" tone={i % 2 ? "o" : "mix"} />
        </div>
      ))}
    </div>
  );
  return <div className="pointer-events-none absolute inset-0 z-[6]">{half("l")}{half("r")}</div>;
}

export default function GodhBharaiSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  useLenis(!compact);
  useStory(root, (g, el) => {
    const hero = el.querySelector(".gb-hero");
    if (hero) {
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      g.to(el.querySelector(".gb-px-arch"), { yPercent: 12, scrollTrigger: st });
      g.to(el.querySelector(".gb-px-kalash"), { yPercent: -10, scrollTrigger: st });
      g.to(el.querySelectorAll(".gb-px-cur"), { yPercent: -18, scrollTrigger: st });
    }
    el.querySelectorAll<HTMLElement>(".gb-sec").forEach((s) => rise(g, s.querySelectorAll(".gb-r"), s));
    el.querySelectorAll<SVGGElement>(".gb-sec .gb-draw").forEach((d) =>
      g.from(d.querySelectorAll("path,circle"), { drawSVG: "0%", duration: 2.4, stagger: 0.03, ease: "power2.inOut", scrollTrigger: { trigger: d.closest("section"), start: "top 75%", once: true } }),
    );
    el.querySelectorAll<HTMLElement>(".gb-thread").forEach((t) => g.from(t, { scaleY: 0, transformOrigin: "50% 0", ease: "none", scrollTrigger: { trigger: t.closest("section"), start: "top 70%", end: "bottom 70%", scrub: true } }));
  }, !compact);

  const head = (eyebrow: string, title: ReactNode, light = false) => (
    <div className="gb-r mb-[clamp(28px,5cqw,52px)]">
      <Buta className={`mx-auto mb-3 h-8 w-6 ${light ? "text-[#f2c86a]" : "text-[var(--gb-kum)]"}`} />
      <p className={`lbl text-[11px] ${light ? "text-[#f2c86a]" : "text-[var(--t-muted)]"}`}>{eyebrow}</p>
      <h2 className={`d gb-h mt-2 ${light ? "!text-[#fbe9c8]" : ""}`}>{title}</h2>
    </div>
  );

  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="gb-sec">
        <div className="gb-wrap">
          <Rangoli className="gb-r mx-auto mb-8 w-[clamp(90px,16cqw,140px)]" />
          <E as="p" path="profile.inviteLine" multiline className="gb-r d block text-[clamp(26px,4.6cqw,44px)] leading-[1.3] text-[var(--gb-maroon)]">{S.invite}</E>
          <p className="gb-r sc mt-8 text-[clamp(22px,3.4cqw,32px)] text-[var(--gb-kum)]">{gbSub(profile)}</p>
        </div>
      </Sec>
    ),
    story: (
      <Sec id="story" className="gb-sec gb-band">
        <div className="gb-wrap max-w-[720px]">
          <div className="gb-r gb-panel px-[clamp(22px,6cqw,64px)] py-[clamp(36px,7cqw,72px)]">
            <Buta className="absolute left-4 top-4 h-10 w-8 text-[var(--t-gold)]" />
            <Buta className="absolute right-4 top-4 h-10 w-8 -scale-x-100 text-[var(--t-gold)]" />
            {head(w.story, <>{w.awaiting}</>)}
            <E as="p" path="profile.story" multiline className="gb-p block">{profile.story || w.blessing}</E>
          </div>
        </div>
      </Sec>
    ),
    details: (
      <Sec id="details" className="gb-sec gb-maroonbg overflow-hidden">
        {!compact && <Motes color={[1, 0.8, 0.4]} count={70} size={8} rise={0.012} twinkle={0.6} />}
        <div className="gb-wrap relative">
          {head(w.details, <>{S.date || w.soon}</>, true)}
          <DaysToGo iso={profile.date} render={(n) => (
            <div className="gb-r relative mx-auto mb-12 grid w-[clamp(200px,40cqw,300px)] place-items-center">
              <div className="relative w-full"><Rangoli className="w-full opacity-90" petals={16} />
              <div className="absolute inset-0 grid place-items-center">
                <span className="absolute aspect-square w-[40%] rounded-full bg-[#5a1410] shadow-[0_0_0_2px_#c9a24a]" />
                <span className="d foil gb-a-sheen relative block text-[clamp(34px,6.4cqw,60px)] leading-none">{n === null ? "॥" : n}</span>
              </div></div>
              <span className="lbl mt-3 text-[11px] text-[#f2c86a]">{n === 0 ? w.today : n === 1 ? w.day : w.days}</span>
            </div>
          )} />
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="gb-r">
              <p className="lbl text-[10px] text-[#f2c86a]">{w.when}</p>
              <p className="d mt-3 text-[clamp(24px,3.6cqw,34px)]">{S.date}</p>
              {S.events[0]?.time && <p className="mt-1 text-sm opacity-75">{S.events[0].time}</p>}
            </div>
            <div className="gb-r">
              <p className="lbl text-[10px] text-[#f2c86a]">{w.where}</p>
              <E as="p" path="profile.venue" className="d mt-3 block text-[clamp(24px,3.6cqw,34px)]">{profile.venue}</E>
              <E as="p" path="profile.city" className="mt-1 block text-sm opacity-75">{profile.city}</E>
            </div>
          </div>
          {calendarUrl && <a href={calendarUrl} className="gb-r gb-btn mt-10">{w.calendar}</a>}
        </div>
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="gb-sec">
        <div className="gb-wrap max-w-[640px]">
          {head(w.schedule, <>{gbTitle(profile)}</>)}
          <div className="relative text-left">
            <div className="gb-thread absolute bottom-4 left-[21px] top-4 w-[2px] bg-[repeating-linear-gradient(180deg,#c9452f_0_6px,#e0a43a_6px_10px)]" aria-hidden />
            {S.events.map((e, i) => (
              <div key={i} className="gb-r relative flex gap-6 pb-12 last:pb-0">
                <div className="relative z-[1] w-11 shrink-0"><Ladi n={1} tassel={false} tone={i % 2 ? "y" : "o"} className="w-full" /></div>
                <div className="gb-panel flex-1 px-6 py-5">
                  <p className="lbl text-[10px] text-[var(--gb-kum)]">{[e.time, e.date && e.date !== profile.date ? S.fmt(e.date) : ""].filter(Boolean).join(" · ")}</p>
                  <p className="d mt-1 text-[clamp(22px,3.4cqw,30px)] text-[var(--gb-maroon)]">{e.name}</p>
                  {e.venue && <p className="mt-1 text-sm text-[var(--t-muted)]">{e.venue}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="gb-sec gb-band">
        <div className="gb-wrap">
          <div className="gb-r relative mx-auto w-[min(100%,440px)] px-[8%] pb-12 pt-[26%]">
            <Jharokha className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 85%, transparent)" />
            <div className="relative">
              <p className="lbl text-[10px] text-[var(--t-muted)]">{w.venue}</p>
              <E as="h2" path="profile.venue" className="d gb-h mt-3 block">{profile.venue || profile.city}</E>
              <E as="p" path="profile.city" className="gb-p mt-2 block">{profile.city}</E>
              <Bangles className="mx-auto my-6 w-20" />
              {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="gb-btn">{w.directions} →</a>}
            </div>
          </div>
        </div>
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="gb-sec">
        <div className="gb-wrap">
          {head(w.gallery, <>{w.hello}</>)}
          <div className={`grid gap-5 ${S.gallery.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "mx-auto max-w-[360px]"}`}>
            {(S.gallery.length ? S.gallery : [heroUrl ?? null]).map((src, i) => (
              <div key={i} className="gb-r relative aspect-[200/280]">
                <div className="absolute inset-[3%] overflow-hidden" style={{ borderRadius: "50% 50% 4px 4px / 34% 34% 4px 4px" }}>
                  <Photo src={src} slot={S.gallery.length ? "gallery" : "hero"} />
                </div>
                <Jharokha className="absolute inset-0 h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="gb-sec gb-band">
        <div className="gb-wrap max-w-[640px]">
          {head(w.rsvp, <>{S.L.attend}</>)}
          <div className="gb-r gb-panel overflow-hidden px-[clamp(18px,5cqw,44px)] pb-[clamp(22px,5cqw,44px)] pt-[clamp(44px,9cqw,70px)] text-left">
            <Bandhanwar className="absolute inset-x-0 top-0 w-full" swags={3} />
            {children}
          </div>
        </div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="gb-sec">
        <div className="gb-wrap max-w-[680px]">
          {head(w.info, <>{w.with}</>)}
          <E as="p" path="texts.body" multiline className="gb-r gb-p block whitespace-pre-line">{S.info || w.blessing}</E>
        </div>
      </Sec>
    ),
  };

  const k = Math.min(fit(a, 7), b ? fit(b, 7) : 1);
  const big = compact ? `clamp(38px, ${11 * k}cqw, 92px)` : `clamp(42px, min(${12 * k}cqw, ${9 * k}svh), 120px)`;
  return (
    <div ref={root} className={`gb gb-site ${gbFonts}`} style={bxVars(theme, design, "royal")}>
      <style href="bx-godh-bharai" precedence="default">{GB_CSS}</style>
      {/* ── Opening: a genda-phool curtain parts, the bandhanwar drops, diyas flicker beneath a jharokha ── */}
      <header className="gb-hero gb-paper" style={{ minHeight: compact ? "clamp(600px,150cqw,860px)" : "100svh" }}>
        <div className="gb-px-cur absolute inset-0"><Curtain strands={compact ? 4 : 8} compact={compact} /></div>
        <div className="gb-a-drop absolute inset-x-0 top-0 z-[7]" style={dl(0.2)}><Bandhanwar className="w-full" swags={compact ? 3 : 4} /></div>
        <div className="gb-px-arch gb-a-zoom relative z-[2] mb-[-4%] w-[clamp(280px,min(64cqw,56svh),540px)]" style={dl(1.3)}>
          <div className="relative aspect-[200/280]">
            <Jharokha className="absolute inset-0 h-full w-full" fill="color-mix(in oklab, var(--t-surface) 88%, transparent)" />
            <div className="absolute inset-x-[9%] bottom-[25%] top-[17%] flex flex-col items-center justify-center">
              <p className="sc gb-a-rise text-[clamp(15px,2.6cqw,22px)] text-[var(--gb-kum)]" style={dl(1.9)}>{SHUBH}</p>
              <h1 className="d mt-[4%] leading-[1.02] text-[var(--gb-maroon)]" style={{ fontSize: big }}>
                <E path="profile.partner1" className="gb-a-rise block" style={dl(2.1)}>{a}</E>
                {b && <span className="sc gb-a-rise block text-[.5em] leading-[1.3] text-[var(--t-gold)]" style={dl(2.3)}>&amp;</span>}
                {b && <E path="profile.partner2" className="gb-a-rise block" style={dl(2.4)}>{b}</E>}
              </h1>
              <p className="sc gb-a-rise mt-[3%] text-[clamp(16px,2.6cqw,22px)] text-[var(--gb-kum)]" style={dl(2.6)}>{gbSub(profile)}</p>
              <p className="lbl gb-a-rise mt-[4%] text-[clamp(9px,1.4cqw,12px)] text-[var(--t-muted)]" style={dl(2.8)}>{[S.date, profile.city].filter(Boolean).join(" · ")}</p>
              <Bangles className="gb-a-rise mt-[6%] w-[22%]" style={dl(3)} />
            </div>
          </div>
        </div>
        <div className="relative z-[3] flex w-[clamp(300px,70cqw,620px)] items-end justify-between">
          <Diya className="gb-a-rise w-[16%]" style={dl(2.2)} />
          <div className="gb-px-kalash gb-a-rise w-[30%]" style={dl(1.7)}><Kalash className="w-full" /></div>
          <Diya className="gb-a-rise w-[16%]" style={dl(2.3)} />
        </div>
        <Rangoli className="relative z-[1] -mt-[6%] mb-[-16%] w-[clamp(240px,60cqw,520px)] opacity-80" petals={16} />
      </header>

      {S.visible.map((id) => <div key={id}>{sections[id]}</div>)}

      <footer className="gb-maroonbg relative overflow-hidden px-6 pb-12 pt-24 text-center">
        <Bandhanwar className="absolute inset-x-0 top-0 w-full" swags={4} />
        <div className="mx-auto flex w-40 items-end justify-between"><Diya className="w-12" /><Diya className="w-12" /></div>
        <p className="sc mt-4 text-2xl text-[#f2c86a]">{SHUBH}</p>
        <p className="d mt-3 text-3xl">{b ? `${a} & ${b}` : a}</p>
        <E as="p" path="profile.blessing" className="lbl mt-3 block text-[10px] text-[#f2c86a]">{profile.blessing || w.with}</E>
        <div className="mt-8 text-xs opacity-70">{credit}</div>
      </footer>
    </div>
  );
}
