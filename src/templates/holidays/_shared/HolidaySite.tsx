"use client";
import type { ComponentType, CSSProperties, ReactNode, RefObject } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { occasionInvite } from "@/lib/occasions";
import { FONT_VARS } from "../../celebrate/_shared/fonts";
import { Sections, Countdown, HeroPhoto, tplVars } from "../../celebrate/_shared/ui";
import { useScene, useLenis, revealAll, type SceneApi } from "../../celebrate/_shared/motion";
import { hwords, fmt, where, mapHref, media, dateParts, festOf, type Fest } from "./words";

/** One holiday suite's look: palette, fonts, foil, panels and the small ornament used between sections. */
export type Skin = {
  id: string;
  fest: Fest;
  vars: Record<string, string>;
  css: string;
  cssHref: string;
  rootClass: string; // background class from css
  display: string; // font stacks
  script: string;
  body: string;
  foil: string; // gradient-text class
  panel: string; // card/panel background
  line: string; // hairline colour (CSS)
  onGold: string; // text on the gold button
  displayItalic?: boolean;
  Ornament: ComponentType<{ className?: string; style?: CSSProperties }>;
};

export function Head({ skin, title, script }: { skin: Skin; title: string; script?: string }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      <skin.Ornament className="mb-4 h-10 w-auto" />
      {script && <p className="text-3xl text-[var(--t-accent)] md:text-4xl" style={{ fontFamily: skin.script }}>{script}</p>}
      <h2 className={`${skin.foil} text-[2.4rem] leading-none md:text-[3.6rem] ${skin.displayItalic ? "italic" : ""}`} style={{ fontFamily: skin.display }}>{title}</h2>
    </div>
  );
}

/**
 * The shared page body for holiday parties. The suite supplies the hero (its signature moment) and an intro timeline;
 * this renders the editable, reorderable sections, all in the suite's skin.
 */
export function HolidaySite({ skin, props, hero, rootRef, intro, footerArt }: { skin: Skin; props: SiteProps; hero: ReactNode; rootRef: RefObject<HTMLDivElement | null>; intro?: (api: SceneApi) => void; footerArt?: ReactNode }) {
  const { profile, theme, design, heroUrl, calendarUrl, children, credit, compact } = props;
  const L = hwords(profile);
  const f = festOf(profile, skin.fest);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const it = skin.displayItalic ? "italic" : "";
  useLenis(!compact);
  useScene(rootRef, (api) => {
    revealAll(api.q, { compact, reduced: api.reduced });
    if (compact || api.reduced) return;
    intro?.(api);
  }, [compact]);

  return (
    <div ref={rootRef} lang={profile.language ?? "en"} className={`${FONT_VARS} ${skin.rootClass} relative overflow-hidden text-[var(--t-ink)]`} style={{ ...tplVars(skin.id, theme, design, skin.vars), fontFamily: skin.body }}>
      <style href={skin.cssHref} precedence="default">{skin.css}</style>
      {hero}
      <Sections
        design={design}
        className="relative"
        render={{
          invitation: (
            <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
              <p data-r className="text-4xl text-[var(--t-accent)] md:text-5xl" style={{ fontFamily: skin.script }}>{f.wish}</p>
              <E as="p" multiline path="profile.inviteLine" className={`mt-6 block text-[1.8rem] leading-[1.4] md:text-[2.6rem] ${it}`} style={{ fontFamily: skin.display }}>{profile.inviteLine || occasionInvite(profile)}</E>
              {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-8 text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]"><span className={`${skin.foil} mr-2 text-3xl tracking-normal ${it}`} style={{ fontFamily: skin.display }}>{d}</span>{L.until}</p>}</Countdown>}
            </section>
          ),
          story: (profile.story || heroUrl) ? () => (
            <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
              <div data-r className="relative mx-auto w-[min(76vw,380px)]">
                <div className="aspect-[4/5] rounded-[200px_200px_14px_14px] p-[3px]" style={{ background: `linear-gradient(135deg,var(--t-gold),${skin.line},var(--t-gold))` }}>
                  <div className="h-full w-full overflow-hidden rounded-[198px_198px_12px_12px]" style={{ background: skin.panel }}><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <Head skin={skin} title={L.about} />
                {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.35rem] leading-[1.65] md:text-[1.5rem]">{profile.story}</E>}
              </div>
            </section>
          ) : null,
          details: (profile.date || venue) ? () => (
            <section className="relative mx-auto max-w-5xl px-6 py-24">
              <Head skin={skin} title={L.details} />
              <div className="grid gap-px overflow-hidden rounded-[22px] border md:grid-cols-3" style={{ borderColor: skin.line, background: skin.line }}>
                {[
                  { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                  { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                  { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
                ].filter((x) => x.v).map((x, i) => (
                  <div key={i} data-r data-d={i * 0.1} className="px-6 py-12 text-center" style={{ background: skin.panel }}>
                    <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--t-gold)]">{x.k}</p>
                    {x.path ? <E as="p" path={x.path} className={`mt-4 block text-[1.9rem] leading-tight ${it}`} style={{ fontFamily: skin.display }}>{x.v}</E> : <p className={`mt-4 text-[1.9rem] leading-tight ${it}`} style={{ fontFamily: skin.display }}>{x.v}</p>}
                    {x.s && <p className="mt-1 capitalize text-[var(--t-muted)]">{x.s}</p>}
                  </div>
                ))}
              </div>
              {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="inline-block rounded-full border border-[var(--t-gold)] px-6 py-2.5 text-[11px] uppercase tracking-[0.35em] text-[var(--t-gold)] transition hover:opacity-80">{L.calendar}</a></div>}
            </section>
          ) : null,
          schedule: profile.events?.length ? () => (
            <section className="relative mx-auto max-w-3xl px-6 py-24">
              <Head skin={skin} title={L.evening} />
              {profile.events!.map((e, i) => (
                <div key={i} data-r data-d={i * 0.08} className="flex items-baseline gap-4 py-5">
                  <p className={`shrink-0 text-[1.5rem] md:text-[2.1rem] ${it}`} style={{ fontFamily: skin.display }}>{e.name}</p>
                  <span className="mb-2 flex-1 border-b border-dotted" style={{ borderColor: skin.line }} />
                  <span className="shrink-0 text-sm uppercase tracking-[0.3em] text-[var(--t-gold)]">{e.time}</span>
                </div>
              ))}
            </section>
          ) : null,
          venue: venue ? () => (
            <section className="relative px-6 py-24 text-center">
              <Head skin={skin} title={L.venue} />
              <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className={`${skin.foil} block text-[2.8rem] leading-none md:text-[5rem] ${it}`} style={{ fontFamily: skin.display }}>{profile.venue || profile.city}</E>
              {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{profile.city}</E>}
              <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="mt-10 inline-block rounded-full bg-[var(--t-gold)] px-7 py-3 text-[11px] uppercase tracking-[0.35em] transition hover:brightness-110" style={{ color: skin.onGold }}>{L.directions}</a>
            </section>
          ) : null,
          gallery: gallery.length ? () => (
            <section className="relative mx-auto max-w-6xl px-6 py-24">
              <Head skin={skin} title={L.gallery} />
              <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
                {gallery.map((k, i) => (
                  <div key={k} data-r data-d={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-[14px] border" style={{ borderColor: skin.line }}>
                    { }
                    <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null,
          rsvp: children ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-24">
              <Head skin={skin} title={L.reply} />
              <div data-r className="rounded-[26px] border px-6 py-10 shadow-[0_40px_80px_-40px_rgba(0,0,0,.45)] md:px-12" style={{ background: skin.panel, borderColor: skin.line }}>{children}</div>
            </section>
          ) : null,
          info: info ? () => (
            <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
              <Head skin={skin} title={L.info} />
              <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed text-[var(--t-muted)]">{info}</E>
            </section>
          ) : null,
        }}
      />
      <footer className="relative px-6 pb-14 pt-10 text-center">
        {footerArt ?? <skin.Ornament className="mx-auto h-14 w-auto" />}
        <p className="mt-4 text-4xl text-[var(--t-accent)]" style={{ fontFamily: skin.script }}>{f.wish}</p>
        {profile.blessing && <E as="p" path="profile.blessing" className="mt-2 block text-2xl text-[var(--t-muted)]" style={{ fontFamily: skin.script }}>{profile.blessing}</E>}
        {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
      </footer>
    </div>
  );
}
