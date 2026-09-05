import { apiClient } from "./client";
import { WebsiteSettings, StandardResponse } from "../types";

export async function getSettings(): Promise<WebsiteSettings> {
  const res = await apiClient<StandardResponse<WebsiteSettings>>("/admin/settings");
  return res.data!;
}

export async function updateSettings(data: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const res = await apiClient<StandardResponse<WebsiteSettings>>("/admin/settings", {
    method: "PUT",
    body: data,
  });
  return res.data!;
}
