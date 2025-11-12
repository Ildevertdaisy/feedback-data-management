import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Rentree } from "@/lib/types";
import { RentreeSubmitValues } from "@/features/rentrees/components/rentree-form";

const buildPayload = (values: RentreeSubmitValues) => ({
  date_rentree: values.date_rentree,
  date_debut_chatgui: values.date_debut_chatgui,
  date_fin_chatgui: values.date_fin_chatgui,
  nom_rentree: values.nom_rentree,
  description: values.description,
});

export const useEditRentree = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<Rentree, Error, RentreeSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Rentree id is required");
      }

      const rentree = await apiFetch<Rentree>(`/rentrees/${id}`, {
        method: "PUT",
        body: JSON.stringify(buildPayload(json)),
      });

      return rentree;
    },
    onSuccess: () => {
      toast.success("Rentrée mise à jour");
      queryClient.invalidateQueries({ queryKey: ["rentrees"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboards"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-chatguis"] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour la rentrée");
    },
  });
};
