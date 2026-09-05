import Link from "next/link";
import { PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="bg-gradient-to-r from-brand-navyDark via-brand-navy to-slate-900 text-white py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-brand-red text-xs font-bold uppercase tracking-wider border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>COMMERCIAL INQUIRIES & BULK ORDERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Need a grounding solution?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Discuss your earthing or lightning protection requirement with us. Our engineering team is ready to assist with product selection and technical quotes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-8 py-4 rounded-md font-bold text-base transition-all shadow-lg hover:shadow-red-900/40 text-center"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="tel:+911204567890"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-slate-200 border border-slate-700 px-6 py-4 rounded-md font-semibold text-base transition-all text-center"
            >
              <PhoneCall className="w-4 h-4 text-brand-red" />
              <span>Call Technical Team</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
