"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { Wordmark } from "@/components/brand/Wordmark";

type Lang = "en" | "ru" | "hi";
const NAV: Record<Lang, { templates: string; pricing: string; vendors: string; studio: string }> = {
  en: { templates: "Templates", pricing: "Pricing", vendors: "Vendors", studio: "Your studio" },
  ru: { templates: "Шаблоны", pricing: "Цены", vendors: "Партнёры", studio: "Ваша студия" },
  hi: { templates: "टेम्पलेट", pricing: "कीमतें", vendors: "साथी", studio: "आपका स्टूडियो" },
};

// Floating editorial nav: transparent over the hero, a soft frosted ribbon once you scroll.
export function SiteNav({ signedIn = false, cta = "Begin free", lang, dark = false }: { signedIn?: boolean; cta?: string; lang?: Lang; dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const L = NAV[lang ?? "en"];
  const tone = dark && !scrolled ? "text-[#f6ece2]" : "text-ink";
  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${scrolled ? "py-2.5" : "py-5"}`}>
        <div className={`mx-auto flex max-w-[1320px] items-center justify-between gap-3 rounded-full px-4 transition-all duration-700 md:px-6 ${scrolled ? "mx-3 border border-white/60 bg-[rgba(251,246,241,.72)] py-2 shadow-[0_18px_40px_-28px_rgba(74,20,36,.55)] backdrop-blur-xl md:mx-auto md:w-[min(1320px,calc(100%-2rem))]" : "py-1"} ${tone}`}>
          <Link href={lang && lang !== "en" ? `/?lang=${lang}` : "/"} aria-label={BRAND.name} className="shrink-0"><Wordmark size="text-[1.4rem] md:text-[1.7rem]" sealClass="hidden sm:block" /></Link>
          <div className="flex items-center gap-1 text-[13.5px] md:gap-7">
            <Link href="/templates" className="link-u hidden opacity-80 hover:opacity-100 sm:inline">{L.templates}</Link>
            <Link href="/pricing" className="link-u hidden opacity-80 hover:opacity-100 sm:inline">{L.pricing}</Link>
            <Link href="/partners" className="link-u hidden opacity-80 hover:opacity-100 md:inline">{L.vendors}</Link>
            {lang && (
              <div className="flex items-center rounded-full border border-current/15 p-0.5 text-[10.5px] md:ml-1 md:text-[11px]">
                {(["en", "ru", "hi"] as Lang[]).map((l) => (
                  <Link key={l} href={l === "en" ? "/" : `/?lang=${l}`} hrefLang={l} className={`rounded-full px-1.5 py-1 transition md:px-2 ${l === lang ? "bg-wine text-[#fbeee6]" : "opacity-60 hover:opacity-100"}`}>{l === "en" ? "EN" : l === "ru" ? "RU" : "हि"}</Link>
                ))}
              </div>
            )}
            <Link href={signedIn ? "/studio" : "/studio/new"} className={`btn ${dark && !scrolled ? "btn-light" : "btn-dark"} whitespace-nowrap !px-3.5 !py-2 !text-[12px] md:!px-4 md:!text-[12.5px]`}>{signedIn ? L.studio : cta}<span className="btn-arrow hidden md:inline">→</span></Link>
          </div>
        </div>
      </nav>
      <div aria-hidden className="h-[76px]" />
    </>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="noir relative z-10 overflow-hidden px-5 pb-10 pt-24 md:px-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="script text-3xl text-[#e8a3ab]">with love, from Goa</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f6ece2]/60">Invitations, celebration websites, video invitations and greetings — designed by conversation, in English, Русский and हिन्दी.</p>
          </div>
          <FootCol title="Make" links={[["/templates", "Templates"], ["/studio/new", "Begin free"], ["/pricing", "Pricing"]]} />
          <FootCol title="Occasions" links={[["/invitations/wedding-invitations", "Wedding invitations"], ["/invitations/russian-wedding-invitations", "Свадебные приглашения"], ["/invitations/birthday-invitations", "Birthday invitations"], ["/invitations/baby-shower-invitations", "Baby showers"]]} />
          <FootCol title="Circle" links={[["/partners", "Vendors & partners"], ["/auth/sign-in", "Sign in"]]} />
        </div>
        <div className="mt-20 select-none text-center">
          <p aria-hidden className="wordmark bg-gradient-to-b from-[#f6ece2]/30 to-transparent bg-clip-text text-[19vw] leading-[.8] text-transparent md:text-[15vw]">{BRAND.name.slice(0, -4)}<em>{BRAND.name.slice(-4)}</em></p>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[#f6ece2]/45">
          <span>© {year} {BRAND.name} · made in {BRAND.home}</span>
          <span>Free to design · pay once to publish</span>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="kicker text-[#c5a06a]">{title}</p>
      <ul className="mt-5 space-y-2.5 text-[15px]">
        {links.map(([h, l]) => <li key={h}><Link href={h} className="link-u text-[#f6ece2]/80 hover:text-[#f6ece2]">{l}</Link></li>)}
      </ul>
    </div>
  );
}
