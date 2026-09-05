"use client";

import React, { useState } from "react";
import { useMedia } from "../../../hooks/useMedia";
import { MediaGrid } from "../../../components/media/MediaGrid";
import { MediaUploader } from "../../../components/media/MediaUploader";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { Input } from "../../../components/ui/Input";
import { Search } from "lucide-react";

export default function MediaLibraryPage() {
  const [search, setSearch] = useState("");
  const { data: mediaList = [], isLoading } = useMedia({ search });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Media Library</h2>
        <TableSkeleton rows={6} cols={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Media Library & File Assets</h2>
          <p className="text-xs text-navy-500 font-medium">
            Upload and manage product drawings, diagrams, SVG graphics, and PDFs.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
          <Input
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      <MediaUploader />

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
          Uploaded Media Files ({mediaList.length})
        </h3>
        <MediaGrid mediaList={mediaList} />
      </div>
    </div>
  );
}
