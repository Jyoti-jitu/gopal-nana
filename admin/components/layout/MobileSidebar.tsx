"use client";

import React from "react";
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
  X,
} from "lucide-react";
import { clsx } from "clsx";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", resource: "dashboard" as AdminResource, icon: LayoutDashboard },
  { label: "Products", href: "/products", resource: "products" as AdminResource, icon: Package },
  { label: "Categories", href: "/categories", resource: "categories" as AdminResource, icon: FolderTree },
  { label: "Pages", href: "/pages", resource: "pages" as AdminResource, icon: FileText },
  { label: "Installation", href: "/installation", resource: "installation" as AdminResource, icon: Wrench },
  { label: "Testimonials", href: "/testimonials", resource: "testimonials" as AdminResource, icon: MessageSquareQuote },
  { label: "Media Library", href: "/media", resource: "media" as AdminResource, icon: ImageIcon },
  { label: "Enquiries", href: "/enquiries", resource: "enquiries" as AdminResource, icon: Inbox },
  { label: "Offices", href: "/offices", resource: "offices" as AdminResource, icon: Building2 },
  { label: "Navigation", href: "/navigation", resource: "navigation" as AdminResource, icon: NavIcon },
  { label: "Settings", href: "/settings", resource: "settings" as AdminResource, icon: Settings },
  { label: "Users", href: "/users", resource: "users" as AdminResource, icon: Users },
  { label: "Audit Logs", href: "/audit-logs", resource: "audit-logs" as AdminResource, icon: ShieldCheck },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!isOpen) return null;

  const visibleItems = NAV_ITEMS.filter((item) =>
    canAccessResource(user?.role, item.resource)
  );

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#08172c] text-white shadow-xl z-10 border-r border-[#122a4d]">
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#122a4d]">
          <div className="flex items-center space-x-2.5">
            <div className="h-7 w-7 rounded-full bg-blue-700 flex items-center justify-center text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="9" stroke="#60A5FA" strokeWidth="2" />
                <path d="M7 12a5 5 0 0 1 10 0" stroke="#EF4444" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xs tracking-wider text-white uppercase block">
                FORECAST
              </span>
              <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-widest block">
                EARTHINGS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-[#0062E3] text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-300 hover:bg-[#0f2442] hover:text-white"
                )}
              >
                <Icon className={clsx("h-4 w-4", isActive ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
