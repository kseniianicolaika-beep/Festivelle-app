import { getPricing, currencyFor } from "@/lib/pricing";

// Public price list (the admin edits it at /admin/pricing).
export async function GET(req: Request) {
  const pricing = await getPricing();
  const country = req.headers.get("x-vercel-ip-country");
  return Response.json({ pricing, currency: currencyFor(country) });
}
