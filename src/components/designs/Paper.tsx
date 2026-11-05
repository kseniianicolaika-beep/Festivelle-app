import type { Profile } from "@/lib/profile";
import { formatDate } from "@/lib/profile";
import { nameParts, occasionInvite, occasionLine, occasionOf } from "@/lib/occasions";
import { t } from "@/lib/i18n";
import type { Theme } from "@/lib/themes";
import { designVars } from "@/lib/themes";
import { E } from "./Editable";
import { CARD_LAYOUTS } from "./layouts/cards";
import { INVOCATIONS } from "@/lib/motifs";
import { KINDS, type Design, type Kind } from "@/lib/templates";
import { Motif } from "../Motif";
import { bespokeFor } from "@/templates/registry";
import { Sparkles } from "../fx/Sparkles";

type Props = { kind: Kind; layout: string; design: Design; profile: Profile; theme: Theme; photoUrl?: string | null; animate?: boolean; className?: string };

const RU = { save: "Сохраните дату", welcome: "Добро пожаловать на свадьбу", table: "Стол", join: "приглашают вас на", tag: "Делитесь снимками" };
const HI = { save: "तिथि सुरक्षित करें", welcome: "विवाह में आपका स्वागत है", table: "मेज़", join: "आपको आमंत्रित करते हैं", tag: "अपनी तस्वीरें साझा करें" };
const EN = { save: "Save the date", welcome: "Welcome to the wedding of", table: "Table", join: "invite you to their", tag: "Share your moments" };

// Resolve what text each kind of piece shows. Couples can override any of it via design.texts.
function content(kind: Kind, d: Design, p: Profile) {
  const L = t(p.language);
  const W = p.language === "ru" ? RU : p.language === "hi" ? HI : EN;
  const ev = p.events?.[d.eventIndex ?? 0];
  const occ = occasionOf(p);
  const wed = occ === "wedding";
  const date = formatDate(p.date, p.language);
  const where = p.venue || p.city || "";
  const base = { eyebrow: "", lead: "", headline: "", names: true, sub: "", date, where, body: "", footer: "", items: d.items ?? [], number: undefined as number | undefined, hashtag: "" };
  const c = (() => {
    switch (kind) {
      case "invite": return wed ? { ...base, lead: p.inviteLine || L.invite, sub: p.tradition ?? "", footer: p.blessing ?? "" } : { ...base, lead: p.inviteLine || occasionInvite(p), sub: occasionLine(p), footer: p.blessing ?? "" };
      case "greeting": return { ...base, eyebrow: occasionLine(p), headline: "", body: p.story ?? "", footer: p.blessing ?? "", date: "", where: "" };
      case "save": return { ...base, eyebrow: W.save, where: p.city || where };
      case "event": return { ...base, lead: W.join, headline: ev?.name ?? "Celebration", names: true, date: [formatDate(ev?.date ?? p.date, p.language), ev?.time].filter(Boolean).join(" · "), where: ev?.venue || where };
      case "story": return { ...base, eyebrow: wed ? W.save : occasionLine(p), footer: p.blessing ?? "" };
      case "post": return { ...base, eyebrow: wed ? L.getting : occasionLine(p) };
      case "welcome": return { ...base, eyebrow: wed ? W.welcome : p.language === "ru" ? "Добро пожаловать" : p.language === "hi" ? "स्वागत है" : "Welcome" };
      case "program": return { ...base, headline: "Order of ceremony", names: false };
      case "menu": return { ...base, headline: "Menu", names: false };
      case "table": return { ...base, headline: W.table, names: false, number: d.number ?? 1, date: "", where: "" };
      case "hashtag": return { ...base, hashtag: d.texts?.hashtag ?? "", body: W.tag, names: false, date: "", where: "" };
      case "thankyou": return { ...base, headline: "Thank you", names: false, body: "", date: "" };
      default: return base;
    }
  })();
  const x = d.texts ?? {};
  return { ...c, eyebrow: x.eyebrow ?? c.eyebrow, headline: x.headline ?? c.headline, body: x.body ?? c.body, footer: x.footer ?? c.footer, hashtag: x.hashtag ?? c.hashtag };
}

const Corner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 40 40" className={`absolute h-[8cqw] w-[8cqw] ${className}`} aria-hidden>
    <path d="M2 38V14C2 7 7 2 14 2h24M8 38V18c0-6 4-10 10-10h20" fill="none" stroke="var(--t-gold)" strokeWidth="1" />
    <circle cx="14" cy="14" r="2" fill="var(--t-gold)" />
  </svg>
);

export function Paper(props: Props) {
  const B = bespokeFor(props.design?.template);
  if (B) return <B.card {...props} />;
  return <GenericPaper {...props} />;
}

function GenericPaper({ kind, layout, design, profile, theme, photoUrl, animate = true, className = "" }: Props) {
  const [a, b] = nameParts(profile);
  const both = b ? `${a} & ${b}` : a;
  const c = content(kind, design, profile);
  const ratio = KINDS[kind].ratio;
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.4);
  const landscape = kind === "thankyou";
  const tall = ratio === "9/16" || ratio === "4/9";
  const nameSize = (landscape ? 8 : tall ? 12 : 10.5) * scale;
  const inv = design.invocation ? INVOCATIONS[design.invocation] : null;
  const motif = design.motif;
  const left = layout === "editorial" || design.align === "left";

  const names = (size = nameSize) => (
    <div className={left ? "text-left" : "text-center"}>
      <E as="h2" path="profile.partner1" className="display foil block leading-[1.02]" style={{ fontSize: `${size}cqw` }}>{a}</E>
      {b && <p className="script leading-none text-[var(--t-accent)]" style={{ fontSize: `${size * 0.7}cqw`, margin: `${size * 0.08}cqw 0` }}>&amp;</p>}
      <E as="h2" path="profile.partner2" className="display foil block leading-[1.02]" style={{ fontSize: `${size}cqw` }}>{b}</E>
    </div>
  );

  const body = (
    <div className={`relative flex flex-col ${left ? "items-start text-left" : "items-center text-center"}`} style={{ gap: "2.2cqw" }}>
      {inv && <p className={design.invocation === "bismillah" ? "font-[var(--font-arabic)]" : "deva"} style={{ fontSize: design.invocation === "bismillah" ? "4.4cqw" : "4cqw", color: "var(--t-accent)" }} dir="auto">{inv.text}</p>}
      {c.eyebrow && <E as="p" path="texts.eyebrow" className="eyebrow block text-[var(--t-muted)]" style={{ fontSize: "2.3cqw" }}>{c.eyebrow}</E>}
      {c.lead && (kind === "invite" ? <E as="p" multiline path="profile.inviteLine" className="block max-w-[78cqw] leading-relaxed text-[var(--t-muted)]" style={{ fontSize: "2.9cqw" }}>{c.lead}</E> : <p className="max-w-[78cqw] leading-relaxed text-[var(--t-muted)]" style={{ fontSize: "2.9cqw" }}>{c.lead}</p>)}
      {c.number !== undefined ? (
        <>
          <p className="eyebrow text-[var(--t-muted)]" style={{ fontSize: "3.4cqw" }}>{c.headline}</p>
          <p className="display foil leading-none" style={{ fontSize: `${34 * scale}cqw` }}>{c.number}</p>
        </>
      ) : c.hashtag ? (
        <>
          <p className="script text-[var(--t-accent)]" style={{ fontSize: "6cqw" }}>{c.body}</p>
          <E as="p" path="texts.hashtag" className="display foil block break-all leading-tight" style={{ fontSize: `${9 * scale}cqw` }}>{c.hashtag}</E>
          <p className="eyebrow text-[var(--t-muted)]" style={{ fontSize: "2.3cqw" }}>{both}</p>
        </>
      ) : (
        <>
          {c.headline && <E as="p" path="texts.headline" className={c.names ? "display block text-[var(--t-accent)]" : "display foil block"} style={{ fontSize: c.names ? "6.5cqw" : `${(landscape ? 9 : 11) * scale}cqw`, lineHeight: 1.05 }}>{c.headline}</E>}
          {c.names && names(c.headline ? nameSize * 0.72 : nameSize)}
          {!c.names && kind !== "table" && <p className="script text-[var(--t-accent)]" style={{ fontSize: "5cqw" }}>{both}</p>}
          {c.sub && <p className="eyebrow text-[var(--t-muted)]" style={{ fontSize: "2.1cqw" }}>{c.sub}</p>}
        </>
      )}
      {!!c.items.length && (
        <ul className="w-full" style={{ marginTop: "1cqw" }}>
          {c.items.map((it, i) => (
            <li key={i} style={{ padding: "1.6cqw 0" }} className={i ? "border-t border-[var(--t-gold)]/30" : ""}>
              <E as="p" path={`items.${i}.title`} className="display block" style={{ fontSize: `${tall ? 5.4 : 4.4}cqw` }}>{it.title}</E>
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block text-[var(--t-muted)]" style={{ fontSize: `${tall ? 3.1 : 2.6}cqw`, marginTop: "0.4cqw" }}>{it.detail}</E>}
            </li>
          ))}
        </ul>
      )}
      {c.body && !c.hashtag && <E as="p" multiline path="texts.body" className="display block max-w-[80cqw] whitespace-pre-line text-[var(--t-muted)]" style={{ fontSize: "3.8cqw", lineHeight: 1.4 }}>{c.body}</E>}
    </div>
  );

  const footer =
    c.date || c.where || c.footer ? (
      <div className={left ? "text-left" : "text-center"}>
        <div className={`mb-[1.6cqw] flex items-center gap-[2.4cqw] text-[var(--t-gold)] ${left ? "" : "justify-center"}`}>
          <span className="h-px w-[9cqw] bg-current" /><span style={{ fontSize: "2cqw" }}>✦</span><span className="h-px w-[9cqw] bg-current" />
        </div>
        {c.date && <p className="display" style={{ fontSize: "4.6cqw" }}>{c.date}</p>}
        {c.where && <E as="p" path={c.where === profile.venue ? "profile.venue" : "profile.city"} className="block tracking-wide text-[var(--t-muted)]" style={{ fontSize: "2.6cqw", marginTop: "0.6cqw" }}>{c.where}</E>}
        {c.footer && <E as="p" path={design.texts?.footer === undefined && (kind === "invite" || kind === "story" || kind === "greeting") ? "profile.blessing" : "texts.footer"} className="script block text-[var(--t-accent)]" style={{ fontSize: "4.2cqw", marginTop: "1.4cqw" }}>{c.footer}</E>}
      </div>
    ) : null;

  const glow = theme.dark ? "bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,210,140,.10),transparent_60%)]" : "bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,.55),transparent_60%)]";
  const draw = animate ? "draw" : "";

  return (
    <div
      lang={profile.language ?? "en"}
      style={{ ...designVars(theme, design), aspectRatio: ratio }}
      className={`@container tbody relative w-full overflow-hidden rounded-[3px] bg-[var(--t-surface)] text-[var(--t-ink)] shadow-[0_50px_100px_-40px_rgba(74,20,36,.55),0_0_0_1px_rgba(0,0,0,.04)] transition-colors duration-1000 ${className}`}
    >
      <div className={`pointer-events-none absolute inset-0 ${glow}`} />
      {animate && <Sparkles color="var(--t-gold)" className="opacity-60" />}

      {CARD_LAYOUTS[layout] ? (
        CARD_LAYOUTS[layout]({ body, footer, photoUrl, a, b, age: profile.age, theme, draw, motif: (cls, k = "") => <Motif key={theme.id + (motif ?? "") + k} theme={theme} motif={motif} className={cls} /> })
      ) : layout === "photo" ? (
        <div className="relative flex h-full flex-col">
          <div className="relative h-[52%] overflow-hidden">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="photo" src={photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_60%,color-mix(in_oklab,var(--t-accent)_22%,var(--t-surface)),var(--t-surface))]">
                <Motif key={theme.id + motif} theme={theme} motif={motif} className={`${draw} w-[55cqw]`} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--t-surface)] to-transparent" />
          </div>
          <div className="relative flex flex-1 flex-col items-center justify-between px-[8cqw] pb-[7cqw] pt-[2cqw]">{body}{footer}</div>
        </div>
      ) : layout === "arch" ? (
        <div className="relative flex h-full flex-col items-center p-[6cqw]">
          <div className="relative flex h-full w-full flex-col items-center justify-between rounded-t-[50cqw] border border-[var(--t-gold)]/70 px-[7cqw] pb-[6cqw] pt-[14cqw]">
            <div className="absolute inset-[1.8cqw] rounded-t-[48cqw] border border-[var(--t-gold)]/25" />
            <Motif key={theme.id + motif} theme={theme} motif={motif} className={`${draw} relative w-[36cqw]`} />
            {body}
            {footer}
          </div>
        </div>
      ) : layout === "editorial" ? (
        <div className="relative flex h-full">
          <div className="w-[3cqw] bg-[var(--t-accent)]/85" />
          <div className="relative flex flex-1 flex-col justify-between p-[9cqw]">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-[var(--t-muted)]" style={{ fontSize: "2cqw" }}>{b ? `${a[0] ?? ""} · ${b[0]}` : a}</p>
              <Motif key={theme.id + motif} theme={theme} motif={motif} className={`${draw} w-[22cqw]`} />
            </div>
            {body}
            {footer}
          </div>
        </div>
      ) : layout === "monogram" ? (
        <div className="relative flex h-full flex-col items-center justify-between p-[9cqw] text-center">
          <div className="relative flex h-[36cqw] w-[36cqw] items-center justify-center">
            <svg viewBox="0 0 100 100" className={`absolute inset-0 ${draw}`} aria-hidden>
              <circle cx="50" cy="50" r="46" fill="none" stroke="var(--t-gold)" strokeWidth=".6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--t-gold)" strokeWidth=".4" strokeDasharray="1 2" />
              {Array.from({ length: 18 }, (_, i) => (
                <ellipse key={i} cx="50" cy="5" rx="1.6" ry="4" fill="none" stroke="var(--t-gold)" strokeWidth=".5" transform={`rotate(${i * 20} 50 50)`} />
              ))}
            </svg>
            <p className="display foil" style={{ fontSize: "12cqw" }}>{a[0]}{b && <><span className="script mx-[0.5cqw] text-[var(--t-accent)]" style={{ fontSize: "7cqw" }}>&amp;</span>{b[0]}</>}{!b && profile.age ? <span className="script mx-[0.5cqw] text-[var(--t-accent)]" style={{ fontSize: "7cqw" }}>{profile.age}</span> : null}</p>
          </div>
          {body}
          {footer}
        </div>
      ) : layout === "botanical" ? (
        <div className="relative flex h-full flex-col items-center justify-between px-[8cqw] py-[6cqw]">
          <Motif key={theme.id + motif + "t"} theme={theme} motif={motif} className={`${draw} w-[70cqw]`} />
          {body}
          {footer}
          <Motif key={theme.id + motif + "b"} theme={theme} motif={motif} className={`${draw} w-[70cqw] rotate-180`} />
        </div>
      ) : (
        <>
          <div className="absolute inset-[2.8cqw] border border-[var(--t-gold)]/60" />
          <div className="absolute inset-[4.4cqw] border border-[var(--t-gold)]/25" />
          <Corner className="left-[3.6cqw] top-[3.6cqw]" />
          <Corner className="right-[3.6cqw] top-[3.6cqw] rotate-90" />
          <Corner className="bottom-[3.6cqw] right-[3.6cqw] rotate-180" />
          <Corner className="bottom-[3.6cqw] left-[3.6cqw] -rotate-90" />
          <div className="relative flex h-full flex-col items-center justify-between px-[10cqw] py-[11cqw]">
            <Motif key={theme.id + motif} theme={theme} motif={motif} className={`${draw} w-[38cqw]`} />
            {body}
            {footer}
          </div>
        </>
      )}
    </div>
  );
}
