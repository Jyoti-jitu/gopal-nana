export type UserRole = "super_admin" | "admin" | "editor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
