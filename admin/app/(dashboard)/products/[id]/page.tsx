"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useProduct } from "../../../../hooks/useProducts";
import { ProductForm } from "../../../../components/products/ProductForm";
import { Skeleton } from "../../../../components/ui/Skeleton";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: product, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <h3 className="text-sm font-bold">Product Not Found</h3>
        <p className="mt-1 text-xs">The requested product could not be loaded from FastAPI.</p>
      </div>
    );
  }

  return <ProductForm initialData={product} isEditing={true} />;
}
