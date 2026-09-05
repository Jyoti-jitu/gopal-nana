"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product, Category, ContentStatus, ProductImage } from "../../lib/types/product";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { ProductSpecifications, SpecRow } from "./ProductSpecifications";
import { ProductImages } from "./ProductImages";
import { useCategories } from "../../hooks/useCategories";
import { useProductMutations } from "../../hooks/useProducts";
import { useToast } from "../ui/Toast";
import { ArrowLeft, Save, Globe, Eye, Plus, Trash2, Image as ImageIcon, Check } from "lucide-react";
import { getCloudinaryUrl } from "../../lib/cloudinary";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const { createProduct, updateProduct, publishProduct, isCreating, isUpdating, isPublishing } = useProductMutations();

  const [activeTab, setActiveTab] = useState<"basic" | "specs" | "images" | "seo" | "publishing">("basic");

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [tag, setTag] = useState(initialData?.tag || "");
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [features, setFeatures] = useState<string[]>(initialData?.features || [
    "Hot dip galvanized for long life",
    "High conductivity and low resistance",
    "Available in various sizes",
    "Suitable for all soil conditions"
  ]);
  const [applications, setApplications] = useState<string[]>(initialData?.applications || [""]);
  const [specs, setSpecs] = useState<SpecRow[]>(
    initialData?.specifications?.map((s) => ({
      label: s.label,
      value: s.values?.value || s.values?.val || Object.values(s.values || {})[0] || "",
    })) || []
  );
  const [images, setImages] = useState<ProductImage[]>(initialData?.images || [
    { url: getCloudinaryUrl("/images/products/gi-earthing-electrode.svg"), alt: "GI Earthing Electrode" }
  ]);
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

  const primaryImage = images[0]?.url || getCloudinaryUrl("/images/products/gi-earthing-electrode.svg");

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      {/* Breadcrumbs matching Screen 4 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Products
          </Link>
          <span>&gt;</span>
          <span className="text-[#0062E3]">{isEditing ? "Edit Product" : "Add Product"}</span>
        </div>

        {isEditing && slug && (
          <a
            href={`http://localhost:3000/products/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> View on Live Site
          </a>
        )}
      </div>

      {/* Tab Navigation Pill Bar matching Screen 4 */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {[
          { id: "basic", label: "Basic Info" },
          { id: "specs", label: "Specifications" },
          { id: "images", label: "Images" },
          { id: "seo", label: "SEO" },
          { id: "publishing", label: "Publishing" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#0062E3] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Basic Info */}
      {activeTab === "basic" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Columns: Inputs */}
          <div className="lg:col-span-2 space-y-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Code *"
                placeholder="1-FEGI"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={errors.code}
              />

              <Input
                label="Product Name *"
                placeholder="GI Earthing Electrode"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                error={errors.name}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Slug *"
                placeholder="gi-earthing-electrode"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Description
              </label>
              <textarea
                rows={2}
                placeholder="High quality GI earthing electrode for industrial safety..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Our GI Earthing Electrodes are manufactured using high grade pipes to ensure high conductivity and corrosion resistance..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none transition-all"
              />
              {errors.description && <p className="text-xs text-red-600 font-medium mt-1">{errors.description}</p>}
            </div>

            {/* Features Bullet List matching Screen 4 */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">Features</label>
                <button
                  type="button"
                  onClick={() => setFeatures([...features, ""])}
                  className="text-xs font-bold text-[#0062E3] hover:underline flex items-center"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add Feature
                </button>
              </div>

              <div className="space-y-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
                    <Input
                      placeholder="e.g. Hot dip galvanized for long life"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx] = e.target.value;
                        setFeatures(updated);
                      }}
                      className="py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Product Image Box matching Screen 4 */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4 text-center">
              <label className="block text-xs font-bold text-slate-700 text-left">Product Image</label>
              
              <div className="h-48 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex items-center justify-center overflow-hidden">
                {primaryImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={primaryImage} alt={name} className="h-full w-full object-contain" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-slate-300" />
                )}
              </div>

              <Link href="/media" className="inline-block w-full">
                <Button type="button" variant="outline" size="sm" className="w-full">
                  Change Image
                </Button>
              </Link>

              {/* Mini Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-1 overflow-x-auto">
                  {images.map((img, i) => (
                    <div key={i} className="h-10 w-10 rounded border border-slate-200 p-0.5 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Specifications */}
      {activeTab === "specs" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <ProductSpecifications specs={specs} onChange={setSpecs} />
        </div>
      )}

      {/* Tab Content: Images */}
      {activeTab === "images" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <ProductImages images={images} onChange={setImages} />
        </div>
      )}

      {/* Tab Content: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Search Engine Optimization (SEO)
          </h3>
          <Input
            label="Meta Title"
            placeholder="Custom page title for Google..."
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Meta Description</label>
            <textarea
              rows={3}
              placeholder="Google search result snippet..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab Content: Publishing */}
      {activeTab === "publishing" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-md">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Publishing Status & Visibility
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
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Feature on Home Page
            </label>
          </div>
          <Input
            label="Display Order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
          />
        </div>
      )}

      {/* Bottom Action Bar matching Screen 4: Save Draft, Publish, Cancel */}
      <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          Cancel
        </Button>
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
          <Globe className="mr-1.5 h-4 w-4" /> Publish
        </Button>
      </div>
    </form>
  );
}
