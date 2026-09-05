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
      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-navy-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
            <Input
              placeholder="Search name, email, phone or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </form>

        <div className="w-48">
          <Select
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { label: "All Statuses", value: "" },
              { label: "New", value: "new" },
              { label: "Contacted", value: "contacted" },
              { label: "In Progress", value: "in_progress" },
              { label: "Resolved", value: "resolved" },
              { label: "Spam", value: "spam" },
            ]}
            className="text-xs py-1.5"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {enquiries.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Customer Enquiries Found</h3>
            <p className="mt-1 text-xs text-navy-500">No contact forms submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Product / Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/enquiries/${enq.id}`} className="font-bold text-navy-950 hover:underline">
                        {enq.name}
                      </Link>
                      {enq.company && <p className="text-[10px] text-navy-500">{enq.company}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-navy-900 font-semibold">{enq.email}</p>
                      <p className="text-navy-500 text-[10px] font-mono">{enq.phone}</p>
                    </td>
                    <td className="py-3 px-4 text-navy-700 font-medium">
                      {enq.product ? (
                        <span className="font-semibold text-brand">{enq.product}</span>
                      ) : (
                        enq.subject || "General Inquiry"
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={enq.status}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                        options={[
                          { label: "New", value: "new" },
                          { label: "Contacted", value: "contacted" },
                          { label: "In Progress", value: "in_progress" },
                          { label: "Resolved", value: "resolved" },
                          { label: "Spam", value: "spam" },
                        ]}
                        className="text-xs py-1 px-2"
                      />
                    </td>
                    <td className="py-3 px-4 text-navy-500 text-[10px] whitespace-nowrap">
                      {new Date(enq.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Link
                        href={`/enquiries/${enq.id}`}
                        className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Enquiry"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(enq.id)}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="h-4 w-4" />
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
