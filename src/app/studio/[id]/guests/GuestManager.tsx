"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type G = {
  id: string; name: string; email: string | null; phone: string | null; household: string | null; events: string[] | null; plus_ones: number;
  lang: string | null; notes: string | null; status: string; link: string | null; opened_at: string | null; reminded_at: string | null;
  attending: boolean | null; party_size: number | null; meal: string | null; dietary: string | null; plus_one_name: string | null; rsvp_events: Record<string, boolean> | null; message: string | null;
};
type Photo = { id: string; key: string; uploader: string | null; approved: boolean };

const invite = (lang: string, names: string, first: string, link: string) =>
  lang === "ru" ? `${first}, вы приглашены ✨ ${names}\n${link}` : lang === "hi" ? `${first}, आप आमंत्रित हैं ✨ ${names}\n${link}` : `Dear ${first}, you're invited ✨ ${names}\n${link}`;

export function GuestManager({ weddingId, editable, published, events, names, lang, email, guestPhotos }: { weddingId: string; editable: boolean; published: boolean; events: string[]; names: string; lang: string; email: boolean; guestPhotos: boolean }) {
  const api = `/api/weddings/${weddingId}/guests`;
  const [guests, setGuests] = useState<G[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [csv, setCsv] = useState("");
  const [filter, setFilter] = useState<"all" | "yes" | "no" | "waiting">("all");
  const [form, setForm] = useState({ name: "", email: "", phone: "", household: "", plus_ones: 0, events: [] as string[] });

  const load = useCallback(async () => {
    const j = await fetch(api).then((r) => r.json());
    setGuests(j.guests ?? []);
    if (guestPhotos) setPhotos((await fetch(`${api}/photos`).then((r) => r.json())).photos ?? []);
  }, [api, guestPhotos]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  const call = async (url: string, method: string, body?: unknown) => {
    const r = await fetch(url, { method, headers: { "content-type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setNote(j.error ?? "Something went wrong");
    else if (j.message) setNote(j.message);
    else if (j.added) setNote(`Added ${j.added} guest${j.added === 1 ? "" : "s"} ♥`);
    await load();
    return r.ok;
  };

  const stats = useMemo(() => {
    const yes = guests.filter((g) => g.attending === true);
    return {
      invited: guests.length,
      coming: yes.reduce((n, g) => n + (g.party_size ?? 1), 0),
      declined: guests.filter((g) => g.attending === false).length,
      waiting: guests.filter((g) => g.attending == null).length,
      perEvent: events.map((e) => [e, yes.filter((g) => !g.rsvp_events || g.rsvp_events[e]).filter((g) => !g.events || g.events.includes(e)).reduce((n, g) => n + (g.party_size ?? 1), 0)] as const),
      meals: Object.entries(yes.reduce<Record<string, number>>((m, g) => (g.meal ? ((m[g.meal] = (m[g.meal] ?? 0) + (g.party_size ?? 1)), m) : m), {})),
    };
  }, [guests, events]);

  const shown = guests.filter((g) => filter === "all" || (filter === "yes" ? g.attending === true : filter === "no" ? g.attending === false : g.attending == null));
  const households = Object.entries(shown.reduce<Record<string, G[]>>((h, g) => ((h[g.household || g.name] ??= []).push(g), h), {}));

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {([["Invited", stats.invited], ["Coming", stats.coming], ["Declined", stats.declined], ["Waiting", stats.waiting]] as const).map(([k, v]) => (
          <div key={k} className="glass rounded-3xl p-5"><p className="eyebrow text-muted">{k}</p><p className="display mt-1 text-4xl">{v}</p></div>
        ))}
      </div>
      {(stats.perEvent.length > 1 || stats.meals.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {stats.perEvent.map(([e, n]) => <span key={e} className="rounded-full bg-white/70 px-3 py-1">{e}: {n} coming</span>)}
          {stats.meals.map(([m, n]) => <span key={m} className="rounded-full bg-blush/40 px-3 py-1">{m}: {n}</span>)}
        </div>
      )}

      {note && <p className="mt-4 rounded-2xl bg-white/80 px-4 py-3 text-sm">{note}</p>}

      {editable && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <form onSubmit={async (e) => { e.preventDefault(); if (await call(api, "POST", { guest: form })) setForm({ name: "", email: "", phone: "", household: form.household, plus_ones: 0, events: [] }); }} className="glass space-y-2 rounded-3xl p-5">
            <p className="font-medium">Add a guest</p>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="field !py-2 !text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="field !py-2 !text-sm" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="WhatsApp / phone" className="field !py-2 !text-sm" />
              <input value={form.household} onChange={(e) => setForm({ ...form, household: e.target.value })} placeholder="Household (e.g. The Ivanovs)" className="field !py-2 !text-sm" />
              <input type="number" min={0} max={10} value={form.plus_ones} onChange={(e) => setForm({ ...form, plus_ones: Number(e.target.value) })} title="Plus-ones allowed" className="field !py-2 !text-sm" />
            </div>
            {events.length > 1 && (
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="text-muted">Invited to:</span>
                {events.map((ev) => {
                  const on = form.events.includes(ev);
                  return <button type="button" key={ev} onClick={() => setForm({ ...form, events: on ? form.events.filter((x) => x !== ev) : [...form.events, ev] })} className={`rounded-full border px-2.5 py-0.5 ${on ? "border-rose bg-rose text-white" : "border-line"}`}>{ev}</button>;
                })}
                <span className="text-muted">{form.events.length ? "" : "(all)"}</span>
              </div>
            )}
            <button className="btn btn-dark w-full !py-2">Add</button>
          </form>
          <div className="glass space-y-2 rounded-3xl p-5">
            <p className="font-medium">Import from a spreadsheet</p>
            <p className="text-xs text-muted">Paste CSV with a header row: <code>name,email,phone,household,events,plus_ones</code> (events separated by <code>|</code>), or choose a .csv file.</p>
            <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={4} placeholder={"name,email,phone,household,events,plus_ones\nOlga Ivanova,olga@example.ru,+79161234567,The Ivanovs,Mehendi|Wedding,1"} className="field !py-2 !text-xs" />
            <div className="flex flex-wrap gap-2">
              <button onClick={async () => { if (csv.trim() && (await call(api, "POST", { csv }))) setCsv(""); }} className="btn btn-dark !py-2">Import</button>
              <label className="btn btn-ghost cursor-pointer !py-2">Choose file<input type="file" accept=".csv,text/csv" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) await call(api, "POST", { csv: await f.text() }); }} /></label>
              <a href={`${api}?format=csv`} className="btn btn-ghost !py-2">Export CSV</a>
              {published && <button onClick={() => call(`${api}/remind`, "POST")} disabled={!email} title={email ? "" : "Email isn't configured — use WhatsApp/Telegram"} className="btn btn-ghost !py-2 disabled:opacity-40">Remind non-responders</button>}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-1 text-sm">
        {(["all", "yes", "no", "waiting"] as const).map((f) => <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 capitalize ${filter === f ? "bg-wine text-[#fbeee6]" : "text-muted hover:bg-white/60"}`}>{f === "yes" ? "Coming" : f === "no" ? "Declined" : f}</button>)}
      </div>

      <div className="mt-4 space-y-4">
        {households.map(([h, members]) => (
          <div key={h} className="glass rounded-3xl p-4">
            {members.length > 1 || members[0].household ? <p className="display mb-2 px-1 text-xl">{h}</p> : null}
            <ul className="divide-y divide-line">
              {members.map((g) => {
                const first = g.name.split(" ")[0];
                const text = g.link ? encodeURIComponent(invite(g.lang ?? lang, names, first, g.link)) : "";
                return (
                  <li key={g.id} className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">{g.name}{g.plus_ones ? <span className="text-muted"> +{g.plus_ones}</span> : null}</p>
                      <p className="truncate text-xs text-muted">{[g.email, g.phone, g.events?.length ? `Invited: ${g.events.join(", ")}` : null, g.opened_at ? "opened ✓" : null].filter(Boolean).join(" · ")}</p>
                      {g.attending != null && (
                        <p className="text-xs">
                          <span className={g.attending ? "text-emerald-700" : "text-muted"}>{g.attending ? `Coming · ${g.party_size}` : "Can’t come"}</span>
                          {[g.plus_one_name && `with ${g.plus_one_name}`, g.meal, g.dietary, g.rsvp_events && Object.entries(g.rsvp_events).filter(([, v]) => v).map(([k]) => k).join(", ")].filter(Boolean).map((x) => ` · ${x}`)}
                          {g.message && <span className="block text-muted">“{g.message}”</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {published && g.link && (
                        <>
                          <button onClick={() => { navigator.clipboard.writeText(g.link!); setNote(`Copied ${first}’s personal link`); }} className="rounded-full border border-line px-3 py-1 text-xs hover:border-rose">Copy link</button>
                          <a target="_blank" href={`https://wa.me/${g.phone?.replace(/^\+/, "") ?? ""}?text=${text}`} className="rounded-full border border-line px-3 py-1 text-xs hover:border-rose">WhatsApp</a>
                          <a target="_blank" href={`https://t.me/share/url?url=${encodeURIComponent(g.link)}&text=${text}`} className="rounded-full border border-line px-3 py-1 text-xs hover:border-rose">Telegram</a>
                        </>
                      )}
                      {editable && <button onClick={() => { if (confirm(`Remove ${g.name}?`)) call(`${api}?guest=${g.id}`, "DELETE"); }} className="rounded-full px-2 py-1 text-xs text-muted hover:text-rose">×</button>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {!guests.length && <p className="py-10 text-center font-display text-2xl italic text-muted">No guests yet — add them above or import a list.</p>}
        {!published && guests.length > 0 && <p className="text-center text-sm text-muted">Personal links and sending unlock once your site is published.</p>}
      </div>

      {guestPhotos && (
        <section className="mt-12">
          <h2 className="display text-3xl">Guest photos</h2>
          <p className="text-sm text-muted">Photos guests share appear on your site only after you approve them.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <figure key={p.id} className={`overflow-hidden rounded-2xl bg-white ${p.approved ? "" : "ring-2 ring-amber-300"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/media?key=${encodeURIComponent(p.key)}`} alt="" className="aspect-square w-full object-cover" />
                <figcaption className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="truncate text-muted">{p.uploader ?? "Guest"}</span>
                  {editable && (
                    <span className="flex gap-2">
                      <button onClick={() => call(`${api}/photos`, "PATCH", { id: p.id, approved: !p.approved })} className="text-wine underline">{p.approved ? "Hide" : "Approve"}</button>
                      <button onClick={() => call(`${api}/photos?photo=${p.id}`, "DELETE")} className="text-muted">×</button>
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
            {!photos.length && <p className="col-span-full text-sm text-muted">None yet.</p>}
          </div>
        </section>
      )}
    </div>
  );
}
