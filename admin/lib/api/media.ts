import { apiClient } from "./client";
import { MediaItem, StandardResponse } from "../types";

export interface GetMediaParams {
  search?: string;
  folder?: string;
  mime_type?: string;
}

export async function getMedia(params: GetMediaParams = {}): Promise<MediaItem[]> {
  const res = await apiClient<{ success: boolean; data: any }>("/admin/media", { params });
  const rawItems = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  return rawItems.map((item: any) => ({
    ...item,
    original_name: item.original_name || item.original_filename || item.filename,
    size_bytes: item.size_bytes || item.size || 0,
  }));
}

export async function uploadMedia(file: File, altText?: string, folder?: string): Promise<MediaItem> {
  const formData = new FormData();
  formData.append("file", file);
  if (altText) formData.append("alt_text", altText);
  if (folder) formData.append("folder", folder);

  const res = await apiClient<StandardResponse<any>>("/admin/media/upload", {
    method: "POST",
    body: formData,
  });
  const raw = res.data!;
  return {
    ...raw,
    original_name: raw.original_name || raw.original_filename || raw.filename,
    size_bytes: raw.size_bytes || raw.size || 0,
  };
}

export async function updateMediaMetadata(id: string, data: { alt_text?: string; caption?: string; folder?: string }): Promise<MediaItem> {
  const res = await apiClient<StandardResponse<MediaItem>>(`/admin/media/${id}`, {
    method: "PATCH",
    body: data,
  });
  return res.data!;
}

export async function deleteMedia(id: string): Promise<void> {
  await apiClient(`/admin/media/${id}`, { method: "DELETE" });
}
