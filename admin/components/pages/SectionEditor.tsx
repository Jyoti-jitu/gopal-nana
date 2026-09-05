"use client";

import React from "react";
import { PageSection, SectionItem } from "../../lib/types/page";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface SectionEditorProps {
  section: PageSection;
  onChange: (section: PageSection) => void;
}

export function SectionEditor({ section, onChange }: SectionEditorProps) {
  const handleToggle = () => {
    onChange({ ...section, enabled: !section.enabled });
  };

  const handleTitleChange = (val: string) => {
    onChange({ ...section, title: val });
  };

  const handleSubtitleChange = (val: string) => {
    onChange({ ...section, subtitle: val });
  };

  const handleAddItem = () => {
    const items = section.items || [];
    onChange({
      ...section,
      items: [...items, { title: "", description: "", icon: "", image: "", url: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const items = section.items || [];
    onChange({
      ...section,
      items: items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof SectionItem, val: string) => {
    const items = section.items || [];
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: val } : item));
    onChange({ ...section, items: updated });
  };

  return (
    <div
      className={`rounded-lg border p-6 shadow-sm space-y-4 transition-colors ${
        section.enabled ? "bg-white border-navy-200" : "bg-navy-50/50 border-navy-200 opacity-75"
      }`}
    >
      <div className="flex items-center justify-between border-b border-navy-100 pb-3">
        <div className="flex items-center space-x-3">
          <span className="rounded bg-navy-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-navy-800">
            {section.section_type}
          </span>
          <h3 className="text-sm font-bold text-navy-950">{section.title || "Untitled Section"}</h3>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center space-x-1.5 rounded px-2.5 py-1 text-xs font-semibold ${
            section.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {section.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{section.enabled ? "Enabled" : "Disabled"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Section Title"
          value={section.title || ""}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
        <Input
          label="Section Subtitle / Eyebrow"
          value={section.subtitle || ""}
          onChange={(e) => handleSubtitleChange(e.target.value)}
        />
      </div>

      {/* Repeating Section Items (if applicable) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800">Section Content Cards / Items</h4>
          <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
          </Button>
        </div>

        {(!section.items || section.items.length === 0) ? (
          <p className="text-xs text-navy-500 italic">No item blocks defined for this section.</p>
        ) : (
          <div className="space-y-3">
            {section.items.map((item, idx) => (
              <div key={idx} className="rounded border border-navy-200 bg-navy-50 p-3 space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-navy-500 uppercase">Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    placeholder="Item Title"
                    value={item.title || ""}
                    onChange={(e) => handleItemChange(idx, "title", e.target.value)}
                    className="text-xs py-1"
                  />
                  <Input
                    placeholder="Lucide Icon or Image URL"
                    value={item.icon || item.image || ""}
                    onChange={(e) => handleItemChange(idx, "icon", e.target.value)}
                    className="text-xs py-1"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Item description..."
                  value={item.description || ""}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  className="w-full rounded border border-navy-300 p-2 text-xs text-navy-900 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
