import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByIds, getProducts } from "@/lib/woocommerce";
import { stripHtml, getPriceTagInfo, getProductMeta, formatPrice } from "@/lib/utils";
import PreBuiltPCPageClient from "./PreBuiltPCPageClient";
import ExpertAndWhySections from "./ExpertAndWhySections";

interface PreBuiltPCPageProps {
  params: Promise<{ slug: string }>;
}

// ISR: Revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

// Generate metadata for SEO
export async function generateMetadata({ params }: PreBuiltPCPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const priceInfo = getPriceTagInfo(product);
  
  // ─── EXTRACT ACF FIELDS FOR METADATA ───────────────────────────────
  const getMetaVal = (key: string) => {
    const found = product.meta_data?.find((m) => m.key === key);
    return found ? String(found.value).trim() : "";
  };

  const heading = getMetaVal("acf_heading");
  const processor = getMetaVal("acf_processor");
  const gpu = getMetaVal("acf_graphics_card");
  const ram = getMetaVal("acf_ram");
  const storage = getMetaVal("acf_storage");
  const motherboard = getMetaVal("acf_motherboard");
  const psu = getMetaVal("acf_power_supply");
  const pcCase = getMetaVal("acf_pc_case");
  const cooler = getMetaVal("acf_pc_coolers_fans");
  const badges = getMetaVal("acf_badges");

  // Shorten GPU/CPU for title (remove brand details in parentheses)
  const gpuShort = gpu.replace(/\s*\([^)]*\)/g, '').trim();
  const cpuShort = processor
    .replace('Intel Core ', '')
    .replace('AMD Ryzen ', 'R')
    .replace(/\s*\([^)]*\)/g, '')
    .trim();

  // Format price for display
  const priceDisplay = formatPrice(priceInfo.displayPrice);

  // Split badges (take first 2 for description)
  const badgeList = badges ? badges.split(',').map(b => b.trim()).filter(b => b) : [];
  const badgesShort = badgeList.slice(0, 2).join(', ');
  const badgesExpanded = badgeList.join('. ');

  // ─── BUILD META TITLE (55-64 chars) ──────────────────────────────────
  let metaTitle = "";
  
  if (heading && gpuShort && cpuShort) {
    // Option 1: With heading (preferred if short enough)
    const titleWithHeading = `${heading}: ${gpuShort} ${cpuShort} PC Price Pakistan | PC Wala`;
    if (titleWithHeading.length <= 64) {
      metaTitle = titleWithHeading;
    } else {
      // Option 2: Without heading if too long
      metaTitle = `${gpuShort} ${cpuShort} Pre-Built PC Price Pakistan | PC Wala`;
    }
  } else if (gpuShort && cpuShort) {
    metaTitle = `${gpuShort} ${cpuShort} Pre-Built PC Price Pakistan | PC Wala`;
  } else {
    // Fallback to product name
    metaTitle = `${product.name} Price in Pakistan | PC Wala`;
  }

  // Ensure title doesn't exceed 64 chars
  if (metaTitle.length > 64) {
    metaTitle = metaTitle.slice(0, 61) + "...";
  }

  // ─── BUILD META DESCRIPTION (155-160 chars) ───────────────────────────
  let metaDescription = "";

  if (heading && gpuShort && cpuShort && ram && storage) {
    // Complete description with all key components
    const descParts = [
      `Buy ${heading} pre-built PC in Pakistan:`,
      `${gpuShort}, ${cpuShort}, ${ram}, ${storage}.`,
      badgesShort ? `${badgesShort}.` : '',
      `Price: ${priceDisplay}.`,
      `1-year warranty. PC Wala Online Karachi delivery.`
    ];
    metaDescription = descParts.filter(p => p).join(' ');
  } else if (gpuShort && cpuShort) {
    // Minimal description
    metaDescription = `Buy pre-built gaming PC in Pakistan: ${gpuShort}, ${cpuShort}. Price: ${priceDisplay}. 1-year warranty. PC Wala Online Karachi with nationwide delivery.`;
  } else {
    // Fallback
    metaDescription = `Buy ${product.name} in Pakistan. Gaming PC with genuine components. Price: ${priceDisplay}. 1-year warranty. PC Wala Online Karachi delivery.`;
  }

  // Ensure description doesn't exceed 160 chars
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.slice(0, 157) + "...";
  }

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: product.images?.[0]?.src ? [product.images[0].src] : [],
    },
  };
}

// Server Component - Fetches data and passes to client component
export default async function PreBuiltPCPage({ params }: PreBuiltPCPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products — prioritize same-category (Pre-Built PCs) products
  let relatedProducts: typeof product[] = [];

  // Step 1: Fetch from deepest child category first (e.g., Lizard Series)
  const deepestCategory = product.categories && product.categories.length > 0
    ? product.categories[product.categories.length - 1]
    : null;

  if (deepestCategory) {
    const categoryProducts = await getProducts({
      category: String(deepestCategory.id),
      per_page: 12,
    });

    const existingIds = new Set([product.id]);
    for (const p of categoryProducts) {
      if (!existingIds.has(p.id)) {
        relatedProducts.push(p);
        existingIds.add(p.id);
      }
      if (relatedProducts.length >= 6) break;
    }
  }

  // Step 2: If still fewer than 6, backfill from parent category (Pre-Built PCs)
  if (relatedProducts.length < 6) {
    const parentCategory = product.categories && product.categories.length > 1
      ? product.categories[0]
      : null;

    if (parentCategory && parentCategory.id !== deepestCategory?.id) {
      const parentProducts = await getProducts({
        category: String(parentCategory.id),
        per_page: 12,
      });

      const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
      for (const p of parentProducts) {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
          existingIds.add(p.id);
        }
        if (relatedProducts.length >= 6) break;
      }
    }
  }

  // Step 3: Last resort — WooCommerce related_ids
  if (relatedProducts.length < 6) {
    const relatedIds = product.related_ids?.slice(0, 6) || [];
    if (relatedIds.length > 0) {
      const wcRelated = await getProductsByIds(relatedIds);
      const existingIds = new Set([product.id, ...relatedProducts.map((p) => p.id)]);
      for (const p of wcRelated) {
        if (!existingIds.has(p.id)) {
          relatedProducts.push(p);
          existingIds.add(p.id);
        }
        if (relatedProducts.length >= 6) break;
      }
    }
  }

  // Ensure exactly 6
  relatedProducts = relatedProducts.slice(0, 6);

  const priceInfo = getPriceTagInfo(product);
  const { brandName, condition } = getProductMeta(product);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";
  
  // Format price for display
  const priceDisplay = formatPrice(priceInfo.displayPrice);

  // ─── EXTRACT SPECIFICATIONS FOR additionalProperty ───────────────────
  const getMetaValue = (key: string) => {
    const found = product.meta_data?.find((m) => m.key === key);
    return found ? String(found.value).trim() : "";
  };

  const additionalProperties: any[] = [];
  
  // Core PC Specs
  const processor = getMetaValue("acf_processor");
  const gpu = getMetaValue("acf_graphics_card");
  const ram = getMetaValue("acf_ram");
  const storage = getMetaValue("acf_storage");
  const motherboard = getMetaValue("acf_motherboard");
  const psu = getMetaValue("acf_power_supply");
  const pcCase = getMetaValue("acf_pc_case");
  const cooler = getMetaValue("acf_pc_coolers_fans");
  const heading = getMetaValue("acf_heading");
  const badges = getMetaValue("acf_badges");

  // Process badges for schema description
  const badgeList = badges ? badges.split(',').map(b => b.trim()).filter(b => b) : [];
  const badgesExpanded = badgeList.join('. ');

  if (processor) additionalProperties.push({ "@type": "PropertyValue", "name": "Processor", "value": processor });
  if (gpu) additionalProperties.push({ "@type": "PropertyValue", "name": "Graphics Card", "value": gpu });
  if (ram) additionalProperties.push({ "@type": "PropertyValue", "name": "RAM", "value": ram });
  if (storage) additionalProperties.push({ "@type": "PropertyValue", "name": "Storage", "value": storage });
  if (motherboard) additionalProperties.push({ "@type": "PropertyValue", "name": "Motherboard", "value": motherboard });
  if (psu) additionalProperties.push({ "@type": "PropertyValue", "name": "Power Supply", "value": psu });
  if (pcCase) additionalProperties.push({ "@type": "PropertyValue", "name": "Case", "value": pcCase });
  if (cooler) additionalProperties.push({ "@type": "PropertyValue", "name": "Cooler", "value": cooler });

  // Add warranty and condition as properties
  additionalProperties.push({ 
    "@type": "PropertyValue", 
    "name": "Warranty", 
    "value": "1 Year Limited Manufacturer Warranty" 
  });
  additionalProperties.push({ 
    "@type": "PropertyValue", 
    "name": "Condition", 
    "value": "Brand New" 
  });

  // Add all other attributes as additional properties
  product.attributes?.forEach((attr) => {
    if (attr.options && attr.options.length > 0 && attr.visible) {
      const attrName = attr.name;
      const attrValue = attr.options.join(", ");
      
      // Skip if already added above
      const isDuplicate = additionalProperties.some(p => 
        p.name.toLowerCase() === attrName.toLowerCase()
      );
      
      if (!isDuplicate && attrValue) {
        additionalProperties.push({
          "@type": "PropertyValue",
          "name": attrName,
          "value": attrValue
        });
      }
    }
  });

  // ─── EXTRACT FAQ DATA FROM "WHY WE CHOSE" SECTIONS ───────────────────
  const whyFields = [
    { key: "why_section_why_we_selected_the_gpu", component: gpu, componentType: "GPU" },
    { key: "why_section_why_we_selected_the_cpu", component: processor, componentType: "CPU" },
    { key: "why_section_why_we_selected_the_motherboard", component: motherboard, componentType: "Motherboard" },
    { key: "why_section_why_we_selected_the_ram", component: ram, componentType: "RAM" },
    { key: "why_section_why_we_selected_the_storage", component: storage, componentType: "Storage" },
    { key: "why_section_why_we_selected_the_cooler", component: cooler, componentType: "Cooler" },
    { key: "why_section_why_we_selected_the_psu", component: psu, componentType: "PSU" },
    { key: "why_section_why_we_selected_the_pc_case", component: pcCase, componentType: "PC Case" },
  ];

  const faqEntities: any[] = [];
  
  whyFields.forEach((field) => {
    const content = getMetaValue(field.key);
    if (content && field.component) {
      // Strip HTML and get clean text for FAQ answer
      const cleanAnswer = stripHtml(content).trim();
      
      if (cleanAnswer && cleanAnswer.length > 20) {
        faqEntities.push({
          "@type": "Question",
          "name": `Why did PC Wala choose ${field.component} for this build?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": cleanAnswer
          }
        });
      }
    }
  });

  // Add expert assessment FAQs
  const expertFields = [
    { key: "assessment_summary", title: "What is the expert assessment of this pre-built PC?" },
    { key: "competitive_games", title: "Can this PC run competitive games?" },
    { key: "modern_aaa_games", title: "How does this PC perform in modern AAA games?" },
    { key: "ray_tracing_reality", title: "Can this PC handle ray tracing?" },
    { key: "ai_reality", title: "Is this PC suitable for AI and machine learning workloads?" },
  ];

  expertFields.forEach((field) => {
    const content = getMetaValue(field.key);
    if (content) {
      const cleanAnswer = stripHtml(content).trim();
      
      if (cleanAnswer && cleanAnswer.length > 20) {
        faqEntities.push({
          "@type": "Question",
          "name": field.title,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": cleanAnswer
          }
        });
      }
    }
  });

  // Extract model/series for schema
  const seriesAttr = product.attributes?.find(
    (a) => a.name.toLowerCase() === "series" || 
           a.name.toLowerCase() === "model" ||
           a.name.toLowerCase().includes("series") ||
           a.name.toLowerCase().includes("model")
  );
  const modelNumber = seriesAttr?.options?.[0] || "";

  // Get category for schema
  const category = product.categories && product.categories.length > 0
    ? product.categories[product.categories.length - 1]
    : null;

  // 1. Offer Object
  let offersObj: any = {};
  if (priceInfo.tagType === "shift") {
    offersObj = {
      "@type": "AggregateOffer",
      "priceCurrency": "PKR",
      "lowPrice": priceInfo.priceMin || (parseFloat(priceInfo.displayPrice) * 0.9).toString(),
      "highPrice": priceInfo.priceMax || priceInfo.displayPrice,
      "offerCount": "1",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${siteUrl}/pre-built-pc/${product.slug}`,
    };
  } else {
    offersObj = {
      "@type": "Offer",
      "price": priceInfo.displayPrice,
      "priceCurrency": "PKR",
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_status === "instock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${siteUrl}/pre-built-pc/${product.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "PC Wala Online",
        "url": siteUrl
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "PKR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "PK"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 4,
            "unitCode": "DAY"
          }
        }
      },
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": {
          "@type": "QuantitativeValue",
          "value": 1,
          "unitCode": "ANN"
        },
        "warrantyScope": "Limited manufacturer warranty covering defects in materials and workmanship for 1 year from date of purchase"
      }
    };
  }

  // 2. Enhanced Product Schema with additionalProperty
  // Build comprehensive description for schema (400-600 chars)
  let schemaDescription = "";
  
  if (heading && gpu && processor) {
    const componentsList = [
      gpu ? `${gpu} graphics card` : '',
      processor ? `${processor} processor` : '',
      ram ? `${ram} RAM` : '',
      storage ? `${storage} storage` : '',
      motherboard ? `${motherboard} motherboard` : '',
      psu ? `${psu} power supply` : '',
      pcCase ? `${pcCase} case` : ''
    ].filter(c => c).join(', ');

    const badgesText = badgesExpanded ? `${badgesExpanded} build. ` : '';
    
    schemaDescription = `Complete ${heading} pre-built gaming PC from PC Wala Online Pakistan featuring ${componentsList}. ${badgesText}Optimized for high-performance gaming at 1080p and 1440p resolutions, local AI workloads, machine learning tasks, and content creation. All genuine components with 1-year limited manufacturer warranty. Price: ${priceDisplay} in Pakistan. Available at PC Wala store in Saddar, Karachi with fast nationwide delivery across Pakistan including Lahore, Islamabad, and Faisalabad.`;
  } else {
    // Fallback description
    schemaDescription = stripHtml(product.short_description || product.description).slice(0, 500);
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": schemaDescription,
    "image": product.images?.map((img) => img.src) || [],
    "sku": product.sku || product.id.toString(),
    "mpn": product.sku || product.id.toString(),
    "gtin": product.sku || undefined,
    "brand": {
      "@type": "Brand",
      "name": brandName || "PC Wala"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": brandName || "PC Wala"
    },
    "model": modelNumber || undefined,
    "category": category?.name || "Pre-Built Gaming PC",
    "offers": offersObj,
    "additionalProperty": additionalProperties.length > 0 ? additionalProperties : undefined
  };

  // 3. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category?.name.toUpperCase() || "PRE-BUILT PCS",
        "item": category ? `${siteUrl}/category/${category.slug}` : `${siteUrl}/#categories`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `${siteUrl}/pre-built-pc/${product.slug}`
      }
    ]
  };

  // 4. FAQ Schema (from "Why We Chose" and Expert Assessment sections)
  const faqSchema = faqEntities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqEntities
  } : null;

  // Pass all data to client component for interactivity, and inject JSON-LD schemas
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PreBuiltPCPageClient product={product} relatedProducts={relatedProducts}>
        <ExpertAndWhySections product={product} />
      </PreBuiltPCPageClient>
    </>
  );
}
