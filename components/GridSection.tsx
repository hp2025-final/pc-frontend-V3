import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./GridSection.module.css";

interface GridSectionProps {
  title: string;
  subtitle: string;
  count?: number;
  totalCount?: number;
  countLabel?: string;
  viewAllLink?: string;
  headerBackgroundImage?: string;
  children: React.ReactNode;
}

export default function GridSection({
  title,
  viewAllLink,
  headerBackgroundImage,
  children,
}: GridSectionProps) {
  const renderBrutalistTitle = (text: string) => {
    const uppercaseText = text.toUpperCase();
    if (uppercaseText.includes(" ")) {
      const words = uppercaseText.split(" ");
      return words.map((word, idx) => {
        const isLast = idx === words.length - 1;
        return (
          <span 
            key={idx} 
            style={{ 
              display: "block",
              color: isLast ? "var(--color-orange)" : "var(--color-dark)"
            }}
          >
            {word}
          </span>
        );
      });
    }
    if (uppercaseText.length >= 6) {
      const mid = Math.ceil(uppercaseText.length / 2);
      return (
        <>
          <span style={{ display: "block", color: "var(--color-dark)" }}>{uppercaseText.substring(0, mid)}</span>
          <span style={{ display: "block", color: "var(--color-orange)" }}>{uppercaseText.substring(mid)}</span>
        </>
      );
    }
    return <span style={{ color: "var(--color-orange)" }}>{uppercaseText}</span>;
  };

  // Determine background image style using CSS custom properties (variables)
  const headerStyle = headerBackgroundImage
    ? ({
        "--bg-image": `url('${headerBackgroundImage}')`,
        "--bg-image-mobile": `url('${headerBackgroundImage.replace(".png", "_mobile.png")}')`,
      } as React.CSSProperties)
    : {};

  return (
    <section className={styles.section}>
      {/* Full Width Brutalist Header */}
      <div 
        className={styles.gridSectionHeader} 
        style={headerStyle}
      >
        {/* Gradient overlay for better text readability (only if background image exists) */}
        {headerBackgroundImage && (
          <div className={styles.gradientOverlay} />
        )}

        {/* Lime Green Bracket Corner - Bottom Right */}
        <span className={styles.cornerBracket} />

        <h2 className={`${styles.sectionTitle} brutalist-section-title`}>
          {renderBrutalistTitle(title)}
        </h2>
      </div>

      {/* Blueprint Grid wrapping items */}
      <div className="blueprint-grid grid-2-col-mobile">
        {children}
      </div>

      {/* View All Button at Section Bottom */}
      {viewAllLink && (
        <div className={styles.viewAllContainer}>
          <Link href={viewAllLink} className={`${styles.viewAllLink} label-mono`}>
            <span className={styles.viewAllLinkText}>
              VIEW ALL
              <ArrowRight size={20} strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
