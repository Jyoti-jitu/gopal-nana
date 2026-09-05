import { ContentStatus } from "./product";

export interface Testimonial {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number; // 1-5
  photo_url?: string;
  featured: boolean;
  enabled: boolean;
  verified?: boolean;
  display_order: number;
  status: ContentStatus;
  created_at?: string;
  updated_at?: string;
}
