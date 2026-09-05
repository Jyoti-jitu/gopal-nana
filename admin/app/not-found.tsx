import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 p-4 text-center text-white">
      <div className="rounded-full bg-navy-900 p-4 shadow-inner mb-4">
        <AlertCircle className="h-10 w-10 text-brand-light" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-navy-400 max-w-md">
        The requested administration page does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center rounded-md bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
