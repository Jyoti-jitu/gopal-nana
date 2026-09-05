import React from "react";
import { clsx } from "clsx";

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase();

  const styles: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    published: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Published" },
    draft: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", dot: "bg-amber-500", label: "Draft" },
    archived: { bg: "bg-slate-100 border-slate-200", text: "text-slate-600", dot: "bg-slate-400", label: "Archived" },
    new: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500", label: "New" },
    contacted: { bg: "bg-purple-50 border-purple-200", text: "text-purple-700", dot: "bg-purple-500", label: "Contacted" },
    in_progress: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700", dot: "bg-sky-500", label: "In Progress" },
    resolved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Resolved" },
    spam: { bg: "bg-red-50 border-red-200", text: "text-red-700", dot: "bg-red-500", label: "Spam" },
    active: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500", label: "Active" },
    inactive: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", dot: "bg-rose-500", label: "Inactive" },
  };

  const current = styles[normalized] || {
    bg: "bg-slate-100 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
    label: status,
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        current.bg,
        current.text,
        className
      )}
    >
      <span className={clsx("mr-1.5 h-1.5 w-1.5 rounded-full", current.dot)} />
      {current.label}
    </span>
  );
}
