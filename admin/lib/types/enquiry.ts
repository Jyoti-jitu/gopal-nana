export type EnquiryStatus = "new" | "contacted" | "in_progress" | "resolved" | "spam";

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  product?: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
