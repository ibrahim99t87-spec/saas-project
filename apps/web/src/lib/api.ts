const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      request<{ token: string; user: { id: string; email: string } }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: { id: string; email: string } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    me: () =>
      request<{ user: { id: string; email: string; name: string | null } }>('/api/auth/me'),
  },
  organizations: {
    list: () =>
      request<{ organizations: Array<{ id: string; name: string; slug: string; role: string }> }>(
        '/api/organizations'
      ),
    create: (data: { name: string; slug: string }) =>
      request<{ organization: { id: string; name: string; slug: string } }>('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
