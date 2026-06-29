import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsWithCount, getCategoryBySlug } from "@/lib/woocommerce";
import { CATEGORY_BRANDS } from "@/lib/brands";
import PCD_2 from "@/components/PCD_2";
import Breadcrumb from "@/components/Breadcrumb";
import CategoryControls from "@/components/CategoryControls";
import styles from "./category.module.css";

// ISR — revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

/**
 * All category slugs (parent + children) that use the Pre-Built PC product template.
 * Add any new child category slugs here when they are created in WooCommerce.
 */
const PRE_BUILT_PC_SLUGS = new Set([
  "pre-built-pcs",
  "prebuilt-pcs",
  "pre-built-pc",
  "prebuilt-pc",
  "lizard-series",
]);

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    price?: string;
    brand?: string;
    search?: string;
  }>;
}

// ─── Price range map ────────────────────────────────────────────────────────
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
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "Category Not Found" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";

  return {
    title: `${category.name} — Buy in Pakistan`,
    description:
      category.description ||
      `Browse original ${category.name} at PC Wala Online. High performance hardware units.`,
    alternates: {
      canonical: `${siteUrl}/category/${slug}`,
    },
  };
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page, sort, price, brand, search } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const PER_PAGE = 30;
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const currentSort = sort || "latest";
  const currentPrice = price || "all";
  const currentBrand = brand || "all";
  const currentSearch = search || "";

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

  // Get static brands for this category
  const allBrands = CATEGORY_BRANDS[slug] || [];

  // WooCommerce API requires the numeric ID for brand filtering, but searchParams has the slug.
  const selectedBrandObj = allBrands.find(b => b.slug === currentBrand);
  const brandIdParam = selectedBrandObj ? String(selectedBrandObj.id) : undefined;

  // ── Fetch products in parallel ─────────────────────────────────
  const { products, totalCount, totalPages: apiTotalPages } = await getProductsWithCount({
    category: String(category.id),
    page: currentPage,
    per_page: PER_PAGE,
    orderby,
    order,
    ...(priceRange ? { min_price: priceRange.min, max_price: priceRange.max } : {}),
    ...(brandIdParam ? { brand: brandIdParam } : {}),
    ...(currentSearch ? { search: currentSearch } : {}),
  });

  // ── Pagination ───────────────────────────────────────────────────────────
  const totalPages = Math.max(1, apiTotalPages);
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
    return `/category/${slug}?${params.toString()}`;
  };

  // ── Breadcrumb ───────────────────────────────────────────────────────────
  const breadcrumbs = [
    { label: "CATALOG", url: "/#categories" },
    { label: category.name },
  ];

  // ── Split title for brutalist stacked display ────────────────────────────
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

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* ── Category Header ── */}
      <section className={styles.categoryHeader}>
        {/* Lime corner bracket */}
        <span className={styles.cornerBracket} />

        {/* Title + Count Badge (inline on mobile) */}
        <div className={styles.titleCountWrapper}>
          <h1 className={styles.sectionTitle}>{renderTitle(category.name)}</h1>

          {/* Total Count Badge */}
          <div className={styles.countBadge} id="category-item-count">
            <span className={styles.countBadgeNumber}>
              {totalCount}
            </span>
            <span className={styles.countBadgeLabel}>ITEMS</span>
          </div>
        </div>

        {/* Description below on separate line */}
        {category.description && (
          <p className={styles.categoryDesc}>{category.description}</p>
        )}
      </section>

      {/* ── Sort + Price + Brand + Search Controls ── */}
      <CategoryControls
        slug={slug}
        currentSort={currentSort}
        currentPrice={currentPrice}
        currentBrand={currentBrand}
        currentSearch={currentSearch}
        brands={allBrands}
      />

      {/* ── Product Grid ── */}
      {/* Determine product page template based on category */}
      {(() => {
        const usePreBuiltTemplate = PRE_BUILT_PC_SLUGS.has(slug);
        return products.length > 0 ? (
          <div className={styles.gridWrapper}>
            {/* 12-col blueprint grid: each card spans 2 = 6 per row desktop, 2-col mobile */}
            <div className="blueprint-grid grid-2-col-mobile">
              {products.map((product) => (
                <div key={product.id} style={{ gridColumn: "span 2" }}>
                  <PCD_2
                    product={product}
                    productHref={
                      usePreBuiltTemplate
                        ? `/pre-built-pc/${product.slug}`
                        : undefined
                    }
                  />
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
              Try a different price range, brand, or search term.
            </p>
          </div>
        );
      })()}

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
