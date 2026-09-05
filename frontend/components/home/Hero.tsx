import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function Hero() {
  return (
    <section className="relative bg-brand-navyDark text-white overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Background Exact Hero Banner Image (Tower + Lightning + City Skyline) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={getCloudinaryUrl("/images/hero/home-hero-banner.jpg")}
          alt="Forecast Earthings Lightning Tower & City Skyline"
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark/90 via-brand-navyDark/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Buttons matching exact mockup (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Eyebrow */}
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-slate-200 uppercase">
              EARTHING SOLUTIONS FOR A SAFER WORLD
            </p>

            {/* Main Headline matching mockup */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Safety Today<br />
              <span className="text-brand-red">A Safer Tomorrow</span>
            </h1>

            {/* Supporting Text matching mockup */}
            <p className="text-slate-200 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl font-normal">
              Leading Manufacturer &amp; Supplier of Earthing Solutions, Lightning Arresters and Electrical Safety Products.
            </p>

            {/* Action Buttons matching mockup */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-7 py-3.5 rounded-md font-bold text-base transition-all shadow-lg active:scale-95 group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white px-7 py-3.5 rounded-md font-bold text-base transition-all backdrop-blur-xs group"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Empty Space for Tower & Lightning Visual (4 Cols) */}
          <div className="hidden lg:block lg:col-span-4 h-64" />

        </div>
      </div>

      {/* Quote in ONE SINGLE LINE in the Bottom Right Corner matching user request */}
      <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-8 z-20 pointer-events-none">
        <p className="text-white text-lg sm:text-2xl font-bold italic tracking-wide text-right shadow-sm whitespace-nowrap bg-slate-950/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-xs">
          &ldquo;Grounded for a Safer World&rdquo;
        </p>
      </div>

    </section>
  );
}
