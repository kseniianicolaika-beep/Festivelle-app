import { NextResponse, type NextRequest } from "next/server";

// The app's own hosts pass through. Everything else is a celebration site:
//  • <subdomain>.ROOT_DOMAIN — personal links, e.g. anna-mark.festivelle.com
//  • a host's custom domain (connected through the Vercel Domains API)
const APP_HOST = /(^localhost(:\d+)?$)|(\.vercel\.app$)/;

export function proxy(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const root = (process.env.ROOT_DOMAIN ?? "").toLowerCase();
  const own = (process.env.APP_HOSTS ?? "").split(",").map((h) => h.trim()).filter(Boolean);
  if (root) own.push(root, `www.${root}`, `app.${root}`);
  if (!host || APP_HOST.test(host) || own.includes(host)) {
    // Signed-out visitors to the app's "/" get a real redirect to the public site (festivelle.love);
    // signed-in ones fall through to the page, which sends them to /studio. ?preview=1 keeps the legacy landing.
    const signedIn = req.cookies.getAll().some((c) => c.name.includes("neon-auth.session_token"));
    if (req.nextUrl.pathname === "/" && !signedIn && !req.nextUrl.searchParams.has("preview")) {
      const site = (process.env.SITE_URL || "https://festivelle.love").replace(/\/$/, "");
      return NextResponse.redirect(`${site}${req.nextUrl.searchParams.get("lang") === "ru" ? "/ru/" : "/"}`, 307);
    }
    return NextResponse.next();
  }
  if (req.nextUrl.pathname === "/") return NextResponse.rewrite(new URL(`/d/${encodeURIComponent(host)}${req.nextUrl.search}`, req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/"] };
