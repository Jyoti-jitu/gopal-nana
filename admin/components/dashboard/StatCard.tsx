import React from "react";
import { clsx } from "clsx";

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  color?: "blue" | "green" | "amber" | "purple" | "indigo" | "rose" | "cyan" | "emerald";
}

export function StatCard({ title, value, subtitle, icon: Icon, color = "blue" }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    cyan: "bg-sky-50 text-sky-600 border-sky-100",
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:shadow-sm hover:border-slate-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">{value}</h3>
          {subtitle && <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>}
        </div>
        <div className={clsx("rounded-xl border p-2.5 flex-shrink-0 shadow-xs", colorStyles[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
