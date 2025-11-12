import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

export const useDeleteRentree = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("Rentree id is required");
      }

      await apiFetch<void>(`/rentrees/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast.success("Rentrée supprimée");
      queryClient.invalidateQueries({ queryKey: ["rentrees"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboards"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-chatguis"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer la rentrée");
    },
  });
};
