"use client";
export type Asset = { id: string; key: string; name: string | null; kind: "photo" | "logo" | "other" };
export const assetUrl = (key: string) => `/api/media?key=${encodeURIComponent(key)}`;

// Presign → PUT straight to Neon Object Storage. Returns the library asset.
export async function uploadAsset(file: File, workspaceId: string, opts: { kind?: Asset["kind"]; weddingId?: string } = {}): Promise<Asset> {
  const r = await fetch("/api/assets", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ workspaceId, contentType: file.type, size: file.size, name: file.name, kind: opts.kind ?? "photo", weddingId: opts.weddingId }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error ?? "Upload failed");
  const put = await fetch(data.url, { method: "PUT", headers: { "content-type": file.type }, body: file });
  if (!put.ok) {
    await fetch(`/api/assets/${data.asset.id}`, { method: "DELETE" });
    throw new Error("Upload failed — please try again.");
  }
  return data.asset;
}
