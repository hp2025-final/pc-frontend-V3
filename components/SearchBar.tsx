"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  dropdownPosition?: "top" | "bottom"; // New prop to control dropdown position
}

export default function SearchBar({ dropdownPosition = "bottom" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search logic - minimum 3 characters required
  useEffect(() => {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length < 3) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Live search request failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click away listener to close live search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    // Only submit if minimum 3 characters
    if (trimmedQuery.length >= 3) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const selectProduct = () => {
    setShowDropdown(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className={styles.searchContainer}>
      <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="SEARCH HARDWARE..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) {
              setShowDropdown(true);
            }
          }}
          className={`${styles.searchInput} label-mono`}
        />
        
        {/* Loading Spinner / Icon indicator */}
        <button 
          type="submit" 
          className={styles.searchButton}
          disabled={query.trim().length < 3}
          aria-label="Search"
        >
          {loading ? (
            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Search size={16} strokeWidth={2.5} />
          )}
        </button>
      </form>

      {/* Live Search Brutalist Dropdown Popover */}
      {showDropdown && results.length > 0 && (
        <div className={`${styles.dropdownPopover} ${dropdownPosition === "top" ? styles.dropdownTop : ""}`}>
          {/* Headline header inside dropdown */}
          <div className={`${styles.dropdownHeader} label-mono`}>
            // MATCHING DATABASE HARDWARE
          </div>

          {/* Results rows list */}
          <div className={styles.dropdownList}>
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={selectProduct}
                className={`${styles.dropdownItem} live-search-item`}
              >
                {/* Product Thumbnail image */}
                <div className={styles.thumbnailWrapper}>
                  <Image
                    src={product.images?.[0]?.src || "/placeholder-product.png"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain", padding: "2px" }}
                  />
                </div>

                {/* Name & price metadata info */}
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>
                    {product.name}
                  </div>
                  <div className={`${styles.itemPrice} label-mono`}>
                    {formatPrice(product.price || "0")}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Direct CTA action to view all search results */}
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={() => setShowDropdown(false)}
            className={`${styles.dropdownFooter} label-mono`}
          >
            VIEW ALL RESULTS ({results.length}) →
          </Link>
        </div>
      )}
    </div>
  );
}
