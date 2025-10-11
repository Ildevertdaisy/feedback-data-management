import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const useDeleteStudent = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Student id is required");
      }

      await apiFetch(`/students/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Étudiant supprimé");
      queryClient.invalidateQueries({ queryKey: ["student", { id }] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer l'étudiant");
    },
  });
};
