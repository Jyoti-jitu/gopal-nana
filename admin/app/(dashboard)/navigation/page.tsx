"use client";

import React, { useState, useEffect } from "react";
import { useNavigation, useNavigationMutations } from "../../../hooks/useNavigation";
import { NavigationItem } from "../../../lib/types/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Plus, Edit2, Trash2, Save } from "lucide-react";

export default function NavigationPage() {
  const { toast } = useToast();
  const { data: menus = [], isLoading } = useNavigation();
  const { updateNavigation, isUpdating } = useNavigationMutations();

  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [itemLabel, setItemLabel] = useState("");
  const [itemUrl, setItemUrl] = useState("");

  const [headerItems, setHeaderItems] = useState<NavigationItem[]>([
    { label: "Home", url: "/", enabled: true, display_order: 1 },
    { label: "About", url: "/about", enabled: true, display_order: 2 },
    { label: "Products", url: "/products", enabled: true, display_order: 3 },
    { label: "Installation", url: "/installation", enabled: true, display_order: 4 },
    { label: "Contact", url: "/contact", enabled: true, display_order: 5 },
  ]);

  const [footerItems, setFooterItems] = useState<NavigationItem[]>([
    { label: "Privacy Policy", url: "/privacy", enabled: true, display_order: 1 },
    { label: "Terms of Service", url: "/terms", enabled: true, display_order: 2 },
    { label: "Certifications", url: "/about#certifications", enabled: true, display_order: 3 },
  ]);

  useEffect(() => {
    if (menus.length > 0) {
      const h = menus.find((m) => m.location === "header");
      if (h?.items && h.items.length > 0) setHeaderItems(h.items);
      const f = menus.find((m) => m.location === "footer");
      if (f?.items && f.items.length > 0) setFooterItems(f.items);
    }
  }, [menus]);

  const currentItems = activeTab === "header" ? headerItems : footerItems;
  const setCurrentItems = activeTab === "header" ? setHeaderItems : setFooterItems;

  const handleOpenAdd = () => {
    setEditIndex(null);
    setItemLabel("");
    setItemUrl("/");
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number) => {
    setEditIndex(index);
    setItemLabel(currentItems[index].label);
    setItemUrl(currentItems[index].url);
    setModalOpen(true);
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemLabel.trim()) return;

    if (editIndex !== null) {
      const updated = currentItems.map((item, i) =>
        i === editIndex ? { ...item, label: itemLabel.trim(), url: itemUrl.trim() } : item
      );
      setCurrentItems(updated);
    } else {
      const newItem: NavigationItem = {
        label: itemLabel.trim(),
        url: itemUrl.trim() || "/",
        enabled: true,
        display_order: currentItems.length + 1,
      };
      setCurrentItems([...currentItems, newItem]);
    }
    setModalOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    setCurrentItems(currentItems.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      await updateNavigation({ location: activeTab, items: currentItems });
      toast(`${activeTab === "header" ? "Header" : "Footer"} navigation menu saved!`);
    } catch (err: any) {
      toast(err.message || "Failed to save navigation", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Navigation Management</h2>
        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching Screen 10 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Navigation Management</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage header and footer navigation menus
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleSave} isLoading={isUpdating}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
          </Button>
          <Button variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Menu Item
          </Button>
        </div>
      </div>

      {/* Tabs matching Screen 10 */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("header")}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "header"
              ? "bg-[#0062E3] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Header Menu
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("footer")}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "footer"
              ? "bg-[#0062E3] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Footer Menu
        </button>
      </div>

      {/* Table matching Screen 10 */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12">#</th>
              <th className="py-3 px-4">Label</th>
              <th className="py-3 px-4">URL</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Order</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
            {currentItems.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{item.label}</td>
                <td className="py-3 px-4 font-mono text-[#0062E3]">{item.url}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={item.enabled ? "published" : "draft"} />
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-500">{item.display_order || index + 1}</td>
                <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenEdit(index)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Menu Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editIndex !== null ? "Edit Menu Link" : "Add Menu Item"}
      >
        <form onSubmit={handleModalSave} className="space-y-4">
          <Input
            label="Menu Label *"
            placeholder="e.g. Products"
            value={itemLabel}
            onChange={(e) => setItemLabel(e.target.value)}
            required
          />
          <Input
            label="Target URL *"
            placeholder="e.g. /products"
            value={itemUrl}
            onChange={(e) => setItemUrl(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
