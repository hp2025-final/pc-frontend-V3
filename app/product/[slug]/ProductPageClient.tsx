"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck, Tag } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice, getStockLabel, getProductMeta, generateWhatsAppLink, getPriceTagInfo } from "@/lib/utils";
import Breadcrumb from "@/components/Breadcrumb";
import PCD_2 from "@/components/PCD_2";
import GridSection from "@/components/GridSection";
import styles from "./product.module.css";

interface ProductPageClientProps {
  product: WooCommerceProduct;
  relatedProducts: WooCommerceProduct[];
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
        : "COMPONENTS",
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

  return (
    <div className={styles.productPageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      {/* 12-Column Product Grid: Top row (Images 6 cols + Info 6 cols), Bottom row (Specs 6 cols + Description 6 cols) */}
      <section className={styles.productGrid}>
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
          {/* Category Badge - Top-Right, deepest child category, clickable */}
          {(() => {
            const deepestCategory = product.categories && product.categories.length > 0
              ? product.categories[product.categories.length - 1]
              : null;
            return deepestCategory ? (
              <Link
                href={`/category/${deepestCategory.slug}`}
                className={styles.categoryBadge}
              >
                {deepestCategory.name.toUpperCase()}
              </Link>
            ) : (
              <span className={styles.categoryBadge}>COMPONENTS</span>
            );
          })()}

          {/* Product Title - Enhanced */}
          <h1 className={styles.productTitle}>{product.name}</h1>

          {/* Price Module - Clean Design */}
          <div className={styles.priceModule}>
            {/* Meta Badges - Condition & Warranty (Above line, right aligned, 0 gap) */}
            <div className={styles.metaBadges}>
              <span className={styles.conditionBadge}>Condition: {condition}</span>
              <span className={styles.warrantyBadge}>Warranty: {warranty}</span>
            </div>

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

                <div className={styles.marketPriceRow}>
                  <div className={styles.marketPriceBadge}>
                    <span className={styles.badgeIconCell}>
                      <svg className={styles.arrowIconUp} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                      <svg className={styles.arrowIconDown} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </span>
                    <span className={styles.badgeTextCell}>MARKET PRICE</span>
                  </div>
                  <span className={styles.priceStableText}>Price stable</span>
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

          {/* Short Description */}
          {product.short_description && (
            <div className={styles.shortDescription}>
              <div
                className={styles.descriptionContent}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            </div>
          )}

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
            <span>MESSAGE US NOW</span>
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* AI-Optimized Market & Pricing Context (GEO) */}
          <div className={styles.aiContextBox}>
            <div className={styles.aiContextTitle}>// MARKET CONTEXT & VERIFICATION</div>
            <p className={styles.aiContextText}>
              {getAiPriceExplanation()}
            </p>
          </div>
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

        {/* BOTTOM LEFT: Specifications Table (6 cols) */}
        <div className={styles.specsColumn}>
          <div className={styles.specsContainer}>
            <div className={styles.specsHeader}>SPECIFICATIONS</div>

            {product.attributes && product.attributes.length > 0 ? (
              <div className={styles.specsTable}>
                {product.attributes.map((attr, idx) => (
                  <div key={`${attr.id || idx}-${attr.name}`} className={styles.specRow}>
                    <span className={styles.specLabel}>{attr.name.toUpperCase()}</span>
                    <span className={styles.specValue}>{attr.options.join(", ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.specsEmpty}>No specifications available</div>
            )}
          </div>
        </div>

        {/* BOTTOM RIGHT: Detailed Description (6 cols) */}
        {product.description && (
          <div className={styles.descriptionColumn}>
            <div className={styles.descriptionContainer}>
              <div className={styles.descriptionHeader}>
                <span className={styles.descCornerBracket} />
                <h2 className={styles.descriptionTitle}>DETAILED DESCRIPTION</h2>
              </div>
              <div
                className={styles.descriptionBody}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        )}

        {/* Dynamic FAQ / Q&A Section (AEO / GEO) */}
        <div className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <div className={styles.faqHeader}>
              <span className={styles.faqCornerBracket} />
              FAQ & HARDWARE GUIDE
            </div>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>Is PC Wala located in Karachi?</h4>
                <p className={styles.faqAnswer}>
                  Yes, our retail store is located at Store G41, Ground Floor, Regal Trade Square, Regal Chowk, Saddar, Karachi. You can visit us to buy directly, pick up orders, or discuss custom PC builds with our technicians.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>What warranty tier does this {brandName} product carry?</h4>
                <p className={styles.faqAnswer}>
                  This product has a <strong>{warranty}</strong> policy. PC Wala offers 5 transparent warranty tiers (International, Brand, Local, Limited, No Warranty) so you know exactly what is covered before you purchase.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>How does shipping work across Pakistan?</h4>
                <p className={styles.faqAnswer}>
                  We ship computer hardware nationwide within 1 to 4 business days. Karachi customers can request same-day courier delivery or select self-pickup at our Saddar store.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h4 className={styles.faqQuestion}>Why do hardware prices fluctuate on your site?</h4>
                <p className={styles.faqAnswer}>
                  Pakistan's tech market pricing shifts due to currency exchange rates and import clearance duties. We use indicators like "Price Down", "Price Up", and "High Fluctuation" to keep pricing 100% transparent for buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <GridSection
          title="Related Gear"
          subtitle="Compatible Hardware"
          count={relatedProducts.length}
          countLabel="Related Items"
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
