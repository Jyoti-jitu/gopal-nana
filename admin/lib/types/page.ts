import { SEOData, ContentStatus } from "./product";

export interface HeroConfig {
  eyebrow?: string;
  title: string;
  description: string;
  primary_cta_text?: string;
  primary_cta_url?: string;
  secondary_cta_text?: string;
  secondary_cta_url?: string;
  hero_image?: string;
  overlay?: boolean;
  alignment?: "left" | "center" | "right";
}

export interface SectionItem {
  id?: string;
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  url?: string;
  meta?: Record<string, any>;
}

export interface PageSection {
  id: string;
  section_type: string; // hero, trust, why_us, text, cta, gallery
  title?: string;
  subtitle?: string;
  enabled: boolean;
  display_order: number;
  content: Record<string, any>;
  items?: SectionItem[];
}

export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: ContentStatus;
  sections?: PageSection[];
  seo?: SEOData;
  created_at?: string;
  updated_at?: string;
}
