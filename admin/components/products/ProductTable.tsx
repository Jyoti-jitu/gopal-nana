"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product, Category } from "../../lib/types/product";
import { StatusBadge } from "../ui/StatusBadge";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useProductMutations } from "../../hooks/useProducts";
import { useToast } from "../ui/Toast";
import { Search, Plus, Edit2, Copy, Globe, Eye, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react";

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
  const { deleteProduct, publishProduct, unpublishProduct, duplicateProduct, updateProduct } = useProductMutations();

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

  const handleToggleFeatured = async (prod: Product) => {
    try {
      await updateProduct({ id: prod.id, data: { featured: !prod.featured } });
      toast(`${prod.name} ${!prod.featured ? "marked as featured" : "unmarked as featured"}`);
    } catch (err: any) {
      toast(err.message || "Failed to update status", "error");
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
      {/* Search & Filter Toolbar matching Screen 3 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
          />
        </form>

        <div className="flex items-center gap-2">
          <Select
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((c) => ({ label: c.name, value: c.slug })),
            ]}
            className="text-xs py-1.5 min-w-[130px]"
          />

          <Select
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={[
              { label: "All Status", value: "" },
              { label: "Published", value: "published" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
            className="text-xs py-1.5 min-w-[110px]"
          />

          <Link href="/products/new">
            <Button variant="primary" size="sm" className="whitespace-nowrap rounded-lg">
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No Products Found</h3>
            <p className="mt-1 text-xs text-slate-500">
              No product matched your query criteria.
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
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="h-11 w-11 rounded-lg border border-slate-200 bg-white flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                        {p.images && p.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0].url} alt={p.name} className="h-full w-full object-contain" />
                        ) : (
                          <Package className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-[#0062E3] font-mono">{p.code}</td>
                    <td className="py-2.5 px-4">
                      <div>
                        <Link href={`/products/${p.id}`} className="font-bold text-slate-900 hover:text-[#0062E3] hover:underline">
                          {p.name}
                        </Link>
                        {p.tag && (
                          <span className="ml-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                            {p.tag}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{p.category?.name || "Earthing Electrodes"}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {/* Featured Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(p)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          p.featured ? "bg-[#0062E3]" : "bg-slate-200"
                        }`}
                        title={p.featured ? "Featured Product (click to toggle)" : "Not Featured"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            p.featured ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <Link
                        href={`/products/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <a
                        href={`${publicSiteUrl}/products/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="View on Website"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(p.id)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar matching Screen 3 */}
        {total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-500 font-medium">
            <span>
              Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} products
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-7 w-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`h-7 w-7 rounded text-xs font-bold transition-colors ${
                    page === i + 1
                      ? "bg-[#0062E3] text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-7 w-7 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
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
