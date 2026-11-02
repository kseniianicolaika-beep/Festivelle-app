"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRealtimeClient, type SealedLiveQuery } from "@neon/realtime/client";
import { RealtimeProvider, useLiveQuery } from "@neon/realtime-react";
import type { LiveRsvp } from "@/lib/realtime";

// Neon Realtime: the RSVP list is a live SQL query — new replies appear the moment a guest submits.
export function LiveRsvps({ weddingId, realtimeUrl }: { weddingId: string; realtimeUrl: string }) {
  const client = useMemo(() => (realtimeUrl ? createRealtimeClient({ url: realtimeUrl }) : null), [realtimeUrl]);
  const fetchSealed = useCallback(async () => {
    const res = await fetch(`/api/weddings/${weddingId}/live`, { method: "POST" });
    if (!res.ok) throw new Error("Could not open live replies");
    return (await res.json()) as SealedLiveQuery<LiveRsvp>;
  }, [weddingId]);
  const [sealed, setSealed] = useState<SealedLiveQuery<LiveRsvp> | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { fetchSealed().then(setSealed, (e) => setErr(e.message)); }, [fetchSealed]);

  if (!client) return <p className="mt-2 text-sm text-muted">Realtime is not configured.</p>;
  if (err) return <p className="mt-2 text-sm text-rose">{err}</p>;
  if (!sealed) return <p className="mt-2 text-sm text-muted">Connecting…</p>;
  return (
    <RealtimeProvider client={client}>
      <List sealed={sealed} refresh={fetchSealed} />
    </RealtimeProvider>
  );
}

function List({ sealed, refresh }: { sealed: SealedLiveQuery<LiveRsvp>; refresh: () => Promise<SealedLiveQuery<LiveRsvp>> }) {
  const { data, status, error } = useLiveQuery(sealed, { refreshQuery: refresh });
  if (status === "error") return <p className="mt-2 text-sm text-rose">Live updates paused: {error?.message}</p>;
  if (!data) return <p className="mt-2 text-sm text-muted">Connecting…</p>;
  const yes = data.filter((r) => r.attending).reduce((n, r) => n + Number(r.party_size), 0);
  return (
    <div className="mt-3">
      <p className="flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> {data.length} replies · {yes} attending</p>
      <ul className="mt-3 divide-y divide-line">
        {data.map((r) => (
          <li key={r.id} className="fade py-3 text-sm">
            <div className="flex justify-between"><span className="font-medium">{r.guest_name}</span><span className={r.attending ? "text-emerald-700" : "text-muted"}>{r.attending ? `Yes · ${r.party_size}` : "Can’t come"}</span></div>
            {r.message && <p className="mt-1 text-muted">“{r.message}”</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
