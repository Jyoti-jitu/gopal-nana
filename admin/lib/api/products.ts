import { apiClient } from "./client";
import { Product, PaginatedResponse, StandardResponse } from "../types";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedResponse<Product>> {
  return apiClient<PaginatedResponse<Product>>("/admin/products", { params });
}

export async function getProduct(id: string): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>(`/admin/products/${id}`);
  return res.data!;
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>("/admin/products", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>(`/admin/products/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient(`/admin/products/${id}`, { method: "DELETE" });
}

export async function publishProduct(id: string): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>(`/admin/products/${id}/publish`, {
    method: "POST",
  });
  return res.data!;
}

export async function unpublishProduct(id: string): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>(`/admin/products/${id}/unpublish`, {
    method: "POST",
  });
  return res.data!;
}

export async function duplicateProduct(id: string): Promise<Product> {
  const res = await apiClient<StandardResponse<Product>>(`/admin/products/${id}/duplicate`, {
    method: "POST",
  });
  return res.data!;
}

export async function reorderProducts(items: { id: string; display_order: number }[]): Promise<void> {
  await apiClient("/admin/products/reorder", {
    method: "PATCH",
    body: { items },
  });
}
