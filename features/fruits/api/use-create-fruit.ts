import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";
import { FruitSubmitValues } from "@/features/fruits/components/fruit-form";

export const useCreateFruit = () => {
  const queryClient = useQueryClient();

  return useMutation<Fruit, Error, FruitSubmitValues>({
    mutationFn: async (json) => {
      const fruit = await apiFetch<Fruit>("/fruits", {
        method: "POST",
        body: JSON.stringify(json),
      });

      return fruit;
    },
    onSuccess: () => {
      toast.success("Fruit créé");
      queryClient.invalidateQueries({ queryKey: ["fruits"] });
    },
    onError: () => {
      toast.error("Impossible de créer le fruit");
    },
  });
};
