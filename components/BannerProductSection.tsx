"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import PCD_2 from "./PCD_2";
import { WooCommerceProduct } from "@/lib/types";
import styles from "./BannerProductSection.module.css";

interface BannerProductSectionProps {
  title: string;
  bannerImageSrc: string;
  bannerImageMobileSrc?: string;
  bannerImageAlt?: string;
  products: WooCommerceProduct[];
  viewAllLink?: string;
  usePCD2?: boolean;
}

export default function BannerProductSection({
  title,
  bannerImageSrc,
  bannerImageMobileSrc,
  bannerImageAlt = "Banner",
  products,
  viewAllLink,
  usePCD2 = false,
}: BannerProductSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(products.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const totalItems = products.length * 3;

  // Auto-slide effect - every 3 seconds
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      slide("next");
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, currentIndex, isAnimating]);

  const slide = (direction: "next" | "prev") => {
    if (isAnimating || products.length <= 1) return;

    setIsAnimating(true);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    
    // Perform the slide transition
    setCurrentIndex(targetIndex);

    // After 500ms (matching the CSS transition), reset position if needed
    setTimeout(() => {
      let nextIndex = targetIndex;
      if (targetIndex >= products.length * 2) {
        nextIndex = targetIndex - products.length;
      } else if (targetIndex < products.length) {
        nextIndex = targetIndex + products.length;
      }

      setTransitionEnabled(false);
      setCurrentIndex(nextIndex);

      // Re-enable transition after render
      setTimeout(() => {
        setTransitionEnabled(true);
        setIsAnimating(false);
      }, 50);
    }, 500);
  };

  const handleNext = () => {
    slide("next");
  };

  const handlePrevious = () => {
    slide("prev");
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left: Banner Image */}
        <div className={styles.bannerArea}>
          {/* Desktop Image */}
          <Image
            src={bannerImageSrc}
            alt={bannerImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.desktopBanner}
            priority
          />
          {/* Mobile Image */}
          {bannerImageMobileSrc && (
            <Image
              src={bannerImageMobileSrc}
              alt={bannerImageAlt}
              fill
              sizes="100vw"
              className={styles.mobileBanner}
              priority
            />
          )}
        </div>

        {/* Right: Products Section */}
        <div className={styles.productsArea}>
          {/* Header with Title */}
          <div className={styles.header}>
            <span className={styles.cornerBracket} />
            <h2 className={styles.title}>
              {title === "On Sale" ? (
                // Special case: Keep "ON SALE" on same line with different colors
                <>
                  <span style={{ color: "var(--color-dark)" }}>ON </span>
                  <span style={{ color: "var(--color-orange)" }}>SALE</span>
                </>
              ) : title === "Trending Laptop" ? (
                // Special case: Keep "TRENDING LAPTOP" on same line with different colors
                <>
                  <span style={{ color: "var(--color-dark)" }}>TRENDING </span>
                  <span style={{ color: "var(--color-orange)" }}>LAPTOP</span>
                </>
              ) : (
                (() => {
                  const uppercaseText = title.toUpperCase();
                  if (uppercaseText.includes(" ")) {
                    const words = uppercaseText.split(" ");
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
                  if (uppercaseText.length >= 6) {
                    const mid = Math.ceil(uppercaseText.length / 2);
                    return (
                      <>
                        <span style={{ display: "block", color: "var(--color-dark)" }}>{uppercaseText.substring(0, mid)}</span>
                        <span style={{ display: "block", color: "var(--color-orange)" }}>{uppercaseText.substring(mid)}</span>
                      </>
                    );
                  }
                  return <span style={{ color: "var(--color-orange)" }}>{uppercaseText}</span>;
                })()
              )}
            </h2>
          </div>

          {/* Products Slider Wrapper */}
          <div className={styles.sliderWrapper}>
            {/* Products Grid */}
            <div 
              className={`${styles.productsGrid} ${transitionEnabled ? styles.transitionEnabled : ""}`}
              style={{
                width: `calc(100% * ${totalItems} / var(--visible-items))`,
                transform: `translate3d(-${(currentIndex / totalItems) * 100}%, 0, 0)`
              } as React.CSSProperties}
            >
              {/* Triple products for seamless loop */}
              {[...products, ...products, ...products].map((product, idx) => (
                <div 
                  key={`${product.id}-${idx}`} 
                  className={styles.productItem}
                  style={{ width: `calc(100% / ${totalItems})` }}
                >
                  <PCD_2 product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer: View All + Navigation Buttons */}
          <div className={styles.footer}>
            {viewAllLink && (
              <Link href={viewAllLink} className={styles.viewAllLink}>
                <span className={styles.viewAllLinkText}>
                  VIEW ALL
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            )}

            {/* Navigation Buttons in line with View All */}
            <div className={styles.navButtons}>
              <button
                onClick={handlePrevious}
                className={styles.navButton}
                aria-label="Previous products"
                disabled={products.length <= 1}
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleNext}
                className={styles.navButton}
                aria-label="Next products"
                disabled={products.length <= 1}
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
