import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const useDeleteFruitFollowup = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      await apiFetch(`/fruits-followups/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Suivi fruit supprimé");
      queryClient.invalidateQueries({ queryKey: ["fruit-followups"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer le suivi fruit");
    },
  });
};
