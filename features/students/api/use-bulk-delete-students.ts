import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

type BulkDeletePayload = {
  ids: number[];
};

export const useBulkDeleteStudents = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, BulkDeletePayload>({
    mutationFn: async ({ ids }) => {
      await Promise.all(
        ids.map((id) =>
          apiFetch(`/students/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Étudiants supprimés");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer les étudiants sélectionnés");
    },
  });
};
