import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Linkedin, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-brand-navyDark text-slate-300 border-t-4 border-brand-red overflow-hidden">

      {/* Background Skyline Image from mockup assets */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <Image
          src="/images/footer/footer-skyline-power-lines.webp"
          alt="Electrical Power Line Skyline Background"
          fill
          className="object-cover object-bottom"
        />
      </div>

      {/* Main Footer Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Company Profile & Social Icons */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-lg inline-block w-56 shadow-sm">
              <Image
                src="/images/logo/logo.svg"
                alt="Forecast Earthings Pvt. Ltd."
                width={220}
                height={50}
                className="object-contain"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leading manufacturer & supplier of earthing solutions, lightning arresters and electrical safety products. Make in India for a safer world.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-slate-800 hover:bg-brand-red text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-slate-800 hover:bg-brand-red text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-md bg-slate-800 hover:bg-brand-red text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-slate-800">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-red transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-red transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-red transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/installation" className="hover:text-brand-red transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-red transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Products */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-slate-800">
              Our Products
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=earthing-electrodes" className="hover:text-white transition-colors">
                  Earthing Electrodes
                </Link>
              </li>
              <li>
                <Link href="/products?category=lightning-protection" className="hover:text-white transition-colors">
                  Lightning Arresters
                </Link>
              </li>
              <li>
                <Link href="/products?category=pit-covers" className="hover:text-white transition-colors">
                  Pit Covers
                </Link>
              </li>
              <li>
                <Link href="/products?category=ground-enhancement" className="hover:text-white transition-colors">
                  Backfill Compound
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Wires & Cables
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-slate-800">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>Plot No. 799(P), Shyampur, Near SUM Hospital, Bhubaneswar – 751003, Odisha, India</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-brand-red flex-shrink-0" />
                <a href="tel:+917978206652" className="hover:text-white transition-colors">
                  +91 7978206652 / +91 9658264263
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                <a href="mailto:sales@forecastearthings.com" className="hover:text-white transition-colors">
                  sales@forecastearthings.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="relative z-10 bg-slate-950 py-5 border-t border-slate-900 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2024 Forecast Earthings Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">Chalo Banaye Behtar Bharat</span>
            <span className="text-base">🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
