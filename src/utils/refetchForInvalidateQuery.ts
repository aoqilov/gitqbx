import { queryClient } from "@/plugin/tanstack-query/queryConfig";
import { QueryKey } from "@tanstack/react-query";

export const refetchForInvalidate = async (key: QueryKey | string) => {
  const queryKey: QueryKey = Array.isArray(key) ? key : [key];

  await queryClient.invalidateQueries({
    queryKey,
  });
};

// usage example:
// await refetchForInvalidate("todos");
// await refetchForInvalidate(["users", userId]);
