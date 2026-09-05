import { apiClient } from "./client";
import { NavigationMenu, StandardResponse } from "../types";

export async function getNavigation(location?: "header" | "footer"): Promise<NavigationMenu[]> {
  const res = await apiClient<{ success: boolean; data: NavigationMenu[] }>("/admin/navigation", {
    params: location ? { location } : undefined,
  });
  return res.data;
}

export async function updateNavigation(location: "header" | "footer", items: any[]): Promise<NavigationMenu> {
  const res = await apiClient<StandardResponse<NavigationMenu>>("/admin/navigation", {
    method: "PUT",
    body: { location, items },
  });
  return res.data!;
}
