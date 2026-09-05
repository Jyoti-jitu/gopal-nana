"use client";

import React, { useState } from "react";
import { useUsers, useUserMutations } from "../../../hooks/useUsers";
import { useAuth } from "../../../lib/auth/auth-context";
import { User } from "../../../lib/types/auth";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Users, Plus, Shield, Trash2, KeyRound } from "lucide-react";

export default function UsersPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const { data: users = [], isLoading } = useUsers();
  const { createUser, deleteUser, resetUserPassword, isCreating } = useUserMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  if (currentUser?.role !== "super_admin") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
        <Shield className="mx-auto h-10 w-10 text-amber-600 mb-2" />
        <h3 className="text-sm font-bold">Super Admin Restricted Module</h3>
        <p className="mt-1 text-xs">Only users with the Super Admin role are authorized to manage system user accounts.</p>
      </div>
    );
  }

  const handleOpenCreate = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    try {
      await createUser({ name: name.trim(), email: email.trim(), password, role });
      toast("Admin user account created!");
      setModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to create user", "error");
    }
  };

  const handleResetPassword = async (u: User) => {
    if (!confirm(`Reset password for ${u.email}?`)) return;
    try {
      const res = await resetUserPassword(u.id);
      alert(`Temporary Password: ${res.temporary_password || "PasswordReset2026!"}`);
    } catch (err: any) {
      toast(err.message || "Failed to reset password", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteUser(deleteTargetId);
      toast("User account deleted");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete user", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">User Account Management</h2>
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">System Users & Roles</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage authorized super admins, admins, and content editors.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Create Admin User
        </Button>
      </div>

      <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-navy-300" />
            <h3 className="mt-3 text-sm font-bold text-navy-900">No Users Found</h3>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase tracking-wider font-semibold border-b border-navy-200">
              <tr>
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-900 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-navy-50/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-navy-950">{u.name}</td>
                  <td className="py-3 px-4 font-semibold text-navy-700">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center text-emerald-700 font-semibold">Active</span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => handleResetPassword(u)}
                      className="inline-flex p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                      title="Reset Password"
                    >
                      <KeyRound className="h-4 w-4" />
                    </button>
                    {u.email !== currentUser?.email && (
                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        className="inline-flex p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Admin User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Initial Password *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Select
            label="User Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { label: "Content Editor", value: "editor" },
              { label: "Administrator", value: "admin" },
              { label: "Super Admin", value: "super_admin" },
            ]}
          />
          <div className="flex justify-end space-x-2 pt-4 border-t border-navy-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete User Account"
        message="Are you sure you want to delete this admin account?"
      />
    </div>
  );
}
