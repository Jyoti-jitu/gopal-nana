export interface Office {
  id: string;
  name: string;
  office_type: "corporate" | "regional" | "branch";
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phones: string[];
  emails: string[];
  map_url?: string;
  map_embed_url?: string;
  is_primary: boolean;
  enabled: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}
