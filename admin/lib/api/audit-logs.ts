import { apiClient } from "./client";
import { AuditLog } from "../types";

export interface GetAuditLogsParams {
  user?: string;
  action?: string;
  entity?: string;
  limit?: number;
}

export async function getAuditLogs(params: GetAuditLogsParams = {}): Promise<AuditLog[]> {
  const res = await apiClient<{ success: boolean; data: any }>("/admin/audit-logs", { params });
  const rawItems = Array.isArray(res.data) ? res.data : (res.data?.items || []);
  return rawItems.map((item: any) => ({
    ...item,
    timestamp: item.timestamp || item.created_at || new Date().toISOString(),
    entity: item.entity || item.entity_type || "System",
  }));
}
