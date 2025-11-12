import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";

const deleteRentree = async (id: number) => {
  await apiFetch<void>(`/rentrees/${id}`, { method: "DELETE" });
};

type BulkDeleteInput = {
  ids: number[];
};

export const useBulkDeleteRentrees = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkDeleteInput>({
    mutationFn: async ({ ids }) => {
      await Promise.all(ids.map(deleteRentree));
    },
    onSuccess: () => {
      toast.success("Rentrées supprimées");
      queryClient.invalidateQueries({ queryKey: ["rentrees"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-dashboards"] });
      queryClient.invalidateQueries({ queryKey: ["rentree-chatguis"] });
    },
    onError: () => {
      toast.error("Impossible de supprimer les rentrées sélectionnées");
    },
  });
};
