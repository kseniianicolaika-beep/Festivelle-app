import type { TemplateDef } from "@/lib/catalog";
import { PosterWall } from "./landing/PosterWall";

// Kept for existing callers (SEO landing pages, collections): now the live poster wall.
export function TemplateGrid({ list, empty }: { list: TemplateDef[]; empty?: string }) {
  return <PosterWall list={list} cols="grid" empty={empty} />;
}
