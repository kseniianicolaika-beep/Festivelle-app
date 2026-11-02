import { createNeonAuth } from "@neon/auth/next/server";
import { connection } from "next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
});

export async function currentUser() {
  await connection(); // session is per-request; never prerender it
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}
