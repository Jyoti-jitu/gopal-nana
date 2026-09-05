import React from "react";
import Link from "next/link";
import { StatusBadge } from "../ui/StatusBadge";
import { ArrowRight, Inbox } from "lucide-react";

export interface RecentEnquiryItem {
  id: string;
  name: string;
  email: string;
  subject?: string;
  product?: string;
  status: string;
  created_at: string;
}

export function RecentEnquiries({ items = [] }: { items?: RecentEnquiryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm text-center">
        <Inbox className="mx-auto h-8 w-8 text-navy-400" />
        <p className="mt-2 text-sm font-medium text-navy-600">No customer enquiries submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-navy-100 bg-navy-50/50 px-6 py-4">
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Recent Enquiries</h3>
        <Link
          href="/enquiries"
          className="flex items-center text-xs font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-navy-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-navy-50/50 transition-colors">
            <div className="overflow-hidden pr-4">
              <p className="text-sm font-semibold text-navy-900 truncate">{item.name}</p>
              <p className="text-xs text-navy-500 truncate">{item.email} {item.product && `• ${item.product}`}</p>
            </div>
            <div className="flex items-center space-x-4 flex-shrink-0">
              <StatusBadge status={item.status} />
              <Link
                href={`/enquiries/${item.id}`}
                className="text-xs font-semibold text-navy-700 hover:text-navy-950 underline"
              >
                Review
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
