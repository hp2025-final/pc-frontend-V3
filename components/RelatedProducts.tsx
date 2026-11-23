import { getRelatedProducts } from "@/lib/woocommerce";
import type { WooCommerceProduct } from "@/lib/types";
import GridSection from "@/components/GridSection";
import PCD_2 from "@/components/PCD_2";
import styles from "./RelatedProducts.module.css";

export default async function RelatedProducts({ product }: { product: WooCommerceProduct }) {
  const products = await getRelatedProducts(product);
  if (products.length === 0) return null;
  const isPreBuiltPC = product.categories?.some((category) => category.slug === "pre-built-pcs");

  return (
    <GridSection
      title="Related Gear"
      subtitle={isPreBuiltPC ? "Pre-Built PCs" : "Compatible Hardware"}
      count={products.length}
      countLabel={isPreBuiltPC ? "Pre-Built PCs" : "Related Items"}
    >
      {products.map((related) => (
        <div key={related.id} className={styles.productCard}>
          <PCD_2 product={related} />
        </div>
      ))}
    </GridSection>
  );
}
