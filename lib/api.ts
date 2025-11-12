const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type FetchOptions = RequestInit & {
  searchParams?: Record<string, string | number | boolean | null | undefined>;
};

export const buildApiUrl = (
  path: string,
  searchParams?: FetchOptions["searchParams"],
) => {
  const url = new URL(path, API_BASE_URL);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
};

export async function apiFetch<T>(
  path: string,
  { searchParams, headers, ...init }: FetchOptions = {},
): Promise<T> {
  const url = buildApiUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `Request to ${path} failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return undefined as T;
}
