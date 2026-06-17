import { WooCommerceProduct } from "./types";

/**
 * Format raw WooCommerce price to Rs. X,XXX format.
 * Returns "Contact for Price" if price is 0 or invalid.
 */
export function formatPrice(price: string | number): string {
  if (!price || price === "0" || price === 0) return "Contact for Price";
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numericPrice) || numericPrice === 0) return "Contact for Price";
  return `Rs. ${Math.round(numericPrice).toLocaleString("en-US")}`;
}

/**
 * Strips HTML tags from strings for clean plain text rendering (e.g. meta descriptions).
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Get price tag type and calculate percentage change.
 */
export function getPriceTagInfo(product: WooCommerceProduct): {
  tagType: "price-down" | "price-up" | "shift" | null;
  displayPrice: string;
  wasPrice: string | null;
  percentage: number;
  hasValidPrices: boolean;
  priceMax?: string;
  priceMin?: string;
} {
  // Check for Price Down, Price Up, or Shift tags
  const priceDownTag = product.tags?.find(
    (tag) => tag.slug === "price-down" || tag.name.toLowerCase() === "price down"
  );
  const priceUpTag = product.tags?.find(
    (tag) => tag.slug === "price-up" || tag.name.toLowerCase() === "price up"
  );
  const shiftTag = product.tags?.find(
    (tag) => tag.slug === "shift" || tag.name.toLowerCase() === "shift"
  );

  const regularPrice = parseFloat(product.regular_price || "0");
  const salePrice = parseFloat(product.sale_price || "0");
  const currentPrice = parseFloat(product.price || "0");

  // Validate prices
  const hasValidPrices = regularPrice > 0 && (salePrice > 0 || currentPrice > 0);

  if (shiftTag) {
    // Shift: High Fluctuation scenario
    // Max = Regular Price (or "Contact us" if 0)
    // Min = Sale Price (or -10% of regular if no sale price, or nothing if regular is 0)
    const priceMax = regularPrice > 0 ? regularPrice.toString() : "0";
    let priceMin = "0";
    
    if (salePrice > 0) {
      priceMin = salePrice.toString();
    } else if (regularPrice > 0) {
      // Calculate 10% discount from regular price
      priceMin = Math.round(regularPrice * 0.9).toString();
    }

    return {
      tagType: "shift",
      displayPrice: regularPrice > 0 ? regularPrice.toString() : "0",
      wasPrice: null,
      percentage: 0,
      hasValidPrices: regularPrice > 0,
      priceMax,
      priceMin: priceMin !== "0" ? priceMin : undefined,
    };
  } else if (priceDownTag && regularPrice > 0 && salePrice > 0) {
    // Price Down: Show sale price as main, regular as "was"
    const percentage = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    return {
      tagType: "price-down",
      displayPrice: salePrice.toString(),
      wasPrice: regularPrice.toString(),
      percentage,
      hasValidPrices: true,
    };
  } else if (priceUpTag && regularPrice > 0 && salePrice > 0) {
    // Price Up: Show regular price as main, sale price as "was" (old lower price)
    const percentage = Math.round(((regularPrice - salePrice) / salePrice) * 100);
    return {
      tagType: "price-up",
      displayPrice: regularPrice.toString(),
      wasPrice: salePrice.toString(),
      percentage,
      hasValidPrices: true,
    };
  } else {
    // No tag: Show current price only
    return {
      tagType: null,
      displayPrice: currentPrice > 0 ? currentPrice.toString() : regularPrice.toString(),
      wasPrice: null,
      percentage: 0,
      hasValidPrices: currentPrice > 0 || regularPrice > 0,
    };
  }
}

/**
 * Generate a prefilled WhatsApp link with tag-aware pricing.
 */
export function generateWhatsAppLink(product: WooCommerceProduct): string {
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119";
  const cleanNumber = waNumber.replace(/[^\d+]/g, "");
  
  const priceInfo = getPriceTagInfo(product);
  const formattedPrice = formatPrice(priceInfo.displayPrice);
  
  let priceMessage = `*Price:* ${formattedPrice}`;
  
  // Add context based on tag type
  if (priceInfo.tagType === "shift" && priceInfo.priceMax && priceInfo.priceMin) {
    const maxFormatted = formatPrice(priceInfo.priceMax);
    const minFormatted = formatPrice(priceInfo.priceMin);
    priceMessage = `*Price Range:* ${minFormatted} - ${maxFormatted} (High market fluctuation - contact us for current price)`;
  } else if (priceInfo.tagType === "price-down" && priceInfo.wasPrice) {
    const wasFormatted = formatPrice(priceInfo.wasPrice);
    priceMessage = `*Current Price:* ${formattedPrice} (Price Down from ${wasFormatted} - Save ${priceInfo.percentage}%!)`;
  } else if (priceInfo.tagType === "price-up" && priceInfo.wasPrice) {
    const wasFormatted = formatPrice(priceInfo.wasPrice);
    priceMessage = `*Current Price:* ${formattedPrice} (Price increased +${priceInfo.percentage}% from ${wasFormatted} due to market conditions)`;
  }
  
  const text = `Hello PC Wala, I'd like to order:
*Product:* ${product.name}
${priceMessage}
*Link:* ${process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com"}/product/${product.slug}`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Get visual classes or text for stock status.
 */
export function getStockLabel(status: string): { text: string; active: boolean } {
  switch (status) {
    case "instock":
      return { text: "IN STOCK", active: true };
    case "outofstock":
    default:
      return { text: "OUT OF STOCK", active: false };
  }
}

/**
 * Extract and parse standard product metadata: brand name, warranty, and condition.
 */
export function getProductMeta(product: WooCommerceProduct): {
  brandName: string;
  warranty: string;
  condition: string;
} {
  const brandAttr = product.attributes?.find((a) => a.name.toLowerCase() === "brand");
  const firstWordOfName = product.name.trim().split(/\s+/)[0];
  const brandName = brandAttr?.options?.[0] || firstWordOfName || "PC WALA";

  const warrantyAttr = product.attributes?.find((a) => a.name.toLowerCase().includes("warranty"));
  const warranty = warrantyAttr?.options?.[0] || "1 Year";

  const conditionAttr = product.attributes?.find((a) => a.name.toLowerCase().includes("condition"));
  let condition = "New";
  if (conditionAttr?.options?.[0]) {
    condition = conditionAttr.options[0];
  } else {
    const allSpecsText = `${JSON.stringify(product.attributes)} ${product.description} ${product.short_description}`;
    if (allSpecsText.toLowerCase().includes("used") || allSpecsText.toLowerCase().includes("pre-owned")) {
      condition = "Used";
    }
  }
  return { brandName, warranty, condition };
}
