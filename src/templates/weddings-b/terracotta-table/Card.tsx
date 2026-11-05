"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fit, lookStyle, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { Pampas, Scene } from "./art";
import { TERRA_LOOK } from "./look";
import { s, TerraStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const cq = (n: number) => `${n}cqw`;

export default function TerracottaCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const pair = `${c.a}${c.b ? ` & ${c.b}` : ""}`;

  useStage(ref, (g, q) => {
    q("[data-plume]").forEach((el, i) => g.fromTo(el, { rotation: -1.5 }, { rotation: 1.8, svgOrigin: (el as SVGGElement).dataset.o, duration: 3 + (i % 4) * 0.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: -i * 0.5 }));
    g.to(q("[data-flame]"), { scaleY: 0.8, opacity: 0.75, transformOrigin: "50% 100%", duration: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: { each: 0.1, from: "random" } });
    g.timeline({ defaults: { ease: "power3.out" } })
      .from(q("[data-win]"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut" }, 0)
      .from(q("[data-sun]"), { y: 80, duration: 2.6, ease: "power2.out" }, 0.2)
      .from(q("[data-in]"), { opacity: 0, y: 12, filter: "blur(6px)", duration: 1.2, stagger: 0.1 }, 0.6);
  }, [kind], animate);

  /** The painted arch window — a sunset garden, or the couple's photo for story pieces. */
  const win = (w: number, h: number, children?: ReactNode, photo = false) => (
    <div className="relative shrink-0" style={{ width: cq(w), height: cq(h) }}>
      <div aria-hidden className={`${s.arch} absolute border border-[var(--t-accent)]/45`} style={{ inset: cq(-1.6) }} />
      <div data-win className={`${s.arch} absolute inset-0 overflow-hidden bg-[#e8c3a3]`}>
        {photo && photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img data-edit-photo="photo" src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: "sepia(.15)" }} />
        ) : <Scene className="absolute inset-0 h-full w-full" />}
        {children}
      </div>
    </div>
  );
  const names = (base: number, avail = 82, oneLine = true) => {
    const size = fit(oneLine ? pair : c.a.length > (c.b || "").length ? c.a : c.b || c.a, base * scale, avail, 0.42);
    return (
      <h2 data-in className="flex flex-wrap items-baseline justify-center font-extralight italic leading-[1] text-[#4a2214]" style={{ ...disp, fontSize: cq(size), columnGap: "0.25em", flexDirection: oneLine ? "row" : "column", alignItems: "center" }}>
        <E path="profile.partner1">{c.a}</E>
        {c.b && <><span className="text-[0.62em] text-[var(--t-accent)]">&amp;</span><E path="profile.partner2">{c.b}</E></>}
      </h2>
    );
  };
  const Lb = ({ children, size = 1.9, path, color = "var(--t-accent)" }: { children: ReactNode; size?: number; path?: string; color?: string }) =>
    path ? <E as="p" path={path} className={`${s.label} block`} style={{ fontSize: cq(size), color }}>{children}</E>
      : <p data-in className={s.label} style={{ fontSize: cq(size), color }}>{children}</p>;
  const when = (size = 1.9) => (
    <div data-in className="flex flex-col items-center" style={{ gap: cq(0.8) }}>
      {dp && <p className="italic" style={{ ...disp, fontSize: cq(size * 2.1) }}>{dp.weekday}, {dp.full}</p>}
      <p className={s.label} style={{ fontSize: cq(size), color: "var(--t-muted)" }}>
        {[c.time, null].filter(Boolean).join("")}{c.time && c.where ? " · " : ""}
        {c.venue && kind !== "save" ? <E path="profile.venue">{c.where}</E> : c.where}
        {c.city && c.city !== c.where && kind !== "event" ? ` · ${c.city}` : ""}
      </p>
    </div>
  );
  const footer = (size = 3.4) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block italic text-[var(--t-accent)]" style={{ ...disp, fontSize: cq(size) }}>{c.footer}</E>;
  const col = (children: ReactNode, gap = 2.4) => <div className="flex h-full flex-col items-center justify-start text-center" style={{ gap: cq(gap) }}>{children}</div>;
  const pampas = (
    <>
      <div aria-hidden className="pointer-events-none absolute bottom-0" style={{ left: cq(-2), width: cq(17) }}><Pampas seed={kind.length + 2} /></div>
      <div aria-hidden className="pointer-events-none absolute bottom-0 -scale-x-100" style={{ right: cq(-2), width: cq(15) }}><Pampas seed={kind.length + 9} /></div>
    </>
  );

  let body: ReactNode;
  let pad = "8cqw 9cqw";
  let corners = true;
  switch (kind) {
    case "save":
      body = col(<>
        {win(54, 50)}
        <Lb path="texts.eyebrow" size={2}>{c.eyebrow}</Lb>
        {dp && <p data-in className="font-extralight italic leading-none text-[var(--t-accent)]" style={{ ...disp, fontSize: cq(17) }}>{dp.day} {dp.monthShort}</p>}
        {names(7.5)}
        <Lb size={1.8} color="var(--t-muted)">{[dp?.year, c.where].filter(Boolean).join(" · ")}</Lb>
      </>, 2.6);
      break;
    case "event":
      body = col(<>
        {win(48, 44)}
        <p data-in className="italic text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(3.2) }}>{pair} <span className="not-italic">—</span> {c.lead}</p>
        <E as="h3" path="texts.headline" className="block font-extralight italic leading-[1] text-[#4a2214]" style={{ ...disp, fontSize: cq(fit(c.headline, 11, 80, 0.44)) }}>{c.headline}</E>
        {when()}
      </>, 2.8);
      break;
    case "story":
      pad = "10cqw 9cqw";
      body = col(<>
        <Lb path="texts.eyebrow" size={2.6}>{c.eyebrow}</Lb>
        {win(70, 88, undefined, true)}
        {names(10, 82, false)}
        {when(2.4)}
      </>, 4);
      break;
    case "post":
      corners = false;
      pad = "7cqw";
      body = (
        <div className="flex h-full items-center" style={{ gap: cq(6) }}>
          {win(40, 78)}
          <div className="flex flex-1 flex-col items-start text-left" style={{ gap: cq(2.4) }}>
            <Lb path="texts.eyebrow" size={1.9}>{c.eyebrow}</Lb>
            <h2 data-in className="font-extralight italic leading-[0.98] text-[#4a2214]" style={{ ...disp, fontSize: cq(fit(c.a.length > (c.b || "").length ? c.a : c.b || c.a, 10 * scale, 44, 0.42)) }}>
              <E path="profile.partner1" className="block">{c.a}</E>
              {c.b && <><span className="block text-[0.55em] text-[var(--t-accent)]">&amp;</span><E path="profile.partner2" className="block">{c.b}</E></>}
            </h2>
            {dp && <p data-in className="italic" style={{ ...disp, fontSize: cq(3.6) }}>{dp.full}</p>}
            <Lb size={1.6} color="var(--t-muted)">{c.where}</Lb>
          </div>
        </div>
      );
      break;
    case "welcome":
      body = col(<>
        {win(60, 62)}
        <Lb path="texts.eyebrow" size={2.1}>{c.eyebrow}</Lb>
        {names(12, 82, false)}
        {when(2)}
      </>, 3);
      break;
    case "program":
    case "menu": {
      const menu = kind === "menu";
      body = col(<>
        {win(menu ? 52 : 32, menu ? 52 : 28)}
        <E as="h3" path="texts.headline" className="block font-extralight italic leading-none text-[var(--t-accent)]" style={{ ...disp, fontSize: cq(fit(c.headline, menu ? 13 : 8.5, 80, 0.44)) }}>{c.headline}</E>
        <Lb size={menu ? 2.4 : 1.7} color="var(--t-muted)">{pair}{dp ? ` · ${dp.full}` : ""}</Lb>
        <ol className="flex flex-col items-center" style={{ gap: cq(menu ? 5 : 2.4), marginTop: cq(1) }}>
          {c.items.map((it, i) => (
            <li data-in key={i} className="flex flex-col items-center">
              {i > 0 && <span aria-hidden className="text-[var(--t-gold)]" style={{ fontSize: cq(menu ? 2.6 : 1.8), marginBottom: cq(menu ? 3.4 : 1.6) }}>✦</span>}
              <E as="span" path={`items.${i}.title`} className="block italic leading-tight text-[#4a2214]" style={{ ...disp, fontSize: cq(menu ? 6.4 : 4.2) }}>{it.title}</E>
              {it.detail && <E as="span" path={`items.${i}.detail`} className="block max-w-[74cqw] font-light leading-snug text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(menu ? 3.8 : 2.8), marginTop: cq(0.6) }}>{it.detail}</E>}
            </li>
          ))}
        </ol>
      </>, menu ? 3.6 : 1.8);
      if (menu) pad = "10cqw 9cqw";
      break;
    }
    case "table":
      corners = false;
      body = col(<>
        {win(60, 64, (
          <div className="absolute inset-x-0 top-[14%] flex flex-col items-center text-[#4a2214]">
            <E as="p" path="texts.headline" className={`${s.label} block`} style={{ fontSize: cq(2.4) }}>{c.headline}</E>
            <p data-in className={`${s.title} font-extralight italic leading-none`} style={{ ...disp, fontSize: cq(22) }}>{c.number}</p>
          </div>
        ))}
        <p data-in className="italic" style={{ ...disp, fontSize: cq(4.8) }}>{pair}</p>
        {dp && <Lb size={1.8} color="var(--t-muted)">{dp.full}</Lb>}
      </>, 3.4);
      pad = "7cqw 9cqw";
      break;
    case "hashtag":
      body = col(<>
        {win(52, 50)}
        <E as="p" path="texts.body" className={`${s.label} block`} style={{ fontSize: cq(2), color: "var(--t-accent)", lineHeight: 1.8 }}>{c.body}</E>
        <E as="p" path="texts.hashtag" className="block break-all font-extralight italic leading-none text-[#4a2214]" style={{ ...disp, fontSize: cq(fit(c.hashtag, 10, 82, 0.44)) }}>{c.hashtag}</E>
        <p data-in className="italic text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(3.6) }}>{pair}</p>
      </>, 3);
      break;
    case "thankyou":
      corners = false;
      pad = "6cqw 7cqw";
      body = (
        <div className="flex h-full items-center" style={{ gap: cq(6) }}>
          {win(34, 58)}
          <div className="flex flex-1 flex-col items-start text-left" style={{ gap: cq(2) }}>
            <E as="h3" path="texts.headline" className="block font-extralight italic leading-[0.95] text-[var(--t-accent)]" style={{ ...disp, fontSize: cq(fit(c.headline, 10, 52, 0.44)) }}>{c.headline}</E>
            <E as="p" multiline path="texts.body" className="block font-light italic leading-snug text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(2.9) }}>{c.body}</E>
            <p data-in className={s.label} style={{ fontSize: cq(1.5), color: "var(--t-ink)" }}>{pair}</p>
          </div>
        </div>
      );
      break;
    case "greeting":
      body = col(<>
        {win(48, 46)}
        <Lb path="texts.eyebrow" size={1.9}>{c.eyebrow}</Lb>
        {names(11)}
        {c.body && <E as="p" multiline path="texts.body" className="block max-w-[74cqw] font-light italic leading-snug text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(3.2) }}>{c.body}</E>}
        {footer(3.8)}
      </>, 2.4);
      break;
    default: // invite
      body = col(<>
        {win(46, 44)}
        <Lb path="texts.eyebrow" size={1.8}>{c.eyebrow}</Lb>
        {names(10.5)}
        <E as="p" multiline path="profile.inviteLine" className="block max-w-[70cqw] font-light italic leading-snug text-[var(--t-muted)]" style={{ ...disp, fontSize: cq(3.1) }}>{c.lead}</E>
        {when(1.8)}
        {footer(3.4)}
      </>, 2.3);
  }

  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${s.sand} ${className}`} style={{ ...lookStyle(TERRA_LOOK, design, "terracotta-table"), background: undefined }}>
      <TerraStyles />
      <div aria-hidden className="pointer-events-none absolute" style={{ inset: cq(3), border: "1px solid color-mix(in oklab, var(--t-accent) 30%, transparent)" }} />
      {corners && pampas}
      <div className="absolute inset-0" style={{ padding: pad }}>{body}</div>
    </CardShell>
  );
}
