"use client";

import { useState } from "react";
import styles from "./cache-manager.module.css";

interface ClearResult {
  success: boolean;
  message: string;
  clearedItems?: string[];
  count?: number;
}

export default function CacheManagerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [homepageOption, setHomepageOption] = useState("no-change");
  const [categoriesOption, setCategoriesOption] = useState("no-change");
  const [productsOption, setProductsOption] = useState("no-change");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<ClearResult | null>(null);

  // Password check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Password stored in environment variable
    const correctPassword = process.env.NEXT_PUBLIC_CACHE_ADMIN_PASSWORD || "pcwala2025";
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Try again.");
      setPassword("");
    }
  };

  // Clear cache functions
  const handleClearHomepage = async () => {
    if (homepageOption === "no-change") return;
    
    setLoading("homepage");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-homepage?option=${homepageOption}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error clearing homepage cache" });
    } finally {
      setLoading(null);
    }
  };

  const handleClearCategories = async () => {
    if (categoriesOption === "no-change") return;
    
    setLoading("categories");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-categories?option=${categoriesOption}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error clearing categories cache" });
    } finally {
      setLoading(null);
    }
  };

  const handleClearProducts = async () => {
    if (productsOption === "no-change") return;
    
    setLoading("products");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-products?option=${productsOption}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error clearing products cache" });
    } finally {
      setLoading(null);
    }
  };

  const handleClearAll = async () => {
    setLoading("all");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-all`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error clearing all cache" });
    } finally {
      setLoading(null);
    }
  };

  const handleClearLastHourAll = async () => {
    setLoading("last-hour");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-last-hour`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error clearing last hour cache" });
    } finally {
      setLoading(null);
    }
  };

  const handleSearchAndClear = async () => {
    if (!searchTerm || searchTerm.length < 3) {
      setResult({ success: false, message: "Please enter at least 3 characters" });
      return;
    }

    setLoading("search");
    setResult(null);
    
    try {
      const response = await fetch(`/api/cache/clear-product-by-name?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: "Error searching for products" });
    } finally {
      setLoading(null);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <h1 className={styles.loginTitle}>🔐 CACHE ADMIN</h1>
            <p className={styles.loginSubtitle}>PC WALA ONLINE - AUTHORIZED ACCESS ONLY</p>
          </div>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <label htmlFor="password" className={styles.loginLabel}>
              ENTER PASSWORD
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              placeholder="••••••••"
              autoFocus
            />
            
            {error && (
              <div className={styles.loginError}>
                {error}
              </div>
            )}
            
            <button type="submit" className={styles.loginButton}>
              LOGIN TO CACHE MANAGER
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <span className={styles.cornerBracket} />
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>🔄 PC WALA - CACHE CONTROL PANEL</h1>
          <p className={styles.subtitle}>Manage what customers see on the website</p>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className={styles.logoutBtn}
          >
            LOGOUT
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`${styles.result} ${result.success ? styles.resultSuccess : styles.resultError}`}>
            <div className={styles.resultHeader}>
              {result.success ? "✅" : "❌"} {result.message}
            </div>
            {result.clearedItems && result.clearedItems.length > 0 && (
              <div className={styles.resultItems}>
                <strong>Cleared Items:</strong>
                <ul>
                  {result.clearedItems.slice(0, 10).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                  {result.clearedItems.length > 10 && (
                    <li>... and {result.clearedItems.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
            {result.count !== undefined && (
              <div className={styles.resultCount}>
                Total cleared: {result.count}
              </div>
            )}
          </div>
        )}

        {/* Homepage Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🏠</span>
            <h2 className={styles.sectionTitle}>HOMEPAGE CACHE</h2>
          </div>
          
          <div className={styles.sectionBody}>
            <label className={styles.optionLabel}>Select Products Modified In:</label>
            
            <div className={styles.radioGroup}>
              {[
                { value: "no-change", label: "No Change (Keep Current Cache)" },
                { value: "1", label: "Last 1 Hour" },
                { value: "2", label: "Last 2 Hours" },
                { value: "3", label: "Last 3 Hours" },
                { value: "6", label: "Last 6 Hours" },
                { value: "12", label: "Last 12 Hours" },
                { value: "all", label: "Clear All Homepage Cache" },
              ].map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="homepage"
                    value={option.value}
                    checked={homepageOption === option.value}
                    onChange={(e) => setHomepageOption(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={handleClearHomepage}
              disabled={homepageOption === "no-change" || loading === "homepage"}
              className={styles.clearButton}
            >
              {loading === "homepage" ? "CLEARING..." : "CLEAR HOMEPAGE CACHE"}
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📂</span>
            <h2 className={styles.sectionTitle}>CATEGORIES CACHE</h2>
          </div>
          
          <div className={styles.sectionBody}>
            <label className={styles.optionLabel}>Select Products Modified In:</label>
            
            <div className={styles.radioGroup}>
              {[
                { value: "no-change", label: "No Change (Keep Current Cache)" },
                { value: "1", label: "Last 1 Hour" },
                { value: "2", label: "Last 2 Hours" },
                { value: "3", label: "Last 3 Hours" },
                { value: "6", label: "Last 6 Hours" },
                { value: "12", label: "Last 12 Hours" },
                { value: "all", label: "Clear All Category Pages" },
              ].map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="categories"
                    value={option.value}
                    checked={categoriesOption === option.value}
                    onChange={(e) => setCategoriesOption(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={handleClearCategories}
              disabled={categoriesOption === "no-change" || loading === "categories"}
              className={styles.clearButton}
            >
              {loading === "categories" ? "CLEARING..." : "CLEAR CATEGORIES CACHE"}
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>📦</span>
            <h2 className={styles.sectionTitle}>PRODUCT PAGES CACHE</h2>
          </div>
          
          <div className={styles.sectionBody}>
            <label className={styles.optionLabel}>Select Products Modified In:</label>
            
            <div className={styles.radioGroup}>
              {[
                { value: "no-change", label: "No Change (Keep Current Cache)" },
                { value: "1", label: "Last 1 Hour" },
                { value: "2", label: "Last 2 Hours" },
                { value: "3", label: "Last 3 Hours" },
                { value: "6", label: "Last 6 Hours" },
                { value: "12", label: "Last 12 Hours" },
                { value: "all", label: "Clear All Product Pages" },
              ].map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="products"
                    value={option.value}
                    checked={productsOption === option.value}
                    onChange={(e) => setProductsOption(e.target.value)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={handleClearProducts}
              disabled={productsOption === "no-change" || loading === "products"}
              className={styles.clearButton}
            >
              {loading === "products" ? "CLEARING..." : "CLEAR PRODUCT CACHE"}
            </button>
          </div>
        </div>

        {/* Search & Clear Section - NEW */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>🔍</span>
            <h2 className={styles.sectionTitle}>SEARCH & CLEAR SPECIFIC PRODUCTS</h2>
          </div>
          
          <div className={styles.sectionBody}>
            <label className={styles.optionLabel}>
              Search for products you just updated:
            </label>
            
            <div style={{ marginBottom: "16px" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type product name (e.g., 'Gamemax Leader')"
                className={styles.searchInput}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchAndClear();
                  }
                }}
              />
              <p className={styles.searchHint}>
                💡 Tip: Type part of the product name you just updated
              </p>
            </div>
            
            <button
              onClick={handleSearchAndClear}
              disabled={!searchTerm || searchTerm.length < 3 || loading === "search"}
              className={styles.clearButton}
            >
              {loading === "search" ? "SEARCHING..." : "SEARCH & CLEAR CACHE"}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>⚡</span>
            <h2 className={styles.sectionTitle}>QUICK ACTIONS</h2>
          </div>
          
          <div className={styles.quickActions}>
            <button
              onClick={handleClearAll}
              disabled={loading === "all"}
              className={styles.quickButton}
            >
              {loading === "all" ? "CLEARING..." : "CLEAR EVERYTHING"}
            </button>
            
            <button
              onClick={handleClearLastHourAll}
              disabled={loading === "last-hour"}
              className={styles.quickButton}
            >
              {loading === "last-hour" ? "CLEARING..." : "CLEAR LAST HOUR - ALL"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerCorner} />
          <p className={styles.footerText}>PC WALA ONLINE © 2025 - CACHE MANAGEMENT SYSTEM</p>
        </div>
      </div>
    </div>
  );
}
