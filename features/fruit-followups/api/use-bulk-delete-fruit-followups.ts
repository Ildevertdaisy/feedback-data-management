import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

type BulkDeletePayload = {
  ids: number[];
};

export const useBulkDeleteFruitFollowups = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, BulkDeletePayload>({
    mutationFn: async ({ ids }) => {
      await Promise.all(
        ids.map((followupId) =>
          apiFetch(`/fruits-followups/${followupId}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Suivis fruits supprimés");
      queryClient.invalidateQueries({ queryKey: ["fruit-followups"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer les suivis fruits sélectionnés");
    },
  });
};
