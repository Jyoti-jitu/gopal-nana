import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../lib/api/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    staleTime: 30000,
  });
}
