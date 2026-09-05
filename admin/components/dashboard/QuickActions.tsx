import React from "react";
import Link from "next/link";
import { PlusCircle, UploadCloud, Edit, Inbox } from "lucide-react";

export function QuickActions() {
  const actions = [
    { label: "Add Product", href: "/products/new", icon: PlusCircle, bg: "bg-blue-600 hover:bg-blue-700" },
    { label: "Upload Media", href: "/media", icon: UploadCloud, bg: "bg-purple-600 hover:bg-purple-700" },
    { label: "Edit Homepage", href: "/pages/home", icon: Edit, bg: "bg-emerald-600 hover:bg-emerald-700" },
    { label: "View Enquiries", href: "/enquiries", icon: Inbox, bg: "bg-navy-800 hover:bg-navy-900" },
  ];

  return (
    <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              href={act.href}
              className={`flex flex-col items-center justify-center rounded-lg p-4 text-white shadow transition-transform hover:-translate-y-0.5 ${act.bg}`}
            >
              <Icon className="h-6 w-6 mb-2" />
              <span className="text-xs font-semibold text-center">{act.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
