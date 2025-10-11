import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { Event } from "@/lib/types";

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const events = await apiFetch<Event[]>("/events");
      return events;
    },
  });
};
