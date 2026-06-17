import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts } from "@/lib/woocommerce";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("search") || "";

    if (!searchTerm || searchTerm.length < 3) {
      return NextResponse.json({
        success: false,
        message: "Please enter at least 3 characters to search",
      });
    }

    // Search for products matching the name
    const products = await getProducts({ search: searchTerm, per_page: 50 });

    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No products found matching "${searchTerm}"`,
      });
    }

    const clearedProducts: string[] = [];

    // Clear cache for all matching products
    for (const product of products) {
      revalidatePath(`/product/${product.slug}`);
      clearedProducts.push(product.name);
    }

    const isDev = process.env.NODE_ENV === "development";
    const devNote = isDev ? " (Works in production)" : "";

    return NextResponse.json({
      success: true,
      message: `${products.length} product${products.length > 1 ? 's' : ''} found and cleared${devNote}`,
      count: products.length,
      clearedItems: clearedProducts,
    });
  } catch (error) {
    console.error("Error clearing product by name:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error searching for products",
      },
      { status: 500 }
    );
  }
}
