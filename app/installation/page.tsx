import { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/home/ContactCTA";
import { Wrench, Ruler, ArrowDownCircle, Sparkles, Droplets, ShieldCheck, CheckCircle, AlertTriangle, Quote, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Earthing Installation Process | Forecast Earthings",
  description: "Learn the 7-step earthing electrode installation process as recommended by Forecast Earthings Pvt. Ltd.",
};

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Project Manager, L&T Construction",
    quote: "Forecast Earthings provides excellent quality earthing products with reliable performance. Their technical support is top-notch."
  },
  {
    name: "Amit Sharma",
    role: "Electrical Consultant",
    quote: "Best-in-class ESE Lightning Arresters. We haven't faced a single issue in our industrial plant since installation."
  },
  {
    name: "Sandeep Mohanty",
    role: "Site Engineer, OPGCL",
    quote: "Highly impressed with their copper-bonded rods. The conductivity is superior to other local brands we used earlier."
  },
  {
    name: "Vikram Aditya",
    role: "Procurement Head, Sterling & Wilson",
    quote: "On-time delivery even for bulk orders. Their logistics team is very efficient."
  },
  {
    name: "Dr. Ananya Rao",
    role: "Infrastructure Director",
    quote: "Their backfill compound significantly reduced earth resistance in our rocky terrain. Exceptional product!"
  },
  {
    name: "Rohan Das",
    role: "Architect, RD Designs",
    quote: "Professional approach and reliable earthing solutions for high-rise buildings. Highly recommended."
  },
  {
    name: "Suresh Jain",
    role: "Contractor, Jain Electrics",
    quote: "Forecast Earthings is our go-to partner for all grounding requirements in Raipur projects."
  },
  {
    name: "Priyanka Sethi",
    role: "Lead Engineer",
    quote: "Great after-sales service. They actually guide you on the best installation practices."
  },
  {
    name: "Manoj Mishra",
    role: "Safety Officer, NTPC",
    quote: "Quality and integrity define Forecast Earthings. Their products meet all safety standards."
  },
  {
    name: "Abhishek Singh",
    role: "Maintenance Head, Tata Steel",
    quote: "The durability of their GI strips is exceptional. No corrosion issues even after three monsoons."
  },
  {
    name: "Nitin Bajaj",
    role: "Operations Manager",
    quote: "Customer-centric company. They customized the electrode sizes as per our specific site requirements."
  },
  {
    name: "Rahul Verma",
    role: "Systems Consultant",
    quote: "Excellent knowledge of soil resistivity and earthing design. A very technical team."
  },
  {
    name: "Neha Gupta",
    role: "Interior Architect",
    quote: "Their pit covers are aesthetically pleasing and very sturdy. Great finishing."
  },
  {
    name: "Kartik Aaryan",
    role: "Builder & Developer",
    quote: "Pricing is very competitive without compromising on material quality."
  },
  {
    name: "Siddharth Paul",
    role: "Renewable Energy Specialist",
    quote: "Reliable lightning protection for our solar farm. Truly a life-saver for equipment."
  },
  {
    name: "Arjun Reddy",
    role: "Technical Purchase Manager",
    quote: "Fast quotes and professional documentation. Very easy to work with."
  },
  {
    name: "Deepak Thapa",
    role: "Mining Engineer",
    quote: "Outstanding performance in the mining sector grounding applications."
  },
  {
    name: "Ganesh Gaitonde",
    role: "Quality Inspector",
    quote: "The quality of copper coating on their rods is uniform and thick."
  },
  {
    name: "Karan Singh",
    role: "Infrastructure Lead",
    quote: "Excellent technical support and on-time delivery. Trusted partner."
  },
  {
    name: "Megha Chawla",
    role: "Senior Electrical Consultant",
    quote: "Their ESE arresters are high performing even in heavy rain zones."
  },
  {
    name: "Ravi Teja",
    role: "Site Operations Lead",
    quote: "Prompt response for emergency site requirements. Very helpful."
  },
  {
    name: "Samir Sheikh",
    role: "Certified Grounding Specialist",
    quote: "Genuine pure copper electrodes. Verified and highly satisfied."
  }
];

const STEPS_WITH_IMAGES = [
  {
    step: "01",
    title: "Dig a Hole with Auger",
    description: "Dig a vertical pit into the soil using a mechanical earth auger or appropriate manual drilling tools suitable for local ground conditions.",
    detail: "Ensure the surrounding soil is cleared of loose rocks and debris before proceeding to measurement.",
    icon: Wrench,
    image: "/images/installation/step1.jpg",
  },
  {
    step: "02",
    title: "Hole Measurement (4 inch & 3m depth)",
    description: "Verify that the dug hole conforms to standard specifications: approximately 4-inch diameter and 3-meter (10 ft) depth.",
    detail: "Accurate depth ensures the electrode reaches permanent moisture zones beneath the topsoil layer.",
    icon: Ruler,
    image: "/images/installation/step2.jpg",
  },
  {
    step: "03",
    title: "Insert Forecast Earthings Electrode / Rod",
    description: "Carefully insert the Forecast Earthings GI, Copper Bonded, or Pure Copper electrode into the center of the excavated hole.",
    detail: "Ensure the electrode is vertically aligned and centered to allow uniform compound packing around all sides.",
    icon: ArrowDownCircle,
    image: "/images/installation/step3.jpg",
  },
  {
    step: "04",
    title: "Fill with Advanced Ground Enhancement Compound",
    description: "Fill the annular space around the electrode rod with Forecast Earthings Back Fill Earth Enhancement Compound.",
    detail: "The NABL-tested compound lowers ground resistance and holds moisture around the electrode core.",
    icon: Sparkles,
    image: "/images/installation/step4.jpg",
  },
  {
    step: "05",
    title: "Pour Water Around the Rod",
    description: "Pour clean water around the inserted rod and compound to thoroughly hydrate the conductive backfill mixture.",
    detail: "Hydration expands the compound particles, eliminating air gaps and establishing intimate contact with surrounding earth.",
    icon: Droplets,
    image: "/images/installation/step5.jpg",
  },
  {
    step: "06",
    title: "Place Earthpit Cover",
    description: "Install a Forecast Earthings FRP, Poly, or Cast Iron earth pit cover over the top termination head of the electrode.",
    detail: "The pit cover protects the clamp connection from weather while allowing convenient access for periodic earth testing.",
    icon: ShieldCheck,
    image: "/images/installation/step6.jpg",
  },
  {
    step: "07",
    title: "Cover Earthpit to Ground Level",
    description: "Backfill and compact the soil around the earth pit cover so that the top access lid sits flush with the surrounding ground level.",
    detail: "Complete ground leveling prevents tripping hazards and water pooling around the inspection chamber.",
    icon: CheckCircle,
    image: "/images/installation/step7.jpg",
  },
];

export default function InstallationPage() {
  return (
    <>
      {/* High Quality Industrial Hero Banner Header */}
      <section className="relative bg-brand-navyDark text-white py-20 sm:py-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/installation/installation-hero-banner.jpg"
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
          <div className="max-w-5xl mx-auto space-y-16">
            {STEPS_WITH_IMAGES.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.step}
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-card transition-all grid grid-cols-1 lg:grid-cols-12 gap-0"
                >
                  
                  {/* Step Image (5 Cols) */}
                  <div className={`lg:col-span-5 relative h-64 lg:h-auto min-h-[250px] ${isEven ? "lg:order-last" : ""}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-brand-navy text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                      STEP {item.step}
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
                      <span>{item.detail}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Technical Disclaimer Box */}
          <div className="mt-16 max-w-5xl mx-auto bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span>Engineering & Site Safety Disclaimer</span>
            </div>
            <p className="text-amber-800 text-sm leading-relaxed">
              The seven-step installation procedure presented above reflects the standard process shown in Forecast Earthings Pvt. Ltd. technical material. Site conditions, soil resistivity, rocky strata, and local electrical utility codes may require specific engineering modifications or custom grounding grid configurations. Always consult qualified electrical engineers before executing site installations.
            </p>
          </div>

        </Container>
      </section>

      {/* What Our Clients Say (Testimonials) Section - Positioned Right After 7 Steps */}
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
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-brand-red/30" />
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-3.5 border-t border-slate-100">
                  <h4 className="font-bold text-brand-navy text-sm sm:text-base">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Counter Badge */}
          <div className="mt-12 text-center">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing 30 of 150+ verified reviews</span>
            </span>
          </div>

        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
