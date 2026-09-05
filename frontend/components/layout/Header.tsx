"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall, ShieldCheck } from "lucide-react";
import { fetchSettings, fetchNavigation } from "@/lib/api";

const DEFAULT_NAV_LINKS = [
  { label: "Home", url: "/" },
  { label: "About", url: "/about" },
  { label: "Products", url: "/products" },
  { label: "Installation", url: "/installation" },
  { label: "Contact", url: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<any[]>(DEFAULT_NAV_LINKS);
  const [settings, setSettings] = useState<any>({});
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadHeaderData() {
      const [sets, navs] = await Promise.all([fetchSettings(), fetchNavigation("header")]);
      if (sets && Object.keys(sets).length > 0) {
        setSettings(sets);
      }
      if (navs && navs.length > 0) {
        setNavLinks(navs);
      }
    }
    loadHeaderData();
  }, []);

  const primaryPhone = settings.primary_phone || "+91 7978206652";
  const motto = settings.motto || "Chalo Banaye Behtar Bharat";
  const siteName = settings.site_name || "Forecast Earthings Pvt. Ltd.";

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-navyDark text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span className="font-medium text-white">{siteName}</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Leading Manufacturer &amp; Supplier of Earthing Solutions</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-brand-red font-semibold tracking-wider">"{motto}"</span>
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-red" />
              <span>{primaryPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header matching mockup */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
          scrolled ? "shadow-header py-2.5" : "py-3 border-b border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo matching exact mockup image */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-56 sm:w-64">
              <Image
                src={getCloudinaryUrl("/images/logo/logo.svg")}
                alt="Forecast Earthings Pvt. Ltd. Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links matching mockup */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => {
              const url = link.url || link.href;
              const label = link.label || link.name;
              const isActive = pathname === url;
              return (
                <Link
                  key={url || idx}
                  href={url}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? "text-brand-red"
                      : "text-brand-navy hover:text-brand-red"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA matching mockup */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-red hover:bg-brand-redHover text-white px-5 py-2 rounded-md font-bold text-sm transition-all shadow-sm active:scale-95 text-center flex items-center gap-1.5"
            >
              <span>Get a Quote</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-navy hover:text-brand-red hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link, idx) => {
                const url = link.url || link.href;
                const label = link.label || link.name;
                const isActive = pathname === url;
                return (
                  <Link
                    key={url || idx}
                    href={url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md font-medium text-base transition-colors ${
                      isActive
                        ? "bg-rose-50 text-brand-red font-semibold"
                        : "text-slate-800 hover:bg-slate-50 hover:text-brand-red"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="pt-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-brand-red hover:bg-brand-redHover text-white text-center py-3 rounded-md font-semibold text-base shadow-sm"
                >
                  Get a Quote &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

