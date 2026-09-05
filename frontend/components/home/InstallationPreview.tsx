import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight, Wrench, Ruler, ArrowDownCircle, Sparkles, Droplets, ShieldCheck, CheckCircle } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Dig a Hole with Auger",
    desc: "Exacavate ground using an auger or manual drill tool.",
    icon: Wrench,
  },
  {
    step: "02",
    title: "Hole Measurement",
    desc: "Verify 4-inch diameter and 3-meter (10 ft) depth.",
    icon: Ruler,
  },
  {
    step: "03",
    title: "Insert Electrode / Rod",
    desc: "Place Forecast Earthings electrode in center of pit.",
    icon: ArrowDownCircle,
  },
  {
    step: "04",
    title: "Fill Enhancement Compound",
    desc: "Fill pit with Advanced Backfill Compound.",
    icon: Sparkles,
  },
  {
    step: "05",
    title: "Pour Water Around Rod",
    desc: "Pour clean water to activate conductive compound.",
    icon: Droplets,
  },
  {
    step: "06",
    title: "Place Earthpit Cover",
    desc: "Install protective Forecast Earthings cover.",
    icon: ShieldCheck,
  },
  {
    step: "07",
    title: "Ground Level Finishing",
    desc: "Seal cover flush with earth surface.",
    icon: CheckCircle,
  },
];

export default function InstallationPreview() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeading
            eyebrow="ENGINEERING GUIDELINES"
            title="7-Step Installation Process"
            subtitle="Standardized procedure for installing Forecast Earthings electrodes for optimal low ground resistance."
          />
          <Link
            href="/installation"
            className="inline-flex items-center gap-2 text-brand-red hover:text-brand-redHover font-bold text-sm sm:text-base group whitespace-nowrap"
          >
            <span>Full Installation Guide</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Timeline Steps Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-red/50 transition-all"
              >
                <div className="text-4xl font-black text-slate-200 group-hover:text-rose-100 transition-colors absolute top-4 right-4">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-brand-red flex items-center justify-center mb-4 relative z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-brand-navy text-base mb-1 relative z-10">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed relative z-10">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Steps 5-7 Horizontal Mini Bar */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-brand-navy text-white text-xs font-bold rounded">STEPS 05 - 07</span>
            <p className="text-sm font-semibold text-slate-800">
              Water Activation → Earthpit Cover Fitting → Ground Finishing
            </p>
          </div>
          <Link
            href="/installation"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-redHover text-white px-5 py-2.5 rounded-md font-bold text-sm transition-all whitespace-nowrap"
          >
            <span>View Detailed Installation Diagram</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
