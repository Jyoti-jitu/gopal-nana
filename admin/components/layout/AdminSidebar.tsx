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
  Shield,
} from "lucide-react";
import { clsx } from "clsx";

interface NavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    resource: AdminResource;
    icon: React.ElementType;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", resource: "dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Products", href: "/products", resource: "products", icon: Package },
      { label: "Categories", href: "/categories", resource: "categories", icon: FolderTree },
      { label: "Pages", href: "/pages", resource: "pages", icon: FileText },
      { label: "Installation", href: "/installation", resource: "installation", icon: Wrench },
      { label: "Testimonials", href: "/testimonials", resource: "testimonials", icon: MessageSquareQuote },
    ],
  },
  {
    title: "MEDIA",
    items: [
      { label: "Media Library", href: "/media", resource: "media", icon: ImageIcon },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Enquiries", href: "/enquiries", resource: "enquiries", icon: Inbox },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { label: "Offices", href: "/offices", resource: "offices", icon: Building2 },
      { label: "Navigation", href: "/navigation", resource: "navigation", icon: NavIcon },
      { label: "Settings", href: "/settings", resource: "settings", icon: Settings },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", href: "/users", resource: "users", icon: Users },
      { label: "Audit Logs", href: "/audit-logs", resource: "audit-logs", icon: ShieldCheck },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "hidden md:flex flex-col bg-navy-950 text-white transition-all duration-300 z-30 border-r border-navy-900 sticky top-0 h-screen",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-navy-900 bg-navy-950">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-brand-light flex-shrink-0" />
            <div>
              <h1 className="text-xs font-bold uppercase tracking-wider text-white leading-none">
                FORECAST EARTHINGS
              </h1>
              <span className="text-[10px] font-semibold tracking-widest text-navy-400">
                ADMIN PANEL
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <Shield className="h-6 w-6 text-brand-light mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded p-1 text-navy-400 hover:bg-navy-900 hover:text-white transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-thin">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) =>
            canAccessResource(user?.role, item.resource)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-2">
                  {group.title}
                </h3>
              )}
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
                      "flex items-center space-x-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand text-white shadow-sm"
                        : "text-navy-300 hover:bg-navy-900 hover:text-white"
                    )}
                  >
                    <Icon className={clsx("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-navy-400")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer User Badge */}
      {!collapsed && user && (
        <div className="p-4 border-t border-navy-900 bg-navy-950/80">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white text-xs">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user.name || user.email}</p>
              <p className="text-[10px] font-medium text-navy-400 uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
