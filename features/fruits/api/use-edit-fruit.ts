import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";
import { FruitSubmitValues } from "@/features/fruits/components/fruit-form";

export const useEditFruit = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<Fruit, Error, FruitSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Fruit id is required");
      }

      const fruit = await apiFetch<Fruit>(`/fruits/${id}`, {
        method: "PUT",
        body: JSON.stringify(json),
      });

      return fruit;
    },
    onSuccess: () => {
      toast.success("Fruit mis à jour");
      queryClient.invalidateQueries({ queryKey: ["fruit", { id }] });
      queryClient.invalidateQueries({ queryKey: ["fruits"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour le fruit");
    },
  });
};
