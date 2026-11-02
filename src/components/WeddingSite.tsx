import type { Profile } from "@/lib/profile";
import { coupleNames, formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { themeVars } from "@/lib/themes";
import { Motif } from "./Motif";

type Props = { profile: Profile; theme: Theme; heroUrl?: string | null; calendarUrl?: string | null; children?: React.ReactNode; compact?: boolean };

export function WeddingSite({ profile, theme, heroUrl, calendarUrl, children, compact }: Props) {
  const [a, b] = coupleNames(profile);
  const L = t(profile.language);
  const days = profile.date ? Math.ceil((new Date(profile.date).getTime() - Date.now()) / 864e5) : null;
  const pad = compact ? "px-6" : "px-6 md:px-12";
  return (
    <div lang={profile.language ?? "en"} style={themeVars(theme)} className="bg-[var(--t-bg)] text-[var(--t-ink)] transition-colors duration-700">
      <header className={`relative flex flex-col items-center justify-center overflow-hidden text-center ${compact ? "min-h-[460px] py-16" : "min-h-[92dvh] py-24"} ${pad}`}>
        {heroUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[var(--t-bg)]" />
          </>
        )}
        <div className={`relative ${heroUrl ? "text-white" : ""}`}>
          <Motif theme={theme} className="mx-auto mb-8 w-48 rise" />
          <h1 className={`display rise rise-2 ${compact ? "text-5xl" : "text-6xl md:text-8xl"} leading-[0.95]`}>
            {a} <span className="script text-[var(--t-accent)]">&amp;</span> {b}
          </h1>
          <p className="eyebrow rise rise-3 mt-6 opacity-80">{L.getting}</p>
          <p className="display rise rise-4 mt-6 text-2xl">{formatDate(profile.date, profile.language)}</p>
          <p className="mt-1 text-sm opacity-75">{profile.venue || profile.city}</p>
          {days !== null && days > 0 && (
            <p className="mt-8 inline-block rounded-full border border-current/30 px-4 py-1.5 text-xs tracking-widest opacity-80">
              {days} {L.until}
            </p>
          )}
        </div>
      </header>

      {profile.story && (
        <section className={`mx-auto max-w-2xl py-20 text-center ${pad}`}>
          <p className="eyebrow mb-6 text-[var(--t-muted)]">{L.story}</p>
          <p className="display text-2xl leading-relaxed md:text-3xl">“{profile.story}”</p>
        </section>
      )}

      {!!profile.events?.length && (
        <section className={`mx-auto max-w-4xl py-20 ${pad}`}>
          <p className="eyebrow mb-10 text-center text-[var(--t-muted)]">{L.events}</p>
          <div className={`grid gap-px overflow-hidden border border-[var(--t-gold)]/40 bg-[var(--t-gold)]/40 ${compact ? "" : "md:grid-cols-2"}`}>
            {profile.events.map((e, i) => (
              <div key={i} className="bg-[var(--t-surface)] p-8">
                <p className="text-xs tracking-widest text-[var(--t-accent)]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-2 text-3xl">{e.name}</h3>
                <p className="mt-3 text-sm text-[var(--t-muted)]">
                  {[formatDate(e.date, profile.language), e.time].filter(Boolean).join(" · ")}
                </p>
                {e.venue && <p className="text-sm text-[var(--t-muted)]">{e.venue}</p>}
              </div>
            ))}
          </div>
          {calendarUrl && (
            <p className="mt-8 text-center">
              <a href={calendarUrl} className="text-sm underline decoration-[var(--t-gold)] underline-offset-4">{L.calendar}</a>
            </p>
          )}
        </section>
      )}

      {/goa/i.test(profile.city ?? "") && (
        <section className={`mx-auto max-w-2xl py-16 text-center ${pad}`}>
          <p className="eyebrow mb-4 text-[var(--t-muted)]">{L.travel}</p>
          <p className="leading-relaxed text-[var(--t-muted)]">{L.travelText}</p>
        </section>
      )}

      {children && <section className={`mx-auto max-w-xl pb-24 pt-8 ${pad}`}>{children}</section>}

      <footer className="pb-12 text-center">
        <Motif theme={theme} className="mx-auto w-24 opacity-60" />
      </footer>
    </div>
  );
}
