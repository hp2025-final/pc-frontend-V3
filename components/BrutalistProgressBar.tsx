"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createNavigationProgress, isInternalPageNavigation } from "@/lib/navigation-progress";
import styles from "./BrutalistProgressBar.module.css";

export default function BrutalistProgressBar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [isLoading, setIsLoading] = useState(false);
  const progressRef = useRef<ReturnType<typeof createNavigationProgress> | null>(null);

  useEffect(() => {
    const progress = createNavigationProgress(setIsLoading);
    progressRef.current = progress;

    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      ) return;

      const anchor = event.target instanceof Element
        ? event.target.closest("a[href]")
        : null;

      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      if (!isInternalPageNavigation(anchor.href, window.location.href)) return;

      progress.start();
    };

    // Capture before Next Link prevents the browser's default navigation.
    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", progress.stop);
    window.addEventListener("hashchange", progress.stop);
    window.addEventListener("pageshow", progress.stop);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", progress.stop);
      window.removeEventListener("hashchange", progress.stop);
      window.removeEventListener("pageshow", progress.stop);
      progress.dispose();
      progressRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Close after the new route commits, including redirects and query changes.
    const frame = window.requestAnimationFrame(() => progressRef.current?.stop());
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search]);

  if (!isLoading) return null;

  return (
    <div className={styles.progressBar} role="status" aria-label="Loading page" aria-live="polite">
      <span className={styles.indicator} aria-hidden="true" />
    </div>
  );
}
