import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { fetchStudentFirstname } from "@/lib/student-utils";
import { Fruit } from "@/lib/types";

export const useGetFruits = () => {
  return useQuery({
    queryKey: ["fruits"],
    queryFn: async () => {
      const fruits = await apiFetch<Fruit[]>("/fruits");
      const uniqueIndos = Array.from(
        new Set(
          fruits
            .map((fruit) => fruit.indo)
            .filter((indo): indo is number => typeof indo === "number"),
        ),
      );

      const studentEntries = await Promise.all(
        uniqueIndos.map(async (indo) => [indo, await fetchStudentFirstname(indo)] as const),
      );

      const studentMap = new Map<number, string | null>(studentEntries);

      return fruits.map((fruit) => ({
        ...fruit,
        studentFirstname:
          typeof fruit.indo === "number"
            ? studentMap.get(fruit.indo) ?? null
            : null,
      }));
    },
  });
};
