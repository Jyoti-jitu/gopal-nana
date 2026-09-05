"use client";

import React, { useState, useEffect } from "react";
import { usePage, usePageMutations } from "../../../../hooks/usePages";
import { HeroEditor } from "../../../../components/pages/HeroEditor";
import { SectionEditor } from "../../../../components/pages/SectionEditor";
import { SEOEditor } from "../../../../components/pages/SEOEditor";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/ui/Toast";
import { HeroConfig, PageSection } from "../../../../lib/types/page";
import { SEOData } from "../../../../lib/types/product";
import { Save, Globe, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function HomePageCMSEditor() {
  const { toast } = useToast();
  const { data: pageData, isLoading } = usePage("home");
  const { updatePage, publishPage, isUpdating, isPublishing } = usePageMutations();

  const [hero, setHero] = useState<HeroConfig>({
    eyebrow: "EARTHING SOLUTIONS FOR A SAFER WORLD",
    title: "Safety Today. A Safer Tomorrow.",
    description:
      "Leading manufacturer of high-performance GI, Copper Bonded & Pure Copper Earthing Electrodes, Backfill Compounds, and ESE Lightning Arresters.",
    primary_cta_text: "Explore Products",
    primary_cta_url: "/products",
    secondary_cta_text: "Contact Us",
    secondary_cta_url: "/contact",
    hero_image: "/images/hero-electrode.svg",
    alignment: "left",
  });

  const [sections, setSections] = useState<PageSection[]>([
    {
      id: "trust-strip",
      section_type: "trust",
      title: "Trusted by Electrical Engineers Nationwide",
      enabled: true,
      display_order: 1,
      content: {},
      items: [
        { title: "IS 3043 Compliant", description: "Engineered per Bureau of Indian Standards" },
        { title: "NABL Laboratory Tested", description: "Verified earth resistance < 0.12 ohm-m" },
        { title: "25+ Years Lifespan", description: "Molecular copper bonding guarantees anti-corrosion" },
      ],
    },
    {
      id: "why-us",
      section_type: "why_us",
      title: "Why Choose Forecast Earthings?",
      subtitle: "EXCELLENCE IN GROUND SAFETY",
      enabled: true,
      display_order: 2,
      content: {},
      items: [
        { title: "Advanced Metallurgy", description: "99.9% electrolytic copper and heavy hot-dip GI" },
        { title: "Turnkey Installations", description: "7-step rapid pit digging and grounding workflow" },
      ],
    },
  ]);

  const [seo, setSeo] = useState<SEOData>({
    title: "FORECAST EARTHINGS PVT. LTD. | Enterprise Earthing Solutions",
    description: "Leading manufacturer of GI, Copper Bonded & Pure Copper Earthing Electrodes & ESE Arresters.",
  });

  useEffect(() => {
    if (pageData) {
      if (pageData.sections) {
        const heroSec = pageData.sections.find((s) => s.section_type === "hero");
        if (heroSec?.content) {
          setHero((prev) => ({ ...prev, ...heroSec.content }));
        }
        setSections(pageData.sections.filter((s) => s.section_type !== "hero"));
      }
      if (pageData.seo) {
        setSeo(pageData.seo);
      }
    }
  }, [pageData]);

  const handleSave = async (isPublish = false) => {
    try {
      const allSections: PageSection[] = [
        {
          id: "hero-section",
          section_type: "hero",
          title: hero.title,
          enabled: true,
          display_order: 0,
          content: hero as any,
        },
        ...sections,
      ];

      const pageId = pageData?.id || "home";
      await updatePage({
        id: pageId,
        data: {
          title: "Home",
          slug: "home",
          sections: allSections,
          seo,
          status: isPublish ? "published" : "draft",
        },
      });

      if (isPublish) {
        await publishPage(pageId);
        toast("Homepage published live successfully!");
      } else {
        toast("Homepage draft saved successfully!");
      }
    } catch (err: any) {
      toast(err.message || "Failed to save homepage CMS", "error");
    }
  };

  const publicSiteUrl = process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link href="/pages">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Pages List
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-navy-950">Homepage Visual CMS Editor</h2>
            <p className="text-xs text-navy-500 font-medium">
              Configure hero section, trust indicators, why choose us, and SEO.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={publicSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-navy-500" /> Preview Home
          </a>
          <Button variant="outline" onClick={() => handleSave(false)} isLoading={isUpdating}>
            <Save className="mr-1.5 h-4 w-4" /> Save Draft
          </Button>
          <Button variant="primary" onClick={() => handleSave(true)} isLoading={isUpdating || isPublishing}>
            <Globe className="mr-1.5 h-4 w-4" /> Publish Live
          </Button>
        </div>
      </div>

      {/* Editor Blocks */}
      <div className="space-y-8">
        <HeroEditor hero={hero} onChange={setHero} />

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">Page Content Sections</h3>
          {sections.map((sec, idx) => (
            <SectionEditor
              key={sec.id || idx}
              section={sec}
              onChange={(updated) => {
                const next = [...sections];
                next[idx] = updated;
                setSections(next);
              }}
            />
          ))}
        </div>

        <SEOEditor seo={seo} onChange={setSeo} />
      </div>
    </div>
  );
}
