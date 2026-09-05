"use client";

import React from "react";
import Link from "next/link";
import { usePages } from "../../../hooks/usePages";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { FileText, Edit2, Eye } from "lucide-react";

export default function PagesIndexPage() {
  const { data: pages = [], isLoading } = usePages();

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  const defaultPages = [
    { title: "Home Page", slug: "home", description: "Hero, Trust strip, Product range & CTA sections" },
    { title: "About Us", slug: "about", description: "Company profile, vision, mission, and engineering values" },
    { title: "Installation Guide", slug: "installation", description: "7-step interactive installation workflow" },
    { title: "Contact Us", slug: "contact", description: "Inquiry form, office locations & contact info" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Page CMS Management</h2>
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Page Content Management</h2>
          <p className="text-xs text-navy-500 font-medium">
            Visual block CMS editors for public website landing pages.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {defaultPages.map((p) => {
          const livePage = pages.find((item) => item.slug === p.slug);
          const status = livePage?.status || "published";

          return (
            <div
              key={p.slug}
              className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-brand" />
                    <h3 className="text-base font-bold text-navy-950">{p.title}</h3>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p className="mt-2 text-xs text-navy-600 leading-relaxed">{p.description}</p>
                <p className="mt-1 text-[10px] font-mono text-navy-400">Route: /{p.slug === "home" ? "" : p.slug}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4">
                <a
                  href={`${publicSiteUrl}/${p.slug === "home" ? "" : p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-xs font-semibold text-navy-600 hover:text-navy-950"
                >
                  <Eye className="mr-1 h-3.5 w-3.5" /> Preview Page
                </a>

                <Link
                  href={`/pages/${p.slug}`}
                  className="inline-flex items-center rounded bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-navy-900"
                >
                  <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Open CMS Editor
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
