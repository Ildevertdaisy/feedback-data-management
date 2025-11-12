import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { fetchStudentFirstname } from "@/lib/student-utils";
import { Fruit, FruitStatusLabel } from "@/lib/types";
import {
  getFruitStatusLabel,
  getFruitStatusValue,
} from "@/features/fruits/constants";

type FruitFilters = {
  rentreeId?: number | null;
  studentId?: number | null;
  status?: FruitStatusLabel | null;
  dateSubaeStart?: string | null;
  dateSubaeEnd?: string | null;
};

const buildSearchParams = (filters?: FruitFilters) => {
  if (!filters) {
    return undefined;
  }

  if (filters.rentreeId) {
    return {
      student_id: filters.studentId ?? undefined,
      status: filters.status ?? undefined,
      date_subae_start: filters.dateSubaeStart ?? undefined,
      date_subae_end: filters.dateSubaeEnd ?? undefined,
    };
  }

  return {
    indo: filters.studentId ?? undefined,
    status: filters.status ? getFruitStatusValue(filters.status) ?? undefined : undefined,
  };
};

const buildQueryKey = (filters?: FruitFilters) => {
  return [
    "fruits",
    filters?.rentreeId ?? null,
    filters?.studentId ?? null,
    filters?.status ?? null,
    filters?.dateSubaeStart ?? null,
    filters?.dateSubaeEnd ?? null,
  ];
};

const shouldFetch = (filters?: FruitFilters) => {
  if (!filters || filters.rentreeId === undefined) {
    return true;
  }

  return filters.rentreeId !== null;
};

export const useGetFruits = (filters?: FruitFilters) => {
  return useQuery({
    queryKey: buildQueryKey(filters),
    enabled: shouldFetch(filters),
    queryFn: async () => {
      const path = filters?.rentreeId
        ? `/rentrees/${filters.rentreeId}/fruits`
        : "/fruits";

      const fruits = await apiFetch<Fruit[]>(path, {
        searchParams: buildSearchParams(filters),
      });

      const studentIds = Array.from(
        new Set(
          fruits
            .map((fruit) => fruit.student_evangelisateur_id ?? fruit.indo)
            .filter((id): id is number => typeof id === "number"),
        ),
      );

      const studentEntries = await Promise.all(
        studentIds.map(
          async (studentId) =>
            [studentId, await fetchStudentFirstname(studentId)] as const,
        ),
      );

      const studentMap = new Map<number, string | null>(studentEntries);

      return fruits.map((fruit) => ({
        ...fruit,
        studentFirstname:
          typeof fruit.student_evangelisateur_id === "number"
            ? studentMap.get(fruit.student_evangelisateur_id) ?? null
            : typeof fruit.indo === "number"
              ? studentMap.get(fruit.indo) ?? null
              : null,
        statusLabel: getFruitStatusLabel(fruit.status),
      }));
    },
  });
};
