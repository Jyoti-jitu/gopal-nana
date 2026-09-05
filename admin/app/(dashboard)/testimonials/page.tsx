"use client";

import React, { useState } from "react";
import { useTestimonials, useTestimonialMutations } from "../../../hooks/useTestimonials";
import { Testimonial } from "../../../lib/types/testimonial";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { MessageSquareQuote, Plus, Edit2, Trash2, Star } from "lucide-react";

export default function TestimonialsPage() {
  const { toast } = useToast();
  const { data: testimonials = [], isLoading } = useTestimonials();
  const { createTestimonial, updateTestimonial, deleteTestimonial, isCreating, isUpdating } = useTestimonialMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setName("");
    setDesignation("");
    setCompany("");
    setContent("");
    setRating(5);
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t);
    setName(t.name);
    setDesignation(t.designation || "");
    setCompany(t.company || "");
    setContent(t.content);
    setRating(t.rating || 5);
    setFeatured(t.featured);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const payload: Partial<Testimonial> = {
      name: name.trim(),
      designation: designation.trim() || undefined,
      company: company.trim() || undefined,
      content: content.trim(),
      rating,
      featured,
      enabled: true,
      display_order: 1,
      status: "published",
    };

    try {
      if (editingItem) {
        await updateTestimonial({ id: editingItem.id, data: payload });
        toast("Testimonial updated!");
      } else {
        await createTestimonial(payload);
        toast("Testimonial created!");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to save testimonial", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteTestimonial(deleteTargetId);
      toast("Testimonial deleted");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete testimonial", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Client Testimonials</h2>
        <TableSkeleton rows={5} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Client Reviews & Testimonials</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage client feedback published on the homepage.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquareQuote className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Testimonials Found</h3>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Company / Role</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Content</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-navy-950">{t.name}</td>
                  <td className="py-3 px-4 text-navy-600">
                    {t.designation} {t.company && `• ${t.company}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-navy-700 max-w-xs truncate">{t.content}</td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(t.id)}
                      className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Client Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
            <Input label="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
              Review Content *
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded border border-navy-300 p-2 text-xs focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <Input
              label="Rating (1-5)"
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-24"
            />

            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="feat"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-navy-300 text-brand"
              />
              <label htmlFor="feat" className="text-xs font-semibold text-navy-800">
                Feature on Home Page
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-navy-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              Save Testimonial
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
      />
    </div>
  );
}
