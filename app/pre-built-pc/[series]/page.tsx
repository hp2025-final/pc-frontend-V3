import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { LIZARD_BUILDS, FALCON_BUILDS, APEX_BUILDS, PreBuiltPC } from "@/lib/prebuiltData";
import { generatePreBuiltWhatsAppLink } from "@/lib/utils";
import styles from "./series.module.css";

// Enable ISR - Revalidate every 30 days
export const revalidate = 2592000;

interface SeriesPageProps {
  params: {
    series: string;
  };
}

// Series configuration
const SERIES_CONFIG = {
  "lizard-series": {
    name: "LIZARD SERIES",
    builds: LIZARD_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-lizard-series.webp",
    description: "Entry-level gaming PCs built for performance on a budget. Perfect for 1080p gaming and content creation.",
    keywords: "budget gaming pc, entry level pc, RTX 3060 PC, Ryzen 5 gaming pc",
  },
  "falcon-series": {
    name: "FALCON SERIES",
    builds: FALCON_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-falcon-series.webp",
    description: "Mid-range gaming powerhouses for serious gamers. Optimized for 1440p gaming and streaming.",
    keywords: "mid range gaming pc, RTX 5070 PC, 1440p gaming pc, streaming pc",
  },
  "apex-series": {
    name: "APEX SERIES",
    builds: APEX_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-apex-series.webp",
    description: "High-end gaming machines for enthusiasts. Built for 4K gaming, content creation, and extreme performance.",
    keywords: "high end gaming pc, RTX 5080 PC, 4K gaming pc, enthusiast pc",
  },
};

const ALL_SERIES = ["lizard-series", "falcon-series", "apex-series"] as const;

// Generate static params for all series
export async function generateStaticParams() {
  return ALL_SERIES.map((series) => ({
    series,
  }));
}

// Generate metadata for each series
export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const config = SERIES_CONFIG[params.series as keyof typeof SERIES_CONFIG];
  
  if (!config) {
    return {
      title: "Pre-Built PC Series | PC Wala Online",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com";
  
  return {
    title: `${config.name} | Pre-Built Gaming PCs | PC Wala Online`,
    description: config.description,
    keywords: config.keywords,
    alternates: {
      canonical: `${siteUrl}/pre-built-pc/${params.series}`,
    },
    openGraph: {
      title: `${config.name} | Pre-Built Gaming PCs`,
      description: config.description,
      url: `${siteUrl}/pre-built-pc/${params.series}`,
      siteName: "PC Wala Online",
      images: [
        {
          url: config.banner,
          width: 1200,
          height: 400,
          alt: `${config.name} Banner`,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
  };
}

export default function SeriesPage({ params }: SeriesPageProps) {
  const config = SERIES_CONFIG[params.series as keyof typeof SERIES_CONFIG];
  
  if (!config) {
    return <div>Series not found</div>;
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          HOME
        </Link>
        <ChevronRight size={12} strokeWidth={2.5} />
        <Link href="/#pre-built-pc" className={styles.breadcrumbLink}>
          PRE-BUILT PC
        </Link>
        <ChevronRight size={12} strokeWidth={2.5} />
        <span className={styles.breadcrumbCurrent}>{config.name}</span>
      </nav>

      {/* Series Navigation Tabs */}
      <nav className={styles.seriesNav}>
        {ALL_SERIES.map((seriesSlug) => {
          const seriesConfig = SERIES_CONFIG[seriesSlug];
          const isActive = seriesSlug === params.series;
          
          return (
            <Link
              key={seriesSlug}
              href={`/pre-built-pc/${seriesSlug}`}
              className={`${styles.seriesTab} ${isActive ? styles.seriesTabActive : ""}`}
            >
              {seriesConfig.name}
            </Link>
          );
        })}
      </nav>

      {/* Series Banner */}
      <div className={styles.bannerContainer}>
        <Image
          src={config.banner}
          alt={`${config.name} Banner`}
          width={1920}
          height={640}
          className={styles.bannerImage}
          priority
        />
      </div>

      {/* Series Description */}
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>{config.description}</p>
        <div className={styles.buildCount}>
          <span className={styles.buildCountNumber}>{config.builds.length}</span>
          <span className={styles.buildCountLabel}>PRE-BUILT PCS</span>
        </div>
      </div>

      {/* Build Cards Grid */}
      <div className={styles.cardsGrid}>
        {config.builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  );
}

// Build Card Component
function BuildCard({ build }: { build: PreBuiltPC }) {
  return (
    <div className={styles.card}>
      {/* Badges - Top Right Corner */}
      <div className={styles.badgesContainer}>
        {build.badges.slice(0, 2).map((badge, idx) => (
          <span key={idx} className={styles.badge}>
            {badge}
          </span>
        ))}
      </div>

      {/* Title + SKU Row */}
      <div className={styles.titleRow}>
        <h3 className={styles.cardTitle}>{build.model}</h3>
        <p className={styles.cardSku}>{build.sku}</p>
      </div>

      {/* GPU + CPU Highlight Row */}
      <div className={styles.highlightRow}>
        {build.gpuShort} + {build.cpuShort}
      </div>

      {/* Rating Bar */}
      <div className={styles.ratingBar}>
        <div className={styles.ratingBoxes}>
          {[...Array(10)].map((_, i) => {
            const boxNumber = i + 1;
            const wholeRating = Math.floor(build.rating);
            const decimal = build.rating % 1;
            
            let fillPercentage = 0;
            if (boxNumber <= wholeRating) {
              fillPercentage = 100;
            } else if (boxNumber === wholeRating + 1) {
              fillPercentage = decimal * 100;
            }
            
            return (
              <span 
                key={i} 
                className={styles.ratingBox}
                style={{
                  background: fillPercentage > 0 
                    ? `linear-gradient(to right, var(--color-accent-lime) ${fillPercentage}%, transparent ${fillPercentage}%)`
                    : 'transparent'
                }}
              />
            );
          })}
        </div>
        <span className={styles.ratingText}>
          Expert Rating {build.rating}/10
        </span>
      </div>

      {/* Full Specs List */}
      <ul className={styles.specsList}>
        <li className={styles.specItem}>{build.gpu}</li>
        <li className={styles.specItem}>{build.cpu}</li>
        <li className={styles.specItem}>{build.motherboard}</li>
        <li className={styles.specItem}>{build.ram}</li>
        <li className={styles.specItem}>{build.storage}</li>
        <li className={styles.specItem}>{build.cooler}</li>
        <li className={styles.specItem}>{build.psu}</li>
        <li className={styles.specItem}>{build.case}</li>
      </ul>

      {/* Why Description */}
      <p className={styles.whyDescription}>"{build.why}"</p>

      {/* Shop Now Button */}
      <Link 
        href={generatePreBuiltWhatsAppLink(build)}
        className={styles.shopButton}
        target="_blank"
        rel="noopener noreferrer"
      >
        SHOP NOW
      </Link>
    </div>
  );
}
