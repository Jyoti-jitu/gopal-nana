"use client";

import React from "react";
import { MediaItem } from "../../lib/types/media";
import { FileText, Image as ImageIcon, Trash2, Copy } from "lucide-react";
import { useToast } from "../ui/Toast";
import { useMediaMutations } from "../../hooks/useMedia";

interface MediaGridProps {
  mediaList: any[];
  onSelect?: (item: any) => void;
}

export function MediaGrid({ mediaList, onSelect }: MediaGridProps) {
  const { toast } = useToast();
  const { deleteMedia } = useMediaMutations();

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("Image URL copied to clipboard!");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deleteMedia(id);
      toast("Media item deleted");
    } catch (err: any) {
      toast(err.message || "Failed to delete media", "error");
    }
  };

  const safeList = Array.isArray(mediaList) ? mediaList : [];

  if (safeList.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
        <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-3 text-sm font-bold text-slate-900">No Media Files</h3>
        <p className="mt-1 text-xs text-slate-500">Upload media items to use them across products and pages.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
      {safeList.map((item) => {
        const isImage = item.mime_type?.startsWith("image/") || item.url?.match(/\.(jpg|jpeg|png|webp|svg)/i);
        const displayName = item.original_name || item.original_filename || item.filename || "file";
        const sizeKb = item.size_bytes ? (item.size_bytes / 1024).toFixed(0) : "120";

        return (
          <div
            key={item.id || displayName}
            onClick={() => onSelect && onSelect(item)}
            className="group relative flex flex-col rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition-all hover:shadow-md hover:border-slate-300 cursor-pointer overflow-hidden justify-between"
          >
            <div>
              {/* Media Thumbnail */}
              <div className="relative aspect-video w-full rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-2">
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={displayName}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <FileText className="h-10 w-10 text-slate-400" />
                )}
              </div>

              {/* File Info */}
              <div className="mt-2.5 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate" title={displayName}>
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {sizeKb} KB
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(item.url);
                }}
                className="text-[11px] font-semibold text-[#0062E3] hover:underline flex items-center"
              >
                <Copy className="mr-1 h-3 w-3" /> Copy URL
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id, displayName);
                }}
                className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                title="Delete Media"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
