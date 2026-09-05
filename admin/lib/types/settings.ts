export interface WebsiteSettings {
  site_name: string;
  tagline?: string;
  motto?: string;
  logo_url?: string;
  favicon_url?: string;
  primary_email: string;
  primary_phone: string;
  secondary_phone?: string;
  social_links?: {
    linkedin?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  footer?: {
    description?: string;
    copyright_text?: string;
  };
  seo?: {
    default_title?: string;
    default_description?: string;
    default_keywords?: string[];
    og_image?: string;
  };
  updated_at?: string;
}
