"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { Corner, Plate, Rim, Sprig, Swash } from "./art";
import { GZHEL_LOOK } from "./look";
import { s, GzhelStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const cq = (n: number) => `${n}cqw`;
const INK = "#0f1f4d", COB = "#1c3f94", BRIGHT = "#2a5bd7", MUTED = "#5d6b8f";

/** Hairline cobalt double border with leafy corner sprays. */
function Frame({ land }: { land: boolean }) {
  const o = land ? 3 : 4;
  return (
    <div aria-hidden data-frame className="pointer-events-none absolute inset-0">
      <div className="absolute rounded-[3cqw] border-[0.45cqw] border-[#1c3f94]" style={{ inset: cq(o) }} />
      <div className="absolute rounded-[2.2cqw] border-[0.15cqw] border-[#1c3f94]/45" style={{ inset: cq(o + 1.4) }} />
      {(["", "-scale-x-100", "-scale-y-100", "-scale-100"] as const).map((t, i) => (
        <Corner key={i} className={`absolute ${t}`} style={{ width: cq(land ? 13 : 17), [i % 2 ? "right" : "left"]: cq(o + 0.6), [i > 1 ? "bottom" : "top"]: cq(o + 0.6) } as CSSProperties} />
      ))}
    </div>
  );
}

export default function GzhelCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const land = kind === "thankyou";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length);
  const both = `${c.a}${c.b ? ` & ${c.b}` : ""}`;

  useStage(ref, (g, q) => {
    g.timeline({ defaults: { ease: "power3.out" } })
      .from(q("[data-frame] > div"), { opacity: 0, scale: 1.03, duration: 1, stagger: 0.1 }, 0)
      .from(q("[data-ring],[data-band],[data-draw]"), { drawSVG: 0, duration: 1.2, stagger: 0.008, ease: "power1.inOut" }, 0.1)
      .from(q("[data-leaf]"), { scale: 0, transformOrigin: "0% 50%", duration: 0.5, stagger: 0.02, ease: "back.out(1.6)" }, 0.5)
      .from(q("[data-stroke]"), { scaleY: 0, transformOrigin: "50% 100%", opacity: 0, duration: 0.5, stagger: 0.05 }, 0.7)
      .from(q("[data-dot]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.004 }, 1.1)
      .from(q("[data-in]"), { opacity: 0, y: 12, duration: 0.9, stagger: 0.08 }, 0.5);
  }, [kind], animate);

  const names = (base: number, avail = 76) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.66);
    return (
      <div data-in className="w-full text-center leading-[0.95]" style={{ ...disp, color: INK }}>
        <E as="h2" path="profile.partner1" className="block" style={{ fontSize: cq(size) }}>{c.a}</E>
        {c.b && (
          <>
            <p className="italic" style={{ fontSize: cq(size * 0.45), color: BRIGHT, margin: `${cq(size * 0.06)} 0` }}>&amp;</p>
            <E as="h2" path="profile.partner2" className="block" style={{ fontSize: cq(size) }}>{c.b}</E>
          </>
        )}
      </div>
    );
  };
  const kick = (t: ReactNode, size = 2.1, path?: string) => path
    ? <E as="p" path={path} className="block font-semibold uppercase" style={{ fontSize: cq(size), letterSpacing: "0.34em", color: COB }}>{t}</E>
    : <p data-in className="font-semibold uppercase" style={{ fontSize: cq(size), letterSpacing: "0.34em", color: COB }}>{t}</p>;
  const swash = (w = 44) => <div data-in style={{ width: cq(w) }}><Swash className="w-full" /></div>;
  const dateLine = (size = 3.6) => dp && <p data-in style={{ ...disp, fontSize: cq(size), color: INK }}>{dp.full}</p>;
  const place = (size = 2.1) => (c.where || c.time) && (
    <p data-in className="uppercase" style={{ fontSize: cq(size), letterSpacing: "0.24em", color: MUTED, lineHeight: 1.6 }}>
      {c.time && <>{c.time} · </>}{c.venue && kind !== "save" ? <E path="profile.venue">{c.where}</E> : c.where}
      {c.venue && c.city && kind !== "save" && kind !== "event" ? ` · ${c.city}` : ""}
    </p>
  );
  const footer = (size = 3.6) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block italic" style={{ ...disp, fontSize: cq(size), color: BRIGHT }}>{c.footer}</E>;
  const sprig = (w: number) => <div data-in style={{ width: cq(w) }}><Sprig className="w-full" /></div>;
  const col = (gap: number, children: ReactNode) => <div className="relative flex h-full flex-col items-center justify-center text-center" style={{ gap: cq(gap) }}>{children}</div>;
  const plateWith = (w: number, inner: ReactNode, photo = false) => (
    <div data-in className="relative" style={{ width: cq(w), filter: "drop-shadow(0 2cqw 2.4cqw rgba(17,40,106,.18))" }}>
      <Rim className="w-full" />
      <div className="absolute inset-[15.5%] grid place-items-center overflow-hidden rounded-full">
        {photo && photoUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img data-edit-photo="photo" src={photoUrl} alt="" className="h-full w-full object-cover" />
          : inner}
      </div>
    </div>
  );

  let body: ReactNode;
  switch (kind) {
    case "save":
      body = col(3, <>
        {kick(c.eyebrow, 2.6, "texts.eyebrow")}
        {plateWith(66, dp && (
          <div className="flex flex-col items-center" style={{ color: INK }}>
            <span style={{ ...disp, fontSize: cq(17), lineHeight: 0.85, color: COB }}>{dp.day}</span>
            <span style={{ ...disp, fontSize: cq(4.4) }}>{dp.month}</span>
            <span className="font-semibold" style={{ fontSize: cq(2.4), letterSpacing: "0.4em", color: MUTED }}>{dp.year}</span>
          </div>
        ))}
        {names(8)}
        {place(2.2)}
        <p data-in className="italic" style={{ fontSize: cq(2.3), color: MUTED }}>{c.sub}</p>
      </>);
      break;
    case "event":
      body = col(2.6, <>
        {sprig(44)}
        {names(6)}
        <p data-in style={{ fontSize: cq(2.6), color: MUTED }}>{c.lead}</p>
        <E as="h3" path="texts.headline" className="block leading-[1.02]" style={{ ...disp, fontSize: cq(fit(c.headline, 10, 74, 0.6)), color: COB }}>{c.headline}</E>
        {swash(40)}
        {dateLine(3.6)}
        {place(2.1)}
      </>);
      break;
    case "story":
      body = col(4, <>
        {kick(c.eyebrow, 2.8, "texts.eyebrow")}
        {photoUrl ? plateWith(76, null, true) : <div data-in style={{ width: cq(76) }}><Plate className="w-full" /></div>}
        {names(13)}
        {swash(52)}
        {dateLine(5)}
        {place(2.8)}
      </>);
      break;
    case "post":
      body = col(2.2, <>
        {kick(c.eyebrow, 2.3, "texts.eyebrow")}
        {plateWith(70, <div className="w-full px-[4%]">{names(8.4, 46)}</div>)}
        {dateLine(3.4)}
      </>);
      break;
    case "welcome":
      body = col(3, <>
        {sprig(58)}
        {kick(c.eyebrow, 2.3, "texts.eyebrow")}
        {names(12)}
        {swash(50)}
        {dateLine(4.4)}
        {footer(4)}
      </>);
      break;
    case "program":
    case "menu": {
      const menu = kind === "menu";
      body = col(menu ? 3.6 : 2.4, <>
        {sprig(menu ? 56 : 40)}
        <E as="h3" path="texts.headline" className="block leading-none" style={{ ...disp, fontSize: cq(fit(c.headline, menu ? 12 : 8, 72, 0.6)), color: INK }}>{c.headline}</E>
        <p data-in className="italic" style={{ ...disp, fontSize: cq(menu ? 4.4 : 3.2), color: BRIGHT }}>{both}</p>
        <div data-in className={s.rule} style={{ width: cq(60) }} />
        <ol className="flex w-full flex-col" style={{ gap: cq(menu ? 5 : 2.8) }}>
          {c.items.map((it, i) => (
            <li data-in key={i} className={menu ? "text-center" : "text-left"}>
              {menu ? (
                <E as="p" path={`items.${i}.title`} className="block" style={{ ...disp, fontSize: cq(5.2), color: COB }}>{it.title}</E>
              ) : (
                <div className="flex items-baseline" style={{ gap: cq(2) }}>
                  <span style={{ ...disp, fontSize: cq(3.2), color: BRIGHT }}>{String(i + 1).padStart(2, "0")}</span>
                  <E as="span" path={`items.${i}.title`} style={{ ...disp, fontSize: cq(4), color: INK }}>{it.title}</E>
                  <span className={s.leader} />
                </div>
              )}
              {it.detail && <E as="p" path={`items.${i}.detail`} className="block leading-snug" style={{ fontSize: cq(menu ? 3.2 : 2.5), color: MUTED, marginTop: cq(0.8), paddingLeft: menu ? 0 : cq(6) }}>{it.detail}</E>}
            </li>
          ))}
        </ol>
        {dateLine(menu ? 3.8 : 2.8)}
      </>);
      break;
    }
    case "table":
      body = col(2, <>
        {plateWith(74, (
          <div className="flex flex-col items-center">
            <E as="p" path="texts.headline" className="block font-semibold uppercase" style={{ fontSize: cq(2.8), letterSpacing: "0.4em", color: MUTED, paddingLeft: "0.4em" }}>{c.headline}</E>
            <span style={{ ...disp, fontSize: cq(24), lineHeight: 0.95, color: COB }}>{c.number}</span>
          </div>
        ))}
        <p data-in className="italic" style={{ ...disp, fontSize: cq(4.6), color: INK }}>{both}</p>
      </>);
      break;
    case "hashtag":
      body = col(3, <>
        {photoUrl ? plateWith(60, null, true) : sprig(60)}
        <E as="p" path="texts.body" className="block font-semibold uppercase" style={{ fontSize: cq(2.4), letterSpacing: "0.3em", color: MUTED, maxWidth: cq(70), lineHeight: 1.7 }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all leading-tight" style={{ ...disp, fontSize: cq(fit(c.hashtag, 9, 76, 0.56)), color: COB }}>{c.hashtag}</E>
        {swash(44)}
        <p data-in className="italic" style={{ ...disp, fontSize: cq(4), color: INK }}>{both}</p>
      </>);
      break;
    case "thankyou":
      body = (
        <div className="relative grid h-full grid-cols-[0.9fr_1.1fr] items-center" style={{ gap: cq(4) }}>
          <div className="flex justify-center">{photoUrl ? plateWith(36, null, true) : <div data-in style={{ width: cq(36) }}><Plate className="w-full" /></div>}</div>
          <div className="flex flex-col items-start text-left" style={{ gap: cq(1.6) }}>
            <E as="h3" path="texts.headline" className="block leading-[0.95]" style={{ ...disp, fontSize: cq(fit(c.headline, 10, 44, 0.6)), color: COB }}>{c.headline}</E>
            {swash(30)}
            <E as="p" multiline path="texts.body" className="block leading-snug" style={{ fontSize: cq(2.3), color: MUTED }}>{c.body}</E>
            <p data-in className="italic" style={{ ...disp, fontSize: cq(3.6), color: INK }}>{both}</p>
          </div>
        </div>
      );
      break;
    case "greeting":
      body = col(2.8, <>
        {sprig(50)}
        {kick(c.eyebrow, 2.2, "texts.eyebrow")}
        {names(10)}
        {swash(44)}
        {c.body && <E as="p" multiline path="texts.body" className="block leading-relaxed" style={{ fontSize: cq(2.9), color: "#24325a", maxWidth: cq(68) }}>{c.body}</E>}
        {footer(4)}
      </>);
      break;
    default: // invite
      body = col(2.4, <>
        {sprig(50)}
        {kick(c.eyebrow, 2.1, "texts.eyebrow")}
        <E as="p" multiline path="profile.inviteLine" className="block leading-[1.55]" style={{ fontSize: cq(2.7), color: MUTED, maxWidth: cq(66) }}>{c.lead}</E>
        {names(10)}
        {swash(46)}
        {dp && <p data-in className="font-semibold uppercase" style={{ fontSize: cq(2), letterSpacing: "0.38em", color: MUTED }}>{dp.weekday}</p>}
        {dateLine(4.4)}
        {place(2.1)}
        {footer(3.6)}
      </>);
  }

  const pad = land ? `${cq(7)} ${cq(9)}` : kind === "story" || kind === "menu" ? `${cq(15)} ${cq(11)}` : `${cq(12)} ${cq(11)}`;
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${s.glaze} ${animate ? "" : s.still} ${className}`} style={lookStyle(GZHEL_LOOK, design, "gzhel-garden")}>
      <GzhelStyles />
      <Frame land={land} />
      <div className="absolute inset-0" style={{ padding: pad }}>{body}</div>
    </CardShell>
  );
}
