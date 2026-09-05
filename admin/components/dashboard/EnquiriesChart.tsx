"use client";

import React from "react";

export function EnquiriesChart() {
  // SVG Area Chart points matching the design in Screen 2
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Enquiries Overview</h3>
          <p className="text-xs text-slate-500">Monthly customer lead acquisition</p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0062E3]" /> Online Enquiries
          </span>
        </div>
      </div>

      <div className="mt-4 relative h-48 w-full">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0062E3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0062E3" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="150" x2="500" y2="150" stroke="#e2e8f0" strokeWidth="1" />

          {/* Area Fill */}
          <path
            d="M 0 130 C 70 120, 120 70, 180 85 C 240 100, 300 35, 360 45 C 420 55, 460 20, 500 25 L 500 150 L 0 150 Z"
            fill="url(#chartGrad)"
          />

          {/* Line Stroke */}
          <path
            d="M 0 130 C 70 120, 120 70, 180 85 C 240 100, 300 35, 360 45 C 420 55, 460 20, 500 25"
            fill="none"
            stroke="#0062E3"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points */}
          <circle cx="180" cy="85" r="4" fill="#0062E3" stroke="#ffffff" strokeWidth="2" />
          <circle cx="360" cy="45" r="4" fill="#0062E3" stroke="#ffffff" strokeWidth="2" />
          <circle cx="500" cy="25" r="5" fill="#0062E3" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* X-Axis labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-2">
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
          <span>Jan</span>
        </div>
      </div>
    </div>
  );
}
