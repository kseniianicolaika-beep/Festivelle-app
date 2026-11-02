import type { Profile } from "@/lib/profile";
import { coupleNames, formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { themeVars } from "@/lib/themes";
import { Motif } from "./Motif";

export function InvitationCard({ profile, theme, variant = "invite" }: { profile: Profile; theme: Theme; variant?: "invite" | "save" }) {
  const [a, b] = coupleNames(profile);
  const L = t(profile.language);
  const isDeva = profile.language === "hi";
  return (
    <div
      lang={profile.language ?? "en"}
      style={themeVars(theme)}
      className="relative mx-auto aspect-[5/7] w-full max-w-[420px] overflow-hidden bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_30px_80px_-30px_rgba(40,20,10,.35)] transition-colors duration-700"
    >
      <div className="absolute inset-3 border border-[var(--t-gold)]/70" />
      <div className="absolute inset-[18px] border border-[var(--t-gold)]/30" />
      <div className="relative flex h-full flex-col items-center justify-between px-8 py-10 text-center">
        <Motif theme={theme} className="w-40" />
        <div className="fade" key={theme.id + (profile.language ?? "")}>
          {variant === "save" ? (
            <p className="eyebrow mb-5 text-[var(--t-muted)]">Save the date</p>
          ) : (
            <p className={`mx-auto mb-6 max-w-[16rem] text-[13px] leading-relaxed text-[var(--t-muted)] ${isDeva ? "deva" : ""}`}>{L.invite}</p>
          )}
          <h2 className="display text-[2.6rem] leading-[1.05]">{a}</h2>
          <p className="script my-1 text-3xl text-[var(--t-accent)]">&amp;</p>
          <h2 className="display text-[2.6rem] leading-[1.05]">{b}</h2>
          {profile.tradition && variant === "invite" && <p className="eyebrow mt-5 text-[var(--t-muted)]">{profile.tradition}</p>}
        </div>
        <div>
          <p className="display text-xl">{formatDate(profile.date, profile.language) || "Date to be announced"}</p>
          <p className="mt-1 text-[12px] tracking-wide text-[var(--t-muted)]">{profile.venue || profile.city || " "}</p>
        </div>
      </div>
    </div>
  );
}
