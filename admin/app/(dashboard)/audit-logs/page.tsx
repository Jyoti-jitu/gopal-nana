"use client";

import React, { useState } from "react";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { ShieldCheck, Search } from "lucide-react";

export default function AuditLogsPage() {
  const [userFilter, setUserFilter] = useState("");
  const { data: rawLogs, isLoading } = useAuditLogs({ user: userFilter });
  const logs = Array.isArray(rawLogs) ? rawLogs : (rawLogs as any)?.items || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">System Audit Trail</h2>
        <TableSkeleton rows={10} cols={5} />
      </div>
    );
  }

  const getActionBadgeColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case "CREATE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PUBLISH":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "UPDATE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "DELETE":
      case "DELETE_MEDIA":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "UPLOAD":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "LOGIN":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">System Audit Trail & Log History</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Read-only chronological audit log of all administrator actions
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by user or action..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No Audit Logs Found</h3>
            <p className="mt-1 text-xs text-slate-500">Actions taken in the system will automatically appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {logs.map((log: any) => {
                  const dateStr = log.timestamp || log.created_at;
                  let formattedDate = dateStr;
                  try {
                    formattedDate = new Date(dateStr).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });
                  } catch (e) {
                    formattedDate = String(dateStr);
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.user_name || log.user_email || log.user_id || "System"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">{log.entity || log.entity_type || "—"}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ip_address || "127.0.0.1"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
