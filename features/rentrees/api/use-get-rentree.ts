import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Rentree } from "@/lib/types";

export const useGetRentree = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["rentree", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Rentree id is required");
      }

      return apiFetch<Rentree>(`/rentrees/${id}`);
    },
  });
};
