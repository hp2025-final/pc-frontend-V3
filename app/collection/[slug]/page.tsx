import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsWithCount, getTagBySlug, getBrands } from "@/lib/woocommerce";
import { getPriceTagInfo } from "@/lib/utils";
import { WooCommerceProduct } from "@/lib/types";
import PCD_2 from "@/components/PCD_2";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryControls from "@/components/CategoryControls";
import styles from "./collection.module.css";

// ISR — revalidate every 12 hours
export const revalidate = 43200;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    price?: string;
    brand?: string;
    search?: string;
  }>;
}

// ─── Price mapping ────────────────────────────────────────────────────────
const PRICE_RANGES: Record<string, { min: string; max: string }> = {
  "1000-25000": { min: "1000", max: "25000" },
  "25000-50000": { min: "25000", max: "50000" },
  "50000-75000": { min: "50000", max: "75000" },
  "75000-100000": { min: "75000", max: "100000" },
  "100000-150000": { min: "100000", max: "150000" },
  "150000-200000": { min: "150000", max: "200000" },
  "200000-300000": { min: "200000", max: "300000" },
  "300000-400000": { min: "300000", max: "400000" },
  "400000-500000": { min: "400000", max: "500000" },
};

// Supported dynamic collections mapping
const COLLECTION_MAPPING: Record<string, { tagSlug: string; title: string; description: string }> = {
  "price-drops": {
    tagSlug: "price-down",
    title: "Price Drops",
    description: "Explore the latest computer hardware and gaming PC components price drops at PC Wala Online. Authentic tech items with transparent pricing and warranty."
  },
  "high-fluctuation": {
    tagSlug: "shift",
    title: "Market Fluctuation",
    description: "Track the real-time volatile computer hardware prices in Karachi. View minimum and maximum price ranges and secure rates directly on WhatsApp."
  },
  "price-increases": {
    tagSlug: "price-up",
    title: "Price Increases",
    description: "Track the recent price increases and market updates for computer hardware and PC components in Pakistan."
  },
  "price-up": {
    tagSlug: "price-up",
    title: "Price Increases",
    description: "Track the recent price increases and market updates for computer hardware and PC components in Pakistan."
  },
  "market-price": {
    tagSlug: "",
    title: "Market Price",
    description: "Explore computer hardware and PC components available at stable market rates in Karachi."
  },
  "on-sale": {
    tagSlug: "",
    title: "On Sale",
    description: "Check out the latest discounted deals and promotional sales on computer hardware at PC Wala Online."
  }
};

// ─── Pagination helper ───────────────────────────────────────────────────────
function generatePageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  if (total > 1) pages.push(total);
  return pages;
}

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = COLLECTION_MAPPING[slug];

  if (!config) return { title: "Collection Not Found" };

  return {
    title: `${config.title} in Pakistan | PC Wala Online`,
    description: config.description,
  };
}

// ─── Page Component ────────────────────────────────────────────────────────
export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { page, sort, price, brand, search } = await searchParams;

  const config = COLLECTION_MAPPING[slug];
  if (!config) notFound();

  // Fetch all brands to populate the brand filter dropdown
  const brands = await getBrands();

  // Fetch the dynamic tag object from WooCommerce by slug if defined
  const tag = config.tagSlug ? await getTagBySlug(config.tagSlug) : null;
  if (config.tagSlug && !tag) {
    // If the tag doesn't exist in WooCommerce yet, show empty state gracefully
    console.warn(`WooCommerce tag "${config.tagSlug}" not found for collection: ${slug}`);
  }

  const PER_PAGE = 30;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const currentSort = sort || "latest";
  const currentPrice = price || "all";
  const currentBrand = brand || "all";
  const currentSearch = search || "";

  // Resolve brand numeric ID for API querying
  const selectedBrandObj = brands.find((b) => b.slug === currentBrand);
  const brandIdParam = selectedBrandObj ? String(selectedBrandObj.id) : undefined;

  // ── Sort mapping ────────────────────────────────────────────────────────
  let orderby: "date" | "price" | "title" | "popularity" = "date";
  let order: "asc" | "desc" = "desc";

  switch (currentSort) {
    case "oldest":
      orderby = "date"; order = "asc"; break;
    case "price_high":
      orderby = "price"; order = "desc"; break;
    case "price_low":
      orderby = "price"; order = "asc"; break;
    default: // latest
      orderby = "date"; order = "desc"; break;
  }

  // ── Price mapping ────────────────────────────────────────────────────────
  const priceRange = currentPrice !== "all" ? PRICE_RANGES[currentPrice] : null;

  // ── Fetch products filtered by tag and search inputs ──────────────────────
  let products: WooCommerceProduct[] = [];
  let totalCount = 0;
  let totalPages = 1;

  if (tag) {
    const res = await getProductsWithCount({
      tag: String(tag.id),
      page: currentPage,
      per_page: PER_PAGE,
      orderby,
      order,
      ...(priceRange ? { min_price: priceRange.min, max_price: priceRange.max } : {}),
      ...(brandIdParam ? { brand: brandIdParam } : {}),
      ...(currentSearch ? { search: currentSearch } : {}),
    });
    products = res.products;
    totalCount = res.totalCount;
    totalPages = Math.max(1, res.totalPages);
  } else {
    // If the WooCommerce tag doesn't exist, or it is the "market-price" / "on-sale" page (which does not use a pricing tag by definition),
    // fetch products and filter them in memory based on the pricing scenarios.
    const res = await getProductsWithCount({
      page: 1,
      per_page: 100, // Fetch a large batch to filter
      orderby,
      order,
      ...(slug === "on-sale" ? { on_sale: true } : {}),
      ...(priceRange ? { min_price: priceRange.min, max_price: priceRange.max } : {}),
      ...(brandIdParam ? { brand: brandIdParam } : {}),
      ...(currentSearch ? { search: currentSearch } : {}),
    });

    console.log(`[Collection fallback: ${slug}] Fetched ${res.products.length} products from WooCommerce API.`);

    const filtered = res.products.filter((product) => {
      const priceInfo = getPriceTagInfo(product);

      // Check if product has any of the pricing tags: price-up, price-down, or shift
      const hasPricingTag = product.tags && product.tags.some((t) => 
        t.slug === "price-up" || t.slug === "price-down" || t.slug === "shift"
      );

      const hasRegularPrice = product.regular_price && parseFloat(product.regular_price) > 0;
      const hasSalePrice = product.sale_price && parseFloat(product.sale_price) > 0;

      if (slug === "market-price") {
        // Market Price: Only Regular Price, NO Sale Price, NO Pricing Tags
        return !hasPricingTag && hasRegularPrice && !hasSalePrice;
      }
      if (slug === "on-sale") {
        // On Sale: Both Regular Price and Sale Price, NO Pricing Tags
        return !hasPricingTag && hasRegularPrice && hasSalePrice;
      }
      if (slug === "price-drops") {
        return priceInfo.tagType === "price-down";
      }
      if (slug === "price-increases" || slug === "price-up") {
        return priceInfo.tagType === "price-up";
      }
      if (slug === "high-fluctuation") {
        return priceInfo.tagType === "shift";
      }
      return false;
    });

    console.log(`[Collection fallback: ${slug}] Filtered down to ${filtered.length} matching products.`);

    totalCount = filtered.length;
    totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
    products = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  }

  // ── Pagination ───────────────────────────────────────────────────────────
  const pageNumbers = generatePageNumbers(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (currentSort !== "latest") params.set("sort", currentSort);
    if (currentPrice !== "all") params.set("price", currentPrice);
    if (currentBrand !== "all") params.set("brand", currentBrand);
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", String(p));
    return `/collection/${slug}?${params.toString()}`;
  };

  // ── Breadcrumb ───────────────────────────────────────────────────────────
  const breadcrumbs = [
    { label: "CATALOG", url: "/#categories" },
    { label: "COLLECTIONS" },
    { label: config.title.toUpperCase() },
  ];

  // ── Split title for stacked brutalist styling ─────────────────────────────
  const renderTitle = (text: string) => {
    const upper = text.toUpperCase();
    const words = upper.split(" ");
    if (words.length > 1) {
      return words.map((word, idx) => {
        const isLast = idx === words.length - 1;
        return (
          <span
            key={idx}
            style={{
              display: "block",
              color: isLast ? "var(--color-orange)" : "var(--color-dark)"
            }}
          >
            {word}
          </span>
        );
      });
    }
    if (upper.length >= 6) {
      const mid = Math.ceil(upper.length / 2);
      return (
        <>
          <span style={{ display: "block", color: "var(--color-dark)" }}>{upper.substring(0, mid)}</span>
          <span style={{ display: "block", color: "var(--color-orange)" }}>{upper.substring(mid)}</span>
        </>
      );
    }
    return <span style={{ color: "var(--color-orange)" }}>{upper}</span>;
  };

  // ── Dynamic Collection Schema (AEO / SEO) ─────────────────────────────────
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${config.title} in Pakistan | PC Wala Online`,
    "description": config.description,
    "url": `${siteUrl}/collection/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `${siteUrl}/product/${prod.slug}`
      }))
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* ── Collection Header ── */}
      <section className={styles.collectionHeader}>
        {/* Lime corner bracket */}
        <span className={styles.cornerBracket} />

        {/* Title + Count Badge */}
        <div className={styles.titleCountWrapper}>
          <h1 className={styles.sectionTitle}>{renderTitle(config.title)}</h1>

          <div className={styles.countBadge} id="collection-item-count">
            <span className={styles.countBadgeNumber}>
              {totalCount}
            </span>
            <span className={styles.countBadgeLabel}>ITEMS</span>
          </div>
        </div>
      </section>

      {/* ── Controls (Sort + Price + Search + Brand) ── */}
      <CategoryControls
        slug={`/collection/${slug}`}
        currentSort={currentSort}
        currentPrice={currentPrice}
        currentBrand={currentBrand}
        currentSearch={currentSearch}
        brands={brands}
      />

      {/* ── Product Grid ── */}
      {products.length > 0 ? (
        <div className={styles.gridWrapper}>
          <div className="blueprint-grid grid-2-col-mobile">
            {products.map((product) => (
              <div key={product.id} style={{ gridColumn: "span 2" }}>
                <PCD_2 product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>
            // NO PRODUCTS IN THIS SEGMENT.
          </p>
          <p className={styles.emptyStateSubtext}>
            We currently have no active listings here or filters returned empty results.
          </p>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Pagination">
          {/* PREV */}
          {hasPrev ? (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className={styles.paginationPrevNext}
              aria-label="Previous page"
            >
              ◄ PREV
            </Link>
          ) : (
            <span className={`${styles.paginationPrevNext} ${styles.paginationDisabled}`}>
              ◄ PREV
            </span>
          )}

          {/* Page numbers */}
          {pageNumbers.map((pg, idx) =>
            pg === "…" ? (
              <span key={`ellipsis-${idx}`} className={styles.paginationEllipsis}>
                …
              </span>
            ) : (
              <Link
                key={pg}
                href={buildPageUrl(pg as number)}
                className={
                  pg === currentPage
                    ? `${styles.paginationItem} ${styles.paginationActive}`
                    : styles.paginationItem
                }
                aria-label={`Page ${pg}`}
                aria-current={pg === currentPage ? "page" : undefined}
              >
                {pg}
              </Link>
            )
          )}

          {/* NEXT */}
          {hasNext ? (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className={styles.paginationPrevNext}
              aria-label="Next page"
            >
              NEXT ►
            </Link>
          ) : (
            <span className={`${styles.paginationPrevNext} ${styles.paginationDisabled}`}>
              NEXT ►
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
