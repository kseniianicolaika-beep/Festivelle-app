"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client";
import { RealtimeProvider, useLiveQuery } from "@neon/realtime-react";
import type { CollabSignal, Presence } from "@/lib/realtime";
import { pathLabel } from "@/lib/editor-options";

type Sealed = { signal: SealedLiveQuery<CollabSignal>; presence: SealedLiveQuery<Presence>; me: { id: string; color: string } };
type Props = { weddingId: string; realtimeUrl: string; docId?: string; path?: string | null; onRemoteChange: () => void; onPeers?: (p: Presence[]) => void };

// Live collaboration over Neon Realtime: a trigger-bumped change signal (any edit, by anyone, from chat or the
// visual editor) and a presence table (who is here, which piece and element they have selected).
export function Collab(props: Props) {
  const client = useMemo(() => (props.realtimeUrl ? createRealtimeClient({ url: props.realtimeUrl }) : null), [props.realtimeUrl]);
  const [sealed, setSealed] = useState<Sealed | null>(null);
  const reseal = useCallback(async () => {
    const r = await fetch(`/api/weddings/${props.weddingId}/collab`, { method: "POST" });
    if (!r.ok) throw new Error("collab");
    const s = (await r.json()) as Sealed;
    setSealed(s);
    return s;
  }, [props.weddingId]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time async seal on mount
  useEffect(() => { reseal().catch(() => {}); }, [reseal]);

  // Heartbeat: announce presence + current selection; leave on unload.
  useEffect(() => {
    const beat = () => fetch(`/api/weddings/${props.weddingId}/collab`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ path: props.path ?? null, docId: props.docId ?? null }), keepalive: true }).catch(() => {});
    beat();
    const t = setInterval(beat, 15_000);
    return () => clearInterval(t);
  }, [props.weddingId, props.path, props.docId]);
  useEffect(() => {
    const bye = () => fetch(`/api/weddings/${props.weddingId}/collab`, { method: "DELETE", keepalive: true }).catch(() => {});
    window.addEventListener("pagehide", bye);
    return () => { window.removeEventListener("pagehide", bye); bye(); };
  }, [props.weddingId]);

  if (!client || !sealed) return null;
  return (
    <RealtimeProvider client={client}>
      <Live {...props} sealed={sealed} reseal={reseal} />
    </RealtimeProvider>
  );
}

function Live({ sealed, reseal, onRemoteChange, onPeers, docId }: Props & { sealed: Sealed; reseal: () => Promise<Sealed> }) {
  const sig = useLiveQuery(sealed.signal, { refreshQuery: async () => (await reseal()).signal });
  const pres = useLiveQuery(sealed.presence, { refreshQuery: async () => (await reseal()).presence });
  const last = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const version = sig.data?.[0]?.version ?? null;
  useEffect(() => {
    if (version === null) return;
    if (last.current === null) { last.current = version; return; }
    if (version === last.current) return;
    last.current = version;
    // Debounce bursts (a chat turn touches several rows).
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onRemoteChange, 350);
  }, [version, onRemoteChange]);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 10_000); return () => clearInterval(t); }, []);
  const peers = useMemo(
    () => (pres.data ?? []).filter((p) => p.user_id !== sealed.me.id && now - new Date(p.seen_at).getTime() < 45_000),
    [pres.data, sealed.me.id, now],
  );
  useEffect(() => { onPeers?.(peers); }, [peers, onPeers]);

  return (
    <div className="flex items-center -space-x-1.5" aria-label="People editing now">
      <AnimatePresence>
        {peers.map((p) => (
          <motion.span key={p.user_id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            title={`${p.name}${p.path && p.doc_id === docId ? ` · editing ${pathLabel(p.path)}` : " is here"}`}
            className="relative grid h-7 w-7 place-items-center rounded-full text-[11px] font-medium uppercase text-white ring-2 ring-white" style={{ background: p.color }}>
            {p.name[0]}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white" />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
