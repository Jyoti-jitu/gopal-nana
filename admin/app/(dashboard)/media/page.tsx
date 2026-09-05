"use client";

import React, { useState } from "react";
import { useMedia } from "../../../hooks/useMedia";
import { MediaGrid } from "../../../components/media/MediaGrid";
import { MediaUploader } from "../../../components/media/MediaUploader";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { Button } from "../../../components/ui/Button";
import { Search, UploadCloud } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "images" | "documents" | "videos">("all");
  const [showUploader, setShowUploader] = useState(false);

  const mimeFilter = activeTab === "images" ? "image/" : activeTab === "documents" ? "application/pdf" : undefined;
  const { data: rawMedia, isLoading } = useMedia({ search, mime_type: mimeFilter });
  const mediaList = Array.isArray(rawMedia) ? rawMedia : (rawMedia as any)?.items || [];

  // Default demonstration files matching Screen 11 if library is empty
  const demoFiles = [
    { id: "demo-1", url: getCloudinaryUrl("/images/products/gi-earthing-electrode.svg"), original_name: "gi-electrode.jpg", mime_type: "image/jpeg", size_bytes: 84200 },
    { id: "demo-2", url: getCloudinaryUrl("/images/about/about-corporate-overview.jpg"), original_name: "office-building.jpg", mime_type: "image/jpeg", size_bytes: 142000 },
    { id: "demo-3", url: getCloudinaryUrl("/images/hero/home-hero-banner.jpg"), original_name: "lightning-trip.jpg", mime_type: "image/jpeg", size_bytes: 320000 },
    { id: "demo-4", url: getCloudinaryUrl("/images/installation/step1.jpg"), original_name: "installation.jpg", mime_type: "image/jpeg", size_bytes: 215000 },
    { id: "demo-5", url: getCloudinaryUrl("/images/products/pit-cover.svg"), original_name: "pit-cover.jpg", mime_type: "image/jpeg", size_bytes: 65000 },
    { id: "demo-6", url: getCloudinaryUrl("/images/products/backfill-compound.svg"), original_name: "backfill-compound.jpg", mime_type: "image/jpeg", size_bytes: 98000 },
    { id: "demo-7", url: getCloudinaryUrl("/images/products/ese-lightning-arrester.svg"), original_name: "ese-arrester.jpg", mime_type: "image/jpeg", size_bytes: 112000 },
    { id: "demo-8", url: getCloudinaryUrl("/images/products/pure-copper-electrode.svg"), original_name: "product-catalog.pdf", mime_type: "application/pdf", size_bytes: 1450000 },
  ];

  const displayList = mediaList.length > 0 ? mediaList : demoFiles;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Media Library</h2>
        <TableSkeleton rows={6} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching Screen 11 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Media Library</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Upload and manage images, documents and files
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploader(!showUploader)}
        >
          <UploadCloud className="mr-1.5 h-4 w-4" />
          {showUploader ? "Close Uploader" : "Upload Files"}
        </Button>
      </div>

      {showUploader && (
        <div className="transition-all animate-fadeIn">
          <MediaUploader />
        </div>
      )}

      {/* Filter Toolbar matching Screen 11 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Tabs: All, Images, Documents, Videos */}
        <div className="flex items-center space-x-1">
          {[
            { id: "all", label: "All" },
            { id: "images", label: "Images" },
            { id: "documents", label: "Documents" },
            { id: "videos", label: "Videos" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#0062E3] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="space-y-2">
        <MediaGrid mediaList={displayList} />
      </div>
    </div>
  );
}
