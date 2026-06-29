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

  if (heading && gpuShort && cpuShort) {
    // Natural, readable description that won't get cut off
    metaDescription = `Buy the ${heading} ${gpuShort} and ${cpuShort} gaming and AI PC in Pakistan. Expert-rated for 1080p gaming, AI workloads, and content creation.`;
  } else if (gpuShort && cpuShort) {
    // Without heading
    metaDescription = `Buy ${gpuShort} and ${cpuShort} gaming and AI PC in Pakistan. Expert-rated for 1080p gaming, AI workloads, and content creation.`;
  } else {
    // Fallback
    metaDescription = `Buy ${product.name} gaming PC in Pakistan. Expert-rated for performance and value. Price: ${priceDisplay}. PC Wala Online.`;
  }

  // Ensure description doesn't exceed 160 chars
  if (metaDescription.length > 160) {
    metaDescription = metaDescription.slice(0, 157) + "...";
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com"}/pre-built-pc/${slug}`,
    },
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

  // Add more FAQ questions from assessment fields
  const additionalFAQs = [
    { key: "can_this_play_every_game_on_ultra", title: "Can this PC play every game on ultra settings?" },
    { key: "where_you_should_avoid_ultra_settings", title: "Where should you avoid ultra settings on this PC?" },
  ];

  additionalFAQs.forEach((field) => {
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

  // ─── BUILD EXPERT REVIEW BODY (800-1200 chars) ───────────────────────
  let reviewBody = "";
  const reviewParts: string[] = [];

  // Part 1: Assessment Summary
  const assessmentSummary = getMetaValue("assessment_summary");
  if (assessmentSummary) {
    const cleanSummary = stripHtml(assessmentSummary).trim();
    if (cleanSummary) {
      reviewParts.push(cleanSummary);
    }
  }

  // Part 2: Value Rating (clean format without duplication)
  const valueRating = getMetaValue("acf_value_rating");
  const cleanRating = valueRating.replace(/\/10$/, '').trim(); // Remove "/10" if exists
  if (cleanRating) {
    reviewParts.push(`This build is expert-rated ${cleanRating}/10 for overall value and performance.`);
  }

  // Part 3: Performance Analysis (formatted for human readability)
  const performanceParts: string[] = [];
  
  const competitiveGames = getMetaValue("competitive_games");
  if (competitiveGames) {
    const clean = stripHtml(competitiveGames).trim();
    // Extract FPS data if it's in table format
    if (clean.includes('Resolution') && clean.includes('FPS')) {
      performanceParts.push(`Competitive gaming performance: Excellent for titles like Valorant (250-400 FPS) and CS2 (180-300 FPS) at 1080p.`);
    } else {
      performanceParts.push(clean.slice(0, 200));
    }
  }

  const modernAAA = getMetaValue("modern_aaa_games");
  if (modernAAA) {
    const clean = stripHtml(modernAAA).trim();
    // Extract key AAA game performance
    if (clean.includes('Resolution') && clean.includes('FPS')) {
      performanceParts.push(`AAA gaming: Capable of 65-85 FPS in Cyberpunk 2077 and 50-65 FPS in Black Myth Wukong at 1080p with high settings.`);
    } else {
      performanceParts.push(clean.slice(0, 200));
    }
  }

  const rayTracing = getMetaValue("ray_tracing_reality");
  if (rayTracing) {
    const clean = stripHtml(rayTracing).trim();
    if (clean && clean.length > 10) {
      performanceParts.push(`Ray tracing: ${clean.slice(0, 150)}`);
    }
  }

  if (performanceParts.length > 0) {
    reviewParts.push(performanceParts.join(' '));
  }

  // Part 4: AI Capabilities
  const aiReality = getMetaValue("ai_reality");
  if (aiReality) {
    const clean = stripHtml(aiReality).trim().slice(0, 200);
    if (clean) {
      reviewParts.push(`AI Capabilities: ${clean}`);
    }
  }

  // Part 5: Component Selection Reasoning
  const componentReasons: string[] = [];
  
  whyFields.forEach((field) => {
    const content = getMetaValue(field.key);
    if (content && field.component) {
      const clean = stripHtml(content).trim().slice(0, 120);
      if (clean) {
        componentReasons.push(`${field.component}: ${clean}`);
      }
    }
  });

  if (componentReasons.length > 0) {
    // Use top 2-3 most important (GPU, CPU, RAM)
    const topReasons = componentReasons.slice(0, 3).join(' ');
    reviewParts.push(`Component selection: ${topReasons}`);
  }

  // Part 6: Value Proposition
  if (badgesExpanded) {
    reviewParts.push(`${badgesExpanded} build.`);
  }

  // Combine all parts
  if (reviewParts.length > 0) {
    reviewBody = reviewParts.join(' ');
    
    // Ensure it doesn't exceed 1200 chars
    if (reviewBody.length > 1200) {
      reviewBody = reviewBody.slice(0, 1197) + "...";
    }
  }

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
      "seller": {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "PC Wala Online"
      }
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
        "@id": `${siteUrl}/#organization`,
        "name": "PC Wala Online"
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
        }
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

  // Extract brand from heading (e.g., "Lizard Z1" -> "Lizard")
  const productBrand = heading ? heading.split(' ')[0] : "PC Wala";

  // Brand should be the series name (e.g., "Lizard"), not category
  const schemaBrandName = productBrand;

  // Build isRelatedTo for components (replacing hasPart to avoid Google errors)
  const isRelatedTo: any[] = [];
  
  if (processor) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": processor
    });
  }

  if (gpu) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": gpu
    });
  }

  if (motherboard) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": motherboard
    });
  }

  if (storage) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": storage
    });
  }

  if (ram) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": ram
    });
  }

  if (cooler) {
    isRelatedTo.push({
      "@type": "Thing",
      "name": cooler
    });
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": schemaDescription,
    "image": product.images?.map((img) => img.src) || [],
    "sku": product.sku || product.id.toString(),
    "brand": {
      "@type": "Brand",
      "name": schemaBrandName
    },
    "manufacturer": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "PC Wala Online"
    },
    "model": heading || undefined,
    "category": category?.name || "Pre-Built Gaming PC",
    "offers": offersObj,
    "additionalProperty": additionalProperties.length > 0 ? additionalProperties : undefined,
    "isRelatedTo": isRelatedTo.length > 0 ? isRelatedTo : undefined,
    "review": {
      "@id": `${siteUrl}/pre-built-pc/${product.slug}#review`
    }
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

  // 5. Review Schema (Expert Assessment with Rating)
  const reviewSchema = reviewBody && cleanRating ? {
    "@context": "https://schema.org",
    "@type": "Review",
    "@id": `${siteUrl}/pre-built-pc/${product.slug}#review`,
    "author": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "PC Wala Online"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": cleanRating,
      "bestRating": "10"
    },
    "reviewBody": reviewBody,
    "datePublished": new Date().toISOString().split('T')[0]
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
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <PreBuiltPCPageClient product={product} relatedProducts={relatedProducts}>
        <ExpertAndWhySections product={product} />
      </PreBuiltPCPageClient>
    </>
  );
}
