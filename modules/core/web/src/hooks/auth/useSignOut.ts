import { useRouter } from "next/navigation";
import { useMe } from "./useMe";
import { api } from "@/lib/config";
import { useCsrfMutation } from "../http/useCsrfMutation";
import { fetchWithCsrf } from "../http/fetchWithCsrf";

export function useSignOut() {
  const { refetch: refetchMe } = useMe();
  const router = useRouter();

  const onDone = async () => {
    await refetchMe();
    router.push("/sign-in");
  };

  const mutation = useCsrfMutation({
    mutationFn: async (csrf: string) => {
      const response = await fetchWithCsrf(`${api.baseUrl}/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        csrf,
      });

      if (!response.ok) {
        throw new Error("error signing out");
      }

      return true;
    },
    onSuccess: async () => {
      onDone();
    },
    onError: async () => {
      onDone();
    },
  });

  return { ...mutation, signOut: mutation.mutate };
}
