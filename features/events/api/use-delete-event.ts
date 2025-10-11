import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const useDeleteEvent = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Event id is required");
      }

      await apiFetch(`/events/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Évènement supprimé");
      queryClient.invalidateQueries({ queryKey: ["event", { id }] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer l'évènement");
    },
  });
};
