"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { Search, Quote, Star, Loader2 } from "lucide-react";
import { fetchProducts, fetchCategories, fetchTestimonials } from "@/lib/api";
import { Product, Category } from "@/lib/types";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [prodsData, catsData, testsData] = await Promise.all([
        fetchProducts(selectedCategory, searchQuery),
        fetchCategories(),
        fetchTestimonials(true)
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      if (testsData && testsData.length > 0) {
        setTestimonials(testsData);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-brand-navyDark text-white py-16 sm:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src={getCloudinaryUrl("/images/products/products-hero-banner.jpg")}
            alt="Products Laboratory Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark via-brand-navyDark/90 to-transparent" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-800/90 text-brand-red text-xs font-bold uppercase tracking-wider border border-slate-700">
              INDUSTRIAL CATALOGUE
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Products &amp; Solutions
            </h1>
            <p className="text-slate-200 text-lg leading-relaxed">
              Reliable earthing and lightning protection products engineered for industrial, commercial, and utility infrastructure.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Catalogue Section */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200 min-h-screen">
        <Container>
          
          {/* Controls: Search & Category Filter */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm mb-10 space-y-6">
            
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product name or code (e.g. 1-FEGI, ESE Arrester)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-slate-800"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-md font-semibold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-brand-red text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Results Summary */}
          <div className="mb-6 flex justify-between items-center text-sm text-slate-600">
            <span>
              Showing <strong>{filteredProducts.length}</strong> product{filteredProducts.length === 1 ? "" : "s"}
            </span>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-brand-red font-semibold hover:underline text-xs"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
              <span className="ml-3 text-slate-600 font-medium">Loading products...</span>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-700 font-bold text-lg">No products found matching your filter</p>
              <p className="text-slate-500 text-sm">Try searching for another keyword or reset the category filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="bg-brand-navy text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </Container>
      </section>

      {/* What Our Clients Say (Testimonials) Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="CLIENT TESTIMONIALS"
            title="What Our Clients Say"
            subtitle="Trusted by leading contractors, engineers, and infrastructure developers across India."
            centered
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {(testimonials.length > 0 ? testimonials : [
              {
                name: "Rajesh Kumar",
                designation: "Project Manager",
                company: "L&T Construction",
                content: "Forecast Earthings provides excellent quality earthing products with reliable performance. Their technical support is top-notch."
              },
              {
                name: "Amit Sharma",
                designation: "Electrical Consultant",
                company: "Independent Consultant",
                content: "Best-in-class ESE Lightning Arresters. We haven't faced a single issue in our industrial plant since installation."
              },
              {
                name: "Sandeep Mohanty",
                designation: "Site Engineer",
                company: "OPGCL",
                content: "Highly impressed with their copper-bonded rods. The conductivity is superior to other local brands we used earlier."
              }
            ]).slice(0, 3).map((t, idx) => (
              <div key={t.name || idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-red/30" />
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    &quot;{t.content || t.quote}&quot;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <a
                      href="/contact"
                      className="font-bold text-brand-navy hover:text-brand-red text-base transition-colors"
                    >
                      {t.name}
                    </a>
                    <p className="text-slate-500 text-xs font-semibold">{t.designation || t.role} {t.company ? `• ${t.company}` : ""}</p>
                  </div>
                  <a
                    href="/contact"
                    className="text-xs font-bold text-brand-red hover:underline"
                  >
                    Contact →
                  </a>
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>
    </>
  );
}

