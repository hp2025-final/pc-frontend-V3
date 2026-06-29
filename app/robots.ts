import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/_next/static/"],
      disallow: [
        "/search",    // Search queries consume crawl budget and lead to index bloat
        "/api/",      // Next.js API directory should not be crawled
        "/_next/",    // Next.js build files (but static assets are allowed above)
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
