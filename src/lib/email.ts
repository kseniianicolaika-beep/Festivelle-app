import type { Profile } from "./profile";
import { formatDate } from "./profile";
import { nameParts, occasionInvite } from "./occasions";
import type { Theme } from "./themes";
import { t } from "./i18n";

export const emailEnabled = () => !!process.env.RESEND_API_KEY;

export function inviteHtml(p: Profile, th: Theme, url: string, guest: string) {
  const [a, b] = nameParts(p);
  const L = t(p.language);
  const lead = p.inviteLine || occasionInvite(p);
  return `<!doctype html><html><body style="margin:0;background:${th.bg};font-family:Georgia,'Times New Roman',serif;color:${th.ink}">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:48px 16px">
<table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:${th.surface};border:1px solid ${th.gold};"><tr><td align="center" style="padding:56px 40px">
<p style="margin:0 0 24px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${th.muted}">Dear ${escape(guest)}</p>
<p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:${th.muted}">${escape(lead)}</p>
<h1 style="margin:0;font-weight:400;font-size:42px;line-height:1.15">${escape(a)}${b ? `<br><span style="color:${th.accent};font-size:28px">&amp;</span><br>${escape(b)}` : ""}</h1>
<p style="margin:28px 0 4px;font-size:18px">${formatDate(p.date, p.language)}</p>
<p style="margin:0 0 36px;font-size:14px;color:${th.muted}">${escape(p.venue || p.city || "")}</p>
<a href="${url}" style="display:inline-block;padding:14px 32px;background:${th.accent};color:#fff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase">${L.rsvp}</a>
</td></tr></table></td></tr></table></body></html>`;
}

export function reminderHtml(p: Profile, th: Theme, url: string, guest: string) {
  const L = t(p.language);
  const date = formatDate(p.date, p.language);
  const intro = p.language === "ru" ? "Мы будем рады узнать, сможете ли вы быть с нами" : p.language === "hi" ? "कृपया हमें बताएँ कि क्या आप पधारेंगे" : "We’d love to know if you can join us";
  return `<!doctype html><html><body style="margin:0;background:${th.bg};font-family:Georgia,'Times New Roman',serif;color:${th.ink}">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:48px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;background:${th.surface};border:1px solid ${th.gold};"><tr><td align="center" style="padding:44px 36px">
<p style="margin:0 0 18px;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:${th.muted}">Dear ${escape(guest)}</p>
<p style="margin:0 0 10px;font-size:22px">${escape(intro)}</p>
<p style="margin:0 0 28px;font-size:15px;color:${th.muted}">${escape(date)}${p.venue || p.city ? " · " + escape(p.venue || p.city || "") : ""}</p>
<a href="${url}" style="display:inline-block;padding:14px 32px;background:${th.accent};color:#fff;text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase">${L.rsvp}</a>
</td></tr></table></td></tr></table></body></html>`;
}

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM || "Festivelle <onboarding@resend.dev>", to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
