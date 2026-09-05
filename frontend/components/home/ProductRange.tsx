"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight, Loader2 } from "lucide-react";
import { fetchProducts } from "@/lib/api";
import { Product } from "@/lib/types";

export default function ProductRange() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="PRODUCT CATALOGUE"
            title="Our Product Range"
            subtitle="Complete range of high-performance earthing electrodes, lightning protection, and soil enhancement products."
          />
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-redHover font-bold text-sm sm:text-base group whitespace-nowrap"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
            <span className="ml-3 text-slate-600 font-medium">Loading products from live database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Bottom Catalog Action */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-md text-base transition-all shadow-md"
          >
            <span>Explore Full Technical Product Specs</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

