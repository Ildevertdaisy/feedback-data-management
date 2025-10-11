import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Event } from "@/lib/types";
import { EventSubmitValues } from "@/features/events/components/event-form";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation<Event, Error, EventSubmitValues>({
    mutationFn: async (json) => {
      const event = await apiFetch<Event>("/events", {
        method: "POST",
        body: JSON.stringify(json),
      });

      return event;
    },
    onSuccess: () => {
      toast.success("Évènement créé");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Impossible de créer l'évènement");
    },
  });
};
