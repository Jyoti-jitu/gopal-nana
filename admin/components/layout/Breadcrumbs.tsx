"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || (segments.length === 1 && segments[0] === "dashboard")) {
    return (
      <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-navy-600">
        <Home className="h-4 w-4 text-navy-500" />
        <span>Dashboard</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-2 text-xs font-medium text-navy-600">
      <Link href="/dashboard" className="flex items-center hover:text-navy-900 transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = segment.replace(/-/g, " ");

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5 text-navy-400" />
            {isLast ? (
              <span className="font-semibold text-navy-900 capitalize">{label}</span>
            ) : (
              <Link href={href} className="hover:text-navy-900 transition-colors capitalize">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
