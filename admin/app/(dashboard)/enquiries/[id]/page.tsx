"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEnquiry, useEnquiryMutations } from "../../../../hooks/useEnquiries";
import { EnquiryStatus } from "../../../../lib/types/enquiry";
import { StatusBadge } from "../../../../components/ui/StatusBadge";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { useToast } from "../../../../components/ui/Toast";
import { ArrowLeft, Mail, Phone, Building, Calendar, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EnquiryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();
  const { data: enquiry, isLoading } = useEnquiry(id);
  const { updateStatus, deleteEnquiry, isUpdatingStatus } = useEnquiryMutations();

  const [status, setStatus] = useState<EnquiryStatus>("new");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status);
      setNotes(enquiry.notes || "");
    }
  }, [enquiry]);

  const handleSaveStatus = async () => {
    try {
      await updateStatus({ id, status, notes });
      toast("Enquiry status updated");
    } catch (err: any) {
      toast(err.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this enquiry record?")) return;
    try {
      await deleteEnquiry(id);
      toast("Enquiry record deleted");
      router.push("/enquiries");
    } catch (err: any) {
      toast(err.message || "Failed to delete", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <h3 className="text-sm font-bold">Enquiry Not Found</h3>
        <Link href="/enquiries" className="mt-2 inline-block text-xs underline font-semibold">
          Return to Enquiries List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link href="/enquiries">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Enquiries
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-navy-950">Enquiry #{enquiry.id.slice(-6)}</h2>
          <StatusBadge status={enquiry.status} />
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Delete Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information & Message */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Customer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-navy-400">Full Name</p>
                <p className="text-sm font-bold text-navy-950">{enquiry.name}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-navy-400">Company Name</p>
                <p className="text-sm font-semibold text-navy-800 flex items-center">
                  <Building className="mr-1.5 h-3.5 w-3.5 text-navy-500" />
                  {enquiry.company || "—"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-navy-400">Email Address</p>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-sm font-semibold text-brand hover:underline flex items-center"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5 text-brand" />
                  {enquiry.email}
                </a>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-navy-400">Phone Number</p>
                <a
                  href={`tel:${enquiry.phone}`}
                  className="text-sm font-semibold text-navy-900 flex items-center font-mono"
                >
                  <Phone className="mr-1.5 h-3.5 w-3.5 text-navy-500" />
                  {enquiry.phone}
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs text-navy-500">
              <span className="flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-navy-400" /> Submitted on:{" "}
                {new Date(enquiry.created_at).toLocaleString()}
              </span>
              {enquiry.product && (
                <span className="font-semibold text-brand">Target Product: {enquiry.product}</span>
              )}
            </div>
          </div>

          {/* Enquiry Message Content */}
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Message Payload / Subject
            </h3>
            {enquiry.subject && (
              <p className="text-xs font-bold text-navy-800">Subject: {enquiry.subject}</p>
            )}
            <div className="rounded-lg bg-navy-50 p-4 border border-navy-100 text-xs leading-relaxed text-navy-900 font-medium whitespace-pre-wrap">
              {enquiry.message}
            </div>
          </div>
        </div>

        {/* Sidebar Status Update */}
        <div className="space-y-6">
          <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 border-b border-navy-100 pb-2">
              Status & Internal Notes
            </h3>

            <Select
              label="Lead Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
              options={[
                { label: "New Lead", value: "new" },
                { label: "Contacted Customer", value: "contacted" },
                { label: "Work In Progress", value: "in_progress" },
                { label: "Resolved Lead", value: "resolved" },
                { label: "Spam / Junk", value: "spam" },
              ]}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
                Internal CRM Notes
              </label>
              <textarea
                rows={4}
                placeholder="Log phone discussion or quote details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded border border-navy-300 p-2 text-xs focus:outline-none text-navy-900"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleSaveStatus}
              isLoading={isUpdatingStatus}
              className="w-full"
            >
              <Save className="mr-1.5 h-4 w-4" /> Save Status & Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
