import { nanoid } from "nanoid";
import { getWeddingBySlug, sql } from "@/lib/db";
import { isExpired } from "@/lib/commerce";
import { getPricing } from "@/lib/pricing";
import { priceGroup } from "@/lib/occasions";
import { presignUpload } from "@/lib/storage";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic" };
const guestUploadsAllowed = (tier: string | null) => tier === "premium" || tier === "luxury";

// Approved guest photos (public on the live site).
export async function GET(req: Request) {
  const w = await getWeddingBySlug(new URL(req.url).searchParams.get("slug") ?? "");
  if (!w?.published || isExpired(w)) return Response.json({ photos: [] });
  const photos = await sql`SELECT id, key, uploader, caption FROM guest_photos WHERE wedding_id = ${w.id} AND approved ORDER BY created_at DESC LIMIT 300`;
  return Response.json({ photos });
}

// A guest uploads a photo: presigned PUT; it waits for the hosts' approval before appearing.
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const w = await getWeddingBySlug(String(b.slug ?? ""));
  if (!w?.published || isExpired(w)) return Response.json({ error: "This page isn’t accepting photos." }, { status: 404 });
  if (!guestUploadsAllowed(w.tier)) return Response.json({ error: "Guest photo sharing isn’t switched on for this celebration." }, { status: 403 });
  const ext = TYPES[String(b.contentType)];
  if (!ext) return Response.json({ error: "Please share a JPG, PNG, WebP or HEIC photo." }, { status: 400 });
  if (Number(b.size) > 15 * 1024 * 1024) return Response.json({ error: "Photos must be under 15 MB." }, { status: 400 });
  const P = await getPricing();
  const cap = P.packages[priceGroup(w.profile)][w.tier as "premium" | "luxury"].galleryPhotos;
  const [{ n }] = (await sql`SELECT count(*)::int AS n FROM guest_photos WHERE wedding_id = ${w.id}`) as { n: number }[];
  if (n >= cap) return Response.json({ error: "The gallery is full — thank you for wanting to share!" }, { status: 409 });
  const key = `weddings/${w.id}/guest-${nanoid(16)}.${ext}`;
  await sql`INSERT INTO guest_photos (wedding_id, key, uploader, caption) VALUES (${w.id}, ${key}, ${String(b.uploader ?? "").trim().slice(0, 80) || null}, ${String(b.caption ?? "").trim().slice(0, 200) || null})`;
  return Response.json({ url: await presignUpload(key, String(b.contentType)) });
}
