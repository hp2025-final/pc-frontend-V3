import Link from "next/link";
import Image from "next/image";
import { WooCommerceProduct } from "@/lib/types";
import { formatPrice, getStockLabel, generateWhatsAppLink, getProductMeta } from "@/lib/utils";
import OrderArrowButton from "./OrderArrowButton";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const stock = getStockLabel(product.stock_status);
  const mainImage = product.images?.[0]?.src || "/placeholder-product.png";
  const regularPrice = product.regular_price;
  const salePrice = product.sale_price;
  const onSale = product.on_sale && salePrice;

  // Retrieve metadata using shared utility
  const { brandName, warranty, condition } = getProductMeta(product);

  const isOutOfStock = product.stock_status === "outofstock";

  // Calculate discount percentage if on sale
  const discountPercentage = onSale && regularPrice && salePrice
    ? Math.round(((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100)
    : 0;

  return (
    <div className={`${styles.card} latest-arrival-card`}>
      {/* Invisible link overlay covering the entire card */}
      <Link href={`/product/${product.slug}`} className={styles.linkOverlay} />

      {/* Visual Area: Product Image */}
      <div className={styles.imageArea}>
        {/* Stock Badge - Top Left with Orange Bracket Corner */}
        <div className={styles.badge}>
          {/* Lime Green Bracket Corner - Bottom Right */}
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
        
        {/* Product Info Line: Brand | Warranty | Condition */}
        <div className={`${styles.metaInfo} label-mono`}>
          {brandName && <span>{brandName.toUpperCase()}</span>}
          {brandName && warranty && <span>|</span>}
          {warranty && <span>{warranty}</span>}
          {warranty && condition && <span>|</span>}
          {condition && <span>{condition.toUpperCase()}</span>}
        </div>
      </div>

      {/* Price and Order Button Row */}
      <div className={styles.footerGrid}>
        {/* Left: Price Section */}
        <div className={styles.priceCol}>
          <div className={`${styles.priceLabel} label-mono`}>
            PRICE
          </div>
          
          {onSale ? (
            <div className={styles.priceRow}>
              <span className={styles.salePriceValue}>
                {formatPrice(salePrice)}
              </span>
              {discountPercentage > 0 && (
                <span className={`${styles.discountBadge} label-mono`}>
                  -{discountPercentage}%
                </span>
              )}
              <span className={styles.regularPriceCross}>
                {formatPrice(regularPrice)}
              </span>
            </div>
          ) : (
            <span className={styles.priceValue}>
              {formatPrice(product.price || "Contact")}
            </span>
          )}
        </div>

        {/* Right: Order Arrow Button */}
        <div>
          <OrderArrowButton whatsappLink={generateWhatsAppLink(product)} />
        </div>
      </div>
    </div>
  );
}
