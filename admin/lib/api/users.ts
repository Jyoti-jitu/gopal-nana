import { apiClient } from "./client";
import { User, StandardResponse } from "../types";

export async function getUsers(): Promise<User[]> {
  const res = await apiClient<{ success: boolean; data: User[] }>("/admin/users");
  return res.data;
}

export async function createUser(data: { email: string; name: string; password?: string; role: string }): Promise<User> {
  const res = await apiClient<StandardResponse<User>>("/admin/users", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await apiClient<StandardResponse<User>>(`/admin/users/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient(`/admin/users/${id}`, { method: "DELETE" });
}

export async function resetUserPassword(id: string): Promise<{ temporary_password?: string }> {
  const res = await apiClient<StandardResponse<{ temporary_password?: string }>>(`/admin/users/${id}/reset-password`, {
    method: "POST",
  });
  return res.data!;
}
