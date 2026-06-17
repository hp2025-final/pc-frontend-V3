import { WooCommerceProduct } from "@/lib/types";
import ProductSubSection from "./ProductSubSection";
import styles from "./NotablesSection.module.css";

interface NotablesSectionProps {
  motherboards: WooCommerceProduct[];
  powerSupplies: WooCommerceProduct[];
  gamingKeyboards: WooCommerceProduct[];
}

export default function NotablesSection({
  motherboards,
  powerSupplies,
  gamingKeyboards,
}: NotablesSectionProps) {
  return (
    <section className={styles.section}>
      {/* 3 Sub-sections Side by Side */}
      <div className={`${styles.subsectionsGrid} blueprint-grid`}>
        <ProductSubSection
          title="PC Motherboards"
          products={motherboards}
          viewAllLink="/category/motherboards"
        />
        <ProductSubSection
          title="Power Supplies"
          products={powerSupplies}
          viewAllLink="/category/power-supplies"
        />
        <ProductSubSection
          title="Gaming Keyboards"
          products={gamingKeyboards}
          viewAllLink="/category/gaming-keyboards"
        />
      </div>
    </section>
  );
}
