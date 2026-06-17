"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Menu, Search, MessageCircle } from "lucide-react";
import styles from "./MobileBottomNav.module.css";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
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
    <nav className={`${styles.bottomNav} ${!isVisible ? styles.bottomNavHidden : ""}`}>
      <Link 
        href="/" 
        className={`${styles.navItem} ${isActive("/") ? styles.navItemActive : ""}`}
      >
        <Home size={20} strokeWidth={2} />
        <span className={styles.navLabel}>HOME</span>
      </Link>

      <Link 
        href="/category/custom-builds" 
        className={`${styles.navItem} ${isActive("/category") ? styles.navItemActive : ""}`}
      >
        <Menu size={20} strokeWidth={2} />
        <span className={styles.navLabel}>MENU</span>
      </Link>

      <Link 
        href="/search" 
        className={`${styles.navItem} ${isActive("/search") ? styles.navItemActive : ""}`}
      >
        <Search size={20} strokeWidth={2} />
        <span className={styles.navLabel}>SEARCH</span>
      </Link>

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
  );
}
