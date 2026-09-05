import { getStoredToken, removeStoredToken } from "../auth/token";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, any>;
}

export class ApiError extends Error {
  code: string;
  fields?: Record<string, string>;
  status: number;

  constructor(message: string, code: string = "API_ERROR", status: number = 400, fields?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

export async function apiClient<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, body, ...customConfig } = options;

  let url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const token = getStoredToken();
  const reqHeaders: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  if (body && !(body instanceof FormData) && !reqHeaders["Content-Type"]) {
    reqHeaders["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers: reqHeaders,
    body: body && !(body instanceof FormData) && typeof body === "object" ? JSON.stringify(body) : body,
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401) {
      removeStoredToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=1";
      }
      throw new ApiError("Session expired. Please sign in again.", "UNAUTHORIZED", 401);
    }

    const contentType = response.headers.get("content-type");
    let data: any = {};
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = data?.detail || data?.error?.message || data?.message || "An unexpected error occurred.";
      const errorCode = data?.error?.code || "REQUEST_FAILED";
      const fields = data?.error?.fields;
      throw new ApiError(errorMessage, errorCode, response.status, fields);
    }

    return data as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Network error", "NETWORK_ERROR", 500);
  }
}
