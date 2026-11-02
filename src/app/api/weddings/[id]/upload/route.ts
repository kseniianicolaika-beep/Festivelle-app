import { nanoid } from "nanoid";
import { requireOwner } from "@/lib/guard";
import { presignUpload } from "@/lib/storage";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = await requireOwner(id);
  if ("error" in g) return g.error;
  const { contentType } = await req.json();
  const ext = TYPES[contentType];
  if (!ext) return Response.json({ error: "Please use a JPG, PNG, WebP or AVIF photo." }, { status: 400 });
  const key = `weddings/${id}/hero-${nanoid(10)}.${ext}`;
  return Response.json({ key, url: await presignUpload(key, contentType) });
}
