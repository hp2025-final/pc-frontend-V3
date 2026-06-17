"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { WooCommerceBrand } from "@/lib/types";
import styles from "./CategoryControls.module.css";

interface CategoryControlsProps {
  slug: string;
  currentSort: string;
  currentPrice: string;
  currentBrand: string;
  currentSearch: string;
  brands: WooCommerceBrand[];
}

const SORT_OPTIONS = [
  { value: "latest",     label: "LATEST" },
  { value: "oldest",     label: "OLDEST" },
  { value: "price_high", label: "PRICE: HIGH → LOW" },
  { value: "price_low",  label: "PRICE: LOW → HIGH" },
];

const PRICE_OPTIONS = [
  { value: "all",            label: "ALL PRICES" },
  { value: "1000-25000",     label: "RS. 1,000 – 25,000" },
  { value: "25000-50000",    label: "RS. 25,000 – 50,000" },
  { value: "50000-75000",    label: "RS. 50,000 – 75,000" },
  { value: "75000-100000",   label: "RS. 75,000 – 1,00,000" },
  { value: "100000-150000",  label: "RS. 1,00,000 – 1,50,000" },
  { value: "150000-200000",  label: "RS. 1,50,000 – 2,00,000" },
  { value: "200000-300000",  label: "RS. 2,00,000 – 3,00,000" },
  { value: "300000-400000",  label: "RS. 3,00,000 – 4,00,000" },
  { value: "400000-500000",  label: "RS. 4,00,000 – 5,00,000" },
];

export default function CategoryControls({
  slug,
  currentSort,
  currentPrice,
  currentBrand,
  currentSearch,
  brands,
}: CategoryControlsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Sync state if parent query changes (e.g. clear search or backward navigation)
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const buildUrl = (sort: string, price: string, brand: string, search: string) => {
    const params = new URLSearchParams();
    if (sort && sort !== "latest") params.set("sort", sort);
    if (price && price !== "all") params.set("price", price);
    if (brand && brand !== "all") params.set("brand", brand);
    if (search.trim()) params.set("search", search.trim());
    params.set("page", "1");
    // Support both category and brand pages
    const basePath = slug.startsWith('/brand/') ? slug : `/category/${slug}`;
    return `${basePath}?${params.toString()}`;
  };

  // Debounced search effect
  useEffect(() => {
    if (searchTerm !== currentSearch) {
      const delayDebounceFn = setTimeout(() => {
        router.push(buildUrl(currentSort, currentPrice, currentBrand, searchTerm));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, currentSearch, currentSort, currentPrice, currentBrand, router]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(e.target.value, currentPrice, currentBrand, searchTerm));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(currentSort, e.target.value, currentBrand, searchTerm));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(currentSort, currentPrice, e.target.value, searchTerm));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    router.push(buildUrl(currentSort, currentPrice, currentBrand, ""));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(buildUrl(currentSort, currentPrice, currentBrand, searchTerm));
    }
  };

  return (
    <div className={styles.controlsBar}>
      {/* Right: Search + Brand + Sort + Price Dropdowns */}
      <div className={styles.dropdownGroup}>
        {/* Live Search Input */}
        <div className={styles.dropdownWrapper}>
          <label className={styles.dropdownLabel} htmlFor="search-input">
            SEARCH
          </label>
          <div className={styles.searchWrapper}>
            <input
              id="search-input"
              type="text"
              className={styles.searchInput}
              placeholder="QUERY..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && (
              <button
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Brand Dropdown - Only show if brands array has items */}
        {brands.length > 0 && (
          <div className={styles.dropdownWrapper}>
            <label className={styles.dropdownLabel} htmlFor="brand-select">
              BRAND
            </label>
            <div className={styles.selectWrapper}>
              <select
                id="brand-select"
                className={styles.select}
                value={currentBrand}
                onChange={handleBrandChange}
              >
                <option value="all">ALL BRANDS</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <span className={styles.selectArrow}>▾</span>
            </div>
          </div>
        )}

        {/* Sort Dropdown */}
        <div className={styles.dropdownWrapper}>
          <label className={styles.dropdownLabel} htmlFor="sort-select">
            SORT
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="sort-select"
              className={styles.select}
              value={currentSort}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>
        </div>

        {/* Price Dropdown */}
        <div className={styles.dropdownWrapper}>
          <label className={styles.dropdownLabel} htmlFor="price-select">
            PRICE
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="price-select"
              className={styles.select}
              value={currentPrice}
              onChange={handlePriceChange}
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}

