import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
