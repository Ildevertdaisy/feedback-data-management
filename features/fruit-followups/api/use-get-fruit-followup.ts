import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { fetchFruitFirstname } from "@/lib/fruit-utils";
import { fetchStudentFirstname } from "@/lib/student-utils";
import { FruitFollowup } from "@/lib/types";

export const useGetFruitFollowup = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["fruit-followup", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      const followup = await apiFetch<FruitFollowup>(`/fruits-followups/${id}`);

      const [fruitFirstname, studentFirstname] = await Promise.all([
        typeof followup.fruit_id === "number"
          ? fetchFruitFirstname(followup.fruit_id)
          : Promise.resolve(null),
        typeof followup.student_id === "number"
          ? fetchStudentFirstname(followup.student_id)
          : Promise.resolve(null),
      ]);

      return {
        ...followup,
        fruitFirstname,
        studentFirstname,
      };
    },
  });
};
