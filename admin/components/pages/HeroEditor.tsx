"use client";

import React from "react";
import { HeroConfig } from "../../lib/types/page";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface HeroEditorProps {
  hero: HeroConfig;
  onChange: (hero: HeroConfig) => void;
}

export function HeroEditor({ hero, onChange }: HeroEditorProps) {
  const handleChange = (field: keyof HeroConfig, value: any) => {
    onChange({ ...hero, [field]: value });
  };

  return (
    <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
        Hero Section Configuration
      </h3>

      <Input
        label="Eyebrow Tagline"
        placeholder="e.g. EARTHING SOLUTIONS FOR A SAFER WORLD"
        value={hero.eyebrow || ""}
        onChange={(e) => handleChange("eyebrow", e.target.value)}
      />

      <Input
        label="Headline / Title *"
        placeholder="e.g. Safety Today. A Safer Tomorrow."
        value={hero.title || ""}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
          Hero Description Paragraph *
        </label>
        <textarea
          rows={3}
          placeholder="Hero narrative description..."
          value={hero.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:border-navy-700 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Primary CTA Button Label"
          placeholder="e.g. Explore Products"
          value={hero.primary_cta_text || ""}
          onChange={(e) => handleChange("primary_cta_text", e.target.value)}
        />
        <Input
          label="Primary CTA Button URL"
          placeholder="e.g. /products"
          value={hero.primary_cta_url || ""}
          onChange={(e) => handleChange("primary_cta_url", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Secondary CTA Button Label"
          placeholder="e.g. Contact Engineering Team"
          value={hero.secondary_cta_text || ""}
          onChange={(e) => handleChange("secondary_cta_text", e.target.value)}
        />
        <Input
          label="Secondary CTA Button URL"
          placeholder="e.g. /contact"
          value={hero.secondary_cta_url || ""}
          onChange={(e) => handleChange("secondary_cta_url", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Hero Background / Side Image URL"
          placeholder="e.g. /images/hero-banner.webp"
          value={hero.hero_image || ""}
          onChange={(e) => handleChange("hero_image", e.target.value)}
        />
        <Select
          label="Text Alignment"
          value={hero.alignment || "left"}
          onChange={(e) => handleChange("alignment", e.target.value)}
          options={[
            { label: "Left Aligned", value: "left" },
            { label: "Center Aligned", value: "center" },
            { label: "Right Aligned", value: "right" },
          ]}
        />
      </div>
    </div>
  );
}
