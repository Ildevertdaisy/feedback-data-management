import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Student } from "@/lib/types";
import { StudentSubmitValues } from "@/features/students/components/student-form";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, Error, StudentSubmitValues>({
    mutationFn: async (json) => {
      const student = await apiFetch<Student>("/students", {
        method: "POST",
        body: JSON.stringify(json),
      });

      return student;
    },
    onSuccess: () => {
      toast.success("Étudiant créé");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de créer l'étudiant");
    },
  });
};
