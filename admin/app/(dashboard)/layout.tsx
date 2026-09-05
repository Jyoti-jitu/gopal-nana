"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { AdminHeader } from "../../components/layout/AdminHeader";
import { MobileSidebar } from "../../components/layout/MobileSidebar";
import { Skeleton } from "../../components/ui/Skeleton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-navy-950 p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto bg-navy-800" />
          <Skeleton className="h-6 w-48 mx-auto bg-navy-800" />
          <Skeleton className="h-4 w-32 mx-auto bg-navy-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-navy-950">
      <AdminSidebar />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
