import { currentUser } from "./auth/server";
import { getWeddingForUser } from "./db";

export async function requireOwner(id: string) {
  const user = await currentUser();
  if (!user) return { error: Response.json({ error: "Unauthorized" }, { status: 401 }) } as const;
  const wedding = await getWeddingForUser(id, user);
  if (!wedding) return { error: Response.json({ error: "Not found" }, { status: 404 }) } as const;
  return { user, wedding } as const;
}

export const appUrl = (req: Request) => process.env.APP_URL || new URL(req.url).origin;
export const mediaUrl = (key?: string) => (key ? `/api/media?key=${encodeURIComponent(key)}` : null);
