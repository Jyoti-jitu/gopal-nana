import { apiClient } from "./client";
import { Enquiry, EnquiryStatus, PaginatedResponse, StandardResponse } from "../types";

export interface GetEnquiriesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: EnquiryStatus;
}

export async function getEnquiries(params: GetEnquiriesParams = {}): Promise<PaginatedResponse<Enquiry>> {
  return apiClient<PaginatedResponse<Enquiry>>("/admin/enquiries", { params });
}

export async function getEnquiry(id: string): Promise<Enquiry> {
  const res = await apiClient<StandardResponse<Enquiry>>(`/admin/enquiries/${id}`);
  return res.data!;
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus, notes?: string): Promise<Enquiry> {
  const res = await apiClient<StandardResponse<Enquiry>>(`/admin/enquiries/${id}`, {
    method: "PATCH",
    body: { status, notes },
  });
  return res.data!;
}

export async function deleteEnquiry(id: string): Promise<void> {
  await apiClient(`/admin/enquiries/${id}`, { method: "DELETE" });
}
