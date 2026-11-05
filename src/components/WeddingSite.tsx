import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { designVars, petalColors } from "@/lib/themes";
import { E } from "./designs/Editable";
import { SITE_BODY, SITE_DEFAULT_ORDER, SITE_HEROES } from "./site/heroes";
import { nameParts, occasionInvite, occasionLine, occasionOf } from "@/lib/occasions";
import { sectionLayout, type Design, type SectionId } from "@/lib/templates";
import { Motif } from "./Motif";
import { Countdown } from "./Countdown";
import { Petals } from "./fx/Petals";
import { Reveal } from "./fx/Reveal";
import { Sparkles } from "./fx/Sparkles";
import type { MotifId } from "@/lib/motifs";

const media = (k: string) => `/api/media?key=${encodeURIComponent(k)}`;

type Props = {
  profile: Profile;
  theme: Theme;
  heroUrl?: string | null;
  calendarUrl?: string | null;
  children?: React.ReactNode; // RSVP slot
  compact?: boolean;
  layout?: string;
  motif?: MotifId;
  credit?: React.ReactNode;
  /** Website piece design: section order/visibility, gallery keys, texts.body = additional info. */
  design?: Design;
};

export function WeddingSite({ profile, theme, heroUrl, calendarUrl, children, compact, layout = "romance", motif, credit, design }: Props) {
  const [a, b] = nameParts(profile);
  const L = t(profile.language);
  const pad = compact ? "px-6" : "px-6 md:px-12";
  const dark = !!theme.dark;
  const editorial = layout === "editorial";
  const arch = layout === "arch";
  const occ = occasionOf(profile);
  const { order, hidden } = sectionLayout(design?.sections?.order?.length ? design.sections : { ...design?.sections, order: (SITE_DEFAULT_ORDER[layout] ?? []) as SectionId[] });
  const gallery = design?.gallery ?? [];
  const info = design?.texts?.body;
  const where = profile.venue || profile.city;
  const eyebrow = (s: string) => <p className="eyebrow mb-8 text-center text-[var(--t-muted)]">{s}</p>;
  const card = `rounded-[26px] border border-[var(--t-gold)]/40 ${dark ? "bg-white/5" : "bg-white/55"} backdrop-blur-xl`;

  const sections: Record<SectionId, React.ReactNode> = {
    invitation: occ !== "greeting" && (
      <section className={`relative mx-auto max-w-2xl py-20 text-center ${pad}`}>
        <Reveal>
          <Motif theme={theme} motif={motif} className="draw mx-auto mb-8 w-32 opacity-80" />
          <E as="p" multiline path="profile.inviteLine" className="display block text-[1.6rem] leading-[1.5] md:text-[2rem]">{profile.inviteLine || occasionInvite(profile)}</E>
        </Reveal>
      </section>
    ),
    story: profile.story && (
      <section className={`relative mx-auto max-w-3xl py-20 text-center ${pad}`}>
        <Reveal>
          {eyebrow(occ === "greeting" ? L.with : L.story)}
          <p className="script mb-2 text-6xl leading-none text-[var(--t-accent)] opacity-60">“</p>
          <E as="p" multiline path="profile.story" className="display block whitespace-pre-line text-[1.7rem] leading-[1.5] md:text-[2.2rem]">{profile.story}</E>
        </Reveal>
      </section>
    ),
    details: (profile.date || where) && occ !== "greeting" && (
      <section className={`relative mx-auto max-w-3xl py-16 ${pad}`}>
        <Reveal>
          {eyebrow(L.details)}
          <div className={`grid gap-px overflow-hidden ${card} ${compact ? "grid-cols-1" : "md:grid-cols-2"}`}>
            {profile.date && (
              <div className="p-8 text-center">
                <p className="eyebrow text-[var(--t-accent)]">{L.when}</p>
                <p className="display mt-3 text-3xl">{formatDate(profile.date, profile.language)}</p>
                {profile.events?.[0]?.time && <p className="mt-1 text-sm text-[var(--t-muted)]">{profile.events[0].time}</p>}
              </div>
            )}
            {where && (
              <div className="p-8 text-center">
                <p className="eyebrow text-[var(--t-accent)]">{L.where}</p>
                <p className="display mt-3 text-3xl">{profile.venue || profile.city}</p>
                {profile.venue && profile.city && <p className="mt-1 text-sm text-[var(--t-muted)]">{profile.city}</p>}
              </div>
            )}
          </div>
        </Reveal>
      </section>
    ),
    schedule: !!profile.events?.length && (
      <section className={`relative mx-auto max-w-3xl py-20 ${pad}`}>
        <Reveal><p className="eyebrow mb-14 text-center text-[var(--t-muted)]">{L.events}</p></Reveal>
        <div className="relative">
          <div className={`absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-transparent via-[var(--t-gold)] to-transparent ${compact ? "" : "md:left-1/2"}`} />
          {profile.events.map((e, i) => (
            <Reveal key={i} delay={i * 0.08} className={`relative mb-12 pl-14 ${compact ? "" : `md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}`}>
              <span className={`absolute top-3 h-3 w-3 rotate-45 border border-[var(--t-gold)] bg-[var(--t-bg)] left-[11px] ${compact ? "" : i % 2 ? "md:left-[-6px]" : "md:left-auto md:right-[-6px]"}`} />
              <p className="text-[11px] tracking-[0.3em] text-[var(--t-accent)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-1 text-4xl">{e.name}</h3>
              <p className="mt-2 text-sm text-[var(--t-muted)]">{[formatDate(e.date, profile.language), e.time].filter(Boolean).join(" · ")}</p>
              {e.venue && <p className="text-sm text-[var(--t-muted)]">{e.venue}</p>}
            </Reveal>
          ))}
        </div>
        {calendarUrl && (
          <Reveal className="mt-4 text-center">
            <a href={calendarUrl} className="inline-flex items-center gap-2 rounded-full border border-[var(--t-gold)]/60 px-5 py-2.5 text-sm transition hover:bg-[var(--t-gold)]/10">✦ {L.calendar}</a>
          </Reveal>
        )}
      </section>
    ),
    venue: where && occ !== "greeting" && (
      <section className={`relative mx-auto max-w-2xl py-16 text-center ${pad}`}>
        <Reveal>
          {eyebrow(L.venue)}
          <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="display block text-4xl">{profile.venue || profile.city}</E>
          {profile.venue && profile.city && <p className="mt-2 text-[var(--t-muted)]">{profile.city}</p>}
          <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([profile.venue, profile.city].filter(Boolean).join(", "))}`} className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--t-gold)]/60 px-5 py-2.5 text-sm transition hover:bg-[var(--t-gold)]/10">→ {L.directions}</a>
          {/goa/i.test(profile.city ?? profile.venue ?? "") && (
            <div className="mt-10">
              <p className="eyebrow mb-4 text-[var(--t-muted)]">{L.travel}</p>
              <p className="display text-xl leading-relaxed text-[var(--t-muted)]">{L.travelText}</p>
            </div>
          )}
        </Reveal>
      </section>
    ),
    gallery: gallery.length > 0 && (
      <section className={`relative mx-auto max-w-5xl py-16 ${pad}`}>
        <Reveal>{eyebrow(L.gallery)}</Reveal>
        <div className={`columns-2 gap-3 ${compact ? "" : "md:columns-3"}`}>
          {gallery.map((k, i) => (
            <Reveal key={k} delay={(i % 6) * 0.06} className="mb-3 break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-edit-photo="gallery" data-gallery-key={k} src={media(k)} alt="" loading="lazy" className="w-full rounded-2xl object-cover ring-1 ring-[var(--t-gold)]/20 transition duration-700 hover:scale-[1.02]" />
            </Reveal>
          ))}
        </div>
      </section>
    ),
    rsvp: children && occ !== "greeting" && (
      <section className={`relative mx-auto max-w-xl pb-20 pt-10 ${pad}`}>
        <Reveal>
          <div className={`relative overflow-hidden p-8 shadow-[0_40px_80px_-50px_rgba(74,20,36,.45)] md:p-10 ${card}`}>{children}</div>
        </Reveal>
      </section>
    ),
    info: info && (
      <section className={`relative mx-auto max-w-2xl py-16 text-center ${pad}`}>
        <Reveal>
          {eyebrow(L.info)}
          <E as="p" multiline path="texts.body" className="block whitespace-pre-line text-lg leading-relaxed text-[var(--t-muted)]">{info}</E>
        </Reveal>
      </section>
    ),
  };

  return (
    <div lang={profile.language ?? "en"} style={designVars(theme, design)} className="tbody relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] transition-colors duration-1000">
      <Petals count={compact ? 10 : 22} colors={petalColors(theme)} className={compact ? "absolute" : "fixed"} />

      {/* Intro (hero) — always first */}
      {SITE_HEROES[layout] ? SITE_HEROES[layout]({
        compact, theme, hasPhoto: !!heroUrl,
        initials: b ? `${a[0]}&${b[0]}` : a[0],
        names: <><E path="profile.partner1">{a}</E>{b && <><span className="script mx-3 text-[0.55em] text-[var(--t-accent)]">&amp;</span><E path="profile.partner2">{b}</E></>}</>,
        line: occasionLine(profile),
        date: profile.date ? formatDate(profile.date, profile.language) : null,
        where: where && occ !== "greeting" ? <E path={profile.venue ? "profile.venue" : "profile.city"}>{where}</E> : null,
        countdown: profile.date && occ !== "greeting" ? <Countdown date={profile.date} label={L.until} /> : null,
        motif: (cls) => <Motif key={theme.id + (motif ?? "")} theme={theme} motif={motif} className={cls} />,
        photo: (cls) => heroUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img data-edit-photo="hero" src={heroUrl} alt="" className={cls} />
          : <div data-edit-photo="hero" className={`flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--t-accent)_26%,var(--t-surface)),var(--t-surface))]`}><Motif theme={theme} motif={motif} className="draw w-2/3 opacity-80" /></div>,
      }) : (
      <header className={`relative flex flex-col items-center justify-center overflow-hidden text-center ${compact ? "min-h-[520px] py-16" : "min-h-[100dvh] py-24"} ${pad}`}>
        {heroUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-edit-photo="hero" src={heroUrl} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover [animation:kenburns_24s_ease-in-out_infinite_alternate]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[var(--t-bg)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,color-mix(in_oklab,var(--t-accent)_14%,transparent),transparent_70%)]" />
        )}
        <Sparkles color={heroUrl ? "#fff3d6" : "var(--t-gold)"} />
        {arch && <div aria-hidden className={`pointer-events-none absolute left-1/2 top-[6%] bottom-[4%] -translate-x-1/2 rounded-t-full border border-[var(--t-gold)]/60 ${compact ? "w-[78%]" : "w-[min(86vw,640px)]"}`}><div className="absolute inset-2 rounded-t-full border border-[var(--t-gold)]/25" /></div>}
        <div className={`relative w-full ${heroUrl ? "text-white" : ""} ${editorial ? `mx-auto max-w-6xl ${compact ? "text-left" : "text-left md:grid md:grid-cols-[1.2fr_1fr] md:items-center md:gap-14"}` : ""}`}>
          <div>
            <Motif key={theme.id + (motif ?? "")} theme={theme} motif={motif} className={`draw mb-10 w-52 ${editorial ? "" : "mx-auto"}`} />
            {(occ === "baby_shower" || occ === "greeting") && <p className="eyebrow rise mb-6 opacity-80">{occasionLine(profile)}</p>}
            <h1 className={`display rise rise-2 ${compact ? "text-5xl" : editorial ? "text-[4.2rem] md:text-[7rem]" : "text-[4.2rem] md:text-[8.5rem]"} leading-[0.92]`}>
              <E path="profile.partner1" className={heroUrl ? "" : "foil"}>{a}</E>
              {b && (
                <>
                  <span className={`script mx-3 block text-[0.55em] text-[var(--t-accent)] ${editorial ? "" : "md:inline"}`}>&amp;</span>
                  <E path="profile.partner2" className={heroUrl ? "" : "foil"}>{b}</E>
                </>
              )}
            </h1>
            {occ !== "baby_shower" && occ !== "greeting" && <p className="script rise rise-3 mt-5 text-3xl text-[var(--t-accent)] md:text-4xl">{occasionLine(profile)}</p>}
            {profile.date && (
              <div className={`rise rise-3 mt-8 flex items-center gap-4 opacity-80 ${editorial ? "" : "mx-auto justify-center"}`}>
                <span className="h-px w-14 bg-current" />
                <p className="display text-2xl md:text-3xl">{formatDate(profile.date, profile.language)}</p>
                <span className="h-px w-14 bg-current" />
              </div>
            )}
            {where && occ !== "greeting" && <p className="rise rise-4 mt-2 text-sm tracking-wide opacity-75">{where}</p>}
            {profile.date && occ !== "greeting" && <div className="rise rise-5"><Countdown date={profile.date} label={L.until} /></div>}
          </div>
          {editorial && !compact && (
            <div className="rise rise-3 relative mt-12 hidden aspect-[3/4] overflow-hidden rounded-t-full border border-[var(--t-gold)]/50 md:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--t-accent)_25%,var(--t-surface)),var(--t-surface))]" />
              <div className="absolute inset-0 flex items-center justify-center"><Motif theme={theme} motif={motif} className="draw w-3/4" /></div>
            </div>
          )}
        </div>
        {!compact && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60 motion-reduce:hidden">
            <div className="h-12 w-px animate-pulse bg-current" />
          </div>
        )}
      </header>
      )}

      {<div className={SITE_BODY[layout] ?? ""}>{order.filter((id) => !hidden.has(id)).map((id) => sections[id] ? <div key={id} data-section={id} data-edit-section={id}>{sections[id]}</div> : null)}</div>}

      <footer className="relative pb-16 pt-6 text-center">
        <Reveal>
          {profile.blessing && <E as="p" path="profile.blessing" className="script mb-4 block text-3xl text-[var(--t-accent)]">{profile.blessing}</E>}
          <p className="display text-2xl"><span className="foil">{a[0]}</span>{b && <> <span className="script text-[var(--t-accent)]">&amp;</span> <span className="foil">{b[0]}</span></>}</p>
          {occ === "wedding" && <p className="eyebrow mt-3 text-[var(--t-muted)]">{L.forever}</p>}
          {credit && <div className="mt-10 text-[11px] tracking-wide text-[var(--t-muted)] opacity-80">{credit}</div>}
        </Reveal>
      </footer>
    </div>
  );
}
