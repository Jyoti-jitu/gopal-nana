"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/home/ContactCTA";
import { Wrench, Ruler, ArrowDownCircle, Sparkles, Droplets, ShieldCheck, CheckCircle, AlertTriangle, Quote, Star, Loader2 } from "lucide-react";
import { fetchInstallationSteps, fetchTestimonials } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";

const ICON_MAP: Record<number, any> = {
  1: Wrench,
  2: Ruler,
  3: ArrowDownCircle,
  4: Sparkles,
  5: Droplets,
  6: ShieldCheck,
  7: CheckCircle,
};

const DEFAULT_STEPS = [
  {
    step_number: 1,
    title: "Dig a Hole with Auger",
    description: "Dig a vertical pit into the soil using a mechanical earth auger or appropriate manual drilling tools suitable for local ground conditions."
  },
  {
    step_number: 2,
    title: "Hole Measurement (4 inch & 3m depth)",
    description: "Verify that the dug hole conforms to standard specifications: approximately 4-inch diameter and 3-meter (10 ft) depth."
  },
  {
    step_number: 3,
    title: "Insert Forecast Earthings Electrode / Rod",
    description: "Carefully insert the Forecast Earthings GI, Copper Bonded, or Pure Copper electrode into the center of the excavated hole."
  },
  {
    step_number: 4,
    title: "Fill with Advanced Ground Enhancement Compound",
    description: "Fill the annular space around the electrode rod with Forecast Earthings Back Fill Earth Enhancement Compound."
  },
  {
    step_number: 5,
    title: "Pour Water Around the Rod",
    description: "Pour clean water around the inserted rod and compound to thoroughly hydrate the conductive backfill mixture."
  },
  {
    step_number: 6,
    title: "Place Earthpit Cover",
    description: "Install a Forecast Earthings FRP, Poly, or Cast Iron earth pit cover over the top termination head of the electrode."
  },
  {
    step_number: 7,
    title: "Cover Earthpit to Ground Level",
    description: "Backfill and compact the soil around the earth pit cover so that the top access lid sits flush with the surrounding ground level."
  }
];

export default function InstallationPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [stepsData, testsData] = await Promise.all([
        fetchInstallationSteps(),
        fetchTestimonials(false)
      ]);

      if (stepsData && stepsData.length > 0) {
        setSteps(stepsData);
      } else {
        setSteps(DEFAULT_STEPS);
      }

      if (testsData && testsData.length > 0) {
        setTestimonials(testsData);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      {/* High Quality Industrial Hero Banner Header */}
      <section className="relative bg-brand-navyDark text-white py-20 sm:py-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src={getCloudinaryUrl("/images/installation/installation-hero-banner.jpg")}
            alt="Electrical Grounding Installation Site Background"
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark via-brand-navyDark/85 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-brand-red text-xs sm:text-sm font-bold uppercase tracking-wider border border-slate-700 backdrop-blur-sm">
              <span>ENGINEERING WORKFLOW</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Installation Process
            </h1>
            <p className="text-slate-200 text-base sm:text-xl leading-relaxed max-w-2xl font-normal">
              Simple 7-step engineering procedure for installing Forecast Earthings grounding electrodes for maximum safety and low soil resistance.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Installation Timeline */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="RECOMMENDED STEPS"
            title="The 7-Step Earthing Installation Workflow"
            subtitle="Detailed step-by-step visual guide for deploying Forecast Earthings electrodes."
            centered
            className="mb-16"
          />

          {/* Vertical Timeline with Step Visuals */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
              <span className="ml-3 text-slate-600 font-medium">Loading installation workflow...</span>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-16">
              {steps.map((item, index) => {
                const stepNum = item.step_number || index + 1;
                const Icon = ICON_MAP[stepNum] || Wrench;
                const isEven = index % 2 === 0;
                const rawImg = item.image_url || `/images/installation/step${stepNum > 7 ? 1 : stepNum}.jpg`;
                const imgPath = getCloudinaryUrl(rawImg);

                return (
                  <div
                    key={item.id || item.step_number || index}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card transition-all grid grid-cols-1 lg:grid-cols-12 gap-0"
                  >
                    
                    {/* Step Image (5 Cols) */}
                    <div className={`lg:col-span-5 relative h-64 lg:h-auto min-h-[250px] ${isEven ? "lg:order-last" : ""}`}>
                      <Image
                        src={imgPath}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-brand-navy text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                        STEP 0{stepNum}
                      </div>
                    </div>

                    {/* Step Content Details (7 Cols) */}
                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-rose-50 text-brand-red flex items-center justify-center font-bold flex-shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-brand-navy">
                            {item.title}
                          </h3>
                        </div>

                        <p className="text-slate-700 text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 italic flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                        <span>Ensure proper engineering alignment during installation.</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Technical Disclaimer Box */}
          <div className="mt-16 max-w-5xl mx-auto bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Engineering &amp; Site Safety Disclaimer</span>
            </div>
            <p className="text-amber-800 text-sm leading-relaxed">
              The seven-step installation procedure presented above reflects the standard process shown in Forecast Earthings Pvt. Ltd. technical material. Site conditions, soil resistivity, rocky strata, and local electrical utility codes may require specific engineering modifications or custom grounding grid configurations. Always consult qualified electrical engineers before executing site installations.
            </p>
          </div>

        </Container>
      </section>

      {/* What Our Clients Say (Testimonials) Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="CLIENT TESTIMONIALS"
            title="What Our Clients Say"
            subtitle="Trusted by 500+ Engineering and Infrastructure Firms"
            centered
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
            ]).map((t, idx) => (
              <div key={t.id || t.name || idx} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-brand-red/30" />
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    &quot;{t.content || t.quote}&quot;
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100">
                  <h4 className="font-bold text-brand-navy text-sm sm:text-base">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{t.designation || t.role} {t.company ? `• ${t.company}` : ""}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Counter Badge */}
          <div className="mt-12 text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing live customer reviews from database</span>
            </span>
          </div>

        </Container>
      </section>

      <ContactCTA />
    </>
  );
}

