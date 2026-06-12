/**
 * Auth client for the headless WordPress auth API (oeff/v1).
 * All requests use credentials so WP session cookies are set/sent –
 * the same cookies make the embedded checkout recognize the customer.
 */

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://localhost:4001";
const API_BASE = `${WP_URL.replace(/\/$/, "")}/wp-json/oeff/v1`;

export interface AuthAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  postcode: string;
  city: string;
  country: string;
  phone?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: AuthAddress;
  shipping: AuthAddress;
}

export interface AuthOrder {
  id: number;
  number: string;
  date: string | null;
  status: string;
  status_label: string;
  total: string;
  currency: string;
  items: { name: string; quantity: number }[];
}

export class AuthApiError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AuthApiError(
      data?.code ?? "unknown",
      data?.message ?? "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    );
  }
  return data as T;
}

export async function apiLogin(login: string, password: string): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>("/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
  return data.user;
}

export async function apiRegister(params: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>("/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data.user;
}

export async function apiLogout(): Promise<void> {
  await request("/logout", { method: "POST" });
}

export async function apiMe(): Promise<AuthUser | null> {
  try {
    const data = await request<{ user: AuthUser }>("/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function apiOrders(): Promise<AuthOrder[]> {
  const data = await request<{ orders: AuthOrder[] }>("/orders");
  return data.orders;
}

export async function apiUpdateAddress(params: {
  billing?: Partial<AuthAddress>;
  shipping?: Partial<AuthAddress>;
}): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>("/address", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data.user;
}
