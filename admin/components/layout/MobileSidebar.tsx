"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../lib/auth/auth-context";
import { canAccessResource } from "../../lib/auth/permissions";
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
  Shield,
} from "lucide-react";
import { clsx } from "clsx";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_GROUPS = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", resource: "dashboard" as const, icon: LayoutDashboard },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Products", href: "/products", resource: "products" as const, icon: Package },
      { label: "Categories", href: "/categories", resource: "categories" as const, icon: FolderTree },
      { label: "Pages", href: "/pages", resource: "pages" as const, icon: FileText },
      { label: "Installation", href: "/installation", resource: "installation" as const, icon: Wrench },
      { label: "Testimonials", href: "/testimonials", resource: "testimonials" as const, icon: MessageSquareQuote },
    ],
  },
  {
    title: "MEDIA",
    items: [
      { label: "Media Library", href: "/media", resource: "media" as const, icon: ImageIcon },
    ],
  },
  {
    title: "COMMUNICATION",
    items: [
      { label: "Enquiries", href: "/enquiries", resource: "enquiries" as const, icon: Inbox },
    ],
  },
  {
    title: "CONFIGURATION",
    items: [
      { label: "Offices", href: "/offices", resource: "offices" as const, icon: Building2 },
      { label: "Navigation", href: "/navigation", resource: "navigation" as const, icon: NavIcon },
      { label: "Settings", href: "/settings", resource: "settings" as const, icon: Settings },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { label: "Users", href: "/users", resource: "users" as const, icon: Users },
      { label: "Audit Logs", href: "/audit-logs", resource: "audit-logs" as const, icon: ShieldCheck },
    ],
  },
];

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative flex w-full max-w-xs flex-1 flex-col bg-navy-950 text-white shadow-xl z-10">
        <div className="flex h-16 items-center justify-between px-4 border-b border-navy-900">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-brand-light" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              FORECAST EARTHINGS
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-navy-400 hover:bg-navy-900 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter((item) =>
              canAccessResource(user?.role, item.resource)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-2">
                  {group.title}
                </h3>
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
                        "flex items-center space-x-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-brand text-white"
                          : "text-navy-300 hover:bg-navy-900 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
