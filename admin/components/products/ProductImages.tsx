"use client";

import React, { useState } from "react";
import { ProductImage } from "../../lib/types/product";
import { Plus, Trash2, Image as ImageIcon, Star } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useMediaMutations } from "../../hooks/useMedia";

interface ProductImagesProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export function ProductImages({ images, onChange }: ProductImagesProps) {
  const { uploadMedia, isUploading } = useMediaMutations();
  const [manualUrl, setManualUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadMedia({ file, folder: "products" });
      onChange([...images, { url: res.url, alt: res.original_name, media_id: res.id }]);
    } catch (err: any) {
      alert(err.message || "Failed to upload image.");
    }
  };

  const handleAddManual = () => {
    if (!manualUrl.trim()) return;
    onChange([...images, { url: manualUrl.trim(), alt: "Product Image" }]);
    setManualUrl("");
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  const handleAltChange = (index: number, alt: string) => {
    const updated = images.map((img, i) => (i === index ? { ...img, alt } : img));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800">Product Images</h4>
        <p className="text-xs text-navy-500">
          First image will be used as primary thumbnail. SVG, PNG, WebP supported.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative group rounded-lg border p-2 bg-navy-50 transition-all ${
              idx === 0 ? "border-brand ring-2 ring-brand/20" : "border-navy-200"
            }`}
          >
            <div className="relative aspect-square w-full rounded overflow-hidden bg-white flex items-center justify-center border border-navy-100">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.alt || "Product"} className="h-full w-full object-contain p-2" />
              ) : (
                <ImageIcon className="h-8 w-8 text-navy-300" />
              )}
              {idx === 0 && (
                <span className="absolute top-1 left-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                  Primary
                </span>
              )}
            </div>

            <div className="mt-2 space-y-1">
              <Input
                placeholder="Alt text"
                value={img.alt || ""}
                onChange={(e) => handleAltChange(idx, e.target.value)}
                className="text-xs py-1"
              />
              <div className="flex items-center justify-between pt-1">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="flex items-center text-[10px] font-semibold text-brand hover:underline"
                  >
                    <Star className="mr-1 h-3 w-3" /> Make Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="ml-auto text-[10px] font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end pt-2 border-t border-navy-100">
        <div className="w-full sm:w-auto">
          <label className="inline-flex items-center justify-center rounded border border-navy-300 bg-white px-3 py-2 text-xs font-semibold text-navy-800 cursor-pointer hover:bg-navy-50">
            <Plus className="mr-1.5 h-4 w-4 text-navy-600" />
            <span>Upload Image File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isUploading} className="hidden" />
          </label>
        </div>

        <div className="flex-1 flex gap-2 w-full">
          <Input
            placeholder="Or enter image URL (e.g. /images/products/gi-earthing-electrode.svg)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="text-xs"
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAddManual}>
            Add URL
          </Button>
        </div>
      </div>
    </div>
  );
}
