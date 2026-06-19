import { MetadataRoute } from "next";
import { getCategories, getBrands } from "@/lib/woocommerce";

// Force dynamic rendering - NOT generated at build time
export const dynamic = "force-dynamic";
export const revalidate = 604800; // Cache for 7 days after first request

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  try {
    const [categories, brands] = await Promise.all([
      getCategories(),
      getBrands(),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${siteUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${siteUrl}/brand/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const allRoutes = [...categoryRoutes, ...brandRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified instanceof Date ? route.lastModified.toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch (error) {
    console.error("Error generating categories sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
