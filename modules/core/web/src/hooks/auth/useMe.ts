"use client";

import { UseQueryOptions } from "@tanstack/react-query";
import { Account, accountSchema } from "@lifeos/core-schemas";
import { api } from "@/lib/config";
import { useCsrfQuery } from "../http/useCsrfQuery";
import { fetchWithCsrf } from "../http/fetchWithCsrf";

async function fetchMe(csrf: string) {
  const response = await fetchWithCsrf(`${api.baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    csrf,
  });

  if (!response.ok) {
    throw new Error("error getting me");
  }

  const data = await response.json();

  return accountSchema.parse(data);
}

export function useMe(
  options: Omit<
    UseQueryOptions<unknown, Error, Account>,
    "queryKey" | "queryFn"
  > = {},
) {
  const query = useCsrfQuery({
    ...options,
    queryKey: ["me"],
    retry: options.retry ?? false,
    queryFn: async (csrf) => {
      const me = await fetchMe(csrf);

      return me;
    },
  });

  return query;
}
