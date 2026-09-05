export interface NavigationItem {
  id?: string;
  label: string;
  url: string;
  enabled: boolean;
  display_order: number;
}

export interface NavigationMenu {
  id?: string;
  location: "header" | "footer";
  items: NavigationItem[];
  updated_at?: string;
}
