import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { fetchFruitFirstname } from "@/lib/fruit-utils";
import { fetchStudentFirstname } from "@/lib/student-utils";
import { FruitFollowup } from "@/lib/types";

export type FruitFollowupFilters = {
  fruitId?: number;
  studentId?: number;
  days?: number;
};

const enrichFollowups = async (followups: FruitFollowup[]) => {
  const uniqueFruitIds = Array.from(
    new Set(
      followups
        .map((item) => item.fruit_id)
        .filter((value): value is number => typeof value === "number"),
    ),
  );
  const uniqueStudentIds = Array.from(
    new Set(
      followups
        .map((item) => item.student_id)
        .filter((value): value is number => typeof value === "number"),
    ),
  );

  const [fruitEntries, studentEntries] = await Promise.all([
    Promise.all(
      uniqueFruitIds.map(async (fruitId) => [
        fruitId,
        await fetchFruitFirstname(fruitId),
      ] as const),
    ),
    Promise.all(
      uniqueStudentIds.map(async (studentId) => [
        studentId,
        await fetchStudentFirstname(studentId),
      ] as const),
    ),
  ]);

  const fruitMap = new Map<number, string | null>(fruitEntries);
  const studentMap = new Map<number, string | null>(studentEntries);

  return followups.map((item) => ({
    ...item,
    fruitFirstname: fruitMap.get(item.fruit_id) ?? null,
    studentFirstname: studentMap.get(item.student_id) ?? null,
  }));
};

export const useGetFruitFollowups = (filters?: FruitFollowupFilters) => {
  return useQuery({
    queryKey: ["fruit-followups", filters],
    queryFn: async () => {
      let followups: FruitFollowup[] = [];

      if (filters?.fruitId) {
        followups = await apiFetch<FruitFollowup[]>(
          `/fruits-followups/fruit/${filters.fruitId}`,
        );
      } else if (filters?.studentId) {
        followups = await apiFetch<FruitFollowup[]>(
          `/fruits-followups/student/${filters.studentId}`,
        );
      } else {
        const days = filters?.days ?? 180;

        const result = await apiFetch<FruitFollowup[]>(
          "/fruits-followups/recent",
          {
            searchParams: { days },
          },
        );

        followups = result;
      }

      if (filters?.studentId) {
        followups = followups.filter(
          (item) => item.student_id === filters.studentId,
        );
      }

      if (filters?.fruitId) {
        followups = followups.filter((item) => item.fruit_id === filters.fruitId);
      }

      return enrichFollowups(followups);
    },
  });
};
