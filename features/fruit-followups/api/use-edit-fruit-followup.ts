import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { FruitFollowup } from "@/lib/types";
import { FruitFollowupSubmitValues } from "@/features/fruit-followups/components/fruit-followup-form";

export const useEditFruitFollowup = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<FruitFollowup, Error, FruitFollowupSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Followup id is required");
      }

      const followup = await apiFetch<FruitFollowup>(`/fruits-followups/${id}`, {
        method: "PUT",
        body: JSON.stringify(json),
      });

      return followup;
    },
    onSuccess: () => {
      toast.success("Suivi fruit mis à jour");
      queryClient.invalidateQueries({ queryKey: ["fruit-followups"] });
      queryClient.invalidateQueries({ queryKey: ["fruit-followup", { id }] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour le suivi fruit");
    },
  });
};
