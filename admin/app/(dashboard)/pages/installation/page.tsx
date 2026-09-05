"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEOEditor } from "../../../../components/pages/SEOEditor";
import { Button } from "../../../../components/ui/Button";
import { useToast } from "../../../../components/ui/Toast";
import { SEOData } from "../../../../lib/types/product";
import { Save, Globe, Eye, ArrowLeft, Wrench } from "lucide-react";

export default function InstallationPageCMSEditor() {
  const { toast } = useToast();
  const [seo, setSeo] = useState<SEOData>({
    title: "7-Step Installation Workflow | Forecast Earthings",
    description: "Step-by-step earthing electrode installation guide.",
  });

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
          <h2 className="text-xl font-bold text-navy-950">Installation Page CMS</h2>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={`${publicSiteUrl}/installation`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-navy-500" /> Preview Installation
          </a>
          <Link href="/installation">
            <Button variant="primary">
              <Wrench className="mr-1.5 h-4 w-4" /> Manage 7-Step Workflow Data
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm">
        <SEOEditor seo={seo} onChange={setSeo} />
      </div>
    </div>
  );
}
