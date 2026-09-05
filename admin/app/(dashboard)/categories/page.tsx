"use client";

import React, { useState } from "react";
import { useCategories, useCategoryMutations } from "../../../hooks/useCategories";
import { Category } from "../../../lib/types/product";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { FolderTree, Plus, Edit2, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useCategories();
  const { createCategory, updateCategory, deleteCategory, isCreating, isUpdating } = useCategoryMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: { name: name.trim(), slug: slug.trim(), description: description.trim() },
        });
        toast("Category updated successfully");
      } else {
        await createCategory({
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: description.trim(),
        });
        toast("Category created successfully");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to save category", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCategory(deleteTargetId);
      toast("Category deleted");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete category", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Category Management</h2>
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Category Management</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage product categories for public website filtering.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center">
            <FolderTree className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Categories Found</h3>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-navy-950">{c.name}</td>
                  <td className="py-3 px-4 font-mono text-navy-600">{c.slug}</td>
                  <td className="py-3 px-4 text-navy-500">{c.description || "—"}</td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(c.id)}
                      className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Create Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Category Name *"
            placeholder="e.g. Earthing Electrodes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Slug"
            placeholder="e.g. earthing-electrodes"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Category overview..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-navy-300 p-2 text-xs focus:outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
}
