"use client";
import { useRef, useState } from "react";
import type { SiteProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { nameParts } from "@/lib/occasions";
import { F } from "../../celebrate/_shared/fonts";
import { gsap, burst } from "../../celebrate/_shared/motion";
import { HolidaySite, type Skin } from "../_shared/HolidaySite";
import { hwords, festOf, fmt, langOf } from "../_shared/words";
import { Cloud, Thali, Matki, HOLI, GL_CSS } from "./art";

const Ornament = ({ className, style }: { className?: string; style?: React.CSSProperties }) => <Matki className={className} style={style} />;

export const GL_SKIN: Skin = {
  id: "gulaal", fest: "holi",
  vars: { "--t-bg": "#fffaf3", "--t-surface": "#ffffff", "--t-ink": "#3a1a3a", "--t-muted": "#80607a", "--t-accent": "#e8337f", "--t-gold": "#e07a12" },
  css: GL_CSS, cssHref: "hol-gl", rootClass: "gl-paper",
  display: F.brico, script: F.caveat, body: F.tenor, foil: "gl-ink",
  panel: "rgba(255,255,255,.92)", line: "rgba(232,51,127,.25)", onGold: "#ffffff",
  Ornament,
};
const COLS = Object.values(HOLI);
const TAP = { en: "Tap anywhere to throw colour", ru: "Нажмите, чтобы бросить краски", hi: "रंग उड़ाने के लिए कहीं भी छुएँ" };

export default function Site(props: SiteProps) {
  const { profile, compact } = props;
  const root = useRef<HTMLDivElement>(null);
  const throws = useRef(0);
  const [thrown, setThrown] = useState(false);
  const [name] = nameParts(profile);
  const L = hwords(profile);
  const f = festOf(profile, "holi");

  const toss = (e: React.MouseEvent<HTMLElement>) => {
    const host = root.current;
    if (!host || compact) return;
    if ((e.target as HTMLElement).closest("[data-edit-path],a,button:not([data-throw-zone])")) return;
    setThrown(true);
    const hb = host.getBoundingClientRect();
    const x = e.clientX - hb.left, y = e.clientY - hb.top;
    const k = throws.current++ % 5;
    burst(host, x, y, { colors: [COLS[k], COLS[(k + 2) % COLS.length], "#ffffff"], n: 70, shapes: ["circle"], velocity: [200, 620], gravity: 160, size: 12, life: 2.2 });
    const cloud = host.querySelectorAll<HTMLElement>("[data-throw]")[k];
    if (cloud) {
      cloud.style.left = `${x}px`;
      cloud.style.top = `${y - (host.querySelector("header")?.offsetTop ?? 0)}px`;
      gsap.fromTo(cloud, { scale: 0.1, opacity: 0.95 }, { scale: 1.6, opacity: 0, duration: 2.6, ease: "power2.out" });
    }
  };

  const hero = (
    <header onClick={toss} className={`relative flex flex-col items-center overflow-hidden px-5 text-center ${compact ? "min-h-[720px] pb-12 pt-14" : "min-h-[100svh] cursor-crosshair justify-center pb-14 pt-16"}`}>
      <Cloud color={HOLI.pink} seed={2} className="gl-drift pointer-events-none absolute -left-[12%] -top-[10%] w-[min(60vw,460px)]" />
      <Cloud color={HOLI.yellow} seed={5} className="gl-drift pointer-events-none absolute -right-[14%] top-[2%] w-[min(54vw,420px)] [animation-delay:2s]" />
      <Cloud color={HOLI.green} seed={7} className="gl-drift pointer-events-none absolute -bottom-[14%] -left-[10%] w-[min(50vw,380px)] [animation-delay:4s]" />
      <Cloud color={HOLI.blue} seed={9} className="gl-drift pointer-events-none absolute -bottom-[12%] -right-[12%] w-[min(56vw,420px)] [animation-delay:1s]" />
      {COLS.slice(0, 5).map((c, i) => <div key={i} data-throw className="pointer-events-none absolute z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-0" style={{ left: 0, top: 0 }}><Cloud color={c} seed={11 + i} className="h-full w-full" /></div>)}

      <p data-hero-in className="relative z-10 rounded-full bg-white/70 px-4 py-1 text-[11px] uppercase tracking-[0.5em] text-[var(--t-muted)]">{L.invited}</p>
      <h1 className={`gl-ink relative z-10 mt-2 font-extrabold leading-[0.9] tracking-tight ${compact ? "text-[96px]" : "text-[clamp(6rem,20vw,15rem)]"}`} style={{ fontFamily: F.brico }}>{f.name}</h1>
      <p data-hero-in className={`relative z-10 -mt-2 text-[var(--t-accent)] ${compact ? "text-4xl" : "text-[2.6rem] md:text-6xl"}`} style={{ fontFamily: F.caveat }}>{L.hosted}</p>
      <h2 data-hero-in className={`relative z-10 font-bold leading-tight ${compact ? "text-4xl" : "text-[clamp(2.2rem,5vw,3.6rem)]"}`} style={{ fontFamily: F.brico }}><E path="profile.partner1">{name}</E></h2>
      <Thali className={`relative z-10 mt-6 ${compact ? "w-[240px]" : "w-[min(78vw,380px)]"}`} />
      {!compact && <p data-hero-in className="relative z-10 mt-2 text-base text-[var(--t-muted)]" style={{ fontFamily: F.caveat }}>{thrown ? `${f.wish}!` : TAP[langOf(profile)]}</p>}
      <div data-hero-in className="relative z-10 mt-5 flex items-center gap-4 text-[var(--t-gold)]"><span className="h-[3px] w-10 rounded bg-[#e8337f]" /><p className="text-2xl font-semibold text-[var(--t-ink)]" style={{ fontFamily: F.brico }}>{fmt(profile)}</p><span className="h-[3px] w-10 rounded bg-[#2fae4e]" /></div>
      {(profile.venue || profile.city) && <E as="p" path={profile.venue ? "profile.venue" : "profile.city"} className="relative z-10 mt-2 block text-[11px] uppercase tracking-[0.4em] text-[var(--t-muted)]">{[profile.venue, profile.city].filter(Boolean).join(" · ")}</E>}
    </header>
  );

  return (
    <HolidaySite
      skin={GL_SKIN}
      props={props}
      rootRef={root}
      hero={hero}
      footerArt={<Thali className="mx-auto w-44" />}
      intro={({ q, el }) => {
        gsap.timeline()
          .from(q(".gl-drift"), { scale: 0.2, opacity: 0, duration: 1.6, stagger: 0.15, ease: "expo.out" })
          .from(q("h1"), { scale: 0.7, opacity: 0, duration: 1.2, ease: "back.out(1.8)" }, "<.3")
          .from(q("[data-hero-in]"), { y: 22, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "<.2")
          .add(() => {
            const h1 = el.querySelector("h1");
            if (!h1) return;
            const hb = el.getBoundingClientRect(), r = h1.getBoundingClientRect();
            burst(el, r.left - hb.left + r.width / 2, r.top - hb.top + r.height / 2, { colors: COLS, n: 90, shapes: ["circle"], velocity: [250, 700], gravity: 200, size: 10, life: 2.4 });
          }, "<");
      }}
    />
  );
}
