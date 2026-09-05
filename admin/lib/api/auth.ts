import { apiClient } from "./client";
import { LoginCredentials, LoginResponseData, User } from "../types/auth";

export async function loginApi(credentials: LoginCredentials): Promise<LoginResponseData> {
  return apiClient<LoginResponseData>("/auth/login", {
    method: "POST",
    body: credentials,
  });
}

export async function logoutApi(): Promise<void> {
  try {
    await apiClient("/auth/logout", { method: "POST" });
  } catch {
    // Ignore error on client side logout
  }
}

export async function getMeApi(): Promise<User> {
  const res = await apiClient<{ success: boolean; data: User }>("/admin/users/me");
  return res.data;
}
