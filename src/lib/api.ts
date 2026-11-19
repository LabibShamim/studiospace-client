export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data as T;
}

export async function establishApiSession() {
  return apiFetch("/api/session-cookie", { method: "POST" });
}
