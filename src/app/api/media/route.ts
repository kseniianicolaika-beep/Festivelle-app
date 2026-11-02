import { presignRead } from "@/lib/storage";

// Private bucket → short-lived signed URL. Only wedding/workspace media keys (unguessable ids) are servable.
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!/^(weddings|workspaces)\/[0-9a-f-]{36}\/[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  return Response.redirect(await presignRead(key), 302);
}
