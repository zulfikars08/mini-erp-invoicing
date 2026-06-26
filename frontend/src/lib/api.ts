import { getToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';

type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = options.auth === false ? null : getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `Request failed: ${res.status}`);
  return data as T;
}

export const formatIdr = (value: string | number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value));
export const fmtDate = (value: string) => new Intl.DateTimeFormat('id-ID').format(new Date(value));
