import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Fruit } from "@/lib/types";
import { FruitSubmitValues } from "@/features/fruits/components/fruit-form";

const buildPayload = (values: FruitSubmitValues) => {
  const { status_value, ...rest } = values;

  if (status_value === null || status_value === undefined) {
    return rest;
  }

  return { ...rest, status_value };
};

export const useCreateFruit = () => {
  const queryClient = useQueryClient();

  return useMutation<Fruit, Error, FruitSubmitValues>({
    mutationFn: async (json) => {
      const fruit = await apiFetch<Fruit>("/fruits", {
        method: "POST",
        body: JSON.stringify(buildPayload(json)),
      });

      return fruit;
    },
    onSuccess: () => {
      toast.success("Fruit créé");
      queryClient.invalidateQueries({ queryKey: ["fruits"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboards"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-chatguis"] });
    },
    onError: () => {
      toast.error("Impossible de créer le fruit");
    },
  });
};
