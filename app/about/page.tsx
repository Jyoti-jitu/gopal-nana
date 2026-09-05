import { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/home/ContactCTA";
import {
  Eye,
  Target,
  Award,
  Factory,
  ShieldCheck,
  Truck,
  Cpu,
  CheckCircle2,
  HeartHandshake,
  Quote,
  Star,
  Sparkles,
  Phone,
  Mail,
  FlaskConical,
  Microscope
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Forecast Earthings Pvt. Ltd. — Earthing & Lightning Protection",
  description: "Learn about Forecast Earthings Pvt. Ltd. — leading manufacturer of Chemical Earthing Systems, ESE Lightning Arresters, GI & Copper Strips, and Backfill Compounds under Make in India.",
};

const MISSION_POINTS = [
  "To strengthen our leadership position in the earthing industry through advanced technology, continuous improvement, and operational excellence.",
  "To deliver high-quality, reliable, and cost-effective products that exceed customer expectations.",
  "To conduct business with integrity, transparency, and strong ethical values while building long-term relationships with customers, partners, and employees.",
  "To continuously innovate and adopt modern designs that support efficient installation, maintenance, and after-sales service."
];

const CORE_VALUES = [
  {
    title: "Quality Excellence",
    desc: "Commitment to manufacturing products that meet international quality and safety standards.",
    icon: ShieldCheck,
    img: "/images/about/about-substation-pit-cover.jpg"
  },
  {
    title: "Customer Satisfaction",
    desc: "Focus on understanding customer needs and delivering reliable, timely, and effective solutions.",
    icon: HeartHandshake,
    img: "/images/about/about-chemical-pit-installation.jpg"
  },
  {
    title: "Integrity & Ethics",
    desc: "Conducting business with honesty, fairness, and accountability across all operations.",
    icon: CheckCircle2,
    img: "/images/about/about-corporate-overview.jpg"
  },
  {
    title: "Innovation",
    desc: "Continuous research, development, and improvement of earthing products and processes.",
    icon: Sparkles,
    img: "/images/about/about-site-drilling.jpg"
  },
  {
    title: "Sustainability",
    desc: "Responsible manufacturing practices with deep respect for the environment and society.",
    icon: Factory,
    img: "/images/about/about-earth-tree-real.jpg"
  }
];

const QUALITY_PILLARS = [
  {
    title: "Stringent Quality Control",
    desc: "Comprehensive quality control system across all stages of manufacturing — from raw material inspection to in-process checks and final product validation.",
    img: "/images/about/about-substation-pit-cover.jpg",
    icon: ShieldCheck
  },
  {
    title: "Premium Raw Materials",
    desc: "Only carefully selected, high-grade raw materials such as GI, copper, and bonded alloys from certified suppliers ensuring superior conductivity and corrosion resistance.",
    img: "/images/products/copper-bonded-earthing-electrode.png",
    icon: Cpu
  },
  {
    title: "Advanced Manufacturing & Testing",
    desc: "State-of-the-art manufacturing facilities equipped with modern galvanizing machinery and electrical/mechanical testing instruments.",
    img: "/images/about/about-hero-bg.jpg",
    icon: Factory
  },
  {
    title: "Skilled Technical Expertise",
    desc: "Experienced engineers and trained quality professionals supervising molecular copper bonding processes and ensuring consistent product excellence.",
    img: "/images/about/about-corporate-overview.jpg",
    icon: Microscope
  },
  {
    title: "Compliance with Standards",
    desc: "Designed and manufactured in compliance with applicable Indian and international standards (IS 3043, IEEE 80, NFC 17-102:2011).",
    img: "/images/about/about-chemical-pit-installation.jpg",
    icon: FlaskConical
  },
  {
    title: "Continuous Improvement & Innovation",
    desc: "Active investment in research, product development, and process optimization to introduce innovative safety solutions.",
    img: "/images/about/about-site-drilling.jpg",
    icon: Truck
  }
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Header Banner with Real Industrial Substation Earthing Photo */}
      <section className="relative bg-brand-navyDark text-white py-20 sm:py-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/about-hero-bg.jpg"
            alt="Real Substation Grounding Grid Installation - Forecast Earthings"
            fill
            priority
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark via-brand-navyDark/90 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-brand-red uppercase tracking-widest bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-slate-700 inline-block shadow-sm">
              ABOUT FORECAST EARTHINGS
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Pioneering Electrical Safety &amp; Grounding Solutions
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed pt-2">
              Forecast Earthings Pvt. Ltd. is a leading and rapidly growing organization in the Indian earthing and lightning protection industry, operating with a strong commitment to the Make in India initiative.
            </p>
          </div>
        </Container>
      </section>

      {/* Corporate Overview & Real Chemical Earthing Installation Photo */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Official Overview Text */}
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                eyebrow="CORPORATE OVERVIEW"
                title="About Forecast Earthings Pvt. Ltd."
              />

              <p className="text-slate-700 text-base leading-relaxed">
                <strong>Forecast Earthings Pvt. Ltd.</strong> is a leading and rapidly growing organization in the Indian earthing and lightning protection industry, operating with a strong commitment to the <strong>Make in India</strong> initiative. Over the years, the company has built a solid reputation for delivering high-quality, reliable, and technologically advanced earthing solutions that meet national and international standards.
              </p>

              <p className="text-slate-700 text-base leading-relaxed">
                We are engaged in the manufacturing and supply of a comprehensive range of products including <strong>Chemical Earthing Systems, ESE Lightning Arresters, GI &amp; Copper Strips, Pit Covers, Wires, and Cables</strong>. Our product portfolio is designed to ensure electrical safety, system stability, and long-term performance across residential, commercial, industrial, and infrastructure projects.
              </p>

              <p className="text-slate-700 text-base leading-relaxed">
                Backed by a team of highly skilled engineers and technical professionals, Forecast Earthings Pvt. Ltd. focuses on continuous innovation, strict quality control, and customer-centric solutions. Our robust manufacturing infrastructure, efficient supply chain, and strong after-sales support enable us to deliver consistent value and timely solutions to our clients across India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Make in India Commitment</span>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Rapidly Growing Enterprise</span>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Skilled Technical Engineers</span>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-800">Pan-India Supply Chain</span>
                </div>
              </div>
            </div>

            {/* Right Column: Real Photo of Earthing Electrode Site Installation */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                <Image
                  src="/images/about/about-corporate-overview.jpg"
                  alt="Real Copper Bonded Earthing Electrode Installation - Forecast Earthings"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Chemical Earthing Electrode Installation • Grounding Safety ⚡
                  </p>
                </div>
              </div>

              {/* Secondary Heavy Duty Substation Earth Pit Cover Badge */}
              <div className="relative w-full h-[180px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 group">
                <Image
                  src="/images/about/about-substation-pit-cover.jpg"
                  alt="Heavy Duty Substation Earth Pit Inspection Cover - Forecast Earthings"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-center">
                  <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Heavy Duty GI Earth Pit Cover • Substation Infrastructure
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Vision & Mission Section with Real Background Photos */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="STRATEGIC DIRECTION"
            title="Vision and Mission"
            subtitle="The core purpose driving our engineering leadership, corporate governance, and commitment to excellence."
            centered
            className="mb-14"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Our Vision Card with Real Power Grid Background (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src="/images/about/about-vision-real.jpg"
                  alt="Real Power Transmission Grid - Our Vision"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-brand-navy text-brand-gold fill-brand-gold flex items-center justify-center stroke-white shadow-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="absolute bottom-3 left-4 text-xs font-bold text-brand-gold uppercase tracking-wider">
                  GLOBAL VISION
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-brand-navy">Our Vision</h3>
                  <p className="text-slate-700 text-sm leading-relaxed mt-3">
                    "To become a globally recognized organization in the field of earthing and lightning protection solutions, known for excellence in quality, innovation, governance, and sustainable business practices, while contributing positively to society and the environment."
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-brand-red uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Global Recognition • Ethical Governance</span>
                </div>
              </div>
            </div>

            {/* Our Mission Card with Real Quality Inspection Background (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src="/images/about/about-mission-real.jpg"
                  alt="Real Quality Control Engineering - Our Mission"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-brand-red text-white stroke-white flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6" />
                </div>
                <div className="absolute bottom-3 left-4 stroke-white text-xs font-bold text-white uppercase tracking-wider">
                  MISSION STATEMENT (4 PILLARS)
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <h3 className="text-2xl font-extrabold text-brand-navy">Our Mission</h3>
                <div className="space-y-3">
                  {MISSION_POINTS.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="w-5 h-5 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Core Values (5 Pillars with Real Industrial Banners) */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="FOUNDATIONAL PRINCIPLES"
            title="Our Core Values"
            subtitle="Guiding every product manufactured and service delivered across Forecast Earthings."
            centered
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CORE_VALUES.map((val) => {
              const IconComp = val.icon;
              return (
                <div key={val.title} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
                  <div className="relative h-32 w-full bg-slate-900">
                    <Image
                      src={val.img}
                      alt={val.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center shadow">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-brand-navy text-sm">{val.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed mt-1">{val.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </Container>
      </section>

      {/* Corporate Social Responsibility (CSR) */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="/images/about/about-values-real.jpg"
            alt="Sustainable Solar Energy and Environmental Protection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 text-center">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest bg-slate-800/90 px-4 py-1.5 rounded-full border border-slate-700 inline-block shadow-sm">
              RESPONSIBLE GROWTH &amp; IMPACT
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Corporate Social Responsibility (CSR)
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              Forecast Earthings Pvt. Ltd. believes in responsible growth and giving back to society. Our CSR initiatives focus on environmental protection, workplace safety, ethical manufacturing, and community development. We actively promote sustainable practices, energy efficiency, and safe electrical systems that contribute to the well-being of society and infrastructure development.
            </p>

            <p className="text-slate-300 text-sm leading-relaxed pt-2">
              By aligning our business operations with environmental responsibility and social values, we aim to create long-term positive impact for communities, stakeholders, and future generations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 space-y-2 backdrop-blur-sm">
                <h4 className="font-bold text-brand-gold text-sm">Environmental Stewardship</h4>
                <p className="text-slate-300 text-xs leading-relaxed">Minimizing waste, conserving resources, and eco-friendly manufacturing.</p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 space-y-2 backdrop-blur-sm">
                <h4 className="font-bold text-brand-gold text-sm">Workplace Safety</h4>
                <p className="text-slate-300 text-xs leading-relaxed">Rigorous safety standards protecting engineers and technical staff.</p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700 space-y-2 backdrop-blur-sm">
                <h4 className="font-bold text-brand-gold text-sm">Community Well-Being</h4>
                <p className="text-slate-300 text-xs leading-relaxed">Promoting safe electrical infrastructure and community development.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stringent Quality Control System with Real Photos */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <Container>
          
          <SectionHeading
            eyebrow="ZERO-DEFECT GUARANTEE"
            title="Quality — The Cornerstone of Forecast Earthings"
            subtitle="At Forecast Earthings Pvt. Ltd., quality is the cornerstone of our organization and the driving force behind our reputation in the earthing and lightning protection industry."
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {QUALITY_PILLARS.map((q, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                <div className="relative h-40 w-full bg-slate-900">
                  <Image
                    src={q.img}
                    alt={q.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-brand-navy text-white font-bold flex items-center justify-center text-xs shadow">
                    0{idx + 1}
                  </div>
                </div>
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-navy text-base">{q.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mt-1">{q.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </Container>
      </section>

      {/* What is Earthing with Detailed Technical Cutaway & Real Field Photo */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text Content (6 Cols) */}
            <div className="lg:col-span-6 space-y-8">
              
              <div className="space-y-3">
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-md border border-rose-100">
                  TECHNICAL DEFINITION &amp; PURPOSE
                </span>
                <h2 className="text-3xl font-extrabold text-brand-navy">What is Electrical Earthing?</h2>
                <p className="text-slate-700 text-base leading-relaxed">
                  The process of transferring the immediate discharge of electrical energy directly to the earth by means of a low resistance path is known as <strong>electrical earthing</strong>. The earthing provides a safe and low-impedance dissipation route for fault currents and lightning surges, protecting human lives and high-value machinery.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h2 className="text-2xl font-bold text-brand-navy">Purpose &amp; Critical Functions</h2>
                <p className="text-slate-700 text-base leading-relaxed">
                  The primary purpose of earthing is to eliminate dangerous potential differences and reduce the risk of serious electric shock from current leaking into insulated metal parts of an appliance or tool. In a properly earthed system, such fault current is carried away harmlessly while instantly tripping circuit fields.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-brand-red uppercase block">Fault Dissipation</span>
                    <span className="text-xs text-slate-600">Low resistance path (&lt; 1.0 Ω) to ground earth</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-brand-navy uppercase block">Equipment Safety</span>
                    <span className="text-xs text-slate-600">Shields heavy industrial &amp; solar assets</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Detailed Technical 3D Cutaway Diagram & Real Field Installation (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Detailed 3D Technical Cutaway Diagram SVG */}
              <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden shadow-xl border border-slate-700 bg-slate-900 group">
                <Image
                  src="/images/about/what-is-earthing-detailed-diagram.svg"
                  alt="Detailed 3D Technical Earthing Cutaway Diagram"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-2 group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Real Field Installation Photo Banner */}
              <div className="relative w-full h-[150px] rounded-xl overflow-hidden shadow-md border border-slate-200 bg-slate-900 group">
                <Image
                  src="/images/about/earthing-detailed-cutaway-2.jpg"
                  alt="Real Field Chemical Earthing Installation"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-xs font-semibold text-white">
                  <span>Realistic Field Earthing Installation</span>
                  <span className="bg-brand-red px-2.5 py-0.5 rounded text-[11px] font-bold">IS 3043 Standard</span>
                </div>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* Corporate Office & Direct Contacts Showcase */}
      <section className="py-16 bg-slate-900 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-widest bg-slate-800 px-3 py-1 rounded">
                CORPORATE HEADQUARTERS
              </span>
              <h3 className="text-2xl font-bold text-white">Forecast Earthings Pvt. Ltd.</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Plot No. 799(P), Shyampur, Near SUM Hospital, Bhubaneswar – 751003, Odisha, India
              </p>
              <div className="flex flex-wrap gap-6 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-red" />
                  <span>+91 7978206652 / +91 9658264263</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-red" />
                  <span>sales@forecastearthings.com</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <a
                href="tel:+917978206652"
                className="bg-brand-red hover:bg-brand-redHover text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg text-center inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Primary Office</span>
              </a>
            </div>

          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}






