import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";
import { getFruitStatusLabel } from "@/features/fruits/constants";

export const useGetRentreeChatguis = (rentreeId?: number | null) => {
  return useQuery({
    queryKey: ["rentree-chatguis", rentreeId ?? null],
    enabled: typeof rentreeId === "number",
    queryFn: async () => {
      if (typeof rentreeId !== "number") {
        return [] as Fruit[];
      }

      const fruits = await apiFetch<Fruit[]>(`/rentrees/${rentreeId}/chatguis`);

      return fruits.map((fruit) => ({
        ...fruit,
        statusLabel: getFruitStatusLabel(fruit.status),
      }));
    },
    placeholderData: (previousData) => previousData ?? [],
  });
};
