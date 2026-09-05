"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { AdminSidebar } from "../../components/layout/AdminSidebar";
import { AdminHeader } from "../../components/layout/AdminHeader";
import { MobileSidebar } from "../../components/layout/MobileSidebar";
import { Skeleton } from "../../components/ui/Skeleton";
import { Shield, Globe, Lock, Sliders, Zap } from "lucide-react";

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
      <div className="flex h-screen w-full items-center justify-center bg-[#08172c] p-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      <AdminSidebar />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* Bottom Feature & Security Strip from Reference Design */}
        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] font-medium text-slate-600">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-blue-600" /> Reliable Content Management</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-emerald-600" /> Easy to Use</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-amber-600" /> Secure Access</span>
              <span className="flex items-center gap-1.5"><Sliders className="h-3.5 w-3.5 text-purple-600" /> Complete Control</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-blue-500" /> Built for a Safer Tomorrow</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
              <span>FORECAST EARTHINGS PVT. LTD.</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">Chalo Banaye Behtar Bharat 🇮🇳</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
