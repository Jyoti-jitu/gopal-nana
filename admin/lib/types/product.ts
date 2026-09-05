export type ContentStatus = "draft" | "published" | "archived";

export interface SpecificationItem {
  label: string;
  values: Record<string, any>;
}

export interface ProductImage {
  media_id?: string;
  url: string;
  alt?: string;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
  canonical_url?: string;
  no_index?: boolean;
}

export interface CategoryEmbedded {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  slug: string;
  category_id: string;
  category?: CategoryEmbedded;
  tag?: string;
  short_description?: string;
  description: string;
  features: string[];
  specifications: SpecificationItem[];
  images: ProductImage[];
  applications: string[];
  documents?: Record<string, string>[];
  featured: boolean;
  display_order: number;
  status: ContentStatus;
  seo?: SEOData;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormValues {
  code: string;
  name: string;
  slug: string;
  category_id: string;
  tag?: string;
  short_description?: string;
  description: string;
  features: string[];
  specifications: { label: string; value: string }[];
  images: ProductImage[];
  applications: string[];
  featured: boolean;
  display_order: number;
  status: ContentStatus;
  seo?: SEOData;
}
