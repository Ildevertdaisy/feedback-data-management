import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Event } from "@/lib/types";
import { EventSubmitValues } from "@/features/events/components/event-form";

export const useEditEvent = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, EventSubmitValues>({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Event id is required");
      }

      const event = await apiFetch<Event>(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(json),
      });

      return event;
    },
    onSuccess: () => {
      toast.success("Évènement mis à jour");
      queryClient.invalidateQueries({ queryKey: ["event", { id }] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de mettre à jour l'évènement");
    },
  });
};
