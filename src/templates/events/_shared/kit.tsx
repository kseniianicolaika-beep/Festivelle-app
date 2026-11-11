"use client";
import type { CSSProperties, ReactNode } from "react";
import type { Profile } from "@/lib/profile";
import type { Theme } from "@/lib/themes";
import type { Design, Kind } from "@/lib/templates";
import { occasionInvite } from "@/lib/occasions";
import { E } from "@/components/designs/Editable";
import { FONT_VARS } from "../../celebrate/_shared/fonts";
import { CardFrame, Countdown, Grain, HeroPhoto, Sections, tplVars } from "../../celebrate/_shared/ui";
import { ew, eventText, fit, fmt, mapHref, media, dateParts, shapeOf, where } from "./words";

// Shared skeleton for the events group. Every suite supplies its own art, opening, palette and "look";
// the kit only guarantees the editor contract (E paths, data-edit-*, ordered/hidden sections).

export type Look = {
  display: string; // font stack for headings
  text?: string; // font stack for display-sized copy (invite line, details, schedule); defaults to display
  script: string; // font stack for flourishes
  body: string; // font stack for body copy
  foil: string; // class for decorative heading text
  accent: string; // class for accent text colour
  panel: string; // classes for RSVP / details panel
  tile: string; // classes for a details tile
  line: string; // border colour class, e.g. "border-[var(--t-gold)]/40"
  button: string; // classes for primary link buttons
  italic?: boolean; // italic display headings
  upper?: boolean; // uppercase, letter-spaced display headings
  Frame: (p: { children: ReactNode }) => ReactNode; // photo frame for the story section
  ornament?: ReactNode; // small divider art above section titles
};

export function Head({ look, title, script }: { look: Look; title: string; script?: string }) {
  return (
    <div data-r className="mb-12 text-center md:mb-16">
      {look.ornament && <div className="mx-auto mb-4 flex justify-center">{look.ornament}</div>}
      {script && <p className={`text-3xl md:text-4xl ${look.accent}`} style={{ fontFamily: look.script }}>{script}</p>}
      <h2 className={`${look.foil} leading-none ${look.italic ? "italic" : ""} ${look.upper ? "text-[1.7rem] uppercase tracking-[0.22em] md:text-[2.6rem]" : "text-[2.4rem] md:text-[3.6rem]"}`} style={{ fontFamily: look.display }}>{title}</h2>
    </div>
  );
}

export function EventSections({ look, profile, design, heroUrl, calendarUrl, children, compact }: { look: Look; profile: Profile; design?: Design; heroUrl?: string | null; calendarUrl?: string | null; children?: ReactNode; compact?: boolean }) {
  const L = ew(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const H = (t: string, s?: string) => <Head look={look} title={t} script={s} />;
  const disp: CSSProperties = { fontFamily: look.text ?? look.display };
  const dayMonth = (() => { if (!profile.date) return ""; const d = new Date(profile.date + "T12:00:00Z"); return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(profile.language === "ru" ? "ru-RU" : profile.language === "hi" ? "hi-IN" : "en-GB", { day: "numeric", month: "long", timeZone: "UTC" }); })();
  return (
    <Sections
      design={design}
      className="relative"
      render={{
        invitation: (
          <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
            {look.ornament && <div data-r className="mx-auto mb-6 flex justify-center">{look.ornament}</div>}
            <p data-r className={`text-4xl md:text-5xl ${look.accent}`} style={{ fontFamily: look.script }}>{L.title}</p>
            <E as="p" multiline path="profile.inviteLine" className={`mt-6 block text-[1.8rem] leading-[1.4] md:text-[2.6rem] ${look.italic ? "italic" : ""}`} style={disp}>{profile.inviteLine || occasionInvite(profile)}</E>
            {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="mt-8 text-[11px] uppercase tracking-[0.4em] opacity-75"><span className={`${look.foil} mr-2 text-3xl tracking-normal`} style={disp}>{d}</span>{L.until}</p>}</Countdown>}
          </section>
        ),
        story: (profile.story || heroUrl) ? () => (
          <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
            <div data-r className="relative mx-auto w-[min(76vw,380px)]"><look.Frame><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></look.Frame></div>
            <div className="text-center md:text-left">
              {H(L.about)}
              {profile.story && <E as="p" multiline path="profile.story" className="block whitespace-pre-line text-[1.35rem] leading-[1.65] md:text-[1.5rem]">{profile.story}</E>}
            </div>
          </section>
        ) : null,
        details: (profile.date || venue) ? () => (
          <section className="relative mx-auto max-w-5xl px-6 py-24">
            {H(L.details)}
            <div className={`grid gap-4 md:grid-cols-3`}>
              {[
                { k: L.when, v: dayMonth || fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
                { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
                { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
              ].filter((x) => x.v).map((x, i) => (
                <div key={i} data-r data-d={i * 0.1} className={`px-6 py-10 text-center ${look.tile}`}>
                  <p className={`text-[10px] uppercase tracking-[0.45em] ${look.accent}`}>{x.k}</p>
                  {x.path ? <E as="p" path={x.path} className="mt-4 block text-[1.8rem] leading-tight" style={disp}>{x.v}</E> : <p className="mt-4 text-[1.8rem] leading-tight" style={disp}>{x.v}</p>}
                  {x.s && <p className="mt-1 capitalize opacity-70">{x.s}</p>}
                </div>
              ))}
            </div>
            {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className={look.button}>{L.calendar}</a></div>}
          </section>
        ) : null,
        schedule: profile.events?.length ? () => (
          <section className="relative mx-auto max-w-3xl px-6 py-24">
            {H(L.evening)}
            {profile.events!.map((e, i) => (
              <div key={i} data-r data-d={i * 0.08} className="flex items-baseline gap-4 py-5">
                <p className="shrink-0 text-[1.5rem] md:text-[2rem]" style={disp}>{e.name}</p>
                <span className={`mb-2 flex-1 border-b border-dotted ${look.line}`} />
                <span className={`shrink-0 text-sm uppercase tracking-[0.3em] ${look.accent}`}>{e.time}</span>
              </div>
            ))}
          </section>
        ) : null,
        venue: venue ? () => (
          <section className="relative px-6 py-24 text-center">
            {H(L.venue)}
            <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className={`${look.foil} block text-[2.6rem] leading-[1.05] md:text-[4.6rem] ${look.italic ? "italic" : ""}`} style={{ fontFamily: look.display }}>{profile.venue || profile.city}</E>
            {profile.venue && profile.city && <E as="p" path="profile.city" className="mt-4 block text-[11px] uppercase tracking-[0.5em] opacity-70">{profile.city}</E>}
            <div data-r className="mt-10"><a href={mapHref(profile)} target="_blank" rel="noreferrer" className={look.button}>{L.directions}</a></div>
          </section>
        ) : null,
        gallery: gallery.length ? () => (
          <section className="relative mx-auto max-w-6xl px-6 py-24">
            {H(L.gallery)}
            <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
              {gallery.map((k, i) => (
                <div key={k} data-r data-d={(i % 3) * 0.08} className={`mb-4 break-inside-avoid overflow-hidden rounded-[14px] border ${look.line}`}>
                  <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        ) : null,
        rsvp: children ? () => (
          <section className="relative mx-auto max-w-2xl px-6 py-24">
            {H(L.reply)}
            <div data-r className={`px-6 py-10 md:px-12 ${look.panel}`}>{children}</div>
          </section>
        ) : null,
        info: info ? () => (
          <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
            {H(L.info)}
            <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-xl leading-relaxed opacity-80">{info}</E>
          </section>
        ) : null,
      }}
    />
  );
}

export type CardLook = {
  display: string;
  script: string;
  body: string;
  foil: string; // decorative heading class (add shine yourself when animate)
  accent: string;
  muted: string;
  rule: string; // text colour class for rules
  italic?: boolean;
  upper?: boolean; // uppercase display names
  nameScale?: number; // 1 = default
};

/** The shared card composition: header text → hero art → wording → footer. Suites supply art + look. */
export function EventCard({ id, kind, profile, theme, design, className = "", vars, css, rootClass, look, art, small, deco, still, top }: {
  id: string; kind: Kind; profile: Profile; theme: Theme; design: Design; className?: string; vars: Record<string, string>; css: string; rootClass: string; look: CardLook;
  art: (shape: "tall" | "portrait" | "square" | "wide") => ReactNode; // hero art for the composition
  small: ReactNode; // small art for lists / hashtag / table
  deco?: (shape: "tall" | "portrait" | "square" | "wide") => ReactNode; // frame / background decoration (absolute)
  still: boolean;
  top?: string; // extra top padding (cqw) on portrait/tall/square pieces, for a header ornament
}) {
  const c = eventText(kind, design, profile);
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4) * (look.nameScale ?? 1);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const n = { a: c.name.split(" & ")[0], b: c.name.includes(" & ") ? c.name.split(" & ").slice(1).join(" & ") : "" };
  const nameSize = fit(n.b ? (n.a.length > n.b.length ? n.a : n.b) : n.a, (wide ? 8 : tall ? 14 : 12.5) * sc, 7, 0.42);
  const disp = (size: string): CSSProperties => ({ fontFamily: look.display, fontSize: size });
  const nameCls = `${look.foil} inline-block pt-[0.14em] pb-[0.06em] ${look.italic ? "italic pr-[0.08em]" : ""} ${look.upper ? "uppercase tracking-[0.08em]" : ""}`;
  const Names = (
    <h2 className="leading-[0.98]" style={disp(`${nameSize}cqw`)}>
      <E path="profile.partner1" className={nameCls}>{n.a}</E>
      {n.b && <>
        <span className={`mx-[1.5cqw] inline-block ${look.accent}`} style={{ fontFamily: look.script, fontSize: "0.6em" }}>&amp;</span>
        {!square && <br />}
        <E path="profile.partner2" className={nameCls}>{n.b}</E>
      </>}
    </h2>
  );
  const rule = <div className={`flex items-center justify-center gap-[2cqw] ${look.rule}`}><span className="h-px w-[10cqw] bg-current" /><span className="h-[1cqw] w-[1cqw] rotate-45 bg-current" /><span className="h-px w-[10cqw] bg-current" /></div>;
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[0.8cqw]">
      {rule}
      {c.date && <p className={look.italic ? "italic" : ""} style={disp(wide ? "2.8cqw" : "4cqw")}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className={`block uppercase ${look.muted}`} style={{ fontSize: wide ? "1.7cqw" : "2.1cqw", letterSpacing: "0.4em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className={`block ${look.accent}`} style={{ fontFamily: look.script, fontSize: "5cqw" }}>{c.footer}</E>}
    </div>
  );

  let body: ReactNode;
  if (kind === "table") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <div style={{ width: "22cqw" }}>{small}</div>
        <E as="p" path="texts.headline" className={`block uppercase ${look.muted}`} style={{ fontSize: "3.4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className={`${look.foil} leading-none ${look.italic ? "italic" : ""}`} style={disp(`${40 * sc}cqw`)}>{c.number}</p>
        <p className={look.accent} style={{ fontFamily: look.script, fontSize: "6cqw" }}>{c.name}</p>
      </div>
    );
  } else if (kind === "hashtag") {
    body = (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[14cqw] text-center">
        <div style={{ width: "34cqw" }}>{small}</div>
        <E as="p" path="texts.body" className={`block ${look.accent}`} style={{ fontFamily: look.script, fontSize: "7cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className={`${look.foil} block break-all leading-tight`} style={disp(`${fit(c.hashtag, 9, 12) * sc}cqw`)}>{c.hashtag}</E>
      </div>
    );
  } else if (wide) {
    body = (
      <div className="relative grid h-full grid-cols-[38%_1fr] items-center gap-[4cqw] px-[8cqw]">
        <div className="flex items-center justify-center">{art("wide")}</div>
        <div className="flex flex-col items-center gap-[1.4cqw] text-center">
          <E as="p" path="texts.headline" className={`${look.foil} block leading-none ${look.italic ? "italic" : ""}`} style={disp(`${fit(c.headline, 10, 9) * sc}cqw`)}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="block" style={{ fontSize: "2.8cqw", lineHeight: 1.4 }}>{c.body}</E>}
          {rule}
          <p className={look.accent} style={{ fontFamily: look.script, fontSize: "4.6cqw" }}>{c.name}</p>
        </div>
      </div>
    );
  } else {
    body = (
      <div className={`relative flex h-full flex-col items-center justify-between text-center ${tall ? "px-[13cqw] py-[13cqw]" : square ? "px-[10cqw] py-[7cqw]" : "px-[14cqw] py-[10cqw]"}`} style={top && !square ? { paddingTop: top } : undefined}>
        <div className="flex w-full flex-col items-center gap-[1.3cqw]">
          {c.eyebrow && <E as="p" path="texts.eyebrow" className={`block uppercase ${look.muted}`} style={{ fontSize: "2.1cqw", letterSpacing: "0.4em" }}>{c.eyebrow}</E>}
          {c.headline && <E as="p" path="texts.headline" className={`block leading-[1.02] ${c.showName ? look.accent : look.foil}`} style={{ fontFamily: c.showName ? look.script : look.display, fontSize: `${fit(c.headline, c.showName ? 9 : tall ? 13 : 11, 10)}cqw` }}>{c.headline}</E>}
          {c.showName && Names}
          {c.showName && c.line && <p className={look.accent} style={{ fontFamily: look.script, fontSize: tall ? "7.4cqw" : square ? "5cqw" : "6cqw", lineHeight: 1.05 }}>{c.line}</p>}
        </div>
        {!isList && <div className="relative flex w-full items-center justify-center">{art(shape)}</div>}
        {isList && <div style={{ width: tall ? "30cqw" : "22cqw" }}>{small}</div>}
        {c.lead && <E as="p" multiline path="profile.inviteLine" className="block max-w-[64cqw]" style={{ fontSize: tall ? "3.7cqw" : "3.1cqw", lineHeight: 1.4 }}>{c.lead}</E>}
        {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="block max-w-[66cqw]" style={{ fontSize: "3.1cqw", lineHeight: 1.45 }}>{c.body}</E>}
        {isList && (
          <ol className="w-full">
            {c.items.map((it, i) => (
              <li key={i} className="flex flex-col items-center" style={{ padding: tall ? "3.2cqw 0" : "2.3cqw 0", borderTop: i ? "1px solid color-mix(in srgb, currentColor 18%, transparent)" : undefined }}>
                <E as="p" path={`items.${i}.title`} className={`block ${look.italic ? "italic" : ""}`} style={disp(tall ? "5.6cqw" : "4.6cqw")}>{it.title}</E>
                {it.detail && <E as="p" path={`items.${i}.detail`} className={`block ${look.muted}`} style={{ fontSize: tall ? "3.2cqw" : "2.7cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        )}
        {isList && <p className={look.accent} style={{ fontFamily: look.script, fontSize: "6cqw" }}>{c.name}</p>}
        <div className="w-full">{footer}</div>
      </div>
    );
  }

  return (
    <CardFrame kind={kind} profile={profile} vars={tplVars(id, theme, design, vars)} className={`${FONT_VARS} ${rootClass} ${still ? "ev-still" : ""} text-[var(--t-ink)] ${className}`} style={{ fontFamily: look.body }}>
      <style href={`ev-${id}`} precedence="default">{css}</style>
      <style href="ev-still" precedence="default">{".ev-still *{animation:none!important}"}</style>
      <Grain opacity={0.1} blend="multiply" freq={0.9} />
      {deco?.(shape)}
      {body}
    </CardFrame>
  );
}
