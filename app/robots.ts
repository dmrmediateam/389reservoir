import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.seo.index ? { userAgent: "*", allow: "/", disallow: "/api/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
