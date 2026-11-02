import { nanoid } from "nanoid";
import { sql } from "@/lib/db";
import { currentUser } from "@/lib/auth/server";
import { canEdit, roleIn } from "@/lib/workspace";
import { presignUpload } from "@/lib/storage";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/svg+xml": "svg" };

// Step 1: presign an upload into the workspace library. Step 2 (PUT to S3) happens in the browser.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const role = await roleIn(user, String(b.workspaceId ?? ""));
  if (!canEdit(role)) return Response.json({ error: "Not allowed" }, { status: 403 });
  const ext = TYPES[b.contentType];
  if (!ext) return Response.json({ error: "Please use a JPG, PNG, WebP, AVIF or SVG image." }, { status: 400 });
  if (Number(b.size) > 15 * 1024 * 1024) return Response.json({ error: "Images must be under 15 MB." }, { status: 400 });
  const key = `workspaces/${b.workspaceId}/${nanoid(14)}.${ext}`;
  const kind = ["photo", "logo", "other"].includes(b.kind) ? b.kind : "photo";
  const weddingId = /^[0-9a-f-]{36}$/i.test(b.weddingId ?? "") ? b.weddingId : null;
  const [asset] = await sql`
    INSERT INTO assets (workspace_id, wedding_id, key, name, kind, content_type, size, created_by)
    VALUES (${b.workspaceId}, ${weddingId}, ${key}, ${String(b.name ?? "").slice(0, 160) || null}, ${kind}, ${b.contentType}, ${Number(b.size) || null}, ${user.id})
    RETURNING id, key, name, kind`;
  return Response.json({ asset, url: await presignUpload(key, b.contentType) });
}

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const ws = new URL(req.url).searchParams.get("workspace") ?? "";
  if (!(await roleIn(user, ws))) return Response.json({ error: "Not allowed" }, { status: 403 });
  const assets = await sql`SELECT id, key, name, kind, created_at FROM assets WHERE workspace_id = ${ws} ORDER BY created_at DESC LIMIT 300`;
  return Response.json({ assets });
}
