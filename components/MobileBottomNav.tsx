"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Menu, Search, MessageCircle, X } from "lucide-react";
import SearchBar from "./SearchBar";
import styles from "./MobileBottomNav.module.css";
import type { MenuData } from "@/lib/menuData";

interface MobileBottomNavProps {
  menuData: MenuData;
}

export default function MobileBottomNav({ menuData }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  // Scroll detection for mobile bottom nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > prevScrollY) {
        // Scrolling down - hide
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY - 5) {
        // Scrolling up - show
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`${styles.bottomNav} ${!isVisible ? styles.bottomNavHidden : ""}`}>
        <Link 
          href="/" 
          className={`${styles.navItem} ${isActive("/") ? styles.navItemActive : ""}`}
        >
          <Home size={20} strokeWidth={2} />
          <span className={styles.navLabel}>HOME</span>
        </Link>

        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            setSearchOpen(false);
          }}
          className={`${styles.navItem} ${menuOpen ? styles.navItemActive : ""}`}
        >
          {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          <span className={styles.navLabel}>MENU</span>
        </button>

        <button
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMenuOpen(false);
          }}
          className={`${styles.navItem} ${searchOpen || isActive("/search") ? styles.navItemActive : ""}`}
        >
          <Search size={20} strokeWidth={2} />
          <span className={styles.navLabel}>SEARCH</span>
        </button>

        <a 
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119"}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navItem}
        >
          <MessageCircle size={20} strokeWidth={2} />
          <span className={styles.navLabel}>WHATSAPP</span>
        </a>
      </nav>

      {/* Menu Drawer - Same as Header Mobile Menu */}
      {menuOpen && (
        <div className={styles.menuDrawer}>
          <nav>
            <ul className={`${styles.mobileMenuUl} label-mono`}>
              <li>
                <Link href="/" onClick={() => setMenuOpen(false)} className={styles.mobileMenuLink}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/category/latest-arrival" onClick={() => setMenuOpen(false)} className={styles.mobileMenuLink}>
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/category/on-sale" onClick={() => setMenuOpen(false)} className={styles.mobileMenuLink}>
                  ON SALE
                </Link>
              </li>
              <li>
                <Link href="/category/custom-builds" onClick={() => setMenuOpen(false)} className={styles.mobileMenuLink}>
                  CUSTOM BUILDS
                </Link>
              </li>

              {/* Mobile Mega Menu Sections */}
              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>COMPONENTS</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {menuData.components.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>PC AND LAPTOP</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {menuData.pcAndLaptop.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>APPLE PRODUCTS</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {menuData.appleProducts.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>ACCESSORIES</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {menuData.accessories.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>MARKET TRACKER</div>
                <ul className={styles.mobileMenuSectionUl}>
                  <li>
                    <Link href="/collection/price-drops" onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Price Drops
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/price-increases" onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Price Increases
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/on-sale" onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      On Sale
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/high-fluctuation" onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Market Fluctuation
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/market-price" onClick={() => setMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Market Price
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Search Drawer - Same as Header Live Search */}
      {searchOpen && (
        <div className={styles.searchDrawer}>
          <SearchBar dropdownPosition="top" />
        </div>
      )}
    </>
  );
}
