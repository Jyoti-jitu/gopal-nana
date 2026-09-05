"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import { submitEnquiry, fetchContactInfo } from "@/lib/api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    product: "",
    message: "",
  });

  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContactInfo() {
      const data = await fetchContactInfo();
      if (data.offices && data.offices.length > 0) {
        setOffices(data.offices);
      }
    }
    loadContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await submitEnquiry(formData);
      if (response.success) {
        setSuccess("Thank you! Your message has been sent successfully to our engineering team.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          product: "",
          message: "",
        });
      } else {
        setError(response.message || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Header */}
      <section className="relative bg-brand-navyDark text-white py-16 sm:py-20 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <Image
            src={getCloudinaryUrl("/images/contact/contact-hero-banner.jpg")}
            alt="Operations Center Background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navyDark via-brand-navyDark/90 to-transparent" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Get in Touch
            </h1>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
              We&apos;re here to help you. For product enquiries, quotations or any other information, feel free to reach out to us.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Contact Grid */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <Container>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            
            {/* Left Column: Corporate & Branch Office Information (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {offices.length > 0 ? (
                offices.map((office) => (
                  <div key={office.id || office.name} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 ${office.is_primary ? "bg-brand-red text-white" : "bg-slate-800 text-slate-200"} text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider`}>
                      {office.office_type || (office.is_primary ? "HEADQUARTERS" : "REGIONAL BRANCH")}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${office.is_primary ? "text-brand-red" : "text-slate-500"} uppercase tracking-wider`}>
                        {office.city} LOCATION
                      </span>
                      <h2 className="text-xl font-bold text-brand-navy mt-0.5">{office.name}</h2>
                    </div>

                    <ul className="space-y-4 text-sm text-slate-700">
                      <li className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-snug">
                            {office.address}<br />
                            {office.city} – {office.postal_code}, {office.state}, {office.country}
                          </p>
                          {office.map_url && (
                            <a
                              href={office.map_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-brand-red font-semibold hover:underline mt-1.5"
                            >
                              <span>View on Google Maps</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </li>

                      {office.phones && office.phones.length > 0 && (
                        <li className="flex items-center gap-3.5">
                          <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div className="flex flex-wrap gap-2 text-sm font-medium">
                            {office.phones.map((phone: string, i: number) => (
                              <span key={i}>
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-brand-red transition-colors">{phone}</a>
                                {i < office.phones.length - 1 && <span className="text-slate-300 ml-2">•</span>}
                              </span>
                            ))}
                          </div>
                        </li>
                      )}

                      {office.emails && office.emails.length > 0 && (
                        <li className="flex items-center gap-3.5">
                          <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <a href={`mailto:${office.emails[0]}`} className="text-sm font-medium hover:text-brand-red transition-colors">
                            {office.emails[0]}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <>
                  {/* Corporate Office Card Fallback */}
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                      HEADQUARTERS
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-red uppercase tracking-wider">PRIMARY LOCATION</span>
                      <h2 className="text-xl font-bold text-brand-navy mt-0.5">Corporate Office</h2>
                      <p className="text-sm font-semibold text-slate-800 mt-1">FORECAST EARTHINGS PVT. LTD.</p>
                    </div>

                    <ul className="space-y-4 text-sm text-slate-700">
                      <li className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-snug">
                            Plot No. 799(P), Shyampur<br />
                            Near SUM Hospital<br />
                            Bhubaneswar – 751003, Odisha, India
                          </p>
                          <a
                            href="https://maps.app.goo.gl/XGEz1kDawswAKKcEA"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-brand-red font-semibold hover:underline mt-1.5"
                          >
                            <span>View on Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </li>

                      <li className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm font-medium">
                          <a href="tel:+917978206652" className="hover:text-brand-red transition-colors">+91 7978206652</a>
                          <span className="text-slate-300">•</span>
                          <a href="tel:+919658264263" className="hover:text-brand-red transition-colors">+91 9658264263</a>
                        </div>
                      </li>

                      <li className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-rose-50 text-brand-red flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <a href="mailto:sales@forecastearthings.com" className="text-sm font-medium hover:text-brand-red transition-colors">
                          sales@forecastearthings.com
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Branch Office Card Fallback */}
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-800 text-slate-200 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg tracking-wider">
                      REGIONAL BRANCH
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CHHATTISGARH REGION</span>
                      <h2 className="text-xl font-bold text-brand-navy mt-0.5">Branch Office</h2>
                      <p className="text-sm font-semibold text-slate-800 mt-1">FORECAST EARTHINGS PVT. LTD.</p>
                    </div>

                    <ul className="space-y-4 text-sm text-slate-700">
                      <li className="flex items-start gap-3.5">
                        <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-snug">
                            Ama Seoni, Near Vidhan Sabha<br />
                            Ring Road No. 3<br />
                            Raipur – 492101, Chhattisgarh, India
                          </p>
                        </div>
                      </li>

                      <li className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm font-medium">
                          <a href="tel:+917978206652" className="hover:text-brand-red transition-colors">+91 7978206652</a>
                          <span className="text-slate-300">•</span>
                          <a href="tel:+919658264263" className="hover:text-brand-red transition-colors">+91 9658264263</a>
                        </div>
                      </li>

                      <li className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <a href="mailto:sales@forecastearthings.com" className="text-sm font-medium hover:text-brand-red transition-colors">
                          sales@forecastearthings.com
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              )}

            </div>

            {/* Right Column: Send us a Message Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-9 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit">
              <div>
                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">QUICK ENQUIRY</span>
                <h2 className="text-2xl font-bold text-brand-navy mt-0.5 border-b border-slate-100 pb-3">
                  Send us a Message
                </h2>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. rajesh@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject / Product Enquiry
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Chemical Earthing Electrodes Quotation"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your earthing requirement, project specs, or product enquiry details..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-slate-800 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-redHover text-white font-bold py-3.5 px-6 rounded-xl text-base transition-all shadow-md disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>

          {/* Bottom Section: Embedded Google Map Location pointing to Forecast Earthings Pvt Ltd */}
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
            <iframe
              title="Forecast Earthings Pvt. Ltd. Location Map"
              src="https://maps.google.com/maps?q=Forecast%20Earthings%20Pvt%20Ltd&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute bottom-4 right-4 z-10">
              <a
                href="https://maps.app.goo.gl/XGEz1kDawswAKKcEA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-red text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg transition-colors"
              >
                <MapPin className="w-4 h-4 text-brand-red" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </Container>
      </section>
    </>
  );
}

