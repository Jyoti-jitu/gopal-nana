"use client";

import React from "react";
import { useDashboard } from "../../../hooks/useDashboard";
import { StatCard } from "../../../components/dashboard/StatCard";
import { RecentEnquiries } from "../../../components/dashboard/RecentEnquiries";
import { RecentActivity } from "../../../components/dashboard/RecentActivity";
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
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  const counts = data?.counts || {
    total_products: 9,
    published_products: 9,
    draft_products: 0,
    categories: 4,
    new_enquiries: 0,
    total_enquiries: 0,
    media_files: 9,
    testimonials: 10,
  };

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="Total Products" value={counts.total_products} icon={Package} color="blue" />
        <StatCard title="Published Live" value={counts.published_products} icon={CheckCircle2} color="green" />
        <StatCard title="Draft Items" value={counts.draft_products} icon={FileEdit} color="amber" />
        <StatCard title="Categories" value={counts.categories} icon={FolderTree} color="purple" />
        <StatCard title="New Enquiries" value={counts.new_enquiries} subtitle={`Total: ${counts.total_enquiries}`} icon={Inbox} color="rose" />
        <StatCard title="Media Files" value={counts.media_files} icon={ImageIcon} color="indigo" />
        <StatCard title="Testimonials" value={counts.testimonials} icon={MessageSquareQuote} color="green" />
        <StatCard title="System Activity" value="Active" icon={Activity} color="blue" />
      </div>

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Bottom Grid: Recent Enquiries & System Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentEnquiries items={data?.recent_enquiries} />
        <RecentActivity items={data?.recent_activity} />
      </div>
    </div>
  );
}
