"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import styles from "./CustomBuildBanners.module.css";

interface Build {
  id: number;
  name: string;
  model: string;
  image: string;
  badge: string;
  specs: string[];
}

interface ColumnData {
  title: string;
  builds: Build[];
  viewAllLink: string;
  intervalMs?: number;
}

export default function CustomBuildBanners() {
  // Data for each column - 4 builds per column with staggered slide times
  const columns: ColumnData[] = [
    {
      title: "LIZARD SERIES",
      viewAllLink: "/category/custom-build-lizard",
      intervalMs: 3000, // Left slide 3.0s
      builds: [
        {
          id: 1,
          name: "LIZARD Z5",
          model: "LZD-ELITE-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-02-mobile.webp",
          badge: "GAMING BUILD",
          specs: [
            "AMD Ryzen 9 7950X CPU",
            "MSI MPG B650 Motherboard",
            "RTX 4080 16GB GPU",
            "32GB DDR5 5600MHz RAM",
            "Lian Li O11 Dynamic Case",
            "Thermaltake 850W PSU"
          ]
        },
        {
          id: 2,
          name: "LIZARD Z3",
          model: "LZD-PRO-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-02-mobile.webp",
          badge: "PERFORMANCE",
          specs: [
            "AMD Ryzen 7 7700X CPU",
            "ASUS TUF B650 Motherboard",
            "RTX 4070 12GB GPU",
            "16GB DDR5 5200MHz RAM",
            "Corsair 4000D Case",
            "EVGA 750W PSU"
          ]
        },
        {
          id: 3,
          name: "LIZARD Z2",
          model: "LZD-PLUS-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-02-mobile.webp",
          badge: "ESSENTIAL",
          specs: [
            "AMD Ryzen 5 7600 CPU",
            "MSI B650M Motherboard",
            "RTX 4060 Ti 8GB GPU",
            "16GB DDR5 5200MHz RAM",
            "Antec AX90 Case",
            "Corsair 650W PSU"
          ]
        },
        {
          id: 4,
          name: "LIZARD Z1",
          model: "LZD-ENTRY-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-02-mobile.webp",
          badge: "BUDGET BUILD",
          specs: [
            "AMD Ryzen 5 5600 CPU",
            "Gigabyte B550 Motherboard",
            "RX 6600 8GB GPU",
            "16GB DDR4 3200MHz RAM",
            "1STPLAYER Case",
            "Deepcool 550W PSU"
          ]
        }
      ]
    },
    {
      title: "TRANSFORMER SERIES",
      viewAllLink: "/category/custom-build-transformer",
      intervalMs: 3250, // Center slide 3.25s
      builds: [
        {
          id: 1,
          name: "TRANSFORMER X1",
          model: "TRX-PRO-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-01-mobile.webp",
          badge: "PREMIUM BUILD",
          specs: [
            "Intel i9-14900K CPU",
            "ASUS ROG Strix Z790 Motherboard",
            "RTX 4090 24GB GPU",
            "64GB DDR5 6000MHz RAM",
            "NZXT H9 Flow Case",
            "Corsair 1000W PSU"
          ]
        },
        {
          id: 2,
          name: "TRANSFORMER X2",
          model: "TRX-ULTRA-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-01-mobile.webp",
          badge: "WORKSTATION",
          specs: [
            "Intel i7-14700K CPU",
            "MSI Z790 Motherboard",
            "RTX 4080 16GB GPU",
            "32GB DDR5 5600MHz RAM",
            "Fractal Design Case",
            "Seasonic 850W PSU"
          ]
        },
        {
          id: 3,
          name: "TRANSFORMER X3",
          model: "TRX-ELITE-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-01-mobile.webp",
          badge: "GAMING PRO",
          specs: [
            "Intel i5-14600K CPU",
            "ASUS Prime Z790 Motherboard",
            "RTX 4070 Super GPU",
            "32GB DDR5 5200MHz RAM",
            "Lian Li 216 Case",
            "Thermaltake 750W PSU"
          ]
        },
        {
          id: 4,
          name: "TRANSFORMER X4",
          model: "TRX-PLUS-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-01-mobile.webp",
          badge: "STARTER BUILD",
          specs: [
            "Intel i5-13400F CPU",
            "MSI B760M Motherboard",
            "RTX 4060 8GB GPU",
            "16GB DDR4 3200MHz RAM",
            "Deepcool CC560 Case",
            "FSP 600W PSU"
          ]
        }
      ]
    },
    {
      title: "APEX SERIES",
      viewAllLink: "/category/custom-build-apex",
      intervalMs: 3500, // Right slide 3.5s
      builds: [
        {
          id: 1,
          name: "APEX A9",
          model: "APX-ULTRA-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-03-mobile.webp",
          badge: "PERFORMANCE BUILD",
          specs: [
            "AMD Ryzen 7 7800X3D CPU",
            "Gigabyte X670E Motherboard",
            "RTX 4070 Ti 12GB GPU",
            "32GB DDR5 6400MHz RAM",
            "Fractal Design Torrent Case",
            "Be Quiet! 850W PSU"
          ]
        },
        {
          id: 2,
          name: "APEX A7",
          model: "APX-PRO-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-03-mobile.webp",
          badge: "CREATOR BUILD",
          specs: [
            "AMD Ryzen 9 7900X CPU",
            "ASRock X670E Motherboard",
            "RTX 4070 12GB GPU",
            "64GB DDR5 5600MHz RAM",
            "Lian Li Lancool III Case",
            "Corsair 850W PSU"
          ]
        },
        {
          id: 3,
          name: "APEX A5",
          model: "APX-PLUS-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-03-mobile.webp",
          badge: "STREAMER BUILD",
          specs: [
            "AMD Ryzen 7 7700 CPU",
            "Gigabyte B650 Motherboard",
            "RTX 4060 Ti 16GB GPU",
            "32GB DDR5 5200MHz RAM",
            "Montech SKY TWO Case",
            "EVGA 700W PSU"
          ]
        },
        {
          id: 4,
          name: "APEX A3",
          model: "APX-ENTRY-2026",
          image: "https://api.pcwalaonline.com/wp-content/uploads/2026/06/home-custom-build-banner-03-mobile.webp",
          badge: "GAMER BASE",
          specs: [
            "AMD Ryzen 5 7600 CPU",
            "ASRock A620M Motherboard",
            "RX 7600 XT 16GB GPU",
            "16GB DDR5 5200MHz RAM",
            "Silverstone Fara Case",
            "Antec 650W PSU"
          ]
        }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.cornerBracket} />
        <h2 className={styles.sectionTitle}>
          <span style={{ display: "block" }}>PCWO</span>
          <span style={{ display: "block" }}>CUSTOM BUILD</span>
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
function BuildColumn({ title, builds, viewAllLink, intervalMs = 3000 }: ColumnData) {
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
              {/* Image Area */}
              <div className={styles.imageArea}>
                <div className={styles.badge}>{build.badge}</div>
                <Image
                  src={build.image}
                  alt={build.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="33vw"
                />
              </div>

              {/* Info Area */}
              <div className={styles.infoArea}>
                <h4 className={styles.buildName}>{build.name}</h4>
                
                {/* Model + Shop Now Button */}
                <div className={styles.modelButtonRow}>
                  <p className={styles.buildModel}>{build.model}</p>
                  <Link href={viewAllLink} className={styles.shopNowButton}>
                    SHOP NOW
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </Link>
                </div>

                {/* Specs List */}
                <ul className={styles.specsList}>
                  {build.specs.map((spec, index) => (
                    <li key={index} className={styles.specItem}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: View All + Navigation */}
      <div className={styles.footer}>
        <Link href={viewAllLink} className={styles.viewAllLink}>
          <span className={styles.viewAllLinkText}>
            VIEW ALL
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </Link>

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
    </div>
  );
}
