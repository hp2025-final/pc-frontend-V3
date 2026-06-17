import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts } from "@/lib/woocommerce";

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

    const clearedProducts: string[] = [];

    if (option === "all") {
      // Clear all product pages (fetch first 100 for display)
      const products = await getProducts({ per_page: 100 });
      
      for (const product of products) {
        revalidatePath(`/product/${product.slug}`);
        clearedProducts.push(product.name);
      }

      return NextResponse.json({
        success: true,
        message: `All product pages cleared (showing first ${products.length})`,
        count: products.length,
        clearedItems: clearedProducts,
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

      // Clear product pages
      for (const product of modifiedProducts) {
        revalidatePath(`/product/${product.slug}`);
        clearedProducts.push(product.name);
      }

      return NextResponse.json({
        success: true,
        message: `${modifiedProducts.length} product pages cleared (modified in last ${hours} hour${hours > 1 ? "s" : ""})`,
        count: modifiedProducts.length,
        clearedItems: clearedProducts,
      });
    }
  } catch (error) {
    console.error("Error clearing products cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error clearing products cache",
      },
      { status: 500 }
    );
  }
}
