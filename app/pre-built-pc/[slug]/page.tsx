import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByIds, getProducts } from "@/lib/woocommerce";
import { stripHtml, getPriceTagInfo, getProductMeta, formatPrice } from "@/lib/utils";
import PreBuiltPCPageClient from "./PreBuiltPCPageClient";
import ExpertAndWhySections from "./ExpertAndWhySections";

interface PreBuiltPCPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

// Generate metadata for SEO
export async function generateMetadata({ params }: PreBuiltPCPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const priceInfo = getPriceTagInfo(product);
  
  // ─── EXTRACT ATTRIBUTES ───────────────────────────────────────────
  
  // 1. Brand
  const brandAttr = product.attributes?.find((a) => a.name.toLowerCase() === "brand");
  const brand = brandAttr?.options?.[0] || null;
  
  // 2. Series/Model
  const seriesAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === "series" || 
           a.name.toLowerCase() === "model" ||
           a.name.toLowerCase().includes("series") ||
           a.name.toLowerCase().includes("model")
  );
  const series = seriesAttr?.options?.[0] || null;
  
  // 3. Warranty
  const warrantyAttr = product.attributes?.find((a) => 
    a.name.toLowerCase().includes("warranty")
  );
  const warranty = warrantyAttr?.options?.[0] || null;
  
  // 4. Condition
  const conditionAttr = product.attributes?.find((a) => 
    a.name.toLowerCase().includes("condition")
  );
  const condition = conditionAttr?.options?.[0] || null;

  // ─── BUILD META TITLE ──────────────────────────────────────────────
  
  let metaTitle = "";
  
  if (brand && series) {
    // Both available: Brand Series/Model Price in Pakistan | PC Wala Karachi
    metaTitle = `${brand} ${series} Price in Pakistan | PC Wala Karachi`;
  } else {
    // Missing either: Product Name Price in Pakistan | PC Wala Karachi
    metaTitle = `${product.name} Price in Pakistan | PC Wala Karachi`;
  }
  
  // Truncate if too long (keep under 60 chars)
  if (metaTitle.length > 60) {
    metaTitle = metaTitle.slice(0, 57) + "...";
  }

  // ─── BUILD META DESCRIPTION (SCENARIO-AWARE) ───────────────────────
  
  let description = "";
  
  // Product reference for description
  const productRef = (brand && series) ? `${brand} ${series}` : product.name;
  
  // Warranty & Condition text (with fallback)
  let metaDetails = "";
  if (warranty && condition) {
    metaDetails = `${condition}, ${warranty}.`;
  } else if (warranty) {
    metaDetails = `${warranty}. Tested product, free WhatsApp support for hardware compatibility.`;
  } else if (condition) {
    metaDetails = `${condition}. Tested product, free WhatsApp support for hardware compatibility.`;
  } else {
    // No warranty or condition
    metaDetails = `Tested product, free WhatsApp support for hardware compatibility.`;
  }
  
  // SCENARIO 0: HIGH FLUCTUATION (Shift Tag)
  if (priceInfo.tagType === "shift") {
    const maxP = priceInfo.priceMax ? formatPrice(priceInfo.priceMax) : "";
    const minP = priceInfo.priceMin ? formatPrice(priceInfo.priceMin) : "";
    description = `${productRef} price fluctuating in Pakistan (${minP} - ${maxP}). ${metaDetails} Buy at PC Wala Karachi.`;
  }
  
  // SCENARIO 1: PRICE DOWN
  else if (priceInfo.tagType === "price-down") {
    const currentP = formatPrice(priceInfo.displayPrice);
    const wasP = priceInfo.wasPrice ? formatPrice(priceInfo.wasPrice) : "";
    description = `${productRef} price dropped ${priceInfo.percentage}% in Pakistan! Now ${currentP} (was ${wasP}). ${metaDetails} Shop at PC Wala Karachi.`;
  }
  
  // SCENARIO 2: PRICE UP
  else if (priceInfo.tagType === "price-up") {
    const currentP = formatPrice(priceInfo.displayPrice);
    const wasP = priceInfo.wasPrice ? formatPrice(priceInfo.wasPrice) : "";
    description = `${productRef} price increased +${priceInfo.percentage}% in Pakistan. Now ${currentP} (was ${wasP}). ${metaDetails} Available at PC Wala Karachi.`;
  }
  
  // SCENARIO 3: ON SALE (Standard WooCommerce Sale)
  else if (product.on_sale && product.sale_price && product.regular_price) {
    const saleP = formatPrice(product.sale_price);
    const regP = formatPrice(product.regular_price);
    const discount = Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100);
    description = `${productRef} on SALE in Pakistan! Save ${discount}%: ${saleP} (was ${regP}). ${metaDetails} Shop at PC Wala Karachi.`;
  }
  
  // SCENARIO 4: MARKET PRICE (Stable)
  else {
    const currentP = formatPrice(priceInfo.displayPrice);
    description = `Buy ${productRef} in Pakistan at ${currentP}. ${metaDetails} Available at PC Wala Karachi with nationwide delivery.`;
  }

  return {
    title: metaTitle,
    description: description.slice(0, 160), // Google displays ~155-160 chars
    openGraph: {
      title: metaTitle,
      description: description.slice(0, 160),
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

// Server Component - Fetches data and passes to client component
export default async function PreBuiltPCPage({ params }: PreBuiltPCPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products — prioritize same-category (Pre-Built PCs) products
  let relatedProducts: typeof product[] = [];

  // Step 1: Fetch from deepest child category first (e.g., Lizard Series)
  const deepestCategory = product.categories && product.categories.length > 0
    ? product.categories[product.categories.length - 1]
    : null;

  if (deepestCategory) {
    const categoryProducts = await getProducts({
      category: String(deepestCategory.id),
      per_page: 12,
    });

    const existingIds = new Set([product.id]);
    for (const p of categoryProducts) {
      if (!existingIds.has(p.id)) {
        relatedProducts.push(p);
        existingIds.add(p.id);
      }
      if (relatedProducts.length >= 6) break;
    }
  }

  // Step 2: If still fewer than 6, backfill from parent category (Pre-Built PCs)
  if (relatedProducts.length < 6) {
    const parentCategory = product.categories && product.categories.length > 1
      ? product.categories[0]
      : null;

    if (parentCategory && parentCategory.id !== deepestCategory?.id) {
      const parentProducts = await getProducts({
        category: String(parentCategory.id),
        per_page: 12,
      });

      const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
      for (const p of parentProducts) {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
          existingIds.add(p.id);
        }
        if (relatedProducts.length >= 6) break;
      }
    }
  }

  // Step 3: Last resort — WooCommerce related_ids
  if (relatedProducts.length < 6) {
    const relatedIds = product.related_ids?.slice(0, 6) || [];
    if (relatedIds.length > 0) {
      const wcRelated = await getProductsByIds(relatedIds);
      const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
      for (const p of wcRelated) {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
          existingIds.add(p.id);
        }
        if (relatedProducts.length >= 6) break;
      }
    }
  }

  // Ensure exactly 6
  relatedProducts = relatedProducts.slice(0, 6);

  const priceInfo = getPriceTagInfo(product);
  const { brandName, condition } = getProductMeta(product);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  // Extract model/series for schema
  const seriesAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === "series" || 
           a.name.toLowerCase() === "model" ||
           a.name.toLowerCase().includes("series") ||
           a.name.toLowerCase().includes("model")
  );
  const modelNumber = seriesAttr?.options?.[0] || "";

  // Get category for schema
  const category = product.categories && product.categories.length > 0
    ? product.categories[product.categories.length - 1]
    : null;

  // 1. Offer Object
  let offersObj: any = {};
  if (priceInfo.tagType === "shift") {
    offersObj = {
      "@type": "AggregateOffer",
      "priceCurrency": "PKR",
      "lowPrice": priceInfo.priceMin || (parseFloat(priceInfo.displayPrice) * 0.9).toString(),
      "highPrice": priceInfo.priceMax || priceInfo.displayPrice,
      "offerCount": "1",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${siteUrl}/pre-built-pc/${product.slug}`,
    };
  } else {
    offersObj = {
      "@type": "Offer",
      "price": priceInfo.displayPrice,
      "priceCurrency": "PKR",
      "priceValidUntil": "2027-12-31",
      "itemCondition": condition === "Used" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${siteUrl}/pre-built-pc/${product.slug}`,
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "PKR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "PK"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "0",
            "maxValue": "1",
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "4",
            "unitCode": "DAY"
          }
        }
      }
    };
  }

  // 2. Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "model": modelNumber || undefined,
    "mpn": product.sku || product.id.toString(),
    "category": category?.name || "Pre-Built PC",
    "image": product.images?.map((img) => img.src) || [],
    "description": stripHtml(product.short_description || product.description).slice(0, 300),
    "sku": product.sku || product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    "offers": offersObj
  };

  // 3. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category?.name.toUpperCase() || "PRE-BUILT PCS",
        "item": category ? `${siteUrl}/category/${category.slug}` : `${siteUrl}/#categories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${siteUrl}/pre-built-pc/${product.slug}`
      }
    ]
  };

  // Pass all data to client component for interactivity, and inject JSON-LD schemas
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PreBuiltPCPageClient product={product} relatedProducts={relatedProducts}>
        <ExpertAndWhySections product={product} />
      </PreBuiltPCPageClient>
    </>
  );
}
