import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PCD_2 from "./PCD_2";
import { WooCommerceProduct } from "@/lib/types";
import styles from "./ProductSubSection.module.css";

interface ProductSubSectionProps {
  title: string;
  products: WooCommerceProduct[];
  viewAllLink: string;
}

export default function ProductSubSection({
  title,
  products,
  viewAllLink,
}: ProductSubSectionProps) {
  return (
    <div className={styles.subSection}>
      {/* Sub-section Header */}
      <div className={styles.header}>
        {/* Lime Green Bracket Corner - Bottom Right */}
        <span className={styles.cornerBracket} />

        <h3 className={styles.title}>
          {title}
        </h3>
      </div>

      {/* Products Grid: 2x2 */}
      <div className={styles.productsGrid}>
        {products.slice(0, 4).map((product) => (
          <PCD_2 key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className={styles.viewAllContainer}>
        <Link href={viewAllLink} className={`${styles.viewAllLink} label-mono`}>
          <span className={styles.viewAllLinkText}>
            VIEW ALL
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </Link>
      </div>
    </div>
  );
}
