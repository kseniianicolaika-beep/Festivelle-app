"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { Eucalyptus, Stave } from "./art";
import { slWords } from "./words";
import { slFonts } from "./fonts";
import { SL_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;
const pad2 = (n: number) => String(n).padStart(2, "0");

export default function SageLullabySite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  const X = slWords(profile);
  const no = (id: SectionId) => pad2(S.visible.indexOf(id) + 1);
  useLenis(!compact);
  useStory(root, (g, el) => {
    el.querySelectorAll<HTMLElement>(".sl-sec").forEach((s) => {
      rise(g, s.querySelectorAll(".sl-r"), s, { y: 26, duration: 1.3 });
      s.querySelectorAll<SVGPathElement>(".sl-scroll-ink path").forEach((p) => g.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: { trigger: s, start: "top 75%", once: true } }));
      s.querySelectorAll(".sl-scroll-ink .sl-washm").forEach((p) => g.from(p, { opacity: 0, duration: 2, delay: 1, scrollTrigger: { trigger: s, start: "top 75%", once: true } }));
    });
    const hero = el.querySelector(".sl-hero");
    if (hero) g.to(el.querySelector(".sl-px-branch"), { yPercent: -12, rotate: -4, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }, !compact);

  const label = (id: SectionId, t: string) => (
    <div className="sl-r">
      <p className="d i text-[clamp(40px,6cqw,64px)] leading-none text-[var(--sl-green)]">{X.no} {no(id)}</p>
      <p className="lbl mt-2 text-[11px] text-[var(--t-muted)]">{t}</p>
    </div>
  );
  const grid = "sl-wrap grid gap-[clamp(20px,4cqw,64px)] md:grid-cols-[1fr_2.6fr]";

  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="sl-sec">
        <div className={grid}>
          {label("invitation", w.invitation)}
          <E as="p" path="profile.inviteLine" multiline className="sl-r d i block text-[clamp(30px,5cqw,64px)] leading-[1.12] text-[var(--sl-deep)]">“{S.invite}”</E>
        </div>
      </Sec>
    ),
    story: (
      <Sec id="story" className="sl-sec">
        <div className={grid}>
          {label("story", w.story)}
          <div className="relative">
            <h2 className="sl-r d text-[clamp(34px,5cqw,56px)] leading-none">{w.awaiting}</h2>
            <E as="p" path="profile.story" multiline className="sl-r sl-p sl-drop mt-6 block md:columns-2 md:gap-10">{profile.story || w.blessing}</E>
            <Eucalyptus variant="willow" leaves={9} seed={6} manual className="sl-scroll-ink pointer-events-none absolute -right-[12%] -top-[40%] hidden w-[14%] rotate-[18deg] opacity-80 md:block" />
          </div>
        </div>
      </Sec>
    ),
    details: (
      <Sec id="details" className="sl-sec">
        <div className={grid}>
          {label("details", X.contents)}
          <div>
            {[
              [w.when, S.date, "profile.date"],
              ["", S.events[0]?.time ?? "", ""],
              [w.where, profile.venue ?? "", "profile.venue"],
              ["", profile.city ?? "", "profile.city"],
            ].filter((r) => r[1]).map(([k, v, path], i) => (
              <div key={i} className="sl-r flex items-baseline gap-4 py-3">
                <span className="lbl shrink-0 text-[11px] text-[var(--t-muted)]">{k || " "}</span>
                <span className="mb-[.35em] flex-1 border-b border-dotted border-[color-mix(in_oklab,var(--t-ink)_35%,transparent)]" />
                {path && path !== "profile.date" ? <E path={path} className="d text-[clamp(22px,3.2cqw,34px)]">{v}</E> : <span className="d text-[clamp(22px,3.2cqw,34px)]">{v}</span>}
              </div>
            ))}
            <DaysToGo iso={profile.date} render={(n) => (
              <div className="sl-r mt-8 flex items-end gap-5 border-t border-[color-mix(in_oklab,var(--t-ink)_22%,transparent)] pt-8">
                <span className="d i leading-[.8] text-[clamp(90px,16cqw,200px)] text-[var(--sl-green)]">{n === null ? "—" : n}</span>
                <span className="lbl pb-3 text-[11px] text-[var(--t-muted)]">{n === 0 ? w.today : n === 1 ? w.day : w.days}</span>
              </div>
            )} />
            {calendarUrl && <a href={calendarUrl} className="sl-r sl-btn mt-8">{w.calendar}</a>}
          </div>
        </div>
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="sl-sec">
        <div className={grid}>
          {label("schedule", w.schedule)}
          <ol>
            {S.events.map((e, i) => (
              <li key={i} className="sl-r grid grid-cols-[auto_1fr] gap-x-6 border-t border-[color-mix(in_oklab,var(--t-ink)_22%,transparent)] py-6 last:border-b">
                <span className="d i text-[clamp(30px,4cqw,48px)] leading-none text-[var(--sl-green)]">{i + 1}.</span>
                <div>
                  <p className="d text-[clamp(24px,3.4cqw,38px)] leading-tight">{e.name}</p>
                  <p className="lbl mt-2 text-[11px] text-[var(--t-muted)]">{[e.time, e.venue, e.date && e.date !== profile.date ? S.fmt(e.date) : ""].filter(Boolean).join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="sl-sec">
        <div className={grid}>
          {label("venue", w.venue)}
          <div className="grid items-center gap-8 sm:grid-cols-[1fr_1.2fr]">
            <figure className="sl-r relative border border-[color-mix(in_oklab,var(--t-ink)_20%,transparent)] bg-[color-mix(in_oklab,var(--sl-linen)_60%,#fff)] p-6">
              <Eucalyptus manual className="sl-scroll-ink mx-auto w-[64%]" seed={9} leaves={11} />
              <figcaption className="lbl mt-3 text-center text-[10px] text-[var(--t-muted)]">{X.plate} II — Eucalyptus gunnii</figcaption>
            </figure>
            <div>
              <E as="h2" path="profile.venue" className="sl-r d i block text-[clamp(38px,6cqw,72px)] leading-none">{profile.venue || profile.city}</E>
              <p className="sl-r sl-p mt-4">{S.where}</p>
              {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="sl-r sl-btn mt-8">{w.directions} →</a>}
            </div>
          </div>
        </div>
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="sl-sec">
        <div className={grid}>
          {label("gallery", w.gallery)}
          <div className="grid grid-cols-2 gap-[clamp(12px,2.4cqw,28px)]">
            {(S.gallery.length ? S.gallery : [heroUrl ?? null]).map((src, i, all) => (
              <figure key={i} className={`sl-r ${all.length === 1 ? "col-span-2" : i % 3 === 0 ? "col-span-2" : ""}`}>
                <div className={`overflow-hidden ${all.length === 1 || i % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}><Photo src={src} slot={S.gallery.length ? "gallery" : "hero"} /></div>
                <figcaption className="lbl mt-2 text-[10px] text-[var(--t-muted)]">{X.fig} {i + 1}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="sl-sec">
        <div className={grid}>
          {label("rsvp", w.rsvp)}
          <div>
            <h2 className="sl-r d i text-[clamp(34px,5cqw,56px)] leading-none">{S.L.attend}</h2>
            <div className="sl-r mt-8 max-w-[620px]">{children}</div>
          </div>
        </div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="sl-sec">
        <div className={grid}>
          {label("info", w.info)}
          <E as="p" path="texts.body" multiline className="sl-r sl-p block whitespace-pre-line">{S.info || w.blessing}</E>
        </div>
      </Sec>
    ),
  };

  const k = Math.min(fit(a, 7), b ? fit(b, 7) : 1);
  const mast = compact ? `clamp(46px, ${15 * k}cqw, 150px)` : `clamp(60px, ${15 * k}cqw, 230px)`;
  const visible = S.visible.filter((id) => sections[id]);
  return (
    <div ref={root} className={`sl sl-site sl-linen ${slFonts}`} style={bxVars(theme, design, "modern")}>
      <style href="bx-sage-lullaby" precedence="default">{SL_CSS}</style>
      {/* ── Opening: ink bloom — a eucalyptus branch draws itself in ink, watercolour bleeds in, the masthead types on ── */}
      <header className="sl-hero relative overflow-hidden px-[clamp(20px,6cqw,80px)] pb-[clamp(28px,5cqw,60px)] pt-[clamp(20px,3cqw,36px)]" style={{ minHeight: compact ? "auto" : "100svh" }}>
        <div className="sl-wrap flex h-full flex-col" style={{ minHeight: compact ? undefined : "calc(100svh - 80px)" }}>
          <div className="sl-in flex items-center justify-between gap-4 border-b border-[color-mix(in_oklab,var(--t-ink)_30%,transparent)] pb-3" style={dl(0.2)}>
            <span className="lbl text-[10px]">{X.vol}</span>
            <span className="lbl text-[10px]">{S.date}</span>
          </div>
          <p className="lbl sl-in mt-[clamp(18px,3cqw,32px)] text-[11px] text-[var(--sl-green)]" style={dl(0.6)}>{S.line}</p>
          <h1 className="d i mt-2 leading-[.86] tracking-[-.02em] text-[var(--sl-deep)]" style={{ fontSize: mast }}>
            <E path="profile.partner1" className="sl-type block" style={dl(0.9)}>{a}</E>
            {b && <span className="sl-type block" style={dl(1.5)}><span className="not-italic text-[var(--sl-green)]">&amp;</span> <E path="profile.partner2">{b}</E></span>}
          </h1>
          <div className="relative mt-[clamp(20px,4cqw,48px)] grid flex-1 gap-8 md:grid-cols-[1fr_1.2fr]">
            <div className="relative z-[1] flex flex-col justify-end">
              <p className="lbl sl-in text-[10px] text-[var(--t-muted)]" style={dl(2.2)}>{X.inside}</p>
              <ul className="mt-3">
                {[S.invite, ...X.lines.slice(1)].map((t, i) => (
                  <li key={i} className="sl-in flex gap-4 border-t border-[color-mix(in_oklab,var(--t-ink)_20%,transparent)] py-3" style={dl(2.4 + i * 0.15)}>
                    <span className="d i text-[var(--sl-green)]">{pad2(i + 1)}</span>
                    <span className="d text-[clamp(17px,2cqw,21px)] leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
              <p className="lbl sl-in mt-4 text-[10px] text-[var(--t-muted)]" style={dl(3)}>{[profile.venue, profile.city].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="sl-px-branch pointer-events-none absolute -right-[14%] -top-[14%] w-[78%] opacity-45 md:opacity-90 md:relative md:right-auto md:top-auto md:w-auto">
              <Eucalyptus className="ml-auto w-full max-w-[460px] md:-mt-[30%]" delay={0.4} leaves={15} />
            </div>
          </div>
          <div className="mt-6 text-[var(--sl-deep)]">
            <Stave className="w-full" />
            <p className="d i sl-in mt-1 text-right text-[clamp(16px,2cqw,20px)] text-[var(--t-muted)]" style={dl(2.8)}>— {X.lullaby}</p>
          </div>
        </div>
      </header>

      {visible.map((id) => <div key={id}><div className="sl-wrap sl-rule mx-[clamp(20px,6cqw,80px)] xl:mx-auto" />{sections[id]}</div>)}

      <footer className="relative overflow-hidden bg-[var(--sl-deep)] px-6 py-[clamp(60px,10cqw,110px)] text-center text-[var(--sl-linen)]">
        <Stave className="mx-auto w-full max-w-[720px] opacity-70" notes={7} />
        <p className="d i mt-8 text-[clamp(36px,6cqw,64px)]">{b ? `${a} & ${b}` : a}</p>
        <E as="p" path="profile.blessing" className="lbl mt-3 block text-[10px] opacity-75">{profile.blessing || w.with}</E>
        <div className="mt-8 text-xs opacity-60">{credit}</div>
      </footer>
    </div>
  );
}
