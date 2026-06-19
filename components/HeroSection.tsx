"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./HeroSection.module.css";

interface MarketTrackerCard {
  label: string;
  collectionSlug: string;
  icon: "price-down" | "price-up" | "fluctuation" | "market-price";
}

export default function HeroSection() {
  const marketTrackerCards: MarketTrackerCard[] = [
    { label: "PRICE DROP", collectionSlug: "price-drops", icon: "price-down" },
    { label: "PRICE INCREASE", collectionSlug: "price-increases", icon: "price-up" },
    { label: "MARKET FLUCTUATION", collectionSlug: "high-fluctuation", icon: "fluctuation" },
    { label: "MARKET PRICE", collectionSlug: "market-price", icon: "market-price" },
  ];

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        {/* Left: Hero Image (4 columns, 4:4 ratio) */}
        <Link href="/category/pc-cases" className={styles.heroImageColumn}>
          <div className={styles.heroImageWrapper}>
            <Image
              src="https://api.pcwalaonline.com/wp-content/uploads/2026/06/hero-main-banner-1x1-1.png"
              alt="PC Cases Collection"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </Link>

        {/* Center: Market Tracker (4 columns, 4 cards in 2x2 grid) */}
        <div className={styles.marketTrackerColumn}>
          <h2 className={styles.trackerHeading}>TRACK HARDWARE PRICE</h2>
          <div className={styles.trackerCardsGrid}>
            {marketTrackerCards.map((card) => (
              <Link
                key={card.collectionSlug}
                href={`/collection/${card.collectionSlug}`}
                className={styles.trackerCard}
              >
                <span className={styles.cornerBracket} />
                <div className={styles.trackerCardInner}>
                  {/* SVG Icons matching PCD_2 design */}
                  {card.icon === "price-down" && (
                    <svg className={styles.trackerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  )}
                  {card.icon === "price-up" && (
                    <svg className={styles.trackerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  )}
                  {card.icon === "fluctuation" && (
                    <svg className={styles.trackerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  )}
                  {card.icon === "market-price" && (
                    <svg className={styles.trackerIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                  )}
                  <span className={`${styles.trackerLabel} label-mono`}>
                    {card.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Offer Banners (4 columns, 2 stacked banners each 4:2) */}
        <div className={styles.offerBannersColumn}>
          <Link href="/category/gpus" className={styles.offerBanner}>
            <div className={styles.offerBannerPlaceholder}>
              <Image
                src="https://api.pcwalaonline.com/wp-content/uploads/2026/06/hero-banner-1-1-4x2-1.png"
                alt="Graphics Cards Collection"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </Link>
          <Link href="/category/laptops" className={styles.offerBanner}>
            <div className={styles.offerBannerPlaceholder}>
              <Image
                src="https://api.pcwalaonline.com/wp-content/uploads/2026/06/hero-banner-2-1-4x2-1.png"
                alt="Laptops Collection"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
