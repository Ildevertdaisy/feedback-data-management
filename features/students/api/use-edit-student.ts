import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Student } from "@/lib/types";
import { StudentSubmitValues } from "@/features/students/components/student-form";

export const useEditStudent = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, StudentSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Student id is required");
      }

      const student = await apiFetch<Student>(`/students/${id}`, {
        method: "PUT",
        body: JSON.stringify(json),
      });

      return student;
    },
    onSuccess: () => {
      toast.success("Étudiant mis à jour");
      queryClient.invalidateQueries({ queryKey: ["student", { id }] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour l'étudiant");
    },
  });
};
