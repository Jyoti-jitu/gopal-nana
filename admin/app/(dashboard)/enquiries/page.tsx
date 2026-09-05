"use client";

import React, { useState } from "react";
import { useEnquiries } from "../../../hooks/useEnquiries";
import { EnquiryTable } from "../../../components/enquiries/EnquiryTable";
import { TableSkeleton } from "../../../components/ui/Skeleton";

export default function EnquiriesListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useEnquiries({ page, limit: 10, search, status: status as any });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Customer Enquiries CRM</h2>
        <TableSkeleton rows={8} cols={6} />
      </div>
    );
  }

  const enquiries = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Customer Enquiries & Leads</h2>
          <p className="text-xs text-navy-500 font-medium">
            Review customer contact submissions, sales leads, and technical product inquiries.
          </p>
        </div>
      </div>

      <EnquiryTable
        enquiries={enquiries}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatus}
      />
    </div>
  );
}
