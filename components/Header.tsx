"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import SearchBar from "./SearchBar";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll detection for desktop sticky header
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
        setMegaMenuOpen(false); // Close mega menu when hiding
      } else if (currentScrollY < prevScrollY - 5) {
        // Scrolling up - show
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 700);
  };

  // Close mega menu on route change
  useEffect(() => {
    setMegaMenuOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const megaMenuData = {
    components: [
      { name: "Graphic Card", slug: "gpus" },
      { name: "PC Case", slug: "pc-cases" },
      { name: "PC Cooling", slug: "pc-cooling-systems" },
      { name: "Motherboard", slug: "motherboards" },
      { name: "PSU", slug: "power-supplies" },
      { name: "Storage", slug: "storage" },
      { name: "PC RAM", slug: "ram" },
      { name: "Gaming Keyboard", slug: "gaming-keyboards" },
      { name: "Gaming Mouse", slug: "gaming-mouse" },
    ],
    pcAndLaptop: [
      { name: "Laptop", slug: "laptops" },
      { name: "Gaming PC", slug: "gaming-pc" },
      { name: "Custom Builds", slug: "custom-builds" },
      { name: "High-end PC", slug: "high-end-pc" },
      { name: "Servers", slug: "servers" },
      { name: "Branded PC", slug: "branded-pc" },
    ],
    appleProducts: [
      { name: "Macbook", slug: "macbook" },
      { name: "iPad", slug: "ipad" },
      { name: "iMac", slug: "imac" },
      { name: "Apple Accessories", slug: "apple-accessories" },
    ],
    accessories: [
      { name: "Wifi Router", slug: "wifi-router" },
      { name: "Speaker", slug: "speaker" },
      { name: "Headset", slug: "headset" },
      { name: "Podcast Setup", slug: "podcast-setup" },
      { name: "PC Cables", slug: "pc-cables" },
      { name: "Network Cables", slug: "network-cables" },
      { name: "Printer and Scanner", slug: "printers-scanners" },
    ],
  };

  const bracketStyle = (path: string) => ({
    color: isActive(path) ? "var(--color-primary)" : "var(--color-accent-lime)",
  });

  return (
    <header className={`${styles.header} ${!isVisible ? styles.headerHidden : ""}`}>
      {/* Desktop & Mobile Main Header Row */}
      <div className={styles.container}>
        {/* Orange bracket corner - bottom right */}
        <span className={styles.cornerBracket} />

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoTitle}>PC WALA</span>
          <span className={`${styles.logoSub} label-mono`}>ONLINE</span>
        </Link>

        {/* Desktop Navigation, Search, and WhatsApp grouped on the right side */}
        <div className={styles.desktopRightGroup}>
          <nav className={styles.desktopNav}>
            <ul className={`${styles.navUl} label-mono`}>
              <li>
                <Link href="/" className={`${styles.navLink} ${isActive("/") ? styles.navLinkActive : ""}`}>
                  HOME
                  {isActive("/") && <span className={styles.statusDot} />}
                </Link>
              </li>
              <li>
                <Link href="/category/latest-arrival" className={`${styles.navLink} ${isActive("/category/latest-arrival") ? styles.navLinkActive : ""}`}>
                  NEW ARRIVALS
                  {isActive("/category/latest-arrival") && <span className={styles.statusDot} />}
                </Link>
              </li>
              <li>
                <Link href="/category/on-sale" className={`${styles.navLink} ${isActive("/category/on-sale") ? styles.navLinkActive : ""}`}>
                  ON SALE
                  {isActive("/category/on-sale") && <span className={styles.statusDot} />}
                </Link>
              </li>
              <li>
                <Link href="/category/custom-builds" className={`${styles.navLink} ${isActive("/category/custom-builds") ? styles.navLinkActive : ""}`}>
                  CUSTOM BUILDS
                  {isActive("/category/custom-builds") && <span className={styles.statusDot} />}
                </Link>
              </li>

              {/* "PRODUCTS" trigger — always rendered so transition works */}
              <li
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`${styles.navItemMore}`}
              >
                <span className={`${styles.navLink} ${megaMenuOpen ? styles.navLinkActive : ""} ${pathname.startsWith("/category/") && !["/category/latest-arrival", "/category/on-sale", "/category/custom-builds"].includes(pathname) ? styles.navLinkActive : ""}`}>
                  PRODUCTS
                  <span className={`${styles.moreArrow} ${megaMenuOpen ? styles.moreArrowOpen : ""}`}>▼</span>
                  {pathname.startsWith("/category/") && !["/category/latest-arrival", "/category/on-sale", "/category/custom-builds"].includes(pathname) && <span className={styles.statusDot} />}
                </span>
              </li>
            </ul>
          </nav>

          {/* Column divider 2 */}
          <span className={styles.divider} />

          {/* Desktop Search Area */}
          <div className={styles.desktopSearch}>
            <SearchBar />
          </div>

          {/* Column divider 3 */}
          <span className={styles.divider} />

          {/* Desktop WhatsApp Area */}
          <div className={styles.desktopWhatsapp}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119"}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              WHATSAPP
            </a>
          </div>
        </div>

        {/* Mobile Actions (Logo left, Actions right, no divider between them) */}
        <div className={styles.mobileActions}>
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={styles.actionBtn}
            aria-label="Toggle search"
          >
            <Search size={16} strokeWidth={2.5} />
          </button>

          {/* Embossed Divider */}
          <span className={styles.mobileDivider} />

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119"}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mobileWaBtn}
            aria-label="Contact WhatsApp"
          >
            WHATSAPP
          </a>

          {/* Embossed Divider */}
          <span className={styles.mobileDivider} />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.actionBtn}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* ─── Mega Menu — always in DOM, animates with CSS max-height slide ─── */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${styles.megaMenu} ${megaMenuOpen ? styles.megaMenuOpen : ""}`}
        aria-hidden={!megaMenuOpen}
      >
        {/* Components */}
        <div>
          <h3 className={`${styles.megaMenuColTitle} label-mono`}>COMPONENTS</h3>
          <ul className={styles.megaMenuColUl}>
            {megaMenuData.components.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/category/${item.slug}`}
                  className={styles.megaMenuLink}
                  onClick={() => setMegaMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PC and Laptop */}
        <div>
          <h3 className={`${styles.megaMenuColTitle} label-mono`}>PC AND LAPTOP</h3>
          <ul className={styles.megaMenuColUl}>
            {megaMenuData.pcAndLaptop.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/category/${item.slug}`}
                  className={styles.megaMenuLink}
                  onClick={() => setMegaMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Apple Products */}
        <div>
          <h3 className={`${styles.megaMenuColTitle} label-mono`}>APPLE PRODUCTS</h3>
          <ul className={styles.megaMenuColUl}>
            {megaMenuData.appleProducts.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/category/${item.slug}`}
                  className={styles.megaMenuLink}
                  onClick={() => setMegaMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Accessories */}
        <div>
          <h3 className={`${styles.megaMenuColTitle} label-mono`}>ACCESSORIES</h3>
          <ul className={styles.megaMenuColUl}>
            {megaMenuData.accessories.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/category/${item.slug}`}
                  className={styles.megaMenuLink}
                  onClick={() => setMegaMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Market Tracker */}
        <div>
          <h3 className={`${styles.megaMenuColTitle} label-mono`}>MARKET TRACKER</h3>
          <ul className={styles.megaMenuColUl}>
            <li>
              <Link
                href="/collection/price-drops"
                className={styles.megaMenuLink}
                onClick={() => setMegaMenuOpen(false)}
              >
                Price Drops
              </Link>
            </li>
            <li>
              <Link
                href="/collection/price-increases"
                className={styles.megaMenuLink}
                onClick={() => setMegaMenuOpen(false)}
              >
                Price Increases
              </Link>
            </li>
            <li>
              <Link
                href="/collection/on-sale"
                className={styles.megaMenuLink}
                onClick={() => setMegaMenuOpen(false)}
              >
                On Sale
              </Link>
            </li>
            <li>
              <Link
                href="/collection/high-fluctuation"
                className={styles.megaMenuLink}
                onClick={() => setMegaMenuOpen(false)}
              >
                Market Fluctuation
              </Link>
            </li>
            <li>
              <Link
                href="/collection/market-price"
                className={styles.megaMenuLink}
                onClick={() => setMegaMenuOpen(false)}
              >
                Market Price
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {mobileSearchOpen && (
        <div className={styles.mobileSearchDropdown}>
          <SearchBar />
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenuDrawer}>
          <nav>
            <ul className={`${styles.mobileMenuUl} label-mono`}>
              <li>
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuLink}>
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/category/latest-arrival" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuLink}>
                  NEW ARRIVALS
                </Link>
              </li>
              <li>
                <Link href="/category/on-sale" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuLink}>
                  ON SALE
                </Link>
              </li>
              <li>
                <Link href="/category/custom-builds" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuLink}>
                  CUSTOM BUILDS
                </Link>
              </li>

              {/* Mobile Mega Menu Sections */}
              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>COMPONENTS</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {megaMenuData.components.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>PC AND LAPTOP</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {megaMenuData.pcAndLaptop.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>APPLE PRODUCTS</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {megaMenuData.appleProducts.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className={styles.mobileMenuSection}>
                <div className={styles.mobileMenuSectionTitle}>ACCESSORIES</div>
                <ul className={styles.mobileMenuSectionUl}>
                  {megaMenuData.accessories.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/category/${item.slug}`} onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
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
                    <Link href="/collection/price-drops" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Price Drops
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/price-increases" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Price Increases
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/on-sale" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      On Sale
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/high-fluctuation" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Market Fluctuation
                    </Link>
                  </li>
                  <li>
                    <Link href="/collection/market-price" onClick={() => setMobileMenuOpen(false)} className={styles.mobileMenuSubLink}>
                      Market Price
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
