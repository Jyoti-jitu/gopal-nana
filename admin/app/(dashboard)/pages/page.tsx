"use client";

import React from "react";
import Link from "next/link";
import { usePages } from "../../../hooks/usePages";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { Edit2, Eye } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function PagesIndexPage() {
  const { data: pages = [], isLoading } = usePages();

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  const defaultPages = [
    {
      title: "Home Page",
      slug: "home",
      description: "Edit homepage sections and content",
      image: getCloudinaryUrl("/images/hero/home-hero-banner.jpg"),
    },
    {
      title: "About Page",
      slug: "about",
      description: "Company information and values",
      image: getCloudinaryUrl("/images/about/about-corporate-overview.jpg"),
    },
    {
      title: "Installation Page",
      slug: "installation",
      description: "Installation steps and guide",
      image: getCloudinaryUrl("/images/installation/step1.jpg"),
    },
    {
      title: "Contact Page",
      slug: "contact",
      description: "Office details and contact information",
      image: getCloudinaryUrl("/images/contact/contact-hero-banner.jpg"),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Website Pages</h2>
        <TableSkeleton rows={4} cols={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching Screen 6 */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Website Pages</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage content for all pages
        </p>
      </div>

      {/* 2x2 Grid of Image Cards matching Screen 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultPages.map((p) => {
          const livePage = pages.find((item) => item.slug === p.slug);
          const status = livePage?.status || "published";

          return (
            <div
              key={p.slug}
              className="group rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Banner Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-base font-bold text-white drop-shadow-sm">{p.title}</h3>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <p className="text-xs text-slate-500 font-medium">{p.description}</p>
                </div>
              </div>

              {/* Bottom Card Action Strip */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={status} />

                <div className="flex items-center space-x-2">
                  <a
                    href={`${publicSiteUrl}/${p.slug === "home" ? "" : p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5 text-slate-400" /> Preview
                  </a>
                  <Link
                    href={`/pages/${p.slug}`}
                    className="inline-flex items-center rounded-lg border border-[#0062E3] bg-white px-3 py-1 text-xs font-bold text-[#0062E3] hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    <Edit2 className="mr-1.5 h-3 w-3" /> Edit Content
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
