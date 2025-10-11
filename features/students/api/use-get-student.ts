import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Student } from "@/lib/types";

export const useGetStudent = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["student", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Student id is required");
      }

      const student = await apiFetch<Student>(`/students/${id}`);
      return student;
    },
  });
};
