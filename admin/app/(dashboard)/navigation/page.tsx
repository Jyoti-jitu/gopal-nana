"use client";

import React, { useState, useEffect } from "react";
import { useNavigation, useNavigationMutations } from "../../../hooks/useNavigation";
import { NavigationItem } from "../../../lib/types/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Navigation as NavIcon, Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";

export default function NavigationPage() {
  const { toast } = useToast();
  const { data: menus = [], isLoading } = useNavigation();
  const { updateNavigation, isUpdating } = useNavigationMutations();

  const [headerItems, setHeaderItems] = useState<NavigationItem[]>([
    { label: "Home", url: "/", enabled: true, display_order: 1 },
    { label: "About Us", url: "/about", enabled: true, display_order: 2 },
    { label: "Products", url: "/products", enabled: true, display_order: 3 },
    { label: "Installation", url: "/installation", enabled: true, display_order: 4 },
    { label: "Contact", url: "/contact", enabled: true, display_order: 5 },
  ]);

  useEffect(() => {
    if (menus.length > 0) {
      const headerMenu = menus.find((m) => m.location === "header");
      if (headerMenu?.items) setHeaderItems(headerMenu.items);
    }
  }, [menus]);

  const handleAddItem = () => {
    setHeaderItems([
      ...headerItems,
      { label: "New Menu Link", url: "/", enabled: true, display_order: headerItems.length + 1 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setHeaderItems(headerItems.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof NavigationItem, val: any) => {
    const updated = headerItems.map((item, i) => (i === index ? { ...item, [field]: val } : item));
    setHeaderItems(updated);
  };

  const handleSave = async () => {
    try {
      await updateNavigation({ location: "header", items: headerItems });
      toast("Header Navigation menu saved!");
    } catch (err: any) {
      toast(err.message || "Failed to save navigation", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Navigation Menu Manager</h2>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Header & Footer Navigation Menus</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage public website navigation links, labels, and URL targets.
          </p>
        </div>

        <Button variant="primary" onClick={handleSave} isLoading={isUpdating}>
          <Save className="mr-1.5 h-4 w-4" /> Save Navigation Menu
        </Button>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-navy-100 pb-3">
          <div className="flex items-center space-x-2">
            <NavIcon className="h-5 w-5 text-brand" />
            <h3 className="text-sm font-bold text-navy-950">Header Navigation Menu</h3>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddItem}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Menu Item
          </Button>
        </div>

        <div className="space-y-3">
          {headerItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 rounded bg-navy-50 p-3 border border-navy-200">
              <div className="w-1/3">
                <Input
                  label="Menu Label"
                  value={item.label}
                  onChange={(e) => handleChange(idx, "label", e.target.value)}
                  className="text-xs py-1"
                />
              </div>

              <div className="flex-1">
                <Input
                  label="Target URL"
                  value={item.url}
                  onChange={(e) => handleChange(idx, "url", e.target.value)}
                  className="text-xs py-1"
                />
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => handleChange(idx, "enabled", !item.enabled)}
                  className={`flex items-center space-x-1 rounded px-2 py-1.5 text-xs font-semibold ${
                    item.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {item.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{item.enabled ? "Enabled" : "Hidden"}</span>
                </button>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
