import { apiClient } from "./client";
import { StandardResponse } from "../types";

export interface InstallationStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  image_url?: string;
  enabled: boolean;
  display_order: number;
}

export async function getInstallationSteps(): Promise<InstallationStep[]> {
  const res = await apiClient<{ success: boolean; data: InstallationStep[] }>("/admin/installation");
  return res.data;
}

export async function createInstallationStep(data: Partial<InstallationStep>): Promise<InstallationStep> {
  const res = await apiClient<StandardResponse<InstallationStep>>("/admin/installation", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateInstallationStep(id: string, data: Partial<InstallationStep>): Promise<InstallationStep> {
  const res = await apiClient<StandardResponse<InstallationStep>>(`/admin/installation/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteInstallationStep(id: string): Promise<void> {
  await apiClient(`/admin/installation/${id}`, { method: "DELETE" });
}

export async function reorderInstallationSteps(items: { id: string; display_order: number }[]): Promise<void> {
  await apiClient("/admin/installation/reorder", {
    method: "PATCH",
    body: { items },
  });
}
