import SectionHeading from "@/components/ui/SectionHeading";
import { Zap, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function EarthingIntro() {
  return (
    <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Educational Content */}
          <div className="space-y-8">
            <SectionHeading
              eyebrow="ELECTRICAL SAFETY FUNDAMENTALS"
              title="Understanding Electrical Earthing"
              subtitle="The foundational engineering principle behind personnel and equipment protection."
              light
            />

            {/* Block 1: What is Earthing */}
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-3 text-brand-red font-bold text-lg">
                <Zap className="w-5 h-5 fill-brand-red" />
                <h3>What is Earthing?</h3>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                The process of transferring the immediate discharge of electrical energy directly to the earth with the help of a low-resistance path is known as <strong className="text-white">electrical earthing</strong>. The earthing electrode provides a reliable, permanent, and low-impedance connection between the electrical installation and the general mass of the earth.
              </p>
            </div>

            {/* Block 2: Purpose of Earthing */}
            <div className="bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center gap-3 text-brand-red font-bold text-lg">
                <ShieldAlert className="w-5 h-5" />
                <h3>Purpose of Earthing</h3>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                The primary purpose of earthing is to reduce the risk of serious electric shock from current leaking into uninsulated metallic bodies of appliances, power tools, distribution panels, or industrial machinery. In a properly earthed system, fault currents pass safely into the ground while instantaneously tripping protective circuit breakers.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Protects personnel from lethal shock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Stabilizes system voltage during surges</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Prevents electrical fires in insulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Safely dissipates lightning surges</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Interactive Diagram Illustration */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative">
            <div className="text-xs font-mono text-slate-400 mb-4 flex justify-between items-center border-b border-slate-800 pb-3">
              <span>SYSTEM DIAGRAM // TYPICAL EARTH PIT</span>
              <span className="text-brand-red font-bold">FE-DIAG-01</span>
            </div>

            {/* SVG Diagram */}
            <svg viewBox="0 0 500 400" className="w-full h-auto">
              <defs>
                <linearGradient id="groundSoil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#334155"/>
                  <stop offset="100%" stop-color="#1E293B"/>
                </linearGradient>
                <linearGradient id="copperRodGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#B85B28"/>
                  <stop offset="50%" stop-color="#F7C4A1"/>
                  <stop offset="100%" stop-color="#732B08"/>
                </linearGradient>
              </defs>

              {/* Sky / Air Zone */}
              <rect x="0" y="0" width="500" height="100" fill="#0F172A"/>
              <text x="250" y="30" font-family="Arial" font-size="12" fill="#94A3B8" text-anchor="middle" font-weight="bold">FAULT CURRENT ORIGIN (PANEL / TRANSFORMER)</text>
              <line x1="250" y1="40" x2="250" y2="130" stroke="#EF233C" stroke-width="4" stroke-dasharray="6"/>

              {/* Ground Soil Level */}
              <line x1="20" y1="100" x2="480" y2="100" stroke="#10B981" stroke-width="3"/>
              <text x="50" y="90" font-family="Arial" font-size="11" fill="#10B981" font-weight="bold">GROUND LEVEL</text>

              {/* Soil Mass */}
              <rect x="20" y="100" width="460" height="280" fill="url(#groundSoil)" rx="6"/>

              {/* Earth Pit Hole Cutout */}
              <rect x="190" y="100" width="120" height="250" fill="#0F172A" rx="4" stroke="#475569" stroke-width="2"/>
              <text x="250" y="210" font-family="Arial" font-size="10" fill="#64748B" text-anchor="middle">BACKFILL COMPOUND</text>

              {/* Forecast Earthing Electrode */}
              <rect x="235" y="80" width="30" height="250" fill="url(#copperRodGrad)" rx="3"/>

              {/* Current Dissipation Waves */}
              <g stroke="#EF233C" strokeWidth="2" fill="none" opacity="0.8">
                <circle cx="250" cy="220" r="40" strokeDasharray="4"/>
                <circle cx="250" cy="220" r="70" strokeDasharray="6"/>
                <circle cx="250" cy="220" r="100" strokeDasharray="8"/>
              </g>

              {/* Earth Pit Cover Top */}
              <rect x="175" y="85" width="150" height="30" fill="#15803D" rx="4"/>
              <text x="250" y="105" font-family="Arial" font-size="11" fill="#FFFFFF" text-anchor="middle" font-weight="bold">EARTHPIT COVER</text>
            </svg>

            <div className="mt-4 p-3 bg-slate-900 rounded-lg text-xs text-slate-400 border border-slate-800 text-center">
              Low-resistance fault current dissipation path into earth mass
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
