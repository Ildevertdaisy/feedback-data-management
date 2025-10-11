import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { StudentFollowup } from "@/lib/types";
import { StudentFollowupSubmitValues } from "@/features/student-followups/components/student-followup-form";

export const useCreateStudentFollowup = () => {
  const queryClient = useQueryClient();

  return useMutation<StudentFollowup, Error, StudentFollowupSubmitValues>({
    mutationFn: async (json) => {
      const followup = await apiFetch<StudentFollowup>("/student-followups", {
        method: "POST",
        body: JSON.stringify(json),
      });

      return followup;
    },
    onSuccess: () => {
      toast.success("Suivi étudiant créé");
      queryClient.invalidateQueries({ queryKey: ["student-followups"] });
    },
    onError: () => {
      toast.error("Impossible de créer le suivi");
    },
  });
};
