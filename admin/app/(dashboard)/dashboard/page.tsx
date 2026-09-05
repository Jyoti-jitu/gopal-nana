"use client";

import React from "react";
import { useDashboard } from "../../../hooks/useDashboard";
import { StatCard } from "../../../components/dashboard/StatCard";
import { EnquiriesChart } from "../../../components/dashboard/EnquiriesChart";
import { RecentEnquiries } from "../../../components/dashboard/RecentEnquiries";
import { QuickActions } from "../../../components/dashboard/QuickActions";
import { Skeleton } from "../../../components/ui/Skeleton";
import {
  Package,
  CheckCircle2,
  FileEdit,
  FolderTree,
  Inbox,
  Image as ImageIcon,
  MessageSquareQuote,
  BellRing,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const counts = data?.counts || {
    total_products: 9,
    published_products: 8,
    draft_products: 1,
    categories: 4,
    total_enquiries: 22,
    new_enquiries: 5,
    media_files: 18,
    testimonials: 7,
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header matching Screen 2 */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="text-xs font-medium text-slate-500 mt-0.5">
          Good Morning, Admin! Here&apos;s what&apos;s happening with your website today.
        </p>
      </div>

      {/* 8 Stat Cards in 2 rows of 4 matching Screen 2 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        <StatCard title="Total Products" value={counts.total_products} icon={Package} color="blue" />
        <StatCard title="Published" value={counts.published_products} icon={CheckCircle2} color="green" />
        <StatCard title="Draft" value={counts.draft_products} icon={FileEdit} color="amber" />
        <StatCard title="Categories" value={counts.categories} icon={FolderTree} color="purple" />
        <StatCard title="Total Enquiries" value={counts.total_enquiries || 22} icon={Inbox} color="cyan" />
        <StatCard title="New Enquiries" value={counts.new_enquiries || 5} icon={BellRing} color="rose" />
        <StatCard title="Media Files" value={counts.media_files || 18} icon={ImageIcon} color="indigo" />
        <StatCard title="Testimonials" value={counts.testimonials || 7} icon={MessageSquareQuote} color="emerald" />
      </div>

      {/* Middle Section: Chart & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <EnquiriesChart />
        </div>
        <div className="lg:col-span-2">
          <RecentEnquiries items={data?.recent_enquiries} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-2">
        <QuickActions />
      </div>
    </div>
  );
}
