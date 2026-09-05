import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { ArrowRight, CheckCircle2, Download, ShieldCheck } from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Forecast Earthings",
    };
  }
  return {
    title: `${product.name} (${product.code}) | Forecast Earthings Pvt. Ltd.`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await fetchProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.[0] ? getCloudinaryUrl(product.images[0]) : getCloudinaryUrl("/images/products/gi-earthing-electrode.svg");

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Breadcrumb Navigation Bar matching mockup */}
      <div className="bg-white border-b border-slate-200 py-3.5">
        <Container>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <Link href="/" className="hover:text-brand-red transition-colors">Home</Link>
            <span>&gt;</span>
            <Link href="/products" className="hover:text-brand-red transition-colors">Products</Link>
            <span>&gt;</span>
            <span className="font-semibold text-brand-navy truncate max-w-xs">{product.name}</span>
          </div>
        </Container>
      </div>

      <Container className="pt-8">
        
        {/* Top Product Header Grid matching mockup */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Product Image Gallery with 3 Thumbnails (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative h-80 sm:h-96 w-full bg-slate-50 rounded-xl border border-slate-200 p-6 flex items-center justify-center overflow-hidden">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                className="object-contain p-4"
              />
            </div>

            {/* 3 Thumbnail Previews matching reference mockup */}
            <div className="grid grid-cols-3 gap-3">
              <div className="relative h-20 bg-slate-50 rounded-lg border-2 border-brand-red p-2 flex items-center justify-center">
                <Image src={primaryImage} alt="Thumbnail 1" fill className="object-contain p-1" />
              </div>
              <div className="relative h-20 bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                <Image src={primaryImage} alt="Thumbnail 2" fill className="object-contain opacity-70 p-1" />
              </div>
              <div className="relative h-20 bg-slate-50 rounded-lg border border-slate-200 p-2 flex items-center justify-center">
                <Image src={primaryImage} alt="Thumbnail 3" fill className="object-contain opacity-70 p-1" />
              </div>
            </div>
          </div>

          {/* Right Column: Title, Subtitle, Description & CTAs matching mockup (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
                {product.name}
              </h1>
              
              {/* Subtitle */}
              <p className="text-sm font-semibold text-slate-500 tracking-wide">
                Code: {product.code} | Category: {product.category}
              </p>

              <p className="text-slate-700 text-base leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Action Buttons matching mockup */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center justify-center bg-brand-red hover:bg-brand-redHover text-white px-8 py-3.5 rounded-md font-bold text-base transition-all shadow-md text-center"
              >
                Request a Quote
              </Link>
              
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-md font-semibold text-base transition-all text-center"
              >
                <span>Download Brochure</span>
                <Download className="w-4 h-4 text-brand-navy" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Specs & Features Grid matching reference mockup */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          
          {/* Section Headers */}
          <div className="flex border-b border-slate-200 mb-8 space-x-8">
            <h2 className="pb-3 border-b-2 border-brand-red font-bold text-brand-red text-base">
              Key Features &amp; Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Key Features List (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="font-bold text-brand-navy text-base mb-4 border-b border-slate-200 pb-2">
                Key Features
              </h3>
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0" />
                    <span className="text-slate-800 text-sm font-semibold">{feature}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">Standard engineering features applied.</p>
              )}

              {product.applications && product.applications.length > 0 && (
                <div className="pt-6">
                  <h3 className="font-bold text-brand-navy text-base mb-3 border-b border-slate-200 pb-2">
                    Applications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map((app, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Product Specifications Table (6 Cols) */}
            <div className="lg:col-span-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="font-bold text-brand-navy text-base mb-4 border-b border-slate-200 pb-2">
                  Product Specifications
                </h3>
                <div className="space-y-3 text-sm">
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-600 font-semibold">{spec.label}</span>
                        <span className="text-brand-navy font-bold text-right">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic">Contact engineering team for full datasheets.</p>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Banner: Need a Custom Solution? matching mockup */}
        <div className="mt-10 bg-slate-100 p-8 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-brand-navy flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-red" />
              Need a Custom Solution?
            </h3>
            <p className="text-slate-600 text-sm">
              We provide customized earthing solutions as per your requirements.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-slate-800 text-white px-6 py-3 rounded-md font-bold text-sm transition-all whitespace-nowrap shadow-sm"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </Container>
    </div>
  );
}

