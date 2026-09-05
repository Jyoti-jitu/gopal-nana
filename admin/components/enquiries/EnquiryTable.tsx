"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Enquiry, EnquiryStatus } from "../../lib/types/enquiry";
import { StatusBadge } from "../ui/StatusBadge";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useEnquiryMutations } from "../../hooks/useEnquiries";
import { useToast } from "../ui/Toast";
import { Search, Eye, Trash2, Inbox } from "lucide-react";

interface EnquiryTableProps {
  enquiries: Enquiry[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export function EnquiryTable({
  enquiries,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
}: EnquiryTableProps) {
  const { toast } = useToast();
  const { deleteEnquiry, updateStatus } = useEnquiryMutations();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(search);
  };

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    try {
      await updateStatus({ id, status });
      toast("Enquiry status updated");
    } catch (err: any) {
      toast(err.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEnquiry(deleteId);
      toast("Enquiry record deleted");
      setDeleteId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete enquiry", "error");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Search & Status Filter matching Screen 7 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="w-48">
          <Select
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { label: "All Status", value: "" },
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "In Progress", value: "in_progress" },
              { label: "Resolved", value: "resolved" },
              { label: "Spam", value: "spam" },
            ]}
            className="text-xs py-1.5"
          />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search enquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
          />
        </form>
      </div>

      {/* Table matching Screen 7 */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No Customer Enquiries Found</h3>
            <p className="mt-1 text-xs text-slate-500">No contact forms submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {enquiries.map((enq, index) => (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{(page - 1) * limit + index + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link href={`/enquiries/${enq.id}`} className="hover:text-[#0062E3] hover:underline">
                        {enq.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{enq.email}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {enq.company || "Individual Customer"}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {enq.product ? (
                        <span className="font-semibold text-[#0062E3]">{enq.product}</span>
                      ) : (
                        enq.subject || "General Inquiry"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={enq.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/enquiries/${enq.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Link>
                      <button
                        onClick={() => setDeleteId(enq.id)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry record?"
        confirmText="Delete"
      />
    </div>
  );
}
