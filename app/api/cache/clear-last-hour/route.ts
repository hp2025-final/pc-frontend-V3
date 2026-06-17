import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts } from "@/lib/woocommerce";

export async function GET() {
  try {
    const clearedItems: string[] = [];
    let totalCount = 0;

    // Get products modified in last 1 hour
    const products = await getProducts({ per_page: 100 });
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const modifiedProducts = products.filter((p) => {
      const modifiedDate = new Date(p.date_modified);
      return modifiedDate >= oneHourAgo;
    });

    if (modifiedProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No products modified in the last hour - nothing to clear",
        count: 0,
        clearedItems: [],
      });
    }

    // Clear homepage
    revalidatePath("/");
    clearedItems.push("Homepage");
    totalCount++;

    // Clear affected product pages
    for (const product of modifiedProducts) {
      revalidatePath(`/product/${product.slug}`);
      clearedItems.push(product.name);
    }
    totalCount += modifiedProducts.length;

    // Clear affected category pages
    const categorySet = new Set<string>();
    modifiedProducts.forEach((product) => {
      product.categories?.forEach((cat) => {
        categorySet.add(cat.slug);
      });
    });

    categorySet.forEach((slug) => {
      revalidatePath(`/category/${slug}`);
    });
    totalCount += categorySet.size;

    if (categorySet.size > 0) {
      clearedItems.push(`${categorySet.size} category pages`);
    }

    return NextResponse.json({
      success: true,
      message: `Cleared cache for ${modifiedProducts.length} products modified in last hour`,
      count: totalCount,
      clearedItems,
    });
  } catch (error) {
    console.error("Error clearing last hour cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error clearing last hour cache",
      },
      { status: 500 }
    );
  }
}
