import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, GetAuditLogsParams } from "../lib/api/audit-logs";

export function useAuditLogs(params: GetAuditLogsParams = {}) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => getAuditLogs(params),
  });
}
