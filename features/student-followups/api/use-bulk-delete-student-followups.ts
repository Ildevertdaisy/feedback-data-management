import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

type BulkDeletePayload = {
  ids: number[];
};

export const useBulkDeleteStudentFollowups = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, BulkDeletePayload>({
    mutationFn: async ({ ids }) => {
      await Promise.all(
        ids.map((followupId) =>
          apiFetch(`/student-followups/${followupId}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Suivis étudiants supprimés");
      queryClient.invalidateQueries({ queryKey: ["student-followups"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer les suivis sélectionnés");
    },
  });
};
