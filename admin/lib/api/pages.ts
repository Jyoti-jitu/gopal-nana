import { apiClient } from "./client";
import { CMSPage, StandardResponse } from "../types";

export async function getPages(): Promise<CMSPage[]> {
  const res = await apiClient<{ success: boolean; data: CMSPage[] }>("/admin/pages");
  return res.data;
}

export async function getPageBySlug(slug: string): Promise<CMSPage> {
  const res = await apiClient<StandardResponse<CMSPage>>(`/admin/pages/${slug}`);
  return res.data!;
}

export async function updatePage(id: string, data: Partial<CMSPage>): Promise<CMSPage> {
  const res = await apiClient<StandardResponse<CMSPage>>(`/admin/pages/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function publishPage(id: string): Promise<CMSPage> {
  const res = await apiClient<StandardResponse<CMSPage>>(`/admin/pages/${id}/publish`, {
    method: "POST",
  });
  return res.data!;
}
