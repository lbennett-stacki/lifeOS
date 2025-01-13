export function fetchWithCsrf(
  url: string | URL,
  { csrf, ...options }: Omit<RequestInit, "credentials"> & { csrf: string },
) {
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "X-Csrf-Token": csrf,
    },
    credentials: "same-origin",
  });
}
