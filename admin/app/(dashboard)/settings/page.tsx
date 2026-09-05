"use client";

import React, { useState, useEffect } from "react";
import { useSettings, useSettingsMutations } from "../../../hooks/useSettings";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Save, Settings as SettingsIcon, Globe, Share2, ShieldCheck, Mail } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: settingsData, isLoading } = useSettings();
  const { updateSettings, isUpdating } = useSettingsMutations();

  const [activeTab, setActiveTab] = useState<"general" | "contact" | "social" | "seo" | "footer">("general");

  const [siteName, setSiteName] = useState("FORECAST EARTHINGS PVT. LTD.");
  const [tagline, setTagline] = useState("Grounded for a Safer World");
  const [motto, setMotto] = useState("Chalo Banaye Behtar Bharat");
  const [email, setEmail] = useState("sales@forecastearthings.com");
  const [phone, setPhone] = useState("+91 7978206652");
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
        <h2 className="text-lg font-bold text-navy-950">Website Settings</h2>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Global Website Settings</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage company branding, motto, contact info, social accounts & SEO defaults.
          </p>
        </div>

        <Button type="submit" variant="primary" isLoading={isUpdating}>
          <Save className="mr-1.5 h-4 w-4" /> Save Settings
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-navy-200 space-x-4 bg-white px-4 pt-2 rounded-t-lg">
        {[
          { key: "general", label: "General & Branding", icon: SettingsIcon },
          { key: "contact", label: "Contact Info", icon: Mail },
          { key: "social", label: "Social Networks", icon: Share2 },
          { key: "seo", label: "SEO Defaults", icon: ShieldCheck },
          { key: "footer", label: "Footer Content", icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-1.5 border-b-2 pb-3 px-2 text-xs font-bold transition-colors ${
                isActive ? "border-brand text-brand" : "border-transparent text-navy-500 hover:text-navy-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-b-lg border border-t-0 border-navy-200 bg-white p-6 shadow-sm space-y-4">
        {activeTab === "general" && (
          <div className="space-y-4 max-w-xl">
            <Input label="Company Name *" value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
            <Input label="Brand Slogan / Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            <Input label="National Motto" value={motto} onChange={(e) => setMotto(e.target.value)} />
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-4 max-w-xl">
            <Input label="Primary Sales Email *" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Primary Contact Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="Secondary Phone" value={secPhone} onChange={(e) => setSecPhone(e.target.value)} />
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4 max-w-xl">
            <Input label="LinkedIn Profile URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
            <Input label="Facebook Page URL" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            <Input label="YouTube Channel URL" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4 max-w-xl">
            <Input label="Default Search Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === "footer" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Footer Brand Summary
              </label>
              <textarea
                rows={3}
                value={footerDesc}
                onChange={(e) => setFooterDesc(e.target.value)}
                className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:outline-none"
              />
            </div>
            <Input label="Copyright Notice" value={copyright} onChange={(e) => setCopyright(e.target.value)} />
          </div>
        )}
      </div>
    </form>
  );
}
