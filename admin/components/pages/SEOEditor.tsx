"use client";

import React from "react";
import { SEOData } from "../../lib/types/product";
import { Input } from "../ui/Input";

interface SEOEditorProps {
  seo?: SEOData;
  onChange: (seo: SEOData) => void;
}

export function SEOEditor({ seo = {}, onChange }: SEOEditorProps) {
  const handleChange = (field: keyof SEOData, val: any) => {
    onChange({ ...seo, [field]: val });
  };

  return (
    <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
        Page SEO & Metadata
      </h3>

      <Input
        label="Page Title Tag"
        placeholder="Custom Title for Browser Tab & Google..."
        value={seo.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
          Meta Description
        </label>
        <textarea
          rows={3}
          placeholder="Brief description snippet for search engines..."
          value={seo.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:border-navy-700 focus:outline-none"
        />
      </div>

      <Input
        label="Open Graph Image URL (Social Preview)"
        placeholder="e.g. /images/og-image.jpg"
        value={seo.og_image || ""}
        onChange={(e) => handleChange("og_image", e.target.value)}
      />
    </div>
  );
}
