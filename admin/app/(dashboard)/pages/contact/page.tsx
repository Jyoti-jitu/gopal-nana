"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEOEditor } from "../../../../components/pages/SEOEditor";
import { Button } from "../../../../components/ui/Button";
import { SEOData } from "../../../../lib/types/product";
import { Eye, ArrowLeft, Building2 } from "lucide-react";

export default function ContactPageCMSEditor() {
  const [seo, setSeo] = useState<SEOData>({
    title: "Contact Us | Forecast Earthings Pvt. Ltd.",
    description: "Get in touch with our electrical engineering team.",
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
          <h2 className="text-xl font-bold text-navy-950">Contact Page CMS</h2>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={`${publicSiteUrl}/contact`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-navy-500" /> Preview Contact Page
          </a>
          <Link href="/offices">
            <Button variant="primary">
              <Building2 className="mr-1.5 h-4 w-4" /> Manage Corporate Offices
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
