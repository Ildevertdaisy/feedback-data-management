import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";
import { getFruitStatusLabel } from "@/features/fruits/constants";

export const useGetFruit = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["fruit", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Fruit id is required");
      }

      const fruit = await apiFetch<Fruit>(`/fruits/${id}`);
      return {
        ...fruit,
        statusLabel: getFruitStatusLabel(fruit.status),
      };
    },
  });
};
