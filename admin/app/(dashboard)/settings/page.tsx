"use client";

import React, { useState, useEffect } from "react";
import { useSettings, useSettingsMutations } from "../../../hooks/useSettings";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Save, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: settingsData, isLoading } = useSettings();
  const { updateSettings, isUpdating } = useSettingsMutations();

  const [activeTab, setActiveTab] = useState<"general" | "branding" | "contact" | "social" | "seo" | "footer">("general");

  const [siteName, setSiteName] = useState("FORECAST EARTHINGS PVT. LTD.");
  const [tagline, setTagline] = useState("Grounded for a Safer World");
  const [motto, setMotto] = useState("Chalo Banaye Behtar Bharat");
  const [email, setEmail] = useState("sales@forecastearthings.com");
  const [phone, setPhone] = useState("+91 7978208852");
  const [secPhone, setSecPhone] = useState("+91 9658264263");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/company/forecastearthings");
  const [facebook, setFacebook] = useState("https://facebook.com/forecastearthings");
  const [youtube, setYoutube] = useState("https://youtube.com/@forecastearthings");
  const [seoTitle, setSeoTitle] = useState("FORECAST EARTHINGS PVT. LTD. | Enterprise Earthing Solutions");
  const [seoDesc, setSeoDesc] = useState("Leading manufacturer of GI, Copper Bonded & Pure Copper Earthing Electrodes.");
  const [footerDesc, setFooterDesc] = useState("FORECAST EARTHINGS PVT. LTD. is a leading manufacturer of high-performance GI, Copper Bonded & Pure Copper Earthing Electrodes.");
  const [copyright, setCopyright] = useState("© 2026 FORECAST EARTHINGS PVT. LTD. All rights reserved.");

  useEffect(() => {
    if (settingsData) {
      if (settingsData.site_name) setSiteName(settingsData.site_name);
      if (settingsData.tagline) setTagline(settingsData.tagline);
      if (settingsData.motto) setMotto(settingsData.motto);
      if (settingsData.primary_email) setEmail(settingsData.primary_email);
      if (settingsData.primary_phone) setPhone(settingsData.primary_phone);
      if (settingsData.secondary_phone) setSecPhone(settingsData.secondary_phone);
      if (settingsData.social_links) {
        setLinkedin(settingsData.social_links.linkedin || "");
        setFacebook(settingsData.social_links.facebook || "");
        setYoutube(settingsData.social_links.youtube || "");
      }
      if (settingsData.seo) {
        setSeoTitle(settingsData.seo.default_title || "");
        setSeoDesc(settingsData.seo.default_description || "");
      }
      if (settingsData.footer) {
        setFooterDesc(settingsData.footer.description || "");
        setCopyright(settingsData.footer.copyright_text || "");
      }
    }
  }, [settingsData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        site_name: siteName,
        tagline,
        motto,
        primary_email: email,
        primary_phone: phone,
        secondary_phone: secPhone,
        social_links: { linkedin, facebook, youtube },
        seo: { default_title: seoTitle, default_description: seoDesc },
        footer: { description: footerDesc, copyright_text: copyright },
      });
      toast("Global site settings updated successfully!");
    } catch (err: any) {
      toast(err.message || "Failed to update settings", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Website Settings</h2>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header matching Screen 12 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Website Settings</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage general settings and branding
          </p>
        </div>

        <Button type="submit" variant="primary" size="sm" isLoading={isUpdating}>
          <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>

      {/* Tabs matching Screen 12 */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {[
          { key: "general", label: "General" },
          { key: "branding", label: "Branding" },
          { key: "contact", label: "Contact" },
          { key: "social", label: "Social" },
          { key: "seo", label: "SEO" },
          { key: "footer", label: "Footer" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0062E3] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* General Settings matching Screen 12 */}
      {(activeTab === "general" || activeTab === "branding") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <Input label="Site Name *" value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
            <Input label="Tagline *" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <Input label="National Motto *" value={motto} onChange={(e) => setMotto(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input label="Default Email *" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Input label="Default Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>

          {/* Right Column: Website Logo Card matching Screen 12 */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 text-center">
            <label className="block text-xs font-bold text-slate-700 text-left">Website Logo *</label>

            <div className="h-36 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex items-center justify-center overflow-hidden">
              {/* Forecast Earthings Logo Preview */}
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center p-1.5 shadow-xs">
                  <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" stroke="#60A5FA" strokeWidth="2" />
                    <path d="M7 12a5 5 0 0 1 10 0" stroke="#EF4444" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-sm font-black text-slate-900 tracking-wider uppercase block leading-none">
                    FORECAST
                  </span>
                  <span className="text-[10px] font-bold text-[#0062E3] uppercase tracking-widest block mt-0.5">
                    EARTHINGS PVT. LTD.
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => alert("Select an SVG or PNG logo to update")}
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> Change Logo
            </Button>

            <p className="text-[10px] text-slate-400 font-medium">
              Recommended size: 300 x 100 px (PNG/SVG)
            </p>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-xl">
          <Input label="Primary Sales Email *" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Primary Contact Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input label="Secondary Phone" value={secPhone} onChange={(e) => setSecPhone(e.target.value)} />
        </div>
      )}

      {activeTab === "social" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-xl">
          <Input label="LinkedIn Profile URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
          <Input label="Facebook Page URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          <Input label="YouTube Channel URL" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
        </div>
      )}

      {activeTab === "seo" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-xl">
          <Input label="Default Search Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === "footer" && (
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Footer Brand Summary
            </label>
            <textarea
              rows={3}
              value={footerDesc}
              onChange={(e) => setFooterDesc(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none"
            />
          </div>
          <Input label="Copyright Notice" value={copyright} onChange={(e) => setCopyright(e.target.value)} />
        </div>
      )}
    </form>
  );
}
