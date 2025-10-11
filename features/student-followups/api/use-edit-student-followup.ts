import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { StudentFollowup } from "@/lib/types";
import { StudentFollowupSubmitValues } from "@/features/student-followups/components/student-followup-form";

export const useEditStudentFollowup = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<StudentFollowup, Error, StudentFollowupSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      const followup = await apiFetch<StudentFollowup>(`/student-followups/${id}`, {
        method: "PUT",
        body: JSON.stringify(json),
      });

      return followup;
    },
    onSuccess: () => {
      toast.success("Suivi étudiant mis à jour");
      queryClient.invalidateQueries({ queryKey: ["student-followups"] });
      queryClient.invalidateQueries({ queryKey: ["student-followup", { id }] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour le suivi");
    },
  });
};
