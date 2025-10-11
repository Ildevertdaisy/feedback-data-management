import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

type BulkDeletePayload = {
  ids: number[];
};

export const useBulkDeleteEvents = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, BulkDeletePayload>({
    mutationFn: async ({ ids }) => {
      await Promise.all(
        ids.map((id) =>
          apiFetch(`/events/${id}`, {
            method: "DELETE",
          }),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Évènements supprimés");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer les évènements sélectionnés");
    },
  });
};
