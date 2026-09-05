"use client";

import React, { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { ProductTable } from "../../../components/products/ProductTable";
import { TableSkeleton } from "../../../components/ui/Skeleton";

export default function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useProducts({ page, limit: 10, search, category, status });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Product Management</h2>
        <TableSkeleton rows={8} cols={6} />
      </div>
    );
  }

  const products = data?.data?.items || [];
  const total = data?.data?.pagination?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Product Management</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage, edit, publish and reorder Forecast Earthings product catalogue.
          </p>
        </div>
      </div>

      <ProductTable
        products={products}
        categories={categories}
        total={total}
        page={page}
        limit={10}
        onPageChange={setPage}
        onSearchChange={setSearch}
        onCategoryFilterChange={setCategory}
        onStatusFilterChange={setStatus}
      />
    </div>
  );
}
