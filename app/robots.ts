import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
