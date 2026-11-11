import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth/server";

// The app has no landing page: festivelle.love is the public front door. Here, signed-in people go to
// their studio and everyone else to sign-in (which links back to the website for browsing).
export default async function Home() {
  const me = await currentUser().catch(() => null);
  redirect(me ? "/studio" : "/auth/sign-in");
}
