"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// Product analytics (PostHog, EU cloud) + HubSpot tracking, only after the visitor agrees.
// The values are public (they ship to every browser anyway), so they default here — that way the Festivelle
// team's Vercel project serving hugs.festivelle.love works without env changes. Env vars override.
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_nRwmzhFSiLvSraRc9KjKYETj9sTfkTy6Mwaks8WP8xn9";
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const HS_PORTAL = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "247936987";
const CONSENT = "fv-consent";

// Hosts' published celebration sites are private pages for their guests: never tracked.
function isAppPage(path: string) {
  if (/^\/(w|d|dev)(\/|$)/.test(path)) return false;
  const h = location.hostname;
  const extra = (process.env.NEXT_PUBLIC_APP_HOSTS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return h === "localhost" || h.endsWith(".vercel.app") || h === "hugs.festivelle.love" || extra.includes(h);
}

function readConsent(): string | null {
  try { return localStorage.getItem(CONSENT); } catch { return null; }
}

let started = false;
async function start() {
  if (started) return;
  started = true;
  const { default: posthog } = await import("posthog-js");
  posthog.init(PH_KEY, { api_host: PH_HOST, capture_pageview: "history_change", person_profiles: "identified_only" });
  if (HS_PORTAL && !document.getElementById("hs-script-loader")) {
    const s = document.createElement("script");
    s.id = "hs-script-loader";
    s.async = true;
    s.defer = true;
    s.src = `https://js-na2.hs-scripts.com/${HS_PORTAL}.js`;
    document.body.appendChild(s);
  }
}

const noop = () => () => {};

export function Analytics() {
  const path = usePathname();
  const client = useSyncExternalStore(noop, () => true, () => false);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const consent = choice ?? (client ? readConsent() : "pending");
  const app = client && isAppPage(path);

  useEffect(() => {
    if (app && consent === "yes") void start();
  }, [app, consent]);

  if (!app || consent !== null) return null;
  const choose = (v: "yes" | "no") => {
    try { localStorage.setItem(CONSENT, v); } catch { /* private mode: ask again next visit */ }
    setChoice(v);
  };
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-xl rounded-2xl border border-[#ecd6c6] bg-[#fffaf5] p-4 text-sm text-[#3b2228] shadow-lg sm:flex sm:items-center sm:gap-4">
      <p className="flex-1">
        We use cookies to understand how Festivelle is used and improve it. · Мы используем cookies, чтобы улучшать Festivelle.
      </p>
      <div className="mt-3 flex gap-2 sm:mt-0">
        <button onClick={() => choose("no")} className="rounded-full border border-[#ecd6c6] px-4 py-1.5">Decline</button>
        <button onClick={() => choose("yes")} className="rounded-full bg-[#7a1f35] px-4 py-1.5 text-white">Accept</button>
      </div>
    </div>
  );
}
