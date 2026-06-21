import { NextResponse } from "next/server";
import { getProducts } from "@/lib/woocommerce";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  
  if (!query.trim()) {
    return NextResponse.json([]);
  }
  
  try {
    // Query 4 matching products using the server-side WooCommerce client
    const products = await getProducts({ search: query, per_page: 4 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("API search handler error:", error);
    return NextResponse.json({ error: "Failed to query database search" }, { status: 500 });
  }
}
