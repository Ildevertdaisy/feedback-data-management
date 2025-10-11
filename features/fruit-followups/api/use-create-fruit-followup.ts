import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { FruitFollowup } from "@/lib/types";
import { FruitFollowupSubmitValues } from "@/features/fruit-followups/components/fruit-followup-form";

export const useCreateFruitFollowup = () => {
  const queryClient = useQueryClient();

  return useMutation<FruitFollowup, Error, FruitFollowupSubmitValues>({
    mutationFn: async (json) => {
      const followup = await apiFetch<FruitFollowup>("/fruits-followups", {
        method: "POST",
        body: JSON.stringify(json),
      });

      return followup;
    },
    onSuccess: () => {
      toast.success("Suivi fruit créé");
      queryClient.invalidateQueries({ queryKey: ["fruit-followups"] });
    },
    onError: () => {
      toast.error("Impossible de créer le suivi fruit");
    },
  });
};
