import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const useDeleteStudentFollowup = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      await apiFetch(`/student-followups/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Suivi étudiant supprimé");
      queryClient.invalidateQueries({ queryKey: ["student-followups"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer le suivi");
    },
  });
};
