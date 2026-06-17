"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice, getProductMeta } from "@/lib/utils";
import styles from "./HeroSlider.module.css";

interface HeroSliderProps {
  laptopProducts?: WooCommerceProduct[];
}

export default function HeroSlider({ laptopProducts = [] }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(laptopProducts.length);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 769);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (laptopProducts.length === 0 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, laptopProducts.length]);

  const handleTransitionEnd = () => {
    if (laptopProducts.length === 0) return;
    if (activeIndex >= laptopProducts.length * 2) {
      setTransitionEnabled(false);
      setActiveIndex(activeIndex - laptopProducts.length);
    } else if (activeIndex < laptopProducts.length) {
      setTransitionEnabled(false);
      setActiveIndex(activeIndex + laptopProducts.length);
    }
  };

  useEffect(() => {
    if (!transitionEnabled) {
      const timeout = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [transitionEnabled]);
  // getProductMeta is imported from "@/lib/utils"

  const hasMacbooks = laptopProducts.some(
    (p) => p.name.toLowerCase().includes("macbook") || p.name.toLowerCase().includes("apple")
  );
  const categorySlug = hasMacbooks ? "macbook" : "laptops";
  const ctaTitle = hasMacbooks ? "EXPLORE MACBOOKS" : "EXPLORE LAPTOPS";
  const heroTitleTop = hasMacbooks ? "APPLE" : "GAMING";
  const heroTitleBottom = hasMacbooks ? "MACBOOKS" : "LAPTOPS";
  const heroDesc = hasMacbooks
    ? "Premium Apple Macbooks with high-resolution Retina displays and powerful M-series chips. Genuine warranty."
    : "High-performance gaming laptops with latest GPUs and processors. Genuine parts with official warranty.";

  const extendedProducts = [...laptopProducts, ...laptopProducts, ...laptopProducts];

  const cardHeight = isDesktop ? 130 : 100;
  const gap = 16;
  const V = cardHeight * 3 + gap * 3; // Desktop: 600px, Mobile: 348px
  const H = cardHeight + gap;
  const offset = cardHeight * 0.5 + gap; // Desktop: 81px, Mobile: 66px
  const translateY = laptopProducts.length > 0 ? -activeIndex * H + offset : 0;

  return (
    <section className={styles.heroSection}>
      <span className={styles.cornerBracket} />

      {laptopProducts.length > 0 && (
        <div className={styles.heroProductsGrid}>
          <div className={styles.heroContent}>
            <div className={styles.gradientOverlay} />

            <div className={styles.contentInner}>
              <div className={`${styles.collectionLabel} label-mono`}>
                // FEATURED COLLECTION
              </div>

              <h1 className={styles.heroTitle}>
                <span style={{ display: "block" }}>{heroTitleTop}</span>
                <span style={{ display: "block" }}>{heroTitleBottom}</span>
              </h1>

              <p className={styles.desc}>{heroDesc}</p>

              <Link href={`/category/${categorySlug}`} className={`${styles.ctaLink} label-mono`}>
                {ctaTitle}
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className={styles.heroProducts}>
            <div
              className={styles.sliderContainer}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={styles.sliderWrapper}
                onTransitionEnd={handleTransitionEnd}
                style={{
                  transform: `translateY(${translateY}px)`,
                  transition: transitionEnabled ? "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
                }}
              >
                {extendedProducts.map((product, idx) => {
                  const { brandName, warranty, condition } = getProductMeta(product);
                  const isCenter = idx === activeIndex || idx === activeIndex + 1;

                  return (
                    <Link
                      key={`${product.id}-${idx}`}
                      href={`/product/${product.slug}`}
                      className={`${styles.heroProductCard} ${isCenter ? styles.heroProductCardActive : ""}`}
                    >
                      <span className={styles.miniBracket} />

                      <div className={styles.productImageWrapper}>
                        <Image
                          src={product.images?.[0]?.src || "/placeholder-product.png"}
                          alt={product.name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>

                      <div className={styles.productDetails}>
                        <h3 className={styles.productTitle}>{product.name}</h3>

                        <div className={`${styles.metaInfo} label-mono`}>
                          {brandName && <span>{brandName.toUpperCase()}</span>}
                          {brandName && warranty && <span>|</span>}
                          {warranty && <span>{warranty}</span>}
                          {warranty && condition && <span>|</span>}
                          {condition && <span>{condition.toUpperCase()}</span>}
                        </div>

                        <div className={styles.productPrice}>
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
