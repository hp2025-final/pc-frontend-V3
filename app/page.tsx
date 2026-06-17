import { getCategories, getProducts, getCategoryBySlug } from "@/lib/woocommerce";
import PCD_2 from "@/components/PCD_2";
import GridSection from "@/components/GridSection";
import NotablesSection from "@/components/NotablesSection";
import HeroSlider from "@/components/HeroSlider";
import WhyChooseUs from "@/components/WhyChooseUs";
import CategoriesGrid from "@/components/CategoriesGrid";
import BrandMarquee from "@/components/BrandMarquee";
import BannerProductSection from "@/components/BannerProductSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import CustomBuildBanners from "@/components/CustomBuildBanners";
import type { SocialMediaReel } from "@/lib/types";

// Enable ISR - Revalidate every 12 hours (43200 seconds) - matches WooCommerce API cache
export const revalidate = 43200;

export default async function Home() {
  // Fetch categories and category slugs
  const [
    categories,
    latestArrivalCategory,
    motherboardsCategory,
    powerSuppliesCategory,
    gamingKeyboardsCategory,
    ramCategory,
    storageCategory,
    laptopsCategory,
    pcCasesCategory,
    gpusCategory,
    cpusCategory,
    pcCoolingSystemsCategory,
    appleProductsCategory,
    printersScannerCategory,
    gamingMouseCategory,
    macbookCategory,
    onSaleCategory,
  ] = await Promise.all([
    getCategories(),
    getCategoryBySlug("latest-arrival"),
    getCategoryBySlug("motherboards"),
    getCategoryBySlug("power-supplies"),
    getCategoryBySlug("gaming-keyboards"),
    getCategoryBySlug("ram"),
    getCategoryBySlug("storage"),
    getCategoryBySlug("laptops"),
    getCategoryBySlug("pc-cases"),
    getCategoryBySlug("gpus"),
    getCategoryBySlug("cpus"),
    getCategoryBySlug("pc-cooling-systems"),
    getCategoryBySlug("apple-products"),
    getCategoryBySlug("printers-scanners"),
    getCategoryBySlug("gaming-mouse"),
    getCategoryBySlug("macbook"),
    getCategoryBySlug("on-sale"),
  ]);

  // Fetch products for each category in parallel
  const [
    motherboards,
    powerSupplies,
    gamingKeyboards,
    heroLaptops,
    latestArrivalProducts,
    gamingMouseProducts,
    onSaleProducts,
  ] = await Promise.all([
    motherboardsCategory ? getProducts({ category: String(motherboardsCategory.id), per_page: 4 }) : Promise.resolve([]),
    powerSuppliesCategory ? getProducts({ category: String(powerSuppliesCategory.id), per_page: 4 }) : Promise.resolve([]),
    gamingKeyboardsCategory ? getProducts({ category: String(gamingKeyboardsCategory.id), per_page: 4 }) : Promise.resolve([]),
    macbookCategory 
      ? getProducts({ category: String(macbookCategory.id), per_page: 5 }) 
      : laptopsCategory 
        ? getProducts({ category: String(laptopsCategory.id), per_page: 5 }) 
        : getProducts({ per_page: 5 }), // For hero - get Macbook/Laptops up to 5
    getProducts({
      category: latestArrivalCategory ? String(latestArrivalCategory.id) : undefined,
      per_page: 6,
    }),
    gamingMouseCategory ? getProducts({ category: String(gamingMouseCategory.id), per_page: 8 }) : Promise.resolve([]),
    onSaleCategory ? getProducts({ category: String(onSaleCategory.id), per_page: 100 }) : Promise.resolve([]),
  ]);

  // Fallback: if latest-arrival category is empty, try featured products
  let featuredProducts = latestArrivalProducts;
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = await getProducts({ featured: true, per_page: 6 });
  }
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = await getProducts({ per_page: 6 });
  }

  // Total count from the category metadata (e.g. 24 total products in latest-arrival)
  const featuredTotalCount = latestArrivalCategory?.count || featuredProducts.length;

  // Social Media Reels Data
  const socialMediaReels: SocialMediaReel[] = [
    {
      id: "reel-1",
      videoUrl: "https://youtube.com/shorts/fJW7HFJuck0?si=MEw5VnW1ZVkP1W0c",
      category: "SERIOUS PERFORMANCE",
      productLink: "/category/high-end-pc",
      platform: "youtube",
    },
    {
      id: "reel-2",
      videoUrl: "https://www.youtube.com/embed/lvU7-F-rWFU",
      category: "MSI RTX SERIES",
      productLink: "/category/pc-cases",
      platform: "youtube",
    },
    {
      id: "reel-3",
      videoUrl: "https://youtube.com/shorts/OS5t9sG0c8Y?si=bt78tKtXed8iWT_x",
      category: "ASMR",
      productLink: "/category/gpus",
      platform: "youtube",
    },
    {
      id: "reel-4",
      videoUrl: "https://www.instagram.com/reel/DZR9DCegHGR/?utm_source=ig_embed&utm_campaign=loading",
      category: "TUF GAMING 5F SERIES",
      productLink: "/category/laptops",
      platform: "instagram",
    },
    {
      id: "reel-5",
      videoUrl: "https://www.instagram.com/reel/DZQBeUkkjvz/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      category: "ROG",
      productLink: "/category/on-sale",
      platform: "instagram",
    },
    {
      id: "reel-6",
      videoUrl: "https://www.instagram.com/reel/DZNcqeLChQ1/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      category: "WIFI",
      productLink: "/category/latest-arrival",
      platform: "instagram",
    },
  ];

  return (
    <div>
      {/* 1. Hero Slider */}
      <HeroSlider laptopProducts={heroLaptops} />

      {/* 2. Categories Grid */}
      <CategoriesGrid 
        categoryCounts={{
          laptops: laptopsCategory?.count || 0,
          "pc-cases": pcCasesCategory?.count || 0,
          gpus: gpusCategory?.count || 0,
          motherboards: motherboardsCategory?.count || 0,
          cpus: cpusCategory?.count || 0,
          "pc-cooling-systems": pcCoolingSystemsCategory?.count || 0,
          "power-supplies": powerSuppliesCategory?.count || 0,
          storage: storageCategory?.count || 0,
          ram: ramCategory?.count || 0,
          "gaming-keyboards": gamingKeyboardsCategory?.count || 0,
          "gaming-mouse": gamingMouseCategory?.count || 0,
          "apple-products": appleProductsCategory?.count || 0,
        }}
      />

      {/* 3. On Sale Banner + Products Section */}
      {onSaleProducts.length > 0 && (
        <BannerProductSection
          title="On Sale"
          bannerImageSrc="https://api.pcwalaonline.com/wp-content/uploads/2026/06/on_sale_banner_desktop.png"
          bannerImageMobileSrc="https://api.pcwalaonline.com/wp-content/uploads/2026/06/on_sale_banner_mobile.png"
          bannerImageAlt="On Sale Products"
          products={onSaleProducts}
          viewAllLink="/category/on-sale"
          usePCD2={true}
        />
      )}

      {/* 4. Featured Hardware Section — Latest Arrival products */}
      {featuredProducts.length > 0 && (
        <GridSection 
          title="Latest Arrivals" 
          subtitle="New Arrivals" 
          count={featuredProducts.length} 
          totalCount={featuredTotalCount}
          countLabel="Featured Items"
          viewAllLink="/category/latest-arrival"
        >
          {featuredProducts.map((product) => (
            <div key={product.id} style={{ gridColumn: "span 2" }}>
              <PCD_2 product={product} />
            </div>
          ))}
        </GridSection>
      )}

      {/* 5. Brand Marquee */}
      <BrandMarquee />

      {/* 6. Custom Build Banners Section */}
      <CustomBuildBanners />

      {/* 7. Notables Section - Motherboards, Power Supplies, Gaming Keyboards */}
      {(motherboards.length > 0 || powerSupplies.length > 0 || gamingKeyboards.length > 0) && (
        <NotablesSection
          motherboards={motherboards}
          powerSupplies={powerSupplies}
          gamingKeyboards={gamingKeyboards}
        />
      )}

      {/* 8. Gaming Mouse Banner + Products Section */}
      {gamingMouseProducts.length > 0 && (
        <BannerProductSection
          title="Gaming Mouse"
          bannerImageSrc="https://api.pcwalaonline.com/wp-content/uploads/2026/06/mouse_banner.png"
          bannerImageMobileSrc="https://api.pcwalaonline.com/wp-content/uploads/2026/06/mouse_banner1_mobile.png"
          bannerImageAlt="Gaming Mouse Collection"
          products={gamingMouseProducts}
          viewAllLink="/category/gaming-mouse"
        />
      )}

      {/* 9. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 10. Social Media Reels Section */}
      {socialMediaReels.length > 0 && (
        <SocialMediaSection reels={socialMediaReels} />
      )}
    </div>
  );
}
