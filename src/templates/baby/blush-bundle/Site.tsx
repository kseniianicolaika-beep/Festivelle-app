"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { SiteProps } from "../../types";
import type { SectionId } from "@/lib/templates";
import { E } from "@/components/designs/Editable";
import { siteData, fit } from "../_shared/words";
import { bxVars } from "../_shared/vars";
import { useStory, useLenis, rise } from "../_shared/motion";
import { Sec, DaysToGo, Photo } from "../_shared/ui";
import { Booties, Bow, Leaves, Peony, Seal, SweetPea } from "./art";
import { Envelope } from "./Envelope";
import { bbFonts } from "./fonts";
import { BB_CSS } from "./style";

const dl = (s: number) => ({ "--dl": `${s}s` }) as CSSProperties;

/** Corner bouquet: peonies, sweet pea and leaves, loosely arranged. */
export function Bouquet({ className = "", style, flip = false, delay = 0.2 }: { className?: string; style?: CSSProperties; flip?: boolean; delay?: number }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={{ ...style, transform: flip ? "scaleX(-1)" : undefined }} aria-hidden>
      <div className="bb-bloom relative aspect-square w-full" style={dl(delay)}>
        <Leaves className="absolute left-[2%] top-[38%] w-[78%] rotate-[-18deg]" seed={4} />
        <SweetPea className="bb-sway absolute left-[46%] top-[-6%] w-[40%] rotate-[20deg]" />
        <Peony className="absolute left-[-4%] top-[14%] w-[66%]" tone="blush" seed={2} />
        <Peony className="absolute left-[34%] top-[40%] w-[46%]" tone="rose" seed={6} />
        <Peony className="absolute left-[8%] top-[56%] w-[36%]" tone="cream" seed={9} />
      </div>
    </div>
  );
}

export default function BlushBundleSite({ profile, theme, design, heroUrl, calendarUrl, children, credit, compact }: SiteProps) {
  const root = useRef<HTMLDivElement>(null);
  const S = siteData(profile, design);
  const { a, b, w } = S;
  useLenis(!compact);
  useStory(root, (g, el) => {
    el.querySelectorAll<HTMLElement>(".bb-sec").forEach((s) => rise(g, s.querySelectorAll(".bb-r"), s, { y: 24, duration: 1.4 }));
    el.querySelectorAll<HTMLElement>(".bb-side").forEach((s, i) => g.fromTo(s, { y: 60 }, { y: -60, ease: "none", scrollTrigger: { trigger: s.parentElement, start: "top bottom", end: "bottom top", scrub: true } }));
    const hero = el.querySelector(".bb-hero");
    if (hero) g.to(el.querySelectorAll(".bb-hero .bb-bq"), { yPercent: -18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }, !compact);

  const divider = <div className="bb-r mx-auto my-2 flex max-w-[420px] items-center gap-4" aria-hidden><div className="bb-rule flex-1" /><Bow className="w-10" /><div className="bb-rule flex-1" /></div>;
  const head = (eyebrow: string, title: ReactNode) => (
    <div className="bb-r mb-6">
      <p className="lbl text-[var(--t-muted)]">{eyebrow}</p>
      <h2 className="s bb-h mt-1">{title}</h2>
    </div>
  );

  const sections: Record<SectionId, ReactNode> = {
    invitation: (
      <Sec id="invitation" className="bb-sec">
        <p className="bb-r s text-[clamp(36px,6cqw,56px)] text-[var(--bb-rose)]">{w.invitation},</p>
        <E as="p" path="profile.inviteLine" multiline className="bb-r d mt-4 block text-[clamp(24px,3.6cqw,34px)] italic leading-[1.4]">{S.invite}</E>
      </Sec>
    ),
    story: (
      <Sec id="story" className="bb-sec">
        {head(w.story, <>{w.awaiting}</>)}
        <E as="p" path="profile.story" multiline className="bb-r bb-p d mx-auto block max-w-[560px]">{profile.story || w.blessing}</E>
      </Sec>
    ),
    details: (
      <Sec id="details" className="bb-sec">
        {head(w.details, <>{S.date || w.soon}</>)}
        <Booties className="bb-r mx-auto w-[clamp(120px,22cqw,180px)]" />
        <DaysToGo iso={profile.date} render={(n) => (
          <p className="bb-r mt-4"><span className="s text-[clamp(72px,14cqw,130px)] text-[var(--bb-rose)]">{n === null ? "…" : n}</span><span className="lbl ml-3 text-[var(--t-muted)]">{n === 0 ? w.today : n === 1 ? w.day : w.days}</span></p>
        )} />
        <div className="bb-r mx-auto mt-8 grid max-w-[560px] gap-8 sm:grid-cols-2">
          <div><p className="lbl text-[var(--t-muted)]">{w.when}</p><p className="d mt-2 text-[clamp(22px,3.2cqw,28px)] italic">{S.date}</p>{S.events[0]?.time && <p className="text-[var(--t-muted)]">{S.events[0].time}</p>}</div>
          <div><p className="lbl text-[var(--t-muted)]">{w.where}</p><E as="p" path="profile.venue" className="d mt-2 block text-[clamp(22px,3.2cqw,28px)] italic">{profile.venue}</E><E as="p" path="profile.city" className="block text-[var(--t-muted)]">{profile.city}</E></div>
        </div>
        {calendarUrl && <a href={calendarUrl} className="bb-r bb-btn mt-10">{w.calendar}</a>}
      </Sec>
    ),
    schedule: S.events.length ? (
      <Sec id="schedule" className="bb-sec">
        {head(w.schedule, <>{w.program}</>)}
        <div className="mx-auto max-w-[520px]">
          {S.events.map((e, i) => (
            <div key={i} className="bb-r flex items-baseline gap-3 py-3">
              <span className="lbl shrink-0 text-[var(--bb-rose)]">{e.time}</span>
              <span className="mb-[.3em] flex-1 border-b border-dotted border-[color-mix(in_oklab,var(--t-gold)_70%,transparent)]" />
              <span className="d text-right text-[clamp(20px,2.8cqw,26px)] italic">{e.name}</span>
            </div>
          ))}
        </div>
      </Sec>
    ) : null,
    venue: S.where ? (
      <Sec id="venue" className="bb-sec">
        {head(w.venue, <E path="profile.venue">{profile.venue || profile.city}</E>)}
        <p className="bb-r bb-p d italic">{S.where}</p>
        {S.mapUrl && <a target="_blank" rel="noreferrer" href={S.mapUrl} className="bb-r bb-btn mt-8">{w.directions}</a>}
      </Sec>
    ) : null,
    gallery: (
      <Sec id="gallery" className="bb-sec">
        {head(w.gallery, <>{w.hello}</>)}
        <div className="flex flex-wrap justify-center gap-6">
          {(S.gallery.length ? S.gallery : [heroUrl ?? null]).map((src, i) => (
            <figure key={i} className="bb-r relative w-[clamp(200px,34cqw,320px)] bg-white p-[10px] shadow-[0_20px_40px_-26px_rgba(120,60,70,.6)]" style={{ transform: `rotate(${[-2, 2, -1][i % 3]}deg)` }}>
              <div className="aspect-[4/5] overflow-hidden"><Photo src={src} slot={S.gallery.length ? "gallery" : "hero"} /></div>
              <Bow className="absolute -top-6 left-1/2 w-20 -translate-x-1/2" />
            </figure>
          ))}
        </div>
      </Sec>
    ),
    rsvp: (
      <Sec id="rsvp" className="bb-sec">
        {head(w.rsvp, <>{S.L.attend}</>)}
        <div className="bb-r mx-auto max-w-[520px] text-left">{children}</div>
      </Sec>
    ),
    info: (
      <Sec id="info" className="bb-sec">
        {head(w.info, <>{w.with}</>)}
        <E as="p" path="texts.body" multiline className="bb-r bb-p d block whitespace-pre-line">{S.info || w.blessing}</E>
      </Sec>
    ),
  };

  const k = Math.min(fit(a, 7), b ? fit(b, 7) : 1);
  const visible = S.visible.filter((id) => sections[id]);
  return (
    <div ref={root} className={`bb bb-anim bb-site ${bbFonts}`} style={bxVars(theme, design, "classic")}>
      <style href="bx-blush-bundle" precedence="default">{BB_CSS}</style>
      {/* ── Opening: the silk ribbon unties, the envelope flap lifts on its liner and the letter rises ── */}
      <header className="bb-hero bb-wash relative flex flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-10" style={{ minHeight: compact ? "auto" : "100svh" }}>
        <Bouquet className="bb-bq -left-[8%] -top-[6%] w-[clamp(180px,40cqw,440px)]" />
        <Bouquet className="bb-bq -bottom-[10%] -right-[8%] w-[clamp(180px,38cqw,420px)] rotate-180" flip delay={0.5} />
        <div className="relative w-[min(88cqw,620px)] pt-[48%]" style={{ width: compact ? "88cqw" : "min(88cqw, 620px, 92svh)" }}>
          <Envelope seal={[...a][0]}>
            <div className="flex h-full flex-col items-center px-[6cqw] pt-[5cqw] text-center">
              <Bow className="mb-[1cqw] w-[9cqw]" />
              <p className="lbl text-[2.2cqw] text-[var(--t-muted)]">{S.line}</p>
              <h1 className="s mt-[1.5cqw] text-[var(--t-ink)]" style={{ fontSize: `${12 * k}cqw` }}>
                <E path="profile.partner1">{a}</E>{b && <span className="text-[var(--bb-rose)]"> &amp; </span>}{b && <E path="profile.partner2">{b}</E>}
              </h1>
              <p className="d mt-[2cqw] text-[3.4cqw] italic">{[S.date, profile.city].filter(Boolean).join(" · ")}</p>
            </div>
          </Envelope>
        </div>
        <E as="p" path="profile.inviteLine" className="bb-fade d mt-10 block max-w-[560px] text-center text-[clamp(18px,2.6cqw,24px)] italic text-[color-mix(in_oklab,var(--t-ink)_75%,transparent)]" style={dl(4.2)}>{S.invite}</E>
      </header>

      <div className="relative px-[clamp(12px,4cqw,40px)] pb-20">
        <Bouquet className="bb-side -left-[6%] top-[8%] hidden w-[22cqw] md:block" />
        <Bouquet className="bb-side -right-[6%] top-[46%] hidden w-[20cqw] md:block" flip />
        <article className="bb-letterpaper relative mx-auto max-w-[780px] rounded-[3px]">
          {visible.map((id, i) => <div key={id}>{i > 0 && divider}{sections[id]}</div>)}
          <div className="bb-sec !pt-6">
            <p className="s text-[clamp(32px,5cqw,48px)] text-[var(--bb-rose)]">{w.with},</p>
            <p className="s mt-1 text-[clamp(40px,7cqw,64px)]">{b ? `${a} & ${b}` : a}</p>
            <E as="p" path="profile.blessing" className="d mt-3 block italic text-[var(--t-muted)]">{profile.blessing || ""}</E>
            <Seal letter={[...a][0] ?? ""} className="mx-auto mt-6 w-16" />
          </div>
        </article>
        <div className="mt-10 text-center text-xs text-[var(--t-muted)]">{credit}</div>
      </div>
    </div>
  );
}
