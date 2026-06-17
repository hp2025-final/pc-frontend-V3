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

      const isDev = process.env.NODE_ENV === "development";
      const devNote = isDev ? " (Note: Cache clearing fully works in production only)" : "";

      return NextResponse.json({
        success: true,
        message: `All product pages cleared (showing first ${products.length})${devNote}`,
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

      console.log("Checking products modified after:", cutoff.toISOString());
      console.log("Current time:", now.toISOString());
      console.log("Total products fetched:", products.length);

      const modifiedProducts = products.filter((p) => {
        const modifiedDate = new Date(p.date_modified);
        const isModified = modifiedDate >= cutoff;
        
        if (isModified) {
          console.log(`✓ Product "${p.name}" modified at ${modifiedDate.toISOString()}`);
        }
        
        return isModified;
      });

      console.log("Modified products found:", modifiedProducts.length);

      // If no products found, show the most recently modified products for reference
      let additionalInfo = "";
      if (modifiedProducts.length === 0) {
        const sortedByDate = [...products].sort((a, b) => {
          return new Date(b.date_modified).getTime() - new Date(a.date_modified).getTime();
        });
        
        const mostRecent = sortedByDate.slice(0, 5);
        const recentInfo = mostRecent.map((p) => {
          const modified = new Date(p.date_modified);
          const hoursAgo = ((now.getTime() - modified.getTime()) / (1000 * 60 * 60)).toFixed(1);
          return `${p.name} (${hoursAgo}h ago)`;
        });
        
        additionalInfo = `. Most recently modified: ${recentInfo.join(", ")}`;
      }

      // Clear product pages
      for (const product of modifiedProducts) {
        revalidatePath(`/product/${product.slug}`);
        clearedProducts.push(product.name);
      }

      const isDev = process.env.NODE_ENV === "development";
      const devNote = isDev ? " (Note: Cache clearing fully works in production only)" : "";

      return NextResponse.json({
        success: true,
        message: `${modifiedProducts.length} product pages cleared (modified in last ${hours} hour${hours > 1 ? "s" : ""})${devNote}${additionalInfo}`,
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
