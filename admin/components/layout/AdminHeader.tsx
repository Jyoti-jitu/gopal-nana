"use client";

import React, { useState } from "react";
import { useAuth } from "../../lib/auth/auth-context";
import { Breadcrumbs } from "./Breadcrumbs";
import { Menu, LogOut, ExternalLink, User as UserIcon, Lock } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-navy-200 bg-white px-4 md:px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="rounded p-2 text-navy-600 hover:bg-navy-100 md:hidden"
          aria-label="Open Mobile Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Breadcrumbs />
      </div>

      <div className="flex items-center space-x-4">
        {/* External Website Preview Button */}
        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center space-x-1.5 rounded-md border border-navy-200 bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-navy-100 transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="h-3.5 w-3.5 text-navy-500" />
        </a>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 rounded-full p-1 hover:bg-navy-50 transition-colors focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-navy-950 flex items-center justify-center font-semibold text-white text-xs">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-navy-900 leading-tight">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] font-medium text-navy-500 uppercase tracking-wider">
                {user?.role || "admin"}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 border border-navy-200">
              <div className="px-4 py-2.5 border-b border-navy-100 bg-navy-50">
                <p className="text-xs font-bold text-navy-900 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-200 text-navy-800">
                  Role: {user?.role}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Profile Settings module");
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  <UserIcon className="mr-2 h-4 w-4 text-navy-500" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert("Password Reset module");
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-medium text-navy-700 hover:bg-navy-50 transition-colors"
                >
                  <Lock className="mr-2 h-4 w-4 text-navy-500" />
                  Change Password
                </button>
              </div>
              <div className="border-t border-navy-100 py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="flex w-full items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
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
