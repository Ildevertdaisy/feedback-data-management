import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { fetchStudentFirstname } from "@/lib/student-utils";
import { StudentFollowup } from "@/lib/types";

export const useGetStudentFollowup = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["student-followup", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      const followup = await apiFetch<StudentFollowup>(`/student-followups/${id}`);
      const studentFirstname =
        typeof followup.student_id === "number"
          ? await fetchStudentFirstname(followup.student_id)
          : null;

      return {
        ...followup,
        studentFirstname,
      };
    },
  });
};
