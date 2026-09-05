import { Product, Category, EnquiryPayload, EnquiryResponse, Specification } from "./types";
import { PRODUCTS, CATEGORIES, getProductBySlug, getProductsByCategory } from "./products";
import { getCloudinaryUrl } from "./cloudinary";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function normalizeProduct(p: any): Product {
  if (!p) return p;

  let images: string[] = [];
  if (Array.isArray(p.images)) {
    images = p.images
      .map((img: any) => (typeof img === "string" ? img : img.url || ""))
      .filter(Boolean)
      .map((url: string) => getCloudinaryUrl(url));
  }
  if (!images.length || !images[0]) {
    images = [getCloudinaryUrl("/images/products/gi-earthing-electrode.svg")];
  }

  let specifications: Specification[] = [];
  if (Array.isArray(p.specifications)) {
    specifications = p.specifications.map((s: any) => {
      let val = "";
      if (typeof s.values === "string") val = s.values;
      else if (s.values && typeof s.values === "object") val = s.values.value || s.values.val || JSON.stringify(s.values);
      return {
        label: s.label || "",
        value: val || s.value || ""
      };
    });
  }

  const categorySlug = p.category?.slug || p.category_slug || (typeof p.category === "string" ? p.category : "earthing-electrodes");
  const categoryName = p.category?.name || p.category_name || p.category || "Earthing Electrodes";

  return {
    slug: p.slug || "",
    code: p.code || "",
    name: p.name || "",
    category: categoryName,
    categorySlug: categorySlug,
    tag: p.tag || (p.featured ? "Featured" : undefined),
    shortDescription: p.short_description || p.shortDescription || "",
    description: p.description || "",
    features: Array.isArray(p.features) ? p.features : [],
    specifications: specifications,
    applications: Array.isArray(p.applications) ? p.applications : [],
    images: images,
    brochureAvailable: p.brochureAvailable ?? true
  };
}

export async function fetchProducts(categorySlug?: string, searchQuery?: string): Promise<Product[]> {
  try {
    let url = `${API_BASE_URL}/products?limit=100`;
    if (categorySlug && categorySlug !== "all") {
      url += `&category=${encodeURIComponent(categorySlug)}`;
    }
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rawItems = json.data?.items || json.data || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return getProductsByCategory(categorySlug || "all");
    }
    return rawItems.map(normalizeProduct);
  } catch (error) {
    console.warn("API Error (fetchProducts), using fallback dataset:", error);
    return getProductsByCategory(categorySlug || "all");
  }
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/featured?limit=6`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rawItems = json.data || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return PRODUCTS.filter((p) => p.tag === "Popular Choice" || p.tag === "High Durability" || p.tag === "Premium Grade").slice(0, 6);
    }
    return rawItems.map(normalizeProduct);
  } catch (error) {
    console.warn("API Error (fetchFeaturedProducts), using fallback dataset:", error);
    return PRODUCTS.slice(0, 6);
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data) return getProductBySlug(slug) || null;
    return normalizeProduct(json.data);
  } catch (error) {
    console.warn(`API Error for product ${slug}, using fallback dataset:`, error);
    return getProductBySlug(slug) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const rawCats = json.data || [];
    if (!Array.isArray(rawCats) || rawCats.length === 0) {
      return CATEGORIES;
    }
    // Format categories to match Category interface
    const cats: Category[] = [
      { id: "all", name: "All Products", slug: "all", count: 0 },
      ...rawCats.map((c: any) => ({
        id: c.id || c._id || c.slug,
        name: c.name,
        slug: c.slug,
        count: c.product_count || c.count || 0
      }))
    ];
    return cats;
  } catch (error) {
    console.warn("API Error (fetchCategories), using fallback categories:", error);
    return CATEGORIES;
  }
}

export async function fetchInstallationSteps(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/installation`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("API Error (fetchInstallationSteps):", error);
    return [];
  }
}

export async function fetchTestimonials(featuredOnly: boolean = false): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/testimonials${featuredOnly ? "?featured=true" : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn("API Error (fetchTestimonials):", error);
    return [];
  }
}

export async function fetchSettings(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    console.warn("API Error (fetchSettings):", error);
    return {};
  }
}

export async function fetchNavigation(location: string = "header"): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/navigation?location=${location}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const menus = json.data || [];
    if (menus.length > 0 && menus[0].items) {
      return menus[0].items;
    }
    return [];
  } catch (error) {
    console.warn("API Error (fetchNavigation):", error);
    return [];
  }
}

export async function fetchContactInfo(): Promise<{ offices: any[]; page: any }> {
  try {
    const res = await fetch(`${API_BASE_URL}/pages/contact`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || { offices: [], page: null };
  } catch (error) {
    console.warn("API Error (fetchContactInfo):", error);
    return { offices: [], page: null };
  }
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<EnquiryResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || json.detail || "Failed to submit enquiry");
    }

    return {
      success: true,
      message: json.message || "Thank you for reaching out! Our team will contact you shortly.",
      enquiryId: json.data?.id || `FE-${Math.floor(100000 + Math.random() * 900000)}`
    };
  } catch (error: any) {
    console.error("Enquiry Submission Error:", error);
    throw new Error(error.message || "Something went wrong. Please try again or call us directly.");
  }
}

