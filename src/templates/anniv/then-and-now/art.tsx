"use client";
import { useId, type CSSProperties, type ReactNode } from "react";
import { Photo } from "../_shared/kit";

/** SVG filters used by this template: deckled print edges, vintage developing. Render once per root. */
export function TnFilters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="tn-deckle" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

/** A photographic print. `era="then"` = sepia, deckled border, orange date-stamp; `now` = clean colour with tape. */
export function Print({ src, era, stamp, label, slot = "hero", galleryKey, className = "", style, tilt = 0, fallback, imgClass = "" }: { src?: string | null; era: "then" | "now"; stamp?: string; label?: ReactNode; slot?: "hero" | "photo" | "gallery"; galleryKey?: string; className?: string; style?: CSSProperties; tilt?: number; fallback?: ReactNode; imgClass?: string }) {
  const then = era === "then";
  return (
    <figure className={`relative ${className}`} style={{ transform: `rotate(${tilt}deg)`, ...style }}>
      <div aria-hidden className="absolute inset-0 shadow-[0_30px_50px_-25px_rgba(60,35,20,.55)]" style={{ background: then ? "#f3e9d6" : "#fffdf8", filter: then ? "url(#tn-deckle)" : undefined }} />
      <div className={`relative ${then ? "p-[7%] pb-[18%]" : "p-[5%] pb-[16%]"}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-[#d9cbb4]">
          <Photo src={src} slot={slot} galleryKey={galleryKey} className={`h-full w-full object-cover ${then ? "tn-sepia" : ""} ${imgClass}`} fallback={fallback} />
          {then && <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_45%,rgba(70,40,15,.45))] mix-blend-multiply" />}
          {then && stamp && <span className="tn-stamp absolute bottom-[4%] right-[5%]">{stamp}</span>}
        </div>
        {label && <figcaption className="absolute inset-x-0 bottom-[3%] text-center">{label}</figcaption>}
      </div>
      {!then && <>
        <span aria-hidden className="absolute -top-3 left-[12%] h-7 w-20 -rotate-[8deg] bg-[#efe4cf]/80 shadow-sm backdrop-blur-[1px]" />
        <span aria-hidden className="absolute -top-3 right-[10%] h-7 w-16 rotate-[10deg] bg-[#efe4cf]/80 shadow-sm" />
      </>}
    </figure>
  );
}

/** A red silk ribbon that loops between the two frames. */
export function Ribbon({ className = "", d = "M10 120 C 120 20, 200 200, 300 110 S 470 30, 520 150 S 640 220, 700 90 C 730 40, 690 20, 670 60 C 650 100, 720 120, 790 80", animate = true }: { className?: string; d?: string; animate?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 800 220" className={className} aria-hidden fill="none" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8f1f2e" /><stop offset=".3" stopColor="#cf4a5a" /><stop offset=".55" stopColor="#9b2433" /><stop offset=".8" stopColor="#d65a69" /><stop offset="1" stopColor="#8f1f2e" /></linearGradient>
      </defs>
      <path d={d} stroke="#5a0f18" strokeOpacity=".25" strokeWidth="7" transform="translate(2 5)" pathLength={1} className={animate ? "tn-ribbon" : ""} style={{ strokeDasharray: 1 }} vectorEffect="non-scaling-stroke" />
      <path d={d} stroke={`url(#${id}-r)`} strokeWidth="5" strokeLinecap="round" pathLength={1} className={animate ? "tn-ribbon" : ""} style={{ strokeDasharray: 1 }} vectorEffect="non-scaling-stroke" />
      <path d={d} stroke="#ffd3d8" strokeOpacity=".5" strokeWidth="1.2" pathLength={1} className={animate ? "tn-ribbon" : ""} style={{ strokeDasharray: 1 }} vectorEffect="non-scaling-stroke" transform="translate(0 -1.5)" />
    </svg>
  );
}

/** Odometer: each digit rolls from the wedding year to this year (CSS only, SSR-safe, final state static). */
export function Odometer({ from, to, className = "", delay = 0.8, animate = true }: { from?: number; to?: number; className?: string; delay?: number; animate?: boolean }) {
  if (!to) return null;
  const t = String(to).padStart(2, "0"), f = String(from ?? to).padStart(t.length, "0");
  return (
    <span className={`inline-flex overflow-hidden leading-none ${className}`} style={{ height: "1em" }} aria-label={t}>
      {t.split("").map((d, i) => {
        const a = +f[i], b = +d;
        const loops = a === b ? 0 : 1;
        const end = b + (b < a || loops ? 10 : 0) * (a === b ? 0 : 1);
        return (
          <span key={i} aria-hidden className="relative block" style={{ width: "0.6em" }}>
            <span className={`absolute left-0 top-0 flex flex-col ${animate && a !== b ? "tn-roll" : ""}`} style={{ "--from": a, "--to": end, transform: `translateY(${-end}em)`, animationDelay: `${delay + i * 0.18}s` } as CSSProperties}>
              {Array.from({ length: 20 }, (_, k) => <span key={k} className="block h-[1em] text-center">{k % 10}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Postage stamp + postmark (venue section / cards). */
export function Postmark({ city = "", date = "", className = "" }: { city?: string; date?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden>
      <defs><path id={`${id}-c`} d="M40 60 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
      <g fill="none" stroke="#8c2a35" strokeOpacity=".75">
        <circle cx="80" cy="60" r="44" strokeWidth="1.6" /><circle cx="80" cy="60" r="30" strokeWidth=".8" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M128 ${36 + i * 12} q 9 -6 18 0 t 18 0 t 18 0`} strokeWidth="1.4" />)}
      </g>
      <text fill="#8c2a35" fillOpacity=".8" fontSize="9" letterSpacing="2" style={{ fontFamily: "var(--a-label)", textTransform: "uppercase" }}><textPath href={`#${id}-c`}>{city.slice(0, 22)} ✶ {city.slice(0, 10)} ✶</textPath></text>
      <text x="80" y="64" textAnchor="middle" fill="#8c2a35" fillOpacity=".85" fontSize="9.5" style={{ fontFamily: "var(--a-label)" }}>{date}</text>
    </svg>
  );
}
