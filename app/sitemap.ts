import type { MetadataRoute } from "next";
import { airlines, pageSlug } from "@/lib/airlines";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = airlines.map((a) => a.last_checked).sort().at(-1);
  return [
    { url: `${SITE_URL}/`, lastModified: latest, priority: 1 },
    ...airlines.map((a) => ({ url: `${SITE_URL}/${pageSlug(a)}`, lastModified: a.last_checked, priority: 0.9 })),
    { url: `${SITE_URL}/compare`, lastModified: latest, priority: 0.8 },
    ...["about", "privacy", "disclaimer", "affiliate-disclosure"].map((p) => ({ url: `${SITE_URL}/${p}`, priority: 0.3 })),
  ];
}
