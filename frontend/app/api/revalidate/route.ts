import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// POST /api/revalidate
// Called by the backend (publishing_service.py) after admin edits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, path } = body;

    // Validate the shared secret
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // Revalidate the specific path if provided
    if (path) {
      revalidatePath(path);
    }

    // Also revalidate common paths that may depend on the changed data
    if (slug) {
      revalidatePath(`/products/${slug}`);
      revalidatePath("/products");
    }

    // Always revalidate the homepage (featured products, etc.)
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: `Revalidated: ${path || slug || "homepage"}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    console.error("[revalidate] Error:", error);
    return NextResponse.json(
      { success: false, message: "Revalidation failed", error: error.message },
      { status: 500 }
    );
  }
}
