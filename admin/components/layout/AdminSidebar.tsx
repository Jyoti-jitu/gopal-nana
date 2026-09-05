"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { canAccessResource, AdminResource } from "../../lib/auth/permissions";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  FileText,
  Wrench,
  MessageSquareQuote,
  Image as ImageIcon,
  Inbox,
  Building2,
  Navigation as NavIcon,
  Settings,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  href: string;
  resource: AdminResource;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", resource: "dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", resource: "products", icon: Package },
  { label: "Categories", href: "/categories", resource: "categories", icon: FolderTree },
  { label: "Pages", href: "/pages", resource: "pages", icon: FileText },
  { label: "Installation", href: "/installation", resource: "installation", icon: Wrench },
  { label: "Testimonials", href: "/testimonials", resource: "testimonials", icon: MessageSquareQuote },
  { label: "Media Library", href: "/media", resource: "media", icon: ImageIcon },
  { label: "Enquiries", href: "/enquiries", resource: "enquiries", icon: Inbox },
  { label: "Offices", href: "/offices", resource: "offices", icon: Building2 },
  { label: "Navigation", href: "/navigation", resource: "navigation", icon: NavIcon },
  { label: "Settings", href: "/settings", resource: "settings", icon: Settings },
  { label: "Users", href: "/users", resource: "users", icon: Users },
  { label: "Audit Logs", href: "/audit-logs", resource: "audit-logs", icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) =>
    canAccessResource(user?.role, item.resource)
  );

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col bg-[#08172c] text-white transition-all duration-300 z-30 border-r border-[#122a4d] sticky top-0 h-screen",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#122a4d] bg-[#08172c]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2.5 overflow-hidden">
            {/* Forecast Spiral SVG Logo */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-700 to-slate-900 flex items-center justify-center p-1 flex-shrink-0 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-blue-600/30 rounded-full animate-pulse" />
              <svg className="w-6 h-6 text-white relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke="#60A5FA" strokeWidth="2" strokeDasharray="16 4" />
                <path d="M7 12a5 5 0 0 1 10 0" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xs font-black tracking-wider text-white uppercase leading-tight font-sans">
                FORECAST
              </h1>
              <span className="text-[9px] font-bold tracking-widest text-blue-400 uppercase block">
                EARTHINGS PVT. LTD.
              </span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" stroke="#60A5FA" strokeWidth="2" />
              <path d="M7 12a5 5 0 0 1 10 0" stroke="#EF4444" strokeWidth="2.5" />
            </svg>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={clsx(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#0062E3] text-white shadow-sm shadow-blue-500/20"
                  : "text-slate-300 hover:bg-[#0f2442] hover:text-white"
              )}
            >
              <Icon className={clsx("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-slate-400")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer User Badge */}
      {!collapsed && user && (
        <div className="p-3 border-t border-[#122a4d] bg-[#050f1d]/60">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name || user.email}</p>
              <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
