"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { E } from "@/components/designs/Editable";
import { Countdown } from "@/components/Countdown";
import { sectionLayout, type SectionId } from "@/lib/templates";
import type { SiteProps } from "../../types";
import { GREET_FONTS } from "./fonts";
import { overrides, siteCopy, type GreetDefaults, type SiteCopy } from "./kit";
import { Styles } from "./ui";

export const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type G = SiteCopy & {
  props: SiteProps;
  compact: boolean;
  opened: boolean;
  reduced: boolean;
  heroUrl: string | null;
  photos: { src: string; edit: "hero" | "gallery" }[];
  replay: () => void;
};
export type OpeningProps = { g: G; onOpen: () => void };

export type SiteCfg = {
  id: string;
  cls: string;
  css: string;
  vars: Record<string, string>;
  defaults: GreetDefaults;
  Opening?: ComponentType<OpeningProps>;
  Hero: ComponentType<{ g: G }>;
  Backdrop?: ComponentType<{ g: G }>;
  /** Section heading: kicker (small caps) + title. */
  title?: (kicker: string, title: string, id: SectionId) => ReactNode;
  ornament?: ReactNode;
  frame?: (img: ReactNode, i: number) => ReactNode;
  letter?: ComponentType<{ g: G }>;
  sections?: Partial<Record<SectionId, ComponentType<{ g: G }>>>;
  footer?: ComponentType<{ g: G }>;
  grain?: boolean;
};

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const mapUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export function GreetSite({ cfg, ...props }: SiteProps & { cfg: SiteCfg }) {
  const { profile, design, heroUrl, compact = false, children, credit, calendarUrl } = props;
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(compact || !cfg.Opening);
  const [overlay, setOverlay] = useState<"on" | "leaving" | "off">(compact || !cfg.Opening ? "off" : "on");
  const [reduced, setReduced] = useState(false);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => setReduced(prefersReduced()), []);

  const copy = siteCopy(profile, design, cfg.defaults);
  const photos: G["photos"] = copy.gallery.length ? copy.gallery.map((src) => ({ src, edit: "gallery" as const })) : [];
  const replay = useCallback(() => {
    if (compact || !cfg.Opening) return;
    window.scrollTo({ top: 0 });
    lenis.current?.scrollTo(0, { immediate: true });
    setOpened(false);
    setOverlay("on");
  }, [compact, cfg.Opening]);
  const g: G = { ...copy, props, compact, opened, reduced, heroUrl: heroUrl ?? null, photos, replay };

  const onOpen = useCallback(() => {
    setOpened(true);
    setOverlay("leaving");
    window.setTimeout(() => setOverlay("off"), 1150);
  }, []);

  // Smooth scroll (never in compact previews).
  useEffect(() => {
    if (compact || prefersReduced()) return;
    const l = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, [compact]);

  // Lock scrolling while the gift is still wrapped.
  useEffect(() => {
    if (compact) return;
    const locked = overlay === "on";
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (locked) lenis.current?.stop();
    else lenis.current?.start();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [overlay, compact]);

  // Scroll-triggered reveals for anything marked data-rv.
  useEffect(() => {
    if (compact || !opened || prefersReduced() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rv]").forEach((el) => {
        const kind = el.dataset.rv;
        gsap.from(el, {
          ...(kind === "fade" ? { opacity: 0 } : kind === "scale" ? { opacity: 0, scale: 0.92 } : kind === "left" ? { opacity: 0, x: -40 } : { opacity: 0, y: 46, filter: "blur(6px)" }),
          duration: 1.4,
          ease: "power3.out",
          delay: Number(el.dataset.rvDelay ?? 0),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [compact, opened]);

  const { order, hidden } = sectionLayout(design?.sections);
  const Title = ({ k, t, id }: { k: string; t: string; id: SectionId }) => (cfg.title ? <>{cfg.title(k, t, id)}</> : <div data-rv><span className="gk-kicker">{k}</span><h2 className="gk-title">{t}</h2></div>);
  const frame = cfg.frame ?? ((img: ReactNode) => <figure className="gk-photo">{img}</figure>);
  const Letter = cfg.letter;

  const render: Record<SectionId, () => ReactNode> = {
    invitation: () => (
      <div className="gk-center">
        {cfg.ornament && <div data-rv="fade" style={{ marginBottom: "clamp(22px,3cqi,40px)" }}>{cfg.ornament}</div>}
        <div data-rv><E as="p" path="profile.inviteLine" multiline className="gk-wish">{g.wish}</E></div>
      </div>
    ),
    story: () =>
      Letter ? <Letter g={g} /> : (
        <div className="gk-letter" data-rv>
          <Title k={g.w.letter} t={g.name} id="story" />
          <E as="p" path="profile.story" multiline className="gk-msg" style={{ marginTop: 28 }}>{g.message}</E>
          <E as="p" path="profile.blessing" className="gk-sign" style={{ marginTop: 28 }}>{g.signoff}</E>
        </div>
      ),
    details: () =>
      g.date ? (
        <div className="gk-center">
          <Title k={g.w.day} t={g.date} id="details" />
          {profile.date && <div data-rv><Countdown date={profile.date} label={g.w.days} /></div>}
          {calendarUrl && <p style={{ marginTop: 28 }} data-rv><a className="gk-btn" href={calendarUrl}>{g.w.cal}</a></p>}
        </div>
      ) : null,
    schedule: () =>
      g.events.length ? (
        <div>
          <Title k={g.w.plans} t={g.headline} id="schedule" />
          <div className="gk-events">
            {g.events.map((e, i) => (
              <div key={i} className="gk-event" data-rv data-rv-delay={i * 0.08}>
                <h3>{e.name}</h3>
                <p className="gk-meta">{[e.date, e.time].filter(Boolean).join(" · ")}</p>
                {e.venue && <p style={{ marginTop: 8, opacity: 0.8 }}>{e.venue}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null,
    venue: () =>
      g.venue || g.city ? (
        <div className="gk-center">
          <Title k={g.w.where} t={g.venue || g.city} id="venue" />
          {g.venue && g.city && <E as="p" path="profile.city" className="gk-meta" style={{ marginTop: 16 }}>{g.city}</E>}
          <p style={{ marginTop: 28 }} data-rv><a className="gk-btn" href={mapUrl([g.venue, g.city].filter(Boolean).join(", "))} target="_blank" rel="noreferrer">{g.w.map}</a></p>
        </div>
      ) : null,
    gallery: () =>
      photos.length ? (
        <div>
          <Title k={g.w.gallery} t={g.name} id="gallery" />
          <div className="gk-photos">
            {photos.map((ph, i) => (
              <div key={ph.src} data-rv data-rv-delay={(i % 3) * 0.1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {frame(<img src={ph.src} alt="" loading="lazy" data-edit-photo={ph.edit} />, i)}
              </div>
            ))}
          </div>
        </div>
      ) : null,
    rsvp: () =>
      children ? (
        <div>
          <Title k={g.name} t={g.w.reply} id="rsvp" />
          <div className="gk-rsvp" data-rv>{children}</div>
        </div>
      ) : null,
    info: () =>
      g.info ? (
        <div className="gk-letter gk-center">
          <Title k={g.w.info} t={g.headline} id="info" />
          <E as="p" path="texts.body" multiline className="gk-msg" style={{ marginTop: 24 }}>{g.info}</E>
        </div>
      ) : null,
  };

  const Opening = cfg.Opening;
  const Backdrop = cfg.Backdrop;
  const Hero = cfg.Hero;
  const Footer = cfg.footer;
  const style = { ...cfg.vars, ...overrides(design, cfg.id) } as CSSProperties;

  return (
    <div ref={root} lang={profile.language ?? "en"} className={`gk ${cfg.grain === false ? "" : "gk-grain"} ${cfg.cls} ${GREET_FONTS} ${compact ? "is-compact" : ""}`} style={style}>
      <Styles id={cfg.id} css={cfg.css} />
      <div className="gk-wrap">
        {Backdrop && <Backdrop g={g} />}
        <Hero g={g} />
        {order.map((id) => {
          if (hidden.has(id)) return null;
          const Custom = cfg.sections?.[id];
          const node = Custom ? <Custom g={g} /> : render[id]();
          if (!node) return null;
          return (
            <section key={id} id={`gk-${id}`} data-edit-section={id} className={`gk-sec gk-sec-${id}`}>
              {node}
            </section>
          );
        })}
        {Footer ? <Footer g={g} /> : (
          <footer className="gk-foot">
            {cfg.ornament && <div data-rv="fade">{cfg.ornament}</div>}
            <E as="p" path="profile.blessing" className="gk-sign" style={{ marginTop: 24 }}>{g.signoff}</E>
            {!compact && Opening && <button type="button" className="gk-btn" style={{ marginTop: 36 }} onClick={replay}>{g.w.again}</button>}
            {credit && <div className="gk-credit">{credit}</div>}
          </footer>
        )}
      </div>
      {Opening && overlay !== "off" && !compact && (
        <div className={`gk-overlay ${overlay === "leaving" ? "is-gone" : ""}`}>
          <Opening g={g} onOpen={onOpen} />
        </div>
      )}
    </div>
  );
}
