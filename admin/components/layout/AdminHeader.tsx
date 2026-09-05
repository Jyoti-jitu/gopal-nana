"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth/auth-context";
import { Breadcrumbs } from "./Breadcrumbs";
import { Menu, LogOut, ExternalLink, User as UserIcon, Lock, Search, Bell, ChevronDown } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Quick Search Pill Bar */}
        <div className="relative hidden sm:block w-48 md:w-64 lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all outline-none"
          />
        </div>

        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* External Website Preview Button */}
        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
        >
          <span>View Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
        </a>

        {/* Notification Bell */}
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Notifications"
          onClick={() => alert("All systems operational. No unread alerts.")}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 rounded-full p-1 pl-2 hover:bg-slate-50 border border-slate-200 transition-all focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0062E3] to-blue-800 flex items-center justify-center font-bold text-white text-xs shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="hidden sm:block text-left pr-1">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {user?.role === "super_admin" ? "Super Admin" : user?.role || "Admin"}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block mr-1" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white py-1 shadow-xl ring-1 ring-black/5 z-50 border border-slate-200">
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {user?.role || "admin"}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Account Settings");
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Password settings");
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Lock className="mr-2 h-4 w-4 text-slate-400" />
                  Change Password
                </button>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
