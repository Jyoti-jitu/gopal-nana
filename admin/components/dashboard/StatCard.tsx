import React from "react";
import { clsx } from "clsx";

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  color?: "blue" | "green" | "amber" | "purple" | "indigo" | "rose";
}

export function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="rounded-lg border border-navy-200 bg-white p-5 shadow-sm transition-all hover:shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-navy-950">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-navy-500 font-medium">{subtitle}</p>}
        </div>
        <div className={clsx("rounded-lg border p-3", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
