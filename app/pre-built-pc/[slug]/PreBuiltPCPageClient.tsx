"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, Tag, Cpu, Server, HardDrive, Fan, Plug, MemoryStick, CircuitBoard, Layers } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice, getStockLabel, getProductMeta, generateWhatsAppLink, getPriceTagInfo } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import PCD_2 from "@/components/PCD_2";
import GridSection from "@/components/GridSection";
import styles from "./prebuilt.module.css";

interface PreBuiltPCPageClientProps {
  product: WooCommerceProduct;
  relatedProducts: WooCommerceProduct[];
  children: React.ReactNode; // Expert & Why sections passed from server component
}

export default function PreBuiltPCPageClient({ product, relatedProducts, children }: PreBuiltPCPageClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const stock = getStockLabel(product.stock_status);
  const { brandName, warranty, condition } = getProductMeta(product);
  const whatsappLink = generateWhatsAppLink(product);
  const priceInfo = getPriceTagInfo(product);

  // Determine pricing scenarios
  const regularPrice = product.regular_price;
  const salePrice = product.sale_price;
  const hasRegularPrice = regularPrice && parseFloat(regularPrice) > 0;
  const hasSalePrice = salePrice && parseFloat(salePrice) > 0;
  const onSale = product.on_sale && hasSalePrice;

  // Calculate discount for on-sale scenario
  const discountPercentage = onSale && regularPrice && salePrice
    ? Math.round(((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100)
    : 0;

  const getAiPriceExplanation = () => {
    const brand = brandName || "PC WALA";
    const name = product.name;
    const cond = condition.toLowerCase();
    const warr = warranty;
    const cleanPrice = formatPrice(priceInfo.displayPrice);

    if (priceInfo.tagType === "shift") {
      const minP = priceInfo.priceMin ? formatPrice(priceInfo.priceMin) : "";
      const maxP = priceInfo.priceMax ? formatPrice(priceInfo.priceMax) : "";
      return `The market price of ${brand} ${name} in Pakistan is currently fluctuating. We expect rates to range between ${minP} and ${maxP} depending on dollar volatility. Condition is ${cond} with ${warr} warranty coverage. We recommend checking availability directly via WhatsApp to lock in today's best price before visiting our Saddar, Karachi shop.`;
    } else if (priceInfo.tagType === "price-down") {
      const pct = priceInfo.percentage;
      const oldP = priceInfo.wasPrice ? formatPrice(priceInfo.wasPrice) : "";
      return `Good news for tech buyers: the price of ${brand} ${name} in Pakistan has gone down by ${pct}%! It is now available at a discounted rate of ${cleanPrice} (reduced from ${oldP}). This item is ${cond} with ${warr} warranty. Buy now or visit our retail store in Saddar, Karachi to secure it before stock runs out.`;
    } else if (priceInfo.tagType === "price-up") {
      const pct = priceInfo.percentage;
      const oldP = priceInfo.wasPrice ? formatPrice(priceInfo.wasPrice) : "";
      return `Due to import duties and dollar rate shifts in Pakistan, the price of ${brand} ${name} has increased by ${pct}%, moving to ${cleanPrice} from ${oldP} previously. Despite the market increase, we guarantee genuine ${cond} stock with ${warr} warranty. Contact us on WhatsApp for real-time rates.`;
    } else if (onSale && discountPercentage > 0) {
      return `Get ${brand} ${name} at a special sale price of ${cleanPrice} in Pakistan (save ${discountPercentage}% off regular retail). Certified ${cond} condition with ${warr} warranty. Secure your build via WhatsApp or pick up directly from our retail outlet in Saddar, Karachi.`;
    } else {
      return `Buy original ${brand} ${name} in Pakistan at the current market price of ${cleanPrice}. This hardware is in ${cond} condition, backed by a ${warr} warranty tier. Local pickup is available at Store G41, Regal Trade Square, Saddar, Karachi, with nationwide shipping across Pakistan.`;
    }
  };

  const breadcrumbs = [
    // Show only the deepest child category (last category in the array)
    // If no categories, show a default
    {
      label: product.categories && product.categories.length > 0 
        ? product.categories[product.categories.length - 1].name.toUpperCase()
        : "PRE-BUILT PCS",
      url: product.categories && product.categories.length > 0
        ? `/category/${product.categories[product.categories.length - 1].slug}`
        : undefined,
    },
    { label: product.name },
  ];

  // Navigation handlers
  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev < (product.images?.length || 1) - 1 ? prev + 1 : prev
    );
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
  };

  const totalImages = product.images?.length || 0;
  
  // Calculate thumbnail slider position for mobile (show 4 at a time, keep active in view)
  const getMobileThumbnailTransform = () => {
    if (totalImages <= 4) return 0;
    
    // Calculate offset to keep active thumbnail visible
    // Shows 4 thumbnails, starting from activeIndex when possible
    let offset = activeImageIndex;
    
    // Adjust if we're near the end
    const maxOffset = totalImages - 4;
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    
    // Ensure offset is not negative
    if (offset < 0) {
      offset = 0;
    }
    
    // Each thumbnail is 80px, container shows 4 (320px total)
    // Move by 80px per thumbnail = 25% of container height per thumbnail
    return -(offset * 25);
  };

  // Extract expert fields dynamically for navigator index
  const expertFields = [
    { key: "assessment_summary", title: "Assessment Summary" },
    { key: "competitive_games", title: "Competitive Games" },
    { key: "modern_aaa_games", title: "Modern AAA Games" },
    { key: "where_you_should_avoid_ultra_settings", title: "Where You Should Avoid Ultra Settings" },
    { key: "ray_tracing_reality", title: "Ray Tracing Reality" },
    { key: "ai_reality", title: "AI Reality" },
    { key: "can_this_play_every_game_on_ultra", title: "Can This Play Every Game On Ultra" },
  ];
  const expertItems = expertFields
    .map((f) => ({
      ...f,
      value: product.meta_data?.find((m) => m.key === f.key)?.value,
    }))
    .filter((f) => f.value && String(f.value).trim() !== "");

  // Extract why fields dynamically for navigator index
  const getMetaVal = (key: string) => {
    const found = product.meta_data?.find((m) => m.key === key);
    return found ? String(found.value).trim() : "";
  };
  const whyFields = [
    { key: "why_section_why_we_selected_the_gpu", title: `Why We Selected The ${getMetaVal("acf_graphics_card") || "GPU"}` },
    { key: "why_section_why_we_selected_the_cpu", title: `Why We Selected The ${getMetaVal("acf_processor") || "CPU"}` },
    { key: "why_section_why_we_selected_the_motherboard", title: `Why We Selected The ${getMetaVal("acf_motherboard") || "Motherboard"}` },
    { key: "why_section_why_we_selected_the_ram", title: `Why We Selected The ${getMetaVal("acf_ram") || "RAM"}` },
    { key: "why_section_why_we_selected_the_storage", title: `Why We Selected The ${getMetaVal("acf_storage") || "Storage"}` },
    { key: "why_section_why_we_selected_the_cooler", title: `Why We Selected The ${getMetaVal("acf_pc_coolers_fans") || "Cooler"}` },
    { key: "why_section_why_we_selected_the_psu", title: `Why We Selected The ${getMetaVal("acf_power_supply") || "PSU"}` },
    { key: "why_section_why_we_selected_the_pc_case", title: `Why We Selected The ${getMetaVal("acf_pc_case") || "PC Case"}` },
  ];
  const whyItems = whyFields
    .map((f) => ({
      ...f,
      value: product.meta_data?.find((m) => m.key === f.key)?.value,
    }))
    .filter((f) => f.value && String(f.value).trim() !== "");

  const jumpToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90; // offset for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileDrawerOpen(false);
    }
  };

  const navigationSections = [
    { id: "overview", label: "Overview", num: "01" },
    { id: "specifications", label: "Specifications", num: "02" },
    { 
      id: "expert-assessment", 
      label: "Expert Assessment", 
      num: "03",
      subItems: expertItems.map((item) => ({ id: `expert-${item.key}`, label: item.title }))
    },
    { 
      id: "why-chosen", 
      label: "Why Chosen Components", 
      num: "04",
      subItems: whyItems.map((item) => ({ id: `why-${item.key}`, label: item.title }))
    }
  ];

  return (
    <div className={styles.productPageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.mainLayoutGrid}>
        <div className={styles.leftContentColumn}>
          {/* 12-Column Product Grid: Top row (Images 6 cols + Info 6 cols), Bottom row (Specs 6 cols + Description 6 cols) */}
          <section className={styles.productGrid} id="overview">
            {/* TOP LEFT: Image Gallery (6 cols) */}
            <div className={styles.imageColumn}>
              <div className={styles.imageSticky}>
                {/* Main Image Display */}
                {product.images && product.images.length > 0 && (
                  <div className={styles.imageGalleryLayout}>
                    {/* Left: Thumbnails (vertical column) - Always show */}
                    <div className={styles.thumbnailColumnWrapper}>
                      <div 
                        className={styles.thumbnailColumn}
                        style={{
                          transform: `translateY(${getMobileThumbnailTransform()}%)`,
                        }}
                      >
                        {product.images.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={() => handleThumbnailClick(idx)}
                            className={`${styles.thumbnail} ${
                              idx === activeImageIndex ? styles.thumbnailActive : ""
                            }`}
                            aria-label={`View image ${idx + 1}`}
                          >
                            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                              <Image
                                src={img.src}
                                alt={img.alt || `Thumbnail ${idx + 1}`}
                                fill
                                style={{ objectFit: "contain", padding: '8px' }}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Center: Main Image */}
                    <div className={styles.mainImageContainer}>
                      {/* Stock Badge - Top-Right of Main Image */}
                      <div className={`${styles.stockBadgeOnImage} ${stock.active ? styles.stockBadgeActive : styles.stockBadgeInactive}`}>
                        <span className={`${styles.stockDot} ${stock.active ? styles.stockDotActive : styles.stockDotInactive}`} />
                        <span className={styles.stockText}>{stock.text}</span>
                        <span className={styles.stockBracket} />
                      </div>

                      <div className={styles.mainImageWrapper}>
                        <Image
                          src={product.images[activeImageIndex]?.src || product.images[0].src}
                          alt={product.images[activeImageIndex]?.alt || `${product.name} - Image ${activeImageIndex + 1}`}
                          fill
                          style={{ objectFit: "contain", padding: '10px' }}
                          priority={activeImageIndex === 0}
                        />
                      </div>
                    </div>

                    {/* Right: Navigation Bar - Always show */}
                    <div className={styles.navigationBarWrapper}>
                      <div className={styles.navigationBar}>
                        {/* Up Arrow Button */}
                        <button
                          onClick={handlePrevImage}
                          disabled={activeImageIndex === 0}
                          className={styles.navButtonUp}
                          aria-label="Previous image"
                        >
                          <ChevronLeft size={20} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
                        </button>

                        {/* Counter Display */}
                        <div className={styles.imageCounter}>
                          {String(activeImageIndex + 1).padStart(2, "0")} / {String(totalImages).padStart(2, "0")}
                        </div>

                        {/* Down Arrow Button */}
                        <button
                          onClick={handleNextImage}
                          disabled={activeImageIndex === totalImages - 1}
                          className={styles.navButtonDown}
                          aria-label="Next image"
                        >
                          <ChevronRight size={20} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* TOP RIGHT: Product Info (6 cols) */}
            <div className={styles.infoColumn}>
              {/* Category Badges - Top-Right, parent + child category, clickable */}
              {(() => {
                const categories = product.categories || [];
                // Parent category = first in array, Child = last (deepest)
                const parentCategory = categories.length > 0 ? categories[0] : null;
                const childCategory = categories.length > 1 ? categories[categories.length - 1] : null;

                return (
                  <div className={styles.categoryBadgeGroup}>
                    {parentCategory && (
                      <Link
                        href={`/category/${parentCategory.slug}`}
                        className={styles.categoryBadge}
                      >
                        {parentCategory.name.toUpperCase()}
                      </Link>
                    )}
                    {childCategory && (
                      <Link
                        href={`/category/${childCategory.slug}`}
                        className={styles.categoryBadgeChild}
                      >
                        {childCategory.name.toUpperCase()}
                      </Link>
                    )}
                    {!parentCategory && !childCategory && (
                      <span className={styles.categoryBadge}>PRE-BUILT PCS</span>
                    )}
                  </div>
                );
              })()}

              {/* Product Title - Enhanced */}
              <h1 className={styles.productTitle}>{product.name}</h1>

              {/* Inline Badges & Value Rating Row under Product Name */}
              <div className={styles.ratingAndBadgesRow}>
                {(() => {
                  const ratingMeta = product.meta_data?.find((m) => m.key === "acf_value_rating");
                  if (ratingMeta && String(ratingMeta.value).trim() !== "") {
                    const ratingStr = String(ratingMeta.value);
                    const score = parseFloat(ratingStr);
                    const roundedScore = isNaN(score) ? 0 : Math.round(score);
                    return (
                      <div className={styles.valueRatingContainer}>
                        <div className={styles.ratingBlocks}>
                          {[...Array(10)].map((_, i) => (
                            <span
                              key={i}
                              className={`${styles.ratingBlock} ${
                                i < roundedScore ? styles.ratingBlockFilled : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span className={styles.ratingText}>Our Expert Rate this {ratingStr}</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Dynamic Badges inline next to rating */}
                {(() => {
                  const badgesMeta = product.meta_data?.find((m) => m.key === "acf_badges");
                  if (badgesMeta && String(badgesMeta.value).trim() !== "") {
                    const badges = String(badgesMeta.value)
                      .split(",")
                      .map((b) => b.trim())
                      .filter((b) => b !== "");
                    return (
                      <div className={styles.dynamicBadgesRow}>
                        {badges.map((badge, index) => (
                          <span key={index} className={styles.dynamicBadge}>
                            {badge.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Price Module - Clean Design */}
              <div className={styles.priceModule}>
                {/* Border Line (0 gap below badges) */}
                <div className={styles.priceBorderLine} />

                {/* Price Display - Tag-Based Logic (6 Scenarios) */}
                {priceInfo.tagType === "shift" ? (
                  <>
                    {/* SCENARIO 0: HIGH FLUCTUATION (Shift Tag) */}
                    <div className={styles.priceRow}>
                      <div className={styles.shiftBadge}>
                        <span className={styles.badgeIconCell}>
                          <svg className={styles.fluctuationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                          </svg>
                        </span>
                        <span className={styles.badgeTextCell}>HIGH FLUCTUATION</span>
                      </div>
                    </div>
                    
                    <div className={styles.priceRow}>
                      {priceInfo.priceMax && parseFloat(priceInfo.priceMax) > 0 ? (
                        <span className={styles.shiftPrice}>
                          <span className={styles.maxMinLabel}>Max</span> {formatPrice(priceInfo.priceMax)}
                        </span>
                      ) : (
                        <span className={styles.shiftPrice}>Contact Us</span>
                      )}
                    </div>

                    <div className={styles.priceRow}>
                      {priceInfo.priceMin && parseFloat(priceInfo.priceMin) > 0 && (
                        <span className={styles.shiftPrice}>
                          <span className={styles.maxMinLabel}>Min</span> {formatPrice(priceInfo.priceMin)}
                        </span>
                      )}
                    </div>

                    <div className={styles.priceInfoRow}>
                      <span className={styles.priceLocationNote}>
                        Price varies due to market conditions
                      </span>
                    </div>
                  </>
                ) : priceInfo.tagType === "price-down" ? (
                  <>
                    {/* SCENARIO 1: PRICE DOWN */}
                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>{formatPrice(priceInfo.displayPrice)}</span>
                    </div>
                    
                    {/* Price Down Row */}
                    <div className={styles.priceDownRow}>
                      <div className={styles.priceDownBadge}>
                        <span className={styles.badgeIconCell}>
                          <svg className={styles.tagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                          </svg>
                        </span>
                        <span className={styles.badgeTextCell}>PRICE DOWN</span>
                      </div>
                      {priceInfo.wasPrice && (
                        <>
                          <span className={styles.wasPrice}>
                            Was {formatPrice(priceInfo.wasPrice)}
                          </span>
                          {priceInfo.percentage > 0 && (
                            <span className={styles.discountPercentage}>-{priceInfo.percentage}%</span>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : priceInfo.tagType === "price-up" ? (
                  <>
                    {/* SCENARIO 2: PRICE UP */}
                    <div className={styles.priceRow}>
                      <span className={styles.mainPrice}>{formatPrice(priceInfo.displayPrice)}</span>
                    </div>
                    
                    {/* Price Up Row */}
                    <div className={styles.priceUpRow}>
                      <div className={styles.priceUpBadge}>
                        <span className={styles.badgeIconCell}>
                          <svg className={styles.tagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          </svg>
                        </span>
                        <span className={styles.badgeTextCell}>PRICE UP</span>
                      </div>
                      {priceInfo.wasPrice && (
                        <>
                          <span className={styles.wasPriceUp}>
                            Was {formatPrice(priceInfo.wasPrice)}
                          </span>
                          {priceInfo.percentage > 0 && (
                            <span className={styles.increasePercentage}>+{priceInfo.percentage}%</span>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : onSale ? (
                  <>
                    {/* SCENARIO 3: ON SALE (Standard WooCommerce Sale) */}
                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>{formatPrice(salePrice)}</span>
                    </div>

                    <div className={styles.saleInfoRow}>
                      {discountPercentage > 0 && (
                        <div className={styles.saleBadge}>
                          <span className={styles.badgeIconCell}>
                            <Tag className={styles.tagIcon} />
                          </span>
                          <span className={styles.badgeTextCell}>SALE {discountPercentage}% OFF</span>
                        </div>
                      )}
                      <span className={styles.wasPrice} style={{ textDecoration: "line-through" }}>
                        Was {formatPrice(regularPrice)}
                      </span>
                    </div>
                  </>
                ) : hasRegularPrice ? (
                  <>
                    {/* SCENARIO 4: MARKET PRICE (Stable) */}
                    <div className={styles.priceRow}>
                      <span className={styles.mainPrice}>{formatPrice(regularPrice)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* SCENARIO 5: FALLBACK (No price available) */}
                    <div className={styles.priceRow}>
                      <span className={styles.mainPrice}>Contact Us for Price</span>
                    </div>
                  </>
                )}

                {/* SEO-Optimized Location Note - Always Show */}
                <div className={styles.priceLocationNote}>
                  In Stock at Saddar, Karachi — Order Now or Visit Us Today
                </div>
              </div>

              {/* Delivery Info Cell */}
              <div className={styles.deliveryInfo}>
                <Truck className={styles.deliveryIcon} strokeWidth={2} />
                <span className={styles.deliveryText}>
                  <strong>Estimated delivery:</strong> 1 - 4 days across the country
                </span>
              </div>

              {/* ACF-Pre-Built Group Component Summary Block */}
              {(() => {
                const getMetaValue = (key: string) => {
                  const found = product.meta_data?.find((m) => m.key === key);
                  return found ? String(found.value) : "";
                };

                const headingVal = getMetaValue("acf_heading");
                const processorVal = getMetaValue("acf_processor");
                const gpuVal = getMetaValue("acf_graphics_card");
                const ramVal = getMetaValue("acf_ram");
                const storageVal = getMetaValue("acf_storage");

                return (
                  <div className={styles.prebuiltSummaryBlock}>
                    {headingVal && (
                      <div className={styles.summaryModelRow}>
                        Model: <strong className={styles.summaryModelValue}>{headingVal}</strong>
                      </div>
                    )}
                    
                    <table className={styles.summaryTable}>
                      <tbody>
                        {processorVal && (
                          <tr>
                            <td>Processor</td>
                            <td>{processorVal}</td>
                          </tr>
                        )}
                        {gpuVal && (
                          <tr>
                            <td>Graphics Card</td>
                            <td>{gpuVal}</td>
                          </tr>
                        )}
                        {ramVal && (
                          <tr>
                            <td>PC RAM</td>
                            <td>{ramVal}</td>
                          </tr>
                        )}
                        {storageVal && (
                          <tr>
                            <td>Storage</td>
                            <td>{storageVal}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* WhatsApp Button - Enhanced with Icon */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                <svg className={styles.whatsappIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d={siWhatsapp.path} />
                </svg>
                <span>Order Now</span>
                <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* USP Marquee - Full Width Below Image and Info Sections */}
            <div className={styles.uspMarquee}>
              <div className={styles.uspMarqueeTrack}>
                {/* Duplicate content for seamless loop */}
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={styles.uspMarqueeItem}>
                      Trusted Since 2010 — 16+ Years in Saddar Market
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>

                    <span className={styles.uspMarqueeItem}>
                      Get Human Support in 5 Min
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      <a href="https://wa.me/923022189972?text=Hi%2C+I+need+help+with+compatibility+check" target="_blank" rel="noopener noreferrer">
                        Free Compatibility Check — Chat with Our Expert
                      </a>
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      Genuine & Tested Parts
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>

                    <span className={styles.uspMarqueeItem}>
                      Wholesale Background — Competitive Pricing
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      <a href={`https://wa.me/923022189972?text=Hi%2C+I'm+interested+in+a+bulk+order+for+${encodeURIComponent(product.name)}.+Please+share+pricing+and+availability.`} target="_blank" rel="noopener noreferrer">
                        Bulk Orders? Chat with Us
                      </a>
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      Same Day Delivery in Karachi
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      Nationwide Delivery in 1–4 Days
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      <a href="/warranty">
                        Warranty Policy
                      </a>
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      <a href="/terms">
                        Terms & Conditions
                      </a>
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                    
                    <span className={styles.uspMarqueeItem}>
                      WhatsApp Ordering
                    </span>
                    <span className={styles.uspMarqueeSeparator}>·</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Group 2 Specifications Grid: 4 columns x 2 rows */}
            <section className={styles.specsGridSection} id="specifications">
              <div className={styles.specsGridHeader}>SYSTEM SPECIFICATIONS</div>
              {(() => {
                const getMetaValue = (key: string) => {
                  const found = product.meta_data?.find((m) => m.key === key);
                  return found ? String(found.value) : "";
                };

                const groups = [
                  {
                    title: "PROCESSOR (CPU)",
                    icon: <Cpu size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_processor_cpu_acf_f_processor_name") },
                      { label: "Cores/Threads", value: getMetaValue("acf_g_processor_cpu_acf_f_processor_cores_threads") },
                      { label: "Speed", value: getMetaValue("acf_g_processor_cpu_acf_f_base_frequency_boost_frequency") },
                    ],
                  },
                  {
                    title: "GRAPHICS CARD (GPU)",
                    icon: <Layers size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_graphics_card_gpu_acf_f_graphics_card_name") },
                      { label: "VRAM", value: getMetaValue("acf_g_graphics_card_gpu_acf_f_vram_capacity") },
                      { label: "Type", value: getMetaValue("acf_g_graphics_card_gpu_acf_f_vram_type") },
                      { label: "Bus", value: getMetaValue("acf_g_graphics_card_gpu_acf_f_memory_bus") },
                    ],
                  },
                  {
                    title: "MOTHERBOARD",
                    icon: <CircuitBoard size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_motherboard_acf_f_motherboard_name") },
                      { label: "Chipset", value: getMetaValue("acf_g_motherboard_acf_f_chipset") },
                      { label: "PCIe", value: getMetaValue("acf_g_motherboard_acf_f_pcie_support") },
                      { label: "WiFi", value: getMetaValue("acf_g_motherboard_acf_f_integrated") },
                    ],
                  },
                  {
                    title: "MEMORY (RAM)",
                    icon: <MemoryStick size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_memory_ram_acf_f_ram_name") },
                      { label: "Modules", value: getMetaValue("acf_g_memory_ram_acf_f_ram_modules") },
                      { label: "Channel", value: getMetaValue("acf_g_memory_ram_acf_f_ram_channel") },
                    ],
                  },
                  {
                    title: "STORAGE",
                    icon: <HardDrive size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_storage_acf_f_storage_name") },
                      { label: "Interface", value: getMetaValue("acf_g_storage_acf_f_interface_pcie_lanes") },
                      { label: "Speed", value: getMetaValue("acf_g_storage_acf_f_max_read_speed") },
                    ],
                  },
                  {
                    title: "COOLING SYSTEM",
                    icon: <Fan size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_cooling_system_acf_f_cooler_name") },
                      { label: "Radiator", value: getMetaValue("acf_g_cooling_system_acf_f_radiator_size") },
                      { label: "Type", value: getMetaValue("acf_g_cooling_system_acf_f_cooling_category") },
                    ],
                  },
                  {
                    title: "PC CASE",
                    icon: <Server size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_pc_case_acf_f_pc_case_name") },
                      { label: "Color", value: getMetaValue("acf_g_pc_case_acf_f_color") },
                      { label: "Side Panel", value: getMetaValue("acf_g_pc_case_acf_f_side_panel") },
                      { label: "Fans", value: getMetaValue("acf_g_pc_case_acf_f_fans_included") },
                    ],
                  },
                  {
                    title: "POWER SUPPLY (PSU)",
                    icon: <Plug size={20} className={styles.specBoxIcon} />,
                    fields: [
                      { label: "Name", value: getMetaValue("acf_g_power_supply_acf_f_psu_name") },
                      { label: "Wattage", value: getMetaValue("acf_g_power_supply_acf_f_wattage") },
                      { label: "Cert", value: getMetaValue("acf_g_power_supply_acf_f_efficiency_certification") },
                      { label: "Type", value: getMetaValue("acf_g_power_supply_acf_f_modular_type") },
                    ],
                  },
                ];

                return (
                  <div className={styles.specsGridContainer}>
                    {groups.map((group, idx) => (
                      <div key={idx} className={styles.specBox}>
                        <div className={styles.specBoxHeaderRow}>
                          <span className={styles.specBoxTitle}>{group.title}</span>
                          {group.icon}
                        </div>
                        <div className={styles.specBoxList}>
                          {group.fields.map((f, fIdx) => f.value.trim() !== "" && (
                            <div key={fIdx} className={styles.specBoxItem}>
                              <span className={styles.specBoxValue}>{f.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </section>

            {/* Expert Assessment & Why Sections - Server-rendered for SEO */}
            {children}

          </section>
        </div>

        {/* Right sticky column for Desktop navigator */}
        <div className={styles.rightJumpColumn}>
          <div className={styles.stickyJumpContainer}>
            <div className={styles.stickyJumpHeader}>
              <span className={styles.stickyJumpHeaderNum}>#</span>
              <span className={styles.stickyJumpHeaderTitle}>NAVIGATOR</span>
            </div>
            <ul className={styles.stickyJumpList}>
              {navigationSections.map((sec) => (
                <li key={sec.id} className={styles.stickyJumpItem}>
                  <button 
                    onClick={() => jumpToSection(sec.id)} 
                    className={styles.stickyJumpLink}
                  >
                    <span className={styles.stickyJumpNum}>{sec.num}</span>
                    <span className={styles.stickyJumpLabel}>{sec.label}</span>
                  </button>
                  {sec.subItems && sec.subItems.length > 0 && (
                    <ul className={styles.stickyJumpSubList}>
                      {sec.subItems.map((sub) => (
                        <li key={sub.id} className={styles.stickyJumpSubItem}>
                          <button 
                            onClick={() => jumpToSection(sub.id)} 
                            className={styles.stickyJumpSubLink}
                          >
                            {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Section Drawer Trigger */}
      <button 
        className={styles.mobileFloatTrigger}
        onClick={() => setIsMobileDrawerOpen(true)}
        aria-label="Open page navigator"
      >
        INDEX
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div 
          className={styles.mobileDrawerOverlay}
          onClick={() => setIsMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={`${styles.mobileDrawer} ${isMobileDrawerOpen ? styles.mobileDrawerOpen : ""}`}>
        <div className={styles.mobileDrawerHeader}>
          <span className={styles.mobileDrawerHeaderTitle}>INDEX</span>
          <button 
            className={styles.mobileDrawerClose}
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-label="Close page navigator"
          >
            ✕
          </button>
        </div>
        <ul className={styles.mobileDrawerList}>
          {navigationSections.map((sec) => (
            <li key={sec.id} className={styles.mobileDrawerItem}>
              <button 
                onClick={() => jumpToSection(sec.id)} 
                className={styles.mobileDrawerLink}
              >
                <span className={styles.mobileDrawerNum}>{sec.num}</span>
                <span className={styles.mobileDrawerLabel}>{sec.label}</span>
              </button>
              {sec.subItems && sec.subItems.length > 0 && (
                <ul className={styles.mobileDrawerSubList}>
                  {sec.subItems.map((sub) => (
                    <li key={sub.id} className={styles.mobileDrawerSubItem}>
                      <button 
                        onClick={() => jumpToSection(sub.id)} 
                        className={styles.mobileDrawerSubLink}
                      >
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <GridSection
          title="Related Gear"
          subtitle="Pre-Built PCs"
          count={relatedProducts.length}
          countLabel="Pre-Built PCs"
        >
          {relatedProducts.map((p) => (
            <div key={p.id} style={{ gridColumn: "span 2" }}>
              <PCD_2 product={p} />
            </div>
          ))}
        </GridSection>
      )}
    </div>
  );
}
