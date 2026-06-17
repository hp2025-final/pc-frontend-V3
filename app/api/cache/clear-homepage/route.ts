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

    // Clear homepage
    revalidatePath("/");

    let message = "Homepage cache cleared successfully";
    let count = 1;

    if (option === "all") {
      message = "All homepage cache cleared";
    } else {
      const hours = parseInt(option);
      if (!isNaN(hours)) {
        // Get products modified in last X hours
        const products = await getProducts({ per_page: 100 });
        const now = new Date();
        const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);

        const modifiedProducts = products.filter((p) => {
          const modifiedDate = new Date(p.date_modified);
          return modifiedDate >= cutoff;
        });

        message = `Homepage cache cleared (${modifiedProducts.length} products modified in last ${hours} hour${hours > 1 ? "s" : ""})`;
        count = modifiedProducts.length;
      }
    }

    return NextResponse.json({
      success: true,
      message,
      count,
      clearedItems: ["Homepage"],
    });
  } catch (error) {
    console.error("Error clearing homepage cache:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error clearing homepage cache",
      },
      { status: 500 }
    );
  }
}
