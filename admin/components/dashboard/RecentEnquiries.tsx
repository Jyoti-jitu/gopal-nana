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
  company?: string;
  status: string;
  created_at: string;
}

export function RecentEnquiries({ items = [] }: { items?: RecentEnquiryItem[] }) {
  const displayItems = items.length > 0 ? items : [
    { id: "1", name: "Rajesh Kumar", email: "rajesh@lnt.com", product: "GI Electrode", status: "new", created_at: "2026-09-05" },
    { id: "2", name: "Amit Sharma", email: "amit@global.in", product: "Copper Bonded", status: "contacted", created_at: "2026-09-04" },
    { id: "3", name: "Sandeep Mohanty", email: "sandeep@opgc.com", product: "Earthing Device", status: "in_progress", created_at: "2026-09-03" },
    { id: "4", name: "Vikram Aditya", email: "vikram@sunshine.org", product: "Lightning Arrester", status: "in_progress", created_at: "2026-09-02" },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Enquiries</h3>
            <p className="text-xs text-slate-500">Latest customer requests</p>
          </div>
          <Link
            href="/enquiries"
            className="text-xs font-semibold text-[#0062E3] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {displayItems.slice(0, 4).map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 hover:bg-slate-50/70 transition-colors rounded-lg px-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {item.name ? item.name[0].toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.company || item.product || item.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
