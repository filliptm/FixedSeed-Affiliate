const API_BASE = import.meta.env.VITE_API_BASE;

export type AffiliateStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
export type CommissionType = "PERCENT" | "FLAT";

export interface AffiliateMe {
  id: string;
  email: string;
  name: string | null;
  code: string | null;
  status: AffiliateStatus;
  commissionType: CommissionType;
  commissionRate: number; // basis points if PERCENT, cents if FLAT
  rejectedReason: string | null;
  createdAt: string;
  stats: {
    totalClicks: number;
    totalConversions: number;
    totalCommission: number; // cents
    conversionRate: number; // 0..1
  };
}

export interface Conversion {
  id: string;
  productSlug: string;
  amountPaid: number;
  commissionAmount: number;
  commissionType: CommissionType;
  commissionRate: number;
  paidOut: boolean;
  createdAt: string;
}

export interface ConversionsPage {
  conversions: Conversion[];
  total: number;
  page: number;
  totalPages: number;
}

async function authedFetch<T>(
  token: string,
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(opts.headers as Record<string, string>),
  };
  if (opts.body && typeof opts.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });

  if (res.status === 404 && path === "/api/affiliates/me") {
    throw new NotFoundError();
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
  }
}

export async function getMe(token: string): Promise<AffiliateMe> {
  return authedFetch(token, "/api/affiliates/me");
}

export async function applyToBeAffiliate(
  token: string,
  data: { name: string; applicationNote: string }
): Promise<AffiliateMe> {
  return authedFetch(token, "/api/affiliates/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getConversions(
  token: string,
  page = 1
): Promise<ConversionsPage> {
  return authedFetch(token, `/api/affiliates/me/conversions?page=${page}`);
}
