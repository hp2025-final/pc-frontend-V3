import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, getCategories } from "@/lib/woocommerce";

export async function GET() {
  try {
    const clearedItems: string[] = [];

    // Clear homepage
    revalidatePath("/");
    clearedItems.push("Homepage");

    // Clear all category pages
    const categories = await getCategories();
    for (const category of categories) {
      revalidatePath(`/category/${category.slug}`);
    }
    clearedItems.push(`${categories.length} category pages`);

    // Clear all product pages (first 100)
    const products = await getProducts({ per_page: 100 });
    for (const product of products) {
      revalidatePath(`/product/${product.slug}`);
    }
    clearedItems.push(`${products.length}+ product pages`);

    // Clear search page
    revalidatePath("/search");
    clearedItems.push("Search page");

    return NextResponse.json({
      success: true,
      message: "All caches cleared successfully",
      count: 1 + categories.length + products.length + 1,
      clearedItems,
    });
  } catch (error) {
    console.error("Error clearing all cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error clearing all cache",
      },
      { status: 500 }
    );
  }
}
