import { apiClient } from "./client";
import { Category, StandardResponse } from "../types";

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient<{ success: boolean; data: Category[] }>("/admin/categories");
  return res.data;
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const res = await apiClient<StandardResponse<Category>>("/admin/categories", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const res = await apiClient<StandardResponse<Category>>(`/admin/categories/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient(`/admin/categories/${id}`, { method: "DELETE" });
}
