import { presignRead } from "@/lib/storage";

// Private bucket → short-lived signed URL. Only wedding/workspace media keys (unguessable ids) are servable.
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!/^(weddings|workspaces)\/[0-9a-f-]{36}\/[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  const url = await presignRead(key);
  // ?raw=1 streams the bytes same-origin (the photo cropper needs an untainted canvas).
  if (new URL(req.url).searchParams.get("raw") === "1") {
    const r = await fetch(url);
    if (!r.ok || !r.body) return new Response("Not found", { status: 404 });
    return new Response(r.body, { headers: { "content-type": r.headers.get("content-type") ?? "image/jpeg", "cache-control": "private, max-age=300" } });
  }
  return Response.redirect(url, 302);
}
