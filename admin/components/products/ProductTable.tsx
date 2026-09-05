"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, Category } from "../../lib/types/product";
import { StatusBadge } from "../ui/StatusBadge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useProductMutations } from "../../hooks/useProducts";
import { useToast } from "../ui/Toast";
import { Search, Plus, Edit2, Copy, Globe, Eye, Trash2, Package } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onCategoryFilterChange: (category: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export function ProductTable({
  products,
  categories,
  total,
  page,
  limit,
  onPageChange,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
}: ProductTableProps) {
  const { toast } = useToast();
  const { deleteProduct, publishProduct, unpublishProduct, duplicateProduct } = useProductMutations();

  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(search);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteTargetId);
      toast("Product deleted successfully");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete product", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (prod: Product) => {
    try {
      if (prod.status === "published") {
        await unpublishProduct(prod.id);
        toast(`Unpublished ${prod.name}`);
      } else {
        await publishProduct(prod.id);
        toast(`Published ${prod.name}`);
      }
    } catch (err: any) {
      toast(err.message || "Action failed", "error");
    }
  };

  const handleDuplicate = async (prod: Product) => {
    try {
      await duplicateProduct(prod.id);
      toast(`Duplicated ${prod.name}`);
    } catch (err: any) {
      toast(err.message || "Failed to duplicate product", "error");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-navy-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-navy-400" />
            <Input
              placeholder="Search product name or code (e.g. 1-FEGI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <Select
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((c) => ({ label: c.name, value: c.slug })),
            ]}
            className="text-xs py-1.5"
          />

          <Select
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { label: "All Statuses", value: "" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
            className="text-xs py-1.5"
          />

          <Link href="/products/new">
            <Button variant="primary" size="sm" className="whitespace-nowrap">
              <Plus className="mr-1.5 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Products Found</h3>
            <p className="mt-1 text-xs text-navy-500">
              No product matched your query criteria or database is empty.
            </p>
            <Link href="/products/new" className="mt-4 inline-block">
              <Button variant="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" /> Create Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="h-10 w-10 rounded border border-navy-200 bg-white flex items-center justify-center p-1 overflow-hidden">
                        {p.images && p.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.name} className="h-full w-full object-contain" />
                        ) : (
                          <Package className="h-5 w-5 text-navy-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-brand">{p.code}</td>
                    <td className="py-3 px-4">
                      <div>
                        <Link href={`/products/${p.id}`} className="font-bold text-navy-950 hover:underline">
                          {p.name}
                        </Link>
                        {p.tag && (
                          <span className="ml-2 inline-block rounded bg-navy-100 px-1.5 py-0.5 text-[10px] text-navy-700 font-semibold">
                            {p.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-navy-600">{p.category?.name || "Uncategorized"}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-navy-500">{p.display_order}</td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <a
                        href={`${publicSiteUrl}/products/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 text-navy-500 hover:text-navy-950 hover:bg-navy-100 rounded"
                        title="View on Website"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleTogglePublish(p)}
                        className={`inline-flex p-1.5 rounded ${
                          p.status === "published"
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-amber-600 hover:bg-amber-50"
                        }`}
                        title={p.status === "published" ? "Unpublish" : "Publish Live"}
                      >
                        <Globe className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="inline-flex p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(p.id)}
                        className="inline-flex p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-navy-100 bg-navy-50/50 px-4 py-3 text-xs text-navy-600 font-semibold">
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} products
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
