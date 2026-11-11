"use client";
import type { CSSProperties, ReactNode } from "react";
import { E } from "@/components/designs/Editable";
import type { Profile } from "@/lib/profile";
import type { Design, Kind } from "@/lib/templates";
import { Countdown, HeroPhoto } from "./ui";
import { words, fmt, where, mapHref, media, dateParts, inviteOf, shapeOf, fit, type CardText } from "./words";

// Shared section + card building blocks for the social suites. Each suite restyles them through scoped CSS
// on these class hooks — .ss-h2 .ss-script .ss-lead .ss-cell .ss-k .ss-v .ss-s .ss-ev .ss-time .ss-venue
// .ss-btn .ss-photo .ss-panel .ss-body — and supplies its own hero, ornaments and footer.

export function Head({ title, script, ornament }: { title: string; script?: string; ornament?: ReactNode }) {
  return (
    <div data-r className="mb-12 flex flex-col items-center text-center md:mb-16">
      {ornament}
      {script && <p className="ss-script text-3xl md:text-4xl">{script}</p>}
      <h2 className="ss-h2 text-[2.3rem] leading-[1.02] md:text-[3.6rem]">{title}</h2>
    </div>
  );
}

type SiteBits = {
  profile: Profile; design?: Design; heroUrl?: string | null; calendarUrl?: string | null; children?: ReactNode; compact?: boolean;
  tradition?: string; ornament?: ReactNode; photoRadius?: string; storyTitle?: string;
};

/** The standard section renders (each may be swapped by a suite). */
export function standardSections({ profile, design, heroUrl, calendarUrl, children, compact, tradition, ornament, photoRadius = "18px", storyTitle }: SiteBits) {
  const L = words(profile);
  const dp = dateParts(profile);
  const venue = where(profile);
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  return {
    invitation: (
      <section className="relative mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
        {ornament && <div data-r className="mb-8 flex justify-center">{ornament}</div>}
        <E as="p" multiline path="profile.inviteLine" className="ss-lead block text-[1.8rem] leading-[1.4] md:text-[2.6rem]">{inviteOf(profile, tradition)}</E>
        {!compact && <Countdown date={profile.date}>{(d) => <p data-r className="ss-k mt-10 text-[11px] uppercase tracking-[0.4em]"><span className="ss-num mr-2 text-3xl tracking-normal">{d}</span>{L.until}</p>}</Countdown>}
      </section>
    ),
    story: (profile.story || heroUrl) ? () => (
      <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-2">
        <div data-r className="relative mx-auto w-[min(76vw,380px)]">
          <div className="ss-photo aspect-[4/5] overflow-hidden" style={{ borderRadius: photoRadius }}><HeroPhoto url={heroUrl} className="h-full w-full object-cover" /></div>
        </div>
        <div className="text-center md:text-left">
          <h2 data-r className="ss-h2 mb-8 text-[2.3rem] leading-[1.02] md:text-[3.4rem]">{storyTitle ?? L.about}</h2>
          {profile.story && <E as="p" multiline path="profile.story" className="ss-body block whitespace-pre-line text-[1.35rem] leading-[1.65] md:text-[1.5rem]">{profile.story}</E>}
        </div>
      </section>
    ) : null,
    details: (profile.date || venue) ? () => (
      <section className="relative mx-auto max-w-5xl px-6 py-24">
        <Head title={L.details} />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { k: L.when, v: dp ? `${dp.day} ${dp.month}` : fmt(profile), s: dp ? `${dp.weekday}, ${dp.year}` : "" },
            { k: L.evening, v: profile.events?.[0]?.time ?? "", s: profile.events?.[0]?.name ?? "" },
            { k: L.where, v: venue, s: profile.venue ? profile.city ?? "" : "", path: profile.venue ? "profile.venue" : "profile.city" },
          ].filter((x) => x.v).map((x, i) => (
            <div key={i} data-r data-d={i * 0.1} className="ss-cell px-6 py-11 text-center">
              <p className="ss-k text-[10px] uppercase tracking-[0.42em]">{x.k}</p>
              {x.path ? <E as="p" path={x.path} className="ss-v mt-4 block text-[1.9rem] leading-tight">{x.v}</E> : <p className="ss-v mt-4 text-[1.9rem] leading-tight">{x.v}</p>}
              {x.s && <p className="ss-s mt-1 capitalize">{x.s}</p>}
            </div>
          ))}
        </div>
        {calendarUrl && <div data-r className="mt-10 text-center"><a href={calendarUrl} className="ss-btn ss-btn-ghost inline-block rounded-full px-6 py-2.5 text-[11px] uppercase tracking-[0.35em]">{L.calendar}</a></div>}
      </section>
    ) : null,
    schedule: profile.events?.length ? () => (
      <section className="relative mx-auto max-w-3xl px-6 py-24">
        <Head title={L.evening} />
        {profile.events!.map((e, i) => (
          <div key={i} data-r data-d={i * 0.08} className="flex items-baseline gap-4 py-5">
            <p className="ss-ev shrink-0 text-[1.5rem] md:text-[2.1rem]">{e.name}</p>
            <span className="ss-dots mb-2 flex-1 border-b border-dotted" />
            <span className="ss-time shrink-0 text-sm uppercase tracking-[0.3em]">{e.time}</span>
          </div>
        ))}
      </section>
    ) : null,
    venue: venue ? () => (
      <section className="relative px-6 py-24 text-center">
        <Head title={L.venue} />
        <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="ss-venue block text-[2.8rem] leading-none md:text-[5rem]">{profile.venue || profile.city}</E>
        {profile.venue && profile.city && <E as="p" path="profile.city" className="ss-k mt-4 block text-[11px] uppercase tracking-[0.5em]">{profile.city}</E>}
        <a data-r href={mapHref(profile)} target="_blank" rel="noreferrer" className="ss-btn mt-10 inline-block rounded-full px-7 py-3 text-[11px] uppercase tracking-[0.35em] transition hover:brightness-110">{L.directions}</a>
      </section>
    ) : null,
    gallery: gallery.length ? () => (
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <Head title={L.gallery} />
        <div className={`columns-2 gap-4 ${compact ? "" : "md:columns-3"}`}>
          {gallery.map((k, i) => (
            <div key={k} data-r data-d={(i % 3) * 0.08} className="ss-photo mb-4 break-inside-avoid overflow-hidden" style={{ borderRadius: photoRadius }}>
              <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    ) : null,
    rsvp: children ? () => (
      <section className="relative mx-auto max-w-2xl px-6 py-24">
        <Head title={L.reply} />
        <div data-r className="ss-panel px-6 py-10 md:px-12">{children}</div>
      </section>
    ) : null,
    info: info ? () => (
      <section className="relative mx-auto max-w-2xl px-6 py-20 text-center">
        <Head title={L.info} />
        <E as="p" multiline path="texts.body" className="ss-body block whitespace-pre-line text-xl leading-relaxed">{info}</E>
      </section>
    ) : null,
  };
}

/**
 * The text stack for every paper/social kind. `art` fills the picture slot (sized per shape), `rule` sits above the
 * footer. Styled through class hooks: .sc-eyebrow .sc-head .sc-name .sc-amp .sc-line .sc-lead .sc-body .sc-num
 * .sc-tag .sc-tagline .sc-item-t .sc-item-d .sc-date .sc-where .sc-foot .sc-host
 */
export function CardBody({ kind, c, design, art, rule, pad, nameBase, style }: {
  kind: Kind; c: CardText; design: Design; art?: (w: string) => ReactNode; rule?: ReactNode; pad?: string; nameBase?: number; style?: CSSProperties;
}) {
  const shape = shapeOf(kind);
  const sc = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const wide = shape === "wide", tall = shape === "tall", square = shape === "square";
  const isList = kind === "menu" || kind === "program";
  const both = c.b ? `${c.a} & ${c.b}` : c.a;
  const longest = c.b ? (c.a.length > c.b.length ? c.a : c.b) : c.a;
  const nameSize = fit(longest, (nameBase ?? (wide ? 8 : tall ? 14 : 12.5)) * sc * (c.b ? 0.8 : 1), 7);
  const footer = (c.date || c.where || c.footer) && (
    <div className="flex flex-col items-center gap-[0.9cqw]">
      {rule}
      {c.date && <p className="sc-date" style={{ fontSize: wide ? "2.8cqw" : "4cqw" }}>{c.date}{c.time ? ` · ${c.time}` : ""}</p>}
      {c.where && <E as="p" path={c.wherePath} className="sc-where block uppercase" style={{ fontSize: wide ? "1.7cqw" : "2.15cqw", letterSpacing: "0.38em" }}>{c.where}</E>}
      {c.footer && <E as="p" path={c.footerPath} className="sc-foot block" style={{ fontSize: "5cqw" }}>{c.footer}</E>}
    </div>
  );

  if (kind === "table") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-[1cqw] text-center" style={style}>
        <E as="p" path="texts.headline" className="sc-eyebrow block uppercase" style={{ fontSize: "3.4cqw", letterSpacing: "0.5em" }}>{c.headline}</E>
        <p className="sc-num leading-none" style={{ fontSize: `${40 * sc}cqw` }}>{c.number}</p>
        <p className="sc-host" style={{ fontSize: "5.4cqw" }}>{both}</p>
      </div>
    );
  }
  if (kind === "hashtag") {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-[3cqw] px-[14cqw] text-center" style={style}>
        {art?.("34cqw")}
        <E as="p" path="texts.body" className="sc-tagline block" style={{ fontSize: "6.4cqw" }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="sc-tag block break-all leading-tight" style={{ fontSize: `${fit(c.hashtag, 10, 11) * sc}cqw` }}>{c.hashtag}</E>
      </div>
    );
  }
  if (wide) {
    return (
      <div className="relative grid h-full grid-cols-[36%_1fr] items-center gap-[4cqw] px-[9cqw]" style={style}>
        <div className="flex justify-center">{art?.("100%")}</div>
        <div className="flex flex-col items-center gap-[1.4cqw] text-center">
          <E as="p" path="texts.headline" className="sc-head block leading-none" style={{ fontSize: `${fit(c.headline, 10, 9) * sc}cqw` }}>{c.headline}</E>
          {c.body && <E as="p" multiline path="texts.body" className="sc-body block" style={{ fontSize: "3cqw", lineHeight: 1.4 }}>{c.body}</E>}
          {rule}
          <p className="sc-host" style={{ fontSize: "4.6cqw" }}>{both}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative flex h-full flex-col items-center justify-between text-center ${pad ?? (tall ? "px-[14cqw] py-[13cqw]" : square ? "px-[10cqw] py-[7cqw]" : "px-[14cqw] py-[10cqw]")}`} style={style}>
      <div className="flex w-full flex-col items-center gap-[1.3cqw]">
        {c.eyebrow && <E as="p" path="texts.eyebrow" className="sc-eyebrow block uppercase" style={{ fontSize: "2.2cqw", letterSpacing: "0.42em" }}>{c.eyebrow}</E>}
        {c.headline && <E as="p" path="texts.headline" className={`block leading-[1.04] ${c.showName ? "sc-line" : "sc-head"}`} style={{ fontSize: `${fit(c.headline, c.showName ? 7.6 : tall ? 12 : 10.5, 10)}cqw` }}>{c.headline}</E>}
        {c.showName && (
          <h2 className="sc-names leading-[0.98]" style={{ fontSize: `${nameSize}cqw` }}>
            <E path="profile.partner1" className="sc-name">{c.a}</E>
            {c.b && <><span className="sc-amp block" style={{ fontSize: "0.55em" }}>&amp;</span><E path="profile.partner2" className="sc-name">{c.b}</E></>}
          </h2>
        )}
        {c.showName && c.line && <p className="sc-line" style={{ fontSize: tall ? "6.6cqw" : "5.4cqw", lineHeight: 1.08 }}>{c.line}</p>}
      </div>
      {!isList && art && <div className="relative flex w-full justify-center">{art(tall ? "60cqw" : square ? "26cqw" : "40cqw")}</div>}
      {isList && art && <div className="relative flex w-full justify-center">{art(tall ? "30cqw" : "22cqw")}</div>}
      {c.lead && <E as="p" multiline path="profile.inviteLine" className="sc-lead block max-w-[66cqw]" style={{ fontSize: tall ? "3.8cqw" : "3.2cqw", lineHeight: 1.42 }}>{c.lead}</E>}
      {kind === "greeting" && c.body && <E as="p" multiline path="profile.story" className="sc-body block max-w-[66cqw]" style={{ fontSize: "3.2cqw", lineHeight: 1.45 }}>{c.body}</E>}
      {isList && (
        <ol className="w-full">
          {c.items.map((it, i) => (
            <li key={i} className="sc-item flex flex-col items-center" style={{ padding: tall ? "3.2cqw 0" : "2.3cqw 0" }}>
              <E as="p" path={`items.${i}.title`} className="sc-item-t block" style={{ fontSize: tall ? "5.8cqw" : "4.6cqw" }}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="sc-item-d block" style={{ fontSize: tall ? "3.3cqw" : "2.7cqw", marginTop: "0.6cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ol>
      )}
      {isList && <p className="sc-host" style={{ fontSize: "5.6cqw" }}>{both}</p>}
      <div className="w-full">{footer}</div>
    </div>
  );
}
