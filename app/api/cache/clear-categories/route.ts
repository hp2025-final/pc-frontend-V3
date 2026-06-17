import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, getCategories } from "@/lib/woocommerce";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const option = searchParams.get("option") || "no-change";

    if (option === "no-change") {
      return NextResponse.json({
        success: false,
        message: "No changes selected",
      });
    }

    const clearedCategories: string[] = [];

    if (option === "all") {
      // Clear all category pages
      const categories = await getCategories();
      
      for (const category of categories) {
        revalidatePath(`/category/${category.slug}`);
        clearedCategories.push(category.name);
      }

      return NextResponse.json({
        success: true,
        message: `All ${clearedCategories.length} category pages cleared`,
        count: clearedCategories.length,
        clearedItems: clearedCategories,
      });
    } else {
      const hours = parseInt(option);
      if (isNaN(hours)) {
        return NextResponse.json({
          success: false,
          message: "Invalid option",
        });
      }

      // Get products modified in last X hours
      const products = await getProducts({ per_page: 100 });
      const now = new Date();
      const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);

      const modifiedProducts = products.filter((p) => {
        const modifiedDate = new Date(p.date_modified);
        return modifiedDate >= cutoff;
      });

      // Get unique categories from modified products
      const categorySet = new Set<string>();
      modifiedProducts.forEach((product) => {
        product.categories?.forEach((cat) => {
          categorySet.add(cat.slug);
          clearedCategories.push(cat.name);
        });
      });

      // Clear category pages
      categorySet.forEach((slug) => {
        revalidatePath(`/category/${slug}`);
      });

      return NextResponse.json({
        success: true,
        message: `${categorySet.size} category pages cleared (${modifiedProducts.length} products modified in last ${hours} hour${hours > 1 ? "s" : ""})`,
        count: categorySet.size,
        clearedItems: [...new Set(clearedCategories)], // Remove duplicates
      });
    }
  } catch (error) {
    console.error("Error clearing categories cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error clearing categories cache",
      },
      { status: 500 }
    );
  }
}
