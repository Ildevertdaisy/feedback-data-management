import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";

export const useGetFruits = () => {
  return useQuery({
    queryKey: ["fruits"],
    queryFn: async () => {
      const fruits = await apiFetch<Fruit[]>("/fruits");
      return fruits;
    },
  });
};
