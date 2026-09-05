import Link from "next/link";
import Container from "@/components/ui/Container";
import { ArrowLeft, Home, Search, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-slate-50 min-h-[75vh] flex items-center py-20">
      <Container>
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-card text-center space-y-6">
          
          <div className="w-16 h-16 rounded-full bg-rose-50 text-brand-red flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold text-brand-red tracking-widest uppercase">ERROR 404</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">
              Page Not Found
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              The page or resource you are searching for does not exist or may have been moved.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-6 py-3 rounded-md font-bold text-sm transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-6 py-3 rounded-md font-semibold text-sm transition-all"
            >
              <Search className="w-4 h-4 text-brand-navy" />
              <span>Browse Products</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            Forecast Earthings Pvt. Ltd. | Safety Today. A Safer Tomorrow.
          </div>

        </div>
      </Container>
    </div>
  );
}
