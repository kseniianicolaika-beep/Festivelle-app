import { NextResponse, type NextRequest } from "next/server";

// Couples' custom domains point at this Vercel project. Any host that isn't the app's own is treated as a wedding domain.
const APP_HOST = /(^localhost(:\d+)?$)|(\.vercel\.app$)/;

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const own = (process.env.APP_HOSTS ?? "").split(",").map((h) => h.trim()).filter(Boolean);
  if (!host || APP_HOST.test(host) || own.includes(host)) return NextResponse.next();
  if (req.nextUrl.pathname === "/") return NextResponse.rewrite(new URL(`/d/${encodeURIComponent(host)}`, req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
