"use client";

import React, { useState, useEffect } from "react";
import { usePage, usePageMutations } from "../../../../hooks/usePages";
import { SEOEditor } from "../../../../components/pages/SEOEditor";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/ui/Toast";
import { SEOData } from "../../../../lib/types/product";
import { Save, Globe, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPageCMSEditor() {
  const { toast } = useToast();
  const { data: pageData } = usePage("about");
  const { updatePage, publishPage, isUpdating, isPublishing } = usePageMutations();

  const [title, setTitle] = useState("About Us - FORECAST EARTHINGS PVT. LTD.");
  const [intro, setIntro] = useState("Pioneers in electrical grounding and lightning protection engineering.");
  const [vision, setVision] = useState("To build a safer, grounded electrical infrastructure across India.");
  const [mission, setMission] = useState("Manufacture top-grade GI & copper electrodes adhering to IS 3043 standards.");
  const [seo, setSeo] = useState<SEOData>({
    title: "About Us | Forecast Earthings Pvt. Ltd.",
    description: "Company profile, engineering team, vision and manufacturing standards.",
  });

  useEffect(() => {
    if (pageData) {
      if (pageData.title) setTitle(pageData.title);
      if (pageData.seo) setSeo(pageData.seo);
    }
  }, [pageData]);

  const handleSave = async (isPublish = false) => {
    try {
      const pageId = pageData?.id || "about";
      await updatePage({
        id: pageId,
        data: {
          title,
          slug: "about",
          description: intro,
          seo,
          status: isPublish ? "published" : "draft",
        },
      });

      if (isPublish) {
        await publishPage(pageId);
        toast("About page published live!");
      } else {
        toast("About page draft saved!");
      }
    } catch (err: any) {
      toast(err.message || "Failed to save About page", "error");
    }
  };

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link href="/pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Pages List
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-navy-950">About Us Page CMS</h2>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={`${publicSiteUrl}/about`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-navy-500" /> Preview About
          </a>
          <Button variant="outline" onClick={() => handleSave(false)} isLoading={isUpdating}>
            <Save className="mr-1.5 h-4 w-4" /> Save Draft
          </Button>
          <Button variant="primary" onClick={() => handleSave(true)} isLoading={isUpdating || isPublishing}>
            <Globe className="mr-1.5 h-4 w-4" /> Publish Live
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
            Company Profile & Values
          </h3>

          <Input label="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
              Company Narrative / Intro
            </label>
            <textarea
              rows={4}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Corporate Vision
              </label>
              <textarea
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Corporate Mission
              </label>
              <textarea
                rows={3}
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="w-full rounded border border-navy-300 p-2.5 text-xs text-navy-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <SEOEditor seo={seo} onChange={setSeo} />
      </div>
    </div>
  );
}
