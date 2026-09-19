import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getAllVehicles } from "@/lib/vehicles";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const bilingual = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly", lastModified = now) => [
    {
      url: `${base}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: { de: `${base}${path}`, en: `${base}/en${path}` } },
    },
    {
      url: `${base}/en${path}`,
      lastModified,
      changeFrequency,
      priority: Math.max(0.1, priority - 0.1),
      alternates: { languages: { de: `${base}${path}`, en: `${base}/en${path}` } },
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = [
    ...bilingual("", 1, "weekly"),
    ...bilingual("/fahrzeuge", 0.9, "daily"),
    { url: `${base}/impressum`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/datenschutz`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  let vehicleEntries: MetadataRoute.Sitemap = [];
  try {
    const vehicles = await getAllVehicles();
    vehicleEntries = vehicles
      .filter((v) => v.status !== "sold")
      .flatMap((v) => bilingual(`/fahrzeuge/${v.id}`, 0.7, "weekly", new Date(v.updated_at)));
  } catch (err) {
    console.error("Sitemap: Fahrzeuge konnten nicht geladen werden:", err);
  }

  return [...staticEntries, ...vehicleEntries];
}
