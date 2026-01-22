const isServer = typeof window === 'undefined';
const origin = isServer
  ? (process.env.NEXT_PUBLIC_API_ORIGIN || `http://localhost:${process.env.API_PORT || process.env.PORT || 3000}`)
  : '';
export const API_BASE = `${origin}/api/v1`;

async function handle<T>(res: Response): Promise<T | null> {
  if (!res.ok) {
    return null;
  }
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { cache: 'no-store', ...init });
    return await handle<T>(res);
  } catch {
    return null;
  }
}

export type LiveNowNext = {
  live: null | { program_id: number; name: string; slug: string; start_time: string; end_time: string; timezone: string };
  next: null | { program_id: number; name: string; slug: string; start_time: string; end_time: string; timezone: string; starts_in_ms: number };
};
