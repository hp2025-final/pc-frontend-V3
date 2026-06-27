import Link from "next/link";
import Image from "next/image";
import { Tag } from "lucide-react";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice, getStockLabel, generateWhatsAppLink, getProductMeta, getPriceTagInfo } from "@/lib/utils";
import OrderArrowButton from "./OrderArrowButton";
import styles from "./PCD_2.module.css";

interface PCD2Props {
  product: WooCommerceProduct;
  /** Optional override for the product detail URL. Defaults to /product/[slug] */
  productHref?: string;
}

export default function PCD_2({ product, productHref }: PCD2Props) {
  const stock = getStockLabel(product.stock_status);
  const mainImage = product.images?.[0]?.src || "/placeholder-product.png";
  const isOutOfStock = product.stock_status === "outofstock";

  // Retrieve Tag-Based Pricing Info
  const priceInfo = getPriceTagInfo(product);
  const onSale = product.on_sale && product.sale_price;

  let tagType = priceInfo.tagType;
  let percentage = priceInfo.percentage;
  let wasPrice = priceInfo.wasPrice;

  // Determine pricing scenario
  const regularPrice = product.regular_price;
  const salePrice = product.sale_price;
  const hasRegularPrice = regularPrice && parseFloat(regularPrice) > 0;
  const hasSalePrice = salePrice && parseFloat(salePrice) > 0;

  // Scenario Shift: High fluctuation (shift tag)
  const isScenarioShift = tagType === "shift";

  // Scenario 3: On sale but no tag (show sale badge on image)
  const isScenario3 = !tagType && onSale && hasRegularPrice && hasSalePrice;

  // Scenario 4: Only regular price, no sale (show market price badge)
  const isScenario4 = !tagType && !onSale && hasRegularPrice && !hasSalePrice;

  // Calculate discount for scenario 3
  const discountPercentage = isScenario3 && regularPrice && salePrice
    ? Math.round(((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100)
    : 0;

  const hasFluctuation = tagType && percentage > 0 && !isScenarioShift;

  // Resolve the destination URL for this product card
  const cardHref = productHref ?? `/product/${product.slug}`;

  return (
    <div className={`${styles.card} pcd2-on-sale-card`}>
      {/* Invisible link overlay covering the entire card */}
      <Link href={cardHref} className={styles.linkOverlay} />


      {/* Visual Area: Product Image */}
      <div className={styles.imageArea}>
        {/* Stock Badge - Top Left with Corner Bracket */}
        <div className={styles.badge}>
          <span className={styles.badgeBracket} />
          <span className={`${styles.badgeText} label-mono`}>
            {isOutOfStock ? "OUT OF STOCK" : "IN STOCK"}
          </span>
        </div>

        <Image
          src={mainImage}
          alt={product.images?.[0]?.alt || product.name}
          width={236}
          height={236}
          style={{
            objectFit: "contain",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </div>

      {/* Product Title Section */}
      <div className={styles.titleArea}>
        <h4 className={styles.productTitle}>
          {product.name}
        </h4>
      </div>

      {/* Footer: Conditional rendering based on scenarios */}

      {/* Scenario Shift: High Fluctuation */}
      {isScenarioShift ? (
        <div className={styles.footerArea}>
          {/* Row 1: High Fluctuation Badge */}
          <div className={styles.badgeRow}>
            <span className={styles.tagBadgeShift}>
              <span className={styles.badgeIconCell}>
                <svg className={styles.fluctuationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              <span className={styles.badgeTextCell}>HIGH FLUCTUATION</span>
            </span>
          </div>

          {/* Row 2: Price Range */}
          <div className={styles.priceRow}>
            {priceInfo.priceMax && parseFloat(priceInfo.priceMax) > 0 ? (
              <span className={styles.priceValue}>
                <span className={styles.priceLabel}>Max </span>
                {formatPrice(priceInfo.priceMax)}
              </span>
            ) : (
              <span className={styles.priceValue}>
                Contact Us
              </span>
            )}
          </div>

          {/* Row 3: Min price or range info */}
          <div className={styles.fluctuationRow}>
            {priceInfo.priceMin && parseFloat(priceInfo.priceMin) > 0 ? (
              <span className={styles.wasPriceText}>
                <span className={styles.minLabel}>Min </span>
                {formatPrice(priceInfo.priceMin)}
              </span>
            ) : null}
          </div>
        </div>
      ) : hasFluctuation ? (
        /* Scenario 1 & 2: Has price tag (PRICE UP or PRICE DOWN) */
        <div className={styles.footerArea}>
          {/* Row 1: Badge at top-right (separate row) */}
          <div className={styles.badgeRow}>
            {tagType === "price-down" ? (
              <span className={styles.tagBadgeDown}>
                <span className={styles.badgeIconCell}>
                  <svg className={styles.tagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                  </svg>
                </span>
                <span className={styles.badgeTextCell}>PRICE DOWN</span>
              </span>
            ) : (
              <span className={styles.tagBadgeUp}>
                <span className={styles.badgeIconCell}>
                  <svg className={styles.tagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </span>
                <span className={styles.badgeTextCell}>PRICE UP</span>
              </span>
            )}
          </div>

          {/* Row 2: Full-width price display */}
          <div className={styles.priceRow}>
            <span className={styles.priceValue}>
              {formatPrice(priceInfo.displayPrice)}
            </span>
          </div>

          {/* Row 3: Was price + Percentage below */}
          <div className={styles.fluctuationRow}>
            {wasPrice && (
              <span className={styles.wasPriceText}>
                Was {formatPrice(wasPrice)}
              </span>
            )}
            {tagType === "price-down" ? (
              <span className={styles.percentageTextDown}>-{percentage}%</span>
            ) : (
              <span className={styles.percentageText}>+{percentage}%</span>
            )}
          </div>
        </div>
      ) : isScenario3 ? (
        /* Scenario 3: On sale but no tag - show sale price with was regular price */
        <div className={styles.footerArea}>
          {/* Row 1: Sale Badge */}
          <div className={styles.badgeRow}>
            {discountPercentage > 0 && (
              <span className={styles.tagBadgeSale}>
                <span className={styles.badgeIconCell}>
                  <Tag className={styles.tagIcon} />
                </span>
                <span className={styles.badgeTextCell}>SALE {discountPercentage}% OFF</span>
              </span>
            )}
          </div>

          {/* Row 2: Sale price (large) */}
          <div className={styles.priceRow}>
            <span className={styles.priceValue}>
              {formatPrice(salePrice)}
            </span>
          </div>

          {/* Row 3: Was regular price */}
          <div className={styles.fluctuationRow}>
            <span className={styles.wasPriceText} style={{ textDecoration: "line-through" }}>
              Was {formatPrice(regularPrice)}
            </span>
          </div>
        </div>
      ) : isScenario4 ? (
        /* Scenario 4: Only regular price - show market price badge */
        <div className={styles.footerArea}>
          {/* Row 1: Market Price badge */}
          <div className={styles.badgeRow}>
            <span className={styles.marketPriceBadge}>
              <span className={styles.badgeIconCell}>
                <svg className={styles.arrowIconUp} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                <svg className={styles.arrowIconDown} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </span>
              <span className={styles.badgeTextCell}>MARKET PRICE</span>
            </span>
          </div>

          {/* Row 2: Regular price only */}
          <div className={styles.priceRow}>
            <span className={styles.priceValue}>
              {formatPrice(regularPrice)}
            </span>
          </div>

          {/* Row 3: Info text explaining stable price */}
          <div className={styles.fluctuationRow}>
            <span className={styles.wasPriceText}>
              NOT CHANGED
            </span>
          </div>
        </div>
      ) : (
        /* Fallback: Standard price + WhatsApp arrow layout */
        <div className={styles.fallbackFooter}>
          <div className={styles.fallbackPriceCol}>
            <div className={`${styles.fallbackPriceLabel} label-mono`}>
              PRICE
            </div>
            <span className={styles.fallbackPriceValue}>
              {formatPrice(priceInfo.displayPrice)}
            </span>
          </div>
          <div className={styles.fallbackWhatsappCol}>
            <OrderArrowButton whatsappLink={generateWhatsAppLink(product)} />
          </div>
        </div>
      )}
    </div>
  );
}
