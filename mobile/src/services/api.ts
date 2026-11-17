import { API_BASE_URL } from '@/constants/api';

type ApiOptions = {
  method?: 'GET' | 'POST';
  token?: string;
  body?: Record<string, unknown>;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? 'Something went wrong. Please try again.'
    );
  }

  return data as T;
}
