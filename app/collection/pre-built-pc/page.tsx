"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { generatePreBuiltWhatsAppLink } from "@/lib/utils";
import { LIZARD_BUILDS, FALCON_BUILDS, APEX_BUILDS, PreBuiltPC } from "@/lib/prebuiltData";
import styles from "./prebuilt.module.css";

type SeriesType = "LIZARD" | "FALCON" | "APEX";

const SERIES_DATA = {
  LIZARD: {
    title: "LIZARD SERIES",
    builds: LIZARD_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-lizard-series.webp",
  },
  FALCON: {
    title: "FALCON SERIES",
    builds: FALCON_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-falcon-series.webp",
  },
  APEX: {
    title: "APEX SERIES",
    builds: APEX_BUILDS,
    banner: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-apex-series.webp",
  },
};

export default function PreBuiltPCPage() {
  const [activeSeries, setActiveSeries] = useState<SeriesType>("LIZARD");
  const currentData = SERIES_DATA[activeSeries];

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>PRE-BUILT PC</h1>
      </div>

      {/* Series Tabs */}
      <div className={styles.tabsContainer}>
        {(Object.keys(SERIES_DATA) as SeriesType[]).map((series) => (
          <button
            key={series}
            onClick={() => setActiveSeries(series)}
            className={`${styles.tab} ${activeSeries === series ? styles.tabActive : ""}`}
          >
            {SERIES_DATA[series].title}
          </button>
        ))}
      </div>

      {/* Series Banner */}
      <div className={styles.bannerContainer}>
        <Image
          src={currentData.banner}
          alt={`${currentData.title} Banner`}
          width={1200}
          height={400}
          className={styles.bannerImage}
          priority
        />
      </div>

      {/* Build Cards Grid */}
      <div className={styles.cardsGrid}>
        {currentData.builds.map((build) => (
          <div key={build.id} className={styles.buildCard}>
            {/* Info Area */}
            <div className={styles.infoArea}>
              {/* Badges - Top Right Corner */}
              <div className={styles.badgesContainer}>
                {build.badges.slice(0, 2).map((badge, idx) => (
                  <span key={idx} className={styles.performanceBadge}>
                    {badge}
                  </span>
                ))}
              </div>

              {/* Title + SKU Row */}
              <div className={styles.titleRow}>
                <h4 className={styles.buildName}>{build.model}</h4>
                <p className={styles.buildModel}>{build.sku}</p>
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
                          background:
                            fillPercentage > 0
                              ? `linear-gradient(to right, var(--color-accent-lime) ${fillPercentage}%, transparent ${fillPercentage}%)`
                              : "transparent",
                        }}
                      />
                    );
                  })}
                </div>
                <span className={styles.ratingText}>Expert Rating {build.rating}/10</span>
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
                className={styles.shopNowButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
