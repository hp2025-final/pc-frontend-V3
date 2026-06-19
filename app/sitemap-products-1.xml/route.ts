import { MetadataRoute } from "next";
import { getProducts } from "@/lib/woocommerce";

// Force dynamic rendering - NOT generated at build time
export const dynamic = "force-dynamic";
export const revalidate = 604800; // Cache for 7 days after first request

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  try {
    console.log("[Sitemap Products 1] Fetching products 1-1000...");
    
    // Fetch products 1-1000 (pages 1-10)
    const productPromises = [];
    for (let page = 1; page <= 10; page++) {
      productPromises.push(getProducts({ per_page: 100, page }));
    }
    
    const batches = await Promise.all(productPromises);
    const products = batches.flat();
    
    console.log(`[Sitemap Products 1] Fetched ${products.length} products`);

    const productRoutes: MetadataRoute.Sitemap = products.map((prod) => {
      const hasVolatileTag = prod.tags?.some(
        (t) => t.slug === "price-down" || t.slug === "price-up" || t.slug === "shift"
      );

      return {
        url: `${siteUrl}/product/${prod.slug}`,
        lastModified: new Date(prod.date_modified || new Date()),
        changeFrequency: hasVolatileTag ? "hourly" : "daily",
        priority: hasVolatileTag ? 0.9 : 0.8,
      };
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${productRoutes
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
    console.error("Error generating products-1 sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
