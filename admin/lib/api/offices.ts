import { apiClient } from "./client";
import { Office, StandardResponse } from "../types";

export async function getOffices(): Promise<Office[]> {
  const res = await apiClient<{ success: boolean; data: Office[] }>("/admin/offices");
  return res.data;
}

export async function createOffice(data: Partial<Office>): Promise<Office> {
  const res = await apiClient<StandardResponse<Office>>("/admin/offices", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateOffice(id: string, data: Partial<Office>): Promise<Office> {
  const res = await apiClient<StandardResponse<Office>>(`/admin/offices/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteOffice(id: string): Promise<void> {
  await apiClient(`/admin/offices/${id}`, { method: "DELETE" });
}
