"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Category, ContentStatus, ProductImage } from "../../lib/types/product";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { ProductSpecifications, SpecRow } from "./ProductSpecifications";
import { ProductImages } from "./ProductImages";
import { useCategories } from "../../hooks/useCategories";
import { useProductMutations } from "../../hooks/useProducts";
import { useToast } from "../ui/Toast";
import { ArrowLeft, Save, Globe, Eye, Plus, Trash2 } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const { createProduct, updateProduct, publishProduct, isCreating, isUpdating, isPublishing } = useProductMutations();

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [tag, setTag] = useState(initialData?.tag || "");
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);
  const [applications, setApplications] = useState<string[]>(initialData?.applications || [""]);
  const [specs, setSpecs] = useState<SpecRow[]>(
    initialData?.specifications?.map((s) => ({
      label: s.label,
      value: s.values?.value || s.values?.val || Object.values(s.values || {})[0] || "",
    })) || []
  );
  const [images, setImages] = useState<ProductImage[]>(initialData?.images || []);
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 1);
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || "draft");

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo?.description || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing || !slug) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!code.trim()) errs.code = "Product code is required";
    if (!name.trim()) errs.name = "Product name is required";
    if (!slug.trim()) errs.slug = "Slug is required";
    if (!categoryId) errs.category_id = "Category is required";
    if (!description.trim()) errs.description = "Description is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const preparePayload = (): Partial<Product> => {
    return {
      code: code.trim(),
      name: name.trim(),
      slug: slug.trim(),
      category_id: categoryId,
      tag: tag.trim() || undefined,
      short_description: shortDescription.trim() || undefined,
      description: description.trim(),
      features: features.map((f) => f.trim()).filter(Boolean),
      applications: applications.map((a) => a.trim()).filter(Boolean),
      specifications: specs.map((s) => ({
        label: s.label.trim(),
        values: { value: s.value.trim() },
      })),
      images,
      featured,
      display_order: Number(displayOrder) || 1,
      status,
      seo: {
        title: seoTitle.trim() || `${name} | Forecast Earthings`,
        description: seoDescription.trim() || shortDescription.trim(),
      },
    };
  };

  const handleSubmit = async (e: React.FormEvent, targetStatus?: ContentStatus) => {
    e.preventDefault();
    if (!validate()) {
      toast("Please fix form validation errors", "error");
      return;
    }

    const payload = preparePayload();
    if (targetStatus) payload.status = targetStatus;

    try {
      if (isEditing && initialData?.id) {
        await updateProduct({ id: initialData.id, data: payload });
        toast("Product updated successfully!");
      } else {
        const created = await createProduct(payload);
        toast("Product created successfully!");
        router.push(`/products/${created.id}`);
      }
    } catch (err: any) {
      toast(err.message || "Failed to save product", "error");
    }
  };

  const handlePublish = async () => {
    if (!initialData?.id) return;
    try {
      await publishProduct(initialData.id);
      setStatus("published");
      toast("Product published live!");
    } catch (err: any) {
      toast(err.message || "Failed to publish product", "error");
    }
  };

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div className="flex items-center space-x-3">
          <Button type="button" variant="outline" size="sm" onClick={() => router.push("/products")}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Products
          </Button>
          <h2 className="text-lg font-bold text-navy-950">
            {isEditing ? `Edit: ${initialData?.name}` : "Create New Product"}
          </h2>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {isEditing && slug && (
            <a
              href={`${publicSiteUrl}/products/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5 text-navy-500" /> View on Site
            </a>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, "draft")}
            isLoading={isCreating || isUpdating}
          >
            <Save className="mr-1.5 h-4 w-4" /> Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={(e) => (isEditing ? handlePublish() : handleSubmit(e, "published"))}
            isLoading={isCreating || isUpdating || isPublishing}
          >
            <Globe className="mr-1.5 h-4 w-4" /> Publish Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main 2-Column Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Box */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Basic Product Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Code *"
                placeholder="e.g. 1-FEGI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={errors.code}
              />

              <Input
                label="Product Name *"
                placeholder="e.g. GI Earthing Electrode"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                error={errors.name}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="URL Slug *"
                placeholder="e.g. gi-earthing-electrode"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                error={errors.slug}
              />

              <Select
                label="Category *"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
                error={errors.category_id}
              />
            </div>

            <Input
              label="Product Badge / Tag"
              placeholder="e.g. High Durability, Popular Choice, NABL Tested"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary for product card..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded border border-navy-300 p-3 text-sm focus:border-navy-700 focus:outline-none focus:ring-1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Full Technical Description *
              </label>
              <textarea
                rows={5}
                placeholder="Comprehensive technical details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border border-navy-300 p-3 text-sm focus:border-navy-700 focus:outline-none focus:ring-1"
              />
              {errors.description && <p className="text-xs text-red-600 font-medium mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Key Features */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-navy-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">Key Features</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFeatures([...features, ""])}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g. Hot dip galvanized for maximum corrosion protection"
                    value={feat}
                    onChange={(e) => {
                      const updated = [...features];
                      updated[idx] = e.target.value;
                      setFeatures(updated);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Component */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm">
            <ProductSpecifications specs={specs} onChange={setSpecs} />
          </div>

          {/* Product Images Component */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm">
            <ProductImages images={images} onChange={setImages} />
          </div>
        </div>

        {/* Sidebar Settings (1 Column) */}
        <div className="space-y-6">
          {/* Status & Options */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Publishing & Visibility
            </h3>

            <Select
              label="Content Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              options={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "Archived", value: "archived" },
              ]}
            />

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-navy-300 text-brand focus:ring-brand"
              />
              <label htmlFor="featured" className="text-xs font-semibold text-navy-800 cursor-pointer">
                Feature on Home Page
              </label>
            </div>

            <Input
              label="Display Order / Weight"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          {/* SEO Metadata */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Search Engine Optimization (SEO)
            </h3>

            <Input
              label="Meta Title"
              placeholder="Custom page title for Google..."
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="Google search result snippet..."
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:border-navy-700 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
