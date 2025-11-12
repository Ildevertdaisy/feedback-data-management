import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Rentree } from "@/lib/types";

const sortRentrees = (rentrees: Rentree[]) => {
  return [...rentrees].sort((a, b) => {
    const dateA = new Date(a.date_rentree).getTime();
    const dateB = new Date(b.date_rentree).getTime();

    return dateB - dateA;
  });
};

export const useGetRentrees = () => {
  return useQuery({
    queryKey: ["rentrees"],
    queryFn: async () => {
      const rentrees = await apiFetch<Rentree[]>("/rentrees");
      return sortRentrees(rentrees);
    },
  });
};
