"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./BrutalistProgressBar.module.css";

const BAR_WIDTH = 10; // 10 blocks inside bracket loader

export default function BrutalistProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startProgress = () => {
    cleanup();
    setIsLoading(true);
    setProgress(0);

    // Emulate progression
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 25) {
          return prev + Math.random() * 8 + 4; // fast start
        } else if (prev < 80) {
          return prev + Math.random() * 4 + 0.5; // moderate
        } else if (prev < 94) {
          return prev + Math.random() * 0.8 + 0.1; // slow down
        }
        return prev;
      });
    }, 200);
  };

  const completeProgress = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setProgress(100);

    // Short success delay before hiding
    successTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 400);
  };

  const cleanup = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
  };

  // Intercept routing clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }
      if (!target || target.tagName !== "A") return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        targetAttr === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      startProgress();
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
      cleanup();
    };
  }, []);

  // Complete progress on page load
  useEffect(() => {
    if (isLoading) {
      completeProgress();
    }
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  // Build the bracket progress bar e.g. [ ████░░░░░░ ]
  const renderBlocks = () => {
    const filledCount = Math.min(BAR_WIDTH, Math.round((progress / 100) * BAR_WIDTH));
    const emptyCount = Math.max(0, BAR_WIDTH - filledCount);
    return `${"█".repeat(filledCount)}${"░".repeat(emptyCount)}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} />
      <div className={styles.loadingBox}>
        <span className={styles.text}>Rendering {progress.toFixed(1)}%</span>
        <span className={styles.barText}>[{renderBlocks()}]</span>
      </div>
    </div>
  );
}
