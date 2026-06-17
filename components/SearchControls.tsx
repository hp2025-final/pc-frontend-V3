"use client";

import { useRouter } from "next/navigation";
import styles from "./SearchControls.module.css";

interface SearchControlsProps {
  query: string;
  currentSort: string;
  currentPrice: string;
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

export default function SearchControls({
  query,
  currentSort,
  currentPrice,
}: SearchControlsProps) {
  const router = useRouter();

  const buildUrl = (sort: string, price: string) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (sort && sort !== "latest") params.set("sort", sort);
    if (price && price !== "all") params.set("price", price);
    params.set("page", "1");
    return `/search?${params.toString()}`;
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(e.target.value, currentPrice));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl(currentSort, e.target.value));
  };

  return (
    <div className={styles.controlsBar}>
      {/* Right: Sort + Price Dropdowns */}
      <div className={styles.dropdownGroup}>
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
