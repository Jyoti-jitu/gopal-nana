import { apiClient } from "./client";
import { Testimonial, StandardResponse } from "../types";

export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await apiClient<{ success: boolean; data: Testimonial[] }>("/admin/testimonials");
  return res.data;
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  const res = await apiClient<StandardResponse<Testimonial>>("/admin/testimonials", {
    method: "POST",
    body: data,
  });
  return res.data!;
}

export async function updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial> {
  const res = await apiClient<StandardResponse<Testimonial>>(`/admin/testimonials/${id}`, {
    method: "PUT",
    body: data,
  });
  return res.data!;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await apiClient(`/admin/testimonials/${id}`, { method: "DELETE" });
}

export async function publishTestimonial(id: string): Promise<Testimonial> {
  const res = await apiClient<StandardResponse<Testimonial>>(`/admin/testimonials/${id}/publish`, {
    method: "POST",
  });
  return res.data!;
}
