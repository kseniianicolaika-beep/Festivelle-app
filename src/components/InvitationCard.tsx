import type { Profile } from "@/lib/profile";
import { coupleNames, formatDate } from "@/lib/profile";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { themeVars } from "@/lib/themes";
import { Motif } from "./Motif";
import { Sparkles } from "./fx/Sparkles";

const Corner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 40 40" className={`absolute h-9 w-9 ${className}`} aria-hidden>
    <path d="M2 38V14C2 7 7 2 14 2h24M8 38V18c0-6 4-10 10-10h20" fill="none" stroke="var(--t-gold)" strokeWidth="1" />
    <circle cx="14" cy="14" r="2" fill="var(--t-gold)" />
  </svg>
);

export function InvitationCard({ profile, theme, variant = "invite" }: { profile: Profile; theme: Theme; variant?: "invite" | "save" }) {
  const [a, b] = coupleNames(profile);
  const L = t(profile.language);
  const isDeva = profile.language === "hi";
  return (
    <div
      lang={profile.language ?? "en"}
      style={themeVars(theme)}
      className="relative mx-auto aspect-[5/7] w-full max-w-[430px] overflow-hidden rounded-[6px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(74,20,36,.55),0_0_0_1px_rgba(0,0,0,.03)] transition-colors duration-1000"
    >
      {/* paper light */}
      <div className={`pointer-events-none absolute inset-0 ${theme.motif === "arch" ? "bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,210,140,.10),transparent_60%)]" : "bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,.55),transparent_60%)]"}`} />
      <Sparkles color="var(--t-gold)" className="opacity-70" />
      <div className="absolute inset-3 border border-[var(--t-gold)]/60" />
      <div className="absolute inset-[19px] border border-[var(--t-gold)]/25" />
      <Corner className="left-4 top-4" />
      <Corner className="right-4 top-4 rotate-90" />
      <Corner className="bottom-4 right-4 rotate-180" />
      <Corner className="bottom-4 left-4 -rotate-90" />

      <div className="relative flex h-full flex-col items-center justify-between px-9 py-11 text-center">
        <Motif key={theme.id} theme={theme} className="draw w-40" />
        <div className="fade" key={theme.id + (profile.language ?? "") + variant}>
          {variant === "save" ? (
            <p className="eyebrow mb-6 text-[var(--t-muted)]">Save the date</p>
          ) : (
            <p className={`mx-auto mb-7 max-w-[17rem] text-[12.5px] leading-relaxed text-[var(--t-muted)] ${isDeva ? "deva" : ""}`}>{profile.inviteLine || L.invite}</p>
          )}
          <h2 className="display foil text-[2.85rem] leading-[1.02]">{a}</h2>
          <p className="script my-1.5 text-[2.2rem] leading-none text-[var(--t-accent)]">&amp;</p>
          <h2 className="display foil text-[2.85rem] leading-[1.02]">{b}</h2>
          {profile.tradition && variant === "invite" && <p className="eyebrow mt-6 text-[var(--t-muted)]">{profile.tradition}</p>}
        </div>
        <div>
          <div className="mx-auto mb-3 flex items-center justify-center gap-3 text-[var(--t-gold)]">
            <span className="h-px w-10 bg-current" />
            <span className="text-[9px]">✦</span>
            <span className="h-px w-10 bg-current" />
          </div>
          <p className="display text-[1.35rem]">{formatDate(profile.date, profile.language) || "Date to be announced"}</p>
          <p className="mt-1 text-[11.5px] tracking-wide text-[var(--t-muted)]">{profile.venue || profile.city || " "}</p>
          {profile.blessing && variant === "invite" && <p className="script mt-3 text-lg text-[var(--t-accent)]">{profile.blessing}</p>}
        </div>
      </div>
    </div>
  );
}
