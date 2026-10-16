import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/tickets";

// /robots.txt: keep private areas out of search results and point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/ticket/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
