"use client";

import React, { useState } from "react";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { Input } from "../../../components/ui/Input";
import { ShieldCheck, Search, FileText } from "lucide-react";

export default function AuditLogsPage() {
  const [userFilter, setUserFilter] = useState("");
  const { data: logs = [], isLoading } = useAuditLogs({ user: userFilter });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">System Audit Trail</h2>
        <TableSkeleton rows={10} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">System Audit Trail & Log History</h2>
          <p className="text-xs text-navy-500 font-medium">
            Read-only chronological audit log of all administrator actions.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
          <Input
            placeholder="Filter by user email..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Audit Logs Found</h3>
            <p className="mt-1 text-xs text-navy-500">Actions taken in the system will automatically appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3 px-4 text-navy-500 font-mono text-[10px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-navy-950">{log.user_name || log.user_email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-navy-700">{log.entity}</td>
                  <td className="py-3 px-4 font-mono text-navy-400 text-[10px]">{log.ip_address || "127.0.0.1"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
