import { apiClient } from "./client";
import { AuditLog } from "../types";

export interface GetAuditLogsParams {
  user?: string;
  action?: string;
  entity?: string;
  limit?: number;
}

export async function getAuditLogs(params: GetAuditLogsParams = {}): Promise<AuditLog[]> {
  const res = await apiClient<{ success: boolean; data: AuditLog[] }>("/admin/audit-logs", { params });
  return res.data;
}
