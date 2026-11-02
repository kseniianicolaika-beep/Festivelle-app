import { currentUser } from "./auth/server";
import { getWeddingForUser } from "./db";
import { canEdit } from "./workspace";

// Any member may read; only owner/admin/designer may change a wedding.
export async function requireWedding(id: string, { edit = true } = {}) {
  const user = await currentUser();
  if (!user) return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const wedding = await getWeddingForUser(id, user);
  if (!wedding) return { error: Response.json({ error: "Not found" }, { status: 404 }) } as const;
  if (edit && !canEdit(wedding.role)) return { error: Response.json({ error: "You have view-only access to this wedding." }, { status: 403 }) } as const;
  return { user, wedding } as const;
}
/** @deprecated use requireWedding */
export const requireOwner = (id: string) => requireWedding(id);

export const appUrl = (req: Request) => process.env.APP_URL || new URL(req.url).origin;
export const mediaUrl = (key?: string | null) => (key ? `/api/media?key=${encodeURIComponent(key)}` : null);
