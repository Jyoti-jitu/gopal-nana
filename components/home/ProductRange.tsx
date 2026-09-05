import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight } from "lucide-react";

export default function ProductRange() {
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
            <span>View All 9 Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

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
