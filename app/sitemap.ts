import { MetadataRoute } from "next";

// Main sitemap index - lists all sub-sitemaps
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  return [
    {
      url: `${siteUrl}/sitemap-static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/sitemap-categories.xml`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/sitemap-products-1.xml`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/sitemap-products-2.xml`,
      lastModified: new Date(),
    },
  ];
}
