import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByIds, getProducts } from "@/lib/woocommerce";
import { stripHtml } from "@/lib/utils";
import ProductPageClient from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 5 minutes
export const revalidate = 300;

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = stripHtml(product.short_description || product.description);

  return {
    title: `${product.name} | PC Wala Online`,
    description: description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: description.slice(0, 160),
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

// Server Component - Fetches data and passes to client component
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedIds = product.related_ids?.slice(0, 6) || [];
  let relatedProducts = relatedIds.length > 0 ? await getProductsByIds(relatedIds) : [];

  // If we have fewer than 6 related products, backfill with same-category products
  if (relatedProducts.length < 6) {
    const deepestCategory = product.categories && product.categories.length > 0
      ? product.categories[product.categories.length - 1]
      : null;

    if (deepestCategory) {
      const categoryProducts = await getProducts({
        category: String(deepestCategory.id),
        per_page: 12,
      });

      const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
      for (const p of categoryProducts) {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
          existingIds.add(p.id);
        }
        if (relatedProducts.length >= 6) {
          break;
        }
      }
    }
  }

  // If still fewer than 6, backfill with general products
  if (relatedProducts.length < 6) {
    const generalProducts = await getProducts({
      per_page: 12,
    });

    const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
    for (const p of generalProducts) {
      if (!existingIds.has(p.id)) {
        relatedProducts.push(p);
        existingIds.add(p.id);
      }
      if (relatedProducts.length >= 6) {
        break;
      }
    }
  }

  // Ensure exactly 6
  relatedProducts = relatedProducts.slice(0, 6);

  // Pass all data to client component for interactivity
  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}

