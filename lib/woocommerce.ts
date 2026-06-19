import { WooCommerceCategory, WooCommerceProduct, WooCommerceBrand } from "./types";

const BASE_URL = process.env.WOOCOMMERCE_BASE_URL || "https://api.pcwalaonline.com";
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

// Cache duration: 12 hours (43200 seconds)
const CACHE_REVALIDATE = 43200;

function getAuthParams(): string {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn("WooCommerce credentials are missing in environment variables!");
  }
  return `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
}

/**
 * Fetch all categories. WooCommerce REST API defaults to 10 products/categories per page.
 * Fetch up to 100 to make sure we capture all.
 */
export async function getCategories(): Promise<WooCommerceCategory[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wc/v3/products/categories?per_page=100&${getAuthParams()}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch categories. Status: ${res.status}`);
    }
    const categories: WooCommerceCategory[] = await res.json();
    
    // Return only active categories that have products (count > 0)
    return categories.filter((c) => c.count > 0);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetch products based on filtering options.
 */
export async function getProducts(params: {
  category?: string;
  page?: number;
  per_page?: number;
  orderby?: "date" | "price" | "title" | "popularity";
  order?: "asc" | "desc";
  search?: string;
  featured?: boolean;
  min_price?: string;
  max_price?: string;
  brand?: string;
  tag?: string;
  on_sale?: boolean;
} = {}): Promise<WooCommerceProduct[]> {
  try {
    const queryParts: string[] = [getAuthParams()];

    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.per_page) queryParts.push(`per_page=${params.per_page}`);
    else queryParts.push(`per_page=12`); // Default to 12

    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.orderby) queryParts.push(`orderby=${params.orderby}`);
    if (params.order) queryParts.push(`order=${params.order}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.featured !== undefined) queryParts.push(`featured=${params.featured}`);
    if (params.min_price) queryParts.push(`min_price=${params.min_price}`);
    if (params.max_price) queryParts.push(`max_price=${params.max_price}`);
    if (params.brand) queryParts.push(`brand=${params.brand}`);
    if (params.tag) queryParts.push(`tag=${params.tag}`);
    if (params.on_sale !== undefined) queryParts.push(`on_sale=${params.on_sale}`);
    
    // Only query publicly published products
    queryParts.push(`status=publish`);

    const url = `${BASE_URL}/wp-json/wc/v3/products?${queryParts.join("&")}`;
    const res = await fetch(url, {
      next: { revalidate: CACHE_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products. Status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Fetch products and return them along with pagination metadata from headers.
 */
export async function getProductsWithCount(params: {
  category?: string;
  page?: number;
  per_page?: number;
  orderby?: "date" | "price" | "title" | "popularity";
  order?: "asc" | "desc";
  search?: string;
  featured?: boolean;
  min_price?: string;
  max_price?: string;
  brand?: string;
  tag?: string;
  on_sale?: boolean;
} = {}): Promise<{ products: WooCommerceProduct[]; totalCount: number; totalPages: number }> {
  try {
    const queryParts: string[] = [getAuthParams()];

    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.per_page) queryParts.push(`per_page=${params.per_page}`);
    else queryParts.push(`per_page=12`); // Default to 12

    if (params.category) queryParts.push(`category=${params.category}`);
    if (params.orderby) queryParts.push(`orderby=${params.orderby}`);
    if (params.order) queryParts.push(`order=${params.order}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.featured !== undefined) queryParts.push(`featured=${params.featured}`);
    if (params.min_price) queryParts.push(`min_price=${params.min_price}`);
    if (params.max_price) queryParts.push(`max_price=${params.max_price}`);
    if (params.brand) queryParts.push(`brand=${params.brand}`);
    if (params.tag) queryParts.push(`tag=${params.tag}`);
    if (params.on_sale !== undefined) queryParts.push(`on_sale=${params.on_sale}`);
    
    // Only query publicly published products
    queryParts.push(`status=publish`);

    const url = `${BASE_URL}/wp-json/wc/v3/products?${queryParts.join("&")}`;
    const res = await fetch(url, {
      next: { revalidate: CACHE_REVALIDATE },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products with count. Status: ${res.status}`);
    }

    const totalCount = parseInt(res.headers.get("x-wp-total") || "0", 10);
    const totalPages = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    const products = await res.json();

    return { products, totalCount, totalPages };
  } catch (error) {
    console.error("Error fetching products with count:", error);
    return { products: [], totalCount: 0, totalPages: 1 };
  }
}

/**
 * Fetch all brands from WooCommerce (with count > 0).
 */
export async function getBrands(): Promise<WooCommerceBrand[]> {
  try {
    const brands: WooCommerceBrand[] = [];
    let page = 1;
    let keepFetching = true;

    while (keepFetching) {
      const url = `${BASE_URL}/wp-json/wc/v3/products/brands?per_page=100&page=${page}&${getAuthParams()}`;
      const res = await fetch(url, {
        next: { revalidate: CACHE_REVALIDATE },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch brands page ${page}. Status: ${res.status}`);
      }

      const data: WooCommerceBrand[] = await res.json();
      if (data.length === 0) {
        keepFetching = false;
      } else {
        brands.push(...data);
        if (data.length < 100) {
          keepFetching = false;
        } else {
          page++;
        }
      }
    }

    return brands.filter((b) => b.count > 0);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
}


/**
 * Fetch a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wc/v3/products?slug=${slug}&status=publish&${getAuthParams()}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch product by slug: ${slug}. Status: ${res.status}`);
    }
    const products: WooCommerceProduct[] = await res.json();
    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch batch of products by their specific IDs (used for related products).
 */
export async function getProductsByIds(ids: number[]): Promise<WooCommerceProduct[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wc/v3/products?include=${ids.join(",")}&status=publish&${getAuthParams()}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch products by IDs. Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    return [];
  }
}

/**
 * Fetch a single category by its slug (to get total product count etc).
 */
export async function getCategoryBySlug(slug: string): Promise<WooCommerceCategory | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wc/v3/products/categories?slug=${slug}&${getAuthParams()}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch category by slug: ${slug}. Status: ${res.status}`);
    }
    const categories: WooCommerceCategory[] = await res.json();
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch a tag from WooCommerce by its slug.
 */
export async function getTagBySlug(slug: string): Promise<{ id: number; name: string; slug: string } | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/wp-json/wc/v3/products/tags?slug=${slug}&${getAuthParams()}`,
      {
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch tag by slug: ${slug}. Status: ${res.status}`);
    }
    const tags = await res.json();
    return tags.length > 0 ? tags[0] : null;
  } catch (error) {
    console.error(`Error fetching tag by slug ${slug}:`, error);
    return null;
  }
}

