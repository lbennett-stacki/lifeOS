"use client";

import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { csrfSchema } from "@lifeos/core-schemas";
import { api } from "@/lib/config";

export const CsrfQueryKey = Symbol("CSRF_QUERY_KEY");

async function fetchCsrf() {
  const response = await fetch(`${api.baseUrl}/auth/csrf`, {
    method: "GET",
    headers: {
      "X-CSRF-Token": "fetch",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("csrf fetch failed");
  }

  const data = await response.json();

  return csrfSchema.parse(data);
}

export function useCsrf({
  retry = false,
  ...options
}: Omit<
  UseQueryOptions<unknown, unknown, string>,
  "queryKey" | "queryFn"
> = {}) {
  const query = useQuery({
    ...options,
    retry,
    queryKey: [CsrfQueryKey],
    queryFn: async () => {
      const csrf = await fetchCsrf();

      return csrf.token;
    },
  });

  const refresh = async () => {
    const result = await query.refetch();

    if (typeof result.data !== "string") {
      throw new Error("CSRF token could not refresh");
    }

    return result.data;
  };

  return { ...query, refresh };
}
