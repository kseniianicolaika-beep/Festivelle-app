import { currentUser } from "@/lib/auth/server";
import { activeWorkspace, canEdit } from "@/lib/workspace";
import { templateById } from "@/lib/catalog";
import { isOccasion } from "@/lib/occasions";
import { createCelebration, editorUrl, isProduct } from "@/lib/create";

// Entry point for every "Customize / Create" link on festivelle.love.
//   /start?template=<id>&product=invite|website|video&tier=…&lang=…   → celebration created with that template, right editor opens
//   /start?idea=<text>&o=<occasion>&product=…                          → AI Creator: studio chat starts with the idea
//   /start?o=<occasion>&tag=<tag>&product=…  |  /start?product=…        → template picker (filtered)
// Signed-out visitors go through sign-up and come straight back here (next=).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams;
  const to = (path: string) => Response.redirect(new URL(path, url.origin), 303);
  const user = await currentUser();
  if (!user) {
    const next = `/start${url.search}`;
    const lang = q.get("lang") === "ru" ? "&lang=ru" : "";
    return to(`/auth/sign-up?next=${encodeURIComponent(next)}${lang}`);
  }
  const { current } = await activeWorkspace(user);
  if (!canEdit(current.role)) return to("/studio");
  const product = isProduct(q.get("product")) ? q.get("product")! : null;
  const tier = q.get("tier");
  const template = templateById(q.get("template") ?? "");
  const idea = (q.get("idea") ?? "").trim().slice(0, 1000);
  const occasion = q.get("o") ?? q.get("occasion");
  const lang = q.get("lang") === "ru" ? "ru" : null;

  if (template || idea) {
    const id = await createCelebration({ workspaceId: current.id, ownerId: user.id, template: template?.id, occasion: isOccasion(occasion) ? occasion : idea ? guessOccasion(idea) : null, language: lang, tradition: q.get("holiday") });
    return to(editorUrl(id, { product, idea: idea || null, tier }));
  }
  const pick = new URLSearchParams();
  if (isOccasion(occasion)) pick.set("o", occasion);
  for (const k of ["tag", "tier"]) if (q.get(k)) pick.set(k, q.get(k)!.slice(0, 40));
  if (product) pick.set("product", product);
  return to(`/studio/new${pick.size ? `?${pick}` : ""}`);
}

// AI Creator without an explicit occasion: a light keyword guess; the conversation can still change it.
function guessOccasion(idea: string) {
  const s = idea.toLowerCase();
  const rules: [RegExp, string][] = [
    [/bridal shower|hen party|девичник/, "bridal_shower"], [/rehearsal/, "rehearsal_dinner"], [/gender reveal|гендер/, "gender_reveal"],
    [/baptis|christening|крестин|naamkaran/, "baptism"], [/baby shower|godh bharai|бэби/, "baby_shower"], [/engage|помолв|roka/, "engagement"],
    [/anniversar|годовщин/, "anniversary"], [/wedding|marri|свадьб|shaadi|nikah/, "wedding"], [/kid|child|turning \d\b|детск/, "kids"],
    [/birthday|день рожд|юбилей/, "birthday"], [/conference|summit|конференц/, "conference"], [/launch|запуск/, "product_launch"],
    [/network|meetup|mixer/, "networking"], [/corporate|company|office|team|корпоратив/, "corporate_party"],
    [/diwali|christmas|new year|easter|holi\b|eid|maslenitsa|рождеств|новый год|пасх|маслениц/, "holiday"],
    [/housewarming|griha|новосель/, "housewarming"], [/dinner|ужин/, "dinner_party"], [/card|greeting|открытк/, "greeting"],
  ];
  return rules.find(([r]) => r.test(s))?.[1] ?? "special";
}
