"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fibres, fit, grain, lookStyle, ratioOf, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { ArchLine, Lotus, Mandap, Rushnyk } from "./art";
import { LOTUS_LOOK } from "./look";
import { s, LotusStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };
const body: CSSProperties = { fontFamily: "var(--wbody)" };
const PLUM = "#3d1530";
const cq = (n: number) => `${n}cqw`;

export default function LotusCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const ratio = ratioOf(kind);
  const land = kind === "thankyou";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length);
  const hi = c.lang === "hi";

  useStage(ref, (g, q) => {
    g.timeline({ defaults: { ease: "power3.out" } })
      .from(q("[data-arch] [data-draw]"), { drawSVG: 0, duration: 1.8, ease: "power2.inOut" }, 0)
      .from(q("[data-petal]"), { scale: 0, transformOrigin: "50% 100%", duration: 1, stagger: 0.05, ease: "back.out(1.6)" }, 0.3)
      .from(q("[data-in]"), { opacity: 0, y: 12, filter: "blur(4px)", duration: 1, stagger: 0.08 }, 0.5);
  }, [kind], animate);

  // Arch geometry: box inside the frame; the spring line sits ~0.6 widths below the apex.
  const archInset = land ? 0 : 9;
  const archW = 100 - archInset * 2;
  const archTop = land ? 0 : 11;
  const archH = ratio * 100 - archTop - 12;
  const spring = Math.min(0.46, (archW * 0.55) / archH);
  const contentTop = archTop + archH * spring * 0.62;

  const names = (base: number, avail = 66) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.62);
    return (
      <div data-in className="w-full text-center">
        <E as="h2" path="profile.partner1" className="block leading-[1.08]" style={{ ...disp, fontSize: cq(size), color: PLUM }}>{c.a}</E>
        {c.b && (
          <>
            <p className="leading-none text-[#b8546f]" style={{ ...scr, fontSize: cq(size * 0.85), margin: `${cq(size * -0.05)} 0 ${cq(size * 0.02)}` }}>&amp;</p>
            <E as="h2" path="profile.partner2" className="block leading-[1.08]" style={{ ...disp, fontSize: cq(size), color: PLUM }}>{c.b}</E>
          </>
        )}
      </div>
    );
  };
  const eyebrow = (size = 2.2) => c.eyebrow && (
    <E as="p" path="texts.eyebrow" className={`block text-[#b8546f] ${hi ? "" : "uppercase"}`} style={{ ...body, fontWeight: 600, fontSize: cq(size), letterSpacing: hi ? "0.02em" : "0.32em" }}>{c.eyebrow}</E>
  );
  const date = (size = 3.4) => dp && (
    <p data-in className="flex items-center justify-center" style={{ ...body, fontWeight: 500, fontSize: cq(size), gap: cq(1.6), color: PLUM }}>
      <span>{dp.day}</span><span className="text-[#c9a265]">✦</span><span>{dp.month}</span><span className="text-[#c9a265]">✦</span><span>{dp.year}</span>
    </p>
  );
  const place = (size = 2.8) => (c.where || c.time) && (
    <p data-in className="italic text-[#8b6075]" style={{ ...body, fontSize: cq(size), lineHeight: 1.4 }}>{[c.time, c.where].filter(Boolean).join(" · ")}{c.city && c.venue && kind !== "save" && kind !== "event" ? `, ${c.city}` : ""}</p>
  );
  const footer = (size = 4.4) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block text-[#b8546f]" style={{ ...scr, fontSize: cq(size) }}>{c.footer}</E>;
  const rule = (w = 30) => <div data-in className="flex items-center justify-center" style={{ gap: cq(1.5) }}><span className="h-px bg-[#c9a265]" style={{ width: cq(w / 2) }} /><span className="text-[#c9a265]" style={{ fontSize: cq(2.2) }}>✦</span><span className="h-px bg-[#c9a265]" style={{ width: cq(w / 2) }} /></div>;
  const gap = (n: number) => ({ gap: cq(n) });
  const col = "flex h-full flex-col items-center justify-center text-center";

  let content: ReactNode;
  switch (kind) {
    case "save":
      content = (
        <div className={col} style={gap(2.4)}>
          {eyebrow(2.4)}
          {dp && (
            <div data-in className="leading-none">
              <p className={s.foil} style={{ ...disp, fontSize: cq(20) }}>{dp.day}</p>
              <p style={{ ...disp, fontSize: cq(5), color: PLUM }}>{dp.month} {dp.year}</p>
            </div>
          )}
          {rule(34)}
          {names(7.6)}
          {place(2.8)}
          <p data-in className="italic text-[#8b6075]" style={{ ...body, fontSize: cq(2.6) }}>{c.sub}</p>
        </div>
      );
      break;
    case "event":
      content = (
        <div className={col} style={gap(2.4)}>
          <p data-in className="text-[#8b6075]" style={{ ...body, fontSize: cq(3) }}>{c.a}{c.b ? ` & ${c.b}` : ""} {c.lead}</p>
          <E as="h3" path="texts.headline" className={`${s.foil} block leading-tight`} style={{ ...disp, fontSize: cq(fit(c.headline, 9.5, 66, 0.6)) }}>{c.headline}</E>
          {rule(36)}
          {date(3.4)}
          {place(2.9)}
        </div>
      );
      break;
    case "program":
    case "menu":
      content = (
        <div className={col} style={gap(kind === "menu" ? 4 : 2.4)}>
          <E as="h3" path="texts.headline" className={`${s.foil} block leading-tight`} style={{ ...disp, fontSize: cq(fit(c.headline, kind === "menu" ? 10 : 7, 64, 0.6)) }}>{c.headline}</E>
          <p data-in className="text-[#b8546f]" style={{ ...scr, fontSize: cq(kind === "menu" ? 6 : 4.4) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
          {rule(30)}
          <ol className="flex w-full flex-col items-center" style={gap(kind === "menu" ? 5 : 2.4)}>
            {c.items.map((it, i) => (
              <li data-in key={i} className="flex flex-col items-center">
                {kind === "program" && <span className={s.foil} style={{ ...disp, fontSize: cq(3) }}>{i + 1}</span>}
                <E as="span" path={`items.${i}.title`} className="block" style={{ ...disp, color: PLUM, fontSize: cq(kind === "menu" ? 5.4 : 4) }}>{it.title}</E>
                {it.detail && <E as="span" path={`items.${i}.detail`} className="block max-w-[64cqw] italic leading-snug text-[#8b6075]" style={{ ...body, fontSize: cq(kind === "menu" ? 4 : 2.9) }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
        </div>
      );
      break;
    case "table":
      content = (
        <div className={col} style={gap(1)}>
          <E as="p" path="texts.headline" className="block text-[#b8546f]" style={{ ...body, fontWeight: 600, fontSize: cq(3.2), letterSpacing: hi ? 0 : "0.4em", textTransform: hi ? "none" : "uppercase" }}>{c.headline}</E>
          <p data-in className={`${s.foil} leading-none`} style={{ ...disp, fontSize: cq(26) }}>{c.number}</p>
          <p data-in className="text-[#b8546f]" style={{ ...scr, fontSize: cq(5.4) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "hashtag":
      content = (
        <div className={col} style={gap(3)}>
          <E as="p" path="texts.body" className="block italic text-[#8b6075]" style={{ ...body, fontSize: cq(3.6), maxWidth: cq(64) }}>{c.body}</E>
          <E as="p" path="texts.hashtag" className={`${s.foil} block break-words leading-tight`} style={{ ...disp, fontSize: cq(fit(c.hashtag, 8, 68, 0.6)) }}>{c.hashtag}</E>
          {rule(32)}
          <p data-in className="text-[#b8546f]" style={{ ...scr, fontSize: cq(5.4) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "thankyou":
      content = (
        <div className="flex h-full flex-col items-center justify-center text-center" style={gap(1.8)}>
          <E as="h3" path="texts.headline" className={`${s.foil} block leading-none`} style={{ ...disp, fontSize: cq(fit(c.headline, 8.4, 50, 0.6)) }}>{c.headline}</E>
          {rule(26)}
          <E as="p" multiline path="texts.body" className="block italic leading-snug text-[#5b3a4b]" style={{ ...body, fontSize: cq(2.8), maxWidth: cq(46) }}>{c.body}</E>
          <p data-in className="text-[#b8546f]" style={{ ...scr, fontSize: cq(4.6) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "greeting":
      content = (
        <div className={col} style={gap(2.4)}>
          {eyebrow(2.2)}
          {names(9)}
          {rule(30)}
          {c.body && <E as="p" multiline path="texts.body" className="block italic leading-relaxed text-[#5b3a4b]" style={{ ...body, fontSize: cq(3.2), maxWidth: cq(62) }}>{c.body}</E>}
          {footer(4.6)}
        </div>
      );
      break;
    case "story":
      content = (
        <div className={col} style={gap(3)}>
          {eyebrow(2.8)}
          {names(12)}
          {rule(40)}
          {date(4.2)}
          {place(3.4)}
          <div data-in className="w-[58cqw]"><Mandap /></div>
        </div>
      );
      break;
    case "post":
    case "welcome":
      content = (
        <div className={col} style={gap(kind === "post" ? 1.8 : 2.8)}>
          {eyebrow(kind === "post" ? 2 : 2.4)}
          {names(kind === "post" ? 7.6 : 11)}
          {rule(30)}
          {date(kind === "post" ? 2.8 : 3.6)}
          {kind === "welcome" && place(3)}
          {kind === "welcome" && footer(4.6)}
        </div>
      );
      break;
    default: // invite
      content = (
        <div className={col} style={gap(2.1)}>
          {eyebrow(2.1)}
          <E as="p" multiline path="profile.inviteLine" className="block italic leading-[1.45] text-[#5b3a4b]" style={{ ...body, fontSize: cq(3.1), maxWidth: cq(60) }}>{c.lead}</E>
          {names(8.6)}
          {rule(30)}
          {dp && <p data-in className="text-[#8b6075]" style={{ ...body, fontSize: cq(2.8) }}>{dp.weekday}</p>}
          {date(3.4)}
          {place(2.8)}
          {footer(4)}
        </div>
      );
  }

  const photoInArch = kind === "post" && photoUrl;
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${animate ? "" : s.still} ${className}`} style={{ ...lookStyle(LOTUS_LOOK, design, "lotus-vows") }}>
      <LotusStyles />
      <div aria-hidden className={`${s.silk} absolute inset-0`} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: fibres(0.1) }} />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ backgroundImage: grain(0.14), opacity: 0.6 }} />
      <div aria-hidden className="absolute border border-[#c9a265]/80" style={{ inset: cq(3) }} />
      <div aria-hidden className="absolute border border-[#c9a265]/40" style={{ inset: cq(4.2) }} />
      {land ? (
        <>
          <div data-arch className="absolute" style={{ left: cq(8), top: cq(10), bottom: cq(12), width: cq(30) }}>
            <ArchLine W={300} H={420} spring={0.5} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-x-[10%] bottom-[8%]"><Lotus /></div>
          </div>
          <div className="absolute" style={{ left: cq(42), right: cq(7), top: cq(8), bottom: cq(14) }}>{content}</div>
          <div className="absolute inset-x-0" style={{ bottom: cq(5.6), padding: `0 ${cq(6)}` }}><Rushnyk h={22} className="opacity-80" /></div>
        </>
      ) : (
        <>
          <div data-arch className="absolute" style={{ left: cq(archInset), right: cq(archInset), top: cq(archTop - 4), bottom: cq(12) }}>
            {photoInArch && (
              // eslint-disable-next-line @next/next/no-img-element
              <img data-edit-photo="photo" src={photoUrl!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            )}
            <ArchLine W={400} H={(400 * archH) / archW} spring={spring} className="absolute inset-0 h-full w-full" />
          </div>
          <div aria-hidden className="absolute left-1/2 -translate-x-1/2" style={{ bottom: cq(8.4), width: cq(26) }}><Lotus /></div>
          <div className="absolute inset-x-0" style={{ bottom: cq(5.4), padding: `0 ${cq(5.6)}` }}><Rushnyk h={22} className="opacity-70" /></div>
          <div className="absolute" style={{ left: cq(archInset + 6), right: cq(archInset + 6), top: cq(contentTop), bottom: cq(kind === "post" || kind === "table" ? 24 : 26) }}>{content}</div>
        </>
      )}
    </CardShell>
  );
}
