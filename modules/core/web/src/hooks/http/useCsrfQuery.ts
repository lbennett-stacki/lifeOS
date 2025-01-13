import {
  QueryFunctionContext,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useCsrf } from "../auth/useCsrf";

export function useCsrfQuery<D, E, D2>({
  enabled,
  queryFn,
  queryKey,
  ...options
}: Omit<UseQueryOptions<D, E, D2>, "queryFn"> & {
  queryFn: (csrf: string, context: QueryFunctionContext) => D | Promise<D>;
}) {
  const { data: csrf } = useCsrf();

  const query = useQuery<D, E, D2>({
    ...options,
    enabled: enabled && typeof csrf === "string",
    queryKey: [...queryKey, csrf],
    queryFn: (context) => {
      if (!csrf) {
        throw new Error("no csrf token for query");
      }
      return queryFn(csrf, context);
    },
  });

  return query;
}
