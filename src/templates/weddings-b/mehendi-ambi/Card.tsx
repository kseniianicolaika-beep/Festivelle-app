"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import type { CardProps } from "../../types";
import { E } from "@/components/designs/Editable";
import { CardShell, fibres, fit, grain, lookStyle, ratioOf, useStage } from "../_shared/kit";
import { cardText, dateParts } from "../_shared/text";
import { HennaFrame, jaal, Mandala, Marigold, Paisley, Petal, Toran, Vine } from "./art";
import { MEHENDI_LOOK } from "./look";
import { s, MehendiStyles } from "./styles";

const disp: CSSProperties = { fontFamily: "var(--wd)" };
const scr: CSSProperties = { fontFamily: "var(--ws)" };
const body: CSSProperties = { fontFamily: "var(--wbody)" };
const cq = (n: number) => `${n}cqw`;

export default function MehendiCard({ kind, profile, design, photoUrl, animate = true, className = "" }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const c = cardText(kind, design, profile);
  const dp = dateParts(c.iso, c.lang);
  const ratio = ratioOf(kind);
  const land = kind === "thankyou";
  const scale = Math.min(Math.max(design.scale ?? 1, 0.7), 1.3);
  const longest = Math.max([...c.a].length, [...(c.b || "")].length);
  const hi = c.lang === "hi";
  const garland = kind === "invite" || kind === "welcome" || kind === "save" || kind === "story";

  useStage(ref, (g, q) => {
    g.timeline({ defaults: { ease: "power2.inOut" } })
      .from(q("[data-pipe]"), { drawSVG: 0, duration: 0.9, stagger: 0.012 }, 0)
      .from(q("[data-strand]"), { y: -40, opacity: 0, duration: 1, stagger: { each: 0.05, from: "center" }, ease: "back.out(1.5)" }, 0.1)
      .from(q("[data-name]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1.1, stagger: 0.3, ease: "power1.inOut" }, 0.5)
      .from(q("[data-in]"), { opacity: 0, y: 10, duration: 0.8, stagger: 0.07, ease: "power3.out" }, 0.7);
  }, [kind], animate);

  const names = (base: number, avail = 76) => {
    const size = fit("x".repeat(longest), base * scale, avail, 0.52);
    return (
      <div className="w-full text-center">
        <E as="h2" path="profile.partner1" className="block leading-[1.3]" style={{ ...disp, fontSize: cq(size) }}><span data-name className={`${s.stain} inline-block px-[0.12em]`}>{c.a}</span></E>
        {c.b && (
          <>
            <p data-in className="leading-none text-[#d9922a]" style={{ ...scr, fontSize: cq(size * 0.6) }}>&amp;</p>
            <E as="h2" path="profile.partner2" className="block leading-[1.3]" style={{ ...disp, fontSize: cq(size) }}><span data-name className={`${s.stain} inline-block px-[0.12em]`}>{c.b}</span></E>
          </>
        )}
      </div>
    );
  };
  const eyebrow = (size = 2.6) => c.eyebrow && (
    <E as="p" path="texts.eyebrow" className={`block text-[#b4521d] ${hi ? "" : "uppercase"}`} style={hi ? { ...scr, fontSize: cq(size * 1.45) } : { ...body, fontSize: cq(size), letterSpacing: "0.3em" }}>{c.eyebrow}</E>
  );
  const date = (size = 3.4) => dp && (
    <div data-in className="flex items-center justify-center text-[#4a1f0c]" style={{ ...body, fontSize: cq(size), gap: cq(2) }}>
      <span>{dp.weekday}</span><span className="text-[#d9922a]">✿</span><span>{c.date}</span>
    </div>
  );
  const place = (size = 2.8) => (c.where || c.time) && (
    <p data-in className="text-[#8a5a3c]" style={{ ...body, fontSize: cq(size), lineHeight: 1.5 }}>
      {[c.time, c.where].filter(Boolean).join(" · ")}{c.city && c.venue && kind !== "save" && kind !== "event" ? `, ${c.city}` : ""}
    </p>
  );
  const footer = (size = 3.6) => c.footer && <E as="p" path={design.texts?.footer ? "texts.footer" : "profile.blessing"} className="block text-[#b4521d]" style={{ ...scr, fontSize: cq(size) }}>{c.footer}</E>;
  const vine = (w = 56) => <div style={{ width: cq(w) }}><Vine leaves={7} /></div>;
  const crest = (w = 30) => (
    <div className="relative flex items-end justify-center" style={{ width: cq(w * 1.9) }}>
      <Paisley className="-rotate-[28deg]" style={{ width: cq(w * 0.42) }} />
      <Mandala style={{ width: cq(w * 0.8), margin: `0 ${cq(-1)}` }} />
      <Paisley className="rotate-[28deg] -scale-x-100" style={{ width: cq(w * 0.42) }} />
    </div>
  );
  const gap = (n: number) => ({ gap: cq(n) });
  const col = "flex h-full flex-col items-center justify-center text-center";

  let content: ReactNode;
  switch (kind) {
    case "save":
      content = (
        <div className={col} style={gap(2.4)}>
          {eyebrow(2.8)}
          {dp && (
            <div data-in className="relative flex items-center justify-center" style={{ width: cq(52), height: cq(52) }}>
              <Mandala className="absolute inset-0" core={36} />
              <div className="relative leading-none">
                <p className={s.stain} style={{ ...body, fontSize: cq(13), fontWeight: 300 }}>{dp.day}</p>
                <p className="text-[#5a240c]" style={{ ...disp, fontSize: cq(4) }}>{dp.month}</p>
              </div>
            </div>
          )}
          {names(9.5)}
          {place(2.8)}
          <p data-in className="text-[#8a5a3c]" style={{ ...scr, fontSize: cq(3.4) }}>{c.sub}</p>
        </div>
      );
      break;
    case "event":
      content = (
        <div className={col} style={gap(2.4)}>
          {crest(28)}
          <p data-in className="text-[#8a5a3c]" style={{ ...body, fontSize: cq(3) }}>{c.a}{c.b ? ` & ${c.b}` : ""} · {c.lead}</p>
          <E as="h3" path="texts.headline" className="block leading-[1.25]" style={{ ...disp, fontSize: cq(fit(c.headline, 12, 76, 0.5)) }}><span data-name className={`${s.stain} inline-block px-[0.1em]`}>{c.headline}</span></E>
          {vine(50)}
          {date(3.2)}
          {place(2.8)}
        </div>
      );
      break;
    case "program":
    case "menu":
      content = (
        <div className={col} style={gap(kind === "menu" ? 3.6 : 2.2)}>
          {crest(kind === "menu" ? 34 : 24)}
          <E as="h3" path="texts.headline" className="block leading-[1.3]" style={{ ...disp, fontSize: cq(kind === "menu" ? 11 : 8) }}><span data-name className={`${s.stain} inline-block px-[0.1em]`}>{c.headline}</span></E>
          <p data-in className="text-[#b4521d]" style={{ ...scr, fontSize: cq(kind === "menu" ? 5 : 3.6) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
          <ol className="flex w-full flex-col items-center" style={gap(kind === "menu" ? 5 : 2.4)}>
            {c.items.map((it, i) => (
              <li data-in key={i} className="flex flex-col items-center">
                <svg viewBox="0 0 20 20" style={{ width: cq(kind === "menu" ? 5 : 3.6) }} aria-hidden><Marigold cx={10} cy={10} r={7} tone={i} /></svg>
                <E as="span" path={`items.${i}.title`} className="block text-[#5a240c]" style={{ ...disp, fontSize: cq(kind === "menu" ? 6.4 : 4.4), lineHeight: 1.3 }}>{it.title}</E>
                {it.detail && <E as="span" path={`items.${i}.detail`} className="block max-w-[70cqw] leading-snug text-[#8a5a3c]" style={{ ...body, fontSize: cq(kind === "menu" ? 3.8 : 2.7) }}>{it.detail}</E>}
              </li>
            ))}
          </ol>
          {date(kind === "menu" ? 3.6 : 2.7)}
        </div>
      );
      break;
    case "table":
      content = (
        <div className={col}>
          <div data-in className="relative flex items-center justify-center" style={{ width: cq(66), height: cq(66) }}>
            <Mandala className="absolute inset-0" core={38} />
            <div className="relative">
              <E as="p" path="texts.headline" className="block text-[#b4521d]" style={hi ? { ...scr, fontSize: cq(5) } : { ...body, fontSize: cq(3.2), letterSpacing: "0.35em", textTransform: "uppercase" }}>{c.headline}</E>
              <p className={`${s.stain} leading-none`} style={{ ...body, fontSize: cq(20), fontWeight: 300 }}>{c.number}</p>
            </div>
          </div>
          <p data-in className="mt-[3cqw] text-[#b4521d]" style={{ ...disp, fontSize: cq(5) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
        </div>
      );
      break;
    case "hashtag":
      content = (
        <div className={col} style={gap(3)}>
          {crest(30)}
          <E as="p" path="texts.body" className="block text-[#8a5a3c]" style={{ ...scr, fontSize: cq(4.6), maxWidth: cq(70) }}>{c.body}</E>
          <E as="p" path="texts.hashtag" className="block break-words leading-[1.3]" style={{ ...disp, fontSize: cq(fit(c.hashtag, 9, 74, 0.6)) }}><span data-name className={`${s.stain} inline-block px-[0.1em]`}>{c.hashtag}</span></E>
          {vine(54)}
          {date(3)}
        </div>
      );
      break;
    case "thankyou":
      content = (
        <div className="flex h-full items-center" style={gap(4)}>
          <div className="relative shrink-0" style={{ width: cq(30) }}>
            <Mandala />
            <Paisley className="absolute -bottom-[10%] -right-[18%] w-[46%] rotate-[24deg]" />
          </div>
          <div className="flex flex-1 flex-col items-center text-center" style={gap(1.6)}>
            <E as="h3" path="texts.headline" className="block leading-[1.3]" style={{ ...disp, fontSize: cq(fit(c.headline, 9.5, 52, 0.5)) }}><span data-name className={`${s.stain} inline-block px-[0.1em]`}>{c.headline}</span></E>
            <div style={{ width: cq(36) }}><Vine leaves={6} /></div>
            <E as="p" multiline path="texts.body" className="block leading-snug text-[#5a3a28]" style={{ ...body, fontSize: cq(2.5), maxWidth: cq(48) }}>{c.body}</E>
            <p data-in className="text-[#b4521d]" style={{ ...scr, fontSize: cq(3.8) }}>{c.a}{c.b ? ` & ${c.b}` : ""}</p>
          </div>
        </div>
      );
      break;
    case "greeting":
      content = (
        <div className={col} style={gap(2.6)}>
          {crest(30)}
          {eyebrow(2.6)}
          {names(10)}
          {vine(50)}
          {c.body && <E as="p" multiline path="texts.body" className="block leading-relaxed text-[#5a3a28]" style={{ ...body, fontSize: cq(3), maxWidth: cq(68) }}>{c.body}</E>}
          {footer(4)}
        </div>
      );
      break;
    case "story":
      content = (
        <div className={col} style={gap(3.4)}>
          {eyebrow(3)}
          <div data-in className="relative" style={{ width: cq(60), height: cq(60) }}>
            <Mandala className="absolute inset-0" core={46} />
            <div className="absolute inset-[23.2%] overflow-hidden rounded-full" style={{ background: "radial-gradient(circle,#fbe9cf,#e9c9a0)" }}>
              {photoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img data-edit-photo="photo" src={photoUrl} alt="" className="h-full w-full object-cover" />
                : <div className="flex h-full items-center justify-center"><Paisley className="h-3/4" /></div>}
            </div>
          </div>
          {names(10.5)}
          {vine(56)}
          {date(3.8)}
          {place(3.2)}
        </div>
      );
      break;
    case "post":
      content = (
        <div className="relative flex h-full items-center" style={gap(4)}>
          <div className="relative shrink-0" style={{ width: cq(40) }}>
            <Mandala />
          </div>
          <div className="flex flex-1 flex-col items-center text-center" style={gap(2)}>
            {eyebrow(2.3)}
            {names(8.4, 42)}
            {date(2.6)}
            {place(2.3)}
          </div>
        </div>
      );
      break;
    case "welcome":
      content = (
        <div className={col} style={gap(3)}>
          {eyebrow(3)}
          {names(13.5)}
          {crest(30)}
          {date(3.6)}
          {place(3)}
          {footer(4.4)}
        </div>
      );
      break;
    default: // invite
      content = (
        <div className={col} style={gap(2.2)}>
          {eyebrow(2.4)}
          <E as="p" multiline path="profile.inviteLine" className="block leading-[1.6] text-[#5a3a28]" style={{ ...body, fontSize: cq(hi ? 3 : 2.8), maxWidth: cq(68) }}>{c.lead}</E>
          {names(11)}
          {crest(26)}
          {date(3.2)}
          {place(2.8)}
          {footer(3.8)}
        </div>
      );
  }

  const pad = land ? "8cqw 9cqw" : kind === "post" ? "9cqw 10cqw" : garland ? `${kind === "story" ? 26 : 24}cqw 11cqw 11cqw` : "12cqw 11cqw";
  return (
    <CardShell kind={kind} innerRef={ref} lang={profile.language ?? "en"} className={`${s.root} ${animate ? "" : s.still} ${className}`} style={{ ...lookStyle(MEHENDI_LOOK, design, "mehendi-ambi") }}>
      <MehendiStyles />
      <div aria-hidden className={`${s.paper} absolute inset-0`} />
      <div aria-hidden className="absolute inset-0" style={{ backgroundImage: `${jaal(0.09)}, ${fibres(0.12)}`, backgroundSize: `${cq(12)} ${cq(12)}, auto` }} />
      <div aria-hidden className="absolute inset-0 mix-blend-multiply" style={{ backgroundImage: grain(0.18), opacity: 0.6 }} />
      <HennaFrame ratio={ratio} className="absolute inset-0 h-full w-full" />
      {garland && (
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2" style={{ top: cq(1), width: cq(96) }}><Toran /></div>
      )}
      {(kind === "invite" || kind === "welcome" || kind === "greeting") && (
        <>
          <Petal kind={1} className="absolute" style={{ width: cq(3.6), left: cq(9), bottom: cq(10), rotate: "30deg" }} />
          <Petal kind={0} className="absolute" style={{ width: cq(4), right: cq(10), bottom: cq(12) }} />
          <Petal kind={2} className="absolute" style={{ width: cq(3), right: cq(15), bottom: cq(9), rotate: "-40deg" }} />
        </>
      )}
      <div className="absolute inset-0" style={{ padding: pad }}>{content}</div>
    </CardShell>
  );
}
