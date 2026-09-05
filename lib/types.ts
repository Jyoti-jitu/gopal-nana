export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  code: string;
  name: string;
  category: string;
  categorySlug: string;
  tag?: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Specification[];
  applications?: string[];
  images: string[];
  brochureAvailable?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  product?: string;
  message: string;
}

export interface EnquiryResponse {
  success: boolean;
  message: string;
  enquiryId?: string;
}
