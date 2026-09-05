import { apiClient } from "./client";

export interface DashboardStats {
  counts: {
    total_products: number;
    published_products: number;
    draft_products: number;
    categories: number;
    new_enquiries: number;
    total_enquiries: number;
    media_files: number;
    testimonials: number;
  };
  recent_enquiries: Array<{
    id: string;
    name: string;
    email: string;
    subject?: string;
    product?: string;
    status: string;
    created_at: string;
  }>;
  recent_activity: Array<{
    id: string;
    timestamp: string;
    user_email: string;
    user_name?: string;
    action: string;
    entity: string;
    entity_id?: string;
    details?: any;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await apiClient<{ success: boolean; data: DashboardStats }>("/admin/dashboard");
  return res.data;
}
