import type { Metadata } from "next";
import { getWeddingBySlug } from "@/lib/db";
import { displayNames } from "@/lib/occasions";
import { formatDate } from "@/lib/profile";
import { SiteBySlug } from "./SiteBySlug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = await getWeddingBySlug((await params).slug);
  if (!w) return {};
  return { title: displayNames(w.profile), description: [formatDate(w.profile.date, w.profile.language), w.profile.venue || w.profile.city].filter(Boolean).join(" · "), robots: { index: false } };
}

export default async function Site({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ g?: string }> }) {
  return <SiteBySlug slug={(await params).slug} g={(await searchParams).g} />;
}


export const instant = false;
