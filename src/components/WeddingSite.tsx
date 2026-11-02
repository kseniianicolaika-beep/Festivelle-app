import type { Profile } from "@/lib/profile";
import { coupleNames, formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { petalColors, themeVars } from "@/lib/themes";
import { Motif } from "./Motif";
import { Countdown } from "./Countdown";
import { Petals } from "./fx/Petals";
import { Reveal } from "./fx/Reveal";
import { Sparkles } from "./fx/Sparkles";

type Props = { profile: Profile; theme: Theme; heroUrl?: string | null; calendarUrl?: string | null; children?: React.ReactNode; compact?: boolean };

export function WeddingSite({ profile, theme, heroUrl, calendarUrl, children, compact }: Props) {
  const [a, b] = coupleNames(profile);
  const L = t(profile.language);
  const pad = compact ? "px-6" : "px-6 md:px-12";
  const dark = theme.motif === "arch";
  return (
    <div lang={profile.language ?? "en"} style={themeVars(theme)} className="relative overflow-hidden bg-[var(--t-bg)] text-[var(--t-ink)] transition-colors duration-1000">
      <Petals count={compact ? 10 : 22} colors={petalColors(theme)} className={compact ? "absolute" : "fixed"} />

      {/* Hero */}
      <header className={`relative flex flex-col items-center justify-center overflow-hidden text-center ${compact ? "min-h-[520px] py-16" : "min-h-[100dvh] py-24"} ${pad}`}>
        {heroUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover [animation:kenburns_24s_ease-in-out_infinite_alternate]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[var(--t-bg)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,color-mix(in_oklab,var(--t-accent)_14%,transparent),transparent_70%)]" />
        )}
        <Sparkles color={heroUrl ? "#fff3d6" : "var(--t-gold)"} />
        <div className={`relative ${heroUrl ? "text-white" : ""}`}>
          <Motif key={theme.id} theme={theme} className="draw mx-auto mb-10 w-52" />
          <p className="eyebrow rise mb-6 opacity-80">{L.getting}</p>
          <h1 className={`display rise rise-2 ${compact ? "text-5xl" : "text-[4.2rem] md:text-[8.5rem]"} leading-[0.92]`}>
            <span className={heroUrl ? "" : "foil"}>{a}</span>
            <span className="script mx-3 block text-[0.55em] text-[var(--t-accent)] md:inline">&amp;</span>
            <span className={heroUrl ? "" : "foil"}>{b}</span>
          </h1>
          <div className="rise rise-3 mx-auto mt-10 flex items-center justify-center gap-4 opacity-80">
            <span className="h-px w-14 bg-current" />
            <p className="display text-2xl md:text-3xl">{formatDate(profile.date, profile.language)}</p>
            <span className="h-px w-14 bg-current" />
          </div>
          <p className="rise rise-4 mt-2 text-sm tracking-wide opacity-75">{profile.venue || profile.city}</p>
          {profile.date && <div className="rise rise-5"><Countdown date={profile.date} label={L.until} /></div>}
        </div>
        {!compact && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60">
            <div className="h-12 w-px animate-pulse bg-current" />
          </div>
        )}
      </header>

      {(profile.inviteLine || profile.story) && (
        <section className={`relative mx-auto max-w-3xl py-24 text-center ${pad}`}>
          <Reveal>
            <p className="eyebrow mb-8 text-[var(--t-muted)]">{L.story}</p>
            <p className="script mb-2 text-6xl leading-none text-[var(--t-accent)] opacity-60">“</p>
            <p className="display text-[1.7rem] leading-[1.5] md:text-[2.2rem]">{profile.story || profile.inviteLine}</p>
          </Reveal>
        </section>
      )}

      {!!profile.events?.length && (
        <section className={`relative mx-auto max-w-3xl py-20 ${pad}`}>
          <Reveal><p className="eyebrow mb-14 text-center text-[var(--t-muted)]">{L.events}</p></Reveal>
          <div className="relative">
            <div className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-transparent via-[var(--t-gold)] to-transparent md:left-1/2" />
            {profile.events.map((e, i) => (
              <Reveal key={i} delay={i * 0.08} className={`relative mb-12 pl-14 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"}`}>
                <span className={`absolute top-3 h-3 w-3 rotate-45 border border-[var(--t-gold)] bg-[var(--t-bg)] left-[11px] ${i % 2 ? "md:left-[-6px]" : "md:left-auto md:right-[-6px]"}`} />
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
      )}

      {/goa/i.test(profile.city ?? "") && (
        <section className={`relative mx-auto max-w-2xl py-16 text-center ${pad}`}>
          <Reveal>
            <p className="eyebrow mb-5 text-[var(--t-muted)]">{L.travel}</p>
            <p className="display text-xl leading-relaxed text-[var(--t-muted)]">{L.travelText}</p>
          </Reveal>
        </section>
      )}

      {children && (
        <section className={`relative mx-auto max-w-xl pb-24 pt-10 ${pad}`}>
          <Reveal>
            <div className={`relative overflow-hidden rounded-[28px] border border-[var(--t-gold)]/40 p-8 md:p-10 ${dark ? "bg-white/5" : "bg-white/55"} shadow-[0_40px_80px_-50px_rgba(74,20,36,.45)] backdrop-blur-xl`}>{children}</div>
          </Reveal>
        </section>
      )}

      <footer className="relative pb-16 pt-6 text-center">
        <Reveal>
          {profile.blessing && <p className="script mb-4 text-3xl text-[var(--t-accent)]">{profile.blessing}</p>}
          <p className="display text-2xl"><span className="foil">{a[0]}</span> <span className="script text-[var(--t-accent)]">&amp;</span> <span className="foil">{b[0]}</span></p>
          <p className="eyebrow mt-3 text-[var(--t-muted)]">{L.forever}</p>
        </Reveal>
      </footer>
    </div>
  );
}
