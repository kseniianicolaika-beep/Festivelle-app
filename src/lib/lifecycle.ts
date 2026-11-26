import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { sql } from "./db";
import { brandedEmail, esc, sendTransactional, sequenzyEnabled } from "./sequenzy";
import { displayNames } from "./occasions";
import { getPricing, fmt, currencyFor } from "./pricing";
import type { Profile } from "./profile";
import { OWNER_EMAILS } from "./admin";

// Helpful lifecycle emails to hosts, sent once a day by /api/cron/daily. Few and useful, never pushy:
//   draft_2d / draft_7d  — an unfinished, unpaid draft (two reminders at most, then silence)
//   event_7d             — a week before the event: replies so far + a short checklist
//   rsvp_<week>          — Mondays before the event, only if new replies came in that week
//   thank_you            — 1–3 days after the event: a thank-you card in the same design
//   expiry_<date>        — 14 days before the site goes offline (resets after an extension)
//   anniv_<year>         — first and later wedding anniversaries, only for hosts who opted in
// At most one email per person per run (the most time-sensitive job wins: jobs run in the order below),
// and none to the Festivelle team (OWNER_EMAILS, ADMIN_EMAILS, @festivelle.love).
// Each (celebration, kind) is sent at most once (email_log). Anyone can unsubscribe in one click (email_prefs).

const APP = () => (process.env.APP_URL || "https://hugs.festivelle.love").replace(/\/$/, "");
// Signing secret for unsubscribe links: EMAIL_LINK_SECRET env, else settings.integrations.email_link_secret in Neon
// (created once, on first use), so the client's Vercel project needs no env changes.
let linkSecret: string | null = null;
async function secret() {
  if (process.env.EMAIL_LINK_SECRET) return process.env.EMAIL_LINK_SECRET;
  if (linkSecret) return linkSecret;
  const fresh = randomBytes(32).toString("hex");
  await sql`INSERT INTO settings (key, value) VALUES ('integrations', ${JSON.stringify({ email_link_secret: fresh })}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = CASE WHEN settings.value ? 'email_link_secret' THEN settings.value ELSE settings.value || EXCLUDED.value END`;
  const r = (await sql`SELECT value->>'email_link_secret' AS s FROM settings WHERE key = 'integrations'`) as { s: string }[];
  return (linkSecret = r[0].s);
}

export async function unsubscribeToken(email: string) {
  return createHmac("sha256", await secret()).update(`unsub:${email.toLowerCase()}`).digest("base64url").slice(0, 32);
}
export async function verifyUnsubscribe(email: string, token: string) {
  if (!email || !token) return false;
  const a = Buffer.from(await unsubscribeToken(email)), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const unsubscribeUrl = async (email: string) => `${APP()}/api/email/unsubscribe?e=${encodeURIComponent(email)}&t=${await unsubscribeToken(email)}`;

export async function emailPrefs(email: string) {
  const r = (await sql`SELECT unsubscribed, anniversary FROM email_prefs WHERE email = ${email.toLowerCase()}`) as { unsubscribed: boolean; anniversary: boolean }[];
  return r[0] ?? { unsubscribed: false, anniversary: false };
}
export async function setEmailPrefs(email: string, p: { unsubscribed?: boolean; anniversary?: boolean }) {
  const cur = await emailPrefs(email);
  await sql`INSERT INTO email_prefs (email, unsubscribed, anniversary) VALUES (${email.toLowerCase()}, ${p.unsubscribed ?? cur.unsubscribed}, ${p.anniversary ?? cur.anniversary})
    ON CONFLICT (email) DO UPDATE SET unsubscribed = EXCLUDED.unsubscribed, anniversary = EXCLUDED.anniversary, updated_at = now()`;
}

type Row = { unsub: string; id: string; profile: Profile; email: string; tier: string | null; expires_at: string | null; exp_day: string | null; yes: number; no: number; guests: number; waiting: number; recent: number };

const T = {
  en: {
    hi: "Hello",
    open: "Open your studio",
    unsub: "Don't want these reminders?",
    unsubLink: "Unsubscribe in one click",
    draft2: (n: string) => [`Your design for ${n} is saved`, `Your invitation for <b>${n}</b> is saved exactly where you left it. Designing stays free for as long as you like; when it feels right, you pay once and share it with your guests.`],
    draft7: (n: string) => [`Still dreaming up ${n}?`, `Just a gentle note: your design for <b>${n}</b> is waiting in your studio. If you'd like a hand with wording or design, reply to this email and we'll help. This is the last reminder about this draft.`],
    week: (n: string) => [`One week to go: ${n}`, `Your celebration is a week away. Here's where things stand, and a short checklist:`],
    checklist: ["Send a gentle reminder to guests who haven't replied (one tap in the studio)", "Download menus, signs and table numbers for printing", "Check the venue, timings and map on your website"],
    rsvp: (n: string) => [`New replies for ${n}`, `Guests replied this week. Here's the latest:`],
    thanks: (n: string) => [`Say thank you, beautifully`, `We hope <b>${n}</b> was everything you dreamed of. When you're ready, a thank-you card in the same design takes a minute: open your studio and choose “Thank-you card”.`],
    expiry: (n: string, d: string, p: string) => [`${n}: your site goes offline on ${d}`, `Your celebration site will rest on <b>${d}</b>. If guests still visit it, or you'd like to keep it as a memory, you can extend it from the Share panel (from ${p}, one-time, never auto-renews). If not, there's nothing to do.`],
    anniv: (n: string, y: number) => [`Happy anniversary, ${n} ♥`, `${y === 1 ? "One year" : `${y} years`} ago today. If you'd like to mark it, an anniversary card in your wedding design is waiting in your studio.`],
    stats: (r: Row) => `${r.yes} attending · ${r.no} can't come${r.guests ? ` · ${r.waiting} not replied yet` : ""}`,
  },
  ru: {
    hi: "Здравствуйте",
    open: "Открыть студию",
    unsub: "Не хотите получать напоминания?",
    unsubLink: "Отписаться в один клик",
    draft2: (n: string) => [`Ваш дизайн «${n}» сохранён`, `Приглашение <b>${n}</b> сохранено ровно там, где вы остановились. Создавать дизайн можно бесплатно сколько угодно; когда будете готовы, оплатите один раз и поделитесь с гостями.`],
    draft7: (n: string) => [`Ещё придумываете «${n}»?`, `Мягкое напоминание: ваш дизайн <b>${n}</b> ждёт в студии. Если нужна помощь с текстом или дизайном, просто ответьте на это письмо. Это последнее напоминание об этом черновике.`],
    week: (n: string) => [`Осталась неделя: ${n}`, `До праздника неделя. Вот как обстоят дела и короткий чек-лист:`],
    checklist: ["Мягко напомните гостям, которые ещё не ответили (одно касание в студии)", "Скачайте меню, таблички и номера столов для печати", "Проверьте место, время и карту на сайте"],
    rsvp: (n: string) => [`Новые ответы: ${n}`, `На этой неделе гости ответили. Последние данные:`],
    thanks: (_n: string) => [`Скажите спасибо красиво`, `Надеемся, всё прошло прекрасно. Открытка-благодарность в том же стиле — это минута: откройте студию и выберите «Открытка-благодарность».`],
    expiry: (n: string, d: string, p: string) => [`${n}: сайт отключится ${d}`, `Сайт вашего праздника отключится <b>${d}</b>. Если гости ещё заходят или вы хотите сохранить его на память, продлите его в панели «Поделиться» (от ${p}, разово, без автопродления). Если нет — ничего делать не нужно.`],
    anniv: (n: string, y: number) => [`С годовщиной, ${n} ♥`, `${y === 1 ? "Год" : `${y} лет`} назад в этот день. Если захотите отметить, открытка к годовщине в стиле вашей свадьбы ждёт в студии.`],
    stats: (r: Row) => `${r.yes} придут · ${r.no} не смогут${r.guests ? ` · ${r.waiting} ещё не ответили` : ""}`,
  },
};

function body(unsub: string, lang: "en" | "ru", text: string, extra: string, link: string) {
  const L = T[lang];
  const p = (s: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.55">${s}</p>`;
  return `${p(text)}${extra}<p style="margin:24px 0"><a href="${link}" style="display:inline-block;background:#7a1f35;color:#fff7f0;text-decoration:none;border-radius:999px;padding:12px 24px;font-family:Helvetica,Arial,sans-serif;font-size:14px">${L.open}</a></p>
<p style="margin:24px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#9a7f78">${L.unsub} <a href="${unsub}" style="color:#7a1f35">${L.unsubLink}</a></p>`;
}

// Base query: each celebration with its owner's email and reply counts; unsubscribed owners are left out.
const base = async (where: ReturnType<typeof sql>): Promise<Row[]> => (await sql`
  SELECT w.id, w.profile, m.email, w.tier, w.expires_at, to_char(w.expires_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS exp_day,
    (SELECT count(*) FILTER (WHERE attending)::int FROM rsvps r WHERE r.wedding_id = w.id) AS yes,
    (SELECT count(*) FILTER (WHERE NOT attending)::int FROM rsvps r WHERE r.wedding_id = w.id) AS no,
    (SELECT count(*)::int FROM guests g WHERE g.wedding_id = w.id) AS guests,
    (SELECT count(*)::int FROM guests g WHERE g.wedding_id = w.id AND NOT EXISTS (SELECT 1 FROM rsvps r WHERE r.guest_id = g.id)) AS waiting,
    (SELECT count(*)::int FROM rsvps r WHERE r.wedding_id = w.id AND r.created_at > now() - interval '7 days') AS recent
  FROM weddings w
  JOIN members m ON m.workspace_id = w.workspace_id AND m.role = 'owner'
  LEFT JOIN email_prefs ep ON ep.email = lower(m.email)
  WHERE m.email IS NOT NULL AND COALESCE(ep.unsubscribed, false) = false AND ${where}
  LIMIT 300`) as Row[];

const dateOk = sql`(w.profile->>'date') ~ '^\\d{4}-\\d{2}-\\d{2}$'`;

/** Run every job once. `dry` lists what would be sent without sending or logging. */
export async function runLifecycle({ dry = false } = {}) {
  if (!dry && !(await sequenzyEnabled())) return { skipped: "email not configured", sent: [] as string[] };
  const P = await getPricing();
  const sent: string[] = [];
  // One email per person per day at most, and never to the Festivelle team's own test celebrations.
  const team = new Set([...OWNER_EMAILS, ...(process.env.ADMIN_EMAILS ?? "").split(",")].map((e) => e.trim().toLowerCase()).filter(Boolean));
  const mailed = new Set<string>();
  const jobs: { kind: (r: Row) => string; rows: Promise<Row[]>; make: (r: Row, lang: "en" | "ru", n: string, raw: string) => { subject: string; html: string } }[] = [
    {
      kind: (r) => `expiry_${r.exp_day}`,
      rows: base(sql`w.tier IS NOT NULL AND w.expires_at BETWEEN now() AND now() + interval '14 days'
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'expiry_' || to_char(w.expires_at AT TIME ZONE 'UTC', 'YYYY-MM-DD'))`),
      make: (r, lang, n, raw) => {
        const d = new Date(r.expires_at!).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
        const c = lang === "ru" ? "RUB" : currencyFor(null, lang);
        const price = fmt(P.hosting.extensions[0].price[c], c);
        const s = T[lang].expiry(raw, d, price)[0], t = T[lang].expiry(n, d, price)[1];
        return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, "", `${APP()}/studio/${r.id}`)) };
      },
    },
    {
      kind: () => "event_7d",
      rows: base(sql`w.tier IS NOT NULL AND ${dateOk} AND (w.profile->>'date')::date = current_date + 7
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'event_7d')`),
      make: (r, lang, n, raw) => {
        const L = T[lang]; const s = L.week(raw)[0], t = L.week(n)[1];
        const extra = `<p style="margin:0 0 12px;font-size:16px"><b>${esc(L.stats(r))}</b></p><ul style="margin:0 0 8px;padding-left:20px;font-size:15px;line-height:1.6">${L.checklist.map((c) => `<li>${c}</li>`).join("")}</ul>`;
        return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, extra, `${APP()}/studio/${r.id}`)) };
      },
    },
    {
      kind: () => "thank_you",
      rows: base(sql`w.tier IS NOT NULL AND ${dateOk} AND (w.profile->>'date')::date BETWEEN current_date - 3 AND current_date - 1
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'thank_you')`),
      make: (r, lang, n, raw) => { const s = T[lang].thanks(raw)[0], t = T[lang].thanks(n)[1]; return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, "", `${APP()}/studio/${r.id}`)) }; },
    },
    {
      kind: () => `rsvp_${isoWeek(new Date())}`,
      rows: (new Date().getUTCDay() === 1
        ? base(sql`w.tier IS NOT NULL AND ${dateOk} AND (w.profile->>'date')::date BETWEEN current_date + 8 AND current_date + 60
            AND EXISTS (SELECT 1 FROM rsvps r WHERE r.wedding_id = w.id AND r.created_at > now() - interval '7 days')
            AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = ${`rsvp_${isoWeek(new Date())}`})`)
        : Promise.resolve([])) as Promise<Row[]>,
      make: (r, lang, n, raw) => {
        const L = T[lang]; const s = L.rsvp(raw)[0], t = L.rsvp(n)[1];
        return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, `<p style="margin:0 0 12px;font-size:16px"><b>${esc(L.stats(r))}</b></p>`, `${APP()}/studio/${r.id}`)) };
      },
    },
    {
      kind: () => `anniv_${new Date().getUTCFullYear()}`,
      rows: base(sql`w.tier IS NOT NULL AND ${dateOk} AND COALESCE(w.profile->>'occasion', 'wedding') = 'wedding'
        AND COALESCE(ep.anniversary, false) = true
        AND to_char((w.profile->>'date')::date, 'MM-DD') = to_char(current_date, 'MM-DD') AND (w.profile->>'date')::date < current_date
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = ${`anniv_${new Date().getUTCFullYear()}`})`),
      make: (r, lang, n, raw) => {
        const years = new Date().getUTCFullYear() - Number(r.profile.date!.slice(0, 4));
        const s = T[lang].anniv(raw, years)[0], t = T[lang].anniv(n, years)[1];
        return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, "", `${APP()}/studio/${r.id}`)) };
      },
    },
    {
      kind: () => "draft_2d",
      rows: base(sql`w.tier IS NULL AND w.created_at < now() - interval '2 days' AND w.created_at > now() - interval '14 days'
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'draft_2d')`),
      make: (r, lang, n, raw) => { const s = T[lang].draft2(raw)[0], t = T[lang].draft2(n)[1]; return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, "", `${APP()}/studio/${r.id}`)) }; },
    },
    {
      kind: () => "draft_7d",
      rows: base(sql`w.tier IS NULL AND w.created_at < now() - interval '7 days' AND w.created_at > now() - interval '21 days'
        AND EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'draft_2d' AND l.sent_at < now() - interval '4 days')
        AND NOT EXISTS (SELECT 1 FROM email_log l WHERE l.wedding_id = w.id AND l.kind = 'draft_7d')`),
      make: (r, lang, n, raw) => { const s = T[lang].draft7(raw)[0], t = T[lang].draft7(n)[1]; return { subject: s, html: brandedEmail(s, body(r.unsub, lang, t, "", `${APP()}/studio/${r.id}`)) }; },
    },
  ];

  for (const job of jobs) {
    for (const r of await job.rows) {
      const kind = job.kind(r);
      const to = r.email.toLowerCase();
      if (team.has(to) || to.endsWith("@festivelle.love") || mailed.has(to)) continue;
      mailed.add(to);
      const lang = r.profile.language === "ru" ? "ru" : "en";
      const n = displayNames(r.profile) || (lang === "ru" ? "ваш праздник" : "your celebration");
      if (dry) { sent.push(`${kind} → ${r.email} (${r.id})`); continue; }
      // Claim first so two runs can never double-send; release the claim if sending fails.
      const claim = (await sql`INSERT INTO email_log (wedding_id, kind) VALUES (${r.id}, ${kind}) ON CONFLICT DO NOTHING RETURNING kind`) as unknown[];
      if (!claim.length) continue;
      try {
        r.unsub = await unsubscribeUrl(r.email);
        const m = job.make(r, lang, esc(n), n);
        await sendTransactional({ to: r.email, subject: m.subject, html: m.html, idempotencyKey: `${r.id}:${kind}` });
        sent.push(`${kind} → ${r.id}`);
      } catch (e) {
        await sql`DELETE FROM email_log WHERE wedding_id = ${r.id} AND kind = ${kind}`;
        console.error("lifecycle", kind, r.id, e);
      }
    }
  }
  return { sent };
}

function isoWeek(d: Date) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((t.getTime() - y.getTime()) / 86400000 + 1) / 7)).padStart(2, "0")}`;
}
