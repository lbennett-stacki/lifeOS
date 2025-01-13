import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useCsrf } from "../auth/useCsrf";

export function useCsrfMutation<D, E, V>({
  mutationFn,
  ...options
}: Omit<UseMutationOptions<D, E, V>, "mutationFn"> & {
  mutationFn: (csrf: string, variables: V) => Promise<D>;
}) {
  const { data: csrf } = useCsrf();

  const query = useMutation<D, E, V>({
    ...options,
    mutationFn: (context) => {
      if (!csrf) {
        throw new Error("no csrf token for mutation");
      }
      return mutationFn(csrf, context);
    },
  });

  return query;
}
