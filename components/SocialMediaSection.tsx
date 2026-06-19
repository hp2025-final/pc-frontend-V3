"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SocialMediaReel } from "@/lib/types";
import styles from "./SocialMediaSection.module.css";

interface SocialMediaSectionProps {
  reels: SocialMediaReel[];
}

// Helper function to convert YouTube Shorts URL to embed URL with minimal UI
const getYouTubeEmbedUrl = (url: string): string => {
  const shortMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    // Add parameters to minimize UI and enable autoplay on interaction
    return `https://www.youtube.com/embed/${shortMatch[1]}?modestbranding=1&rel=0&controls=1&showinfo=0`;
  }
  return url;
};

// Helper function to convert Instagram Reel URL to embed URL without captions
const getInstagramEmbedUrl = (url: string): string => {
  const reelMatch = url.match(/reel\/([a-zA-Z0-9_-]+)/);
  if (reelMatch) {
    // Use /embed endpoint without captioned parameter for cleaner display
    return `https://www.instagram.com/reel/${reelMatch[1]}/embed/`;
  }
  return url;
};

export default function SocialMediaSection({ reels }: SocialMediaSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide reels every 2 seconds
  useEffect(() => {
    if (reels.length <= 6) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= reels.length ? 0 : next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [reels.length]);

  // Get visible reels (6 on desktop, 2 on mobile)
  const getVisibleReels = (count: number) => {
    const visible = [];
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % reels.length;
      visible.push(reels[index]);
    }
    return visible;
  };

  const desktopReels = getVisibleReels(6);
  const mobileReels = getVisibleReels(2);

  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.header}>
        <span className={styles.cornerBracket} />
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            MADE FOR PROFESSIONALS, GAMERS & CREATORS.
          </h2>
          <p className={styles.subtitle}>
            Real PC builds, honest hardware reviews, and benchmarks that help you choose better gear.
          </p>
        </div>
      </div>

      {/* Reels Container */}
      <div className={styles.reelsContainer}>
        {/* Desktop: 6 reels */}
        <div className={styles.reelsGridDesktop}>
          {desktopReels.map((reel) => (
            <div
              key={`${reel.id}-${currentIndex}`}
              className={styles.reelCard}
            >
              {/* Video/Embed Wrapper */}
              <div className={styles.videoWrapper}>
                {reel.platform === "youtube" ? (
                  <iframe
                    src={getYouTubeEmbedUrl(reel.videoUrl)}
                    className={styles.iframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={reel.category}
                  />
                ) : reel.platform === "instagram" ? (
                  <iframe
                    src={getInstagramEmbedUrl(reel.videoUrl)}
                    className={styles.iframe}
                    allowFullScreen
                    loading="lazy"
                    title={reel.category}
                  />
                ) : (
                  <video
                    className={styles.video}
                    src={reel.videoUrl}
                    poster={reel.thumbnail}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    controls
                  />
                )}
              </div>

              {/* Category Badge */}
              <div className={styles.categoryBadge}>
                <span className={styles.categoryText}>{reel.category}</span>
              </div>

              {/* Product Link Button */}
              <Link href={reel.productLink} className={styles.productLink}>
                <span className={styles.productLinkText}>
                  VIEW BUILD
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile: 2 reels */}
        <div className={styles.reelsGridMobile}>
          {mobileReels.map((reel) => (
            <div
              key={`${reel.id}-${currentIndex}`}
              className={styles.reelCard}
            >
              {/* Video/Embed Wrapper */}
              <div className={styles.videoWrapper}>
                {reel.platform === "youtube" ? (
                  <iframe
                    src={getYouTubeEmbedUrl(reel.videoUrl)}
                    className={styles.iframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    title={reel.category}
                  />
                ) : reel.platform === "instagram" ? (
                  <iframe
                    src={getInstagramEmbedUrl(reel.videoUrl)}
                    className={styles.iframe}
                    allowFullScreen
                    loading="lazy"
                    title={reel.category}
                  />
                ) : (
                  <video
                    className={styles.video}
                    src={reel.videoUrl}
                    poster={reel.thumbnail}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    controls
                  />
                )}
              </div>

              {/* Category Badge */}
              <div className={styles.categoryBadge}>
                <span className={styles.categoryText}>{reel.category}</span>
              </div>

              {/* Product Link Button */}
              <Link href={reel.productLink} className={styles.productLink}>
                <span className={styles.productLinkText}>
                  VIEW BUILD
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
