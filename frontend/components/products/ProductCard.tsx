import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col group">
      {/* Product Image Container */}
      <div className="relative h-60 w-full bg-slate-50 p-4 flex items-center justify-center border-b border-slate-100 overflow-hidden">
        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        
        {/* Product Code Badge */}
        <div className="absolute top-3 left-3 bg-brand-navy text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
          {product.code}
        </div>

        {/* Category Tag */}
        {product.tag && (
          <div className="absolute top-3 right-3 bg-brand-red text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
            {product.tag}
          </div>
        )}
      </div>

      {/* Product Details Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-xs font-semibold text-brand-red uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-red transition-colors line-clamp-1 mt-1">
            {product.name}
          </h3>
          <p className="text-slate-600 text-sm mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quick Specifications Bullet Highlights */}
          <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
            {product.features.slice(0, 2).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* View Details Action Link */}
        <div className="pt-2">
          <Link
            href={`/products/${product.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-brand-navy hover:text-white text-brand-navy font-semibold py-2.5 px-4 rounded-md text-sm transition-all group-hover:bg-brand-red group-hover:text-white"
          >
            <span>View Specifications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
