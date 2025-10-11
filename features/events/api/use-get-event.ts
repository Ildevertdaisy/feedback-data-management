import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Event } from "@/lib/types";

export const useGetEvent = (id?: number) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["event", { id }],
    queryFn: async () => {
      if (!id) {
        throw new Error("Event id is required");
      }

      const event = await apiFetch<Event>(`/events/${id}`);
      return event;
    },
  });
};
