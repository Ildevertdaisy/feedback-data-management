import { useQuery } from "@tanstack/react-query";

import { fetchStudentFirstname } from "@/lib/student-utils";
import { apiFetch } from "@/lib/api";
import { StudentFollowup } from "@/lib/types";

const toISOString = (date: Date) => date.toISOString();

const defaultStartDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return date;
};

export type StudentFollowupFilters = {
  studentId?: number;
  fruitName?: string;
  startDate?: Date;
  endDate?: Date;
};

const enrichWithStudent = async (followups: StudentFollowup[]) => {
  const uniqueStudentIds = Array.from(
    new Set(
      followups
        .map((item) => item.student_id)
        .filter((value): value is number => typeof value === "number"),
    ),
  );

  const entries = await Promise.all(
    uniqueStudentIds.map(async (studentId) => [
      studentId,
      await fetchStudentFirstname(studentId),
    ] as const),
  );

  const studentMap = new Map<number, string | null>(entries);

  return followups.map((item) => ({
    ...item,
    studentFirstname: studentMap.get(item.student_id) ?? null,
  }));
};

export const useGetStudentFollowups = (filters?: StudentFollowupFilters) => {
  return useQuery({
    queryKey: ["student-followups", filters],
    queryFn: async () => {
      let followups: StudentFollowup[] = [];

      if (filters?.studentId) {
        followups = await apiFetch<StudentFollowup[]>(
          `/student-followups/student/${filters.studentId}`,
        );
      } else {
        const startDate = filters?.startDate ?? defaultStartDate();
        const endDate = filters?.endDate ?? new Date();

        followups = await apiFetch<StudentFollowup[]>(
          "/student-followups/date-range",
          {
            searchParams: {
              start_date: toISOString(startDate),
              end_date: toISOString(endDate),
            },
          },
        );
      }

      if (filters?.fruitName) {
        const searchTerm = filters.fruitName.toLowerCase();
        followups = followups.filter((item) =>
          (item.fruit_name ?? "").toLowerCase().includes(searchTerm),
        );
      }

      return enrichWithStudent(followups);
    },
  });
};
