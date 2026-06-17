import Image from "next/image";
import { WooCommerceProduct } from "@/lib/types";
import ProductSubSection from "./ProductSubSection";
import styles from "./CategoryMenuSection.module.css";

interface CategoryMenuSectionProps {
  ramProducts: WooCommerceProduct[];
  storageProducts: WooCommerceProduct[];
  categoryCounts?: { [key: string]: number };
}

export default function CategoryMenuSection({
  ramProducts,
  storageProducts,
}: CategoryMenuSectionProps) {
  return (
    <section className={styles.section}>
      {/* 3-Column Layout: Banner + 2 Product Sections */}
      <div className={`${styles.menuLayout} blueprint-grid`}>
        {/* Left: Image Banner */}
        <div className={styles.menuCol}>
          <div className={styles.imageBannerWrapper}>
            <Image
              src="https://api.pcwalaonline.com/wp-content/uploads/2026/05/hero_left_1.png"
              alt="Hardware Banner"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Center: RAM Products */}
        <ProductSubSection
          title="RAM"
          products={ramProducts}
          viewAllLink="/category/ram"
        />

        {/* Right: Storage Products */}
        <ProductSubSection
          title="Storage"
          products={storageProducts}
          viewAllLink="/category/storage"
        />
      </div>
    </section>
  );
}
