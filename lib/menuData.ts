import { getCategories } from "./woocommerce";

// All possible menu items with their category slugs
const ALL_MENU_ITEMS = {
  components: [
    { name: "Graphic Card", slug: "gpus" },
    { name: "PC Case", slug: "pc-cases" },
    { name: "PC Cooling", slug: "pc-cooling-systems" },
    { name: "Motherboard", slug: "motherboards" },
    { name: "PSU", slug: "power-supplies" },
    { name: "Storage", slug: "storage" },
    { name: "PC RAM", slug: "ram" },
    { name: "Gaming Keyboard", slug: "gaming-keyboards" },
    { name: "Gaming Mouse", slug: "gaming-mouse" },
  ],
  pcAndLaptop: [
    { name: "Laptop", slug: "laptops" },
    { name: "Gaming PC", slug: "gaming-pc" },
    { name: "Custom Builds", slug: "custom-builds" },
    { name: "High-end PC", slug: "high-end-pc" },
    { name: "Servers", slug: "servers" },
    { name: "Branded PC", slug: "branded-pc" },
  ],
  appleProducts: [
    { name: "Macbook", slug: "macbook" },
    { name: "iPad", slug: "ipad" },
    { name: "iMac", slug: "imac" },
    { name: "Apple Accessories", slug: "apple-accessories" },
  ],
  accessories: [
    { name: "Wifi Router", slug: "wifi-router" },
    { name: "Speaker", slug: "speaker" },
    { name: "Headset", slug: "headset" },
    { name: "Podcast Setup", slug: "podcast-setup" },
    { name: "PC Cables", slug: "pc-cables" },
    { name: "Network Cables", slug: "network-cables" },
    { name: "Printer and Scanner", slug: "printers-scanners" },
  ],
};

export interface MenuItem {
  name: string;
  slug: string;
}

export interface MenuData {
  components: MenuItem[];
  pcAndLaptop: MenuItem[];
  appleProducts: MenuItem[];
  accessories: MenuItem[];
}

/**
 * Fetches all categories from WooCommerce and filters menu items
 * to only show categories that have products (count > 0)
 */
export async function getFilteredMenuData(): Promise<MenuData> {
  try {
    // Fetch all categories with products
    const categories = await getCategories();
    
    // Create a Set of slugs that have products for fast lookup
    const activeSlugs = new Set(categories.map(cat => cat.slug));
    
    // Filter each menu section to only include active categories
    const filteredMenuData: MenuData = {
      components: ALL_MENU_ITEMS.components.filter(item => activeSlugs.has(item.slug)),
      pcAndLaptop: ALL_MENU_ITEMS.pcAndLaptop.filter(item => activeSlugs.has(item.slug)),
      appleProducts: ALL_MENU_ITEMS.appleProducts.filter(item => activeSlugs.has(item.slug)),
      accessories: ALL_MENU_ITEMS.accessories.filter(item => activeSlugs.has(item.slug)),
    };
    
    return filteredMenuData;
  } catch (error) {
    console.error("Error filtering menu data:", error);
    // Return empty menu on error
    return {
      components: [],
      pcAndLaptop: [],
      appleProducts: [],
      accessories: [],
    };
  }
}
