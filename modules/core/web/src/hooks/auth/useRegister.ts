import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Csrf,
  newSessionSchema,
  Register,
  Account,
} from "@lifeos/core-schemas";
import { api } from "@/lib/config";
import { useCsrfMutation } from "../http/useCsrfMutation";
import { CsrfQueryKey } from "./useCsrf";
import { fetchWithCsrf } from "../http/fetchWithCsrf";
import { UseFormSetError } from "react-hook-form";

export function useRegister({
  setFormError,
}: {
  setFormError: UseFormSetError<Register>;
}) {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useCsrfMutation({
    mutationFn: async (csrf: string, payload: Register) => {
      const response = await fetchWithCsrf(`${api.baseUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        csrf,
      });

      if (!response.ok) {
        throw new Error("error registering user");
      }

      const data = await response.json();

      const session = newSessionSchema.parse(data);

      return session;
    },
    onSuccess: (session) => {
      queryClient.setQueryData<Csrf>([CsrfQueryKey], session.csrf);
      queryClient.setQueriesData<Account>(
        { queryKey: ["me"] },
        session.account,
      );

      router.push("/");
    },
    onError: () => {
      setFormError("email", {
        message: "woah",
      });
    },
  });

  return { ...mutation, register: mutation.mutate };
}
