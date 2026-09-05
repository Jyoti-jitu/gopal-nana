import { UserRole } from "../types/auth";

export type AdminResource =
  | "dashboard"
  | "products"
  | "categories"
  | "pages"
  | "installation"
  | "media"
  | "enquiries"
  | "testimonials"
  | "offices"
  | "navigation"
  | "settings"
  | "users"
  | "audit-logs";

const ROLE_PERMISSIONS: Record<UserRole, AdminResource[]> = {
  super_admin: [
    "dashboard",
    "products",
    "categories",
    "pages",
    "installation",
    "media",
    "enquiries",
    "testimonials",
    "offices",
    "navigation",
    "settings",
    "users",
    "audit-logs",
  ],
  admin: [
    "dashboard",
    "products",
    "categories",
    "pages",
    "installation",
    "media",
    "enquiries",
    "testimonials",
    "offices",
    "navigation",
    "settings",
  ],
  editor: [
    "dashboard",
    "products",
    "categories",
    "pages",
    "installation",
    "media",
    "testimonials",
  ],
};

export function canAccessResource(role: UserRole | undefined, resource: AdminResource): boolean {
  if (!role) return false;
  const allowed = ROLE_PERMISSIONS[role];
  return allowed ? allowed.includes(resource) : false;
}
