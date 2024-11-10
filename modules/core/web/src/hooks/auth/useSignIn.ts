import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Csrf, SignIn, Account, newSessionSchema } from "@lifeos/core-schemas";
import { api } from "@/lib/config";
import { fetchWithCsrf } from "../http/fetchWithCsrf";
import { useCsrfMutation } from "../http/useCsrfMutation";
import { CsrfQueryKey } from "./useCsrf";

export function useSignIn() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const mutation = useCsrfMutation({
    mutationFn: async (csrf: string, payload: SignIn) => {
      const response = await fetchWithCsrf(`${api.baseUrl}/auth/sign-in`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        csrf,
      });

      if (!response.ok) {
        throw new Error("error signing in");
      }

      const data = response.json();

      const session = newSessionSchema.parse(data);

      return session;
    },
    onSuccess: async (session) => {
      queryClient.setQueryData<Csrf>([CsrfQueryKey], session.csrf);
      queryClient.setQueriesData<Account>(
        { queryKey: ["me"] },
        session.account,
      );

      router.push("/");
    },
  });

  return { ...mutation, signIn: mutation.mutate };
}
