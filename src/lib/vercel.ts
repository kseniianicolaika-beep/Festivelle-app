// Native Vercel integration: attach a couple's own domain (e.g. anya-and-rohan.com) to this Vercel project.
export const vercelEnabled = () => !!(process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID);

export async function addDomain(domain: string) {
  const team = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : "";
  const res = await fetch(`https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains${team}`, {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ name: domain }),
  });
  const body = await res.json();
  if (!res.ok && body?.error?.code !== "domain_already_in_use") throw new Error(body?.error?.message ?? "Vercel error");
  return body as { verified?: boolean; verification?: { type: string; domain: string; value: string }[] };
}
