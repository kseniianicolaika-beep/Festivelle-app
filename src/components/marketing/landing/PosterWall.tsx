"use client";
import Link from "next/link";
import { useState } from "react";
import type { TemplateDef } from "@/lib/catalog";
import { OCCASIONS } from "@/lib/occasions";
import { themeById } from "@/lib/themes";
import { LiveTemplate, useInView } from "../Live";

// A gallery wall of large posters. Each one plays its signature opening as it scrolls into view;
// hover replays it and lets the website peek out on a phone.
export function PosterWall({ list, hrefs, cols = "wall", empty = "New designs are being hand-finished — check back very soon.", peek = true }: { list: TemplateDef[]; hrefs?: Record<string, string>; cols?: "wall" | "grid" | "three"; empty?: string; peek?: boolean }) {
  if (!list.length) return <p className="py-16 text-center font-display text-2xl italic text-muted">{empty}</p>;
  const grid =
    cols === "wall" ? "grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-8 md:grid-cols-3 xl:grid-cols-4 md:[&>*:nth-child(3n+2)]:translate-y-20 xl:[&>*:nth-child(3n+2)]:translate-y-0 xl:[&>*:nth-child(4n+2)]:translate-y-20 xl:[&>*:nth-child(4n+4)]:translate-y-10"
    : cols === "three" ? "grid-cols-2 gap-x-4 gap-y-14 sm:gap-x-8 md:grid-cols-3"
    : "grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4";
  return (
    <div className={`grid ${grid} ${cols === "wall" ? "md:pb-20" : ""}`}>
      {list.map((t, i) => <Poster key={t.id} t={t} i={i} href={hrefs?.[t.id] ?? `/templates/${t.id}`} peek={peek} />)}
    </div>
  );
}

function Poster({ t, i, href, peek }: { t: TemplateDef; i: number; href: string; peek: boolean }) {
  const th = themeById(t.theme);
  const { ref, seen } = useInView<HTMLAnchorElement>("-6% 0px", true);
  const [hovered, setHovered] = useState(false);
  return (
    <Link ref={ref} href={href} onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)} className="group block">
      <div className={`reveal-clip relative ${seen ? "is-in" : ""}`} style={{ transitionDelay: `${(i % 4) * 90}ms` }}>
        <div className="relative overflow-hidden rounded-[6px] px-[11%] py-[12%] transition-[transform] duration-1000 ease-[var(--ease-expo)]" style={{ background: `radial-gradient(90% 70% at 50% 40%, ${th.gold}2a, transparent 70%), ${th.bg}` }}>
          <div className="poster poster-lift poster-shadow overflow-hidden rounded-[2px]">
            <LiveTemplate t={t} />
          </div>
          {peek && hovered && t.occasion !== "greeting" && (
            <div className="pointer-events-none absolute -bottom-[4%] right-[4%] hidden w-[36%] translate-y-2 opacity-0 transition-all duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 md:block">
              <LiveTemplate t={t} kind="website" play="mount" device="phone" replayOnHover={false} />
            </div>
          )}
          {t.tier === "luxury" && <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-[9px] uppercase tracking-[.28em] text-white backdrop-blur-md">Heirloom</span>}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <p className="display text-[1.35rem] leading-tight md:text-[1.6rem]">{t.name}</p>
        <span className="btn-arrow text-rose opacity-0 transition-opacity duration-500 group-hover:opacity-100">→</span>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-[.2em] text-muted">{OCCASIONS[t.occasion].name} · {t.styles.slice(0, 2).join(" · ")}</p>
    </Link>
  );
}
