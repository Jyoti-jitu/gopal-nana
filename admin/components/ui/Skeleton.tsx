import React from "react";
import { clsx } from "clsx";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("animate-pulse rounded bg-navy-200/60", className)}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 w-full rounded bg-navy-100 animate-pulse" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-8 flex-1 rounded bg-navy-50 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}
