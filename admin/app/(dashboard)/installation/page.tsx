"use client";

import React, { useState } from "react";
import { useInstallation, useInstallationMutations } from "../../../hooks/useInstallation";
import { InstallationStep } from "../../../lib/api/installation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Wrench, Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";

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
        <h2 className="text-lg font-bold text-navy-950">Installation Workflow Management</h2>
        <TableSkeleton rows={7} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">7-Step Installation Workflow</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage interactive installation steps shown on the public site.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Step
        </Button>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {steps.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Installation Steps Defined</h3>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
              <tr>
                <th className="py-3 px-4">Step #</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Enabled</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
              {steps.map((st) => (
                <tr key={st.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand font-mono">Step {st.step_number}</td>
                  <td className="py-3 px-4 font-bold text-navy-950">{st.title}</td>
                  <td className="py-3 px-4 text-navy-600 max-w-xs truncate">{st.description}</td>
                  <td className="py-3 px-4">
                    {st.enabled ? (
                      <span className="inline-flex items-center text-emerald-700 font-semibold">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-500 font-semibold">
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleOpenEdit(st)}
                      className="inline-flex p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(st.id)}
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Step instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-navy-300 p-2 text-xs focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="enabled"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-navy-300 text-brand"
            />
            <label htmlFor="enabled" className="text-xs font-semibold text-navy-800">
              Enable step on public website
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-navy-100">
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
