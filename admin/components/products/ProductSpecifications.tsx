"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export interface SpecRow {
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specs: SpecRow[];
  onChange: (specs: SpecRow[]) => void;
}

export function ProductSpecifications({ specs, onChange }: ProductSpecificationsProps) {
  const handleAdd = () => {
    onChange([...specs, { label: "", value: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleChange = (index: number, field: "label" | "value", text: string) => {
    const updated = specs.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: text };
      }
      return item;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800">
            Technical Specifications
          </h4>
          <p className="text-xs text-navy-500">
            Dynamic attributes (e.g. Material, Standard Lengths, Coating, Soil Suitability).
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Attribute
        </Button>
      </div>

      {specs.length === 0 ? (
        <div className="rounded-md border border-dashed border-navy-300 p-4 text-center text-xs text-navy-500">
          No technical specifications added yet. Click &quot;Add Attribute&quot; to define specifications.
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="w-1/3">
                <Input
                  placeholder="Label (e.g., Material)"
                  value={spec.label}
                  onChange={(e) => handleChange(idx, "label", e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Value (e.g., Hot Dip Galvanized Steel)"
                  value={spec.value}
                  onChange={(e) => handleChange(idx, "value", e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                title="Remove Specification"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
