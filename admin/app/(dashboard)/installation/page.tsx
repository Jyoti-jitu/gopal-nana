"use client";

import React, { useState } from "react";
import { useInstallation, useInstallationMutations } from "../../../hooks/useInstallation";
import { InstallationStep } from "../../../lib/api/installation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { StatusBadge } from "../../../components/ui/StatusBadge";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Wrench, Plus, Edit2, Trash2 } from "lucide-react";
import { getCloudinaryUrl } from "@/lib/cloudinary";

export default function InstallationStepsPage() {
  const { toast } = useToast();
  const { data: steps = [], isLoading } = useInstallation();
  const { createStep, updateStep, deleteStep, isCreating, isUpdating } = useInstallationMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<InstallationStep | null>(null);
  const [stepNumber, setStepNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const defaultStepImages: Record<number, string> = {
    1: getCloudinaryUrl("/images/installation/step1.jpg"),
    2: getCloudinaryUrl("/images/installation/step2.jpg"),
    3: getCloudinaryUrl("/images/installation/step3.jpg"),
    4: getCloudinaryUrl("/images/installation/step4.jpg"),
    5: getCloudinaryUrl("/images/installation/step5.jpg"),
    6: getCloudinaryUrl("/images/installation/step6.jpg"),
    7: getCloudinaryUrl("/images/installation/step7.jpg"),
  };

  const handleOpenCreate = () => {
    setEditingStep(null);
    setStepNumber(steps.length + 1);
    setTitle("");
    setDescription("");
    setEnabled(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (step: InstallationStep) => {
    setEditingStep(step);
    setStepNumber(step.step_number);
    setTitle(step.title);
    setDescription(step.description);
    setEnabled(step.enabled);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingStep) {
        await updateStep({
          id: editingStep.id,
          data: { step_number: stepNumber, title: title.trim(), description: description.trim(), enabled },
        });
        toast("Installation step updated!");
      } else {
        await createStep({
          step_number: stepNumber,
          title: title.trim(),
          description: description.trim(),
          enabled,
          display_order: stepNumber,
        });
        toast("Installation step created!");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to save step", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteStep(deleteTargetId);
      toast("Installation step deleted");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete step", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Installation Steps</h2>
        <TableSkeleton rows={7} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching Screen 11/7 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Installation Steps</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage 7-step installation process
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Step
        </Button>
      </div>

      {/* Table matching Screen 11/7 */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {steps.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No Installation Steps Defined</h3>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
              {steps.map((st, index) => {
                const stepImg = (st as any).image || defaultStepImages[st.step_number] || `/images/installation/step${(index % 7) + 1}.jpg`;
                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{st.step_number}</td>
                    <td className="py-3 px-4">
                      <div className="h-10 w-10 rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={stepImg} alt={st.title} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.title}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={st.enabled ? "published" : "draft"} />
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{st.step_number}</td>
                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(st)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Edit2 className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(st.id)}
                        className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Step"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStep ? `Edit Step #${stepNumber}` : "Add Installation Step"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Step Number"
            type="number"
            value={stepNumber}
            onChange={(e) => setStepNumber(Number(e.target.value))}
            required
          />
          <Input
            label="Step Title *"
            placeholder="e.g. Dig a Hole with Auger"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Step instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:border-brand focus:ring-2 focus:ring-brand/10 outline-none"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand"
            />
            <label htmlFor="enabled" className="text-xs font-semibold text-slate-800">
              Enable step on public website
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              Save Step
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Installation Step"
        message="Are you sure you want to delete this installation step?"
      />
    </div>
  );
}
