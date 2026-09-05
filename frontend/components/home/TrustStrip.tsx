import { Award, Factory, Flag, Truck } from "lucide-react";

const TRUST_FEATURES = [
  {
    icon: Award,
    title: "High Quality Products",
    description: "NABL laboratory tested chemical compounds and certified electrical grounding electrodes.",
  },
  {
    icon: Factory,
    title: "Trusted Industries",
    description: "Deployed across power grids, solar parks, telecom 5G hubs, and industrial switchyards.",
  },
  {
    icon: Flag,
    title: "Make in India",
    description: "Proudly supporting national infrastructure under 'Chalo Banaye Behtar Bharat'.",
  },
  {
    icon: Truck,
    title: "On-Time Delivery",
    description: "Streamlined manufacturing capacity delivering bulk supply projects nationwide on schedule.",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-white border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors"
              >
                <div className="p-3 rounded-lg bg-rose-50 text-brand-red flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy text-base">{item.title}</h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
