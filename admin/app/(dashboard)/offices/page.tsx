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
import { Building2, Plus, Edit2, Trash2, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

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

  const defaultOffices: Office[] = [
    {
      id: "off-1",
      name: "Corporate Office (Headquarters)",
      office_type: "corporate",
      address: "Plot No. 799(P), Shyampur, Near SUM Hospital",
      city: "Bhubaneswar",
      state: "Odisha",
      postal_code: "751003",
      country: "India",
      phones: ["+91 7978208852", "+91 9658264263"],
      emails: ["sales@forecastearthings.com"],
      map_url: "https://maps.google.com",
      is_primary: true,
      enabled: true,
      display_order: 1,
    },
    {
      id: "off-2",
      name: "Regional Branch Office",
      office_type: "regional",
      address: "Aina Seeni, Near Vidhan Sabha, Ring Road No. 3",
      city: "Raipur",
      state: "Chhattisgarh",
      postal_code: "492101",
      country: "India",
      phones: ["+91 7978208852", "+91 9658264263"],
      emails: ["sales@forecastearthings.com"],
      map_url: "https://maps.google.com",
      is_primary: false,
      enabled: true,
      display_order: 2,
    },
  ];

  const displayOffices = offices.length > 0 ? offices : defaultOffices;

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
        <h2 className="text-lg font-bold text-slate-900">Office Locations</h2>
        <TableSkeleton rows={2} cols={2} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header matching Screen 8 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Office Information</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage company offices and contact details
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Office
        </Button>
      </div>

      {/* Office Cards matching Screen 8 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayOffices.map((off) => {
          const isPrimary = off.office_type === "corporate";
          return (
            <div
              key={off.id}
              className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">{off.name}</h3>
                  {isPrimary && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>
                      {off.address}, {off.city} - {off.postal_code}, {off.state}, {off.country}
                    </span>
                  </div>

                  {off.phones && off.phones.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="font-mono text-slate-700">{off.phones.join("   ")}</span>
                    </div>
                  )}

                  {off.emails && off.emails.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-[#0062E3] font-medium">{off.emails.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions matching Screen 8: View on Map, Edit */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <a
                    href={off.map_url || "https://maps.google.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#0062E3]" /> View on Map
                  </a>

                  <button
                    onClick={() => handleOpenEdit(off)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-slate-400" /> Edit
                  </button>
                </div>

                <button
                  onClick={() => setDeleteTargetId(off.id)}
                  className="inline-flex p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Office"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingOffice ? "Edit Office" : "Add Office Location"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Office Full Name *"
            placeholder="e.g. Corporate Office (Headquarters)"
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

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
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
