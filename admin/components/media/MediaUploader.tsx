"use client";

import React, { useState } from "react";
import { UploadCloud, File, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useMediaMutations } from "../../hooks/useMedia";
import { useToast } from "../ui/Toast";

export function MediaUploader() {
  const { toast } = useToast();
  const { uploadMedia, isUploading } = useMediaMutations();
  const [altText, setAltText] = useState("");
  const [folder, setFolder] = useState("general");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadMedia({ file: selectedFile, altText, folder });
      toast("File uploaded successfully!");
      setSelectedFile(null);
      setAltText("");
    } catch (err: any) {
      toast(err.message || "Failed to upload media file", "error");
    }
  };

  return (
    <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
        Upload New Media
      </h3>

      <div className="border-2 border-dashed border-navy-300 rounded-lg p-6 text-center hover:bg-navy-50/50 transition-colors">
        <UploadCloud className="mx-auto h-10 w-10 text-navy-400" />
        <p className="mt-2 text-xs font-semibold text-navy-800">
          Select image or document file (JPG, PNG, WebP, SVG, PDF)
        </p>
        <label className="mt-4 inline-block">
          <span className="inline-flex items-center rounded bg-navy-950 px-4 py-2 text-xs font-semibold text-white shadow cursor-pointer hover:bg-navy-900">
            Browse Files
          </span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
        {selectedFile && (
          <div className="mt-3 flex items-center justify-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded inline-flex">
            <File className="h-4 w-4" />
            <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Alt Text"
              placeholder="Descriptive image alternative text..."
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
            <Input
              label="Folder"
              placeholder="e.g. products, banners, site"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleUpload} isLoading={isUploading} className="w-full">
            Start Upload
          </Button>
        </div>
      )}
    </div>
  );
}
