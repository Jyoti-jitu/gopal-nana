"use client";

import React, { useState } from "react";
import { useOffices, useOfficeMutations } from "../../../hooks/useOffices";
import { Office } from "../../../lib/types/office";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { TableSkeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { Building2, Plus, Edit2, Trash2, MapPin } from "lucide-react";

export default function OfficesPage() {
  const { toast } = useToast();
  const { data: offices = [], isLoading } = useOffices();
  const { createOffice, updateOffice, deleteOffice, isCreating, isUpdating } = useOfficeMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [name, setName] = useState("");
  const [officeType, setOfficeType] = useState<"corporate" | "regional" | "branch">("corporate");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingOffice(null);
    setName("");
    setOfficeType("corporate");
    setAddress("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("India");
    setPhone("");
    setEmail("");
    setMapUrl("");
    setModalOpen(true);
  };

  const handleOpenEdit = (off: Office) => {
    setEditingOffice(off);
    setName(off.name);
    setOfficeType(off.office_type);
    setAddress(off.address);
    setCity(off.city);
    setState(off.state);
    setPostalCode(off.postal_code);
    setCountry(off.country || "India");
    setPhone(off.phones?.[0] || "");
    setEmail(off.emails?.[0] || "");
    setMapUrl(off.map_url || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Partial<Office> = {
      name: name.trim(),
      office_type: officeType,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country.trim(),
      phones: phone ? [phone.trim()] : [],
      emails: email ? [email.trim()] : [],
      map_url: mapUrl.trim(),
      enabled: true,
      display_order: 1,
    };

    try {
      if (editingOffice) {
        await updateOffice({ id: editingOffice.id, data: payload });
        toast("Office updated successfully");
      } else {
        await createOffice(payload);
        toast("Office created successfully");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast(err.message || "Failed to save office", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteOffice(deleteTargetId);
      toast("Office record deleted");
      setDeleteTargetId(null);
    } catch (err: any) {
      toast(err.message || "Failed to delete office", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy-950">Office Locations</h2>
        <TableSkeleton rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-navy-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Office Locations Management</h2>
          <p className="text-xs text-navy-500 font-medium">
            Manage Corporate HQ and Regional Branches displayed on the Contact page.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Office
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offices.map((off) => (
          <div key={off.id} className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-navy-100 pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-brand" />
                <h3 className="text-sm font-bold text-navy-950">{off.name}</h3>
              </div>
              <span className="rounded bg-navy-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy-800">
                {off.office_type}
              </span>
            </div>

            <div className="text-xs text-navy-600 space-y-1">
              <p className="flex items-start">
                <MapPin className="h-4 w-4 mr-1.5 text-navy-400 flex-shrink-0 mt-0.5" />
                <span>
                  {off.address}, {off.city}, {off.state} - {off.postal_code}
                </span>
              </p>
              <p>Phones: {off.phones?.join(", ") || "—"}</p>
              <p>Email: {off.emails?.join(", ") || "—"}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-navy-100">
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(off)}>
                <Edit2 className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setDeleteTargetId(off.id)} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOffice ? "Edit Office" : "Add Office Location"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Office Full Name *"
            placeholder="e.g. FORECAST EARTHINGS PVT. LTD. - Corporate HQ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Office Type"
            value={officeType}
            onChange={(e) => setOfficeType(e.target.value as any)}
            options={[
              { label: "Corporate HQ", value: "corporate" },
              { label: "Regional Office", value: "regional" },
              { label: "Branch Office", value: "branch" },
            ]}
          />

          <Input
            label="Street Address *"
            placeholder="Plot No. 799(P), Shyampur..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input label="City *" value={city} onChange={(e) => setCity(e.target.value)} required />
            <Input label="State *" value={state} onChange={(e) => setState(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Input label="Google Maps Link URL" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} />

          <div className="flex justify-end space-x-2 pt-4 border-t border-navy-100">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating || isUpdating}>
              Save Office
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Office"
        message="Are you sure you want to delete this office location?"
      />
    </div>
  );
}
