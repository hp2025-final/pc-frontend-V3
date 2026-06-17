import { NextResponse } from "next/server";
import { getProducts } from "@/lib/woocommerce";

export async function GET() {
  try {
    const products = await getProducts({ per_page: 20 });
    const now = new Date();
    
    const productInfo = products.map((p) => {
      const modifiedDate = new Date(p.date_modified);
      const hoursSinceModified = (now.getTime() - modifiedDate.getTime()) / (1000 * 60 * 60);
      
      return {
        name: p.name,
        modified: p.date_modified,
        hoursAgo: hoursSinceModified.toFixed(2),
        modifiedLocal: modifiedDate.toLocaleString(),
      };
    });

    return NextResponse.json({
      currentTime: now.toISOString(),
      currentTimeLocal: now.toLocaleString(),
      totalProducts: products.length,
      products: productInfo,
    });
  } catch (error) {
    console.error("Error fetching debug info:", error);
    return NextResponse.json(
      {
        error: "Error fetching products",
      },
      { status: 500 }
    );
  }
}
