export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "UNPUBLISH" | "LOGIN" | "UPLOAD";

export interface AuditLog {
  id: string;
  timestamp: string;
  user_email: string;
  user_name?: string;
  action: AuditAction;
  entity: string;
  entity_id?: string;
  ip_address?: string;
  details?: Record<string, any>;
}
