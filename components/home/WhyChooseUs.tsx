import SectionHeading from "@/components/ui/SectionHeading";
import { ShieldCheck, Cpu, Layers, HeartHandshake, Clock, Wrench } from "lucide-react";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Commitment to Electrical Safety",
    description: "Every electrode and lightning protection component is engineered with zero-compromise safety protocols to safeguard human life and high-value capital equipment.",
  },
  {
    icon: Cpu,
    title: "Electrical Engineering Expertise",
    description: "Our core engineering team possesses extensive expertise in grounding metallurgy, soil resistivity dynamics, and surge dissipation standards.",
  },
  {
    icon: Layers,
    title: "Comprehensive Product Portfolio",
    description: "From GI and Copper Bonded to 99.9% Pure Copper, Cast Iron, Pit Covers, and NABL-tested enhancement compounds, we provide end-to-end grounding solutions.",
  },
  {
    icon: Wrench,
    title: "Advanced Manufacturing Capability",
    description: "Utilizing modern hot-dip galvanizing plants, molecular copper bonding systems, and high-density polymer molding to produce uniform industrial grade products.",
  },
  {
    icon: HeartHandshake,
    title: "Uncompromising Customer Satisfaction",
    description: "Dedicated technical assistance, accurate site recommendations, and prompt after-sales support for contractor and utility clients.",
  },
  {
    icon: Clock,
    title: "Reliable On-Time Delivery",
    description: "Efficient stock management and nationwide supply logistics ensure project timelines are consistently met without delays.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          eyebrow="WHY FORECAST EARTHINGS"
          title="Engineered for Reliability & Protection"
          subtitle="Discover why electrical contractors, power utilities, and industrial enterprises rely on Forecast Earthings Pvt. Ltd."
          centered
          className="mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-brand-red/50 hover:shadow-card transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-rose-50 text-brand-red flex items-center justify-center mb-5 group-hover:bg-brand-red group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
