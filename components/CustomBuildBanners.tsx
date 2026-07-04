"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { generatePreBuiltWhatsAppLink } from "@/lib/utils";
import { LIZARD_BUILDS, FALCON_BUILDS, APEX_BUILDS, PreBuiltPC } from "@/lib/prebuiltData";
import styles from "./CustomBuildBanners.module.css";

interface ColumnData {
  title: string;
  builds: PreBuiltPC[];
  bannerImage: string;
  intervalMs?: number;
}

// Seeded random number generator for consistent shuffling
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Shuffle array with seed for consistent results on server and client
function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CustomBuildBanners() {
  // Use seeded shuffle for consistent ordering on both server and client
  // Seed based on current date (changes daily) - same for all users on same day
  const dailySeed = new Date().setHours(0, 0, 0, 0);
  
  const lizardShuffled = useMemo(() => shuffleArrayWithSeed(LIZARD_BUILDS, dailySeed), [dailySeed]);
  const falconShuffled = useMemo(() => shuffleArrayWithSeed(FALCON_BUILDS, dailySeed + 1), [dailySeed]);
  const apexShuffled = useMemo(() => shuffleArrayWithSeed(APEX_BUILDS, dailySeed + 2), [dailySeed]);

  const columns: ColumnData[] = [
    {
      title: "LIZARD SERIES",
      builds: lizardShuffled,
      bannerImage: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-lizard-series.webp",
      intervalMs: 3000,
    },
    {
      title: "FALCON SERIES",
      builds: falconShuffled,
      bannerImage: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-falcon-series.webp",
      intervalMs: 3250,
    },
    {
      title: "APEX SERIES",
      builds: apexShuffled,
      bannerImage: "https://api.pcwalaonline.com/wp-content/uploads/2026/07/pcwo-pre-built-pc-apex-series.webp",
      intervalMs: 3500,
    }
  ];

  return (
    <section className={styles.section} id="pre-built-pc">
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.cornerBracket} />
        <h2 className={styles.sectionTitle}>
          <span style={{ display: "block", color: "var(--color-dark)" }}>PRE-BUILT</span>
          <span style={{ display: "block", color: "var(--color-orange)" }}>PC</span>
        </h2>
      </div>

      {/* Columns Container */}
      <div className={styles.columnsContainer}>
        {columns.map((column, columnIndex) => (
          <BuildColumn key={columnIndex} {...column} />
        ))}
      </div>
    </section>
  );
}

// Individual Column Component (Slider with 1.5 Items Visible)
function BuildColumn({ title, builds, bannerImage, intervalMs = 3000 }: ColumnData) {
  const [currentIndex, setCurrentIndex] = useState(builds.length);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const totalItems = builds.length * 3;

  // Auto-slide every intervalMs
  useEffect(() => {
    if (builds.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      slide("next");
    }, intervalMs);

    return () => clearInterval(interval);
  }, [builds.length, isHovered, currentIndex, isAnimating, intervalMs]);

  const slide = (direction: "next" | "prev") => {
    if (isAnimating || builds.length <= 1) return;

    setIsAnimating(true);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    
    // Perform the slide transition
    setCurrentIndex(targetIndex);

    // After 500ms (matching CSS transition), seamlessly reset index
    setTimeout(() => {
      let nextIndex = targetIndex;
      if (targetIndex >= builds.length * 2) {
        nextIndex = targetIndex - builds.length;
      } else if (targetIndex < builds.length) {
        nextIndex = targetIndex + builds.length;
      }

      setTransitionEnabled(false);
      setCurrentIndex(nextIndex);

      // Re-enable transition on next paint
      setTimeout(() => {
        setTransitionEnabled(true);
        setIsAnimating(false);
      }, 50);
    }, 500);
  };

  const handleNext = () => {
    slide("next");
  };

  const handlePrevious = () => {
    slide("prev");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  return (
    <div 
      className={styles.column}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Column Header */}
      <div className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{title}</h3>
        
        {/* Navigation Buttons - Moved to Header */}
        <div className={styles.navButtons}>
          <button
            onClick={handlePrevious}
            className={styles.navButton}
            aria-label="Previous"
            disabled={builds.length <= 1}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleNext}
            className={styles.navButton}
            aria-label="Next"
            disabled={builds.length <= 1}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Series Banner Image */}
      <div className={styles.seriesBannerContainer}>
        <Image 
          src={bannerImage} 
          alt={`${title} Banner`}
          width={1200}
          height={400}
          className={styles.seriesBannerImage}
          priority
        />
      </div>

      {/* Slider Container */}
      <div 
        className={styles.sliderContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className={`${styles.slider} ${transitionEnabled ? styles.transitionEnabled : ""}`}
          style={{
            width: `${(totalItems / 1.5) * 100}%`,
            transform: `translate3d(-${(currentIndex / totalItems) * 100}%, 0, 0)`
          }}
        >
          {/* Triple builds for seamless loop */}
          {[...builds, ...builds, ...builds].map((build, idx) => (
            <div 
              key={`${build.id}-${idx}`} 
              className={styles.buildCard}
              style={{ width: `calc(100% / ${totalItems})` }}
            >
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
                
                {/* GPU + CPU Highlight Row - Black Background */}
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

                {/* Full Specs List - No labels, just component names */}
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
    </div>
  );
}
