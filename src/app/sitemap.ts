import type { MetadataRoute } from "next";

const BASE = "https://ppppcn.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/work`,     lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/analyze`,  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/login`,    lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/signup`,   lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
  return routes;
}
