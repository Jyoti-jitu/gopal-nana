"use client";

import React from "react";
import { MediaItem } from "../../lib/types/media";
import { FileText, Image as ImageIcon, Trash2, Copy } from "lucide-react";
import { useToast } from "../ui/Toast";
import { useMediaMutations } from "../../hooks/useMedia";

interface MediaGridProps {
  mediaList: MediaItem[];
  onSelect?: (item: MediaItem) => void;
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

  if (mediaList.length === 0) {
    return (
      <div className="rounded-lg border border-navy-200 bg-white p-12 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-navy-300" />
        <h3 className="mt-3 text-sm font-bold text-navy-900">No Media Files</h3>
        <p className="mt-1 text-xs text-navy-500">Upload media items to use them across products and page CMS.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {mediaList.map((item) => {
        const isImage = item.mime_type?.startsWith("image/");
        return (
          <div
            key={item.id}
            onClick={() => onSelect && onSelect(item)}
            className="group relative flex flex-col rounded-lg border border-navy-200 bg-white p-2 shadow-sm transition-all hover:shadow-md cursor-pointer overflow-hidden"
          >
            <div className="relative aspect-square w-full rounded bg-navy-50 border border-navy-100 overflow-hidden flex items-center justify-center">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt_text || item.original_name} className="h-full w-full object-contain p-1" />
              ) : (
                <FileText className="h-10 w-10 text-navy-400" />
              )}
            </div>

            <div className="mt-2 min-w-0">
              <p className="text-xs font-semibold text-navy-900 truncate" title={item.original_name}>
                {item.original_name}
              </p>
              <p className="text-[10px] text-navy-400 font-mono mt-0.5">
                {(item.size_bytes / 1024).toFixed(0)} KB
              </p>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-navy-100 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyUrl(item.url);
                }}
                className="text-[10px] font-semibold text-navy-600 hover:text-navy-950 flex items-center"
              >
                <Copy className="mr-1 h-3 w-3" /> Copy URL
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id, item.original_name);
                }}
                className="text-red-500 hover:text-red-700 p-1"
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
