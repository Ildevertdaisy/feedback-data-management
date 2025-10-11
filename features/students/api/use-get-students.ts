import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Student } from "@/lib/types";

export const useGetStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const students = await apiFetch<Student[]>("/students");
      return students;
    },
  });
};
