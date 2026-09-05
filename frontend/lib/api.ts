import { Product, Category, EnquiryPayload, EnquiryResponse } from "./types";
import { CATEGORIES, getProductBySlug, getProductsByCategory } from "./products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const USE_MOCK_DATA = true; // Toggle to false when FastAPI backend is live

export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  if (USE_MOCK_DATA) {
    // Simulate minor async network latency
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getProductsByCategory(categorySlug || "all");
  }

  try {
    const url = categorySlug && categorySlug !== "all" 
      ? `${API_URL}/api/products?category=${categorySlug}`
      : `${API_URL}/api/products`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.warn("API Error, falling back to local dataset:", error);
    return getProductsByCategory(categorySlug || "all");
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return getProductBySlug(slug) || null;
  }

  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch product");
    return await res.json();
  } catch (error) {
    console.warn(`API Error for product ${slug}, falling back to local dataset:`, error);
    return getProductBySlug(slug) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (USE_MOCK_DATA) {
    return CATEGORIES;
  }

  try {
    const res = await fetch(`${API_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (error) {
    console.warn("API Error, falling back to local categories:", error);
    return CATEGORIES;
  }
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // simulate server processing
    return {
      success: true,
      message: "Thank you for reaching out! Our electrical engineering team will contact you shortly.",
      enquiryId: `FE-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }

  try {
    const res = await fetch(`${API_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || "Failed to submit enquiry");
    }

    return await res.json();
  } catch (error: any) {
    console.error("Enquiry Submission Error:", error);
    throw new Error(error.message || "Something went wrong. Please try again or call us directly.");
  }
}
