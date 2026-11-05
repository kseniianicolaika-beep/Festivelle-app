import { cookies } from "next/headers";
import { sql } from "@/lib/db";

// Partner referral link: festivelle.com/r/CODE — remembered for 60 days and credited on purchase.
export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.slice(0, 40);
  const r = (await sql`UPDATE partners SET clicks = clicks + 1 WHERE ref_code = ${code} AND active RETURNING ref_code`) as unknown[];
  if (r.length) (await cookies()).set("fv_ref", code, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 60 });
  return Response.redirect(new URL("/studio/new", req.url), 303);
}
